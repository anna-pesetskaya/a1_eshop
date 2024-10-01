const { Base } = require('./basePage');

const {getRandomInt} = require('../helpers/utils.js');
const {makeParseFloat} = require('../helpers/utils.js');



class EShopPage extends Base {
  constructor(page) {
    super(page);
  }

  get checkproductBoxDiscount() {
    return this.page.locator('//label[@for="i-bubbles-collapsed-1"]//span[@class="input-indicator"]');
  };

  get eShopProductCards() {
    return this.page.locator('//div[@class = "product-listing-productBox "]');
  };

  get goToPurchaseButtons() {
    return this.page.locator('//span[@class="button-label"][contains(text(),"Перейти к покупке")]');
  };

  get discountLabel() {
    return this.page.locator('//div[@class = "plp-bubble-item PROMO"]')
  }

  get priceBlock() {
    return this.page.locator('//div[@class="price-block"]')
  }

  get searchResultHeader() {
    return this.page.locator('//main//h1');
  }

  get buyInOneClickButton() {
    return this.page.locator('//div[@id="radio-accordion_INSTALLMENT-CURRENT_CONTRACT"]//div[@class="collapse in"]//button[contains(@class, "one-click")]') 
  }

  get oneClickBoughtModalWindow() {
    return this.page.locator('#modal-buy') 
  }

  get fullName() {
    return this.page.locator('//input[@id="fullName"]') 
  }

  get contactPhone() {
    return this.page.locator('//input[@id="contact-phone"]') 
  }

  get email() {
    return this.page.locator('//form[@id="modal-buy"]//input[@name="email"]') 
  }

  get installmentCheckproductBox() {
    return this.page.locator('//form[@id="modal-buy"]//input[@id="instalments"]/../span[@class="input-indicator"]') 
  }

  get buyButton() {
    return this.page.locator('//form[@id="modal-buy"]//button[@type="submit"]') 
  }

  get availabilityInShopsButton() {
    return this.page.locator('#availability-button') 
  }

  get availabilityInShopsPage() {
    return this.page.locator('//div[@id="view-store-list"]')
  }

  get shopListField() {
    return this.page.locator('//form[@id="select-filter-0"]/div/label')
  }

  get shopOptions() {
    return this.page.locator('//li[@class = "select2-results__option"]')
  }

  get shopAdress() {
    return this.page.locator('.map-center-info-address-text')
  }

  get shopsOnTheMapLink() {
    return this.page.locator('//span[contains(text(),"Магазины А1 на карте")]')
  }

  get forAllOption() {
    return this.page.locator('//div[@class="tabs-controls-item is-visible"]//button[@type="button"]/span[text() = "Для всех"]/..')
  }

  get promoPriceFromDeviceCard() {
    return this.page.locator('//div[@id="final-price-id-for-ajaxpromoPrice"]/p/span')
  }

  get buyFullPriceButton() {
    return this.page.locator('(//div[@class="price-block-full-price-offer"])[1]//following-sibling::div[@class = "price-block-button"]/button')
  }

  get priceMaxField() {
    return this.page.locator('#i-range-box-to-0')
  }

  get devicePrices() {
    return this.page.locator('//div[@class="product-listing-item product-listing-search-result observable-element"]//span[contains(@id, "one-time-price")]')
  }

  get maxPriceFilterIcon() {
    return this.page.locator('//a[@class="chips-btn"]')
  }

  



  async searchDiscountLabels() {
    await this.waitElementVisible(this.checkproductBoxDiscount)
    await this.checkproductBoxDiscount.click();
    const productBoxes = await this.eShopProductCards;
    const count = await productBoxes.count();

    for (let i = 0; i < count; i++) {
        const productBox = productBoxes.nth(i);
        const hasPromo = await productBox.locator(".plp-bubble-item.PROMO").count() > 0;
        if (hasPromo) {
            console.log(`Элемент ${i + 1} содержит ярлык скидки`);
        } else {
            console.log(`Элемент ${i + 1} не содержит ярлык скидки`);
        }
    }
  };

  async selectRandomEShopItem() {
    const count = await this.goToPurchaseButtons.count()
    if (count > 0) {
      const randomIndex = getRandomInt(count);
      await this.goToPurchaseButtons.nth(randomIndex).click();
    } else {
        console.log('Нет доступных элементов для клика');
    }
  }

  async clickAndFillOneClickWndFields(fio, phone, email) {
    await this.waitElementVisible(this.priceBlock)
    await this.waitElementVisible(this.buyInOneClickButton)
    await this.buyInOneClickButton.click()
    await this.waitElementVisible(this.priceBlock)
    await this.waitElementVisible(this.oneClickBoughtModalWindow)
    await this.fullName.click()
    await this.fullName.fill(fio)
    await this.contactPhone.click()
    await this.contactPhone.fill(phone)
    await this.email.click()
    await this.email.fill(email)
    await this.installmentCheckproductBox.click()

    const myButton = await this.buyButton;
    const isDisabled = await myButton.getAttribute('disabled') !== null;
    const isVisible = await myButton.isVisible();
    if (isVisible && !isDisabled) {
        console.log('Элемент кликабелен');
    } else {
        console.log('Элемент не кликабелен');
    }
  }

  async checkTransparency() {
    await this.waitElementVisible(this.availabilityInShopsButton)
    await this.availabilityInShopsButton.click()
    await this.waitElementVisible(this.availabilityInShopsPage)
    await this.page.waitForLoadState('domcontentloaded');
    const transparencyState = await this.page.$eval('#view-store-list', el => window.getComputedStyle(el).zIndex);
    console.log(transparencyState)
    if (Number(transparencyState) <= 0) {
        throw new Error("Модальное окно прозрачно, слетел z-index в стилях окна");
    }
  }

  async checkShopsFiltering() {
    await this.waitElementVisible(this.availabilityInShopsButton)
    await this.availabilityInShopsButton.click();
    await this.waitElementVisible(this.availabilityInShopsPage)
    await this.page.waitForLoadState('domcontentloaded');
    await this.shopListField.click();

    const shopsCount = await this.shopOptions.count();
    let address; 

    if (shopsCount > 0) {
        const randomIndex = getRandomInt(shopsCount);
        address = await this.shopOptions.nth(randomIndex).locator('.value').textContent();
        const valueLocator = this.shopOptions.nth(randomIndex).locator('.value');
        await this.page.evaluate(el => el.click(), await valueLocator.elementHandle());
  } else {
        console.log('Нет доступных элементов для клика');
        return; 
    }
    
    if (address) {
      const shopTownName = this.shopAdress;
      const fullShopAdresses = await shopTownName.allTextContents(); 
      for (let shopTownName of fullShopAdresses) {
        if (shopTownName.includes(address)) {
          console.log(`Слово ${address} найдено в адресе: ${fullShopAdresses}`);
        }
      }

    } else {
      console.log('Адрес не был выбран.');
    }
  } 

  async selectShowOnTheMap() {
    await this.waitElementVisible(this.availabilityInShopsButton)
    await this.availabilityInShopsButton.click()
    await this.waitElementVisible(this.availabilityInShopsPage)
    await this.page.waitForLoadState('domcontentloaded');
    await this.shopsOnTheMapLink.click()
  }

  async addDeviceToCart() {
    await this.waitElementVisible(this.forAllOption)
    await this.forAllOption.click()
    const promoPriceFromDeviceCard = await this.promoPriceFromDeviceCard.innerText();
    const numericPriceWithoutRubFromDeviceCard = makeParseFloat(promoPriceFromDeviceCard);
    const deviceNameFromDeviceCard= await this.searchResultHeader.innerText()
    await this.buyFullPriceButton.click()
    return [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard];
    
  }

  async checkMaxPriceFilter(price) {
    await this.waitElementVisible(this.priceMaxField)
    await this.priceMaxField.click();
    await this.priceMaxField.fill(price);
    await this.priceMaxField.press('Enter');
    await this.waitElementVisible(this.maxPriceFilterIcon)    
    const count = await this.devicePrices.count();

    for (let i = 0; i < count; i++) {
        const devicePriceText = await this.devicePrices.nth(i).textContent();
        const devicePrice = makeParseFloat(devicePriceText);
        if (devicePrice < makeParseFloat(price)) {
          console.log(`Цена ${devicePrice} верная и меньше 300.`);
      } else {
          throw new Error(`Цена ${devicePrice} неверная или больше 300.`);
      }
    }
}



  async prepareForEShopTest(mainPage, searchResultsPage) {
    await mainPage.openEShop();
    await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
    await expect(searchResultsPage.searchResultHeader).toHaveText('Смартфоны');
  }

  async prepareForEShopRandomTest(mainPage, searchResultsPage, eShopPage) {
    await mainPage.openEShop();
    await searchResultsPage.waitElementVisible(searchResultsPage.searchResultHeader);
    await expect(searchResultsPage.searchResultHeader).toHaveText('Смартфоны');
    await eShopPage.selectRandomEShopItem();
  }


  async devicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPriceTexts)  {
    if ((numericPriceWithoutRubFromDeviceCard) !== totalSum ||
        (numericPriceWithoutRubFromDeviceCard) !== numericTotalPriceFromCartWithoutRub ||
        (numericPriceWithoutRubFromDeviceCard) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
        console.log(`Общая стоимость за заказ совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }


  }

  async deviceNamesComparison(deviceNameFromDeviceCard, deviceNamesTexts)  {
    if (deviceNamesTexts.includes(deviceNameFromDeviceCard)) {
        console.log(`Наименование товара отличается: ожидаемая ${deviceNameFromDeviceCard}, "Название товара в корзине" ${deviceNamesTexts}`);
    } else {
        throw new Error('Название товара совпадает в карточке товара и в корзине');
    }
  }

  async totalDevicePricesComparison(numericPriceWithoutRubFromDeviceCard, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, deviceNameFromDeviceCard, deviceNamesTexts, promoPriceTexts) {
    if ((numericPriceWithoutRubFromDeviceCard * 2) !== totalSum ||
            (numericPriceWithoutRubFromDeviceCard * 2) !== numericTotalPriceFromCartWithoutRub ||
            (numericPriceWithoutRubFromDeviceCard * 2) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование  ${deviceNameFromDeviceCard} отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard * 2}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
            console.log(`Общая стоимость за заказ ${deviceNamesTexts} совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }
  }

  async devicesPricesComparison(numericPriceWithoutRubFromDeviceCard, numericPriceWithoutRubFromDeviceCard2, totalSum, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub, promoPriceTexts) {
    if ((numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== totalSum ||
        (numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== numericTotalPriceFromCartWithoutRub ||
        (numericPriceWithoutRubFromDeviceCard + numericPriceWithoutRubFromDeviceCard2) !== numericSubTotalPriceFromCartWithoutRub) {
        throw new Error(`Цены за оборудование отличаются от цены в карточке товара: ожидаемая ${numericPriceWithoutRubFromDeviceCard}, "Цена в таблице" ${promoPriceTexts}, "Сейчас к оплате" ${numericTotalPriceFromCartWithoutRub}, "Цена товара" ${numericSubTotalPriceFromCartWithoutRub}`);
    } else {
        console.log(`Общая стоимость за заказ совпадает с "Сейчас к оплате" и "Ценой товара из карточки"`);
    }
  }

  async devicesNamesComparison(deviceNamesTexts, deviceNameFromDeviceCard2, deviceNameFromDeviceCard) {
    if (deviceNamesTexts.includes(deviceNameFromDeviceCard2 || deviceNameFromDeviceCard)) {
        console.log("Элемент присутствует в списке");
    } else {
      throw new Error("Элемент отсутствует в списке");
    }
  }

     




}
module.exports = EShopPage;