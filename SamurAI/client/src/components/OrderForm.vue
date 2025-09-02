<template>
  <div class="order-form-container">
    <div class="order-form">
      <!-- Language selector with button -->
      <div class="language-select">
        <label for="lang">{{ $t('language') }}:</label>
        <select id="lang" v-model="selectedLocale">
          <option value="sr">Srpski</option>
          <option value="en">English</option>
        </select>
        <button @click="applyLanguageChange">
          {{ $t('changeLanguage') }}
        </button>
      </div>

      <h1>{{ $t('orderWeapons') }}</h1>

      <div v-for="product in products" :key="product.sku" class="product">
        <img :src="product.image" :alt="product.name" />
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>${{ product.price }}</p>
          <label>
            {{ $t('quantity') }}:
            <input type="number" v-model.number="product.qty" min="0" />
          </label>
        </div>
      </div>

      <form @submit.prevent="submitOrder" class="customer-form">
        <label>
          {{ $t('name') }}:
          <input v-model="customerName" required />
        </label>

        <label>
          {{ $t('email') }}:
          <input v-model="customerEmail" type="email" required />
        </label>

        <label>
          {{ $t('phoneNumber') }}:
          <input v-model="customerPhone" required pattern="^[0-9]+$" title="Only digits are allowed" />
        </label>

        <label>
          {{ $t('address') }}:
          <input v-model="customerAddress" required />
        </label>

        <div v-if="customerAddress" class="map-preview">
          <iframe
            :src="`https://www.google.com/maps?q=${encodeURIComponent(customerAddress)}&output=embed`"
            width="100%"
            height="200"
            frameborder="0"
            style="border-radius: 8px; margin-top: 0.5em"
            allowfullscreen
          ></iframe>
        </div>

        <div class="summary">
          <h3>{{ $t('orderSummary') }}</h3>
          <ul>
            <li v-for="item in cart" :key="item.sku">
              {{ item.name }} × {{ item.qty }} = ${{ item.price * item.qty }}
            </li>
          </ul>
          <p>{{ $t('total') }}: ${{ total }}</p>
        </div>

        <button type="submit">{{ $t('submitOrder') }}</button>
      </form>

      <!-- Popup notification -->
      <transition name="fade">
        <div v-if="showPopup" class="popup-notification">
          ✅ {{ $t('orderSuccess') }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import katanaImg from '../assets/maslinovo.jpg'
import tantoImg from '../assets/kapari.jpg'
import wakisashiImg from '../assets/incuni.png'

// Translation messages (same as before)
const messages = {
  sr: {
    language: 'Jezik',
    changeLanguage: 'Promeni jezik',
    orderWeapons: 'Poruči artikl',
    quantity: 'Količina',
    name: 'Ime',
    email: 'Email',
    phoneNumber: 'Broj telefona',
    address: 'Adresa',
    orderSummary: 'Pregled porudžbine',
    total: 'Ukupno',
    submitOrder: 'Pošalji porudžbinu',
    orderSuccess: 'Porudžbina uspešno poslata! Dobijate email i kontaktiraće vas naše osoblje.'
  },
  en: {
    language: 'Language',
    changeLanguage: 'Change Language',
    orderWeapons: 'Order',
    quantity: 'Quantity',
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    address: 'Address',
    orderSummary: 'Order Summary',
    total: 'Total',
    submitOrder: 'Submit Order',
    orderSuccess: 'Order submitted successfully! You will receive an email and our staff will contact you soon.'
  }
}

const { locale } = useI18n()

const selectedLocale = ref(locale.value)
function applyLanguageChange() {
  locale.value = selectedLocale.value
}

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const customerAddress = ref('')
const confirmation = ref(false)
const showPopup = ref(false)

const products = ref([
  {
    sku: 'A101',
    name: 'Maslinovo Ulje',
    price: 120,
    image: katanaImg,
    qty: 0
  },
  {
    sku: 'B202',
    name: 'Jadranski Inćuni',
    price: 85,
    image: wakisashiImg,
    qty: 0
  },
  {
    sku: 'B242',
    name: 'Jadranska Tuna',
    price: 85,
    image: wakisashiImg,
    qty: 0
  },
  {
    sku: 'C303',
    name: 'Kapari Plod',
    price: 45,
    image: tantoImg,
    qty: 0
  }
])

const cart = computed(() => products.value.filter(p => p.qty > 0))
const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

const submitOrder = async () => {
  try {
    const res = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName.value,
        customerEmail: customerEmail.value,
        customerPhone: customerPhone.value,
        customerAddress: customerAddress.value,
        items: cart.value.map(i => ({ sku: i.sku, qty: i.qty })),
        total: total.value
      })
    })

    if (!res.ok) throw new Error('Server error')

    await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: total.value,
        customer: customerName.value,
        realized: false,
        items: cart.value.map(i => i.name)
      })
    })

    customerName.value = ''
    customerEmail.value = ''
    customerPhone.value = ''
    customerAddress.value = ''
    products.value.forEach(p => (p.qty = 0))
    confirmation.value = true

    showPopup.value = true
    setTimeout(() => {
      showPopup.value = false
    }, 4000)
  } catch (err) {
    alert('Failed to submit order: ' + err.message)
  }
}
</script>

<style scoped>
.order-form-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
}

.order-form-container::before {
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

.order-form {
  font-weight: bold;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5em;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  color: #000;
}

.language-select {
  margin-bottom: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  align-items: center;
}

.language-select select,
.language-select button {
  padding: 0.4em 0.7em;
  font-size: 0.9em;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.product {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  gap: 1em;
  flex-wrap: wrap;
}

.product img {
  width: 100px;
  height: auto;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 150px;
}

.customer-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.customer-form label {
  display: flex;
  flex-direction: column;
  margin: 1em 0 0.5em;
  font-weight: bold;
  width: 100%;
  max-width: 400px;
}

.customer-form input {
  width: 100%;
  padding: 0.7em;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  margin-top: 0.3em;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.summary {
  margin-top: 1.5em;
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.map-preview {
  margin-top: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.popup-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 1em 1.5em;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
  font-weight: 600;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.order-form button {
  background-color: #4a6fa5;
  color: white;
  padding: 0.7em 1.5em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1em;
  width: 100%;
  max-width: 200px;
}

.order-form button:hover {
  background-color: #3a5a80;
}

/* 📱 Mobile responsive tweaks */
@media (max-width: 600px) {
  .order-form {
    padding: 1em;
  }

  .product {
    flex-direction: column;
    align-items: flex-start;
  }

  .product img {
    width: 100%;
    max-width: 200px;
  }

  .customer-form label {
    max-width: 100%;
  }

  .map-preview {
    max-width: 100%;
  }

  .order-form button {
    max-width: 100%;
  }

  .language-select {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
