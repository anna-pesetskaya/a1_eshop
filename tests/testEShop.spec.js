const {test} = require('@playwright/test');
const MainPage = require('../pages/mainPage');
const SearchResultsPage = require('../pages/searchResultsPage');
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
  
    

    test('should be available button when all fields are filled in', async ({page}) => {
      await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
      await eShopPage.clickAndFillOneClickWndFields(testData.fio, testData.phoneNumber, testData.contactEmail);
    })


    test('should be nontransparent window where the list of A1 shops is shown', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.checkTransparency();
        })


    

    test('should open separate page when it is asked to show eshops on the map', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.selectShowOnTheMap()
        const currentUrl = page.url();
        const expectedUrl = url.shopsUrl;
        if (currentUrl !== expectedUrl) {
        throw new Error("Неверный URL страницы");
        } else {
        console.log("URL страницы верный");
        }
    })

  
    test('should be the same name and prices of device in the device card and cart', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart("Корзина")
        const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
        const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        eShopPage.devicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPricetestData)
        eShopPage.deviceNamesComparison(deviceNameFromDeviceCard, deviceNamestestData)

    })

    test('should be correct device prices in the cart if increase number of devices', async ({page}) => {
      await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
      const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart()
      await (cartPage.addDeviceFromCartButton).click()
      const quantityElement = await cartPage.deviceQuantity;
      const value = await quantityElement.inputValue(); 
      const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
      const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      if (parseInt(value) === 2) {
        eShopPage.totalDevicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, deviceNameFromDeviceCard, deviceNamestestData, promoPricetestData)
      } else {
          throw new Error('Количество устройств не равно 2');
      }
    })


    test('should be empty card when all devices are deleted', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.addDeviceToCart()
        await cartPage.getDeviceDataInCart("Корзина")
        await cartPage.removeDevicesFromCart()
        const currentUrl = page.url();
        const expectedUrl = url.phonesUrl;
        if (currentUrl !== expectedUrl) {
        throw new Error('Неверный URL страницы');
        } else {
        console.log("URL страницы верный");
        }
    })



    test('should be correct total prices when add several devices to cart', async ({page}) => {
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart()
        await cartPage.getDeviceDataInCart("Корзина")
        await eShopPage.prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage)
        const [numericPriceWithoutRubFromDeviceCard2, deviceNameFromDeviceCard2] = await eShopPage.addDeviceToCart()
        const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
        const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        await eShopPage.devicesPricesComparison(numericPriceWithoutRubFromDeviceCard, numericPriceWithoutRubFromDeviceCard2, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPricetestData)
        await eShopPage.devicesNamesComparison(deviceNamestestData, deviceNameFromDeviceCard2, deviceNameFromDeviceCard)
        
    })

   
})