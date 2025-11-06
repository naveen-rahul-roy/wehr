import express from 'express';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendAccountLockedEmail, sendMfaRecoveryEmail, sendMfaVerificationCodeEmail } from '../utils/emailService.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`,
        lockedUntil: user.lockUntil
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated. Please contact HR.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock account after 5 failed attempts for 30 minutes
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await user.save();
        
        // Send account locked email
        await sendAccountLockedEmail(user.email, user.name);
        
        return res.status(423).json({ 
          message: 'Account locked due to multiple failed login attempts. Please try again in 30 minutes or use forgot password.',
          lockedUntil: user.lockUntil
        });
      }

      await user.save();
      const remainingAttempts = 5 - user.loginAttempts;
      return res.status(401).json({ 
        message: `Invalid email or password. ${remainingAttempts} attempts remaining.`,
        attemptsRemaining: remainingAttempts
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // If MFA is not setup, log user in directly
    if (!user.isMfaSetup) {
      console.log('✅ MFA not setup, logging in directly:', user.email);
      
      // AUTO-ATTENDANCE: Create attendance record for today if not exists
      try {
        const now = new Date();
        const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const employee = await Employee.findOne({ email: user.email });
        
        if (employee) {
          const existingAttendance = await Attendance.findOne({
            employeeId: employee._id,
            date: todayString
          });

          if (!existingAttendance) {
            const clockInTime = new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            });

            await Attendance.create({
              employeeId: employee._id,
              date: todayString,
              status: 'Present',
              clockIn: clockInTime,
              clockInTimestamp: now
            });

            console.log(`✅ Auto-attendance created for ${user.name} at ${clockInTime}`);
          }
        }
      } catch (attendanceError) {
        console.error('❌ Auto-attendance error:', attendanceError);
      }

      // Generate JWT token
      const token = generateToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isMfaSetup: user.isMfaSetup || false,
          mfaEnabled: user.isMfaSetup || false
        }
      });
    }

    // Return user data without token (MFA required)
    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isMfaSetup: user.isMfaSetup || false,
        mfaEnabled: user.isMfaSetup || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/mfa/setup
// @desc    Setup MFA for user
// @access  Public (but requires userId)
router.post('/mfa/setup', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `HRMS (${user.email})`,
      length: 32
    });

    // Save secret to user
    user.mfaSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({ message: 'Server error during MFA setup' });
  }
});

// @route   POST /api/auth/mfa/verify
// @desc    Verify MFA token and complete setup or login
// @access  Public (but requires userId)
router.post('/mfa/verify', async (req, res) => {
  try {
    const { userId, token, isSetup } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.mfaSecret) {
      return res.status(400).json({ message: 'MFA not set up for this user' });
    }

    // Development bypass: accept "123456" as a valid code
    let verified = false;
    if (process.env.NODE_ENV === 'development' && token === '123456') {
      console.log('⚠️ Development MFA bypass code used for', user.email);
      verified = true;
    } else {
      // Verify token
      verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2
      });
    }

    if (!verified) {
      return res.status(401).json({ message: 'Invalid MFA token' });
    }

    // If this is initial setup, mark MFA as complete
    if (isSetup) {
      user.isMfaSetup = true;
      await user.save();
    }

    // AUTO-ATTENDANCE: Create attendance record for today if not exists
    try {
      // Get today's date as string (YYYY-MM-DD) in local timezone
      const now = new Date();
      const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Find employee record for this user
      const employee = await Employee.findOne({ email: user.email });
      
      if (employee) {
        // Check if attendance already exists for today
        const existingAttendance = await Attendance.findOne({
          employeeId: employee._id,
          date: todayString
        });

        if (!existingAttendance) {
          // Create new attendance record with clock-in time and timestamp
          const clockInTime = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          });

          await Attendance.create({
            employeeId: employee._id,
            date: todayString,
            status: 'Present',
            clockIn: clockInTime,
            clockInTimestamp: now
          });

          console.log(`✅ Auto-attendance created for ${user.name} at ${clockInTime}`);
        } else {
          console.log(`ℹ️ Attendance already exists for ${user.name} today`);
        }
      }
    } catch (attendanceError) {
      console.error('❌ Auto-attendance error:', attendanceError);
      // Don't fail login if attendance creation fails
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isMfaSetup: user.isMfaSetup
      }
    });
  } catch (error) {
    console.error('MFA verify error:', error);
    res.status(500).json({ message: 'Server error during MFA verification' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to user
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, user.name);

    if (!emailSent) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();
      return res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }

    res.json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the token from URL
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // Update currentPassword in Employee collection
    try {
      await Employee.updateOne(
        { userId: user._id },
        { $set: { currentPassword: password } }
      );
      console.log('✅ Employee currentPassword updated for user:', user.email);
    } catch (empError) {
      console.error('❌ Error updating employee currentPassword:', empError);
      // Don't fail the password reset if employee update fails
    }

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password for logged in user
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Update currentPassword in Employee collection
    try {
      await Employee.updateOne(
        { userId: user._id },
        { $set: { currentPassword: newPassword } }
      );
      console.log('✅ Employee currentPassword updated for user:', user.email);
    } catch (empError) {
      console.error('❌ Error updating employee currentPassword:', empError);
      // Don't fail the password change if employee update fails
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// @route   POST /api/auth/mfa/recovery-request
// @desc    Request MFA recovery via email
// @access  Public
router.post('/mfa/recovery-request', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, you will receive MFA recovery instructions.' });
    }

    if (!user.isMfaSetup) {
      return res.status(400).json({ message: 'MFA is not set up for this account.' });
    }

    // Generate recovery token
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to user (expires in 1 hour)
    user.mfaRecoveryToken = crypto.createHash('sha256').update(recoveryToken).digest('hex');
    user.mfaRecoveryExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send recovery email
    const emailSent = await sendMfaRecoveryEmail(user.email, recoveryToken, user.name);

    if (!emailSent) {
      user.mfaRecoveryToken = null;
      user.mfaRecoveryExpire = null;
      await user.save();
      return res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }

    res.json({ message: 'MFA recovery instructions sent to your email.' });
  } catch (error) {
    console.error('MFA recovery request error:', error);
    res.status(500).json({ message: 'Server error during MFA recovery request' });
  }
});

// @route   POST /api/auth/mfa/recovery-verify/:token
// @desc    Verify MFA recovery token and reset MFA
// @access  Public
router.post('/mfa/recovery-verify/:token', async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Hash the token from URL
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user with valid recovery token
    const user = await User.findOne({
      mfaRecoveryToken: hashedToken,
      mfaRecoveryExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired recovery token' });
    }

    // Reset MFA settings
    user.isMfaSetup = false;
    user.mfaSecret = null;
    user.mfaRecoveryToken = null;
    user.mfaRecoveryExpire = null;
    user.loginAttempts = 0;
    user.lockUntil = null;

    // Optionally update password if provided
    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    // Update currentPassword in Employee collection if password was changed
    if (newPassword) {
      try {
        await Employee.updateOne(
          { userId: user._id },
          { $set: { currentPassword: newPassword } }
        );
        console.log('✅ Employee currentPassword updated for user:', user.email);
      } catch (empError) {
        console.error('❌ Error updating employee currentPassword:', empError);
        // Don't fail the MFA recovery if employee update fails
      }
    }

    res.json({ 
      message: 'MFA has been reset successfully. You can now login and set up MFA again.',
      requiresNewMfaSetup: true
    });
  } catch (error) {
    console.error('MFA recovery verify error:', error);
    res.status(500).json({ message: 'Server error during MFA recovery verification' });
  }
});

// @route   POST /api/auth/mfa/email-verification-request
// @desc    Request email verification code for MFA bypass
// @access  Public
router.post('/mfa/email-verification-request', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email, you will receive a verification code.' });
    }

    if (!user.isMfaSetup) {
      return res.status(400).json({ message: 'MFA is not set up for this account.' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash and store verification code (expires in 10 minutes)
    user.mfaEmailCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
    user.mfaEmailCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send verification code email
    const emailSent = await sendMfaVerificationCodeEmail(user.email, verificationCode, user.name);

    if (!emailSent) {
      user.mfaEmailCode = null;
      user.mfaEmailCodeExpire = null;
      await user.save();
      return res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }

    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('MFA email verification request error:', error);
    res.status(500).json({ message: 'Server error during verification code request' });
  }
});

// @route   POST /api/auth/mfa/verify-email-code
// @desc    Verify MFA using email verification code
// @access  Public
router.post('/mfa/verify-email-code', async (req, res) => {
  try {
    const { email, verificationCode, resetMfa } = req.body;

    const user = await User.findOne({ 
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Development bypass: accept "123456" as a valid code
    if (process.env.NODE_ENV === 'development' && verificationCode === '123456') {
      console.log('⚠️ Development bypass code used for', email);
      
      // Clear any existing verification code
      user.mfaEmailCode = null;
      user.mfaEmailCodeExpire = null;
      
      // Reset MFA if requested
      if (resetMfa) {
        console.log('🔄 Resetting MFA for user:', email);
        user.isMfaSetup = false;
        user.mfaSecret = null;
        user.mfaBackupCodes = [];
      }
      
      await user.save();

      // Generate JWT token
      const jwtToken = generateToken(user._id);

      return res.json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isMfaSetup: user.isMfaSetup
        },
        message: resetMfa ? 'Email verified. MFA has been reset. Please set up MFA again.' : 'Email verification successful (dev mode). You can now access your account.'
      });
    }

    // Check if code has expired
    if (!user.mfaEmailCodeExpire || user.mfaEmailCodeExpire < Date.now()) {
      return res.status(401).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Hash the provided verification code
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    if (user.mfaEmailCode !== hashedCode) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    // Clear the verification code
    user.mfaEmailCode = null;
    user.mfaEmailCodeExpire = null;
    
    // Reset MFA if requested
    if (resetMfa) {
      console.log('🔄 Resetting MFA for user:', email);
      user.isMfaSetup = false;
      user.mfaSecret = null;
      user.mfaBackupCodes = [];
    }
    
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isMfaSetup: user.isMfaSetup
      },
      message: resetMfa ? 'Email verified. MFA has been reset. Please set up MFA again.' : 'Email verification successful. You can now access your account.'
    });
  } catch (error) {
    console.error('Email code verify error:', error);
    res.status(500).json({ message: 'Server error during email code verification' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatarUrl: req.user.avatarUrl,
        isMfaSetup: req.user.isMfaSetup
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/mfa/reset
// @desc    Reset MFA setup (force new QR code generation)
// @access  Private
router.post('/mfa/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset MFA settings
    user.isMfaSetup = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = [];
    
    await user.save();

    console.log('✅ MFA reset for user:', user.email);

    res.json({ 
      message: 'MFA has been reset. You will need to set up MFA again on next login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isMfaSetup: user.isMfaSetup
      }
    });
  } catch (error) {
    console.error('MFA reset error:', error);
    res.status(500).json({ message: 'Server error during MFA reset' });
  }
});

// @route   POST /api/auth/mfa/reset-with-captcha
// @desc    Reset MFA with CAPTCHA verification (public endpoint)
// @access  Public
router.post('/mfa/reset-with-captcha', async (req, res) => {
  try {
    const { email, captchaAnswer } = req.body;

    if (!email || !captchaAnswer) {
      return res.status(400).json({ message: 'Email and CAPTCHA answer are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account exists with this email and the CAPTCHA is correct, MFA will be reset.' });
    }

    if (!user.isMfaSetup) {
      return res.status(400).json({ message: 'MFA is not set up for this account.' });
    }

    // In production, you would verify the CAPTCHA answer here
    // For now, we'll accept any non-empty answer as valid
    // The actual CAPTCHA verification happens on the frontend
    
    // Reset MFA settings
    user.isMfaSetup = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = [];
    user.loginAttempts = 0;
    user.lockUntil = null;
    
    await user.save();

    console.log('✅ MFA reset via CAPTCHA for user:', user.email);

    res.json({ 
      message: 'MFA has been reset successfully. You can now login and set up MFA again.',
      success: true
    });
  } catch (error) {
    console.error('MFA reset with CAPTCHA error:', error);
    res.status(500).json({ message: 'Server error during MFA reset' });
  }
});

export default router;
