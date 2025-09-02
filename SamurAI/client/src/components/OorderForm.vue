<template>
  <div class="order-form">
    <h1>Order Weapons</h1>

    <div v-for="product in products" :key="product.sku" class="product">
      <img :src="product.image" :alt="product.name" />
      <div>
        <h2>{{ product.name }}</h2>
        <p>${{ product.price }}</p>
        <label>
          Quantity:
          <input type="number" v-model.number="product.qty" min="0" />
        </label>
      </div>
    </div>

    <form @submit.prevent="submitOrder" class="customer-form">
      <label>
        Name:
        <input v-model="customerName" required />
      </label>

      <label>
        Email:
        <input v-model="customerEmail" type="email" required />
      </label>

      <label>
        Phone Number:
        <input v-model="customerPhone" required pattern="^[0-9]+$" title="Only digits are allowed" />
      </label>

      <label>
        Address:
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
        <h3>Order Summary</h3>
        <ul>
          <li v-for="item in cart" :key="item.sku">
            {{ item.name }} × {{ item.qty }} = ${{ item.price * item.qty }}
          </li>
        </ul>
        <p>Total: ${{ total }}</p>
      </div>

      <button type="submit">Submit Order</button>
    </form>

    <div v-if="confirmation" class="confirmation">
      ✅ Order submitted successfully!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import katanaImg from '../assets/katana.jpg'
import tantoImg from '../assets/tanto.webp'
import wakisashiImg from '../assets/wakisashi.jpg'

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const customerAddress = ref('')
const confirmation = ref(false)

const products = ref([
  {
    sku: 'A101',
    name: 'Samurai Katana',
    price: 120,
    image: katanaImg,
    qty: 0
  },
  {
    sku: 'B202',
    name: 'Wakizashi Blade',
    price: 85,
    image: wakisashiImg,
    qty: 0
  },
  {
    sku: 'C303',
    name: 'Tanto Knife',
    price: 45,
    image: tantoImg,
    qty: 0
  },
  {
    sku: 'D404',
    name: 'Nodachi Greatsword',
    price: 150,
    image: nodachiImg,
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

    customerName.value = ''
    customerEmail.value = ''
    customerPhone.value = ''
    customerAddress.value = ''
    products.value.forEach(p => (p.qty = 0))
    confirmation.value = true
  } catch (err) {
    alert('Failed to submit order: ' + err.message)
  }
}
</script>

<style scoped>
.order-form {
  max-width: 700px;
  margin: 2em auto;
  padding: 1em;
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.product {
  display: flex;
  margin-bottom: 1em;
  gap: 1em;
}

.product img {
  width: 100px;
  height: auto;
  border-radius: 8px;
}

.customer-form label {
  display: block;
  margin: 1em 0 0.5em;
}

.customer-form input {
  width: 100%;
  padding: 0.5em;
  font-size: 1em;
}

.summary {
  margin-top: 1.5em;
}

.confirmation {
  margin-top: 1em;
  color: green;
  font-weight: bold;
}

.map-preview {
  margin-top: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
</style>
