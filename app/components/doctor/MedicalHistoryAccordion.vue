<template>
  <section class="history-workspace" aria-label="التاريخ الطبي">
    <div class="history-toolbar">
      <div>
        <h2>التاريخ الطبي</h2>
        <p>ملف منظم حسب نوع السجل مع عرض مختصر للتفاصيل الأهم.</p>
      </div>
      <button class="primary-action" type="button" @click="$emit('add')">
        إضافة سجل طبي
      </button>
    </div>

    <div class="accordion-list">
      <article
        v-for="section in sections"
        :key="section.type"
        class="accordion-card"
        :class="{ open: openSection === section.type }"
      >
        <header>
          <button
            class="accordion-trigger"
            type="button"
            :aria-expanded="openSection === section.type"
            @click="toggleSection(section.type)"
          >
            <span class="section-icon" :class="`tone-${section.type}`" aria-hidden="true">
              <component :is="section.icon" :size="20" :stroke-width="2" />
            </span>
            <span class="section-title">
              <strong>{{ section.title }}</strong>
              <small>{{ recordsByType(section.type).length }} سجل</small>
            </span>
            <span class="chevron" aria-hidden="true">
              <ChevronDown :size="22" :stroke-width="2.4" />
            </span>
          </button>

          <button class="section-add-button" type="button" @click="$emit('add', section.type)">
            {{ section.addLabel }}
          </button>
        </header>

        <Transition name="accordion">
          <div v-show="openSection === section.type" class="accordion-body">
            <MedicalTimeline
              :records="recordsByType(section.type)"
              @view="$emit('view', $event)"
              @edit="$emit('edit', $event)"
              @delete="$emit('delete', $event)"
            />
          </div>
        </Transition>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ChevronDown } from '@lucide/vue'
import MedicalTimeline from '~/components/doctor/MedicalTimeline.vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true
  },
  records: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add', 'edit', 'delete', 'view'])

const openSection = ref('')
const recordsByType = (type) => props.records.filter(record => record.type === type)

const toggleSection = (type) => {
  openSection.value = openSection.value === type ? '' : type
}
</script>

<style scoped>
.history-workspace {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.history-toolbar {
  align-items: center;
  background-color: #eaf2fd;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding: 14px 16px;
}

.history-toolbar > div {
  min-width: 0;
}

.history-toolbar h2 {
  font-size: 19px;
  font-weight: 900;
  margin: 0 0 5px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.history-toolbar p {
  color: #5a6473;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.primary-action,
.section-add-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.primary-action {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
  min-height: 40px;
  min-width: 138px;
  padding: 9px 16px;
}

.primary-action:hover,
.section-add-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
}

.accordion-list {
  display: grid;
  gap: 12px;
}

.accordion-card {
  background-color: #ffffff;
  border: 1px solid #d6e7ff;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(17, 91, 210, 0.07);
  min-width: 0;
  overflow: hidden;
}

.accordion-card.open {
  border-color: #8dbbfb;
}

.accordion-card header {
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 10px 12px;
}

.accordion-trigger {
  align-items: center;
  background-color: transparent;
  border: 0;
  color: #101010;
  cursor: pointer;
  display: grid;
  font-family: inherit;
  gap: 11px;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  min-width: 0;
  padding: 0;
  text-align: right;
}

.section-icon {
  align-items: center;
  background-color: #eaf2fd;
  border-radius: 14px;
  color: #115bd2;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.tone-allergy {
  color: #0f766e;
}

.tone-surgery {
  color: #7c3aed;
}

.tone-diagnosis {
  color: #2563eb;
}

.tone-family {
  color: #0f766e;
}

.tone-general {
  color: #64748b;
}

.section-title {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.section-title strong {
  font-size: 15px;
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.section-title small {
  color: #5a6473;
  font-size: 12px;
  font-weight: 800;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.chevron {
  align-items: center;
  color: #115bd2;
  display: inline-flex;
  justify-content: center;
  transform: rotate(0deg);
  transition: transform 0.22s ease;
}

.accordion-card.open .chevron {
  transform: rotate(180deg);
}

.section-add-button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-height: 34px;
  min-width: 96px;
  padding: 6px 12px;
}

.accordion-body {
  border-top: 1px solid #edf5ff;
  min-width: 0;
  overflow-x: hidden;
  padding: 4px 14px 14px;
}

.accordion-enter-active,
.accordion-leave-active {
  max-height: 700px;
  opacity: 1;
  transition: max-height 0.28s ease, opacity 0.22s ease, padding 0.22s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
  padding-top: 0;
}

@media (max-width: 720px) {
  .history-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action {
    width: 100%;
  }

  .accordion-card header {
    grid-template-columns: 1fr;
  }

  .section-add-button {
    width: 100%;
  }
}
</style>
