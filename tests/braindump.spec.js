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
  const priorities = taskList.prioritizedTasks.filter({
    hasText: "A3",
  });
  const priorities2 = taskList.prioritizedTasks.filter({
    hasText: "C2",
  });
  const priorities3 = taskList.prioritizedTasks.filter({
    hasText: "D1",
  });
  await base.expect(priorities).toHaveCount(1);
  await base.expect(priorities2).toHaveCount(1);
  await base.expect(priorities3).toHaveCount(1);
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
  const priorities = taskList.prioritizedTasks.filter({
    hasText: "C2",
  });
  const priorities2 = taskList.prioritizedTasks.filter({
    hasText: "D1",
  });
  const priorities3 = taskList.prioritizedTasks.filter({
    hasText: "A0",
  });
  await base.expect(priorities).toHaveCount(1);
  await base.expect(priorities2).toHaveCount(1);
  await base.expect(priorities3).toHaveCount(1);
  await taskList.goto("https://playwright.dev/");
  await taskList.goto();
});
