const { test, expect } = require("@playwright/test");

test("has task add", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Add tasks A through F
  await page.getByTestId("task-input").fill("A");
  await page.getByTestId("task-button").click();
  await page.getByTestId("task-input").fill("B");
  await page.getByTestId("task-button").click();
  await page.getByTestId("task-input").fill("C");
  await page.getByTestId("task-button").click();
  await page.getByTestId("task-input").fill("D");
  await page.getByTestId("task-button").click();
  await page.getByTestId("task-input").fill("E");
  await page.getByTestId("task-button").click();
  await page.getByTestId("task-input").fill("F");
  await page.getByTestId("task-button").click();

  // start prioritizing
  await page.getByTestId("prioritize-button").click();
  const choiceA = page.getByTestId("choice1-button").filter({ hasText: "A" });
  const choiceB = page.getByTestId("choice2-button").filter({ hasText: "B" });

  await expect(choiceA).toHaveCount(1);
  await expect(choiceB).toHaveCount(1);
});
