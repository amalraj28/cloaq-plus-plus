import { Card } from "@/components/ui/card";

interface MeasurementChartProps {
  measurements: string;
  title: string;
  isEncrypted?: boolean;
}

export const MeasurementChart = ({ measurements, title, isEncrypted }: MeasurementChartProps) => {
  const bits = measurements.split("");
  
  return (
    <Card className={`p-4 ${isEncrypted ? 'bg-quantum-surface' : 'bg-accent/10'} border-quantum glow-quantum`}>
      <h3 className="text-sm font-medium text-quantum mb-4">{title}</h3>
      <div className="flex gap-2 justify-center items-end" style={{ minHeight: "120px" }}>
        {bits.map((bit, idx) => {
          const height = bit === "1" ? 100 : 40;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div 
                className={`w-12 rounded-t-lg transition-all duration-500 ${
                  bit === "1" 
                    ? isEncrypted ? 'bg-primary' : 'bg-accent' 
                    : 'bg-muted'
                } glow-quantum`}
                style={{ height: `${height}px` }}
              />
              <span className="text-xs font-mono text-quantum">{bit}</span>
              <span className="text-xs text-muted-foreground">q{idx}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
