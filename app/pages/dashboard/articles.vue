<template>
  <div class="dashboard-page" dir="rtl">
    <NavBar />

    <div class="dashboard-shell">
      <aside class="admin-sidebar" aria-label="لوحة تحكم المدير">
        <div class="sidebar-header">
          <span class="logo-text">
            <h2>مجمع الحياة الطبي</h2>
          </span>

          <button
            class="sidebar-toggle"
            type="button"
            :aria-expanded="isSidebarOpen"
            aria-controls="admin-sidebar-nav"
            aria-label="فتح وإغلاق قائمة لوحة التحكم"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="admin-sidebar-nav"
          class="sidebar-nav"
          :class="{ 'is-open': isSidebarOpen }"
        >
          <span class="nav-caption">الرئيسي</span>
          <NuxtLink to="/dashboard" class="sidebar-link">
            لوحة البيانات
          </NuxtLink>
          <NuxtLink to="/dashboard/appointments" class="sidebar-link">
            المواعيد
          </NuxtLink>
          <NuxtLink to="/dashboard/staff" class="sidebar-link">
            الكادر الطبي
          </NuxtLink>
          <NuxtLink to="/dashboard/patients" class="sidebar-link">
            المرضى
          </NuxtLink>

          <span class="nav-caption">التقارير</span>
          <NuxtLink to="/dashboard/reports" class="sidebar-link">
            التقارير
          </NuxtLink>
          <NuxtLink to="/dashboard/articles" class="sidebar-link active">
            إدارة المقالات
          </NuxtLink>
          <NuxtLink to="/dashboard/inventory" class="sidebar-link">
            مراقبة المخزون
          </NuxtLink>
          <NuxtLink to="/dashboard/settings" class="sidebar-link">
            الإعدادات
          </NuxtLink>
          <NuxtLink to="/dashboard/activity" class="sidebar-link">
            سجل النشاطات
          </NuxtLink>
          <button
            class="sidebar-link logout-link"
            type="button"
            @click="showLogoutModal = true"
          >
            خروج
          </button>
        </nav>
      </aside>

      <main class="dashboard-content">
        <header class="page-header">
          <div class="header-row">
            <h1>إدارة المقالات</h1>

            <button class="add-article-button" type="button" @click="openAddModal">
              إضافة مقال
            </button>
          </div>
        </header>

        <section class="articles-card" aria-label="جدول إدارة المقالات">
          <div class="table-tools">
            <label>
              <span>بحث</span>
              <input
                v-model.trim="searchQuery"
                type="search"
                placeholder="ابحث بعنوان المقال أو الكاتب"
              >
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="statusFilter">
                <option value="all">الكل</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>
            </label>
          </div>

          <div v-if="isTableLoading" class="loading-state">
            <span class="spinner" />
            <p>جاري تحميل البيانات...</p>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>عنوان المقال</th>
                  <th>الكاتب</th>
                  <th>البريد الإلكتروني للكاتب</th>
                  <th>تاريخ النشر</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="article in paginatedArticles"
                  :key="article.id"
                >
                  <td>
                    <img
                      class="article-thumb"
                      :src="article.imageUrl"
                      :alt="article.title"
                    >
                  </td>
                  <td class="title-cell">{{ article.title }}</td>
                  <td>{{ article.author.name }}</td>
                  <td>{{ article.author.email }}</td>
                  <td>{{ article.publishDate }}</td>
                  <td>
                    <span class="status-pill" :class="article.status">
                      {{ getStatusLabel(article.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" @click="openDetailsModal(article)">
                        عرض
                      </button>
                      <button type="button" @click="openEditModal(article)">
                        تعديل
                      </button>
                      <button
                        type="button"
                        class="delete-button"
                        @click="openDeleteModal(article)"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isTableLoading && filteredArticles.length === 0">
                  <td colspan="7">
                    {{ articles.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد مقالات متاحة' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdminPagination
            v-if="filteredArticles.length > pageSize"
            v-model:page="currentPage"
            :total-pages="totalPages"
          />
        </section>
      </main>
    </div>

    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
    </div>

    <div
      v-if="selectedArticleDetails"
      class="article-modal-overlay"
      dir="rtl"
      @click.self="selectedArticleDetails = null"
    >
      <div
        class="article-modal details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-details-title"
      >
        <div class="modal-header">
          <h2 id="article-details-title">تفاصيل المقال</h2>
        </div>

        <img
          class="details-image"
          :src="selectedArticleDetails.imageUrl"
          :alt="selectedArticleDetails.title"
        >

        <dl class="details-list">
          <div
            v-for="detail in articleDetailsRows"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="selectedArticleDetails = null">
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isArticleFormOpen"
      class="article-modal-overlay"
      dir="rtl"
      @click.self="closeArticleForm"
    >
      <div
        class="article-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-form-title"
      >
        <form class="article-form" @submit.prevent="saveArticle">
          <div class="modal-header">
            <h2 id="article-form-title">{{ formMode === 'add' ? 'إضافة مقال' : 'تعديل المقال' }}</h2>
          </div>

          <div class="form-grid">
            <label>
              <span>عنوان المقال</span>
              <input v-model.trim="articleForm.title" type="text">
            </label>

            <label>
              <span>الكاتب</span>
              <input v-model.trim="articleForm.authorName" type="text">
            </label>

            <label>
              <span>البريد الإلكتروني للكاتب</span>
              <input v-model.trim="articleForm.authorEmail" type="email">
            </label>

            <label>
              <span>تاريخ النشر</span>
              <input v-model="articleForm.publishDate" type="date">
            </label>

            <div class="image-field full-field">
              <label>
                <span>رفع صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                >
              </label>

              <label>
                <span>أو إدخال رابط صورة</span>
                <input
                  v-model.trim="articleForm.imageUrl"
                  type="url"
                  @input="uploadedImagePreview = ''"
                >
              </label>

              <div v-if="articleImagePreview" class="image-preview-wrap">
                <img
                  class="image-preview"
                  :src="articleImagePreview"
                  alt="معاينة صورة المقال"
                >
              </div>
            </div>

            <label class="full-field">
              <span>وصف قصير</span>
              <textarea v-model.trim="articleForm.excerpt" rows="3" />
            </label>

            <label class="full-field">
              <span>محتوى المقال</span>
              <textarea v-model.trim="articleForm.content" rows="7" />
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="articleForm.status">
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button class="save-button" type="submit">
              {{ formMode === 'add' ? 'إضافة' : 'حفظ التعديل' }}
            </button>
            <button class="cancel-button" type="button" @click="closeArticleForm">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="deleteTarget"
      class="article-modal-overlay"
      dir="rtl"
      @click.self="deleteTarget = null"
    >
      <div
        class="article-modal delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-delete-title"
      >
        <p id="article-delete-title">
          هل أنت متأكد أنك تريد حذف هذا المقال؟
        </p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmDelete">
            نعم
          </button>
          <button class="cancel-button" type="button" @click="deleteTarget = null">
            لا
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showLogoutModal"
      class="logout-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div
        class="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <p id="logout-modal-title">
          هل انت متاكد انك تريد تسجيل الخروج؟
        </p>

        <div class="logout-actions">
          <button class="confirm-logout" type="button" @click="confirmLogout">
            نعم
          </button>
          <button class="cancel-logout" type="button" @click="showLogoutModal = false">
            لا
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = 4
const isTableLoading = ref(false)
const toastMessage = ref('')
const selectedArticleDetails = ref(null)
const isArticleFormOpen = ref(false)
const formMode = ref('add')
const editTarget = ref(null)
const deleteTarget = ref(null)
const formError = ref('')
const uploadedImagePreview = ref('')
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const emptyArticleForm = () => ({
  title: '',
  authorName: '',
  authorEmail: '',
  publishDate: '',
  imageUrl: '',
  excerpt: '',
  content: '',
  status: 'draft'
})

const articleForm = reactive(emptyArticleForm())

const articleImagePreview = computed(() => {
  return uploadedImagePreview.value || articleForm.imageUrl
})

const articlesState = useArticles()
const articles = articlesState.value

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const getStatusLabel = (status) => {
  return status === 'published' ? 'منشور' : 'مسودة'
}

const filteredArticles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return articles.filter((article) => {
    const matchesStatus = statusFilter.value === 'all' || article.status === statusFilter.value
    const matchesSearch = !query || [article.title, article.author.name].some((value) => {
      return String(value).toLowerCase().includes(query)
    })

    return matchesStatus && matchesSearch
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredArticles.value.length / pageSize))
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const articleDetailsRows = computed(() => {
  if (!selectedArticleDetails.value) {
    return []
  }

  return [
    { label: 'عنوان المقال', value: selectedArticleDetails.value.title },
    { label: 'الكاتب', value: selectedArticleDetails.value.author.name },
    { label: 'البريد الإلكتروني للكاتب', value: selectedArticleDetails.value.author.email },
    { label: 'تاريخ النشر', value: selectedArticleDetails.value.publishDate },
    { label: 'الحالة', value: getStatusLabel(selectedArticleDetails.value.status) },
    { label: 'وصف قصير', value: selectedArticleDetails.value.excerpt },
    { label: 'محتوى المقال', value: selectedArticleDetails.value.content }
  ]
})

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  isTableLoading.value = true
  window.setTimeout(() => {
    isTableLoading.value = false
  }, 250)
})

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const resetArticleForm = () => {
  Object.assign(articleForm, emptyArticleForm())
  uploadedImagePreview.value = ''
}

const openAddModal = () => {
  formMode.value = 'add'
  editTarget.value = null
  formError.value = ''
  resetArticleForm()
  isArticleFormOpen.value = true
}

const openDetailsModal = (article) => {
  selectedArticleDetails.value = article
}

const openEditModal = (article) => {
  formMode.value = 'edit'
  editTarget.value = article
  formError.value = ''
  Object.assign(articleForm, {
    title: article.title,
    authorName: article.author.name,
    authorEmail: article.author.email,
    publishDate: article.publishDate,
    imageUrl: article.imageUrl,
    excerpt: article.excerpt,
    content: article.content,
    status: article.status
  })
  uploadedImagePreview.value = ''
  isArticleFormOpen.value = true
}

const closeArticleForm = () => {
  isArticleFormOpen.value = false
  editTarget.value = null
  formError.value = ''
  uploadedImagePreview.value = ''
}

const handleImageUpload = (event) => {
  const [file] = event.target.files || []

  if (!file) {
    uploadedImagePreview.value = ''
    return
  }

  uploadedImagePreview.value = URL.createObjectURL(file)
  articleForm.imageUrl = ''
}

const hasRequiredArticleFields = () => {
  const hasTextFields = [
    'title',
    'authorName',
    'authorEmail',
    'publishDate',
    'excerpt',
    'content',
    'status'
  ].every((field) => {
    const value = articleForm[field]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })

  return hasTextFields && articleImagePreview.value.trim() !== ''
}

const getNextArticleId = () => {
  return `article-${Date.now()}`
}

const getArticlePayload = () => ({
  slug: createArticleSlug(articleForm.title),
  title: articleForm.title,
  author: {
    name: articleForm.authorName,
    email: articleForm.authorEmail
  },
  publishDate: articleForm.publishDate,
  imageUrl: articleImagePreview.value,
  excerpt: articleForm.excerpt,
  content: articleForm.content,
  status: articleForm.status
})

const saveArticle = () => {
  if (!hasRequiredArticleFields()) {
    formError.value = 'يرجى تعبئة جميع الحقول المطلوبة'
    return
  }

  if (formMode.value === 'edit' && editTarget.value) {
    Object.assign(editTarget.value, getArticlePayload())
    closeArticleForm()
    showToast('تم حفظ التعديلات بنجاح')
    return
  }

  articles.unshift({
    id: getNextArticleId(),
    ...getArticlePayload()
  })
  currentPage.value = 1
  closeArticleForm()
  showToast('تمت إضافة المقال بنجاح')
}

const openDeleteModal = (article) => {
  deleteTarget.value = article
}

const confirmDelete = () => {
  if (!deleteTarget.value) {
    return
  }

  const index = articles.findIndex((article) => article.id === deleteTarget.value.id)

  if (index !== -1) {
    articles.splice(index, 1)
  }

  deleteTarget.value = null
  currentPage.value = Math.min(currentPage.value, totalPages.value)
  showToast('تم حذف المقال بنجاح')
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.admin-sidebar {
  grid-column: 1;
  grid-row: 1;
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.admin-sidebar h2 {
  margin: 0 0 30px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-caption {
  margin-top: 6px;
  color: #343434;
  font-size: 13px;
  font-weight: 400;
  text-align: right;
}

.sidebar-link {
  min-height: 34px;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.dashboard-content {
  grid-column: 2;
  grid-row: 1;
  padding: 48px 40px 64px;
}

.page-header {
  margin-bottom: 44px;
}

.header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
}

.add-article-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 24px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 17px;
  min-width: 150px;
  padding: 13px 28px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.add-article-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 6px 16px rgba(17, 91, 210, 0.2);
}

.articles-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-tools {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(160px, 220px);
  gap: 16px;
  margin-bottom: 26px;
}

.table-tools label {
  display: grid;
  gap: 8px;
}

.table-tools span {
  font-weight: 900;
}

.table-tools input,
.table-tools select {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #101010;
  font-family: inherit;
  min-height: 44px;
  padding: 0 14px;
}

.loading-state {
  align-items: center;
  color: #115bd2;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 18px;
}

.loading-state p {
  font-weight: 900;
  margin: 0;
}

.spinner {
  animation: spin 0.8s linear infinite;
  border: 3px solid #d9e9ff;
  border-top-color: #115bd2;
  border-radius: 50%;
  height: 24px;
  width: 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-wrap {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  min-width: 1120px;
  width: 100%;
}

th,
td {
  border-bottom: 2px solid #8dbbfb;
  font-size: 15px;
  padding: 15px 14px;
  text-align: center;
  white-space: nowrap;
}

th {
  font-weight: 800;
}

td {
  height: 76px;
  transition: background-color 0.2s ease;
}

tbody tr:hover td {
  background-color: rgba(141, 187, 251, 0.16);
}

.article-thumb {
  aspect-ratio: 4 / 3;
  border: 1px solid #8dbbfb;
  border-radius: 10px;
  display: block;
  height: 58px;
  object-fit: cover;
  width: 78px;
}

.title-cell {
  font-weight: 900;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-pill {
  background-color: #d9e9ff;
  border-radius: 999px;
  color: #115bd2;
  display: inline-flex;
  font-weight: 900;
  justify-content: center;
  min-width: 78px;
  padding: 5px 12px;
}

.status-pill.draft {
  color: #707070;
}

.action-buttons {
  display: inline-flex;
  gap: 8px;
}

.action-buttons button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  border-radius: 8px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  min-width: 54px;
  padding: 7px 12px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.action-buttons button:hover {
  background-color: #115bd2;
  color: #ffffff;
  transform: translateY(-1px);
}

.action-buttons .delete-button {
  border-color: #5a99ef;
  color: #707070;
}

.article-modal-overlay,
.logout-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.article-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: min(820px, 88vh);
  max-width: 100%;
  overflow-y: auto;
  padding: 34px 44px 36px;
  width: 780px;
}

.modal-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
}

.article-form {
  display: grid;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
}

.form-grid label {
  display: grid;
  gap: 8px;
}

.form-grid span {
  font-size: 16px;
  font-weight: 800;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 12px;
  color: #101010;
  font-family: inherit;
  font-size: 16px;
  min-height: 44px;
  padding: 8px 12px;
}

.image-field {
  background-color: #d9e9ff;
  border: 1.5px solid #8dbbfb;
  border-radius: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 18px;
}

.image-field label {
  align-self: start;
}

.image-field input[type='file'] {
  cursor: pointer;
  padding: 9px 12px;
}

.image-preview-wrap {
  grid-column: 1 / -1;
}

.image-preview {
  aspect-ratio: 16 / 8;
  border: 1.5px solid #0b63f6;
  border-radius: 16px;
  display: block;
  max-height: 280px;
  object-fit: cover;
  width: 100%;
}

.form-grid textarea {
  resize: vertical;
}

.full-field {
  grid-column: 1 / -1;
}

.form-error {
  color: #d92d2d;
  font-weight: 800;
  margin: -6px 0 0;
  text-align: center;
}

.details-modal {
  width: 720px;
}

.details-image {
  aspect-ratio: 16 / 8;
  border: 1.5px solid #8dbbfb;
  border-radius: 18px;
  display: block;
  margin: 24px 0;
  object-fit: cover;
  width: 100%;
}

.details-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.details-row {
  align-items: start;
  border-bottom: 1px solid #8dbbfb;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 16px;
  padding: 12px 0;
}

.details-row dt {
  font-weight: 900;
}

.details-row dd {
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

.delete-modal {
  padding: 64px 48px 44px;
  text-align: center;
  width: 560px;
}

.delete-modal p {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 30px;
}

.toast-message {
  background-color: #115bd2;
  border-radius: 14px;
  bottom: 24px;
  color: #ffffff;
  font-weight: 900;
  left: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 26px;
}

.article-form .modal-actions {
  margin-top: 0;
}

.modal-actions button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  min-width: 110px;
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

.logout-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 78px 64px 52px;
  text-align: center;
  width: 620px;
}

.logout-modal p {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
}

.logout-actions {
  display: flex;
  gap: 120px;
  justify-content: center;
  margin-top: 34px;
}

.logout-actions button {
  background: none;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 28px;
  font-weight: 900;
  padding: 8px 18px;
}

.confirm-logout {
  color: #115bd2;
}

.cancel-logout {
  color: #d92d2d;
}

@media (max-width: 1030px) {
  .dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .dashboard-content {
    padding: 36px 24px 48px;
  }
}

@media (max-width: 720px) {
  .dashboard-shell {
    display: flex;
    flex-direction: column;
  }

  .admin-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .admin-sidebar h2 {
    margin-bottom: 0;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
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
    max-height: 640px;
    margin-top: 18px;
    opacity: 1;
  }

  .nav-caption {
    grid-column: 1 / -1;
    text-align: center;
  }

  .dashboard-content {
    padding: 32px 18px 44px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .articles-card {
    border-radius: 20px;
    padding: 28px 22px;
  }

  .table-tools {
    grid-template-columns: 1fr;
  }

  .article-modal {
    padding: 28px 24px;
    width: min(100%, 700px);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .image-field {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .dashboard-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .header-row {
    align-items: stretch;
    flex-direction: column;
  }

  .add-article-button {
    width: 100%;
  }

  .article-modal-overlay {
    padding: 16px;
  }

  .article-modal {
    border-radius: 20px;
    padding: 24px 18px;
  }

  .modal-header h2 {
    font-size: 23px;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

  .delete-modal {
    padding: 42px 22px 28px;
  }

  .delete-modal p {
    font-size: 21px;
  }
}
</style>
