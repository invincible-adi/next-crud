import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchProducts = createAsyncThunk('product/fetchProducts', async (token, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/product', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.products;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const addProduct = createAsyncThunk('product/addProduct', async ({ product, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.message;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const editProduct = createAsyncThunk('product/editProduct', async ({ product, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.message;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async ({ id, token }, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearProductMessage: (state) => {
            state.message = null;
        },
        clearProductError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Edit
            .addCase(editProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductMessage, clearProductError } = productSlice.actions;
export default productSlice.reducer; 