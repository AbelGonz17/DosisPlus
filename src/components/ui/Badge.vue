<script setup lang="ts">
withDefaults(
  defineProps<{
    classes?: string
    dot?: string
  }>(),
  { classes: '', dot: '' },
)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    :class="classes"
  >
    <span v-if="dot" class="size-1.5 rounded-full" :style="{ backgroundColor: dot }" />
    <slot />
  </span>
</template>