import api from './api';
import { ProductItem } from '@components/customer/ProductCard'; 
import { ListingFormData } from '@components/owner/ListingForm'; 

/**
 * Server Response Wrapper Layouts
 */
export interface ProductResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const productService = {
  /**
   * Fetch all global listings across the system marketplace index feed.
   * @param filters - Optional query parameters to isolate specific asset categories or status types.
   */
  async getAllProducts(filters?: { category?: string; status?: string }): Promise<ProductItem[]> {
    try {
      const response = await api.get<ProductResponse<ProductItem[]>>('/products', { params: filters });
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to query the global real estate marketplace index feed.'
      );
    }
  },

  /**
   * Isolate and retrieve listings managed exclusively by the authenticated Owner/Real Estate Business profile.
   */
  async getOwnerProducts(): Promise<ProductItem[]> {
    try {
      const response = await api.get<ProductResponse<ProductItem[]>>('/products/owner/listings');
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch listings linked to your merchant account token.'
      );
    }
  },

  /**
   * Provision and automatically publish a brand-new real estate asset onto the platform homepage feed.
   * @param payload - Structured form dataset gathered from the owner listing entry panels.
   */
  async createProduct(payload: ListingFormData): Promise<ProductItem> {
    try {
      const response = await api.post<ProductResponse<ProductItem>>('/products', payload);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to transmit and host your new structural product record.'
      );
    }
  },

  /**
   * Modify structural attributes, pricing tiers, or availability states for an existing listing.
   * @param id - The unique backend asset UUID or database identifier string sequence.
   * @param payload - Partial data fields requiring patch alterations.
   */
  async updateProduct(id: string, payload: Partial<ListingFormData & { availability: string }>): Promise<ProductItem> {
    try {
      const response = await api.put<ProductResponse<ProductItem>>(`/products/${id}`, payload);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        `Failed to push configuration alterations to product entry ${id}.`
      );
    }
  },

  /**
   * Purge an asset listing completely out of the database architecture.
   * @param id - The unique identifier associated with the targeted property document.
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to erase the requested product index record from storage blocks.'
      );
    }
  }
};