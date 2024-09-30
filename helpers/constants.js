const url = {
    baseUrl:' https://www.a1.by/ru/',
    companyUrl: 'https://www.a1.by/ru/company/',
    shopsUrl: "https://www.a1.by/ru/company/company-centers",
    phonesUrl: "https://www.a1.by/ru/shop/c/phones",
};    

const testData = {
    smartphones: 'Смартфоны',
    support: 'поддержка',
    subscriptionEmail: "testbscs@testbscs.com",
    fio: "Тест Тест Тест", 
    phoneNumber: "296000411", 
    contactEmail: "testbscs@testbscs.com",
    validSearchValue: 'Драйв Актив',
    invalidSearchValue: "oirutoqiu",
    phoneSearch: "Xiaomi",
};

const authData = {
    validLogin: '445840923', 
    validPassword: "11111111Qq",
    invalidPassword: "22222222Qq",
}

const phoneModelsLanguageVariants = {
    "эппл": "Apple",
    "самсунг": "Samsung",
    "ксяоми": "Xiaomi",
    "сяоми": "Xiaomi",
    "хонор": "HONOR",
    "хуавэй": "Huawei"
  };

const links = [
    { name: 'Тарифы и услуги', selector: '//a[@href="/ru/tarify-uslugi"]', href: '/ru/tarify-uslugi'}, 
    { name: 'Роуминг', selector: '//li[@class="header-main-item"]//a[@href="https://roaming.a1.by/b2c"]', href: 'https://roaming.a1.by/b2c'},
    { name: 'Интернет-магазин', selector: '//a[@href="/ru/c/shop"]', href: '/ru/c/shop'},
    { name: 'Финансовые сервисы', selector: '//ul[@class="header-main-list cd-dropdown-content dropdown-menu"]//div[@class="yCmsComponent"]/li[5]/a[@href="/ru/services/c/Fin_uslugi"]', href: '/ru/services/c/Fin_uslugi'},
    { name: 'Онлайн-кинотеатр VOKA', selector: '//a[@href="https://internet.a1.by/minsk/iptv"]', href: 'https://internet.a1.by/minsk/iptv'},
    ];



module.exports = {
    url,
    testData,
    authData,
    phoneModelsLanguageVariants,
    links
};