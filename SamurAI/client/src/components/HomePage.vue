<template>
  <div class="home-page-container">
    <div class="home-page">
      <!-- Language selector with button -->
      <div class="language-select">
        <label for="lang">{{ $t('language') }}:</label>
        <select id="lang" v-model="selectedLocale">
          <option value="sr">Srpski</option>
          <option value="en">English</option>
        </select>
        <button @click="applyLanguageChange" class="language-button">
          {{ $t('changeLanguage') }}
        </button>
      </div>

      <h1>{{ $t('welcome') }}</h1>
      
      <p class="intro-text">
        {{ $t('intro') }}
      </p>

      <div class="products-grid">
        <div v-for="product in products" :key="product.sku" class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-details">
            <h2>{{ product.name }}</h2>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-info">
              <p><strong>{{ $t('price') }}:</strong> ${{ product.price }}</p>
              <p><strong>{{ $t('origin') }}:</strong> {{ product.origin }}</p>
              <p><strong>{{ $t('weight') }}:</strong> {{ product.weight }}</p>
            </div>
            <button class="view-details-btn" @click="viewProductDetails(product)">
              {{ $t('viewDetails') }}
            </button>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>{{ $t('about') }}</h2>
        <p>
          {{ $t('aboutText') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import katanaImg from '../assets/maslinovo.jpg'
import tantoImg from '../assets/kapari.jpg'
import wakisashiImg from '../assets/incuni.png'

const { t, locale } = useI18n()

const selectedLocale = ref(locale.value)

function applyLanguageChange() {
  locale.value = selectedLocale.value
  console.log("Language changed");
}

// Update product details when language changes
watch(locale, (newLocale) => {
  updateProductTranslations(newLocale)
})

// Function to update product details based on language
function updateProductTranslations(lang) {
  products.value = products.value.map(product => {
    const translations = productTranslations[product.sku][lang]
    return {
      ...product,
      name: translations.name,
      description: translations.description,
      origin: translations.origin
    }
  })
}

// Translation data for products
const productTranslations = {
  'A101': {
    en: {
      name: 'Premium Italian Olive Oil',
      description: 'Extra virgin olive oil from the sun-drenched hills of Tuscany. Cold-pressed from hand-picked olives for a delicate, fruity flavor with hints of artichoke and green almond.',
      origin: 'Tuscany, Italy'
    },
    sr: {
      name: 'Premijum Italijansko Maslinovo Ulje',
      description: 'Ekstra djevičansko maslinovo ulje sa suncem okupanih brežuljaka Toskane. Hladno prešano od ručno branih maslina za delikatan, voćni ukus s notama artičoke i zelenog badema.',
      origin: 'Toskana, Italija'
    }
  },
  'B202': {
    en: {
      name: 'Sicilian Anchovies',
      description: 'Hand-filleted anchovies from the crystal clear waters of Sicily. Cured in sea salt and packed in premium Italian olive oil for an authentic taste of the Mediterranean.',
      origin: 'Sicily, Italy'
    },
    sr: {
      name: 'Sicilijanski Inćuni',
      description: 'Ručno filetirani inćuni iz kristalno čistih voda Sicilije. Očuvani u morskoj soli i pakovani u premijum italijansko maslinovo ulje za autentičan ukus Mediterana.',
      origin: 'Sicilija, Italija'
    }
  },
  'B242': {
    en: {
      name: 'Tuscan Sun-Dried Tomatoes',
      description: 'Plump San Marzano tomatoes sun-dried on traditional racks in the Tuscan countryside. Intense flavor perfect for pastas, salads, and antipasti.',
      origin: 'Tuscany, Italy'
    },
    sr: {
      name: 'Toskanski Suncem Sušeni Paradajz',
      description: 'Punjeni San Marzano paradajz sušeni na suncu na tradicionalnim stalkama u toskanskom predelu. Intenzivan ukus savršen za paste, salate i antipasto.',
      origin: 'Toskana, Italija'
    }
  },
  'C303': {
    en: {
      name: 'Pantelleria Capers',
      description: 'Wild capers from the volcanic island of Pantelleria. Hand-picked and brined in sea salt to preserve their distinctive pungent flavor and firm texture.',
      origin: 'Pantelleria, Italy'
    },
    sr: {
      name: 'Kapari sa Pantellerije',
      description: 'Divlji kapari sa vulkanskog ostrva Pantellerija. Ručno brani i usoljeni u morskoj soli kako bi sačuvali svoj prepoznatljiv oštar ukus i čvrstu teksturu.',
      origin: 'Pantellerija, Italija'
    }
  }
}

// Initial products data
const products = ref([
  {
    sku: 'A101',
    name: 'Premium Italian Olive Oil',
    price: 120,
    image: katanaImg,
    description: 'Extra virgin olive oil from the sun-drenched hills of Tuscany. Cold-pressed from hand-picked olives for a delicate, fruity flavor with hints of artichoke and green almond.',
    origin: 'Tuscany, Italy',
    weight: '500ml'
  },
  {
    sku: 'B202',
    name: 'Sicilian Anchovies',
    price: 85,
    image: wakisashiImg,
    description: 'Hand-filleted anchovies from the crystal clear waters of Sicily. Cured in sea salt and packed in premium Italian olive oil for an authentic taste of the Mediterranean.',
    origin: 'Sicily, Italy',
    weight: '200g'
  },
  {
    sku: 'B242',
    name: 'Tuscan Sun-Dried Tomatoes',
    price: 85,
    image: wakisashiImg,
    description: 'Plump San Marzano tomatoes sun-dried on traditional racks in the Tuscan countryside. Intense flavor perfect for pastas, salads, and antipasti.',
    origin: 'Tuscany, Italy',
    weight: '180g'
  },
  {
    sku: 'C303',
    name: 'Pantelleria Capers',
    price: 45,
    image: tantoImg,
    description: 'Wild capers from the volcanic island of Pantelleria. Hand-picked and brined in sea salt to preserve their distinctive pungent flavor and firm texture.',
    origin: 'Pantelleria, Italy',
    weight: '150g'
  }
])

const viewProductDetails = (product) => {
  alert(`Details for: ${product.name}\nPrice: $${product.price}\nDescription: ${product.description}`)
}
</script>

<style scoped>
.home-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.home-page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/novaPozadina.jpg') no-repeat center center / cover;
  opacity: 0.9;
  filter: blur(5px);
  z-index: -1;
}

.home-page {
  font-weight: bold;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  color: #000;
}

.language-select {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.language-select label {
  margin-right: 0.5rem;
  white-space: nowrap;
}

.language-select select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 120px;
}

.language-button {
  background-color: #4a6fa5;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  max-width: 200px;
}

.intro-text {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  padding: 0 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.product-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-details {
  padding: 1.25rem;
}

.product-details h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #e8c39e;
  padding-bottom: 0.5rem;
  font-size: 1.25rem;
}

.product-description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.product-info {
  margin-bottom: 1.25rem;
}

.product-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.view-details-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.view-details-btn:hover {
  background-color: #3a5a80;
}

.about-section {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.about-section h2 {
  color: #2c3e50;
  margin-top: 0;
  font-size: 1.5rem;
}

.about-section p {
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  font-size: 1rem;
}

/* Make all text elements bold */
.home-page h1,
.home-page h2,
.home-page h3,
.home-page p,
.home-page label,
.home-page li,
.home-page button {
  font-weight: bold !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .home-page {
    padding: 1.25rem;
  }
  
  .products-grid {
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .product-details {
    padding: 1rem;
  }
  
  .intro-text {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 640px) {
  .language-select {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .language-select label {
    margin-right: 0;
    text-align: center;
  }
  
  .language-select select {
    width: 100%;
  }
  
  .language-button {
    max-width: none;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    height: 180px;
  }
  
  .about-section {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .home-page-container {
    padding: 0.5rem;
  }
  
  .home-page {
    padding: 1rem;
    border-radius: 10px;
  }
  
  .product-details h2 {
    font-size: 1.1rem;
  }
  
  .product-description {
    font-size: 0.9rem;
  }
  
  .view-details-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .about-section h2 {
    font-size: 1.3rem;
  }
  
  .about-section p {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .intro-text {
    font-size: 0.95rem;
    padding: 0 0.5rem;
  }
  
  .product-details {
    padding: 0.75rem;
  }
}

/* Touch device improvements */
@media (hover: none) {
  .product-card:hover {
    transform: none;
  }
  
  .product-card:hover .product-image img {
    transform: none;
  }
  
  .view-details-btn:hover {
    background-color: #4a6fa5;
  }
}

/* Prevent zoom on input focus for mobile */
@media (max-width: 768px) {
  select {
    font-size: 16px; /* Prevents zoom on focus in iOS */
  }
}
</style>