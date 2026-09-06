import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderBurgerApi } from "@api";
import { TOrder } from "@utils-types";

export type TOrderState = {
    orderRequest: boolean;
    orderModalData: TOrder | null;
    orderError: string | null;
};

const initialState: TOrderState = {
    orderRequest: false,
    orderModalData: null,
    orderError: null
};

export const orderBurger = createAsyncThunk(
    'order/orderBurger',
    async (ingredients: string[], {rejectWithValue}) => {
        try {
            const response = await orderBurgerApi(ingredients);
            return response.order;
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка оформления заказа");
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderModal: (state) => {
            state.orderModalData = null;
            state.orderError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(orderBurger.pending, (state) => {
                state.orderRequest = true;
                state.orderError = null;
            })
            .addCase(orderBurger.fulfilled, (state, action) => {
                state.orderRequest = false;
                state.orderModalData = action.payload as unknown as TOrder;
            })
            .addCase(orderBurger.rejected, (state, action) => {
                state.orderRequest = false;
                state.orderError = action.payload as string;
            });
    }
});

export const {resetOrderModal} = orderSlice.actions;
export default orderSlice.reducer;
