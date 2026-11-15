import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { staff } from "./support/accounts";
import { addVirtualAuthenticator } from "./support/passkeys";

async function signIn(page: Page, password: string) {
  await page.goto("/en/sign-in");
  await page.getByLabel("Email address").fill(staff.email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();
}

const alert = (page: Page) => page.getByRole("main").getByRole("alert");

async function expectClean(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("a staff member registers passkeys and signs in with them", async ({ page }) => {
  const authenticators = await addVirtualAuthenticator(page);

  await test.step("a wrong password is refused", async () => {
    await signIn(page, "not the password at all");
    await expect(alert(page)).toContainText("incorrect");
    await expectClean(page);
  });

  await test.step("the first sign-in asks for a passkey", async () => {
    await signIn(page, staff.phrase);
    await expect(page).toHaveURL(/\/en\/passkey\/setup/);
    await page.getByLabel("Passkey name").fill("Laptop");
    await page.getByRole("button", { name: "Register passkey" }).click();
    await expect(page.getByRole("heading", { name: `Hello, ${staff.name}` })).toBeVisible();
    await expect(page.getByText("Add a second passkey")).toBeVisible();
    await expectClean(page);
  });

  await test.step("the next sign-in uses the passkey", async () => {
    await page.getByRole("button", { name: "Sign out" }).click();
    await signIn(page, staff.phrase);
    await expect(page).toHaveURL(/\/en\/passkey$/);
    await expectClean(page);
    await page.getByRole("button", { name: "Use my passkey" }).click();
    await expect(page.getByRole("heading", { name: `Hello, ${staff.name}` })).toBeVisible();
  });

  await test.step("a second passkey can be added", async () => {
    await page.getByRole("link", { name: "Security" }).click();
    await expect(page.getByRole("cell", { name: "Laptop" })).toBeVisible();
    await page.getByLabel("Passkey name").fill("Phone");
    await page.getByRole("button", { name: "Register passkey" }).click();
    await expect(page.getByText("already holds one of your passkeys")).toBeVisible();
    await authenticators.replace();
    await page.getByRole("button", { name: "Register passkey" }).click();
    await expect(page.getByRole("cell", { name: "Phone" })).toBeVisible();
    await expectClean(page);
    await page.getByRole("link", { name: "Overview" }).click();
    await expect(page.getByText("Add a second passkey")).toHaveCount(0);
  });
});

test("pages that need a session send visitors to sign in", async ({ page }) => {
  await page.goto("/en/security");
  await expect(page).toHaveURL(/\/en\/sign-in$/);
  await expectClean(page);
});
