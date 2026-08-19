# DosisPlus 💊

Aplicación de adherencia farmacológica construida con **Vue 3 + TypeScript + Tailwind CSS v4 + Pinia + Vue Router**.

Prototipo funcional que cubre el concepto del proyecto *DosisPlus*: recordatorio y seguimiento de dosis para pacientes con tratamientos crónicos (persona de referencia: Carmen Morales).

## Módulos

- **Hoy (Dashboard)**: cronograma diario ordenado por Mañana / Tarde / Noche, tarjetas con acciones **Tomar**, **Posponer 15 min** y **Omitir**, resumen de adherencia semanal y alerta de reposición de stock.
- **Gabinete**: fichas de medicamentos activos, stock restante, próxima dosis, edición/eliminación y formulario de alta con selector visual de forma farmacéutica, vía, frecuencia, hora, indicación y color.
- **Bitácora de Salud**: historial de síntomas, gráfica de adherencia semanal/mensual y reporte exportable a PDF (vista imprimible).
- **Perfil & Contactos**: datos del paciente, médico tratante, contactos de emergencia y gestión de personas.

## Usuarios

La app soporta **multiples perfiles locales** en el mismo dispositivo:

- **Login**: pantalla de entrada con acceso directo al perfil de prueba **Carmen** (pre-cargada con sus 7 fármacos) o creación de una cuenta nueva (que arranca **vacía**).
- Cada persona tiene su propio gabinete, horarios, bitácora y adherencia, separados por `userId`.
- Cambio de usuario desde el menú del avatar en el encabezado o desde **Perfil → Personas**.

## Stack

- Vue 3 (`<script setup>`) + TypeScript
- Tailwind CSS v4 (plugin `@tailwindcss/vite`)
- Pinia (estado) + Vue Router 5 (navegación)
- Persistencia en `localStorage` con datos de demostración

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # vue-tsc + build de producción
npm run preview  # previsualizar build
npm test         # tests unitarios (Vitest)
npm run lint     # ESLint
```

## Estructura

```
src/
├── components/
│   ├── dashboard/   # DayTimeline, AdherenceChart
│   ├── layout/      # AppShell (header + navegación inferior)
│   ├── logs/        # SymptomModal, SymptomPicker
│   ├── medication/  # MedicationCard, MedicationForm, StockBadge
│   └── ui/          # Button, Card, Badge, Modal, EmptyState
├── data/            # constantes y catálogos (formas, vías, síntomas…) + datos demo
├── router/          # rutas de la SPA (lazy-loaded, guard por meta.requiresAuth)
├── stores/          # Pinia: users, medications, logs
├── types/           # modelo de datos
├── utils/           # fechas, horarios, adherencia, color, id, almacenamiento
└── views/           # Today, Cabinet, Logbook, Profile, Login
```