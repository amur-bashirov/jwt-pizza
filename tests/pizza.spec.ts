import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { Role, User } from '../src/service/pizzaService';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});



async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
  'd@jwt.com': {
    id: '3',
    name: 'Kai Chen',
    email: 'd@jwt.com',
    password: 'a',
    roles: [{ role: Role.Diner }],
  },
  'admin@jwt.com': {
    id: '1',
    name: 'Admin',
    email: 'admin@jwt.com',
    password: 'admin',
    roles: [{ role: Role.Admin }],
  },
  'franchise@jwt.com': {
    id: '1',
    name: 'Franchise',
    email: 'franchise@jwt.com',
    password: 'franchise',
    roles: [{ role: Role.Franchisee }],
  },
};

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const method = route.request().method();


    if (method === 'DELETE' || method === 'POST') {
    // Logout or invalid method — clear logged-in user
    loggedInUser = undefined;
    await route.fulfill({ status: 200, json: { message: 'Logged out' } });
    return;
  }


    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  // Order a pizza.
  await page.route('*/**/api/order', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
    // For example, when profile page loads previous orders
    const orders = [
      { id: 23, title: 'Veggie', total: 0.0038 },
      { id: 24, title: 'Pepperoni', total: 0.0042 },
    ];
    await route.fulfill({ json: { orders } });
    return;
  }
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
}

test('login', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
  await basicInit(page);

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('admin dashboard shows franchise table and Add Franchise button', async ({ page }) => {
  await basicInit(page);

  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('admin@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
 await page.getByRole('button', { name: 'Login' }).click();

  
 await page.goto('/admin-dashboard');

  
  await expect(page.getByText('Franchises')).toBeVisible(); 
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();

  
  for (const header of ['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action']) {
  await expect(
    page.getByRole('columnheader', { name: header, exact: true })
  ).toBeVisible();
  }

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

  await page.getByPlaceholder('franchise name').fill('My Test Franchise');
  await page.getByPlaceholder('franchisee admin email').fill('admin@jwt.com');
  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.goto('/admin-dashboard');


  // await page.getByRole('button', { name: 'Add Franchise' }).click();
  // await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  // await page.getByPlaceholder('franchise name').fill('My Test Franchise');
  // await page.getByPlaceholder('franchisee admin email').fill('admin@jwt.com');
  // await page.getByRole('button', { name: 'Create' }).click();

  // await page.goto('/admin-dashboard');


  await page.getByRole('row', { name: /LotaPizza/ }).getByRole('button', { name: 'Close' }).click();
  //await page.goto('/admin-dashboard/close-franchise');
  await page.getByRole('button', { name: 'Cancel' }).click();


  await page.goto('/admin-dashboard');

  await page.getByRole('row', { name: /LotaPizza/ }).getByRole('button', { name: 'Close' }).click();
  await page.goto('/admin-dashboard/close-franchise');
  await page.getByRole('button', { name: 'Close' }).click();


  // await page.goto('/admin-dashboard');

  // await page.getByRole('button', { name: 'submit' }).click();
  // await page.goto('/admin-dashboard');


});


test('close store', async ({ page }) => {
  await basicInit(page);

  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('admin@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
 await page.getByRole('button', { name: 'Login' }).click();

  
 await page.goto('/admin-dashboard');

  
  

  
  for (const header of ['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action']) {
  await expect(
    page.getByRole('columnheader', { name: header, exact: true })
  ).toBeVisible();
  }

  await page.goto('/admin-dashboard');

  await page.getByRole('row', { name: 'Lehi' }).getByRole('button', { name: 'Close' }).click();
  await page.goto('/admin-dashboard/close-store');
  await page.getByRole('button', { name: 'Cancel' }).click();


  await page.goto('/admin-dashboard');

  await page.getByRole('row', { name: 'Lehi' }).getByRole('button', { name: 'Close' }).click();
  await page.goto('/admin-dashboard/close-store');
  await page.getByRole('button', { name: 'Close' }).click();

  await page.goto('/admin-dashboard');
  

});



test('Login as franchise', async ({ page }) => {
  await basicInit(page);

  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('franchise@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('franchise');
 await page.getByRole('button', { name: 'Login' }).click();



 //await page.getByRole('button', { name: 'Franchise' }).click();
  await page.click('text=Franchise');
  
 await page.goto('/franchise-dashboard');

});


test('logout and register', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.click('text=Logout');
  await page.click('text=Register');
  await page.getByRole('textbox', { name: 'Full name' }).fill('Amur');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('blaccbaron@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('2637221');
  await page.getByRole('button', { name: 'Register' }).click();
});



test('about', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.click('text=About');
});

test('profile', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'KC' }).click();
});