import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: Filters) => void;
}

export interface Filters {
  priceRange: [number, number];
  manufacturers: string[];
  availability: string[];
  prescriptionRequired: boolean | null;
}

const MANUFACTURERS = ['GlaxoSmithKline', 'Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Micro Labs', 'Mankind', 'Alkem'];
const AVAILABILITY_OPTIONS = ['In Stock', 'Low Stock'];

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    manufacturers: [],
    availability: [],
    prescriptionRequired: null,
  });

  const [priceMin, setPriceMin] = useState('0');
  const [priceMax, setPriceMax] = useState('1000');

  const handleManufacturerToggle = (manufacturer: string) => {
    const updated = filters.manufacturers.includes(manufacturer)
      ? filters.manufacturers.filter(m => m !== manufacturer)
      : [...filters.manufacturers, manufacturer];

    const newFilters = { ...filters, manufacturers: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityToggle = (option: string) => {
    const updated = filters.availability.includes(option)
      ? filters.availability.filter(a => a !== option)
      : [...filters.availability, option];

    const newFilters = { ...filters, availability: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = () => {
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || 1000;
    const newFilters = { ...filters, priceRange: [min, max] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters: Filters = {
      priceRange: [0, 1000],
      manufacturers: [],
      availability: [],
      prescriptionRequired: null,
    };
    setFilters(resetFilters);
    setPriceMin('0');
    setPriceMax('1000');
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = filters.manufacturers.length > 0 ||
                           filters.availability.length > 0 ||
                           filters.prescriptionRequired !== null ||
                           filters.priceRange[0] !== 0 ||
                           filters.priceRange[1] !== 1000;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
          <h2 className="text-[15px] text-[#0A0A0A]">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[12px] text-[#10B981] hover:text-[#059669] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[13px] text-[#374151] mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={handlePriceChange}
              placeholder="Min"
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
            />
            <span className="text-[#9CA3AF]">-</span>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={handlePriceChange}
              placeholder="Max"
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
            />
          </div>
        </div>

        <div>
          <h3 className="text-[13px] text-[#374151] mb-3">Availability</h3>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(option)}
                  onChange={() => handleAvailabilityToggle(option)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
                <span className="text-[13px] text-[#6B7280] group-hover:text-[#374151] transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] text-[#374151] mb-3">Manufacturer</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {MANUFACTURERS.map((manufacturer) => (
              <label key={manufacturer} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.manufacturers.includes(manufacturer)}
                  onChange={() => handleManufacturerToggle(manufacturer)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
                <span className="text-[13px] text-[#6B7280] group-hover:text-[#374151] transition-colors">
                  {manufacturer}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] text-[#374151] mb-3">Prescription</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="prescription"
                checked={filters.prescriptionRequired === false}
                onChange={() => {
                  const newFilters = { ...filters, prescriptionRequired: false };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-4 h-4 border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
              <span className="text-[13px] text-[#6B7280] group-hover:text-[#374151] transition-colors">
                No Prescription Required
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="prescription"
                checked={filters.prescriptionRequired === true}
                onChange={() => {
                  const newFilters = { ...filters, prescriptionRequired: true };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-4 h-4 border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
              <span className="text-[13px] text-[#6B7280] group-hover:text-[#374151] transition-colors">
                Prescription Required
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="prescription"
                checked={filters.prescriptionRequired === null}
                onChange={() => {
                  const newFilters = { ...filters, prescriptionRequired: null };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-4 h-4 border-[#D1D5DB] text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
              <span className="text-[13px] text-[#6B7280] group-hover:text-[#374151] transition-colors">
                All
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
