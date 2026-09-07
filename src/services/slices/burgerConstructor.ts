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

const generateId = () => Math.random().toString(36).substring(2, 9);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.items.bun = { ...action.payload, id: `${action.payload._id}-bun` };
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.items.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: generateId()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    resetConstructor: (state) => {
      state.items.bun = null;
      state.items.ingredients = [];
    }
  }
});

export const { addBun, addIngredient, removeIngredient, resetConstructor } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
