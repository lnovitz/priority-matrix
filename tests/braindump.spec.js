const base = require("@playwright/test");
const { TaskList } = require("./task-list");

// Extend basic test by providing a "taskList" fixture
const test = base.test.extend({
  taskList: async ({ page }, use) => {
    const taskList = new TaskList(page);
    await taskList.goto();
    await taskList.addTask("A");
    await taskList.addTask("B");
    await taskList.addTask("C");
    await taskList.addTask("D");
    await taskList.prioritize();
    // use the fixture in the below tests
    await use(taskList);
  },
});

test("No ties", async ({ taskList }) => {
  await taskList.choice1.click(); // A-B -> A
  await taskList.choice1.click(); // A-C -> A
  await taskList.choice1.click(); // A-D -> A
  await taskList.choice2.click(); // B-C -> C
  await taskList.choice2.click(); // B-D -> D
  await taskList.choice1.click(); // C-D -> C
  const priorities = taskList.task1.filter({
    hasText: "A",
  });
  const priorities2 = taskList.task2.filter({
    hasText: "C",
  });
  const priorities3 = taskList.task3.filter({
    hasText: "D",
  });
  const priorities4 = taskList.task4.filter({
    hasText: "B",
  });

  await base.expect(priorities).toHaveCount(1);
  await base.expect(priorities2).toHaveCount(1);
  await base.expect(priorities3).toHaveCount(1);
  await base.expect(priorities4).toHaveCount(1);

  //await taskList.reload();
  //await base.page.reload();
  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});

test("1 tie, same value count", async ({ taskList }) => {
  await taskList.choice1.click(); // A-B -> A
  await taskList.choice1.click(); // A-C -> A
  await taskList.choice2.click(); // A-D -> D
  await taskList.choice2.click(); // B-C -> C
  await taskList.choice2.click(); // B-D -> D
  await taskList.choice1.click(); // C-D -> C
  // A2D2C2 tied across all choices
  // because there's a tie, user will be prompted to dump a task
  await taskList.dumpA.click(); //A1D2C2
  // now D and C are tied
  await taskList.dumpD.click(); //A1D1C2
  // now A and D are tied
  await taskList.dumpA.click(); //A0D1C2
  // no more ties, results returned
  console.log("taskList.prioritizedTasks ", taskList.prioritizedTasks);
  const priorities = taskList.task1.filter({
    hasText: "C",
  });
  const priorities2 = taskList.task2.filter({
    hasText: "D",
  });
  const priorities3 = taskList.task3.filter({
    hasText: "A",
  });
  const priorities4 = taskList.task4.filter({
    hasText: "B",
  });

  await base.expect(priorities).toHaveCount(1);
  await base.expect(priorities2).toHaveCount(1);
  await base.expect(priorities3).toHaveCount(1);
  await base.expect(priorities4).toHaveCount(1);

  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});

test("Load latest list", async ({ taskList }) => {
  await page.evaluate(() => window.localStorage);
  console.log(storage);
  await page.evaluate(setLocalStorage);

  await taskList.loadLatestListButton.click();

  const priorities = taskList.task1.filter({
    hasText: "A",
  });
  await base.expect(priorities).toHaveCount(1);

  //await taskList.reload();
  //await base.page.reload();
  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});

test("Load previous list", async ({ taskList }) => {
  await page.evaluate(() => window.localStorage);
  console.log(storage);
  await page.evaluate(setLocalStorage);

  await taskList.loadPreviousListButton.click();

  const priorities = taskList.task1.filter({
    hasText: "D",
  });
  await base.expect(priorities).toHaveCount(1);

  //await taskList.reload();
  //await base.page.reload();
  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});

test("Load next list", async ({ taskList }) => {
  await page.evaluate(() => window.localStorage);
  console.log(storage);
  await page.evaluate(setLocalStorage);
  // current list is A, B, C
  await taskList.loadNextList.click();

  const priorities = taskList.task1.filter({
    hasText: "G",
  });
  await base.expect(priorities).toHaveCount(1);

  //await taskList.reload();
  //await base.page.reload();
  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});

function setLocalStorage() {
  localStorage.setItem("tasks", [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"], // last list is always the latest. stack
  ]);
}
