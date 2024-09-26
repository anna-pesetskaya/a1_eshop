const {test, expect} = require('@playwright/test');
const MainPage = require('../pages/mainPage')
const SearchResultsPage = require('../pages/searchResultsPage')
const {getRandomKeyFromDictionary} = require('../helpers/utils.js');
const { url, testData, phoneModelsLanguageVariants, links } = require('../helpers/constants.js');
const {prepareForEShopTest} = require('../helpers/helpers.js');




test.describe('A1.by search test', async function () {
    let mainPage;
    let searchResultsPage;
  
    test.beforeEach(async ({page}) => {
      mainPage = new MainPage(page)
      searchResultsPage = new SearchResultsPage(page)
      await page.goto(url.baseUrl), { waitUntil: 'networkidle' };
      await mainPage.acceptCoockies()
    })
  
    test('should be valid search results', async ({page}) => {
        await mainPage.clickAndSearch(testData.validSearchValue);
        await mainPage.waitAndClickFirstResult();
        await expect (searchResultsPage.searchResultField).toHaveText(testData.validSearchValue);
    })

    test('should be error message when invalid data is passed into search field', async ({page}) => {
        await mainPage.clickAndSearch(testData.invalidSearchValue);
        await expect(mainPage.failedSearchResults).toHaveText(`По запросу "${testData.invalidSearchValue}" ничего не найдено.`);
    })
    

    test('should be correct search results if popular phones models names are taken in Russian', async ({page}) => {
      const randomKey = getRandomKeyFromDictionary(phoneModelsLanguageVariants);
      const randomValue = phoneModelsLanguageVariants[randomKey];
     
      await mainPage.search(randomKey);
      await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
      await expect (searchResultsPage.searchResultHeader).toHaveText(`Результаты поиска для «${randomKey}»`)
      const currentUrl = page.url();
      const decodedString = decodeURIComponent(currentUrl);
    
      if (decodedString.includes(randomKey)) {
        console.log(`Строка содержит текст ${randomKey}.`);
      } else {
        console.error(`Ошибка декодирования строки! Строка не содержит текст ${randomKey}.`);
      }

      await searchResultsPage.checkTextInElements(randomValue)
    })

    test('should be correct search results if search by sap-code', async ({page}) => {
        await prepareForEShopTest(mainPage, searchResultsPage)
        const productCode = await searchResultsPage.chooseFirstMatch();
        await mainPage.search(productCode)
        await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
        await expect (searchResultsPage.searchResultHeader).toHaveText(`Результаты поиска для «${productCode}»`);
        const element =  await searchResultsPage.setElementBySapCode(productCode);
        const isElementPresent = await element.count() > 0;
        if (isElementPresent) {
            console.log(`Элемент с кодом продукта ${productCode} найден.`);
        } else {
            console.log(`Элемент с кодом продукта ${productCode} не найден.`);
        }
    })

    test('should suggested results be clickable in the search results list', async ({page}) => {
        await mainPage.search(testData.phoneSearch);
        await searchResultsPage.checkLinkFromSearchResults;
    })

    test('should open correct pages when main links are pressed on the main page', async ({page}) => {
        await mainPage.checkLinksFromMainPage(links);
    })




  })