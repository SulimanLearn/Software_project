<template>
    <div class="home-page" dir="rtl">
        <NavBar />
        <main class="hero-section">
        <div class="hero-inner">
            <section class="hero-copy">
                <span class="hero-pill">منصة طبية رقمية موثوقة</span>
                <h1> صحتك اولويتنا
                    <span>احجز موعدك الان</span>
                </h1>
                <p>تواصل مع افضل الأطباء المتخصصين و ادر مواعيدك الطبية بسهولة تامة من خلال منصة الحياة الرقمية</p>
                <div class="hero-actions">
                    <NuxtLink to="/doctors" class="hero-btn hero-btn-primary">
                    ابحث عن الطبيب
                    </NuxtLink>
                    <button type="button" class="hero-btn hero-btn-outline" @click="goToNursingRequest">
                    اطلب ممرض
                    </button>
                </div>

                <dl class="hero-stats">
                    <div>
                    <dt>+120</dt>
                    <dd>طبيب مختص</dd>
                    </div>
                    <div>
                    <dt>+10</dt>
                    <dd>تخصص طبي</dd>
                    </div>
                    <div>
                    <dt>98%</dt>
                    <dd>رضا المرضى</dd>
                    </div>
                </dl>
            </section>

            <div class="hero-visual" aria-hidden="true">
                <img src="/images/doctors_img.png" alt="doctors_img" class="doctors-image" />
            </div>
        </div>
        </main>

        <section  id="specialties" class="specialties-section" aria-labelledby="specialties-title">
            <div class="specialties-header">
                <span class="specialties-pill">التخصصات</span>
                <h2 id="specialties-title">اختر التخصص الطبي</h2>
                <p>نوفر أطباء متخصصين في جميع المجالات الطبية لخدماتك على مدار اليوم</p>
            </div>

            <div class="specialties-track" role="list" aria-label="التخصصات الطبية">
                <NuxtLink
                    v-for="specialty in specialtiesWithCounts"
                    :key="specialty.title"
                    :to="{ path: '/doctors', query: { specialty: specialty.slug } }"
                    class="specialty-card"
                    role="listitem"
                    draggable="false"
                >
                    <span class="specialty-title">{{ specialty.title }}</span>
                    <span class="specialty-count">{{ specialty.count }}</span>
                    <span class="specialty-icon" aria-hidden="true">
                        <img :src="specialty.icon" :alt="specialty.title" draggable="false" />
                    </span>
                    <span class="specialty-action">اختر طبيبك</span>
                </NuxtLink>
            </div>
        </section>

        <section class="process-section" aria-labelledby="process-title">
            <div class="process-header">
                <span class="process-eyebrow">
                    <img src="/images/title_icon.svg" alt="" aria-hidden="true" />
                    سير عملياتنا 
                </span>
                <h2 id="process-title">دعونا نرى كيف نعمل</h2>
            </div>

            <div class="process-steps" role="list">
                <article
                    v-for="(step, index) in processSteps"
                    :key="step.number"
                    class="process-step"
                    role="listitem"
                >
                    <div class="process-photo-wrap">
                        <img :src="step.image" :alt="step.title" class="process-photo" />
                        <span class="process-number">{{ step.number }}</span>
                    </div>
                    <img
                        v-if="index < processSteps.length - 1"
                        src="/images/arrow.svg"
                        alt=""
                        class="process-arrow"
                        aria-hidden="true"
                    />
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </article>
            </div>
        </section>

        <section class="faq-section" aria-labelledby="faq-title">
            <div class="faq-inner">
                <div class="faq-doctor" aria-hidden="true">
                    <img src="/images/doctor.png" alt="" />
                </div>

                <div class="faq-content">
                    <span class="faq-eyebrow">
                        <img src="/images/title_icon.svg" alt="" aria-hidden="true" />
                        FAQS (الأسئلة الشائعة)
                    </span>
                    <h2 id="faq-title">الأسئلة الشائعة هل لديك أي سؤال؟</h2>

                    <div class="faq-list">
                        <article
                            class="faq-item"
                            :class="{ 'is-open': activeFaq === 0 }"
                        >
                            <button
                                class="faq-question"
                                type="button"
                                :aria-expanded="activeFaq === 0"
                                aria-controls="faq-answer-0"
                                @click="toggleFaq(0)"
                            >
                                <span class="faq-number">01.</span>
                                <span>ما هي الخدمات التي يقدمها مجمع الحياة الطبي؟</span>
                                <span class="faq-icon" aria-hidden="true"></span>
                            </button>

                            <div
                                id="faq-answer-0"
                                class="faq-answer"
                            >
                                <div class="faq-answer-inner">
                                    <p>يقدم مجمع الحياة الطبي مجموعة متنوعة من التخصصات الطبية لتلبية احتياجاتك الصحية، بما في ذلك أمراض القلب، وطب الأطفال، وطب الأسنان، وطب العيون، والجراحة العامة، والأعصاب، والجلدية، وجراحة العظام و تدعم خدماتنا أدوات تشخيصية متقدمة وفريق من المتخصصين في الرعاية الصحية ذوي الخبرة والملتزمين برفاهيتك.</p>
                                </div>
                            </div>
                        </article>

                        <article class="faq-item" :class="{ 'is-open': activeFaq === 1 }" >
                            <button
                                class="faq-question"
                                type="button"
                                :aria-expanded="activeFaq === 1"
                                aria-controls="faq-answer-1"
                                @click="toggleFaq(1)"
                            >
                                <span class="faq-number">02.</span>
                                <span>كيف يمكنني حجز موعد؟</span>
                                <span class="faq-icon" aria-hidden="true"></span>
                            </button>

                            <div  id="faq-answer-1" class="faq-answer" >
                                <div class="faq-answer-inner">
                                    <p>يمكنك حجز موعد بسهولة من خلال إنشاء حساب وتسجيل الدخول، ثم الانتقال إلى صفحة مواعيدي واختيار حجز موعد جديد، بعدها قم بتحديد الطبيب والموعد المناسب، وأكد بياناتك الشخصية وطريقة الدفع لإتمام الحجز بنجاح.</p>
                                </div>
                            </div>
                        </article>

                        <article class="faq-item" :class="{ 'is-open': activeFaq === 2 }" >
                            <button
                                class="faq-question"
                                type="button"
                                :aria-expanded="activeFaq === 2"
                                aria-controls="faq-answer-2"
                                @click="toggleFaq(2)"
                            >
                                <span class="faq-number">03.</span>
                                <span>هل يقبل مجمع الحياة الطبي التأمين الصحي؟</span>
                                <span class="faq-icon" aria-hidden="true"></span>
                            </button>

                            <div id="faq-answer-2"  class="faq-answer" >
                                <div class="faq-answer-inner">
                                    <p>نعم، يدعم مجمع الحياة الطبي مجموعة متنوعة من خطط التأمين الصحي لتسهيل حصولك على الرعاية الطبية بكل راحة. لمعرفة شركات التأمين المعتمدة وتفاصيل التغطية، يمكنك التواصل معنا مباشرة عبر الواتساب وسيقوم فريقنا بمساعدتك بكل سرور.</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="blog-section" aria-labelledby="blog-title">
            <div class="blog-header">
                <div class="blog-heading">
                    <span class="blog-eyebrow">
                        <img src="/images/title_icon.svg" alt="" aria-hidden="true" />
                        مدونتنا
                    </span>
                    <h2 id="blog-title">أحدث أخبارنا ومدوناتنا</h2>
                </div>
                <NuxtLink :to="blogSection.actionLink" class="blog-view-all">
                    {{ blogSection.actionText }}
                </NuxtLink>
            </div>

            <div class="blog-grid">
                <article v-for="post in blogPosts" :key="post.title" class="blog-card">
                    <NuxtLink :to="post.link" class="blog-image-link" :aria-label="post.title">
                        <img :src="post.image" :alt="post.title" class="blog-image" />
                    </NuxtLink>

                    <div class="blog-card-body">
                        <div class="blog-meta">
                            <span>
                                <span class="blog-meta-icon blog-meta-calendar" aria-hidden="true"></span>
                                {{ post.date }}
                            </span>
                            <span class="blog-meta-divider" aria-hidden="true"></span>
                            <span>
                                {{ blogSection.byText }}
                                {{ post.author }}
                                <span class="blog-meta-icon blog-meta-user" aria-hidden="true"></span>
                            </span>
                        </div>

                        <h3>
                            <NuxtLink :to="post.link">{{ post.title }}</NuxtLink>
                        </h3>

                        <NuxtLink :to="post.link" class="blog-read-more">
                            {{ blogSection.readMoreText }}
                        </NuxtLink>
                    </div>
                </article>
            </div>
        </section>

        <button
            v-show="showBackToTop"
            class="back-to-top"
            type="button"
            aria-label="العودة إلى أعلى الصفحة"
            @click="scrollToTop"
        >
            <span aria-hidden="true"></span>
        </button>
        <div class="elfsight-app-580f9bf9-bdf0-4014-9b43-ae7fec84c765" data-elfsight-app-lazy></div>
    </div>
</template>

<script setup>
import { doctors } from '~/data/doctors';
import { specialties } from '~/data/specialties';

const articles = useArticles();

const processSteps = [
    {
        number: '01',
        title: 'تسجيل المرضى',
        description: 'في مجمع الحياة الطبي، نرحب ترحيبًا حارًا بالمرضى، ونضمن لهم تجربة سلسة وإيجابية.',
        image: '/images/process_card_1.jpg',
    },
    {
        number: '02',
        title: 'الفحوصات',
        description: 'بمجرد تسجيل دخول المريض، يقوم أخصائي الرعاية الصحية بإجراء تقييم شامل.',
        image: '/images/process_card_2.jpg',
    },
    {
        number: '03',
        title: 'تقرير شامل',
        description: 'تحليل نتائج الاختبارات التشخيصية ودمجها في التشخيص.',
        image: '/images/process_card_3.jpg',
    },
    {
        number: '04',
        title: 'الرعاية المستمرة',
        description: 'التزامنا تجاه مريضنا لا يقتصر على الزيارة الأولية، فنحن نضمن استمرارية الرعاية.',
        image: '/images/process_card_4.jpg',
    },
];

const blogSection = {
    actionText: 'عرض كل المنشورات',
    actionLink: '/blog',
    byText: 'بواسطة',
    readMoreText: 'اقرأ المزيد',
};

const blogPosts = computed(() => {
    return articles.value
        .filter(article => article.status === 'published')
        .slice(0, 3)
        .map(article => ({
            title: article.title,
            date: article.publishDate,
            author: article.author.name,
            image: article.imageUrl,
            link: `/blog/${article.slug}`,
        }));
});

const activeFaq = ref(null);
const isLoggedIn = useState('isLoggedIn', () => false);

const goToNursingRequest = async () => {
    await navigateTo(isLoggedIn.value ? '/nursing' : '/login');
};

const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index;
};

const formatDoctorCount = (count) => {
    const value = Number(count) || 0;
    return `${value} طبيب`;
};

const specialtiesWithCounts = computed(() => specialties.map((specialty) => ({
    ...specialty,
    count: formatDoctorCount(doctors.filter((doctor) => doctor.specialtySlug === specialty.slug).length),
})));

const showBackToTop = ref(false);

const updateBackToTopVisibility = () => {
    showBackToTop.value = window.scrollY > 20;
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    updateBackToTopVisibility();
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateBackToTopVisibility);
});
useHead({
    script: [
        {
            src: 'https://elfsightcdn.com/platform.js"',
            async: true
        }
    ]
})
</script>

<style scoped>
    .home-page {
    background: linear-gradient(360deg,#f8fbff 0%, #deedfc 100%);
    }

    :global(html) {
        scroll-behavior: smooth;
    }

    .hero-section {
        min-height: 610px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 42px 48px 28px;
        background:
            radial-gradient(circle at 15% 18%, #47c4b22e 0 9%, transparent 9.5%),
            radial-gradient(circle at 76% 18%, #a6c9f761 0 16%, transparent 16.5%),
            linear-gradient(130deg, #ffffffeb 0 22%, transparent 22.3%),
            linear-gradient(235deg, #0758cc1f 0 34%, transparent 34.4%),
            linear-gradient(180deg, #fbfdff 0%, #eaf5ff 54%, #d4e9ff 100%);
    }

    .hero-section::before,
    .hero-section::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    .hero-section::before {
        inset: 0;
        z-index: 0;
        background:
            repeating-linear-gradient(90deg, #0758cc0b 0 1px, transparent 1px 88px),
            repeating-linear-gradient(0deg, #48c4b209 0 1px, transparent 1px 88px);
        opacity: 0.68;
    }

    .hero-section::after {
        width: min(560px, 46vw);
        height: 78%;
        left: -130px;
        bottom: -120px;
        z-index: 0;
        border: 1px solid #ffffffb8;
        border-radius: 44px;
        background: linear-gradient(135deg, #ffffff9e, #7bb4f738);
        transform: rotate(-16deg);
    }

    .hero-inner {
        width: min(1320px, 100%);
        position: relative;
        z-index: 1;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(440px, 1fr) minmax(430px, 1fr);
        align-items: center;
        gap: 42px;
    }

    .hero-copy {
        justify-self: end;
        width: min(100%, 560px);
        text-align: right;
    }

    .hero-pill,
    .process-eyebrow,
    .faq-eyebrow,
    .blog-eyebrow {
        min-width: 91px;
        min-height: 24px;
        padding: 4px 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #1460cc;
        background: #d7e6ff;
        border: 1px solid #77aaff;
        border-radius: 25px;
        font-size: 15px;
        line-height: 1.2;
        font-weight: 500;
    }

    .hero-pill {
        margin-bottom: 36px;
    }

    .hero-copy h1 {
        margin: 0;
        color: #050505;
        font-size: 35px;
        line-height: 1.18;
        font-weight: 800;
        letter-spacing: 0;
    }

    .hero-copy h1 span {
        display: block;
        color: #0c59c9;
    }

    .hero-copy p {
        max-width: 555px;
        margin: 42px 0 38px;
        color: #181818;
        font-size: 22px;
        line-height: 1.45;
        font-weight: 400;
    }

    .hero-actions {
        display: flex;
        justify-content: flex-start;
        gap: 20px;
        direction: rtl;
    }

    .hero-btn {
        min-width: 158px;
        min-height: 51px;
        padding: 0 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        font-family: inherit;
        font-size: 18px;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
    }

    .hero-btn:hover {
        transform: translateY(-2px);
    }

    .hero-btn-primary {
        color: #ffffff;
        background: #0758cc;
    }

    .hero-btn-primary:hover {
        background: #084fb5;
    }

    .hero-btn-outline {
        color: #0758cc;
        background: #ffffff;
        border: 1px solid #0758cc;
    }

    .hero-btn-outline:hover {
        background: #eff5ff;
    }

    .hero-stats {
        width: min(100%, 410px);
        margin: 86px 0 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
        direction: rtl;
    }

    .hero-stats div {
        text-align: center;
    }

    .hero-stats dt {
        margin-bottom: 8px;
        color: #0758cc;
        font-size: 20px;
        line-height: 1;
        font-weight: 800;
    }

    .hero-stats dd {
        margin: 0;
        color: #333333;
        font-size: 15px;
        line-height: 1.3;
    }

    .hero-visual {
        min-height: 470px;
        position: relative;
        display: flex;
        align-items: end;
        justify-content: center;
        direction: ltr;
    }

    .doctors-image {
        width: min(100%, 540px);
        height: auto;
        object-fit: contain;
        margin-right: 160px;
        margin-bottom: 60px;
    }

    .specialties-section {
        width: min(100%, 1240px);
        margin: 0 auto;
        padding: 54px 32px 72px;
        scroll-margin-top: 96px;
    }

    .specialties-header {
        max-width: 660px;
        margin: 0 0 36px auto;
        text-align: right;
    }

    .specialties-pill {
        min-width: 91px;
        min-height: 24px;
        padding: 4px 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #1460cc;
        background: #d7e6ff;
        border: 1px solid #77aaff;
        border-radius: 25px;
        font-size: 15px;
        font-weight: 500;
    }

    .specialties-header h2 {
        width: fit-content;
        margin: 12px 0 0 auto;
        padding-bottom: 10px;
        position: relative;
        color: #050505;
        font-size: 25px;
        line-height: 1.25;
        font-weight: 800;
        letter-spacing: 0;
    }

    .specialties-header h2::after {
        content: "";
        width: 46px;
        height: 2px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: #2f7de1;
    }

    .specialties-header p {
        margin: 8px 0 0;
        color: #222222;
        font-size: 16px;
        line-height: 1.8;
    }

    .specialties-track {
        padding: 8px 0 14px;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 22px;
    }

    .specialty-card {
        min-height: 300px;
        padding: 30px 18px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #050505;
        text-align: center;
        text-decoration: none;
        background: linear-gradient(360deg, #a6c9f7 15%, #f2edee 55%);
        border-radius: 0 16px 16px 0;
        box-shadow: 0 4px 7px #1f395b3d;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .specialty-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px #1f395b33;
    }

    .specialty-title {
        min-height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #050505;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 800;
    }

    .specialty-count {
        margin-top: 4px;
        color: #2f2f2f;
        font-size: 11px;
        line-height: 1.4;
    }

    .specialty-icon {
        width: 92px;
        height: 92px;
        margin-top: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #050505;
        background: linear-gradient(360deg, #a6c9f7 15%, #f2edee 55%);
        border-radius: 100%;
        box-shadow: inset 0 0 0 1px #0758cc0a;
    }

    .specialty-icon img {
        width: 58px;
        height: 58px;
        display: block;
        object-fit: contain;
        user-select: none;
    }

    .specialty-action {
        margin-top: auto;
        color: #101010;
        font-weight: 700;
        font-size: 20px;
        line-height: 1.4;
    }

    .process-section {
        min-height: 610px;
        position: relative;
        overflow: hidden;
        padding: 34px 48px 64px;
        background-image: url(/images/process_bg_1.jpg);
    }

    .process-header {
        max-width: 760px;
        margin: 0 auto 34px;
        padding-bottom: 15px;
        text-align: center;
    }

    .process-header h2 {
        margin: 10px 0 0;
        color: #0c59c9;
        font-size: 40px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: 0;
    }

    .process-eyebrow {
        gap: 7px;
    }

    .process-eyebrow img,
    .faq-eyebrow img,
    .blog-eyebrow img {
        width: 15px;
        height: 15px;
        display: block;
        flex: 0 0 auto;
        object-fit: contain;
    }

    .process-steps {
        width: min(1320px, 100%);
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 62px;
        direction: rtl;
    }

    .process-step {
        position: relative;
        min-width: 0;
        text-align: center;
        direction: rtl;
    }
    .process-step h3 {
        margin: 24px 0 12px;
        color: #0c59c9;
        font-size: 20px;
        line-height: 1.35;
        font-weight: 700;
    }

    .process-step p {
        max-width: 235px;
        margin: 0 auto;
        color: #7a829d;
        font-size: 16px;
        line-height: 1.75;
    }

    .process-photo-wrap {
        width: 168px;
        height: 168px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
        border-radius:100%;
        transition: transform 0.28s ease, filter 0.28s ease;
    }

    .process-photo-wrap:hover {
        transform: translateY(-8px);
        filter: drop-shadow(0 18px 24px #a6c9f76b);
    }

    .process-photo-wrap:hover::before {
        inset: -5px;
        box-shadow: 0 0 0 7px #f2edeeb8;
    }

    .process-photo-wrap:hover .process-photo {
        transform: scale(1.04);
        filter: saturate(1.08) contrast(1.04);
    }

    .process-photo-wrap::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: 100%;
        background: linear-gradient(135deg, #a6c9f7 0%, #f2edee 100%);
        transition: inset 0.28s ease, box-shadow 0.28s ease;
    }

    .process-photo {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
        object-fit: cover;
        border: 2px solid #f7fbff;
        border-radius: 100%;
        transition: transform 0.28s ease, filter 0.28s ease;
    }

    .process-number {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 0;
        right: -1px;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #0c59c9;
        background: linear-gradient(360deg, #a6c9f7 15%, #f2edee 75%);    
        border-radius: 100%;
        font-size: 22px;
        font-weight: 800;
        box-shadow: 0 8px 18px #a6c9f757;
        transition: transform 0.28s ease, box-shadow 0.28s ease;
    }

    .process-photo-wrap:hover .process-number {
        transform: scale(1.08);
        box-shadow: 0 12px 24px #a6c9f775;
    }

    .process-arrow {
        width: 154px;
        height: auto;
        position: absolute;
        bottom: calc(100% - 70px);
        right: calc(70% + 50px);
        z-index: 0;
        display: block;
        transform: scaleX(-1);
        opacity: 0.95;
        pointer-events: none;
        user-select: none;
    }

    .faq-section {
        min-height: 610px;
        position: relative;
        overflow: hidden;
        padding: 72px 48px;
        background:
            linear-gradient(118deg, #ffffffd6 0 18%, transparent 18.2% 100%),
            linear-gradient(235deg, #0758cc24 0 32%, transparent 32.4% 100%),
            linear-gradient(160deg, #48c4b21f 0 24%, transparent 24.4% 100%),
            linear-gradient(180deg, #f8fbff 0%, #dceeff 48%, #bddcff 100%);
        color: #ffffff;
    }

    .faq-section::before,
    .faq-section::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    .faq-section::before {
        inset: 0;
        z-index: 0;
        background:
            repeating-linear-gradient(90deg, #0758cc0e 0 1px, transparent 1px 82px),
            repeating-linear-gradient(0deg, #0758cc0a 0 1px, transparent 1px 82px);
        opacity: 0.55;
    }

    .faq-section::after {
        width: min(560px, 48vw);
        height: 72%;
        right: -160px;
        bottom: -80px;
        z-index: 0;
        background: linear-gradient(135deg, #ffffff80, #7bb4f738);
        border: 1px solid #ffffff8f;
        border-radius: 42px;
        transform: rotate(18deg);
    }

    .faq-inner {
        width: min(1280px, 100%);
        min-height: 500px;
        position: relative;
        z-index: 1;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(330px, 0.68fr) minmax(520px, 1fr);
        gap: 48px;
    }

    .faq-doctor {
        height: 500px;
        position: relative;
        display: flex;
        align-items: end;
        justify-content: flex-start;
        pointer-events: none;
    }

    .faq-doctor::before {
        content: "";
        width: min(480px, 100%);
        aspect-ratio: 1 / 0.94;
        position: absolute;
        left: 0;
        bottom: 10px;
        z-index: 0;
        background: url("/images/doctor_bg.png") center bottom / contain no-repeat;
    }

    .faq-doctor img {
        width: min(460px, 100%);
        height: 100%;
        display: block;
        position: relative;
        z-index: 1;
        object-fit: contain;
        object-position: bottom left;
    }

    .faq-content {
        align-self: center;
        text-align: right;
    }

    .faq-eyebrow {
        margin-bottom: 12px;
        gap: 7px;
    }

    .faq-icon {
        width: 15px;
        height: 15px;
        position: relative;
        display: inline-block;
        flex: 0 0 auto;
    }

    .faq-icon::before,
    .faq-icon::after {
        content: "";
        position: absolute;
        inset: 50% auto auto 50%;
        background: currentColor;
        border-radius: 8px;
        transform: translate(-50%, -50%);
    }

    .faq-icon::before {
        width: 15px;
        height: 4px;
    }

    .faq-icon::after {
        width: 4px;
        height: 15px;
    }

    .faq-content h2 {
        margin: 0 0 22px;
        color: #0c59c9;
        font-size: 30px;
        line-height: 1.35;
        font-weight: 800;
        letter-spacing: 0;
    }

    .faq-list {
        display: grid;
        gap: 14px;
    }

    .faq-item {
        overflow: hidden;
        background: #f3f6fb;
        border: 1px solid #0758cc29;
        border-radius: 12px;
        box-shadow: 0 18px 34px #0000002e;
        transition:
            transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.42s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.35s ease,
            border-color 0.35s ease;
    }

    .faq-item.is-open {
        transform: translateY(-3px);
        background: #ffffff;
        border-color: #0758cc52;
        box-shadow: 0 24px 42px #0000003d;
    }

    .faq-question {
        width: 100%;
        min-height: 46px;
        padding: 11px 16px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 5px;
        border: 0;
        color: #07265b;
        background: transparent;
        text-align: right;
        font: inherit;
        font-size: 20px;
        line-height: 1.45;
        cursor: pointer;
    }

    .faq-question:focus-visible {
        outline: 3px solid #11d48a6b;
        outline-offset: -3px;
    }

    .faq-number,
    .faq-icon {
        color: #11c583;
        font-weight: 800;
    }

    .faq-icon {
        transform: rotate(0deg);
        transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .faq-item.is-open .faq-icon {
        transform: rotate(45deg);
    }

    .faq-answer {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        color: #173461;
        text-align: right;
        transition: grid-template-rows 0.22s ease, opacity 0.14s ease;
    }

    .faq-item.is-open .faq-answer {
        grid-template-rows: 1fr;
        opacity: 1;
        border-top: 1px solid #0758cc1f;
    }

    .faq-answer-inner {
        min-height: 0;
        overflow: hidden;
        padding: 0 52px 0 42px;
        transform: translateY(-5px);
        transition: padding-bottom 0.18s ease, transform 0.18s ease;
    }

    .faq-item.is-open .faq-answer-inner {
        padding-bottom: 16px;
        transform: translateY(0);
    }

    .faq-answer p {
        margin: 0;
        padding-top: 2px;
        font-size: 15px;
        line-height: 1.8;
    }

    .blog-section {
        position: relative;
        overflow: hidden;
        padding: 76px 48px 88px;
        background:
            radial-gradient(circle at 12% 10%, #b4d5ff38 0 10%, transparent 10.5%),
            radial-gradient(circle at 88% 18%, #ffffffd1 0 11%, transparent 11.5%),
            linear-gradient(180deg, #f9fbff 0%, #e9f5ff 100%);
    }

    .blog-section::before,
    .blog-section::after {
        content: "";
        position: absolute;
        z-index: 0;
        border: 2px solid #ffffffc7;
        border-radius: 28px;
        pointer-events: none;
    }

    .blog-section::before {
        width: 180px;
        height: 96px;
        top: 18px;
        right: 20%;
        transform: rotate(30deg);
    }

    .blog-section::after {
        width: 150px;
        height: 150px;
        left: -54px;
        top: 34px;
        border-radius: 50%;
    }

    .blog-header,
    .blog-grid {
        width: min(1320px, 100%);
        position: relative;
        z-index: 1;
        margin: 0 auto;
    }

    .blog-header {
        min-height: 54px;
        margin-bottom: 46px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
    }

    .blog-header h2 {
        margin: 0;
        color: #0c59c9;
        font-size: 30px;
        line-height: 1.25;
        font-weight: 800;
        letter-spacing: 0;
        text-align: right;
    }

    .blog-heading {
        text-align: right;
    }

    .blog-eyebrow {
        margin-bottom: 12px;
        gap: 7px;
    }

    .blog-view-all {
        min-width: 150px;
        min-height: 52px;
        padding: 0 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #07265b;
        background: linear-gradient(180deg, #d4e4ff 0%, #bcd3ff 100%);
        border-radius: 25px;
        font-size: 14px;
        line-height: 1.2;
        font-weight: 800;
        text-decoration: none;
        box-shadow: 0 12px 24px #0758cc2e;
        transition: transform 0.24s ease, box-shadow 0.24s ease;
    }

    .blog-view-all:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 28px #0758cc3d;
    }

    .blog-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
    }

    .blog-card {
        min-width: 0;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #0758cc14;
        border-radius: 14px;
        box-shadow: 0 18px 42px #1e4f8f1f;
        transition: transform 0.24s ease, box-shadow 0.24s ease;
    }

    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 24px 52px #1e4f8f2e;
    }

    .blog-image-link {
        display: block;
        aspect-ratio: 1.86 / 1;
        overflow: hidden;
        background: #d9ecff;
    }

    .blog-image {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        transition: transform 0.32s ease, filter 0.32s ease;
    }

    .blog-card:hover .blog-image {
        transform: scale(1.04);
        filter: saturate(1.05);
    }

    .blog-card-body {
        min-height: 178px;
        padding: 22px 28px 26px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .blog-meta {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: #74829d;
        font-size: 12px;
        line-height: 1.4;
        direction: rtl;
    }

    .blog-meta span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .blog-meta-divider {
        width: 1px;
        height: 14px;
        flex: 0 0 auto;
        background: #c9d6eb;
    }

    .blog-meta-icon {
        width: 12px;
        height: 12px;
        position: relative;
        flex: 0 0 auto;
        color: #11c583;
    }

    .blog-meta-calendar {
        border: 2px solid currentColor;
        border-radius: 3px;
    }

    .blog-meta-calendar::before {
        content: "";
        width: 8px;
        height: 2px;
        position: absolute;
        top: -4px;
        left: 50%;
        background: currentColor;
        border-radius: 2px;
        transform: translateX(-50%);
    }

    .blog-meta-user::before,
    .blog-meta-user::after {
        content: "";
        position: absolute;
        left: 50%;
        background: currentColor;
        transform: translateX(-50%);
    }

    .blog-meta-user::before {
        width: 6px;
        height: 6px;
        top: 0;
        border-radius: 50%;
    }

    .blog-meta-user::after {
        width: 11px;
        height: 6px;
        bottom: 0;
        border-radius: 8px 8px 2px 2px;
    }

    .blog-card h3 {
        margin: 18px 0 22px;
        color: #061b57;
        font-size: 21px;
        line-height: 1.45;
        font-weight: 700;
        letter-spacing: 0;
    }

    .blog-card h3 a {
        color: inherit;
        text-decoration: none;
    }

    .blog-card h3 a:hover {
        color: #0bbf7f;
        text-decoration: underline;
        text-underline-offset: 6px;
    }

    .blog-read-more {
        min-width: 132px;
        min-height: 42px;
        margin-top: auto;
        padding: 0 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #07265b;
        background: linear-gradient(180deg, #d4e4ff 0%, #bcd3ff 100%);
        border-radius: 22px;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
        box-shadow: 0 10px 18px #0758cc29;
        transition: transform 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    }

    .blog-read-more:hover {
        color: #0758cc;
        transform: translateY(-2px);
        box-shadow: 0 14px 22px #0758cc38;
    }

    .back-to-top {
        width: 54px;
        height: 54px;
        position: fixed;
        right: 28px;
        bottom: 28px;
        z-index: 20;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 100%;
        color: #ffffff;
        background: linear-gradient(180deg,#a6c9f7 40%, #b4a6f6 69%);
        box-shadow: 0 12px 24px #0758cc40;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }

    .back-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 28px #0758cc4d;
    }

    .back-to-top:focus-visible {
        outline: 3px solid #1486d747;
        outline-offset: 4px;
    }

    .back-to-top span {
        width: 13px;
        height: 13px;
        margin-top: 5px;
        border-top: 4px solid currentColor;
        border-left: 4px solid currentColor;
        transform: rotate(45deg);
        border-radius: 2px;
    }


    @media (max-width: 1030px) {
        .hero-section {
            min-height: auto;
            padding: 42px 28px 36px;
        }

        .hero-inner {
            grid-template-columns: 1fr;
            gap: 28px;
        }

        .hero-copy {
            order: 1;
            justify-self: center;
            text-align: center;
        }

        .hero-copy p {
            margin-left: auto;
            margin-right: auto;
        }

        .hero-actions,
        .hero-stats {
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-visual {
            display: none;
        }

        .specialties-track {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .process-section {
            padding: 42px 28px 58px;
        }

        .process-header h2 {
            font-size: 38px;
        }

        .process-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 42px 32px;
            direction: rtl;
        }

        .process-arrow {
            display: none;
        }

        .faq-section {
            padding: 58px 28px;
        }

        .faq-inner {
            grid-template-columns: 1fr;
            gap: 24px;
        }

        .faq-content {
            width: min(760px, 100%);
            margin: 0 auto;
        }

        .faq-doctor {
            display: none;
        }

        .blog-section {
            padding: 62px 28px 72px;
        }

        .blog-header h2 {
            font-size: 34px;
        }

        .blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 720px) {
        .hero-section {
            padding: 30px 18px 28px;
        }

        .hero-pill {
            margin-bottom: 24px;
        }

        .hero-copy h1 {
            font-size: 28px;
        }

        .hero-copy p {
            margin: 28px 0;
            font-size: 16px;
        }

        .hero-actions {
            flex-direction: column;
            align-items: stretch;
        }

        .hero-btn {
            width: 100%;
        }

        .hero-stats {
            margin-top: 38px;
            gap: 12px;
        }

        .hero-visual {
            min-height: 330px;
        }

        .specialties-section {
            padding: 42px 18px 54px;
        }

        .specialties-header {
            margin-bottom: 24px;
        }

        .specialties-header h2 {
            font-size: 22px;
        }

        .specialties-header p {
            font-size: 13px;
        }

        .specialties-track {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        .specialty-card {
            min-height: 230px;
            padding: 22px 12px 18px;
        }

        .specialty-title {
            font-size: 15px;
        }

        .specialty-icon {
            width: 68px;
            height: 68px;
            margin-top: 18px;
        }

        .specialty-icon img {
            width: 42px;
            height: 42px;
        }

        .specialty-action {
            font-size: 13px;
        }

        .process-section {
            padding: 34px 18px 48px;
        }

        .process-header {
            margin-bottom: 28px;
        }

        .process-header h2 {
            font-size: 31px;
        }

        .process-steps {
            grid-template-columns: 1fr;
            gap: 34px;
        }

        .process-photo-wrap {
            width: 150px;
            height: 150px;
        }

        .process-number {
            width: 54px;
            height: 54px;
            font-size: 20px;
        }

        .process-step h3 {
            margin-top: 18px;
            font-size: 18px;
        }

        .process-step p {
            font-size: 14px;    }

        .faq-section {
            min-height: 430px;
            padding: 42px 18px 64px;
        }

        .faq-inner {
            min-height: auto;
            gap: 18px;
        }

        .faq-content h2 {
            font-size: 24px;
        }

        .faq-question {
            grid-template-columns: auto 1fr auto;
            min-height: 52px;
            padding: 11px 12px;
            font-size: 13px;
        }

        .faq-answer-inner {
            padding-right: 34px;
            padding-left: 32px;
        }

        .faq-item.is-open .faq-answer-inner {
            padding-bottom: 14px;
        }

        .faq-answer p {
            font-size: 13px;
        }

        .blog-section {
            padding: 48px 18px 58px;
        }

        .blog-header {
            margin-bottom: 28px;
            flex-direction: column;
            align-items: flex-start;
        }

        .blog-header h2 {
            width: 100%;
            font-size: 28px;
        }

        .blog-view-all {
            min-height: 46px;
            border-radius: 23px;
        }

        .blog-grid {
            grid-template-columns: 1fr;
            gap: 18px;
        }

        .blog-card-body {
            min-height: 160px;
            padding: 18px 18px 22px;
        }

        .blog-meta {
            flex-wrap: wrap;
            font-size: 11px;
        }

        .blog-card h3 {
            margin: 14px 0 18px;
            font-size: 18px;
        }
    }
</style>
