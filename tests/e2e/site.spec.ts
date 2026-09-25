import { expect, test } from "@playwright/test";
test("mosaic hides navigation until complete, including return navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toBeHidden();
  await expect(page.getByRole("banner")).toBeVisible({ timeout: 10000 });
  await expect(page.getByLabel("Introduction photographique")).toBeHidden();
  await page.getByRole("link", { name: "Studio", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();
  await page.getByRole("link", { name: "KÜNDA home" }).click();
  await expect(page.getByRole("banner")).toBeHidden();
  await expect(page.getByRole("banner")).toBeVisible({ timeout: 10000 });
});
test("all pages and newsletter work without a real subscription", async ({
  page,
}) => {
  for (const [path, title] of [
    ["/studio", "Studio"],
    ["/about-us", "About us"],
    ["/contact", "Contact"],
    ["/newsletter", "Newsletter"],
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: title, exact: true }),
    ).toHaveAttribute("aria-current", "page");
  }
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({ json: { message: "Thank you!" } }),
  );
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Last name").fill("Reader");
  await page.getByLabel("Email address").fill("reader@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByRole("status")).toHaveText("Thank you!");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("reduced motion skips mosaic and the home newsletter can close with Escape", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByLabel("Introduction photographique")).toBeHidden();
  await page
    .getByRole("button", { name: "Subscribe to the newsletter" })
    .click();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Email address")).toBeHidden();
});
test("newsletter endpoint keeps validation and method restrictions", async ({
  request,
}) => {
  expect((await request.get("/api/newsletter")).status()).toBe(405);
  expect((await request.post("/api/newsletter", { data: {} })).status()).toBe(
    403,
  );
  expect(
    (
      await request.post("/api/newsletter", {
        headers: { origin: "http://127.0.0.1:4322" },
        data: {},
      })
    ).status(),
  ).toBe(400);
});
