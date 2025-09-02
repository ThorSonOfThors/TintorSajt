// src/i18n-setup.js
import { createI18n } from 'vue-i18n'

// Your translation messages
const messages = {
  en: {
    language: 'Language',
    changeLanguage: 'Change Language',
    welcome: 'Authentic Italian Delicacies',
    intro: 'For three generations, our family has curated the finest artisanal products from the sun-drenched regions of Italy. Each item tells a story of tradition, passion, and the unparalleled quality of Italian culinary heritage.',
    price: 'Price',
    origin: 'Origin',
    weight: 'Net Weight',
    viewDetails: 'View Details',
    about: 'Our Italian Legacy',
    aboutText: 'Since 1952, we have partnered with small family producers across Italy to bring you authentic flavors that capture the essence of the Mediterranean. Our strict quality standards ensure that every product meets our tradition of excellence.'
  },
  sr: {
    language: 'Jezik',
    changeLanguage: 'Promeni jezik',
    welcome: 'Autentične Italijanske Delikatese',
    intro: 'Već tri generacije, naša porodica bira najfinije zanatske proizvode sa suncem okupanih regiona Italije. Svaki artikal priča priču o tradiciji, strasti i neuporedivom kvalitetu italijanskog kulinarskog nasleđa.',
    price: 'Cena',
    origin: 'Poreklo',
    weight: 'Neto Težina',
    viewDetails: 'Pogledaj Detalje',
    about: 'Naše Italijansko Nasleđe',
    aboutText: 'Od 1952. godine, sarađujemo sa malim porodičnim proizvođačima širom Italije kako bismo vam doneli autentične ukuse koji oslikavaju suštinu Mediterana. Naši strogi standardi kvaliteta osiguravaju da svaki proizvod odgovara našoj tradiciji izvrsnosti.'
  }
}

// Create the i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en', // default language
  fallbackLocale: 'en', // fallback language
  messages
})

export default i18n