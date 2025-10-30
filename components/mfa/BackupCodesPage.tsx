import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import Icon from '../common/Icon';

interface BackupCodesPageProps {
  onClose: () => void;
}

const BackupCodesPage: React.FC<BackupCodesPageProps> = ({ onClose }) => {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const { addToast } = useToast();

  const generateBackupCodes = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Generating backup codes...');
      const response = await authService.generateBackupCodes();
      console.log('✅ Backup codes generated');
      
      setBackupCodes(response.backupCodes);
      setIsGenerated(true);
      addToast({ type: 'success', message: response.message });
    } catch (error: any) {
      console.error('❌ Failed to generate backup codes:', error);
      addToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to generate backup codes' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText).then(() => {
      addToast({ type: 'success', message: 'Backup codes copied to clipboard' });
    }).catch(() => {
      addToast({ type: 'error', message: 'Failed to copy to clipboard' });
    });
  };

  const downloadCodes = () => {
    const codesText = `WEintegrity HR System - MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nIMPORTANT:\n- Each code can only be used once\n- Store these codes in a safe place\n- Don't share these codes with anyone`;
    
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToast({ type: 'success', message: 'Backup codes downloaded' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="key" className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">MFA Backup Codes</h2>
            <p className="text-muted-foreground">
              Generate backup codes to access your account if you lose your authenticator device.
            </p>
          </div>

          {!isGenerated ? (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Icon name="alert-triangle" className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Important Security Information</p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• Each backup code can only be used once</li>
                      <li>• Store these codes in a safe, secure location</li>
                      <li>• Don't share these codes with anyone</li>
                      <li>• These codes will only be shown once</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={generateBackupCodes} 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? 'Generating Codes...' : 'Generate Backup Codes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Icon name="alert-circle" className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Save These Codes Now!</p>
                    <p className="text-sm text-red-700 mt-1">
                      These backup codes will only be shown once. Make sure to save them in a secure location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">Your Backup Codes:</h3>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white border rounded px-3 py-2 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={copyToClipboard} variant="secondary" className="flex-1">
                  <Icon name="copy" className="w-4 h-4 mr-2" />
                  Copy Codes
                </Button>
                <Button onClick={downloadCodes} variant="secondary" className="flex-1">
                  <Icon name="download" className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="text-center">
                <Button onClick={onClose} size="lg">
                  I've Saved My Codes
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BackupCodesPage;