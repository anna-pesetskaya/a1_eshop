const {expect} = require('@playwright/test');


async function prepareForEShopTest(mainPage, searchResultsPage) {
    await mainPage.openEShop();
    await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
    await expect(searchResultsPage.searchResultHeader).toHaveText('Смартфоны');
}

async function prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage) {
    await mainPage.openEShop();
    await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
    await expect(searchResultsPage.searchResultHeader).toHaveText('Смартфоны');
    await eShopPage.selectRandomEShopItem();
}


async function devicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPriceTexts)  {
    if ((numericPriceWithoutRubFromDeviceCard) !== totalSum ||
        (numericPriceWithoutRubFromDeviceCard) !== numericTotalPriceFromCartWithoutRub ||
        (numericPriceWithoutRubFromDeviceCard) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
        console.log(`Общая стоимость за заказ совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }


}

async function deviceNamesComparison(deviceNameFromDeviceCard, deviceNamesTexts)  {
    if (deviceNamesTexts.includes(deviceNameFromDeviceCard)) {
        console.log(`Наименование товара отличается: ожидаемая ${deviceNameFromDeviceCard}, "Название товара в корзине" ${deviceNamesTexts}`);
    } else {
        throw new Error('Название товара совпадает в карточке товара и в корзине');
    }
}

async function totalDevicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, deviceNameFromDeviceCard, deviceNamesTexts, promoPriceTexts) {
    if ((numericPriceWithoutRubFromDeviceCard * 2) !== totalSum ||
            (numericPriceWithoutRubFromDeviceCard * 2) !== numericTotalPriceFromCartWithoutRub ||
            (numericPriceWithoutRubFromDeviceCard * 2) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование  ${deviceNameFromDeviceCard} отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard * 2}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
            console.log(`Общая стоимость за заказ ${deviceNamesTexts} совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }
}

async function devicesPricesComparison(numericPriceWithoutRubFromDeviceCard, numericPriceWithoutRubFromDeviceCard2, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPriceTexts) {
    if ((numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== totalSum ||
        (numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== numericTotalPriceFromCartWithoutRub ||
        (numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
        console.log(`Общая стоимость за заказ совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }
}

async function devicesNamesComparison(deviceNamesTexts, deviceNameFromDeviceCard2, deviceNameFromDeviceCard) {
    if (deviceNamesTexts.includes(deviceNameFromDeviceCard2 || deviceNameFromDeviceCard)) {
        console.log("Элемент присутствует в списке");
    } else {
      throw new Error("Элемент отсутствует в списке");
    }
}

async function getInnerTexts(elements) {
    const texts = [];
    const count = await elements.count();
    
    for (let i = 0; i < count; i++) {
      const innerText = await elements.nth(i).innerText();
      texts.push(innerText);
    }
    
    return texts;
}
  
async function getNumericPrices(elements) {
    const prices = [];
    const count = await elements.count();
    
    for (let i = 0; i < count; i++) {
      const innerText = await elements.nth(i).innerText();
      const numericPrice = parseFloat(innerText.replace(/[^\d.]/g, ''));
      prices.push(numericPrice);
    }
    
    return prices;
}


module.exports = { prepareForEShopTest, 
    prepareForEShopRandomTest, 
    devicePricesComparison, 
    deviceNamesComparison, 
    totalDevicePricesComparison, 
    devicesPricesComparison, 
    devicesNamesComparison, 
    getInnerTexts, 
    getNumericPrices }