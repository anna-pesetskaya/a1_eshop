const { Base } = require('./basePage');


class SearchResultsPage extends Base {
  constructor(page) {
    super(page);
  }

  get searchResultField() {
    return this.page.locator('//h2[@class = "banner-info-title c-black banner-info-title-inside"]');
  }

  get errorMessage() {
    return this.page.locator('//main//div[@class="text-block-content"]/p');
  }

  get searchResultHeader() {
    return this.page.locator('//main//h1');
  }

  get itemName() {
    return this.page.locator('//div[@class="product-listing-box "]//div[@class="product-search-item-title"]')
  }

   
  get elementsCards() {
    return this.page.locator('.product-listing-item')
  }

  get elementWithPicture() {
    return this.page.locator('(//div[@class="global-search dropdown-menu"]//ul[contains(@class, "ui-autocomplete")]//a[@class="global-search-link"])[1]')
  }


  async setElementBySapCode(productCode) {
    return this.page.locator(`div[data-product-code="${productCode}"]`);
  } 


  async checkTextInElements(expectedText) {
    const elements = this.itemName;
    const count = await elements.count();
    // Проверяем наличие текста в каждом элементе
    for (let i = 0; i < count; i++) {
      const textContent = await elements.nth(i).innerText();
      if (textContent.includes(expectedText)) {
          console.log(`Элемент ${i + 1} содержит текст: "${expectedText}"`);
      } else {
          console.log(`Элемент ${i + 1} не содержит текст: "${expectedText}"`);
      }
  }
  }

  async chooseFirstMatch() {
    const itemList = this.elementsCards;
    const count = await itemList.count();
    let productCode = null;

    for (let i = 0; i < count; i++) {
      const innerText = await itemList.nth(i).innerText();
      if (innerText.includes('Перейти к покупке') && innerText.includes('руб')) {
        break;
      }
      productCode = await itemList.nth(i).getAttribute('data-product-code');
      await itemList.nth(i).locator('.product-listing-item-btn a').click();   
      
    return productCode;
    }
  }

  async checkLinkFromSearchResults() {
    const firstLink = this.elementWithPicture; 
    const elementText = await firstLink.locator('span.product-short-info-name').innerText();
    await firstLink.click();
    const headerText = await this.searchResultHeader.innerText();
    if (elementText === headerText) {
      console.log('Открылась правильная страница');
  }

  } 
}
  module.exports = SearchResultsPage;