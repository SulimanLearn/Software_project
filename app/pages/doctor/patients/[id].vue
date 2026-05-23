<template>
  <div class="patient-details-page" dir="rtl">
    <NavBar />

    <div class="patient-details-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="patient-details-content">
        <header class="details-header">
          <button class="back-button" type="button" @click="goBack">
            رجوع
          </button>
          <h1>تفاصيل المريض</h1>
        </header>

        <PatientInfoHeader
          :avatar="patient.avatar"
          :name="patient.fullName"
          :items="patientHeaderItems"
        />

        <section v-if="currentAppointment" class="appointment-context-card" aria-label="تفاصيل الموعد الحالي">
          <div class="appointment-context-copy">
            <span>نوع الموعد</span>
            <strong>{{ currentAppointment.appointmentType }}</strong>
          </div>
          <div class="appointment-context-copy">
            <span>وقت الموعد</span>
            <strong>{{ currentAppointment.date }} - {{ currentAppointment.time }}</strong>
          </div>
          <div class="appointment-context-copy wide-context">
            <span>سبب الزيارة</span>
            <strong>{{ currentAppointment.reason }}</strong>
          </div>
          <a
            v-if="currentAppointment.appointmentType === 'أونلاين' && currentAppointment.meetingLink"
            class="meeting-link-button"
            :href="currentAppointment.meetingLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            دخول الاجتماع
          </a>
          <span
            v-else-if="currentAppointment.appointmentType === 'أونلاين'"
            class="meeting-link-empty"
          >
            لا يوجد رابط
          </span>
        </section>

        <section class="details-card" aria-label="تفاصيل ملف المريض">
          <div class="tabs-list" role="tablist" aria-label="أقسام تفاصيل المريض">
            <button
              v-for="tab in tabs"
              :id="`tab-${tab.key}`"
              :key="tab.key"
              class="tab-button"
              :class="{ active: activeTab === tab.key }"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :aria-controls="`panel-${tab.key}`"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div
            v-if="activeTab === 'personal'"
            id="panel-personal"
            class="tab-panel"
            role="tabpanel"
            aria-labelledby="tab-personal"
          >
            <div class="panel-heading">
              <h2>البيانات الشخصية</h2>
              <button class="primary-action" type="button" @click="openPersonalModal">
                تعديل البيانات الشخصية
              </button>
            </div>

            <div class="info-grid">
              <article>
                <span>رقم الهاتف</span>
                <strong>{{ patient.phone }}</strong>
              </article>
              <article>
                <span>البريد الإلكتروني</span>
                <strong>{{ patient.email }}</strong>
              </article>
              <article>
                <span>العنوان</span>
                <strong>{{ patient.address }}</strong>
              </article>
              <article>
                <span>تاريخ آخر زيارة</span>
                <strong>{{ patient.lastVisit }}</strong>
              </article>
              <article class="wide-info">
                <span>الحالة العامة / الملاحظات الطبية المختصرة</span>
                <strong>{{ patient.generalStatus }}</strong>
              </article>
            </div>
          </div>

          <div
            v-else-if="activeTab === 'history'"
            id="panel-history"
            class="tab-panel"
            role="tabpanel"
            aria-labelledby="tab-history"
          >
            <MedicalHistoryAccordion
              :sections="historySections"
              :records="medicalHistory"
              @add="openHistoryModal"
              @edit="openHistoryModal($event.type, $event)"
              @delete="askDelete('history', $event.id)"
              @view="viewHistoryRecord"
            />
          </div>

          <div
            v-else-if="activeTab === 'notes'"
            id="panel-notes"
            class="tab-panel"
            role="tabpanel"
            aria-labelledby="tab-notes"
          >
            <div class="panel-heading">
              <h2>الملاحظات</h2>
              <button class="primary-action" type="button" @click="openNoteModal()">
                إضافة ملاحظة
              </button>
            </div>

            <div v-if="notes.length" class="record-list">
              <article v-for="note in notes" :key="note.id" class="record-card">
                <div class="record-card-header">
                  <div>
                    <span>{{ note.date }}</span>
                    <strong>{{ note.title }}</strong>
                  </div>
                  <small>{{ note.doctor }}</small>
                </div>
                <p>{{ note.text }}</p>
                <div class="item-actions">
                  <button type="button" @click="openNoteModal(note)">تعديل</button>
                  <button class="danger-action" type="button" @click="askDelete('note', note.id)">
                    حذف
                  </button>
                </div>
              </article>
            </div>
            <div v-else class="empty-state">
              لا توجد ملاحظات لهذا المريض.
            </div>
          </div>

          <div
            v-else-if="activeTab === 'prescriptions'"
            id="panel-prescriptions"
            class="tab-panel"
            role="tabpanel"
            aria-labelledby="tab-prescriptions"
          >
            <div class="panel-heading">
              <h2>الوصفات</h2>
              <NuxtLink class="primary-action action-link" :to="prescriptionRoute">
                إضافة وصفة طبية
              </NuxtLink>
            </div>

            <div v-if="prescriptions.length" class="table-wrap">
              <table class="records-table">
                <colgroup>
                  <col class="prescription-code-col">
                  <col class="prescription-date-col">
                  <col class="prescription-doctor-col">
                  <col class="prescription-count-col">
                  <col class="prescription-status-col">
                  <col class="prescription-actions-col">
                </colgroup>
                <thead>
                  <tr>
                    <th>رقم الوصفة</th>
                    <th>تاريخ الوصفة</th>
                    <th>الطبيب</th>
                    <th>عدد الأدوية</th>
                    <th>الحالة</th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <TransitionGroup name="record-insert" tag="tbody">
                  <tr v-for="prescription in prescriptions" :key="prescription.id">
                    <td data-label="رقم الوصفة" class="ltr-text">{{ prescription.code }}</td>
                    <td data-label="تاريخ الوصفة">{{ prescription.date }}</td>
                    <td data-label="الطبيب">{{ prescription.doctor }}</td>
                    <td data-label="عدد الأدوية">{{ medicinesCount(prescription) }}</td>
                    <td data-label="الحالة">
                      <span class="status-badge" :class="prescription.status === 'نشطة' ? 'active-status' : 'ended-status'">
                        {{ prescription.status }}
                      </span>
                    </td>
                    <td data-label="إجراء">
                      <div class="table-actions">
                        <button type="button" @click="viewPrescription(prescription)">عرض</button>
                        <button type="button" @click="printPrescription(prescription)">طباعة</button>
                        <button class="danger-action" type="button" @click="askDelete('prescription', prescription.id)">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                </TransitionGroup>
              </table>
            </div>
            <div v-else class="empty-state">
              لا توجد وصفات طبية محفوظة لهذا المريض.
            </div>
          </div>

          <div
            v-else
            id="panel-reports"
            class="tab-panel"
            role="tabpanel"
            aria-labelledby="tab-reports"
          >
            <div class="panel-heading">
              <h2>التقارير</h2>
              <button class="primary-action" type="button" @click="openReportModal()">
                إضافة تقرير طبي
              </button>
            </div>

            <div v-if="reports.length" class="reports-grid">
              <article v-for="report in reports" :key="report.id" class="record-card">
                <div class="record-card-header">
                  <div>
                    <span>{{ report.date }}</span>
                    <strong>{{ report.title }}</strong>
                  </div>
                  <small>{{ report.type }}</small>
                </div>
                <p>{{ report.summary }}</p>
                <p v-if="report.fileName" class="attachment-line">مرفق: {{ report.fileName }}</p>
                <p v-if="report.externalUrl" class="attachment-line ltr-text">{{ report.externalUrl }}</p>
                <div class="item-actions">
                  <button type="button" @click="viewReport(report)">عرض</button>
                  <button type="button" @click="openReportModal(report)">تعديل</button>
                  <button class="danger-action" type="button" @click="askDelete('report', report.id)">
                    حذف
                  </button>
                  <button type="button" @click="printReport(report)">طباعة</button>
                </div>
              </article>
            </div>
            <div v-else class="empty-state">
              لا توجد تقارير طبية لهذا المريض.
            </div>
          </div>
        </section>

        <section class="quick-actions" aria-label="إجراءات سريعة">
          <NuxtLink :to="diagnosisRoute">
            إضافة تشخيص
          </NuxtLink>
          <NuxtLink :to="prescriptionRoute">
            إضافة وصفة طبية
          </NuxtLink>
          <button type="button" @click="openAppointmentModal">
            جدولة موعد جديد
          </button>
        </section>
      </main>
    </div>

    <div
      v-if="activeModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeModal"
    >
      <form
        v-if="activeModal === 'personal'"
        class="form-modal"
        aria-modal="true"
        role="dialog"
        @submit.prevent="savePersonal"
      >
        <h2>تعديل البيانات الشخصية</h2>
        <div class="modal-grid">
          <label>
            <span>رقم الهاتف</span>
            <input v-model.trim="personalForm.phone" type="text">
            <small v-if="formErrors.phone">{{ formErrors.phone }}</small>
          </label>
          <label>
            <span>البريد الإلكتروني</span>
            <input v-model.trim="personalForm.email" type="email">
            <small v-if="formErrors.email">{{ formErrors.email }}</small>
          </label>
          <label class="wide-field">
            <span>العنوان</span>
            <input v-model.trim="personalForm.address" type="text">
            <small v-if="formErrors.address">{{ formErrors.address }}</small>
          </label>
          <label class="wide-field">
            <span>الحالة العامة / ملاحظات مختصرة</span>
            <textarea v-model.trim="personalForm.generalStatus" rows="4" />
            <small v-if="formErrors.generalStatus">{{ formErrors.generalStatus }}</small>
          </label>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="submit">حفظ التعديل</button>
          <button class="cancel-button" type="button" @click="closeModal">إلغاء</button>
        </div>
      </form>

      <form
        v-else-if="activeModal === 'note'"
        class="form-modal"
        aria-modal="true"
        role="dialog"
        @submit.prevent="saveNote"
      >
        <h2>{{ editingId ? 'تعديل ملاحظة' : 'إضافة ملاحظة' }}</h2>
        <div class="modal-grid">
          <label>
            <span>عنوان الملاحظة</span>
            <input v-model.trim="noteForm.title" type="text">
            <small v-if="formErrors.title">{{ formErrors.title }}</small>
          </label>
          <label>
            <span>التاريخ</span>
            <input v-model="noteForm.date" type="date">
            <small v-if="formErrors.date">{{ formErrors.date }}</small>
          </label>
          <label>
            <span>الطبيب</span>
            <input v-model.trim="noteForm.doctor" type="text">
            <small v-if="formErrors.doctor">{{ formErrors.doctor }}</small>
          </label>
          <label class="wide-field">
            <span>نص الملاحظة</span>
            <textarea v-model.trim="noteForm.text" rows="5" />
            <small v-if="formErrors.text">{{ formErrors.text }}</small>
          </label>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="submit">حفظ الملاحظة</button>
          <button class="cancel-button" type="button" @click="closeModal">إلغاء</button>
        </div>
      </form>

      <div
        v-else-if="activeModal === 'prescriptionDetails' && selectedPrescription"
        class="form-modal details-modal"
        aria-modal="true"
        role="dialog"
      >
        <h2>تفاصيل الوصفة</h2>
        <dl class="details-list">
          <div><dt>رقم الوصفة</dt><dd class="ltr-text">{{ selectedPrescription.code }}</dd></div>
          <div><dt>اسم المريض</dt><dd>{{ patient.fullName }}</dd></div>
          <div><dt>الطبيب</dt><dd>{{ selectedPrescription.doctor }}</dd></div>
          <div><dt>تاريخ الوصفة</dt><dd>{{ selectedPrescription.date }}</dd></div>
        </dl>
        <div class="medicine-list">
          <h3>قائمة الأدوية</h3>
          <article v-for="medicine in selectedPrescription.medicines" :key="medicine.name">
            <strong>{{ medicine.name }}</strong>
            <span>{{ medicine.dose }} - {{ medicine.frequency }} - {{ medicine.duration }}</span>
            <p>{{ medicine.instructions }}</p>
          </article>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="button" @click="printPrescription(selectedPrescription)">طباعة</button>
          <button class="cancel-button" type="button" @click="closeModal">إغلاق</button>
        </div>
      </div>

      <form
        v-else-if="activeModal === 'report'"
        class="form-modal"
        aria-modal="true"
        role="dialog"
        @submit.prevent="saveReport"
      >
        <h2>{{ editingId ? 'تعديل تقرير طبي' : 'إضافة تقرير طبي' }}</h2>
        <div class="modal-grid">
          <label>
            <span>عنوان التقرير</span>
            <input v-model.trim="reportForm.title" type="text">
            <small v-if="formErrors.title">{{ formErrors.title }}</small>
          </label>
          <label>
            <span>نوع التقرير</span>
            <select v-model="reportForm.type">
              <option v-for="type in reportTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </label>
          <label>
            <span>التاريخ</span>
            <input v-model="reportForm.date" type="date">
            <small v-if="formErrors.date">{{ formErrors.date }}</small>
          </label>
          <label>
            <span>الطبيب</span>
            <input v-model.trim="reportForm.doctor" type="text">
            <small v-if="formErrors.doctor">{{ formErrors.doctor }}</small>
          </label>
          <label class="wide-field">
            <span>وصف مختصر</span>
            <textarea v-model.trim="reportForm.summary" rows="3" />
            <small v-if="formErrors.summary">{{ formErrors.summary }}</small>
          </label>
          <label class="wide-field">
            <span>محتوى التقرير</span>
            <textarea v-model.trim="reportForm.content" rows="5" />
            <small v-if="formErrors.content">{{ formErrors.content }}</small>
          </label>
          <label>
            <span>رفع ملف مرفق اختياري</span>
            <input type="file" accept="application/pdf,image/*" @change="handleReportFile">
            <small v-if="reportForm.fileName">تم اختيار: {{ reportForm.fileName }}</small>
          </label>
          <label>
            <span>رابط ملف خارجي اختياري</span>
            <input v-model.trim="reportForm.externalUrl" type="url" placeholder="https://example.com/file.pdf">
          </label>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="submit">حفظ التقرير</button>
          <button class="cancel-button" type="button" @click="closeModal">إلغاء</button>
        </div>
      </form>

      <div
        v-else-if="activeModal === 'reportDetails' && selectedReport"
        class="form-modal details-modal"
        aria-modal="true"
        role="dialog"
      >
        <h2>{{ selectedReport.title }}</h2>
        <dl class="details-list">
          <div><dt>نوع التقرير</dt><dd>{{ selectedReport.type }}</dd></div>
          <div><dt>الطبيب</dt><dd>{{ selectedReport.doctor }}</dd></div>
          <div><dt>التاريخ</dt><dd>{{ selectedReport.date }}</dd></div>
          <div><dt>اسم المريض</dt><dd>{{ patient.fullName }}</dd></div>
        </dl>
        <div class="report-content">
          <strong>وصف مختصر</strong>
          <p>{{ selectedReport.summary }}</p>
          <strong>محتوى التقرير</strong>
          <p>{{ selectedReport.content }}</p>
          <p v-if="selectedReport.fileName">مرفق: {{ selectedReport.fileName }}</p>
          <p v-if="selectedReport.externalUrl" class="ltr-text">{{ selectedReport.externalUrl }}</p>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="button" @click="printReport(selectedReport)">طباعة</button>
          <button class="cancel-button" type="button" @click="closeModal">إغلاق</button>
        </div>
      </div>

      <form
        v-else-if="activeModal === 'appointment'"
        class="form-modal"
        aria-modal="true"
        role="dialog"
        @submit.prevent="saveAppointment"
      >
        <h2>جدولة موعد جديد</h2>
        <div class="modal-grid">
          <label>
            <span>التاريخ</span>
            <input v-model="appointmentForm.date" type="date">
            <small v-if="formErrors.date">{{ formErrors.date }}</small>
          </label>
          <label>
            <span>الوقت</span>
            <input v-model="appointmentForm.time" type="time">
            <small v-if="formErrors.time">{{ formErrors.time }}</small>
          </label>
          <label>
            <span>نوع الكشف</span>
            <select v-model="appointmentForm.appointmentType">
              <option>في العيادة</option>
              <option>أونلاين</option>
            </select>
          </label>
          <label v-if="appointmentForm.appointmentType === 'أونلاين'">
            <span>رابط الاجتماع</span>
            <input v-model.trim="appointmentForm.meetingLink" type="url" placeholder="https://meet.google.com/demo-link">
          </label>
          <label>
            <span>سبب الزيارة</span>
            <input v-model.trim="appointmentForm.reason" type="text">
            <small v-if="formErrors.reason">{{ formErrors.reason }}</small>
          </label>
          <label class="wide-field">
            <span>ملاحظات</span>
            <textarea v-model.trim="appointmentForm.notes" rows="4" />
          </label>
        </div>
        <div class="modal-actions">
          <button class="save-button" type="submit">حفظ الموعد</button>
          <button class="cancel-button" type="button" @click="closeModal">إلغاء</button>
        </div>
      </form>

      <div
        v-else-if="activeModal === 'deleteConfirm'"
        class="confirmation-modal"
        aria-modal="true"
        role="dialog"
      >
        <h2>تأكيد الحذف</h2>
        <p>هل تريد حذف هذا العنصر؟</p>
        <div class="modal-actions">
          <button class="save-button danger-save" type="button" @click="confirmDelete">حذف</button>
          <button class="cancel-button" type="button" @click="closeModal">إلغاء</button>
        </div>
      </div>
    </div>

    <AddMedicalRecordModal
      v-if="isHistoryModalOpen"
      :section="historyModalSection"
      :sections="historySections"
      :record="selectedHistoryRecord"
      :doctor-name="doctor.name"
      @close="closeHistoryModal"
      @save="saveHistory"
    />

    <MedicalDetailsModal
      v-if="selectedHistoryDetails"
      :record="selectedHistoryDetails"
      :section="historySectionFor(selectedHistoryDetails.type)"
      @close="selectedHistoryDetails = null"
    />

    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div
        class="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <h2 id="logout-modal-title">تسجيل الخروج</h2>
        <p>هل انت متاكد انك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">
            نعم
          </button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">
            لا
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast-message" role="status">
      {{ toastMessage }}
    </div>

    <section v-if="printItem" class="print-zone" dir="rtl" aria-hidden="true">
      <template v-if="printItem.kind === 'prescription'">
        <h1>وصفة طبية</h1>
        <div class="print-meta">
          <p>اسم المريض: {{ patient.fullName }}</p>
          <p>رقم المريض: {{ patient.id }}</p>
          <p>الطبيب: {{ printItem.data.doctor }}</p>
          <p>التاريخ: {{ printItem.data.date }}</p>
          <p>رقم الوصفة: {{ printItem.data.code }}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>اسم الدواء</th>
              <th>الجرعة</th>
              <th>التكرار</th>
              <th>مدة الاستخدام</th>
              <th>تعليمات إضافية</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicine in printItem.data.medicines" :key="medicine.name">
              <td>{{ medicine.name }}</td>
              <td>{{ medicine.dose }}</td>
              <td>{{ medicine.frequency }}</td>
              <td>{{ medicine.duration }}</td>
              <td>{{ medicine.instructions }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <h1>{{ printItem.data.title }}</h1>
        <div class="print-meta">
          <p>اسم المريض: {{ patient.fullName }}</p>
          <p>رقم المريض: {{ patient.id }}</p>
          <p>الطبيب: {{ printItem.data.doctor }}</p>
          <p>التاريخ: {{ printItem.data.date }}</p>
          <p>نوع التقرير: {{ printItem.data.type }}</p>
        </div>
        <h2>وصف مختصر</h2>
        <p>{{ printItem.data.summary }}</p>
        <h2>محتوى التقرير</h2>
        <p>{{ printItem.data.content }}</p>
      </template>
    </section>
  </div>
</template>

<script setup>
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Dna,
  HeartPulse,
  Stethoscope
} from '@lucide/vue'
import { markRaw } from 'vue'
import AddMedicalRecordModal from '~/components/doctor/AddMedicalRecordModal.vue'
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'
import MedicalDetailsModal from '~/components/doctor/MedicalDetailsModal.vue'
import MedicalHistoryAccordion from '~/components/doctor/MedicalHistoryAccordion.vue'
import PatientInfoHeader from '~/components/doctor/PatientInfoHeader.vue'
import { useDoctorPatients } from '~/composables/doctor/useDoctorPatients'
import { useDoctorPatientRecords } from '~/composables/doctor/useDoctorPatientRecords'

const route = useRoute()
const router = useRouter()

const showLogoutModal = ref(false)
const activeTab = ref('personal')
const activeModal = ref('')
const editingId = ref(null)
const selectedPrescription = ref(null)
const selectedReport = ref(null)
const selectedHistoryRecord = ref(null)
const selectedHistoryDetails = ref(null)
const isHistoryModalOpen = ref(false)
const historyModalSectionType = ref('')
const deleteTarget = ref(null)
const toastMessage = ref('')
const printItem = ref(null)
const formErrors = reactive({})
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))
const {
  loadPersistedRecords,
  seedPatientRecords,
  diagnosesForPatient,
  prescriptionsForPatient,
  addDiagnosis,
  updateDiagnosis,
  removeDiagnosis,
  removePrescription
} = useDoctorPatientRecords()
const { createPatientRecord } = useDoctorPatients()

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const tabs = [
  { key: 'personal', label: 'البيانات الشخصية' },
  { key: 'history', label: 'التاريخ الطبي' },
  { key: 'notes', label: 'الملاحظات' },
  { key: 'prescriptions', label: 'الوصفات' },
  { key: 'reports', label: 'التقارير' }
]

if (tabs.some(tab => tab.key === String(route.query.tab || ''))) {
  activeTab.value = String(route.query.tab)
}

const historySections = [
  { type: 'chronic', title: 'الأمراض المزمنة', addLabel: 'إضافة مرض مزمن', icon: markRaw(HeartPulse) },
  { type: 'allergy', title: 'الحساسية', addLabel: 'إضافة حساسية', icon: markRaw(AlertTriangle) },
  { type: 'surgery', title: 'العمليات السابقة', addLabel: 'إضافة عملية', icon: markRaw(Stethoscope) },
  { type: 'diagnosis', title: 'التشخيصات السابقة', addLabel: 'إضافة تشخيص', icon: markRaw(ClipboardList) },
  { type: 'family', title: 'التاريخ العائلي', addLabel: 'إضافة تاريخ عائلي', icon: markRaw(Dna) },
  { type: 'general', title: 'الملاحظات الطبية العامة', addLabel: 'إضافة ملاحظة', icon: markRaw(Activity) }
]

const reportTypes = ['تقرير طبي', 'فحص دم', 'تخطيط قلب', 'أشعة', 'متابعة']

const patientRecords = {
  'p-2056': {
    patient: {
      id: 'P-2056',
      fullName: 'أحمد محمود السيد',
      age: 36,
      gender: 'ذكر',
      phone: '059 123 4567',
      email: 'ahmed@example.com',
      address: 'رام الله - حي الإرسال',
      lastVisit: '22 مايو 2026',
      generalStatus: 'حالة مستقرة مع متابعة ضغط الدم ونمط الحياة.',
      avatar: '/images/face.svg'
    },
    medicalHistory: [
      { id: 1, type: 'chronic', title: 'ارتفاع ضغط الدم', description: 'يتابع قياسات الضغط المنزلية مع انتظام جيد في العلاج.', date: '2026-05-15', doctor: 'د. خالد السيد', status: 'مستقر', createdAt: '15 مايو 2026، 10:20 ص', notes: 'ينصح بقياس الضغط صباحا ومساء مع تقليل الملح.', attachments: [] },
      { id: 2, type: 'diagnosis', title: 'خفقان متقطع', description: 'تخطيط القلب طبيعي مع توصية بتخفيف المنبهات.', date: '2026-04-02', doctor: 'د. خالد السيد', status: 'تحت المتابعة', createdAt: '02 أبريل 2026، 11:05 ص', notes: 'إعادة التقييم عند تكرار الأعراض.', attachments: ['ecg-summary.pdf'] },
      { id: 3, type: 'family', title: 'تاريخ عائلي قلبي', description: 'وجود ارتفاع ضغط لدى الأب.', date: '2026-03-18', doctor: 'د. خالد السيد', relation: 'الأب', createdAt: '18 مارس 2026، 09:45 ص', notes: 'متابعة عوامل الخطورة الوراثية.', attachments: [] }
    ],
    notes: [
      { id: 1, date: '2026-05-19', doctor: 'د. خالد السيد', title: 'متابعة الضغط', text: 'تمت مراجعة الأعراض الحالية، ويحتاج المريض إلى متابعة خلال أسبوعين.' }
    ],
    prescriptions: [
      {
        id: 1,
        code: 'RX-2056-01',
        date: '2026-05-15',
        doctor: 'د. خالد السيد',
        status: 'نشطة',
        medicines: [
          { name: 'أملوديبين 5 مجم', dose: 'قرص واحد', frequency: 'مرة يوميا', duration: '30 يوم', instructions: 'بعد الإفطار' },
          { name: 'مغنيسيوم', dose: 'قرص واحد', frequency: 'مرة مساء', duration: '14 يوم', instructions: 'بعد الطعام' }
        ]
      },
      {
        id: 2,
        code: 'RX-2056-02',
        date: '2026-04-02',
        doctor: 'د. خالد السيد',
        status: 'منتهية',
        medicines: [
          { name: 'باراسيتامول 500 مجم', dose: 'قرص', frequency: 'عند الحاجة', duration: '5 أيام', instructions: 'لا يتجاوز 3 مرات يوميا' }
        ]
      }
    ],
    reports: [
      { id: 1, title: 'تقرير قياس ضغط الدم', date: '2026-05-15', doctor: 'د. خالد السيد', summary: 'المتوسط اليومي مستقر مع ارتفاع بسيط مساء.', type: 'تقرير طبي', content: 'تمت مراجعة سجل الضغط المنزلي. ينصح بالاستمرار على العلاج ومتابعة القياسات صباحا ومساء.', fileName: '', externalUrl: '' },
      { id: 2, title: 'تخطيط قلب', date: '2026-04-02', doctor: 'د. خالد السيد', summary: 'لا توجد مؤشرات خطرة في التخطيط الحالي.', type: 'تخطيط قلب', content: 'التخطيط ضمن الحدود المقبولة مع توصية بالمراجعة عند تكرر الخفقان.', fileName: '', externalUrl: '' }
    ],
    appointments: [
      {
        id: 1,
        date: '19 مايو 2026',
        time: '10:00 ص',
        appointmentType: 'في العيادة',
        meetingLink: '',
        reason: 'كشف دوري - ضغط الدم',
        notes: 'متابعة قياسات الضغط والخطة العلاجية.'
      }
    ]
  },
  'p-2057': {
    patient: {
      id: 'P-2057',
      fullName: 'نور عبد الرحمن',
      age: 29,
      gender: 'أنثى',
      phone: '059 555 2100',
      email: 'nour@example.com',
      address: 'نابلس - شارع الجامعة',
      lastVisit: '19 مايو 2026',
      generalStatus: 'بانتظار فحص القلب ومراجعة الأعراض الأخيرة.',
      avatar: '/images/face.svg'
    },
    medicalHistory: [
      { id: 1, type: 'diagnosis', title: 'اضطراب بسيط في نبضات القلب', description: 'تم طلب تخطيط ومتابعة مستوى الجهد.', date: '2026-05-19', doctor: 'د. خالد السيد', status: 'تحت المتابعة', createdAt: '19 مايو 2026، 11:40 ص', notes: 'بانتظار نتيجة التخطيط.', attachments: [] },
      { id: 2, type: 'general', title: 'دوخة متكررة', description: 'توصية بمتابعة ضغط الدم والسوائل.', date: '2026-03-25', doctor: 'د. خالد السيد', createdAt: '25 مارس 2026، 12:10 م', notes: 'تثقيف المريضة حول شرب السوائل بانتظام.', attachments: [] }
    ],
    notes: [],
    prescriptions: [],
    reports: [
      { id: 1, title: 'تحاليل دم عامة', date: '2026-03-25', doctor: 'د. خالد السيد', summary: 'النتائج جيدة مع نقص بسيط في فيتامين د.', type: 'فحص دم', content: 'التحاليل الأساسية جيدة، ويوصى بمتابعة فيتامين د خلال شهرين.', fileName: '', externalUrl: '' }
    ],
    appointments: [
      {
        id: 1,
        date: '19 مايو 2026',
        time: '11:30 ص',
        appointmentType: 'أونلاين',
        meetingLink: 'https://meet.google.com/demo-link',
        reason: 'فحص القلب - تخطيط كهربي',
        notes: 'موعد متابعة عبر الإنترنت.'
      }
    ]
  }
}

const currentPatientId = String(route.params.id || '')
const activeRecord = patientRecords[currentPatientId] || createPatientRecord(currentPatientId)
const patient = reactive({ ...activeRecord.patient })
const patientHeaderItems = computed(() => [
  { label: 'اسم المريض', value: patient.fullName || 'مريض غير محدد' },
  { label: 'رقم المريض', value: patient.id || 'P-0000', ltr: true },
  { label: 'العمر', value: `${patient.age || 0} سنة` },
  { label: 'آخر زيارة', value: patient.lastVisit || 'غير متوفر' }
])
const baseMedicalHistory = ref((Array.isArray(activeRecord.medicalHistory) ? activeRecord.medicalHistory : []).filter(item => item.type !== 'diagnosis').map(item => ({ ...item })))
const notes = ref((Array.isArray(activeRecord.notes) ? activeRecord.notes : []).map(item => ({ ...item })))
const reports = ref((Array.isArray(activeRecord.reports) ? activeRecord.reports : []).map(item => ({ ...item })))
const appointments = ref((Array.isArray(activeRecord.appointments) ? activeRecord.appointments : []).map(item => ({ ...item })))
const storedDiagnoses = diagnosesForPatient(currentPatientId)
const prescriptions = prescriptionsForPatient(currentPatientId)
const medicalHistory = computed(() => [
  ...storedDiagnoses.value,
  ...baseMedicalHistory.value
])

const diagnosisRoute = computed(() => `/doctor/diagnosis/${currentPatientId}`)
const prescriptionRoute = computed(() => `/doctor/prescriptions/${currentPatientId}`)
const historyModalSection = computed(() => historyModalSectionType.value ? historySectionFor(historyModalSectionType.value) : null)
const currentAppointment = computed(() => appointments.value[0] || null)
const medicinesCount = (prescription) => Array.isArray(prescription?.medicines) ? prescription.medicines.length : 0

const personalForm = reactive({
  phone: '',
  email: '',
  address: '',
  generalStatus: ''
})

const noteForm = reactive({
  title: '',
  text: '',
  date: '',
  doctor: doctor.name
})

const reportForm = reactive({
  title: '',
  type: 'تقرير طبي',
  date: '',
  doctor: doctor.name,
  summary: '',
  content: '',
  fileName: '',
  externalUrl: ''
})

const appointmentForm = reactive({
  date: '',
  time: '',
  appointmentType: 'في العيادة',
  meetingLink: '',
  reason: '',
  notes: ''
})

const resetErrors = () => {
  Object.keys(formErrors).forEach(key => {
    delete formErrors[key]
  })
}

const requireFields = (form, fields) => {
  resetErrors()
  fields.forEach(field => {
    if (!String(form[field] || '').trim()) {
      formErrors[field] = 'هذا الحقل مطلوب'
    }
  })

  return Object.keys(formErrors).length === 0
}

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

const closeModal = () => {
  activeModal.value = ''
  editingId.value = null
  selectedPrescription.value = null
  selectedReport.value = null
  deleteTarget.value = null
  resetErrors()
}

const openPersonalModal = () => {
  Object.assign(personalForm, {
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    generalStatus: patient.generalStatus
  })
  activeModal.value = 'personal'
}

const savePersonal = () => {
  if (!requireFields(personalForm, ['phone', 'email', 'address', 'generalStatus'])) {
    return
  }

  Object.assign(patient, personalForm)
  closeModal()
  showToast('تم تحديث بيانات المريض بنجاح')
}

const historySectionFor = (type) => historySections.find(section => section.type === type) || historySections[0]

const openHistoryModal = (sectionType = '', item = null) => {
  historyModalSectionType.value = sectionType || item?.type || ''
  selectedHistoryRecord.value = item
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
  historyModalSectionType.value = ''
  selectedHistoryRecord.value = null
}

const saveHistory = (payload) => {
  if (selectedHistoryRecord.value) {
    if (selectedHistoryRecord.value.type === 'diagnosis') {
      updateDiagnosis(currentPatientId, selectedHistoryRecord.value.id, {
        ...payload,
        id: selectedHistoryRecord.value.id
      })
    } else {
      baseMedicalHistory.value = baseMedicalHistory.value.map(item =>
        item.id === selectedHistoryRecord.value.id
          ? { ...item, ...payload, id: selectedHistoryRecord.value.id }
          : item
      )
    }
    closeHistoryModal()
    showToast('تم تعديل السجل بنجاح')
    return
  }

  if (payload.type === 'diagnosis') {
    addDiagnosis(currentPatientId, {
      ...payload,
      id: `diagnosis-${Date.now()}`,
      doctor: payload.doctor || doctor.name,
      createdAt: payload.createdAt || new Date().toISOString()
    })
  } else {
    baseMedicalHistory.value.unshift({
      ...payload,
      id: Date.now()
    })
  }
  closeHistoryModal()
  showToast('تم إضافة السجل بنجاح')
}

const viewHistoryRecord = (record) => {
  selectedHistoryDetails.value = record
}

const openNoteModal = (note = null) => {
  editingId.value = note?.id || null
  Object.assign(noteForm, note || {
    title: '',
    text: '',
    date: '',
    doctor: doctor.name
  })
  activeModal.value = 'note'
}

const saveNote = () => {
  if (!requireFields(noteForm, ['title', 'text', 'date', 'doctor'])) {
    return
  }

  const payload = { ...noteForm }
  if (editingId.value) {
    notes.value = notes.value.map(note => note.id === editingId.value ? { ...payload, id: editingId.value } : note)
  } else {
    notes.value.unshift({ ...payload, id: Date.now() })
  }
  closeModal()
  showToast('تم حفظ الملاحظة بنجاح')
}

const viewPrescription = (prescription) => {
  selectedPrescription.value = prescription
  activeModal.value = 'prescriptionDetails'
}

const openReportModal = (report = null) => {
  editingId.value = report?.id || null
  Object.assign(reportForm, report || {
    title: '',
    type: 'تقرير طبي',
    date: '',
    doctor: doctor.name,
    summary: '',
    content: '',
    fileName: '',
    externalUrl: ''
  })
  activeModal.value = 'report'
}

const handleReportFile = (event) => {
  const file = event.target.files?.[0]
  reportForm.fileName = file?.name || ''
}

const saveReport = () => {
  if (!requireFields(reportForm, ['title', 'type', 'date', 'doctor', 'summary', 'content'])) {
    return
  }

  const payload = { ...reportForm }
  if (editingId.value) {
    reports.value = reports.value.map(report => report.id === editingId.value ? { ...payload, id: editingId.value } : report)
  } else {
    reports.value.unshift({ ...payload, id: Date.now() })
  }
  closeModal()
  showToast('تم إضافة التقرير بنجاح')
}

const viewReport = (report) => {
  selectedReport.value = report
  activeModal.value = 'reportDetails'
}

const openAppointmentModal = () => {
  Object.assign(appointmentForm, {
    date: '',
    time: '',
    appointmentType: 'في العيادة',
    meetingLink: '',
    reason: '',
    notes: ''
  })
  activeModal.value = 'appointment'
}

const saveAppointment = () => {
  if (!requireFields(appointmentForm, ['date', 'time', 'reason'])) {
    return
  }

  appointments.value.unshift({
    ...appointmentForm,
    meetingLink: appointmentForm.appointmentType === 'أونلاين' ? appointmentForm.meetingLink : '',
    id: Date.now(),
    patientId: currentPatientId
  })
  closeModal()
  showToast('تم جدولة الموعد بنجاح')
}

const askDelete = (type, id) => {
  deleteTarget.value = { type, id }
  activeModal.value = 'deleteConfirm'
}

const confirmDelete = () => {
  if (!deleteTarget.value) {
    return
  }

  const { type, id } = deleteTarget.value
  if (type === 'history') {
    const record = medicalHistory.value.find(item => item.id === id)
    if (record?.type === 'diagnosis') {
      removeDiagnosis(currentPatientId, id)
    } else {
      baseMedicalHistory.value = baseMedicalHistory.value.filter(item => item.id !== id)
    }
  } else if (type === 'note') {
    notes.value = notes.value.filter(item => item.id !== id)
  } else if (type === 'prescription') {
    removePrescription(currentPatientId, id)
  } else if (type === 'report') {
    reports.value = reports.value.filter(item => item.id !== id)
  }

  closeModal()
  showToast(type === 'history' ? 'تم حذف السجل بنجاح' : 'تم حذف العنصر بنجاح')
}

const printPrescription = (prescription) => {
  printItem.value = { kind: 'prescription', data: prescription }
  showToast('جار تجهيز الوصفة للطباعة')
  window.setTimeout(() => window.print(), 80)
}

const printReport = (report) => {
  printItem.value = { kind: 'report', data: report }
  showToast('جار تجهيز التقرير للطباعة')
  window.setTimeout(() => window.print(), 80)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  navigateTo('/doctor')
}

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

watch(
  () => route.query.tab,
  (tab) => {
    const tabName = String(tab || '')
    if (tabs.some(item => item.key === tabName)) {
      activeTab.value = tabName
    }
  }
)

onMounted(() => {
  loadPersistedRecords()
  seedPatientRecords(currentPatientId, {
    diagnoses: (Array.isArray(activeRecord.medicalHistory) ? activeRecord.medicalHistory : []).filter(item => item.type === 'diagnosis'),
    prescriptions: (Array.isArray(activeRecord.prescriptions) ? activeRecord.prescriptions : []).map(item => ({
      ...item,
      medicines: (Array.isArray(item.medicines) ? item.medicines : []).map(medicine => ({ ...medicine }))
    }))
  })
})
</script>

<style scoped>
.patient-details-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.patient-details-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-sidebar {
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.doctor-profile-card {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 26px;
  min-height: 164px;
  padding: 18px 16px;
  text-align: center;
  width: 100%;
}

.doctor-profile-card img {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  height: 70px;
  margin-bottom: 12px;
  object-fit: contain;
  padding: 8px;
  width: 82px;
}

.doctor-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.doctor-profile-card span {
  color: #343434;
  font-size: 15px;
  margin-top: 4px;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  align-items: center;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  font-size: 16px;
  font-weight: 800;
  justify-content: center;
  min-height: 34px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.sidebar-link:hover {
  transform: translateY(-1px);
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.patient-details-content {
  margin-inline: auto;
  max-width: 1120px;
  padding: 28px 32px 38px;
  width: 100%;
}

.details-header {
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.details-header h1 {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
  text-align: center;
}

.back-button,
.primary-action,
.quick-actions a,
.quick-actions button,
.save-button,
.cancel-button,
.item-actions button,
.table-actions button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.back-button,
.primary-action,
.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.back-button {
  background-color: #ffffff;
  border-color: #8dbbfb;
  color: #115bd2;
  min-width: 82px;
  padding: 8px 16px;
}

.primary-action,
.action-link {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  min-height: 40px;
  min-width: 142px;
  padding: 9px 16px;
  text-decoration: none;
}

.back-button:hover,
.primary-action:hover,
.quick-actions a:hover,
.quick-actions button:hover,
.save-button:hover,
.item-actions button:hover,
.table-actions button:hover {
  background-color: #0b4db8;
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.22);
  color: #ffffff;
  transform: translateY(-1px);
}

.patient-summary-card,
.appointment-context-card,
.details-card,
.quick-actions {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 18px;
}

.appointment-context-card {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
  padding: 12px;
}

.appointment-context-copy {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  flex: 1 1 150px;
  padding: 10px 14px;
}

.appointment-context-copy.wide-context {
  flex: 1.4 1 220px;
}

.appointment-context-copy span {
  color: #343434;
  display: block;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 6px;
}

.appointment-context-copy strong {
  font-size: 14px;
  font-weight: 900;
}

.meeting-link-button,
.meeting-link-empty {
  align-items: center;
  border-radius: 18px;
  display: inline-flex;
  font-weight: 900;
  justify-content: center;
  min-height: 42px;
  padding: 8px 16px;
}

.meeting-link-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
  text-decoration: none;
}

.meeting-link-empty {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #707070;
}

.patient-summary-card {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 14px;
  padding: 14px;
}

.patient-avatar {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 50%;
  flex: 0 0 auto;
  height: 78px;
  object-fit: contain;
  padding: 9px;
  width: 78px;
}

.summary-grid,
.info-grid {
  display: grid;
  gap: 10px;
}

.summary-grid {
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.info-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.summary-grid div,
.info-grid article,
.record-card,
.history-section,
.empty-state {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  padding: 12px 14px;
}

.summary-grid div {
  flex: 1 1 150px;
  min-width: 132px;
}

.summary-grid div:first-child {
  flex-grow: 1.45;
  min-width: 190px;
}

.summary-grid span,
.info-grid span,
.record-card span,
.details-list dt {
  color: #343434;
  display: block;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 6px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.summary-grid strong,
.info-grid strong,
.record-card strong,
.details-list dd {
  font-size: 14px;
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.ltr-text {
  direction: ltr;
  display: inline-block;
}

.details-card {
  margin-bottom: 14px;
  padding: 10px;
}

.tabs-list {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 10px;
  overflow: hidden;
  padding: 4px;
}

.tab-button {
  background-color: transparent;
  border: 0;
  border-radius: 10px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  min-height: 38px;
  padding: 8px 10px;
}

.tab-button.active,
.tab-button:hover {
  background-color: #5a99ef;
  color: #ffffff;
}

.tab-panel {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  min-width: 0;
  overflow-x: hidden;
  min-height: 300px;
  padding: 16px;
}

.panel-heading,
.record-card-header,
.section-title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  min-width: 0;
}

.panel-heading h2,
.history-section h3,
.medicine-list h3 {
  font-size: 19px;
  font-weight: 900;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.wide-info,
.wide-field {
  grid-column: 1 / -1;
}

.history-sections,
.record-list,
.reports-grid {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.history-sections {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.record-card {
  display: grid;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
}

.record-card-header {
  margin-bottom: 0;
}

.record-card small {
  color: #115bd2;
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.record-card p,
.report-content p,
.medicine-list p {
  color: #343434;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.7;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.attachment-line {
  color: #115bd2;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.item-actions,
.table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table-actions {
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.item-actions button,
.table-actions button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-width: 70px;
  padding: 7px 12px;
}

.table-actions button {
  min-width: 62px;
  padding: 7px 10px;
}

.danger-action,
.danger-save {
  border-color: #f4aaaa !important;
  color: #b42318 !important;
}

.danger-action:hover,
.danger-save:hover {
  background-color: #b42318 !important;
  color: #ffffff !important;
}

.empty-state {
  color: #343434;
  font-size: 16px;
  font-weight: 800;
  overflow-wrap: anywhere;
  padding: 34px 20px;
  text-align: center;
  white-space: normal;
  word-break: break-word;
}

.empty-state.small {
  padding: 18px 12px;
}

.table-wrap {
  overflow-x: auto;
  padding-bottom: 4px;
}

.records-table {
  border-collapse: separate;
  border-spacing: 0 10px;
  direction: rtl;
  min-width: 860px;
  table-layout: fixed;
  width: 100%;
}

.prescription-code-col {
  width: 15%;
}

.prescription-date-col {
  width: 16%;
}

.prescription-doctor-col {
  width: 17%;
}

.prescription-count-col {
  width: 12%;
}

.prescription-status-col {
  width: 14%;
}

.prescription-actions-col {
  width: 26%;
}

.records-table th,
.records-table td {
  padding: 13px 16px;
  text-align: right;
  white-space: nowrap;
}

.records-table th {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.records-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 14px;
  font-weight: 800;
  height: 62px;
  vertical-align: middle;
}

.records-table td.ltr-text {
  direction: ltr;
  display: table-cell;
  text-align: right;
}

.records-table td:first-child {
  border-right: 1px solid #8dbbfb;
  border-radius: 0 14px 14px 0;
  text-align: right;
}

.records-table td:last-child {
  border-left: 1px solid #8dbbfb;
  border-radius: 14px 0 0 14px;
  overflow: visible;
}

.records-table td:last-child .table-actions {
  height: 100%;
}

.status-badge {
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 78px;
  padding: 6px 12px;
}

.active-status {
  background-color: #dff3e7;
  color: #137446;
}

.ended-status {
  background-color: #fff2d8;
  color: #9a6507;
}

.record-insert-enter-active,
.record-insert-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.record-insert-enter-from,
.record-insert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.quick-actions {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 12px;
}

.quick-actions a,
.quick-actions button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  display: inline-flex;
  justify-content: center;
  min-height: 52px;
  padding: 10px 14px;
  text-decoration: none;
}

.quick-actions a:hover,
.quick-actions button:hover {
  background-color: #5a99ef;
  border-color: #0b63f6;
}

.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.form-modal,
.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: 80vh;
  max-width: 100%;
  overflow-y: auto;
  padding: 28px;
  width: 760px;
}

.confirmation-modal {
  text-align: center;
  width: 560px;
}

.form-modal h2,
.confirmation-modal h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 18px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.confirmation-modal p {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 26px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.modal-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.modal-grid label {
  color: #101010;
  display: grid;
  font-size: 14px;
  font-weight: 900;
  gap: 7px;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
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
  min-width: 0;
  outline: none;
  overflow-wrap: anywhere;
  padding: 11px 12px;
  white-space: normal;
  word-break: break-word;
}

.modal-grid textarea {
  line-height: 1.7;
  resize: vertical;
}

.modal-grid small {
  color: #b42318;
  font-size: 12px;
  font-weight: 800;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.modal-actions {
  background-color: #eaf2fd;
  bottom: -1px;
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 22px;
  padding-top: 12px;
  position: sticky;
}

.modal-actions button {
  font-size: 16px;
  min-width: 118px;
  padding: 10px 22px;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.details-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 16px;
}

.details-list div,
.medicine-list article,
.report-content {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  min-width: 0;
  overflow: hidden;
  padding: 12px 14px;
}

.details-list dd {
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.medicine-list {
  display: grid;
  gap: 10px;
}

.medicine-list article {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.medicine-list span {
  color: #115bd2;
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.report-content {
  display: grid;
  gap: 8px;
}

.report-content strong {
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.toast-message {
  background-color: #115bd2;
  border: 1px solid #0b63f6;
  border-radius: 18px;
  bottom: 24px;
  box-shadow: 0 14px 32px rgba(17, 91, 210, 0.24);
  color: #ffffff;
  font-weight: 900;
  inset-inline-start: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

.print-zone {
  display: none;
}

@media (max-width: 1030px) {
  .patient-details-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .patient-details-content {
    padding: 28px 22px 42px;
  }

  .summary-grid {
    gap: 8px;
  }

  .tabs-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .history-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .patient-details-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .doctor-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .doctor-profile-card img {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .doctor-profile-card span {
    display: block;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 5px;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 44px;
  }

  .sidebar-toggle span {
    background-color: #ffffff;
    border-radius: 999px;
    display: block;
    height: 2px;
    width: 22px;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 10px;
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .sidebar-nav.is-open {
    max-height: 360px;
    margin-top: 18px;
    opacity: 1;
  }

  .patient-details-content {
    padding: 28px 18px 44px;
  }

  .details-header,
  .panel-heading,
  .record-card-header {
    align-items: flex-start;
    flex-direction: column-reverse;
  }

  .details-header h1 {
    font-size: 26px;
  }

  .patient-summary-card {
    align-items: center;
  }

  .patient-avatar {
    height: 70px;
    width: 70px;
  }

  .records-table {
    min-width: 860px;
  }
}

@media (max-width: 560px) {
  .patient-details-content {
    padding: 24px 14px 36px;
  }

  .sidebar-nav,
  .info-grid,
  .quick-actions,
  .modal-grid,
  .details-list {
    grid-template-columns: 1fr;
  }

  .summary-grid div,
  .summary-grid div:first-child {
    flex: 1 1 145px;
    min-width: 132px;
  }

  .patient-summary-card,
  .appointment-context-card,
  .details-card,
  .quick-actions,
  .tab-panel {
    border-radius: 18px;
    padding: 12px;
  }

  .tabs-list {
    grid-template-columns: 1fr;
  }

  .primary-action,
  .quick-actions a,
  .quick-actions button,
  .back-button {
    width: 100%;
  }

  .modal-overlay {
    padding: 14px;
  }

  .form-modal,
  .confirmation-modal {
    border-radius: 20px;
    padding: 22px 16px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}

@media (max-width: 360px) {
  .patient-summary-card {
    flex-wrap: wrap;
  }
}

@media print {
  .patient-details-page > :not(.print-zone) {
    display: none !important;
  }

  .print-zone {
    color: #101010;
    direction: rtl;
    display: block;
    font-family: Arial, sans-serif;
    padding: 26px;
  }

  .print-zone h1 {
    border-bottom: 2px solid #101010;
    font-size: 26px;
    margin: 0 0 18px;
    padding-bottom: 12px;
  }

  .print-zone h2 {
    font-size: 18px;
    margin: 18px 0 8px;
  }

  .print-meta {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-bottom: 18px;
  }

  .print-meta p,
  .print-zone p {
    font-size: 14px;
    line-height: 1.8;
    margin: 0;
  }

  .print-zone table {
    border-collapse: collapse;
    width: 100%;
  }

  .print-zone th,
  .print-zone td {
    border: 1px solid #101010;
    font-size: 13px;
    padding: 9px;
    text-align: right;
  }
}
</style>
