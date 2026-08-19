import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { UserProfile } from '@/types'
import { loadJSON, saveJSON } from '@/utils/storage'
import { uid } from '@/utils/id'
import { seedUser, SEED_USER_ID } from '@/data/seed'
import { useMedicationsStore } from './medications'
import { useLogsStore } from './logs'

const KEY_USERS = 'users'
const KEY_ACTIVE = 'active_user'

function loadUsers(): UserProfile[] {
  const stored = loadJSON<UserProfile[] | null>(KEY_USERS, null)
  if (stored && stored.length > 0) return stored
  const legacy = loadJSON<Omit<UserProfile, 'id' | 'createdAt'> | null>('profile', null)
  if (legacy && legacy.name) {
    return [
      {
        ...legacy,
        id: SEED_USER_ID,
        createdAt: new Date().toISOString(),
      },
    ]
  }
  return [seedUser]
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserProfile[]>(loadUsers())
  const activeUserId = ref<string | null>(loadJSON(KEY_ACTIVE, null))

  watch(
    users,
    (v) => saveJSON(KEY_USERS, v),
    { deep: true },
  )
  watch(activeUserId, (v) => saveJSON(KEY_ACTIVE, v))

  const activeUser = computed(
    () => users.value.find((u) => u.id === activeUserId.value) ?? null,
  )

  function login(id: string): void {
    if (!users.value.some((u) => u.id === id)) return
    activeUserId.value = id
  }

  function logout(): void {
    activeUserId.value = null
  }

  function createUser(input: { name: string; age?: number; bloodType?: string }): UserProfile {
    const user: UserProfile = {
      id: uid('user'),
      name: input.name.trim(),
      age: input.age ?? 0,
      bloodType: input.bloodType?.trim() || 'Sin definir',
      allergies: [],
      doctor: { name: '', specialty: '', phone: '' },
      emergencyContacts: [],
      createdAt: new Date().toISOString(),
    }
    users.value.push(user)
    activeUserId.value = user.id
    return user
  }

  function updateUser(id: string, patch: Partial<UserProfile>): void {
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], ...patch }
  }

  function removeUser(id: string): void {
    const meds = useMedicationsStore()
    const logs = useLogsStore()
    meds.purgeUserData(id)
    logs.purgeUserData(id)
    users.value = users.value.filter((u) => u.id !== id)
    if (activeUserId.value === id) {
      activeUserId.value = users.value[0]?.id ?? null
    }
  }

  return {
    users,
    activeUserId,
    activeUser,
    login,
    logout,
    createUser,
    updateUser,
    removeUser,
  }
})