import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lock, Unlock, Copy, Sparkles, Zap, Upload, ArrowDown, CheckCircle2 } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CircuitVisualizer } from "@/components/CircuitVisualizer";
import { MeasurementChart } from "@/components/MeasurementChart";

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
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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
      setCurrentStep(2);
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
      setCurrentStep(3);
      toast.success("Circuit decrypted successfully!", {
        description: "Original circuit restored"
      });
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".qasm")) {
      toast.error("Please upload a .qasm file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCircuitInput(content);
      toast.success("QASM file loaded successfully");
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 p-6 pb-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="animate-slide-up space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-quantum animate-pulse-glow" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-quantum to-accent bg-clip-text text-transparent">
                Quantum Obfuscator
              </h1>
              <Sparkles className="w-10 h-10 text-quantum animate-pulse-glow" />
            </div>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Encrypt quantum circuits with advanced obfuscation and visualize the entire process
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step 
                    ? 'border-quantum bg-quantum/20 text-quantum glow-quantum' 
                    : 'border-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <ArrowDown className={`w-8 h-8 mx-4 rotate-[-90deg] transition-colors ${
                    currentStep > step ? 'text-quantum' : 'text-muted-foreground'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-24 mt-4">
            <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-quantum' : 'text-muted-foreground'}`}>
              Input
            </span>
            <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-quantum' : 'text-muted-foreground'}`}>
              Encrypt
            </span>
            <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-quantum' : 'text-muted-foreground'}`}>
              Decrypt
            </span>
          </div>
        </div>

        {/* Main Content - Vertical Flow */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Step 1: Input Section */}
          <Card className="p-8 bg-quantum-surface/50 backdrop-blur-sm border-quantum glow-quantum space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-quantum/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-quantum" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Step 1: Input Circuit</h2>
              </div>
            </div>

            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "text" | "file")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">QASM Text</TabsTrigger>
                <TabsTrigger value="file">Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Enter your QASM quantum circuit (e.g., OPENQASM 2.0; include qelib1.inc; qreg q[2]; h q[0]; cx q[0],q[1];)"
                  value={circuitInput}
                  onChange={(e) => setCircuitInput(e.target.value)}
                  className="min-h-[150px] bg-input border-quantum/50 focus:border-quantum focus:glow-quantum text-foreground font-mono resize-none"
                />
              </TabsContent>
              
              <TabsContent value="file" className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".qasm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full py-8 border-quantum hover:bg-quantum/10"
                >
                  <Upload className="w-6 h-6 mr-2" />
                  Upload QASM File
                </Button>
                {circuitInput && (
                  <div className="p-4 bg-input rounded-lg border border-quantum/30">
                    <p className="text-sm text-muted-foreground mb-2">Loaded circuit preview:</p>
                    <pre className="text-xs font-mono text-foreground overflow-x-auto max-h-32">
                      {circuitInput.slice(0, 200)}...
                    </pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {circuitInput && (
              <div className="animate-slide-up">
                <CircuitVisualizer circuit={circuitInput} title="Input Circuit Visualization" />
              </div>
            )}

            <Button
              onClick={encryptCircuit}
              disabled={isEncrypting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-8 text-xl glow-quantum-strong transition-all"
            >
              {isEncrypting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-foreground mr-2" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 mr-2" />
                  Encrypt Circuit
                </>
              )}
            </Button>
          </Card>

          {/* Step 2: Encryption Results */}
          {encryptionResult && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-center">
                <ArrowDown className="w-12 h-12 text-quantum animate-bounce" />
              </div>

              <Card className="p-8 bg-quantum-surface/50 backdrop-blur-sm border-quantum glow-quantum space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Step 2: Encryption Results</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground break-all max-h-32 overflow-y-auto">
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
                    <div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground break-all max-h-32 overflow-y-auto">
                      {encryptionResult.key}
                    </div>
                  </div>
                </div>

                <MeasurementChart 
                  measurements={encryptionResult.measurementOutputs}
                  title="Encrypted Measurement Outputs"
                  isEncrypted={true}
                />

                <Button
                  onClick={decryptCircuit}
                  disabled={isDecrypting}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-8 text-xl glow-quantum-strong transition-all"
                >
                  {isDecrypting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-foreground mr-2" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-6 h-6 mr-2" />
                      Decrypt Circuit
                    </>
                  )}
                </Button>
              </Card>
            </div>
          )}

          {/* Step 3: Decryption Results */}
          {decryptedOutput && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-center">
                <ArrowDown className="w-12 h-12 text-accent animate-bounce" />
              </div>

              <Card className="p-8 bg-accent/10 backdrop-blur-sm border-accent glow-quantum space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Unlock className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Step 3: Decryption Complete</h2>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-accent">Corrected Output</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(decryptedOutput, "Decrypted output")}
                      className="text-accent hover:text-accent/80"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-accent/5 p-6 rounded-lg border-2 border-accent glow-quantum-strong font-mono text-base text-foreground break-all">
                    {decryptedOutput}
                  </div>
                </div>

                <CircuitVisualizer circuit={decryptedOutput} title="Decrypted Circuit Visualization" />

                {encryptionResult && (
                  <MeasurementChart 
                    measurements={encryptionResult.measurementOutputs}
                    title="Decrypted Measurement Outputs"
                    isEncrypted={false}
                  />
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setCircuitInput("");
                      setEncryptionResult(null);
                      setDecryptedOutput("");
                      setCurrentStep(1);
                      toast.info("Ready for new circuit");
                    }}
                    variant="outline"
                    className="flex-1 py-6 border-accent hover:bg-accent/10"
                  >
                    Start New Circuit
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
