import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export type TConstructorState = {
  items: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorState = {
  items: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.items.bun = { ...action.payload, id: `${action.payload._id}-bun` };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.items.ingredients.push({
        ...action.payload,
        id: `${action.payload._id}-${Date.now()}`
      });
    }
  }
});

export const { addBun, addIngredient } = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
