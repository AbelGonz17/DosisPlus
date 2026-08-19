export type PharmaceuticalForm = 'capsule' | 'tablet' | 'syrup' | 'drops' | 'injection'

export type AdministrationRoute = 'oral' | 'topical' | 'subcutaneous' | 'inhalation'

export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'postponed'

export type Severity = 'leve' | 'moderado' | 'severo'

export type DayPart = 'morning' | 'afternoon' | 'evening'

export interface Medication {
  id: string
  userId: string
  name: string
  concentration: string
  form: PharmaceuticalForm
  route: AdministrationRoute
  frequencyHours: number
  startTime: string
  indication: string
  instructions?: string
  stock: number
  stockThreshold: number
  active: boolean
  color: string
  createdAt: string
}

export interface DoseSlot {
  id: string
  userId: string
  medicationId: string
  date: string
  time: string
  status: DoseStatus
  takenAt?: string
}

export interface Symptom {
  id: string
  name: string
  emoji: string
}

export interface SymptomLog {
  id: string
  userId: string
  doseId: string
  medicationId: string
  date: string
  symptomId: string
  severity: Severity
  note?: string
  createdAt: string
}

export interface DoctorContact {
  name: string
  specialty: string
  phone: string
}

export interface EmergencyContact {
  id: string
  name: string
  relation: string
  phone: string
}

export interface UserProfile {
  id: string
  name: string
  age: number
  bloodType: string
  allergies: string[]
  doctor: DoctorContact
  emergencyContacts: EmergencyContact[]
  createdAt: string
}

export type MedicationInput = Omit<
  Medication,
  'id' | 'userId' | 'active' | 'createdAt'
>