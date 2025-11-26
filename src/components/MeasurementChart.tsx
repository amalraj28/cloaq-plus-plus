import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MeasurementChartProps {
  measurements: string;
  title: string;
  isEncrypted?: boolean;
}

export const MeasurementChart = ({ measurements, title, isEncrypted }: MeasurementChartProps) => {
  const bits = measurements.split("");
  
  return (
    <Card className={cn("measurement-chart glow-quantum", isEncrypted ? "measurement-chart-encrypted" : "measurement-chart-decrypted")}>
      <h3 className="measurement-chart-title">{title}</h3>
      <div className="measurement-bars">
        {bits.map((bit, idx) => {
          const height = bit === "1" ? 100 : 40;
          const barClass = bit === "1" 
            ? (isEncrypted ? "measurement-bar-1-encrypted" : "measurement-bar-1-decrypted")
            : "measurement-bar-0";
          
          return (
            <div key={idx} className="measurement-bar-container">
              <div 
                className={cn("measurement-bar glow-quantum", barClass)}
                style={{ height: `${height}px` }}
              />
              <span className="measurement-bit">{bit}</span>
              <span className="measurement-qubit">q{idx}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
