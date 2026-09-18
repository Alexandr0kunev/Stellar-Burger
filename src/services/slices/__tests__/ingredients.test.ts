import ingredientsReducer, {getIngredients} from '../ingredients';
import { TIngredient } from '@utils-types';

describe('Тесты редьюсера ingredients', () => {
    const initialState = {
        ingredients: [],
        isLoading: false,
        error: null
    };

    test('Должен возвращать начальное состояние при передаче undefined и неизвестного экшена', () => {
        const result =  ingredientsReducer(undefined, {type: 'UNKNOWN_ACTION'});
        expect(result).toEqual(initialState);
    });

    test('Должен обрабатывать экшен getIngredients.pending', () => {
        const action = {type: getIngredients.pending.type};
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.ingredients).toEqual([]);
    });

    test('Должен обрабатывать экшен getIngredients.fulfilled', () => {
        const mockIngredients: TIngredient[] = [
            {
                _id: '1',
                name: 'Флюоресцентная булка',
                type: 'bun',
                proteins: 10,
                fat: 5,
                carbohydrates: 20,
                calories: 150,
                price: 100,
                image: 'image.png',
                image_mobile: 'image_mobile.png',
                image_large: 'image_large.png',
            }
        ];

        const action = {type: getIngredients.fulfilled.type, payload: mockIngredients};
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);
        expect(state.ingredients).toEqual(mockIngredients);
    });

    test('Должен обрабатывать экшен getIngredients.rejected', () => {
        const action = {
            type: getIngredients.rejected.type,
            error: {message: 'Network Error'}
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Network Error');
        expect(state.ingredients).toEqual([]);
    });
});
