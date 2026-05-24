<template>
  <NavBar />
  <main class="blog-page" dir="rtl">
    <section class="hero-section">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageSubtitle }}</p>
    </section>

    <section class="articles-section" :aria-label="articlesSectionLabel">
      <article
        v-for="article in publishedArticles"
        :key="article.id"
        class="article-card"
      >
        <img class="article-image" :src="article.imageUrl" :alt="article.title">

        <div class="article-body">
          <div class="article-meta">
            <span class="meta-item">
              <User />              
              {{ article.author.name }}
            </span>

            <span class="meta-separator" aria-hidden="true">{{ metaSeparator }}</span>

            <span class="meta-item">
              <CalendarDays />
              {{ article.publishDate }}
            </span>
          </div>

          <h2>{{ article.title }}</h2>
          <p>{{ article.excerpt }}</p>

          <button class="read-more-button" type="button" @click="goToArticle(article)">
            <span>{{ buttonLabels.readMore }}</span>
            <ArrowLeft />
          </button>
        </div>
      </article>
    </section>

    <nav class="pagination" :aria-label="paginationLabel">
      <button
        v-for="button in paginationButtons"
        :key="button.label"
        class="pagination-button"
        :class="{ active: button.active, ellipsis: button.type === 'ellipsis' }"
        type="button"
        :disabled="button.disabled"
      >
        {{ button.label }}
      </button>
    </nav>
  </main>
</template>

<script setup>
import {
  User,
  CalendarDays,
  ArrowLeft,
} from '@lucide/vue';

const articles = useArticles()

const pageTitle = 'أحدث أخبارنا ومدونتنا'
const pageSubtitle = 'نشارك معكم نصائح طبية موثوقة وأخبار صحية من فريقنا الطبي المتخصص'
const articlesSectionLabel = 'المقالات المنشورة'
const paginationLabel = 'ترقيم صفحات المقالات'
const metaSeparator = '•'

const buttonLabels = {
  readMore: 'اقرأ المزيد',
  previous: 'السابق',
  next: 'التالي'
}

const publishedArticles = computed(() => {
  return articles.value.filter(article => article.status === 'published')
})

const paginationButtons = [
  { label: buttonLabels.next, type: 'next', active: false, disabled: false },
  { label: '...', type: 'ellipsis', active: false, disabled: true },
  { label: '3', type: 'page', active: false, disabled: false },
  { label: '2', type: 'page', active: false, disabled: false },
  { label: '1', type: 'page', active: true, disabled: false },
  { label: buttonLabels.previous, type: 'previous', active: false, disabled: false }
]

const goToArticle = async (article) => {
  await navigateTo(`/blog/${article.slug}`)
}
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  padding: 54px 28px 46px;
  background:
    radial-gradient(circle at 8% 16%, #3786f41a, transparent 18%),
    radial-gradient(circle at 91% 12%, #3786f414, transparent 16%),
    linear-gradient(180deg, #f6fbff 0%, #eef7ff 48%, #ffffff 100%);
  color: #14264c;
}

.hero-section {
  margin: 0 auto;
  max-width: 1400px;
  overflow: hidden;
  padding: 0 18px 36px;
  position: relative;
  text-align: center;
}

.hero-section h1 {
  color: #0c2d63;
  display: block;
  font-size: clamp(34px, 4vw, 52px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.25;
  margin: 0;
}

.hero-section p {
  color: #74829d;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
  margin: 12px auto 0;
  max-width: 720px;
}

.articles-section {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto;
  max-width: 1400px;
}

.article-card {
  background: #ffffff;
  border: 7px solid #ffffffeb;
  border-radius: 13px;
  box-shadow: 0 14px 34px #2667ae1f;
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.article-card:hover {
  box-shadow: 0 24px 54px #2667ae33;
  transform: translateY(-5px);
}

.article-image {
  aspect-ratio: 16 / 6.6;
  display: block;
  object-fit: cover;
  transition: filter 0.25s ease, transform 0.25s ease;
  width: 100%;
}

.article-card:hover .article-image {
  filter: saturate(1.04);
  transform: scale(1.045);
}

.article-body {
  padding: 14px 24px 18px;
  text-align: center;
}

.article-meta {
  align-items: center;
  color: #5f6775;
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
}

.meta-item {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.meta-item svg {
  color: #1476ed;
  height: 15px;
  width: 15px;
}

.meta-separator {
  color: #24385e;
}

.article-body h2 {
  color: #10275a;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.45;
  margin: 0 0 10px;
}

.article-body p {
  color: #68727e;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.85;
  margin: 0 auto;
  max-width: 390px;
}

.read-more-button {
  align-items: center;
  background: #edf5ff;
  border: 0;
  border-radius: 999px;
  color: #0b5fc8;
  cursor: pointer;
  display: inline-flex;
  flex-direction: row-reverse;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  margin-top: 17px;
  min-height: 39px;
  min-width: 134px;
  padding: 0 18px;
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.read-more-button svg {
  height: 17px;
  width: 17px;
}

.read-more-button:hover {
  background: #0c59c9;
  box-shadow: 0 12px 24px #0758cc3d;
  color: #ffffff;
  transform: translateY(-2px);
}

.pagination {
  align-items: center;
  direction: ltr;
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 16px;
}

.pagination-button {
  background: #ffffff;
  border: 1px solid #e8f1ff;
  border-radius: 13px;
  box-shadow: 0 8px 22px #2667ae17;
  color: #15315f;
  cursor: pointer;
  direction: rtl;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  min-height: 39px;
  min-width: 45px;
  padding: 0 16px;
  transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.pagination-button.active {
  background: #176fe7;
  border-color: #176fe7;
  color: #ffffff;
}

.pagination-button.ellipsis {
  cursor: default;
}

.pagination-button:not(:disabled):hover,
.pagination-button.active:hover {
  background: #0c59c9;
  border-color: #0c59c9;
  box-shadow: 0 12px 24px rgba(7, 88, 204, 0.24);
  color: #ffffff;
  transform: translateY(-2px);
}

.pagination-button:disabled {
  opacity: 1;
}

@media (max-width: 1030px) {
  .articles-section {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .blog-page {
    padding: 38px 14px 34px;
  }

  .hero-section {
    padding-inline: 6px;
  }

  .hero-section h1 {
    font-size: 30px;
  }

  .hero-section p {
    font-size: 16px;
    line-height: 1.8;
  }

  .articles-section {
    grid-template-columns: 1fr;
  }

  .article-image {
    aspect-ratio: 16 / 7.5;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
