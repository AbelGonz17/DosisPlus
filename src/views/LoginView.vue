<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { SEED_USER_ID } from '@/data/seed'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const users = useUsersStore()

const form = ref({ name: '', age: 0, bloodType: '' })
const error = ref('')

function enterDemo() {
  users.login(SEED_USER_ID)
  router.push({ name: 'today' })
}

function register() {
  if (!form.value.name.trim()) {
    error.value = 'Escribe tu nombre para crear la cuenta.'
    return
  }
  users.createUser({
    name: form.value.name,
    age: form.value.age || undefined,
    bloodType: form.value.bloodType,
  })
  error.value = ''
  router.push({ name: 'today' })
}

const inputClass =
  'block w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-slate-50 px-4 py-10">
    <div class="w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center text-center">
        <span class="mb-3 grid size-14 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 2.05-8.5 6 6 0 1 1 8.55 7.53" />
            <path d="M9 20h6" />
            <path d="M12 17v3" />
          </svg>
        </span>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Dosis<span class="text-indigo-600">Plus</span>
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Tu recordatorio de medicación y seguimiento de síntomas.
        </p>
      </div>

      <Button v-if="users.users.some((u) => u.id === SEED_USER_ID)" full @click="enterDemo">
        🧑‍⚕️ Entrar como Carmen (perfil de prueba)
      </Button>

      <div class="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span class="h-px flex-1 bg-slate-200" />
        o crea una cuenta
        <span class="h-px flex-1 bg-slate-200" />
      </div>

      <form class="space-y-4" @submit.prevent="register">
        <div>
          <label :class="labelClass" for="reg-name">Nombre *</label>
          <input
            id="reg-name"
            v-model="form.name"
            type="text"
            :class="inputClass"
            placeholder="Ej. Pedro Sánchez"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label :class="labelClass" for="reg-age">Edad</label>
            <input
              id="reg-age"
              v-model.number="form.age"
              type="number"
              min="0"
              :class="inputClass"
              placeholder="54"
            />
          </div>
          <div>
            <label :class="labelClass" for="reg-blood">Sangre</label>
            <input
              id="reg-blood"
              v-model="form.bloodType"
              type="text"
              :class="inputClass"
              placeholder="A+"
            />
          </div>
        </div>
        <p v-if="error" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {{ error }}
        </p>
        <Button type="submit" full>Crear cuenta y entrar</Button>
      </form>

      <p class="mt-6 text-center text-xs text-slate-400">
        Los datos se guardan únicamente en este dispositivo.
      </p>
    </div>
  </div>
</template>