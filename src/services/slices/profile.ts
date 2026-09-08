import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type TProfileState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getUserOrders = createAsyncThunk(
  'profile/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();

      if (Array.isArray(response)) {
        return response as TOrder[];
      }
      return (response as TOrdersData).orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказов');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default profileSlice.reducer;
