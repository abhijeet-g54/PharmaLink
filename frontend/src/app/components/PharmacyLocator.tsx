import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

interface Pharmacy {
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  coordinates: [number, number];
}

interface PharmacyLocatorProps {
  pharmacies: Pharmacy[];
  isLoading?: boolean;
}

export function PharmacyLocator({ pharmacies, isLoading = false }: PharmacyLocatorProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-[15px] text-[#0A0A0A]">Nearby Pharmacies</h2>
          </div>
          <button className="text-[13px] text-[#10B981] hover:text-[#059669] transition-colors">
            Change Location
          </button>
        </div>
      </div>

      <div className="relative bg-[#F3F4F6] h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-[#9CA3AF] mx-auto mb-2" />
            <p className="text-[13px] text-[#6B7280]">Map view placeholder</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Interactive map would display here</p>
          </div>
        </div>

        <div className="absolute inset-0 opacity-20">
          {pharmacies.map((pharmacy, index) => (
            <div
              key={index}
              className="absolute w-8 h-8 bg-[#10B981] rounded-full border-4 border-white shadow-lg"
              style={{
                left: `${20 + (index * 20)}%`,
                top: `${30 + (index * 15)}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#E5E7EB] max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#E5E7EB] border-t-[#10B981] rounded-full animate-spin"></div>
            <p className="text-[12px] text-[#6B7280] mt-3">Loading pharmacies...</p>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[13px] text-[#6B7280]">No pharmacies found</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Check your location settings</p>
          </div>
        ) : (
          pharmacies.map((pharmacy, index) => (
            <div
              key={index}
              className="p-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[14px] text-[#0A0A0A] group-hover:text-[#10B981] transition-colors">
                      {pharmacy.name}
                    </h3>
                    <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                      {pharmacy.distance}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6B7280] mb-3">{pharmacy.address}</p>

                  <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {pharmacy.hours}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {pharmacy.phone}
                    </div>
                  </div>
                </div>

                <button className="p-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors opacity-0 group-hover:opacity-100">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
