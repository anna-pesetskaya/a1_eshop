const {test} = require('@playwright/test');
const MainPage = require('../pages/mainPage');
const SearchResultsPage = require('../pages/searchResultsPage');
const EShopPage = require('../pages/eShopPage.js');
const CartPage = require('../pages/cartPage.js');
const {prepareForEShopRandomTest} = require('../helpers/helpers.js');
const {prepareForEShopTest} = require('../helpers/helpers.js');
const {devicePricesComparison} = require('../helpers/helpers.js');
const {deviceNamesComparison} = require('../helpers/helpers.js');
const {totalDevicePricesComparison} = require('../helpers/helpers.js')
const {devicesPricesComparison} = require('../helpers/helpers.js')
const {devicesNamesComparison} = require('../helpers/helpers.js')



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
      await prepareForEShopTest(mainPage, searchResultsPage);
      await eShopPage.searchDiscountLabels();
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

    test('should be available button when all fields are filled in', async ({page}) => {
      await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
      await eShopPage.clickAndFillOneClickWndFields(testData.fio, testData.phoneNumber, testData.contactEmail);
    })


    test('should be nontransparent window where the list of A1 shops is shown', async ({page}) => {
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.checkTransparency();
        })


    test('should be correct filtering in the list of A1 shops where to buy a device', async ({page}) => {
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        await eShopPage.checkShopsFiltering()
    })

    test('should open separate page when it is asked to show eshops on the map', async ({page}) => {
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
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
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart("Корзина")
        const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
        const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        devicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPricetestData)
        deviceNamesComparison(deviceNameFromDeviceCard, deviceNamestestData)

    })

    test('should be correct device prices in the cart if increase number of devices', async ({page}) => {
      await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
      const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart()
      await (cartPage.addDeviceFromCartButton).click()
      const quantityElement = await cartPage.deviceQuantity;
      const value = await quantityElement.inputValue(); 
      const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
      const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      if (parseInt(value) === 2) {
        totalDevicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, deviceNameFromDeviceCard, deviceNamestestData, promoPricetestData)
      } else {
          throw new Error('Количество устройств не равно 2');
      }
    })


    test('should be empty card when all devices are deleted', async ({page}) => {
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
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
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage);
        const [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard] = await eShopPage.addDeviceToCart()
        await cartPage.getDeviceDataInCart("Корзина")
        await prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage)
        const [numericPriceWithoutRubFromDeviceCard2, deviceNameFromDeviceCard2] = await eShopPage.addDeviceToCart()
        const [deviceNamestestData, promoPricetestData, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub] = await cartPage.getDeviceDataInCart("Корзина")
        const totalSum = promoPricetestData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        await devicesPricesComparison(numericPriceWithoutRubFromDeviceCard, numericPriceWithoutRubFromDeviceCard2, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPricetestData)
        await devicesNamesComparison(deviceNamestestData, deviceNameFromDeviceCard2, deviceNameFromDeviceCard)
        
    })

    test('should be valid filtering with device prices', async ({page}) => {
        await prepareForEShopTest(mainPage, searchResultsPage);
        await eShopPage.checkMaxPriceFilter('300')
    })

  



})