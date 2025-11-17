import { useState, useEffect } from "react";

interface LifeCacheData {
  lifeAtCompany: any;
  eventsBanner: any;
  timestamp?: string;
}

interface UseLifeCacheResult {
  data: LifeCacheData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch life page data from cache API
 * Falls back to GraphQL if cache API fails
 */
export function useLifeCache(): UseLifeCacheResult {
  const [data, setData] = useState<LifeCacheData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      if (useCache) {
        // Try to fetch from cache API first
        const response = await fetch("/api/life-cache");
        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
          setLoading(false);
          return;
        }
      }

      // If cache fails or useCache is false, fetch from GraphQL
      // This will be handled by the components using useQuery as fallback
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
      setLoading(false);
    }
  };

  const refetch = async () => {
    // Force refresh by calling POST endpoint
    try {
      setLoading(true);
      const response = await fetch("/api/life-cache", { method: "POST" });
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh cache"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch };
}

