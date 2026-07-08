import { create } from 'zustand';
import { productService } from '../services/productService';
import { ProductItem } from '@components/customer/ProductCard'; 

interface ProductState {
  listings: ProductItem[];
  ownerListings: ProductItem[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAll: number | null; // Unix timestamp
  lastFetchedOwner: number | null; // Unix timestamp

  // Actions
  fetchListings: (forceRefresh?: boolean) => Promise<void>;
  fetchOwnerListings: (forceRefresh?: boolean) => Promise<void>;
  clearCache: () => void;
  
  // Optimistic Cache Eviction & Sync hooks for CRUD operations
  addListingToCache: (newProperty: ProductItem) => void;
  updateListingInCache: (updatedProperty: ProductItem) => void;
  removeListingFromCache: (id: string) => void;
}

// 5 minutes cache lifetime buffer configuration (5 * 60 * 1000 ms)
const CACHE_STALE_TIME_MS = 300000; 

export const useProductStore = create<ProductState>((set, get) => ({
  listings: [],
  ownerListings: [],
  isLoading: false,
  error: null,
  lastFetchedAll: null,
  lastFetchedOwner: null,

  /**
   * Fetches global real estate listings with built-in cache validation logic
   */
  fetchListings: async (forceRefresh = false) => {
    const { lastFetchedAll, listings, isLoading } = get();
    const now = Date.now();

    // Skip network round-trips if data exists and hasn't expired yet
    if (
      !forceRefresh && 
      !isLoading &&
      listings.length > 0 && 
      lastFetchedAll && 
      (now - lastFetchedAll < CACHE_STALE_TIME_MS)
    ) {
      return; // Return instantly with zero loading state or network overhead
    }

    set({ isLoading: true, error: null });
    try {
      const data = await productService.getAllProducts();
      set({ 
        listings: data, 
        lastFetchedAll: now, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.message || 'An error occurred while synchronizing listings.', 
        isLoading: false 
      });
    }
  },

  /**
   * Fetches real estate listings owned by the logged-in user with caching logic
   */
  fetchOwnerListings: async (forceRefresh = false) => {
    const { lastFetchedOwner, ownerListings, isLoading } = get();
    const now = Date.now();

    if (
      !forceRefresh && 
      !isLoading &&
      ownerListings.length > 0 && 
      lastFetchedOwner && 
      (now - lastFetchedOwner < CACHE_STALE_TIME_MS)
    ) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await productService.getOwnerProducts();
      set({ 
        ownerListings: data, 
        lastFetchedOwner: now, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.message || 'An error occurred fetching owner specific records.', 
        isLoading: false 
      });
    }
  },

  /**
   * Clears the cache to ensure clean sign-out memory boundaries
   */
  clearCache: () => set({ 
    listings: [], 
    ownerListings: [], 
    lastFetchedAll: null, 
    lastFetchedOwner: null,
    error: null 
  }),

  /**
   * Optimistically adds a newly created property to the local state
   */
  addListingToCache: (newProperty) => {
    set((state) => ({
      listings: [newProperty, ...state.listings],
      ownerListings: [newProperty, ...state.ownerListings]
    }));
  },

  /**
   * Optimistically updates a property across all active memory caches
   */
  updateListingInCache: (updatedProperty) => {
    const updateMap = (item: ProductItem) => item.id === updatedProperty.id ? updatedProperty : item;
    set((state) => ({
      listings: state.listings.map(updateMap),
      ownerListings: state.ownerListings.map(updateMap)
    }));
  },

  /**
   * Optimistically purges a deleted item from the cache immediately
   */
  removeListingFromCache: (id) => {
    const filterMap = (item: ProductItem) => item.id !== id;
    set((state) => ({
      listings: state.listings.filter(filterMap),
      ownerListings: state.ownerListings.filter(filterMap)
    }));
  }}
));