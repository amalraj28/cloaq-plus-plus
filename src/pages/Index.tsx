import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Unlock, Copy, Sparkles, Zap } from "lucide-react";

interface EncryptionResult {
  encryptedCircuit: string;
  key: string;
  measurementOutputs: string;
}

const Index = () => {
  const [circuitInput, setCircuitInput] = useState("");
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [decryptedOutput, setDecryptedOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Simulated quantum encryption function
  const encryptCircuit = () => {
    if (!circuitInput.trim()) {
      toast.error("Please enter a quantum circuit");
      return;
    }

    setIsEncrypting(true);
    
    // Simulate encryption process
    setTimeout(() => {
      const randomKey = Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      const encryptedCircuit = btoa(circuitInput).split('').reverse().join('');
      const measurements = Array.from({ length: 8 }, () => 
        Math.random() > 0.5 ? '1' : '0'
      ).join('');

      setEncryptionResult({
        encryptedCircuit,
        key: randomKey,
        measurementOutputs: measurements,
      });
      
      setIsEncrypting(false);
      toast.success("Circuit encrypted successfully!", {
        description: "Quantum obfuscation applied"
      });
    }, 1500);
  };

  // Simulated quantum decryption function
  const decryptCircuit = () => {
    if (!encryptionResult) {
      toast.error("No encrypted data available");
      return;
    }

    setIsDecrypting(true);
    
    setTimeout(() => {
      // Simulate decryption by reversing the encryption
      const decrypted = atob(encryptionResult.encryptedCircuit.split('').reverse().join(''));
      
      setDecryptedOutput(decrypted);
      setIsDecrypting(false);
      toast.success("Circuit decrypted successfully!", {
        description: "Original circuit restored"
      });
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-quantum animate-pulse-glow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quantum Obfuscator
            </h1>
            <Sparkles className="w-8 h-8 text-quantum animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Encrypt and decrypt quantum circuits with advanced obfuscation
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Encryption Section */}
        <Card className="p-6 bg-quantum-surface border-quantum glow-quantum space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Encryption</h2>
          </div>

          {/* Circuit Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-quantum flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quantum Circuit Input
            </label>
            <Textarea
              placeholder="Enter your quantum circuit (e.g., CNOT gates, Hadamard operations, etc.)"
              value={circuitInput}
              onChange={(e) => setCircuitInput(e.target.value)}
              className="min-h-[120px] bg-input border-quantum/50 focus:border-quantum focus:glow-quantum text-foreground font-mono resize-none"
            />
          </div>

          <Button
            onClick={encryptCircuit}
            disabled={isEncrypting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg glow-quantum-strong transition-all"
          >
            {isEncrypting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                Encrypting...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Encrypt Circuit
              </>
            )}
          </Button>

          {/* Encryption Results */}
          {encryptionResult && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-quantum">Encrypted Circuit</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(encryptionResult.encryptedCircuit, "Encrypted circuit")}
                    className="text-quantum hover:text-quantum/80"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground break-all">
                  {encryptionResult.encryptedCircuit}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-quantum">Encryption Key</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(encryptionResult.key, "Encryption key")}
                    className="text-quantum hover:text-quantum/80"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground break-all">
                  {encryptionResult.key}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-quantum">Measurement Outputs</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(encryptionResult.measurementOutputs, "Measurement outputs")}
                    className="text-quantum hover:text-quantum/80"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-lg text-foreground text-center tracking-widest">
                  {encryptionResult.measurementOutputs}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Decryption Section */}
        <Card className="p-6 bg-quantum-surface border-quantum glow-quantum space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Unlock className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Decryption</h2>
          </div>

          {/* Auto-populated data */}
          {encryptionResult ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-quantum">Encrypted Circuit</label>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-muted-foreground break-all">
                  {encryptionResult.encryptedCircuit}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-quantum">Key</label>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-muted-foreground break-all">
                  {encryptionResult.key}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-quantum">Measurement Outputs</label>
                <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-lg text-muted-foreground text-center tracking-widest">
                  {encryptionResult.measurementOutputs}
                </div>
              </div>

              <Button
                onClick={decryptCircuit}
                disabled={isDecrypting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg glow-quantum-strong transition-all"
              >
                {isDecrypting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground mr-2" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    Decrypt Circuit
                  </>
                )}
              </Button>

              {/* Decryption Result */}
              {decryptedOutput && (
                <div className="space-y-2 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-quantum">Corrected Output</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(decryptedOutput, "Decrypted output")}
                      className="text-quantum hover:text-quantum/80"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary glow-quantum-strong font-mono text-sm text-foreground break-all">
                    {decryptedOutput}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <Unlock className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-muted-foreground text-lg">
                Encrypt a circuit first to see decryption options
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
