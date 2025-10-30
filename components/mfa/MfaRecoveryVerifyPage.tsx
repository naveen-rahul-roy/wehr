import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import Icon from '../common/Icon';

const MfaRecoveryVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      addToast({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      addToast({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 Verifying MFA recovery token...');
      const response = await authService.verifyMfaRecovery(token!, newPassword || undefined);
      console.log('✅ MFA recovery successful');
      
      setIsVerified(true);
      addToast({ type: 'success', message: response.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ MFA recovery verification failed:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Invalid or expired recovery token' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">MFA Reset Successful</h2>
            <p className="text-muted-foreground mb-6">
              Your MFA has been reset successfully. You can now login and set up MFA again.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login page in 3 seconds...
            </p>
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="shield" className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Reset MFA</h2>
            <p className="text-muted-foreground">
              Complete your MFA recovery by optionally setting a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password (Optional)</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                disabled={isLoading}
                icon="lock"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If you leave this blank, your current password will remain unchanged.
              </p>
            </div>

            {newPassword && (
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                  icon="lock"
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">What happens next?</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Your MFA will be completely reset</li>
                    <li>• You'll be able to login normally</li>
                    <li>• You'll need to set up MFA again for security</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting MFA...' : 'Reset MFA'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MfaRecoveryVerifyPage;