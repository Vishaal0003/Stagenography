import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Toaster } from './components/ui/Toaster';
import { EncodeTab } from './components/EncodeTab';
import { DecodeTab } from './components/DecodeTab';
import { HelpTab } from './components/HelpTab';

type Tab = 'encode' | 'decode' | 'help';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('encode');

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
              Hide secret messages inside images with encryption (100% Client-Side)
            </p>
          </div>

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
              🔒 All encryption happens securely in your browser. Your data is never stored or transmitted.
            </p>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
