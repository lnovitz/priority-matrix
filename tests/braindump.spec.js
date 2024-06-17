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
    await taskList.addTask("E");
    await taskList.addTask("F");

    // use the fixture in the below tests
    await use(taskList);
  },
});

test("first page should have A and B", async ({ taskList }) => {
  const choice1 = taskList.choice1.filter({ hasText: "A" });
  const choice2 = taskList.choice2.filter({ hasText: "B" });

  await taskList.prioritizeButton.click();
  await base.expect(choice1).toHaveCount(1);
  await base.expect(choice2).toHaveCount(1);

  await taskList.choice1.click();
  const page2Choice1 = taskList.choice1.filter({ hasText: "A" });
  const page2Choice2 = taskList.choice2.filter({ hasText: "C" });

  await base.expect(page2Choice1).toHaveCount(1);
  await base.expect(page2Choice2).toHaveCount(1);

  // ...
});
