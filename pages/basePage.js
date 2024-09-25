class Base {
    constructor(page) {
        this.page = page;
    }

    async waitElementVisible(webElement) {
      await webElement.waitFor({ state: 'visible', timeout: 50000 })
    }


}  

module.exports = { Base }