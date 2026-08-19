<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useMedicationsStore } from '@/stores/medications'
import { useLogsStore } from '@/stores/logs'
import { resetStorage } from '@/utils/storage'
import { seedMedications, seedUser } from '@/data/seed'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const users = useUsersStore()
const meds = useMedicationsStore()
const logs = useLogsStore()

const active = users.activeUser

const editingDoctor = ref(false)
const doctorForm = ref({ ...(active?.doctor ?? { name: '', specialty: '', phone: '' }) })
const addingContact = ref(false)
const contactForm = ref({ name: '', relation: '', phone: '' })
const creatingUser = ref(false)
const newUserForm = ref({ name: '', age: 0, bloodType: '' })

function saveDoctor() {
  if (!active) return
  users.updateUser(active.id, { doctor: { ...doctorForm.value } })
  editingDoctor.value = false
}

function addContact() {
  if (!active || !contactForm.value.name.trim()) return
  users.updateUser(active.id, {
    emergencyContacts: [
      ...active.emergencyContacts,
      { ...contactForm.value, id: `ec_${Date.now()}` },
    ],
  })
  contactForm.value = { name: '', relation: '', phone: '' }
  addingContact.value = false
}

function createUser() {
  if (!newUserForm.value.name.trim()) return
  users.createUser({
    name: newUserForm.value.name,
    age: newUserForm.value.age || undefined,
    bloodType: newUserForm.value.bloodType,
  })
  newUserForm.value = { name: '', age: 0, bloodType: '' }
  creatingUser.value = false
}

function removeActiveUser() {
  if (!active) return
  if (
    window.confirm(
      `¿Eliminar a ${active.name}? Se borrarán sus medicamentos, dosis y registros.`,
    )
  ) {
    users.removeUser(active.id)
  }
}

function resetDemo() {
  if (!window.confirm('Restaurar los datos de demostración (Carmen Morales)?')) return
  resetStorage()
  users.users = [seedUser]
  users.activeUserId = seedUser.id
  meds.medications = [...seedMedications]
  meds.dosesByDate = {}
  logs.symptomLogs = []
  meds.ensureRecent()
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

const inputClass =
  'block w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'
</script>

<template>
  <div v-if="active" class="space-y-4">
    <h1 class="text-xl font-bold text-slate-900">Perfil</h1>

    <Card>
      <div class="flex items-center gap-3">
        <div class="grid size-14 place-items-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700">
          {{ initials(active.name) }}
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-slate-900">{{ active.name }}</p>
          <p class="text-sm text-slate-500">
            {{ active.age }} años · Sangre {{ active.bloodType }}
          </p>
          <div class="mt-1 flex flex-wrap gap-1">
            <Badge v-for="a in active.allergies" :key="a" classes="bg-rose-50 text-rose-700 ring-rose-200">
              Alergia: {{ a }}
            </Badge>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Médico tratante</h2>
        <button
          class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          @click="editingDoctor = true"
        >
          Editar
        </button>
      </div>
      <p class="font-medium text-slate-900">{{ active.doctor.name || 'Sin médico registrado' }}</p>
      <p class="text-sm text-slate-500">
        {{ active.doctor.specialty }} · {{ active.doctor.phone }}
      </p>
    </Card>

    <Card>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Contactos de emergencia</h2>
        <button
          class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          @click="addingContact = true"
        >
          + Añadir
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="c in active.emergencyContacts"
          :key="c.id"
          class="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">{{ c.name }}</p>
            <p class="text-xs text-slate-500">{{ c.relation }} · {{ c.phone }}</p>
          </div>
          <button
            class="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
            :aria-label="`Eliminar a ${c.name}`"
            @click="
              users.updateUser(active.id, {
                emergencyContacts: active.emergencyContacts.filter((x) => x.id !== c.id),
              })
            "
          >
            <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <p v-if="active.emergencyContacts.length === 0" class="text-sm text-slate-400">
          Sin contactos de emergencia.
        </p>
      </div>
    </Card>

    <Card>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Personas</h2>
        <button
          class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          @click="creatingUser = true"
        >
          + Crear usuario
        </button>
      </div>
      <div class="space-y-2">
        <div
          v-for="u in users.users"
          :key="u.id"
          class="flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5"
          :class="u.id === active.id ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-slate-50'"
        >
          <div class="flex items-center gap-2.5">
            <span class="grid size-8 place-items-center rounded-lg bg-white text-xs font-bold text-indigo-700 ring-1 ring-slate-200">
              {{ initials(u.name) }}
            </span>
            <div>
              <p class="text-sm font-medium text-slate-900">{{ u.name }}</p>
              <p class="text-xs text-slate-500">
                {{ u.id === active.id ? 'Usuario activo' : 'Perfil guardado' }}
              </p>
            </div>
          </div>
          <button
            v-if="u.id !== active.id"
            class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 transition-colors hover:bg-indigo-100"
            @click="users.login(u.id)"
          >
            Entrar
          </button>
        </div>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Eliminar cuenta</h2>
          <p class="text-sm text-slate-500">
            Borra a {{ active.name }} y todos sus datos del dispositivo.
          </p>
        </div>
        <Button variant="danger" size="sm" @click="removeActiveUser">Eliminar</Button>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">Datos de demostración</h2>
          <p class="text-sm text-slate-500">Restablece los datos de ejemplo de Carmen Morales.</p>
        </div>
        <Button variant="secondary" size="sm" @click="resetDemo">Restablecer</Button>
      </div>
    </Card>

    <Modal :open="editingDoctor" @close="editingDoctor = false">
      <template #title>Editar médico tratante</template>
      <form class="space-y-4" @submit.prevent="saveDoctor">
        <div>
          <label :class="labelClass" for="doc-name">Nombre</label>
          <input id="doc-name" v-model="doctorForm.name" type="text" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass" for="doc-spec">Especialidad</label>
          <input id="doc-spec" v-model="doctorForm.specialty" type="text" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass" for="doc-phone">Teléfono</label>
          <input id="doc-phone" v-model="doctorForm.phone" type="text" :class="inputClass" />
        </div>
        <Button type="submit" full>Guardar</Button>
      </form>
    </Modal>

    <Modal :open="addingContact" @close="addingContact = false">
      <template #title>Añadir contacto de emergencia</template>
      <form class="space-y-4" @submit.prevent="addContact">
        <div>
          <label :class="labelClass" for="ec-name">Nombre</label>
          <input id="ec-name" v-model="contactForm.name" type="text" :class="inputClass" placeholder="Ej. Luis Morales" />
        </div>
        <div>
          <label :class="labelClass" for="ec-rel">Parentesco</label>
          <input id="ec-rel" v-model="contactForm.relation" type="text" :class="inputClass" placeholder="Ej. Esposo" />
        </div>
        <div>
          <label :class="labelClass" for="ec-phone">Teléfono</label>
          <input id="ec-phone" v-model="contactForm.phone" type="text" :class="inputClass" placeholder="Ej. (809) 555-0131" />
        </div>
        <Button type="submit" full>Guardar</Button>
      </form>
    </Modal>

    <Modal :open="creatingUser" @close="creatingUser = false">
      <template #title>Crear nuevo usuario</template>
      <form class="space-y-4" @submit.prevent="createUser">
        <div>
          <label :class="labelClass" for="nu-name">Nombre *</label>
          <input id="nu-name" v-model="newUserForm.name" type="text" :class="inputClass" placeholder="Ej. Pedro Sánchez" required />
        </div>
        <div>
          <label :class="labelClass" for="nu-age">Edad (opcional)</label>
          <input id="nu-age" v-model.number="newUserForm.age" type="number" min="0" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass" for="nu-blood">Tipo de sangre (opcional)</label>
          <input id="nu-blood" v-model="newUserForm.bloodType" type="text" :class="inputClass" placeholder="Ej. A+" />
        </div>
        <Button type="submit" full>Crear y entrar</Button>
      </form>
    </Modal>
  </div>
</template>