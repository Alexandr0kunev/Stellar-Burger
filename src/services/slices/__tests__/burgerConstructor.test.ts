import burgerConstructorReducer, {
    addBun,
    addIngredient,
    removeIngredient,
    moveIngredient,
    resetConstructor
} from '../burgerConstructor';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('Тесты редюсера burgerConstructor', () => {
    const initialState = {
        items: {
            bun: null,
            ingredients: []
        }
    };

    test('Должен возвращать начальное состояние при передаче undefined и неизвестного экшена', () => {
        const result = burgerConstructorReducer(undefined, {type: 'UNKNOWN_ACTION'});
        expect(result).toEqual(initialState);
    });

    test('Должен добавлять булку (экшерн addBun)', () => {
        const mockBun: TIngredient = {
            _id: 'bun1',
            name: 'Булка',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 150,
            price: 100,
            image: 'bun.png',
            image_mobile: 'bun_m.png',
            image_large: 'bun_1.png',
        };

        const state = burgerConstructorReducer(initialState, addBun(mockBun));

        expect(state.items.bun).not.toBe(null);
        expect(state.items.bun?._id).toBe('bun1');
        expect(state.items.bun?.id).toBe('bun1-bun');
    });

    test('Должен добавлять ингредиент с генерацией ID (экшен addIngredient)', () => {
        const mockIngredient: TIngredient = {
            _id: 'ing1',
            name: 'Начинка',
            type: 'main',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 150,
            price: 50,
            image: 'ing.png',
            image_mobile: 'ing_m.png',
            image_large: 'img_l.png',
        };

        const state = burgerConstructorReducer(initialState, addIngredient(mockIngredient));

        expect(state.items.ingredients).toHaveLength(1);
        expect(state.items.ingredients[0]._id).toBe('ing1');
        expect(state.items.ingredients[0].id).toBeDefined();
        expect(typeof state.items.ingredients[0].id).toBe('string');
    });

    test('Должен удалять ингредиент по ID (экшен removeIngredient)', () => {
        const stateWithItems = {
            items: {
                bun: null,
                ingredients: [
                    {id: 'id-1', _id: 'ing1', name: 'Инг 1', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: ''},
                    {id: 'id-2', _id: 'ing2', name: 'Инг 2', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: ''}
                ] as TConstructorIngredient[]
            }
        };

        const state = burgerConstructorReducer(stateWithItems, removeIngredient('id-1'));

        expect(state.items.ingredients).toHaveLength(1);
        expect(state.items.ingredients[0].id).toBe('id-2');
    });

    test('Должен менять местами ингредиенты (экшен moveIngredient)', () => {
        const stateWithItems = {
            items: {
                bun: null,
                ingredients: [
                    {id: 'id-1', name: 'Первый'} as TConstructorIngredient,
                    {id: 'id-2', name: 'Второй'} as TConstructorIngredient
                ]
            }
        };

        const state = burgerConstructorReducer(stateWithItems, moveIngredient({dragIndex: 0, hoverIndex: 1}));

        expect(state.items.ingredients[0].name).toBe('Второй');
        expect(state.items.ingredients[1].name).toBe('Первый');
    });

    test('Должен очищать конструктор (экшен resetConstructor)', () => {
        const stateWithItems = {
            items: {
                bun: {id: 'bun-id'} as TConstructorIngredient,
                ingredients: [{id: 'ing-id'} as TConstructorIngredient]
            }
        };

        const state = burgerConstructorReducer(stateWithItems, resetConstructor());

        expect(state.items.bun).toBe(null);
        expect(state.items.ingredients).toHaveLength(0);
    });
});
