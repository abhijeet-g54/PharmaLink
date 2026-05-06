import { Sparkles } from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: string[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#F0FDF4] to-white border border-[#D1FAE5] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#10B981]" />
        <h2 className="text-[15px] text-[#0A0A0A]">Alternative Options</h2>
      </div>
      <div className="space-y-2">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] hover:border-[#10B981] hover:shadow-sm transition-all cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
