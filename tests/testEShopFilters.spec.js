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
  
    test('should be filtered results according to chosen filter', async ({page}) => {
      await eShopPage.prepareForEShopTest(mainPage, searchResultsPage);
      await eShopPage.searchDiscountLabels();
    })

    
    test('should be correct filtering in the list of A1 shops where to buy a device', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.checkShopsFiltering()
    })

  

    test('should be valid filtering with device prices', async ({page}) => {
        await eShopPage.prepareForEShopTest(mainPage, searchResultsPage);
        await eShopPage.checkMaxPriceFilter('300,00')
    })

  



})