const { Base } = require('./basePage');
const { getInnerTexts, getNumericPrices } = require('../helpers/helpers.js');
const {makeParseFloat} = require('../helpers/utils.js');

class CartPage extends Base {
  constructor(page) {
    super(page);
  }
  get searchResultHeader() {
    return this.page.locator('//main//h1');
  }

  get deviceNameFromCart() {
    return this.page.locator('//div[@class="review-item-main-card review-item-main-unrooted-card"]//span[@class = "link-label"]')
  }

  get devicePriceFromCart() {
    return this.page.locator('//div[@class="card-page-review-wrapper"]//span[contains(@id, "full-price_")]')
  }

  get totalPriceFromCart() {
    return this.page.locator('//*[@id="card-total-price"]')
  }

  get subTotalPriceFromCart() {
    return this.page.locator('//*[@id="card-subtotal-price"]')
  }

  get addDeviceFromCartButton() {
    return this.page.locator ('//button[@class="quantity-selector-button--plus quantity-selector-button btn js-qty-selector-plus quantity-selector-card"]')
  }

  get deviceQuantity() {
    return this.page.locator('//input[@class = "form-input quantity-selector-input js-qty-selector-input quantity-selector-card-input"]')
  }

  get removeFromCartButton() {
    return this.page.locator('//button[@aria-label="Удалить"]')
  }

  get informationWindow() {
    return this.page.locator('//form[@id="modal-remove-group-1"]')
  }

  get yesButton() {
    return this.page.locator('//button[@data-loader-id="global-loader"]')
  }

  get confirmationMessage() {
    return this.page.locator('//div[@class="text-block-content"]/p')
  }

  get goToEShopButton() {
    return this.page.locator('//span[contains(text(),"Перейти в интернет-магазин")]')
  }

  async getDeviceDataInCart(headerName) {
    await this.page.waitForLoadState('domcontentloaded');
    const currentHeader = await this.searchResultHeader.innerText();
    if (currentHeader !== `${headerName}`) {
      throw new Error(`Ожидалась страница c заголовком ${headerName}", но получили заголовок страницы: ${currentHeader}`);
    }

    const deviceNamesTexts = await getInnerTexts(this.deviceNameFromCart);
    const promoPriceTexts = await getNumericPrices(this.devicePriceFromCart);

    const totalPriceFromCart = await this.totalPriceFromCart.innerText();
    //const numericTotalPriceFromCartWithoutRub = parseFloat(totalPriceFromCart.replace(/[^\d.]/g, ''));
    const numericTotalPriceFromCartWithoutRub = makeParseFloat(totalPriceFromCart);

    const subTotalPriceFromCart = await this.subTotalPriceFromCart.innerText();
    //const numericSubTotalPriceFromCartWithoutRub = parseFloat(subTotalPriceFromCart.replace(/[^\d.]/g, ''));
    const numericSubTotalPriceFromCartWithoutRub = makeParseFloat(subTotalPriceFromCart);

    return [deviceNamesTexts, promoPriceTexts, numericTotalPriceFromCartWithoutRub, numericSubTotalPriceFromCartWithoutRub]

  }

  async removeDevicesFromCart() {
    await this.removeFromCartButton.click()
    await this.waitElementVisible(this.informationWindow)
    await this.yesButton.click()
    await this.waitElementVisible(this.confirmationMessage)
    await this.goToEShopButton.click()
  }

 
}
module.exports = CartPage;