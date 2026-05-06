// API Configuration (ONLY search-service)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Types
 */
export interface Medicine {
  name: string;
  pharmacy: string;
  stock: number;
  price: number;
  originalPrice?: number;
  manufacturer?: string;
  dosageForm?: string;
  imageUrl?: string;
  prescriptionRequired?: boolean;
}

export interface TrendingItem {
  name: string;
  count: number;
}

export interface SearchResponse {
  results: Medicine[];
  recommendations: string[];
  trending: TrendingItem[];
}

/**
 * MAIN SEARCH (ONLY REQUIRED CALL)
 * Frontend → Search Service → all microservices internally
 */
export async function searchMedicines(
  name: string
): Promise<SearchResponse> {
  const response = await fetch(
    `${API_BASE_URL}/search?name=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    results: data.results || [],
    recommendations: data.recommendations || [],
    trending: data.trending || [],
  };
}