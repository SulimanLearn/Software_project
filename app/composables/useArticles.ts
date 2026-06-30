type ArticleStatus = 'published' | 'draft'

type Article = {
  id: string
  slug: string
  title: string
  author: {
    name: string
    email: string
  }
  publishDate: string
  imageUrl: string
  excerpt: string
  content: string
  status: ArticleStatus
}

const defaultArticles: Article[] = [
  {
    id: 'article-1',
    slug: 'heart-health-care',
    title: 'نصائح للحفاظ على صحة القلب',
    author: {
      name: 'د. سارة خالد',
      email: 'sarah.khaled@mediconnect.test'
    },
    publishDate: '2026-05-12',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=85',
    excerpt: 'خطوات يومية بسيطة تساعد على تقليل مخاطر أمراض القلب وتحسين جودة الحياة.',
    content: 'تبدأ العناية بصحة القلب من نمط الحياة اليومي. ينصح بالحركة المنتظمة، تقليل الملح، اختيار الدهون الصحية، ومراجعة الطبيب عند ظهور أعراض مثل ألم الصدر أو ضيق النفس.',
    status: 'published'
  },
  {
    id: 'article-2',
    slug: 'child-doctor-visit',
    title: 'متى يحتاج الطفل إلى زيارة طبيب الأطفال؟',
    author: {
      name: 'د. عمر حسن',
      email: 'omar.hassan@mediconnect.test'
    },
    publishDate: '2026-05-08',
    imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=900&q=85',
    excerpt: 'علامات مهمة تساعد الأهل على اتخاذ قرار زيارة الطبيب في الوقت المناسب.',
    content: 'ينبغي مراجعة طبيب الأطفال عند استمرار الحرارة، صعوبة التنفس، الجفاف، أو تغير نشاط الطفل بشكل واضح. كما أن الزيارات الوقائية ضرورية لمتابعة النمو واللقاحات.',
    status: 'published'
  },
  {
    id: 'article-3',
    slug: 'summer-skin-care',
    title: 'دليل سريع للعناية بالبشرة في الصيف',
    author: {
      name: 'د. ريم يوسف',
      email: 'reem.yousef@mediconnect.test'
    },
    publishDate: '2026-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1556228724-4d46c1f8136d?auto=format&fit=crop&w=900&q=85',
    excerpt: 'مسودة مقال عن الترطيب وواقي الشمس والتعامل مع الحساسية الموسمية.',
    content: 'تحتاج البشرة في الصيف إلى تنظيف لطيف، ترطيب مناسب، واستخدام واقي شمس واسع الطيف. يفضل تجنب التعرض المباشر للشمس وقت الذروة.',
    status: 'draft'
  },
  {
    id: 'article-4',
    slug: 'lab-tests-preparation',
    title: 'الاستعداد الصحيح للفحوصات المخبرية',
    author: {
      name: 'مريم ناصر',
      email: 'mariam.nasser@mediconnect.test'
    },
    publishDate: '2026-05-03',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=85',
    excerpt: 'إرشادات قبل فحوصات الدم والصيام وتحضير قائمة الأدوية.',
    content: 'تختلف تعليمات التحضير للفحوصات حسب نوع الفحص. بعض التحاليل تحتاج إلى صيام، وبعضها يتأثر بالأدوية أو وقت أخذ العينة.',
    status: 'published'
  }
]

export const createArticleSlug = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `article-${Date.now()}`
}

export const useArticles = () => {
  return useState<Article[]>('adminArticles', () => {
    return defaultArticles.map(article => ({
      ...article,
      author: { ...article.author }
    }))
  })
}
