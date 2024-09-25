const {test, expect} = require('@playwright/test');
const MainPage = require('../pages/mainPage')
const LoginPage = require('../pages/loginPage');
const { url, authData } = require('../helpers/constants.js');



test.describe('A1.by authrorisation in personal accout', async function () {
    let mainPage;
    let loginPage;
  
    test.beforeEach(async ({page}) => {
      mainPage = new MainPage(page)
      loginPage = new LoginPage(page)

      await page.goto(url.baseUrl), { waitUntil: 'networkidle' };
      await mainPage.acceptCoockies();
      await mainPage.clickToAuthorise();
    })
  
    test('should enter into personal account with correct data', async ({page}) => {
        await loginPage.login(authData.validLogin, authData.validPassword)
        await expect(mainPage.authState).toBeVisible();
    })

    test('should thow error when enter into personal account with incorrect password', async ({page}) => {
      await loginPage.login(authData.validLogin, authData.invalidPassword)
      await expect (loginPage.errorMessage).toContainText('Неверный пароль или номер телефона');;
  })
})