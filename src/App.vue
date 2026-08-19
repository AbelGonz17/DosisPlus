<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useMedicationsStore } from '@/stores/medications'

const users = useUsersStore()
const meds = useMedicationsStore()

watch(
  () => users.activeUserId,
  (id) => {
    if (id) meds.ensureRecent()
  },
  { immediate: true },
)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>