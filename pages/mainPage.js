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
    await this.cookiesPanel.waitFor({ state: 'visible', timeout: 7000 });
    await this.acceptButton.click();

  };

  async clickToAuthorise() {
    await this.authPicture.click();
    await this.authWay.waitFor({ state: 'visible', timeout: 10000 });
    await this.authWay.click();
  }

  async search(searchValue) {
    await this.searchOpenBtn.waitFor({ state: 'visible', timeout: 7000 });
    await this.searchOpenBtn.click();
    await this.searchField.waitFor({ state: 'visible', timeout: 7000 }); 
    await this.searchField.click()
    await this.searchField.fill(searchValue)
    await this.searchField.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');  
  };

  async waitAndClickFirstResult() {
    await this.searchFirstResultAutosuggestion.waitFor({ state: 'visible', timeout: 10000 }); 
    await this.searchFirstResultAutosuggestion.click();
  }

  async openEShop() {
    await this.eShopLink.click()
    await this.smartphonesLink.waitFor({ state: 'visible', timeout: 7000 }); 
    await this.smartphonesLink.click()
  }

  async enterEmailForNewsSubscription(email) {
    await this.subscriptionEmailInput.waitFor({ state: 'visible', timeout: 7000 }); 
    await this.subscriptionEmailInput.click()
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionEmailSendButton.click()
  }

  async checkPopUpInfo(textToFind, textToCheck) {
    await this.popUpWindow.waitFor({ state: 'visible', timeout: 7000 });
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

  async checkLinksFromMainPage() {
    const links = [
      { name: 'Тарифы и услуги', selector: '//a[@href="/ru/tarify-uslugi"]', href: '/ru/tarify-uslugi'}, 
      { name: 'Роуминг', selector: '//li[@class="header-main-item"]//a[@href="https://roaming.a1.by/b2c"]', href: 'https://roaming.a1.by/b2c'},
      { name: 'Интернет-магазин', selector: '//a[@href="/ru/c/shop"]', href: '/ru/c/shop'},
      { name: 'Финансовые сервисы', selector: '//ul[@class="header-main-list cd-dropdown-content dropdown-menu"]//div[@class="yCmsComponent"]/li[5]/a[@href="/ru/services/c/Fin_uslugi"]', href: '/ru/services/c/Fin_uslugi'},
      { name: 'Онлайн-кинотеатр VOKA', selector: '//a[@href="https://internet.a1.by/minsk/iptv"]', href: 'https://internet.a1.by/minsk/iptv'},
    ];

    for (const link of links) {
      await this.page.waitForSelector(link.selector);
      await this.page.click(link.selector);
      await this.page.waitForLoadState('load');
      const currentUrl = this.page.url();
      console.log(`Checking ${link.name}: Expected URL ${link.href}, got ${currentUrl}`);

      if (link.name === 'Онлайн-кинотеатр VOKA') {
        console.log(currentUrl)
        if (currentUrl !== 'https://internet.a1.by/minsk/iptv?_gl=1*1hkj1gl*_gcl_au*MTY0MjM0NjY1Ni4xNzIyNTMwNzg5*_ga*MjExMDMzNjQ1NC4xNzIyNTMwNzg5*_ga_B1TB6FBMCH*MTcyNzE2NzE4OC4zNS4xLjE3MjcxODAzNzAuNTQuMC4xMTg3MDU1MDgz') {
          console.error(`${link.name} opened incorrect URL: ${currentUrl}`);
        }
      } else if (link.name === 'Роуминг') {
        if (currentUrl !== 'https://roaming.a1.by/b2c?_gl=1*vfnz9*_gcl_au*MTY0MjM0NjY1Ni4xNzIyNTMwNzg5*_ga*MjExMDMzNjQ1NC4xNzIyNTMwNzg5*_ga_B1TB6FBMCH*MTcyNzE2NzE4OC4zNS4xLjE3MjcxNzk0NjMuNjAuMC4xMTg3MDU1MDgz') {
          console.error(`${link.name} opened incorrect URL: ${currentUrl}`);
        } else {
          if (currentUrl !== 'https://www.a1.by/ru' + link.href) {
            console.error(`${link.name} opened incorrect URL: ${currentUrl}`);
          }
        }
      }
      await this.page.goBack();
      await this.page.waitForLoadState('load');
    }
  }

}

module.exports = MainPage;