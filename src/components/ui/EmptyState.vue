<script setup lang="ts">
defineProps<{
  title: string
  message?: string
  emoji?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
    <span class="text-4xl">{{ emoji ?? '🗂️' }}</span>
    <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
    <p v-if="message" class="max-w-xs text-sm text-slate-500">{{ message }}</p>
    <slot />
  </div>
</template>