<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
  }>(),
  { padded: true },
)
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white shadow-sm"
    :class="padded ? 'p-4' : ''"
  >
    <slot />
  </div>
</template>