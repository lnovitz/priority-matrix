export class TaskList {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/errors').TimeoutError} timeoutError
   */
  constructor(page) {
    this.page = page;
    this.inputBox = this.page.getByTestId("task-input");
    this.taskList = this.page.getByTestId("task-list");
    this.addButton = this.page.getByTestId("task-button");
    this.prioritizeButton = this.page.getByTestId("prioritize-button");
    this.choice1 = this.page.getByTestId("choice1-button");
    this.choice2 = this.page.getByTestId("choice2-button");
    this.dumpA = this.page.getByTestId("dump-button-A");
    this.dumpB = this.page.getByTestId("dump-button-B");
    this.dumpC = this.page.getByTestId("dump-button-C");
    this.dumpD = this.page.getByTestId("dump-button-D");
    this.prioritizedTasks = this.page.getByTestId("results");
    this.task1 = this.page.getByRole("list").nth(0);
    this.task2 = this.page.getByRole("list").nth(1);
    this.task3 = this.page.getByRole("list").nth(2);
    this.task4 = this.page.getByRole("list").nth(3);
  }

  async goto() {
    try {
      await this.page.goto("http://localhost:3000/");
    } catch (error) {
      if (error instanceof timeoutError) {
        console.log("Timeout!");
        await this.page.goto("https://lnovitz.github.io/priority-matrix/");
      } else {
        console.log({ error });
      }
    }
  }

  /**
   * @param {string} text
   */
  async addTask(text) {
    await this.inputBox.fill(text);
    await this.addButton.click();
  }

  async prioritize() {
    await this.page.waitForSelector('[data-testid="prioritize-button"]', {
      state: "attached",
      visible: true,
    });
    //await this.page.waitForTimeout(5000);
    await this.prioritizeButton.click();
  }

  async waitLoad() {
    await this.page.waitForLoadState();
  }

  //   /**
  //    * @param {string} text
  //    */
  //   async remove(text) {
  //     const task = this.taskList.filter({ hasText: text });
  //     await task.hover();
  //     await task.getByLabel("Delete").click();
  //   }

  //   async removeAll() {
  //     while ((await this.taskList.count()) > 0) {
  //       await this.taskList.first().hover();
  //       await this.taskList.getByLabel("Delete").first().click();
  //     }
  //   }
}
