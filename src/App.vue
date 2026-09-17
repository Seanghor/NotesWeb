<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white"
  >
    <Navbar />
    <RouterView />
  </div>
</template>
