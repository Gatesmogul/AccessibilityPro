import api from './api'; // Points directly to your updated api.ts configuration

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  success: boolean;
  status: string;
  data?: Product[];
  products?: Product[];
  message?: string;
}

export const productService = {
  /**
   * Fetches all products from the live Render database cluster.
   * Resolves cleanly to: GET https://accessibilitypro.onrender.com/api/v1/products
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // FIX: Using the relative suffix '/products' instead of '/' to avoid hitting the root route
      const response = await api.get<ProductResponse>('/products');
      
      if (response.data && response.data.success) {
        // Automatically accommodates either 'data' or 'products' array payload wrappers
        return response.data.data || response.data.products || [];
      }
      
      throw new Error(response.data?.message || 'Failed to extract production product inventory.');
    } catch (error: any) {
      console.error('Critical database read error within productService.getAllProducts:', error.message);
      throw error;
    }
  },

  /**
   * Fetches details for a single specific product entity.
   * Resolves cleanly to: GET https://accessibilitypro.onrender.com/api/v1/products/:id
   */
  getProductById: async (productId: string): Promise<Product> => {
    try {
      const response = await api.get<{ success: boolean; data: Product }>(`/products/${productId}`);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Target product profile metadata record could not be resolved.');
    } catch (error: any) {
      console.error(`Error resolving data matrix parameters for Product ID [${productId}]:`, error.message);
      throw error;
    }
  }
};

export default productService;
