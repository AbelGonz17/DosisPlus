<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const users = useUsersStore()

const open = ref(false)

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

function switchUser(id: string) {
  users.login(id)
  open.value = false
  router.push({ name: 'today' })
}

function goToUsers() {
  open.value = false
  router.push({ name: 'profile' })
}

function logout() {
  users.logout()
  open.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-slate-100"
      aria-label="Menú de usuario"
      @click="open = !open"
    >
      <span class="grid size-8 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {{ initials(users.activeUser?.name ?? '?') }}
      </span>
      <span class="hidden text-sm font-medium text-slate-700 sm:block">
        {{ users.activeUser?.name?.split(' ')[0] }}
      </span>
      <svg class="size-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>

    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div class="border-b border-slate-100 px-4 py-3">
          <p class="text-sm font-semibold text-slate-900">{{ users.activeUser?.name }}</p>
          <p class="text-xs text-slate-500">Cambiar de usuario</p>
        </div>
        <div class="max-h-56 overflow-y-auto py-1">
          <button
            v-for="u in users.users"
            :key="u.id"
            class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50"
            @click="switchUser(u.id)"
          >
            <span
              class="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
              :class="u.id === users.activeUserId ? 'bg-indigo-600' : 'bg-slate-400'"
            >
              {{ initials(u.name) }}
            </span>
            <span class="flex-1 truncate font-medium text-slate-700">{{ u.name }}</span>
            <span v-if="u.id === users.activeUserId" class="text-xs font-semibold text-indigo-600">
              Activo
            </span>
          </button>
        </div>
        <div class="border-t border-slate-100 p-1.5">
          <button
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            @click="goToUsers"
          >
            <svg class="size-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 2.656 6.75a.75.75 0 0 1 .764-.046 6.5 6.5 0 0 0 3.16.87.75.75 0 0 1 .5.164 7.003 7.003 0 0 1 5.84 0 .75.75 0 0 1 .5-.164 6.5 6.5 0 0 0 3.16-.87.75.75 0 0 1 .764.046 10.004 10.004 0 0 1 1.992 2.654 1.651 1.651 0 0 1 0 1.186 10.004 10.004 0 0 1-1.992 2.654.75.75 0 0 1-.764.046 6.5 6.5 0 0 0-3.16-.87.75.75 0 0 1-.5-.164 7.003 7.003 0 0 1-5.84 0 .75.75 0 0 1-.5.164 6.5 6.5 0 0 0-3.16.87.75.75 0 0 1-.764-.046A10.004 10.004 0 0 1 .664 10.59Z" clip-rule="evenodd" />
            </svg>
            Gestionar personas
          </button>
          <button
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            @click="logout"
          >
            <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clip-rule="evenodd" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>