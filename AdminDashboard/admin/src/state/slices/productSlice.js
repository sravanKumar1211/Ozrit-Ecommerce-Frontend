import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "@/services/productService";

const initialState = {
  products: [],
  product: null,
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load products");
    }
  },
);

export const loadProduct = createAsyncThunk(
  "products/loadProduct", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load product");
    }
  }
);

export const createNewProduct = createAsyncThunk(
  "products/createNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createProduct(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  },
);

export const editProduct = createAsyncThunk(
  "products/editProduct", 
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id);
      return { id, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOAD ALL PRODUCTS
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 10;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOAD SINGLE PRODUCT
      .addCase(loadProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.product || action.payload;
      })
      .addCase(loadProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE NEW PRODUCT
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        
        const newProduct = action.payload?.product || action.payload;

        if (newProduct) {
          // Standardize relationships with uppercase keys to match your PascalCase UI rendering
          const standardizedProduct = {
            ...newProduct,
            Category: typeof newProduct.Category === "object" 
              ? newProduct.Category 
              : { _id: newProduct.Category, name: "Pending..." },
              
            SubCategory: typeof newProduct.SubCategory === "object" 
              ? newProduct.SubCategory 
              : { _id: newProduct.SubCategory, name: "Pending..." },
              
            Brand: typeof newProduct.Brand === "object" 
              ? newProduct.Brand 
              : { _id: newProduct.Brand, name: "Pending..." }
          };

          state.products.unshift(standardizedProduct);
          state.total += 1;
        }
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // EDIT PRODUCT
    
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = null;
        
        const updatedProduct = action.payload?.product || action.payload;

        if (updatedProduct) {
          const targetId = updatedProduct._id || updatedProduct.id;
          const index = state.products.findIndex(
            (p) => String(p._id || p.id) === String(targetId)
          );

          if (index !== -1) {
            const oldProduct = state.products[index];

            state.products[index] = {
              ...updatedProduct,
              Category: typeof updatedProduct.Category === "object" 
                ? updatedProduct.Category 
                : oldProduct.Category,
              SubCategory: typeof updatedProduct.SubCategory === "object" 
                ? updatedProduct.SubCategory 
                : oldProduct.SubCategory,
              Brand: typeof updatedProduct.Brand === "object" 
                ? updatedProduct.Brand 
                : oldProduct.Brand,
            };
          }
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ==========================================
      // REMOVE PRODUCT
      // ==========================================
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.payload?.id;
        
        // Remove item safely checking string values across alternate ID styles
        state.products = state.products.filter(
          (item) => String(item._id || item.id) !== String(targetId)
        );
        if (state.total > 0) state.total -= 1;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;