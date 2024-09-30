const {test} = require('@playwright/test');
const MainPage = require('../pages/mainPage.js');
const SearchResultsPage = require('../pages/searchResultsPage.js');
const EShopPage = require('../pages/eShopPage.js');
const CartPage = require('../pages/cartPage.js');




const { url, testData } = require('../helpers/constants.js');


test.describe('A1.by EShop tests', async function () {
    let mainPage;
    let searchResultsPage;
    let eShopPage;
    let cartPage;
  
    test.beforeEach(async ({page}) => {
      mainPage = new MainPage(page)
      searchResultsPage = new SearchResultsPage(page)
      eShopPage = new EShopPage(page)
      cartPage = new CartPage(page)

      await page.goto(url.baseUrl), { waitUntil: 'networkidle' };
      await mainPage.acceptCoockies();
    })
  

    test('should subscribe/unsubscribe news from A1', async ({page}) => {
      
      const token = testData.subscriptionEmail.split('@')[0];
      const unsubscribeUrl = `https://www.a1.by/ru/company/subscriptions/unsubscribe?token=${token}&utm_source=newspromoletter&utm_medium=email`;

      await mainPage.enterEmailForNewsSubscription(testData.subscriptionEmail);
      await mainPage.checkPopUpInfo("Вы подписались", "Вы успешно подписались на нашу новостную рассылку.")
      await page.goto(unsubscribeUrl), { waitUntil: 'networkidle' };
      await mainPage.confirmUnsubscribe("Отмена подписки на новости и акции компании");
      await mainPage.checkPopUpInfo("Вы отписались", "Вы успешно отписались от нашей новостной рассылки.");
      const currentUrl = page.url();
      const expectedUrl = url.companyUrl;
      if (currentUrl !== expectedUrl) {
        throw new Error("Неверный URL страницы");
      } else {
        console.log("URL страницы верный");
      }
      
    })



})