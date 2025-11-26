import { Card } from "@/components/ui/card";

interface MeasurementChartProps {
  measurements: Record<string, number>;
  title: string;
  isEncrypted?: boolean;
}

export const MeasurementChart = ({ measurements, title, isEncrypted }: MeasurementChartProps) => {
  const entries = Object.entries(measurements);
  const maxValue = Math.max(...entries.map(([_, count]) => count), 1);
  
  return (
    <Card className={`p-4 ${isEncrypted ? 'bg-quantum-surface' : 'bg-accent/10'} border-quantum glow-quantum`}>
      <h3 className="text-sm font-medium text-quantum mb-4">{title}</h3>
      <div className="flex gap-2 justify-center items-end" style={{ height: "250px" }}>
        {entries.map(([bitString, count]) => {
          const heightPx = (count / maxValue) * 200;
          return (
            <div key={bitString} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground text-center min-w-12">{count}</span>
              <div 
                className={`w-12 rounded-t-lg transition-all duration-500 ${
                  isEncrypted ? 'bg-primary' : 'bg-accent'
                } glow-quantum`}
                style={{ height: `${heightPx}px` }}
              />
              <span className="text-xs font-mono text-quantum text-center break-all min-w-12">{bitString}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
