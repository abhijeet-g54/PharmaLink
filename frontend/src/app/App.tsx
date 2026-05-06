import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { MedicineCard } from './components/MedicineCard';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { TrendingPanel } from './components/TrendingPanel';
import { FilterPanel, type Filters } from './components/FilterPanel';
import { FeaturedCategories } from './components/FeaturedCategories';
import { CompareModal } from './components/CompareModal';
import { PharmacyLocator } from './components/PharmacyLocator';
import { GitCompareArrows } from 'lucide-react';
import * as api from './services/api';
import { Routes, Route } from "react-router-dom";
import VendorDashboard from "./vendor/VendorDashboard";

type Medicine = api.Medicine;
type SearchResponse = api.SearchResponse;
type Pharmacy = api.Pharmacy;

export default function App() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    manufacturers: [],
    availability: [],
    prescriptionRequired: null,
  });
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [connectedPharmacyCount, setConnectedPharmacyCount] = useState<number>(0);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔥 VENDOR LOGIN DETECTION (NEW)
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const pharmacyId = params.get("pharmacyId");

    if (token && pharmacyId) {
      localStorage.setItem("vendor_token", token);
      localStorage.setItem("pharmacyId", pharmacyId);

      window.location.href = "/vendor";
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setSelectedForCompare([]);
    setError(null);

    try {
      const data = await api.searchMedicines(query);

      if (data.totalPharmacies !== undefined) {
        setConnectedPharmacyCount(data.totalPharmacies);
      }

      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search medicines. Please check if your microservices are running.');
      setSearchResults({ results: [], recommendations: [], trending: [], totalPharmacies: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setPharmaciesLoading(true);
      try {
        const data = await api.getNearbyPharmacies();
        setPharmacies(data);
        setConnectedPharmacyCount(data.length);
      } catch (err) {
        console.error('Error loading initial pharmacies:', err);
        setPharmacies([]);
      } finally {
        setPharmaciesLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleCompareToggle = (index: number) => {
    setSelectedForCompare((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenCompare = () => {
    setShowCompareModal(true);
  };

  const filteredResults = searchResults?.results.filter((medicine) => {
    const sellingPrice = medicine.price - (medicine.price * (medicine.discount / 100));

    if (sellingPrice < filters.priceRange[0] || sellingPrice > filters.priceRange[1]) {
      return false;
    }

    if (filters.manufacturers.length > 0) {
      if (!medicine.manufacturer || !filters.manufacturers.includes(medicine.manufacturer)) {
        return false;
      }
    }

    if (filters.availability.length > 0) {
      const stockLevel =
        medicine.stock > 50 ? 'In Stock' :
        medicine.stock > 0 ? 'Low Stock' :
        'Out of Stock';

      if (!filters.availability.includes(stockLevel)) {
        return false;
      }
    }

    return true;
  }) || [];

  return (
    <Routes>

      {/* MAIN USER DASHBOARD */}
      <Route path="/" element={
        <div className="min-h-screen bg-[#FAFAFA]">

          <header className="bg-white border-b border-[#E5E7EB] shadow-sm">
            <div className="max-w-[1440px] mx-auto px-8 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[22px] text-[#10B981] tracking-tight font-bold">PharmaLink</h1>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Medicine Intelligence System</p>
                </div>

                <div className="flex items-center gap-6 text-[13px] text-[#6B7280]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <div className={`w-2 h-2 ${connectedPharmacyCount > 0 ? 'bg-[#10B981]' : 'bg-gray-400'} rounded-full animate-pulse`}></div>
                    20 Pharmacies Connected
                  </span>

                  <button
                    onClick={() => {
                      window.location.href = "http://localhost:5004/login";
                    }}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-[13px] font-medium"
                  >
                    Vendor Login
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-[1440px] mx-auto px-8 py-12">
            <div className="mb-10">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-8">

              <aside>
                {hasSearched && <FilterPanel onFilterChange={handleFilterChange} />}
              </aside>

              <div className="min-h-[400px]">
                {error && (
                  <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-red-600">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-3 border-[#E5E7EB] border-t-[#10B981] rounded-full animate-spin"></div>
                    <p className="text-[13px] text-[#6B7280] mt-4">Verifying inventory across pharmacies...</p>
                  </div>
                ) : hasSearched && filteredResults.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-[15px] text-[#0A0A0A] mb-1">No medicines found</h3>
                    <p className="text-[13px] text-[#6B7280]">Try searching for the salt name (e.g., Paracetamol)</p>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <div className="text-[14px] text-[#374151]">
                        <span className="font-bold text-[#0A0A0A]">{filteredResults.length} options found</span>
                      </div>

                      {selectedForCompare.length >= 2 && (
                        <button
                          onClick={handleOpenCompare}
                          className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-[13px]"
                        >
                          <GitCompareArrows className="w-4 h-4" />
                          Compare ({selectedForCompare.length})
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {filteredResults.map((medicine, index) => (
                        <MedicineCard
                          key={medicine.id || index}
                          {...medicine}
                          isSelected={selectedForCompare.includes(index)}
                          onCompareToggle={() => handleCompareToggle(index)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <FeaturedCategories onCategoryClick={handleSearch} />
                )}
              </div>

              <aside className="space-y-6">
                {searchResults && (searchResults.recommendations.length > 0 || searchResults.trending.length > 0) ? (
                  <>
                    <RecommendationsPanel recommendations={searchResults.recommendations} />
                    <TrendingPanel trending={searchResults.trending} />
                  </>
                ) : (
                  <PharmacyLocator pharmacies={pharmacies} isLoading={pharmaciesLoading} />
                )}
              </aside>

            </div>
          </main>

          {showCompareModal && (
            <CompareModal
              medicines={selectedForCompare.map((index) => filteredResults[index])}
              onClose={() => setShowCompareModal(false)}
            />
          )}

        </div>
      } />

      {/* VENDOR DASHBOARD */}
      <Route path="/vendor" element={<VendorDashboard />} />

    </Routes>
  );
}