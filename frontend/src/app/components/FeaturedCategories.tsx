import { Pill, Heart, Thermometer, Activity, Baby, Sparkles } from 'lucide-react';

interface FeaturedCategoriesProps {
  onCategoryClick: (category: string) => void;
}

const CATEGORIES = [
  { name: 'Pain Relief', icon: Pill, color: 'from-[#EF4444] to-[#DC2626]' },
  { name: 'Cardiac Care', icon: Heart, color: 'from-[#EC4899] to-[#DB2777]' },
  { name: 'Fever & Cold', icon: Thermometer, color: 'from-[#F59E0B] to-[#D97706]' },
  { name: 'Vitamins', icon: Sparkles, color: 'from-[#10B981] to-[#059669]' },
  { name: 'Wellness', icon: Activity, color: 'from-[#3B82F6] to-[#2563EB]' },
  { name: 'Baby Care', icon: Baby, color: 'from-[#8B5CF6] to-[#7C3AED]' },
];

export function FeaturedCategories({ onCategoryClick }: FeaturedCategoriesProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[18px] text-[#0A0A0A] mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => onCategoryClick(category.name)}
                className="group relative bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[15px] text-[#0A0A0A] group-hover:text-[#10B981] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#F0FDF4] to-white border border-[#D1FAE5] rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Pill className="w-8 h-8 text-[#10B981]" />
        </div>
        <h3 className="text-[16px] text-[#0A0A0A] mb-2">Search for any medicine</h3>
        <p className="text-[13px] text-[#6B7280] max-w-md mx-auto">
          Enter a medicine name in the search bar above to find availability, prices, and alternatives across all connected pharmacies
        </p>
      </div>
    </div>
  );
}
