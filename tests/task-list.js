export class TaskList {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.inputBox = this.page.getByTestId("task-input");
    this.taskList = this.page.getByTestId("task-list");
    this.addButton = this.page.getByTestId("task-button");
    this.prioritizeButton = this.page.getByTestId("prioritize-button");
    this.choice1 = this.page.getByTestId("choice1-button");
    this.choice2 = this.page.getByTestId("choice2-button");
  }

  async goto() {
    await this.page.goto("http://localhost:3000/");
  }

  /**
   * @param {string} text
   */
  async addTask(text) {
    await this.inputBox.fill(text);
    await this.addButton.click();
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
