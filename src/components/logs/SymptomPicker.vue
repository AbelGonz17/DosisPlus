<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Severity } from '@/types'
import { SEVERITY_META, SYMPTOMS } from '@/data/constants'

const selected = ref('')
const severity = ref<Severity>('leve')
const note = ref('')

watch(selected, (v) => {
  if (v) severity.value = 'leve'
})

function reset() {
  selected.value = ''
  severity.value = 'leve'
  note.value = ''
}

function submit() {
  if (!selected.value) return
  emit('save', {
    symptomId: selected.value,
    severity: severity.value,
    note: note.value,
  })
  reset()
}

const emit = defineEmits<{
  save: [{ symptomId: string; severity: Severity; note?: string }]
}>()

defineExpose({ reset })
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="mb-2 text-sm font-medium text-slate-700">¿Qué síntoma o efecto presentas?</p>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="s in SYMPTOMS"
          :key="s.id"
          type="button"
          class="flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition-colors"
          :class="
            selected === s.id
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          "
          @click="selected = s.id"
        >
          <span class="text-2xl">{{ s.emoji }}</span>
          {{ s.name }}
        </button>
      </div>
    </div>

    <div>
      <p class="mb-2 text-sm font-medium text-slate-700">Intensidad</p>
      <div class="flex gap-2">
        <button
          v-for="(meta, key) in SEVERITY_META"
          :key="key"
          type="button"
          class="flex-1 rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-inset transition-colors"
          :class="
            severity === key
              ? meta.classes + ' ring-2'
              : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'
          "
          @click="severity = key"
        >
          {{ meta.label }}
        </button>
      </div>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700" for="sym-note">Nota breve (opcional)</label>
      <textarea
        id="sym-note"
        v-model="note"
        rows="2"
        class="block w-full resize-none rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        placeholder="Ej. Empezó a los 20 min de tomarla."
      />
    </div>

    <button
      type="button"
      class="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!selected"
      @click="submit"
    >
      Guardar registro
    </button>
  </div>
</template>