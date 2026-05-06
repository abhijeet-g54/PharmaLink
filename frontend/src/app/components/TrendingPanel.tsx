import { TrendingUp } from 'lucide-react';

interface TrendingItem {
  name: string;
  count: number;
}

interface TrendingPanelProps {
  trending: TrendingItem[];
}

export function TrendingPanel({ trending }: TrendingPanelProps) {
  if (trending.length === 0) return null;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-[#6366F1]" />
        <h2 className="text-[15px] text-[#0A0A0A]">Trending Now</h2>
      </div>
      <div className="space-y-2">
        {trending.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg hover:bg-white hover:border-[#6366F1] hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-[11px]">
                {index + 1}
              </div>
              <span className="text-[13px] text-[#374151] group-hover:text-[#6366F1] transition-colors">{item.name}</span>
            </div>
            <span className="text-[12px] text-[#9CA3AF] tabular-nums">{item.count.toLocaleString()} searches</span>
          </div>
        ))}
      </div>
    </div>
  );
}
