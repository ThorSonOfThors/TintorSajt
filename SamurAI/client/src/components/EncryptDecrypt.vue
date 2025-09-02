<template>
  <div class="encrypt-decrypt p-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Encrypt & Decrypt Message</h2>

    <input v-model="password" type="text" placeholder="Enter password" class="input mb-2 w-full" />
    <textarea v-model="message" placeholder="Enter message" class="textarea mb-2 w-full"></textarea>

    <div class="flex gap-2 mb-4">
      <button @click="encrypt" class="btn">Encrypt</button>
      <button @click="decrypt" class="btn">Decrypt</button>
    </div>

    <p class="text-sm break-words"><strong>Result:</strong> {{ result }}</p>
  </div>
</template>

<script setup>
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

const message = ref('')
const password = ref('')
const result = ref('')

function encrypt() {
  const key = CryptoJS.SHA256(password.value).toString()
  const encrypted = CryptoJS.AES.encrypt(message.value, key).toString()
  result.value = encrypted
}

function decrypt() {
  try {
    const key = CryptoJS.SHA256(password.value).toString()
    const bytes = CryptoJS.AES.decrypt(result.value, key)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    result.value = decrypted || '[Decryption failed]'
  } catch {
    result.value = '[Decryption failed]'
  }
}
</script>

<style scoped>
.input, .textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn {
  background: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
</style>
