<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Medication, MedicationInput, PharmaceuticalForm } from '@/types'
import {
  ADMINISTRATION_ROUTES,
  FREQUENCY_OPTIONS,
  INDICATION_OPTIONS,
  MEDICATION_COLORS,
  PHARMACEUTICAL_FORMS,
} from '@/data/constants'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  initial?: Medication
}>()

const emit = defineEmits<{
  save: [input: MedicationInput]
  cancel: []
}>()

const form = reactive<MedicationInput>({
  name: props.initial?.name ?? '',
  concentration: props.initial?.concentration ?? '',
  form: props.initial?.form ?? 'tablet',
  route: props.initial?.route ?? 'oral',
  frequencyHours: props.initial?.frequencyHours ?? 24,
  startTime: props.initial?.startTime ?? '08:00',
  indication: props.initial?.indication ?? 'No especificada',
  instructions: props.initial?.instructions ?? '',
  stock: props.initial?.stock ?? 30,
  stockThreshold: props.initial?.stockThreshold ?? 7,
  color: props.initial?.color ?? MEDICATION_COLORS[0],
})

const error = ref('')

function selectForm(f: PharmaceuticalForm) {
  form.form = f
}

function submit() {
  if (!form.name.trim()) {
    error.value = 'Indica el nombre del medicamento.'
    return
  }
  if (!form.concentration.trim()) {
    error.value = 'Indica la concentración o dosis.'
    return
  }
  error.value = ''
  emit('save', { ...form })
}

const inputClass =
  'block w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div>
      <label :class="labelClass" for="med-name">Nombre</label>
      <input
        id="med-name"
        v-model="form.name"
        type="text"
        :class="inputClass"
        placeholder="Ej. Losartán"
      />
    </div>

    <div>
      <label :class="labelClass" for="med-concentration">Concentración / dosis</label>
      <input
        id="med-concentration"
        v-model="form.concentration"
        type="text"
        :class="inputClass"
        placeholder="Ej. 50 mg"
      />
    </div>

    <div>
      <span class="block text-sm font-medium text-slate-700">Forma farmacéutica</span>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <button
          v-for="f in PHARMACEUTICAL_FORMS"
          :key="f.id"
          type="button"
          class="flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition-colors"
          :class="
            form.form === f.id
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          "
          @click="selectForm(f.id)"
        >
          <span class="text-2xl">{{ f.emoji }}</span>
          {{ f.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label block text-sm font-medium text-slate-700" for="med-route">Vía</label>
        <select id="med-route" v-model="form.route" class="mt-1" :class="inputClass">
          <option v-for="r in ADMINISTRATION_ROUTES" :key="r.id" :value="r.id">
            {{ r.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="label block text-sm font-medium text-slate-700" for="med-frequency">Frecuencia</label>
        <select id="med-frequency" v-model="form.frequencyHours" class="mt-1" :class="inputClass">
          <option v-for="f in FREQUENCY_OPTIONS" :key="f.hours" :value="f.hours">
            {{ f.label }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label class="label block text-sm font-medium text-slate-700" for="med-time">Hora inicial de la primera dosis</label>
      <input
        id="med-time"
        v-model="form.startTime"
        type="time"
        class="mt-1"
        :class="inputClass"
      />
    </div>

    <div>
      <label class="label block text-sm font-medium text-slate-700" for="med-indication">Indicación especial</label>
      <select id="med-indication" v-model="form.indication" class="mt-1" :class="inputClass">
        <option v-for="i in INDICATION_OPTIONS" :key="i" :value="i">
          {{ i }}
        </option>
      </select>
    </div>

    <div>
      <label class="label block text-sm font-medium text-slate-700" for="med-instructions">Instrucciones (opcional)</label>
      <textarea
        id="med-instructions"
        v-model="form.instructions"
        rows="2"
        class="mt-1 resize-none"
        :class="inputClass"
        placeholder="Ej. No suspender sin indicación médica."
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label block text-sm font-medium text-slate-700" for="med-stock">Pastillas restantes</label>
        <input
          id="med-stock"
          v-model.number="form.stock"
          type="number"
          min="0"
          class="mt-1"
          :class="inputClass"
        />
      </div>
      <div>
        <label class="label block text-sm font-medium text-slate-700" for="med-threshold">Alerta al llegar a</label>
        <input
          id="med-threshold"
          v-model.number="form.stockThreshold"
          type="number"
          min="0"
          class="mt-1"
          :class="inputClass"
        />
      </div>
    </div>

    <div>
      <span class="label block text-sm font-medium text-slate-700">Color de identificación</span>
      <div class="mt-2 flex flex-wrap gap-2">
        <button
          v-for="c in MEDICATION_COLORS"
          :key="c"
          type="button"
          class="size-8 rounded-full ring-2 ring-offset-2 transition-transform"
          :class="form.color === c ? 'ring-slate-900 scale-110' : 'ring-transparent hover:scale-110'"
          :style="{ backgroundColor: c }"
          :aria-label="'Color ' + c"
          @click="form.color = c"
        />
      </div>
    </div>

    <p v-if="error" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ error }}
    </p>

    <div class="flex gap-3">
      <Button variant="secondary" full @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" full>{{ props.initial ? 'Guardar cambios' : 'Guardar medicamento' }}</Button>
    </div>
  </form>
</template>