import { X, CheckCircle2, XCircle } from 'lucide-react';

interface Medicine {
  name: string;
  pharmacy: string;
  stock: number;
  price: number;
  originalPrice?: number;
  manufacturer?: string;
  dosageForm?: string;
}

interface CompareModalProps {
  medicines: Medicine[];
  onClose: () => void;
}

export function CompareModal({ medicines, onClose }: CompareModalProps) {
  if (medicines.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h2 className="text-[18px] text-[#0A0A0A]">Compare Medicines</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="overflow-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine, index) => (
              <div key={index} className="border border-[#E5E7EB] rounded-xl p-5 bg-[#FAFAFA]">
                <h3 className="text-[16px] text-[#0A0A0A] mb-4 pb-4 border-b border-[#E5E7EB]">
                  {medicine.name}
                </h3>

                <div className="space-y-3 text-[13px]">
                  <div>
                    <div className="text-[#9CA3AF] mb-1">Pharmacy</div>
                    <div className="text-[#374151]">{medicine.pharmacy}</div>
                  </div>

                  <div>
                    <div className="text-[#9CA3AF] mb-1">Price</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] text-[#0A0A0A]">₹{medicine.price.toFixed(2)}</span>
                      {medicine.originalPrice && (
                        <span className="text-[12px] text-[#9CA3AF] line-through">
                          ₹{medicine.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {medicine.manufacturer && (
                    <div>
                      <div className="text-[#9CA3AF] mb-1">Manufacturer</div>
                      <div className="text-[#374151]">{medicine.manufacturer}</div>
                    </div>
                  )}

                  {medicine.dosageForm && (
                    <div>
                      <div className="text-[#9CA3AF] mb-1">Dosage Form</div>
                      <div className="text-[#374151]">{medicine.dosageForm}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-[#9CA3AF] mb-1">Availability</div>
                    <div className="flex items-center gap-1.5">
                      {medicine.stock > 0 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                          <span className="text-[#10B981]">{medicine.stock} in stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#EF4444]" />
                          <span className="text-[#EF4444]">Out of stock</span>
                        </>
                      )}
                    </div>
                  </div>

                  {medicine.originalPrice && (
                    <div>
                      <div className="text-[#9CA3AF] mb-1">Savings</div>
                      <div className="text-[#10B981]">
                        ₹{(medicine.originalPrice - medicine.price).toFixed(2)} (
                        {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% off)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-[14px] text-[#374151] hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
