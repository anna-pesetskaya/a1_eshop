const { Base } = require('./basePage');
const { expect } = require('@playwright/test');


class MainPage extends Base {
  constructor(page) {
    super(page);
  }

  get cookiesPanel() {
    return this.page.locator('#CookiesStickyPanel');
  }

  get acceptButton() {
    return this.page.locator('//form[@id="CookiesStickyPanel"]//div[@class="cookies-buttons-wrap"]/button[@data-action-button="acceptAll"]')
  }

  

  get cart() {
    return this.page.locator('#miniCart');
  };

  get searchOpenBtn() {
    return this.page.locator('//button[@id="dropdownGlobalSearch"]');
  };

  get searchField() {
    return this.page.locator('//form[@class="form global-search-form"]//input[contains(@class, "form-input")]');
  };

  get searchFirstResultAutosuggestion() {
    return this.page.locator('(//div[@class="global-search dropdown-menu"]//ul[contains(@class, "ui-autocomplete")]//a[@class="global-search-link"])[1]')
  };

  get failedSearchResults() {
    return this.page.locator('(//div[@class="global-search dropdown-menu"]//ul[contains(@class, "ui-autocomplete")]//a[@class="global-search-no-result"])[1]')
  };

  get authPicture() {
    return this.page.locator('//span[@class="icon icon--user-profile"]');
  };

  get authWay() {
    return this.page.locator('#loginButton')
  };

  get authState() {
    return this.page.locator('//*[@id="dropdownMenuUser"]/span[@class = "icon icon--user-profile is-auth"]')
  }

  get smartphonesLink() {
    return this.page.locator('//a[@href="/ru/c/smartphones"]')
  }

  get subscriptionEmailInput() {
    return this.page.locator('//*[@id="i-subscribe-input"]')
  }

  get subscriptionEmailSendButton() {
    return this.page.locator('//form[@id="news-subscribe-form"]//button[@type="submit"]')
  }

  get popUpWindow() {
    return this.page.locator('//p[@class="iziToast-message slideIn"]')
  }

  get aboutCompanyTitle() {
    return this.page.locator('//h1')
  }

  get confirmUnsibscribeLink() {
    return this.page.locator('//div[@class="form-cta"]/a')
  }

  get tariffsAndServicesLink() {
    return this.page.locator('a[href="/ru/tarify-i-uslugi/"]') 
  }

  get roamingLink() {
    return this.page.locator('a[href="/ru/roaming/"]') 
  }

  get eShopLink() {
    return this.page.locator('//span[contains(text(),"Интернет-магазин")]');
  }

  get vokaLink() {
    return this.page.locator('a[href="https://voka.tv/"]');
  }

  get financeLink() {
    return this.page.locator('a[href="/ru/finansovye-servisy/"]');
  }

   

  async acceptCoockies() {
    const isVisible = await this.cookiesPanel.isVisible();
    
    if (isVisible) {
        await this.acceptButton.click();
    } else {
        console.log("Cookies panel is not visible, skipping acceptance.");
    }

  };

  async clickToAuthorise() {
    await this.authPicture.click();
    await this.waitElementVisible(this.authWay)
    await this.authWay.click();
  }

  async search(searchValue) {
    await this.waitElementVisible(this.searchOpenBtn)
    await this.searchOpenBtn.click();
    await this.waitElementVisible(this.searchField)
    await this.searchField.click()
    await this.searchField.fill(searchValue)
    await this.searchField.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');  
  };

  async clickAndSearch(searchValue) {
    await this.waitElementVisible(this.searchOpenBtn)
    await this.searchOpenBtn.click();
    await this.waitElementVisible(this.searchField)
    await this.searchField.click()
    await this.searchField.fill(searchValue)
  };

  async waitAndClickFirstResult() {
    await this.waitElementVisible(this.searchFirstResultAutosuggestion)
    await this.searchFirstResultAutosuggestion.click();
  }

  async openEShop() {
    await this.eShopLink.click()
    await this.waitElementVisible(this.smartphonesLink)
    await this.smartphonesLink.click()
  }

  async enterEmailForNewsSubscription(email) {
    await this.waitElementVisible(this.subscriptionEmailInput)
    await this.subscriptionEmailInput.click()
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionEmailSendButton.click()
  }

  async checkPopUpInfo(textToFind, textToCheck) {
    await this.waitElementVisible(this.popUpWindow)
    const popUpWindowExists = await this.popUpWindow.count() > 0;
    if (popUpWindowExists) {
      const firstDivLocator = this.popUpWindow.locator(".toast-content-title");
      await expect(firstDivLocator).toHaveText(textToFind);
      
      const secondDivLocator = this.popUpWindow.locator(".toast-content-text");
      await expect(secondDivLocator).toHaveText(textToCheck);   
    }
  };

  async confirmUnsubscribe(textToCheck) {
    await expect (this.aboutCompanyTitle).toHaveText(textToCheck);
    await this.confirmUnsibscribeLink.click() 
  }

  async checkLinksFromMainPage(links) {
    for (const link of links) {
      await this.page.waitForSelector(link.selector);
  
      if (link.name === 'Онлайн-кинотеатр VOKA') {
        const [newPage] = await Promise.all([
          this.page.waitForEvent('popup'),
          this.page.click(link.selector)
        ]);
  
        await newPage.waitForLoadState('domcontentloaded');
        const newUrl = newPage.url();
        console.log(newUrl)
  
        if (newUrl !== 'https://internet.a1.by/minsk/iptv') {
          console.error(`${link.name} opened incorrect URL: ${newUrl}`);
        }
      } else {
        await this.page.click(link.selector);
        await this.page.waitForLoadState('load');
  
        const currentUrl = this.page.url(); 
        if (link.name === 'Роуминг') {
          if (currentUrl !== 'https://roaming.a1.by/b2c?_gl=1*1ammk1*_gcl_au*MTM2NjQ4MDU0My4xNzI3MzYzNzMw*_ga*NzIwMDczNC4xNzI3MzYzNzI5*_ga_B1TB6FBMCH*MTcyNzM2MzczMC4xLjAuMTcyNzM2MzczMC42MC4wLjExNTc0MjE4NDI.') {
            console.error(`${link.name} opened incorrect URL: ${currentUrl}`);
          }
        } else if (currentUrl !== 'https://www.a1.by' + link.href) {
          console.error(`${link.name} opened incorrect URL: ${currentUrl}`);
        }
      }
  
      await this.page.goBack();
      await this.page.waitForLoadState('load');
    }
  }
}

module.exports = MainPage;