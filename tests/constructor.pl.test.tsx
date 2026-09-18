import { test, expect } from '@playwright/test';

test.describe('Интеграционные тесты конструктора бургера', () => {
    
  test('Добавление ингредиента и работа модального окна', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients**',
      update: false,
    });

    await page.goto('http://localhost:4000');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page.locator('img').first().click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();

    await page.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.locator('img').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    
    await page.mouse.click(10, 10);
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('Процесс создания заказа с моками авторизации', async ({ context, page }) => {
    await page.route('**/api/auth/user**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          user: { email: 'test@test.com', name: 'Test User' } 
        })
      });
    });

    await page.route('**/api/auth/token**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          accessToken: 'fake-new-token', 
          refreshToken: 'fake-new-refresh' 
        })
      });
    });

    await page.route('**/api/orders**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: "Тестовый бургер",
          order: { number: 123456 }
        })
      });
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients**',
      update: false
    });

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

    await page.goto('http://localhost:4000');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page.getByRole('button', { name: 'Добавить' }).first().click();

    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.nth(2).click();

    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(/Ваш заказ начали готовить|идентификатор заказа/i).first()).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('123456').first()).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(page.getByText(/Ваш заказ начали готовить|идентификатор заказа/i).first()).not.toBeVisible();
  });
});
