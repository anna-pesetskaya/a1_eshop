const { Base } = require('./basePage');


class EShopPage extends Base {
  constructor(page) {
    super(page);
  }

  get checkBoxDiscount() {
    return this.page.locator('//label[@for="i-bubbles-collapsed-1"]//span[@class="input-indicator"]');
  };

  get eShopItems() {
    return this.page.locator('//div[@class = "product-listing-box "]');
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

  get oneClickButton() {
    return this.page.locator('//div[@id="radio-accordion_INSTALLMENT-CURRENT_CONTRACT"]//div[@class="collapse in"]//button[contains(@class, "one-click")]') 
  }

  get oneClickModalWindow() {
    return this.page.locator('#modal-buy') 
  }

  get oneClickModalFio() {
    return this.page.locator('//input[@id="fullName"]') 
  }

  get oneClickModalPhone() {
    return this.page.locator('//input[@id="contact-phone"]') 
  }

  get oneClickModalEmail() {
    return this.page.locator('//form[@id="modal-buy"]//input[@name="email"]') 
  }

  get oneClickInstallmentCheckbox() {
    return this.page.locator('//form[@id="modal-buy"]//input[@id="instalments"]/../span[@class="input-indicator"]') 
  }

  get oneClickInstallmentBuyButton() {
    return this.page.locator('//form[@id="modal-buy"]//button[@type="submit"]') 
  }

  get offlineAvailableLink() {
    return this.page.locator('#availability-button') 
  }

  get offlineAvailablePage() {
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
    return this.page.locator('//input[@id="i-range-box-to-0"]')
  }

  get devicePrices() {
    return this.page.locator('//div[@class="product-listing-item product-listing-search-result observable-element"]//span[contains(@id, "one-time-price")]')
  }

  get maxPriceFilterIcon() {
    return this.page.locator('//a[@class="chips-btn"]')
  }

  



  async searchDiscountLabels() {
    await this.checkBoxDiscount.waitFor({ state: 'visible', timeout: 7000 });
    await this.checkBoxDiscount.click();
    const productListingBoxes = await this.eShopItems;
    const count = await productListingBoxes.count();

    for (let i = 0; i < count; i++) {
        const box = productListingBoxes.nth(i);
        const hasPromo = await box.locator(".plp-bubble-item.PROMO").count() > 0;
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
      const randomIndex = Math.floor(Math.random() * count);
      await this.goToPurchaseButtons.nth(randomIndex).click();
    } else {
        console.log('Нет доступных элементов для клика');
    }
  }

  async clickAndFillOneClickWndFields(fio, phone, email) {
    await this.priceBlock.waitFor({ state: 'visible', timeout: 7000 });
    await this.oneClickButton.waitFor({ state: 'visible', timeout: 7000 });
    await this.oneClickButton.click()
    await this.oneClickModalWindow.waitFor({ state: 'visible', timeout: 7000 });
    await this.oneClickModalFio.click()
    await this.oneClickModalFio.fill(fio)
    await this.oneClickModalPhone.click()
    await this.oneClickModalPhone.fill(phone)
    await this.oneClickModalEmail.click()
    await this.oneClickModalEmail.fill(email)
    await this.oneClickInstallmentCheckbox.click()

    const myButton = await this.oneClickInstallmentBuyButton;
    const isDisabled = await myButton.getAttribute('disabled') !== null;
    const isVisible = await myButton.isVisible();
    if (isVisible && !isDisabled) {
        console.log('Элемент кликабелен');
    } else {
        console.log('Элемент не кликабелен');
    }
  }

  async checkTransparency() {
    await this.offlineAvailableLink.waitFor({ state: 'visible', timeout: 7000 })
    await this.offlineAvailableLink.click()
    await this.offlineAvailablePage.waitFor({ state: 'visible', timeout: 15000 })
    await this.page.waitForLoadState('domcontentloaded');
    const transparencyState = await this.page.$eval('#view-store-list', el => window.getComputedStyle(el).zIndex);
    console.log(transparencyState)
    if (Number(transparencyState) <= 0) {
        throw new Error("Модальное окно прозрачно, слетел z-index в стилях окна");
    }
  }

  async checkShopsFiltering() {
    await this.offlineAvailableLink.waitFor({ state: 'visible', timeout: 7000 });
    await this.offlineAvailableLink.click();
    await this.offlineAvailablePage.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
    
    await this.shopListField.click();

    const count = await this.shopOptions.count();
    let address; 

    if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        address = await this.shopOptions.nth(randomIndex).locator('.value').textContent();
        const valueLocator = this.shopOptions.nth(randomIndex).locator('.value');
        await this.page.evaluate(el => el.click(), await valueLocator.elementHandle());
  } else {
        console.log('Нет доступных элементов для клика');
        return; 
    }
    
    if (address) {
      const shopAddresses = this.shopAdress;
      const addressesTextArray = await shopAddresses.allTextContents(); 
      for (let shopaddress of addressesTextArray) {
        if (shopaddress.includes(address)) {
          console.log(`Слово ${address} найдено в адресе: ${addressesTextArray}`);
        }
      }

    } else {
      console.log('Адрес не был выбран.');
    }
  } 

  async selectShowOnTheMap() {
    await this.offlineAvailableLink.waitFor({ state: 'visible', timeout: 7000 })
    await this.offlineAvailableLink.click()
    await this.offlineAvailablePage.waitFor({ state: 'visible', timeout: 15000 })
    await this.page.waitForLoadState('domcontentloaded');
    await this.shopsOnTheMapLink.click()
  }

  async addDeviceToCart() {
    await this.forAllOption.waitFor({ state: 'visible', timeout: 15000 })
    await this.forAllOption.click()
    const promoPriceFromDeviceCard = await this.promoPriceFromDeviceCard.innerText();
    const numericPriceWithoutRubFromDeviceCard = parseFloat(promoPriceFromDeviceCard.replace(/[^\d.]/g, ''));
    const deviceNameFromDeviceCard= await this.searchResultHeader.innerText()
    await this.buyFullPriceButton.click()
    return [numericPriceWithoutRubFromDeviceCard, deviceNameFromDeviceCard];
    
  }

  async checkMaxPriceFilter(price) {
    await this.priceMaxField.waitFor({ state: 'visible', timeout: 15000 });
    await this.priceMaxField.click();
    await this.priceMaxField.fill(price);
    await this.priceMaxField.press('Enter');
    await this.maxPriceFilterIcon.waitFor({ state: 'visible', timeout: 7000 });
    
    const count = await this.devicePrices.count();

    for (let i = 0; i < count; i++) {
        const devicePriceText = await this.devicePrices.nth(i).textContent();
        const devicePrice = parseFloat(devicePriceText.replace(',', '.').replace(/[^\d.]/g, ''));
        if (devicePrice < Number(price)) {
          console.log(`Цена ${devicePrice} верная и меньше 300.`);
      } else {
          throw new Error(`Цена ${devicePrice} неверная или больше 300.`);
      }
    }
}

     




}
module.exports = EShopPage;