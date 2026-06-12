import { useState, useEffect } from 'react';
import { Shield, Info } from 'lucide-react';
import { Card, CardContent } from './components/ui/Card';
import { Toaster } from './components/ui/Toaster';
import { useToast } from './components/ui/ToastProvider';
import { EncodeTab } from './components/EncodeTab';
import { DecodeTab } from './components/DecodeTab';
import { HelpTab } from './components/HelpTab';
import { checkHealth } from './utils/api';

type Tab = 'encode' | 'decode' | 'help';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('encode');
  const [apiHealthy, setApiHealthy] = useState(true);
  const [checking, setChecking] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const healthy = await checkHealth();
        setApiHealthy(healthy);
        if (!healthy) {
          addToast({
            title: 'API Connection Issue',
            description: 'Could not connect to the backend API',
            variant: 'destructive',
          });
        }
      } catch {
        setApiHealthy(false);
        addToast({
          title: 'API Connection Error',
          description: 'Make sure the backend server is running on port 5000',
          variant: 'destructive',
        });
      } finally {
        setChecking(false);
      }
    };

    checkApiHealth();
  }, [addToast]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-accent-orange rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-dark">
                Steganography
              </h1>
            </div>
            <p className="text-lg text-text-muted">
              Hide secret messages inside images with encryption
            </p>
          </div>

          {/* API Status */}
          {!checking && !apiHealthy && (
            <Card className="mb-6 border-red-600/50 bg-red-900/20">
              <CardContent className="pt-6 flex items-center gap-3">
                <Info className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-400">Backend Connection Failed</p>
                  <p className="text-sm text-red-300">
                    Make sure the backend server is running. Run{' '}
                    <code className="bg-red-900/50 px-2 py-1 rounded">
                      npm run dev
                    </code>{' '}
                    in the backend folder.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {(['encode', 'decode', 'help'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-24 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-accent-orange text-white shadow-lg'
                    : 'bg-dark-card border border-dark-border text-text-muted hover:border-accent-orange/50'
                }`}
              >
                {tab === 'encode' ? 'Encode' : tab === 'decode' ? 'Decode' : 'Help'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'encode' && <EncodeTab />}
            {activeTab === 'decode' && <DecodeTab />}
            {activeTab === 'help' && <HelpTab />}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-text-muted text-sm">
            <p>
              🔒 All encryption happens securely. Your data is never stored.
            </p>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
