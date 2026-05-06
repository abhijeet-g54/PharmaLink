import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShieldCheck, Package, Beaker } from 'lucide-react';

interface MedicineCardProps {
  id?: number;
  name: string;
  dosage: string;
  form: string;
  compound: string;
  compoundDosage: string;
  manufacturer: string;
  price: number; // This is the Base Price
  discount: number; // This is the %
  stock: number;
  isNppaRegulated?: boolean;
  packaging?: string;
  imageUrl?: string;
  pharmacyDetails?: {
    name: string;
    address: string;
    phone: string;
  };
  isSelected?: boolean;
  onCompareToggle?: () => void;
}

export function MedicineCard({
  name,
  dosage,
  form,
  compound,
  compoundDosage,
  manufacturer,
  price,
  discount,
  stock,
  isNppaRegulated,
  packaging,
  imageUrl,
  pharmacyDetails,
  isSelected = false,
  onCompareToggle,
}: MedicineCardProps) {
  // Logic Fixes
  const stockLevel = stock > 50 ? 'high' : stock > 20 ? 'medium' : 'low';
  const inStock = stock > 0;
  
  // Calculate final price based on the discount % from data.json
  const finalPrice = price - (price * (discount / 100));

  return (
    <div className={`bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative ${
      isSelected ? 'border-[#10B981] ring-2 ring-[#10B981]/20' : 'border-[#e5e7eb]'
    }`}>
      {onCompareToggle && (
        <div className="absolute top-4 right-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onCompareToggle();
            }}
            className="w-5 h-5 rounded border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 cursor-pointer"
          />
        </div>
      )}
      <div className="flex gap-4 p-4">
        {/* Image Section */}
        <div className="w-24 h-24 flex-shrink-0 bg-[#F9FAFB] rounded-lg flex items-center justify-center overflow-hidden border border-[#F3F4F6]">
          {imageUrl ? (
            <ImageWithFallback
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Package className="w-10 h-10 text-[#D1D5DB]" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              {/* Title: Brand + Dosage + Form */}
              <h3 className="text-[15px] font-bold text-[#0A0A0A] mb-1 group-hover:text-[#10B981] transition-colors">
                {name} {dosage} {form}
              </h3>
              
              {/* NPPA Tag */}
              {isNppaRegulated && (
                <p className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded inline-block uppercase mb-2">
                  NPPA Regulated
                </p>
              )}

              {/* Composition/Salt Info */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] mb-1">
                <Beaker className="w-3 h-3" />
                <span className="truncate">Contains: {compound} ({compoundDosage})</span>
              </div>
              
              {manufacturer && (
                <p className="text-[12px] text-[#9CA3AF]">Marketer: {manufacturer}</p>
              )}
            </div>

            {discount > 0 && (
              <div className="bg-[#10B981] text-white px-2 py-1 rounded-md text-[11px] font-bold flex-shrink-0">
                {discount}% OFF
              </div>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              {/* Pharmacy Details */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="font-medium text-[#374151]">{pharmacyDetails?.name || 'Local Pharmacy'}</span>
              </div>
              
              {inStock && (
                <div className={`w-fit px-2 py-0.5 rounded text-[11px] ${
                  stockLevel === 'high'
                    ? 'bg-[#D1FAE5] text-[#065F46]'
                    : stockLevel === 'medium'
                    ? 'bg-[#FEF3C7] text-[#92400E]'
                    : 'bg-[#FEE2E2] text-[#991B1B]'
                }`}>
                  {stock} left • {packaging || 'strip'}
                </div>
              )}
            </div>

            <div className="text-right">
              {/* Price Calculation Display */}
              {discount > 0 && (
                <div className="text-[12px] text-[#9CA3AF] line-through">
                  ₹{price.toFixed(2)}
                </div>
              )}
              <div className="text-[20px] font-bold text-[#0A0A0A]">
                ₹{finalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}