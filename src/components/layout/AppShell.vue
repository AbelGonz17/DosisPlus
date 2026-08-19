<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import UserMenu from '@/components/layout/UserMenu.vue'

const route = useRoute()
const users = useUsersStore()

const items = [
  { to: { name: 'today' }, label: 'Hoy', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5' },
  { to: { name: 'cabinet' }, label: 'Gabinete', icon: 'M12 4.5 3.75 8.25 12 12l8.25-3.75L12 4.5Zm0 0v11.25m8.25-3.375V12a6.75 6.75 0 0 1-13.5 0v-2.25M12 15.75l-8.25 3.75' },
  { to: { name: 'logbook' }, label: 'Bitácora', icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' },
  { to: { name: 'profile' }, label: 'Perfil', icon: 'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
]
</script>

<template>
  <div class="mx-auto flex min-h-svh w-full flex-col">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur print:hidden">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <div class="flex items-center gap-6">
          <RouterLink :to="{ name: 'today' }" class="flex items-center gap-2">
            <span class="grid size-8 place-items-center rounded-xl bg-indigo-600 text-white">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 2.05-8.5 6 6 0 1 1 8.55 7.53" />
                <path d="M9 20h6" />
                <path d="M12 17v3" />
              </svg>
            </span>
            <span class="text-lg font-bold tracking-tight text-slate-900">Dosis<span class="text-indigo-600">Plus</span></span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="ml-4 hidden items-center gap-1 md:flex">
            <RouterLink
              v-for="item in items"
              :key="item.to.name"
              :to="item.to"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.name === item.to.name ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <svg
                class="size-4"
                :class="route.name === item.to.name ? 'fill-indigo-600/20 stroke-indigo-700' : 'fill-slate-400/20 stroke-slate-500'"
                viewBox="0 0 24 24"
                stroke-width="2"
                aria-hidden="true"
              >
                <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <UserMenu />
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-8">
      <RouterView v-slot="{ Component }">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
          mode="out-in"
        >
          <component :is="Component" :key="$route.path + '-' + users.activeUserId" />
        </Transition>
      </RouterView>
    </main>

    <!-- Mobile Navigation -->
    <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden print:hidden">
      <div class="mx-auto grid max-w-md grid-cols-4">
        <RouterLink
          v-for="item in items"
          :key="item.to.name"
          :to="item.to"
          class="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
          :class="route.name === item.to.name ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
        >
          <svg
            class="size-6"
            :class="route.name === item.to.name ? 'fill-indigo-600' : 'fill-slate-400'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
  </div>
</template>