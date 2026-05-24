<template>
  <div class="modal-overlay" dir="rtl" @click.self="$emit('close')">
    <form class="history-form-modal" role="dialog" aria-modal="true" @submit.prevent="submitForm">
      <h2>{{ record ? `تعديل ${sectionLabel}` : `إضافة ${sectionLabel}` }}</h2>

      <div class="modal-grid">
        <label v-if="canChooseType" class="wide-field">
          <span>نوع السجل</span>
          <select v-model="selectedType">
            <option v-for="option in sections" :key="option.type" :value="option.type">
              {{ option.title }}
            </option>
          </select>
        </label>

        <label v-for="field in activeFields" :key="field.key" :class="{ 'wide-field': field.type === 'textarea' }">
          <span>{{ field.label }}</span>
          <select v-if="field.type === 'select'" v-model="form[field.key]">
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <textarea v-else-if="field.type === 'textarea'" v-model.trim="form[field.key]" rows="4" />
          <input v-else v-model.trim="form[field.key]" :type="field.type || 'text'">
          <small v-if="errors[field.key]">{{ errors[field.key] }}</small>
        </label>
      </div>

      <div class="modal-actions">
        <button class="save-button" type="submit">حفظ السجل</button>
        <button class="cancel-button" type="button" @click="$emit('close')">إلغاء</button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    default: null
  },
  sections: {
    type: Array,
    default: () => []
  },
  record: {
    type: Object,
    default: null
  },
  doctorName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({})
const errors = reactive({})
const selectedType = ref(props.section?.type || props.sections[0]?.type || 'chronic')

const fieldSets = {
  chronic: [
    { key: 'title', label: 'اسم المرض' },
    { key: 'date', label: 'تاريخ التشخيص', type: 'date' },
    { key: 'status', label: 'حالة المرض', type: 'select', options: ['مستقر', 'نشط', 'تحت المتابعة'] },
    { key: 'description', label: 'الملاحظات', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ],
  allergy: [
    { key: 'title', label: 'نوع الحساسية' },
    { key: 'severity', label: 'مستوى الخطورة', type: 'select', options: ['منخفض', 'متوسط', 'مرتفع'] },
    { key: 'reaction', label: 'وصف التفاعل', type: 'textarea' },
    { key: 'description', label: 'الملاحظات', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ],
  surgery: [
    { key: 'title', label: 'اسم العملية' },
    { key: 'date', label: 'تاريخ العملية', type: 'date' },
    { key: 'hospital', label: 'اسم المستشفى' },
    { key: 'description', label: 'ملاحظات الطبيب', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ],
  diagnosis: [
    { key: 'title', label: 'اسم التشخيص' },
    { key: 'date', label: 'تاريخ التشخيص', type: 'date' },
    { key: 'status', label: 'حالة التشخيص', type: 'select', options: ['مؤكد', 'تحت المتابعة', 'سابق'] },
    { key: 'description', label: 'الوصف الكامل', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ],
  family: [
    { key: 'title', label: 'العنوان' },
    { key: 'relation', label: 'صلة القرابة' },
    { key: 'description', label: 'الوصف', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ],
  general: [
    { key: 'title', label: 'عنوان الملاحظة' },
    { key: 'date', label: 'التاريخ', type: 'date' },
    { key: 'description', label: 'الملاحظة الطبية', type: 'textarea' },
    { key: 'doctor', label: 'اسم الطبيب' }
  ]
}

const activeSection = computed(() =>
  props.sections.find(section => section.type === selectedType.value)
    || props.section
    || props.sections[0]
    || { type: 'chronic', title: 'الأمراض المزمنة', addLabel: 'إضافة مرض مزمن' }
)
const activeFields = computed(() => fieldSets[activeSection.value.type] || fieldSets.general)
const canChooseType = computed(() => !props.record && props.sections.length > 0)
const sectionLabel = computed(() => activeSection.value.addLabel?.replace('إضافة ', '') || activeSection.value.title)

const resetErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const hydrateForm = () => {
  Object.keys(form).forEach(key => {
    delete form[key]
  })

  activeFields.value.forEach(field => {
    form[field.key] = props.record?.[field.key] || ''
  })

  form.type = activeSection.value.type
  form.doctor = form.doctor || props.doctorName
  form.date = form.date || new Date().toISOString().slice(0, 10)
  form.createdAt = props.record?.createdAt || new Date().toLocaleString('ar-u-nu-latn', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const submitForm = () => {
  resetErrors()
  activeFields.value.forEach(field => {
    if (!String(form[field.key] || '').trim()) {
      errors[field.key] = 'هذا الحقل مطلوب'
    }
  })

  if (Object.keys(errors).length) {
    return
  }

  const descriptionParts = [form.description, form.reaction, form.status, form.hospital, form.relation]
    .filter(Boolean)

  emit('save', {
    ...form,
    description: form.description || descriptionParts.join(' - '),
    notes: form.description || form.reaction || '',
    attachments: props.record?.attachments || []
  })
}

watch(selectedType, hydrateForm)
watch(() => [props.section?.type, props.record?.id], () => {
  selectedType.value = props.record?.type || props.section?.type || props.sections[0]?.type || 'chronic'
  hydrateForm()
}, { immediate: true })
</script>

<style scoped>
.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
  position: fixed;
  z-index: 2200;
}

.history-form-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 28px;
  width: 760px;
}

.history-form-modal h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 18px;
}

.modal-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.modal-grid label {
  display: grid;
  font-size: 14px;
  font-weight: 900;
  gap: 7px;
}

.wide-field {
  grid-column: 1 / -1;
}

.modal-grid input,
.modal-grid textarea,
.modal-grid select {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  outline: none;
  padding: 11px 12px;
}

.modal-grid textarea {
  line-height: 1.7;
  resize: vertical;
}

.modal-grid small {
  color: #b42318;
  font-size: 12px;
  font-weight: 800;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 22px;
}

.save-button,
.cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  min-width: 118px;
  padding: 10px 22px;
}

.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

@media (max-width: 560px) {
  .modal-overlay {
    padding: 14px;
  }

  .history-form-modal {
    border-radius: 20px;
    padding: 22px 16px;
  }

  .modal-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
