import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
	Lock,
	Unlock,
	Copy,
	Zap,
	Upload,
	ArrowDown,
	CheckCircle2,
	Image as ImageIcon,
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { MeasurementChart } from "@/components/MeasurementChart";
import { CloaQLogo } from "@/components/CloaQLogo";
import { defaultQASM } from "@/exports/exports";

interface EncryptionResult {
	encryptedCircuit: string;
	key: string;
	encryptedResult: Record<string, number>;
}

interface DecryptionResult {
	decryptedResult: Record<string, number>;
	key: string;
}

function Index() {
	const [circuitInput, setCircuitInput] = useState(defaultQASM);
	const [encryptionResult, setEncryptionResult] =
		useState<EncryptionResult | null>(null);
	const [originalResult, setOriginalResult] = useState<Record<
		string,
		number
	> | null>(null);
	const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
	const [encryptedImageURL, setEncryptedImageURL] = useState<string | null>(
		null
	);
	const [decryptionResult, setDecryptionResult] =
		useState<DecryptionResult | null>(null);
	const [isEncrypting, setIsEncrypting] = useState(false);
	const [isDecrypting, setIsDecrypting] = useState(false);
	const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

	const [directMeasurements, setDirectMeasurements] = useState("");
	const [directKey, setDirectKey] = useState("");
	const [directDecryptedOutput, setDirectDecryptedOutput] = useState("");
	const [isDirectDecrypting, setIsDirectDecrypting] = useState(false);
	const [imageDialogOpen, setImageDialogOpen] = useState(false);
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
	const [currentImageTitle, setCurrentImageTitle] = useState("");
	const prefixURL = "/api";

	const showCircuitImage = async (imageURL: string, title: string) => {
		if (!imageURL) {
			alert(`Image URL not available: ${imageURL}`);
			return;
		}

		if (!imageURL.startsWith("/")) {
			imageURL = `/${imageURL}`;
		}

		try {
			const response = await fetch(`${prefixURL}${imageURL}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.statusText}`);
			}

			const blob = await response.blob();
			const imageUrl = URL.createObjectURL(blob);
			setCurrentImageUrl(imageUrl);
			setCurrentImageTitle(title);
			setImageDialogOpen(true);
		} catch (error) {
			toast.error(
				`${error instanceof Error ? error.message : "Unknown error"}`
			);
			return;
		}
	};

	const encryptCircuit = async () => {
		if (!circuitInput.trim()) {
			toast.error("Please enter a quantum circuit");
			return;
		}

		setIsEncrypting(true);

		try {
			const response = await fetch("/api/encrypt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					qasm_string: circuitInput,
					key_size: 20,
					shots: 1024,
				}),
			});

			if (!response.ok) {
				throw new Error(`Encryption failed: ${response.statusText}`);
			}

			const {
				original_results: originalResults,
				encrypted_results: encryptedResults,
				original_circuit: originalImage,
				encrypted_circuit: encryptedImage,
				key: encryptionKey,
			} = await response.json();

			setOriginalResult(originalResults);
			setOriginalImageURL(originalImage);
			setEncryptedImageURL(encryptedImage);
			setEncryptionResult({
				encryptedCircuit: "",
				key: encryptionKey,
				encryptedResult: encryptedResults,
			});

			setIsEncrypting(false);
			setCurrentStep(2);
			toast.success("Circuit encrypted successfully!", {
				description: "Quantum obfuscation applied",
			});
		} catch (error) {
			setIsEncrypting(false);
			toast.error("Encryption failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsEncrypting(false);
		}
	};

	const decryptCircuit = async (
		encryptedResult: Record<string, number>,
		key: string
	) => {
		setIsDecrypting(true);

		try {
			const response = await fetch("/api/decrypt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					encrypted_values: encryptedResult,
					key: key,
				}),
			});

			if (!response.ok) {
				throw new Error(`Decryption failed: ${response.statusText}`);
			}

			const { decrypted_results: decryptedResult } = await response.json();
			setDecryptionResult(() => ({
				decryptedResult: decryptedResult,
				key: key,
			}));

			setCurrentStep(3);
			toast.success("Circuit decrypted successfully!", {
				description: "Original circuit restored",
			});
		} catch (error) {
			console.error(error);
		} finally {
			setIsDecrypting(false);
		}
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
	const handleDirectDecryption = async () => {
		if (!directMeasurements.trim() || !directKey.trim()) {
			toast.error("Please enter both measurements and key");
			return;
		}

		setIsDirectDecrypting(true);

		try {
			let parsedMeasurements;
			try {
				parsedMeasurements = JSON.parse(directMeasurements);
			} catch {
				toast.error("Invalid JSON format for measurements");
				setIsDirectDecrypting(false);
				return;
			}

			const response = await fetch("http://localhost:8000/decrypt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					encrypted_values: parsedMeasurements,
					key: directKey,
				}),
			});

			if (!response.ok) {
				throw new Error(`Decryption failed: ${response.statusText}`);
			}

			const { decrypted_results: decryptedResult } = await response.json();
			setDirectDecryptedOutput(JSON.stringify(decryptedResult, null, 2));
			toast.success("Measurements decrypted successfully!", {
				description: "Output corrected using provided key",
			});
		} catch (error) {
			toast.error("Decryption failed", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsDirectDecrypting(false);
		}
	};

	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			<ParticleBackground />

			<div className="relative z-10 p-6 pb-20">
				{/* Header */}
				<div className="max-w-4xl mx-auto mb-12 text-center">
					<div className="animate-slide-up space-y-6">
						<CloaQLogo />
						<p className="text-muted-foreground text-xl max-w-2xl mx-auto">
							Quantum encryption (Q) meets classical decryption (Cl) - Visualize
							and secure your quantum circuits
						</p>
					</div>
				</div>

				{/* Direct Decryption Section */}
				<div className="max-w-4xl mx-auto mb-8">
					<Card className="p-6 bg-accent/10 backdrop-blur-sm border-accent space-y-4 animate-slide-up">
						<div className="flex items-center gap-3 mb-2">
							<Unlock className="w-6 h-6 text-accent" />
							<h2 className="text-2xl font-bold text-foreground">
								Direct Decryption
							</h2>
						</div>
						<p className="text-sm text-muted-foreground">
							Already have encrypted measurements from a previous session?
							Decrypt them directly here.
						</p>

						<div className="grid md:grid-cols-2 gap-4">
							<div className="space-y-2 min-w-0">
								<label className="text-sm font-medium text-accent">
									Encrypted Measurements
								</label>
								<Textarea
									placeholder="Enter encrypted measurement outputs (e.g., 10110101)"
									value={directMeasurements}
									onChange={(e) => setDirectMeasurements(e.target.value)}
									className="min-h-[100px] bg-input border-accent/50 focus:border-accent focus:glow-quantum text-foreground font-mono resize-none w-full"
								/>
							</div>

							<div className="space-y-2 min-w-0">
								<label className="text-sm font-medium text-accent">
									Encryption Key
								</label>
								<Textarea
									placeholder="Enter the encryption key"
									value={directKey}
									onChange={(e) => setDirectKey(e.target.value)}
									className="min-h-[100px] bg-input border-accent/50 focus:border-accent focus:glow-quantum text-foreground font-mono resize-none w-full"
								/>
							</div>
						</div>

						<Button
							onClick={handleDirectDecryption}
							disabled={isDirectDecrypting}
							className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg glow-quantum-strong transition-all"
						>
							{isDirectDecrypting ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground mr-2" />
									Decrypting...
								</>
							) : (
								<>
									<Unlock className="w-5 h-5 mr-2" />
									Decrypt Measurements
								</>
							)}
						</Button>

						{directDecryptedOutput && (
							<div className="space-y-2 animate-slide-up min-w-0">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-accent">
										Corrected Output
									</label>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(directDecryptedOutput, "Corrected output")
										}
										className="text-accent hover:bg-accent/10 [&:hover_svg]:text-black"
									>
										<Copy className="w-4 h-4" />
									</Button>
								</div>
								<div className="bg-accent/5 p-4 rounded-lg border-2 border-accent glow-quantum-strong font-mono text-sm text-foreground overflow-x-auto w-full hide-scrollbar">
									<pre className="whitespace-pre">{directDecryptedOutput}</pre>
								</div>
							</div>
						)}
					</Card>
				</div>

				{/* Step Indicators */}
				<div className="max-w-4xl mx-auto mb-8">
					<div className="flex items-center justify-center gap-4">
						{[1, 2, 3].map((step) => (
							<div key={step} className="flex items-center">
								<div
									className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
										currentStep >= step
											? "border-quantum bg-quantum/20 text-quantum glow-quantum"
											: "border-muted text-muted-foreground"
									}`}
								>
									{currentStep > step ? (
										<CheckCircle2 className="w-6 h-6" />
									) : (
										<span className="font-bold">{step}</span>
									)}
								</div>
								{step < 3 && (
									<ArrowDown
										className={`w-8 h-8 mx-4 rotate-[-90deg] transition-colors ${
											currentStep > step
												? "text-quantum"
												: "text-muted-foreground"
										}`}
									/>
								)}
							</div>
						))}
					</div>
					<div className="flex justify-center gap-24 mt-4">
						<span
							className={`text-sm font-medium ${
								currentStep >= 1 ? "text-quantum" : "text-muted-foreground"
							}`}
						>
							Input
						</span>
						<span
							className={`text-sm font-medium ${
								currentStep >= 2 ? "text-quantum" : "text-muted-foreground"
							}`}
						>
							Encrypt
						</span>
						<span
							className={`text-sm font-medium ${
								currentStep >= 3 ? "text-quantum" : "text-muted-foreground"
							}`}
						>
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
								<h2 className="text-3xl font-bold text-foreground">
									Step 1: Input Circuit
								</h2>
							</div>
						</div>

						<Tabs
							value={inputMethod}
							onValueChange={(v) => setInputMethod(v as "text" | "file")}
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="text">QASM Text</TabsTrigger>
								<TabsTrigger value="file">Upload File</TabsTrigger>
							</TabsList>

							<TabsContent value="text" className="space-y-4">
								<Textarea
									placeholder="Enter your QASM quantum circuit (e.g., OPENQASM 2.0; include qelib1.inc; qreg q[2]; h q[0]; cx q[0],q[1];)"
									value={circuitInput}
									onChange={(e) => setCircuitInput(e.target.value)}
									className="min-h-[150px] bg-input border-quantum/50 focus:border-quantum focus:glow-quantum text-foreground font-mono resize-none w-full"
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
									<div className="p-4 bg-input rounded-lg border border-quantum/30 max-h-64 overflow-y-auto">
										<p className="text-sm text-muted-foreground mb-2">
											Loaded circuit:
										</p>
										<pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-words">
											{circuitInput}
										</pre>
									</div>
								)}
							</TabsContent>
						</Tabs>

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
									<h2 className="text-3xl font-bold text-foreground">
										Step 2: Encryption Results
									</h2>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-quantum">
												Original Measurements
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														JSON.stringify(originalResult),
														"Original measurements"
													)
												}
												className="text-quantum hover:bg-quantum/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{JSON.stringify(originalResult)}</pre>
										</div>
									</div>

									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-quantum">
												Encryption Key
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														encryptionResult.key,
														"Encryption key"
													)
												}
												className="text-quantum hover:bg-quantum/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{encryptionResult.key}</pre>
										</div>
									</div>

									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-quantum">
												Encrypted Measurements
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														JSON.stringify(encryptionResult.encryptedResult),
														"Encrypted measurements"
													)
												}
												className="text-quantum hover:bg-quantum/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-input p-4 rounded-lg border border-quantum/30 font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{JSON.stringify(encryptionResult.encryptedResult)}</pre>
										</div>
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<Button
										onClick={() =>
											showCircuitImage(originalImageURL, "Original Circuit")
										}
										variant="outline"
										className="py-6 border-quantum hover:bg-quantum/10"
									>
										<ImageIcon className="w-5 h-5 mr-2" />
										View Original Circuit
									</Button>
									<Button
										onClick={() =>
											showCircuitImage(encryptedImageURL, "Encrypted Circuit")
										}
										variant="outline"
										className="py-6 border-quantum hover:bg-quantum/10"
									>
										<ImageIcon className="w-5 h-5 mr-2" />
										View Encrypted Circuit
									</Button>
								</div>

								<MeasurementChart
									measurements={originalResult}
									title="Original Measurement Outputs"
									isEncrypted={false}
								/>

								<MeasurementChart
									measurements={encryptionResult.encryptedResult}
									title="Encrypted Measurement Outputs"
									isEncrypted={true}
								/>

								<Button
									onClick={() =>
										decryptCircuit(
											encryptionResult.encryptedResult,
											encryptionResult.key
										)
									}
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
					{decryptionResult && (
						<div className="space-y-6 animate-slide-up">
							<div className="flex items-center justify-center">
								<ArrowDown className="w-12 h-12 text-accent animate-bounce" />
							</div>

							<Card className="p-8 bg-accent/10 backdrop-blur-sm border-accent glow-quantum space-y-6">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
										<Unlock className="w-6 h-6 text-accent" />
									</div>
									<h2 className="text-3xl font-bold text-foreground">
										Step 3: Decryption Complete
									</h2>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-accent">
												Encrypted Measurements
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														JSON.stringify(encryptionResult?.encryptedResult),
														"Encrypted measurements"
													)
												}
												className="text-accent hover:bg-accent/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-accent/5 p-4 rounded-lg border-2 border-accent glow-quantum-strong font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{JSON.stringify(
												encryptionResult?.encryptedResult,
												null,
												2
											)}</pre>
										</div>
									</div>

									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-accent">
												Key
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(decryptionResult.key, "Key")
												}
												className="text-accent hover:bg-accent/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-accent/5 p-4 rounded-lg border-2 border-accent glow-quantum-strong font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{decryptionResult.key}</pre>
										</div>
									</div>

									<div className="space-y-2 min-w-0">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-accent">
												Decrypted Measurements
											</label>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														JSON.stringify(decryptionResult.decryptedResult),
														"Decrypted output"
													)
												}
												className="text-accent hover:bg-accent/10 [&:hover_svg]:text-black"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
										<div className="bg-accent/5 p-4 rounded-lg border-2 border-accent glow-quantum-strong font-mono text-sm text-foreground max-h-32 overflow-y-auto overflow-x-auto w-full hide-scrollbar">
											<pre className="whitespace-pre">{JSON.stringify(
												decryptionResult.decryptedResult,
												null,
												2
											)}</pre>
										</div>
									</div>
								</div>

								{encryptionResult && (
									<MeasurementChart
										measurements={encryptionResult.encryptedResult}
										title="Encrypted Measurement Outputs"
										isEncrypted={true}
									/>
								)}

								{decryptionResult && (
									<MeasurementChart
										measurements={decryptionResult.decryptedResult}
										title="Decrypted Measurement Outputs"
										isEncrypted={false}
									/>
								)}

								<div className="flex gap-4">
									<Button
										onClick={() => {
											setCircuitInput("");
											setEncryptionResult(null);
											setDecryptionResult(null);
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

			<Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>{currentImageTitle}</DialogTitle>
					</DialogHeader>
					{currentImageUrl && (
						<div className="flex justify-center items-center p-4">
							<img
								src={currentImageUrl}
								alt={currentImageTitle}
								className="max-w-full h-auto rounded-lg"
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default Index;
