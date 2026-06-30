<template>
  <NavBar />
  <main class="article-page" dir="rtl">
    <article v-if="article" class="article-shell">
      <img class="article-cover" :src="article.imageUrl" :alt="article.title">

      <div class="article-content">
        <div class="article-meta">
          <span>{{ article.author.name }}</span>
          <span aria-hidden="true">•</span>
          <span>{{ article.publishDate }}</span>
        </div>

        <h1>{{ article.title }}</h1>
        <p class="article-excerpt">{{ article.excerpt }}</p>
        <p class="article-text">{{ article.content }}</p>
      </div>
    </article>

    <section v-else class="empty-state">
      <h1>{{ notFoundTitle }}</h1>
      <NuxtLink class="back-link" to="/blog">{{ backLabel }}</NuxtLink>
    </section>
  </main>
</template>

<script setup>

const route = useRoute()
const articles = useArticles()

const notFoundTitle = 'المقال غير متاح'
const backLabel = 'العودة إلى المدونة'

const article = computed(() => {
  return articles.value.find(item => {
    return item.slug === route.params.slug && item.status === 'published'
  })
})
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  padding: 48px 20px;
  background: linear-gradient(180deg, #f6fbff 0%, #eaf5ff 100%);
}

.article-shell,
.empty-state {
  margin: 0 auto;
  max-width: 920px;
}

.article-shell {
  overflow: hidden;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 42px #1e4f8f24;
}

.article-cover {
  aspect-ratio: 16 / 7;
  display: block;
  object-fit: cover;
  width: 100%;
}

.article-content {
  padding: 34px 38px 42px;
}

.article-meta {
  align-items: center;
  color: #5f6775;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
}

.article-content h1,
.empty-state h1 {
  color: #10275a;
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 900;
  line-height: 1.35;
  margin: 16px 0;
}

.article-excerpt,
.article-text {
  color: #4e5a6c;
  font-size: 18px;
  line-height: 1.9;
  margin: 0;
}

.article-text {
  margin-top: 22px;
}

.empty-state {
  padding: 72px 24px;
  text-align: center;
}

.back-link {
  align-items: center;
  background: #176fe7;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 900;
  min-height: 44px;
  padding: 0 24px;
  text-decoration: none;
}

@media (max-width: 720px) {
  .article-page {
    padding: 24px 14px;
  }

  .article-cover {
    aspect-ratio: 16 / 9;
  }

  .article-content {
    padding: 24px 18px 30px;
  }
}
</style>
