const { Base } = require('./basePage');


class LoginPage extends Base {
  constructor(page) {
    super(page);
  }

  get authorisationHeader() {
    return this.page.locator('//h1[text() = "Вход в аккаунт"]');
  };

  get passwordAuthorization() {
    return this.page.locator('//label[contains(text(),"По паролю")]/span')
  };

  get phoneField() {
    return this.page.locator('#itelephone_new')
  };

  get passwordField() {
    return this.page.locator('#ipassword')
  };

  get signInButton() {
    return this.page.locator('#butt1')
  };

  get errorMessage() {
    return this.page.locator('#false-error') 
  };

  get authState() {
    return this.page.locator('//*[@id="dropdownMenuUser"]/span[@class = "icon icon--user-profile is-auth"]')
  };

  get authState() {
    return this.page.locator('//*[@id="dropdownMenuUser"]/span[@class = "icon icon--user-profile is-auth"]')
  };


  async login(loginName, password) {
    await this.waitElementVisible(this.authorisationHeader)
    await this.waitElementVisible(this.passwordAuthorization)
    await this.passwordAuthorization.click();
    await this.phoneField.fill(loginName);
    await this.passwordField.fill(password)
    await this.signInButton.click();
  };
}
  module.exports = LoginPage;