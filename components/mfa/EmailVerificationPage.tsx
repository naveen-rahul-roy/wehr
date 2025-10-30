import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import Icon from '../common/Icon';

interface EmailVerificationPageProps {
  userEmail: string;
  onComplete: () => void;
  onBack: () => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ userEmail, onComplete, onBack }) => {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState(userEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Requesting email verification code for:', email);
      const response = await authService.requestEmailVerificationCode(email);
      console.log('✅ Verification code request sent');
      
      setStep('verify');
      addToast({ type: 'success', message: response.message });
    } catch (error: any) {
      console.error('❌ Failed to request verification code:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send verification code' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [resetMfa, setResetMfa] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Verifying email code:', verificationCode, 'Reset MFA:', resetMfa);
      const response = await authService.verifyEmailCode(email, verificationCode, resetMfa);
      console.log('✅ Email verification successful');
      
      addToast({ type: 'success', message: response.message });
      onComplete();
    } catch (error: any) {
      console.error('❌ Email verification failed:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Invalid verification code' 
      });
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mail" className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Email Verification</h2>
              <p className="text-muted-foreground">
                We'll send a verification code to your email address to verify your identity.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Alternative Access Method</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This will send a 6-digit code to your email that you can use instead of your authenticator app.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  icon="mail"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>

              <Button 
                type="button" 
                variant="secondary" 
                onClick={onBack} 
                className="w-full"
                disabled={isLoading}
              >
                Back to MFA
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mail" className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Enter Verification Code</h2>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Icon name="clock" className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Code expires in 10 minutes</p>
                <p className="text-sm text-amber-700 mt-1">
                  Check your email and enter the 6-digit code below.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Icon name="info" className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-purple-800 font-medium">Development Mode</p>
                <p className="text-sm text-purple-700 mt-1">
                  Email not configured. Use code: <strong className="font-mono text-lg">123456</strong>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <Label htmlFor="verificationCode" className="sr-only">Verification Code</Label>
              <Input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                disabled={isLoading}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                autoComplete="one-time-code"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetMfa}
                  onChange={(e) => setResetMfa(e.target.checked)}
                  className="mt-1 mr-3"
                  disabled={isLoading}
                />
                <div>
                  <p className="text-sm font-medium text-blue-900">Reset MFA Setup</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Generate a new QR code and reset your authenticator app setup
                  </p>
                </div>
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading || verificationCode.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Didn't receive the code? Send again
              </button>
              
              <div>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  disabled={isLoading}
                >
                  Back to MFA verification
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;