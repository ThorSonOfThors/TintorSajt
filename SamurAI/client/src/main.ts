import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createI18n } from 'vue-i18n'
import 'leaflet/dist/leaflet.css';

// Define your translations here or import from separate files
const messages = {
  sr: {
    orderWeapons: 'Poručite proizvod',
    quantity: 'Količina',
    name: 'Ime',
    email: 'Email',
    phoneNumber: 'Broj telefona',
    address: 'Adresa',
    orderSummary: 'Pregled porudžbine',
    total: 'Ukupno',
    submitOrder: 'Pošalji porudžbinu',
    orderSuccess: 'Porudžbina uspešno poslata! Dobijate email i kontaktiraće vas naše osoblje.',
    language: 'Jezik',
    changeLanguage: 'Promeni jezik',
    // Home page translations
    welcome: 'Autentične Italijanske Delikatese',
    intro: 'Već tri generacije, naša porodica bira najfinije zanatske proizvode sa suncem okupanih regiona Italije. Svaki artikal priča priču o tradiciji, strasti i neuporedivom kvalitetu italijanskog kulinarskog nasleđa.',
    price: 'Cena',
    origin: 'Poreklo',
    weight: 'Neto Težina',
    viewDetails: 'Pogledaj Detalje',
    about: 'Naše Italijansko Nasleđe',
    aboutText: 'Od 1952. godine, sarađujemo sa malim porodičnim proizvođačima širom Italije kako bismo vam doneli autentične ukuse koji oslikavaju suštinu Mediterana. Naši strogi standardi kvaliteta osiguravaju da svaki proizvod odgovara našoj tradiciji izvrsnosti.',
    // Product names
    oliveOil: 'Premijum Italijansko Maslinovo Ulje',
    anchovies: 'Sicilijanski Inćuni',
    tuna: 'Toskanski Suncem Sušeni Paradajz',
    capers: 'Kapari sa Pantellerije',
    // Origins
    dalmatia: 'Dalmacija, Hrvatska',
    adriatic: 'Jadransko More',
    vis: 'Ostrvo Vis, Hrvatska',
    toscana: 'Toskana, Italija',
    sicilija: 'Sicilija, Italija',
    pantellerija: 'Pantellerija, Italija'
  },
  en: {
    orderWeapons: 'Order Article',
    quantity: 'Quantity',
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    address: 'Address',
    orderSummary: 'Order Summary',
    total: 'Total',
    submitOrder: 'Submit Order',
    orderSuccess: 'Order submitted successfully! You will receive an email and our staff will contact you soon.',
    language: 'Language',
    changeLanguage: 'Change Language',
    // Home page translations
    welcome: 'Authentic Italian Delicacies',
    intro: 'For three generations, our family has curated the finest artisanal products from the sun-drenched regions of Italy. Each item tells a story of tradition, passion, and the unparalleled quality of Italian culinary heritage.',
    price: 'Price',
    origin: 'Origin',
    weight: 'Net Weight',
    viewDetails: 'View Details',
    about: 'Our Italian Legacy',
    aboutText: 'Since 1952, we have partnered with small family producers across Italy to bring you authentic flavors that capture the essence of the Mediterranean. Our strict quality standards ensure that every product meets our tradition of excellence.',
    // Product names
    oliveOil: 'Premium Italian Olive Oil',
    anchovies: 'Sicilian Anchovies',
    tuna: 'Tuscan Sun-Dried Tomatoes',
    capers: 'Pantelleria Capers',
    // Origins
    dalmatia: 'Dalmatia, Croatia',
    adriatic: 'Adriatic Sea',
    vis: 'Vis Island, Croatia',
    toscana: 'Tuscany, Italy',
    sicilija: 'Sicily, Italy',
    pantellerija: 'Pantelleria, Italy'
  }
}

const i18n = createI18n({
  legacy: false,        // <--- important for Composition API useI18n
  locale: 'sr',         // default language Serbian
  fallbackLocale: 'en',
  messages,
})

createApp(App).use(router).use(i18n).mount('#app')