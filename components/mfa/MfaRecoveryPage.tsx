import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import Icon from '../common/Icon';

interface MfaRecoveryPageProps {
  onBack: () => void;
}

const MfaRecoveryPage: React.FC<MfaRecoveryPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Requesting MFA recovery for:', email);
      const response = await authService.requestMfaRecovery(email);
      console.log('✅ MFA recovery request sent');
      
      setEmailSent(true);
      addToast({ type: 'success', message: response.message });
    } catch (error: any) {
      console.error('❌ MFA recovery request failed:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send recovery email' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mail" className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent MFA recovery instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The recovery link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <Button variant="secondary" onClick={onBack} className="w-full">
              Back to Login
            </Button>
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="shield" className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">MFA Recovery</h2>
            <p className="text-muted-foreground">
              Lost access to your authenticator? We'll help you recover your account.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Icon name="alert-triangle" className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Security Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  This will reset your MFA settings. You'll need to set up MFA again after recovery.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoading ? 'Sending Recovery Email...' : 'Send Recovery Email'}
            </Button>

            <Button 
              type="button" 
              variant="secondary" 
              onClick={onBack} 
              className="w-full"
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MfaRecoveryPage;