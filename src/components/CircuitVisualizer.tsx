import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface CircuitVisualizerProps {
  circuit: string;
  title: string;
}

export const CircuitVisualizer = ({ circuit, title }: CircuitVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !circuit) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = "hsl(var(--background))";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Parse QASM (simplified - looks for gate patterns)
    const lines = circuit.split("\n").filter(line => 
      line.trim() && !line.startsWith("//") && !line.startsWith("OPENQASM") && !line.startsWith("include")
    );

    // Draw quantum circuit visualization
    const numQubits = Math.min(5, lines.length || 3);
    const qubitSpacing = canvas.height / (numQubits + 1);
    const gateWidth = 50;
    const gateSpacing = 80;

    // Draw qubit lines
    ctx.strokeStyle = "hsl(var(--quantum))";
    ctx.lineWidth = 2;
    for (let i = 0; i < numQubits; i++) {
      const y = qubitSpacing * (i + 1);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(canvas.width - 40, y);
      ctx.stroke();

      // Draw qubit label
      ctx.fillStyle = "hsl(var(--quantum))";
      ctx.font = "14px monospace";
      ctx.fillText(`q[${i}]`, 10, y + 5);
    }

    // Draw gates
    let xPos = 80;
    lines.forEach((line, idx) => {
      if (idx >= 10) return; // Limit visualization

      const y = qubitSpacing * ((idx % numQubits) + 1);
      
      // Determine gate type
      let gateType = "H";
      if (line.includes("cx") || line.includes("CNOT")) gateType = "CNOT";
      else if (line.includes("x")) gateType = "X";
      else if (line.includes("y")) gateType = "Y";
      else if (line.includes("z")) gateType = "Z";
      else if (line.includes("h")) gateType = "H";
      else if (line.includes("t")) gateType = "T";
      else if (line.includes("s")) gateType = "S";

      // Draw gate box
      ctx.fillStyle = "hsl(var(--primary))";
      ctx.fillRect(xPos, y - 20, gateWidth, 40);
      
      ctx.strokeStyle = "hsl(var(--primary-foreground))";
      ctx.lineWidth = 2;
      ctx.strokeRect(xPos, y - 20, gateWidth, 40);

      // Draw gate label
      ctx.fillStyle = "hsl(var(--primary-foreground))";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(gateType, xPos + gateWidth / 2, y + 6);

      xPos += gateSpacing;
      if (xPos > canvas.width - 120) xPos = 80;
    });

    ctx.textAlign = "left";
  }, [circuit]);

  return (
    <Card className="p-4 bg-quantum-surface border-quantum glow-quantum">
      <h3 className="text-sm font-medium text-quantum mb-3">{title}</h3>
      <canvas 
        ref={canvasRef} 
        className="w-full rounded-lg bg-background/50"
        style={{ minHeight: "300px" }}
      />
    </Card>
  );
};
