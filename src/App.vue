<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Toast from '@/components/Toast.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>
