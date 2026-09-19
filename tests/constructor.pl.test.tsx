import { test, expect } from '@playwright/test';

const TEST_BUN_NAME = 'Краторная булка N-200i';
const TEST_FILLING_NAME = 'Биокотлета из марсианской Магнолии';

test.describe('Интеграционные тесты конструктора бургера', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/ingredients**', update: false });
    await page.routeFromHAR('tests/hars/auth-user.har', { url: '**/api/auth/user**', update: false });
    await page.routeFromHAR('tests/hars/auth-token.har', { url: '**/api/auth/token**', update: false });
    await page.routeFromHAR('tests/hars/order.har', { url: '**/api/orders**', update: false });
  });

  test('Добавление ингредиента в конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    const bunButton = page.locator('li').filter({ hasText: TEST_BUN_NAME }).getByRole('button', { name: 'Добавить' }).first();
    await bunButton.click();

    const constructorZone = page.getByTestId('constructor');
    await expect(constructorZone).not.toContainText('Выберите булки');
    await expect(constructorZone).toContainText(TEST_BUN_NAME);
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto('/');
    
    const bunCard = page.locator('li').filter({ hasText: TEST_BUN_NAME }).first();
    await bunCard.click();

    await expect(page.getByText('Детали ингредиента').first()).toBeVisible();
    await expect(page.getByText(TEST_BUN_NAME).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByText('Детали ингредиента').first()).not.toBeVisible();

    await bunCard.click();
    await expect(page.getByText('Детали ингредиента').first()).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(page.getByText('Детали ингредиента').first()).not.toBeVisible();
  });

  test('Процесс создания заказа с моками авторизации', async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-jwt-token-for-testing',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'fake-jwt-token-for-testing');
      localStorage.setItem('refreshToken', 'fake-refresh-token-for-testing');
    });

    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    const bunButton = page.locator('li').filter({ hasText: TEST_BUN_NAME }).getByRole('button', { name: 'Добавить' }).first();
    await bunButton.click();

    const fillingButton = page.locator('li').filter({ hasText: TEST_FILLING_NAME }).getByRole('button', { name: 'Добавить' }).first();
    await fillingButton.click();

    const constructorZone = page.getByTestId('constructor');
    await expect(constructorZone).toContainText(TEST_BUN_NAME);
    await expect(constructorZone).toContainText(TEST_FILLING_NAME);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('идентификатор заказа').first()).toBeVisible({ timeout: 10000 });
    
    await expect(page.getByText('987654')).toBeVisible();

    await expect(constructorZone).toContainText('Выберите булки');
    await expect(constructorZone).toContainText('Выберите начинку');
    await expect(constructorZone).not.toContainText(TEST_BUN_NAME);
    await expect(constructorZone).not.toContainText(TEST_FILLING_NAME);

    await page.mouse.click(10, 10);
    await expect(page.getByText('идентификатор заказа').first()).not.toBeVisible();
  });
});
