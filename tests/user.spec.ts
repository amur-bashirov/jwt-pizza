import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';
import { User, Role } from '../src/service/pizzaService';


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

  const validUsers2 = {
    "a@jwt.com": {
      id: 3,
      name: "Kai Chen",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: "admin" }],
    },
    "newFranchise@jwt.com": {
      id: 5,
      name: "A New Franchise",
      email: "newFranchise@jwt.com",
      password: "passfranchise",
      roles: [{ role: "diner" }, { objectId: 9, role: "franchisee" }],
    },
  };
// Return the list of users
  await page.route(/\/api\/user(\?.*)?$/, async (route) => {
    expect(route.request().method()).toBe("GET");
    const users = Object.values(validUsers2);
    const listUsersRes = { users: users, more: true };
    await route.fulfill({ json: listUsersRes });
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

test('admin list users', async ({ page }) => {
  await basicInit(page);

  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('admin@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
 await page.getByRole('button', { name: 'Login' }).click();

  
  await page.goto('/admin-dashboard');
  // await page.getByRole('button', { name: 'Submit Users'}).click()


  
  


});








 
  









test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner');


      await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

  await page.getByRole('link', { name: 'Logout' }).click();
await page.getByRole('link', { name: 'Login' }).click();

await page.getByRole('textbox', { name: 'Email address' }).fill(email);
await page.getByRole('textbox', { name: 'Password' }).fill('diner');
await page.getByRole('button', { name: 'Login' }).click();

await page.getByRole('link', { name: 'pd' }).click();

await expect(page.getByRole('main')).toContainText('pizza dinerx');

});

