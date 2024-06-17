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
    await taskList.prioritizeButton.click();
    // use the fixture in the below tests
    await use(taskList);
  },
});

test("No ties, simple result", async ({ taskList }) => {
  await taskList.choice1.click(); // A-B -> A
  await taskList.choice1.click(); // A-C -> A
  await taskList.choice1.click(); // A-D -> A
  await taskList.choice2.click(); // B-C -> C
  await taskList.choice2.click(); // B-D -> D
  await taskList.choice1.click(); // C-D -> C
  const prioritiesHasAandC = taskList.prioritizedTasks.filter({
    hasText: "A3C2D1",
  });
  await base.expect(prioritiesHasAandC).toHaveCount(1);
});
