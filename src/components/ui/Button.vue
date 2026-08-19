<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
    size?: 'sm' | 'md'
    full?: boolean
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    full: false,
    type: 'button',
    disabled: false,
  },
)

const styles: Record<string, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 shadow-sm',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-sm',
      full ? 'w-full' : '',
      styles[variant],
    ]"
  >
    <slot />
  </button>
</template>