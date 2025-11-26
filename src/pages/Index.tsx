import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lock, Unlock, Copy, Zap, Upload, ArrowDown, CheckCircle2 } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CircuitVisualizer } from "@/components/CircuitVisualizer";
import { MeasurementChart } from "@/components/MeasurementChart";
import { CloaQLogo } from "@/components/CloaQLogo";
import { cn } from "@/lib/utils";

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
  
  // Direct decryption states
  const [directMeasurements, setDirectMeasurements] = useState("");
  const [directKey, setDirectKey] = useState("");
  const [directDecryptedOutput, setDirectDecryptedOutput] = useState("");
  const [isDirectDecrypting, setIsDirectDecrypting] = useState(false);

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

  // Direct decryption function
  const handleDirectDecryption = () => {
    if (!directMeasurements.trim() || !directKey.trim()) {
      toast.error("Please enter both measurements and key");
      return;
    }

    setIsDirectDecrypting(true);
    
    setTimeout(() => {
      // Simulate decryption of measurements
      const decrypted = `Corrected measurement output: ${directMeasurements.split('').reverse().join('')}`;
      
      setDirectDecryptedOutput(decrypted);
      setIsDirectDecrypting(false);
      toast.success("Measurements decrypted successfully!", {
        description: "Output corrected using provided key"
      });
    }, 1500);
  };

  return (
    <div className="index-page">
      <ParticleBackground />
      
      <div className="index-page-content">
        {/* Header */}
        <div className="index-header">
          <div className="index-header-content">
            <CloaQLogo />
            <p className="index-description">
              Quantum encryption (Q) meets classical decryption (Cl) - Visualize and secure your quantum circuits
            </p>
          </div>
        </div>

        {/* Direct Decryption Section */}
        <div className="direct-decryption-section">
          <Card className="direct-decryption-card animate-slide-up">
            <div className="direct-decryption-header">
              <Unlock className="direct-decryption-icon" />
              <h2 className="direct-decryption-title">Direct Decryption</h2>
            </div>
            <p className="direct-decryption-description">
              Already have encrypted measurements from a previous session? Decrypt them directly here.
            </p>
            
            <div className="direct-decryption-form">
              <div className="direct-decryption-field">
                <label className="direct-decryption-label">Encrypted Measurements</label>
                <Textarea
                  placeholder="Enter encrypted measurement outputs (e.g., 10110101)"
                  value={directMeasurements}
                  onChange={(e) => setDirectMeasurements(e.target.value)}
                  className="direct-decryption-textarea glow-quantum"
                />
              </div>
              
              <div className="direct-decryption-field">
                <label className="direct-decryption-label">Encryption Key</label>
                <Textarea
                  placeholder="Enter the encryption key"
                  value={directKey}
                  onChange={(e) => setDirectKey(e.target.value)}
                  className="direct-decryption-textarea glow-quantum"
                />
              </div>
            </div>

            <Button
              onClick={handleDirectDecryption}
              disabled={isDirectDecrypting}
              className="direct-decryption-button glow-quantum-strong"
            >
              {isDirectDecrypting ? (
                <>
                  <div className="loading-spinner loading-spinner-accent" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                  Decrypt Measurements
                </>
              )}
            </Button>

            {directDecryptedOutput && (
              <div className="direct-decryption-output">
                <div className="direct-decryption-output-header">
                  <label className="direct-decryption-label">Corrected Output</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(directDecryptedOutput, "Corrected output")}
                    className="copy-button"
                  >
                    <Copy style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                </div>
                <div className="direct-decryption-output-content glow-quantum-strong">
                  {directDecryptedOutput}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Step Indicators */}
        <div className="step-indicators">
          <div className="step-indicators-container">
            {[1, 2, 3].map((step) => (
              <div key={step} className="step-indicator">
                <div className={cn("step-circle", currentStep >= step && "step-circle-active glow-quantum")}>
                  {currentStep > step ? (
                    <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem' }} />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <ArrowDown className={cn("step-arrow", currentStep > step && "step-arrow-active")} />
                )}
              </div>
            ))}
          </div>
          <div className="step-labels">
            <span className={cn("step-label", currentStep >= 1 && "step-label-active")}>
              Input
            </span>
            <span className={cn("step-label", currentStep >= 2 && "step-label-active")}>
              Encrypt
            </span>
            <span className={cn("step-label", currentStep >= 3 && "step-label-active")}>
              Decrypt
            </span>
          </div>
        </div>

        {/* Main Content - Vertical Flow */}
        <div className="main-content">
          
          {/* Step 1: Input Section */}
          <Card className="step-card glow-quantum">
            <div className="step-card-header">
              <div className="step-card-title-container">
                <div className="step-icon-container">
                  <Zap className="step-icon" />
                </div>
                <h2 className="step-title">Step 1: Input Circuit</h2>
              </div>
            </div>

            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "text" | "file")}>
              <TabsList style={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <TabsTrigger value="text">QASM Text</TabsTrigger>
                <TabsTrigger value="file">Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Textarea
                  placeholder="Enter your QASM quantum circuit (e.g., OPENQASM 2.0; include qelib1.inc; qreg q[2]; h q[0]; cx q[0],q[1];)"
                  value={circuitInput}
                  onChange={(e) => setCircuitInput(e.target.value)}
                  className="qasm-textarea glow-quantum"
                />
              </TabsContent>
              
              <TabsContent value="file" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".qasm"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="upload-button"
                >
                  <Upload style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                  Upload QASM File
                </Button>
                {circuitInput && (
                  <div className="file-preview">
                    <p className="file-preview-label">Loaded circuit preview:</p>
                    <pre className="file-preview-content">
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
              className="encrypt-button glow-quantum-strong"
            >
              {isEncrypting ? (
                <>
                  <div className="loading-spinner loading-spinner-primary" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                  Encrypt Circuit
                </>
              )}
            </Button>
          </Card>

          {/* Step 2: Encryption Results */}
          {encryptionResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
              <div className="step-separator">
                <ArrowDown className="step-separator-icon" />
              </div>

              <Card className="step-card glow-quantum">
                <div className="step-card-header" style={{ marginBottom: '1.5rem' }}>
                  <div className="step-card-title-container">
                    <div className="step-icon-container">
                      <Lock className="step-icon" />
                    </div>
                    <h2 className="step-title">Step 2: Encryption Results</h2>
                  </div>
                </div>

                <div className="encryption-results-grid">
                  <div className="encryption-result-field">
                    <div className="encryption-result-header">
                      <label className="encryption-result-label">Encrypted Circuit</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptionResult.encryptedCircuit, "Encrypted circuit")}
                        className="copy-button"
                      >
                        <Copy style={{ width: '1rem', height: '1rem' }} />
                      </Button>
                    </div>
                    <div className="encryption-result-content">
                      {encryptionResult.encryptedCircuit}
                    </div>
                  </div>

                  <div className="encryption-result-field">
                    <div className="encryption-result-header">
                      <label className="encryption-result-label">Encryption Key</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptionResult.key, "Encryption key")}
                        className="copy-button"
                      >
                        <Copy style={{ width: '1rem', height: '1rem' }} />
                      </Button>
                    </div>
                    <div className="encryption-result-content">
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
                  className="decrypt-button glow-quantum-strong"
                >
                  {isDecrypting ? (
                    <>
                      <div className="loading-spinner loading-spinner-accent" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      <Unlock style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                      Decrypt Circuit
                    </>
                  )}
                </Button>
              </Card>
            </div>
          )}

          {/* Step 3: Decryption Results */}
          {decryptedOutput && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
              <div className="step-separator">
                <ArrowDown className="step-separator-icon step-separator-icon-accent" />
              </div>

              <Card className="step-card glow-quantum" style={{ backgroundColor: 'hsl(var(--accent) / 0.1)', borderColor: 'hsl(var(--accent))' }}>
                <div className="step-card-header" style={{ marginBottom: '1.5rem' }}>
                  <div className="step-card-title-container">
                    <div className="step-icon-container" style={{ backgroundColor: 'hsl(var(--accent) / 0.2)' }}>
                      <Unlock className="step-icon" style={{ color: 'hsl(var(--accent))' }} />
                    </div>
                    <h2 className="step-title">Step 3: Decryption Complete</h2>
                  </div>
                </div>

                <div className="decryption-output">
                  <div className="direct-decryption-output-header">
                    <label className="encryption-result-label" style={{ color: 'hsl(var(--accent))' }}>Corrected Output</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(decryptedOutput, "Decrypted output")}
                      className="copy-button"
                      style={{ color: 'hsl(var(--accent))' }}
                    >
                      <Copy style={{ width: '1rem', height: '1rem' }} />
                    </Button>
                  </div>
                  <div className="decryption-output-content glow-quantum-strong">
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

                <div className="action-buttons">
                  <Button
                    onClick={() => {
                      setCircuitInput("");
                      setEncryptionResult(null);
                      setDecryptedOutput("");
                      setCurrentStep(1);
                      toast.info("Ready for new circuit");
                    }}
                    variant="outline"
                    className="new-circuit-button"
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
