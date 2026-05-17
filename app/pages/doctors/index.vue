<template>
    <div class="doctors-page" dir="rtl">
        <NavBar />

        <main class="doctors-main">
            <section class="doctors-hero" aria-labelledby="doctors-title">
                <span class="doctors-pill">الأطباء</span>
                <h1 id="doctors-title">تصفح الأطباء المتخصصين</h1>
                <p>
                    اختر من بين أكثر من {{ doctorsCount }} طبيب متخصص في {{ specialtiesCount }}+ تخصصاً طبياً
                </p>

                <div class="doctors-toolbar">
                    <label class="search-field" aria-label="ابحث عن طبيب أو تخصص">
                        <Search :size="19" aria-hidden="true" />
                        <input
                            v-model.trim="searchTerm"
                            type="search"
                            placeholder="ابحث عن طبيب أو تخصص"
                        />
                    </label>

                    <div
                        class="specialty-slider"
                        :class="`is-moving-${specialtySlideDirection}`"
                        aria-label="فلترة حسب التخصص"
                    >
                        <button
                            type="button"
                            class="slider-arrow"
                            :disabled="isAtEnd"
                            aria-label="عرض التخصصات التالية"
                            @click="showNextSpecialty"
                        >
                            <ChevronRight :size="18" aria-hidden="true" />
                        </button>

                        <TransitionGroup name="specialty-slide" tag="div" class="specialty-filters">
                            <button
                                key="all-specialties"
                                type="button"
                                class="filter-button all-filter"
                                :class="{ 'is-active': activeSpecialtySlug === 'all' }"
                                @click="selectSpecialty('all')"
                            >
                                الكل
                            </button>
                            <button
                                v-for="specialty in visibleSpecialties"
                                :key="specialty.slug"
                                type="button"
                                class="filter-button"
                                :class="{ 'is-active': activeSpecialtySlug === specialty.slug }"
                                @click="selectSpecialty(specialty.slug)"
                            >
                                {{ specialty.title }}
                            </button>
                        </TransitionGroup>

                        <button
                            type="button"
                            class="slider-arrow"
                            :disabled="isAtStart"
                            aria-label="عرض التخصصات السابقة"
                            @click="showPreviousSpecialty"
                        >
                            <ChevronLeft :size="18" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </section>

            <section class="doctors-results" aria-live="polite">
                <div v-if="filteredDoctors.length" class="doctors-grid">
                    <NuxtLink
                        v-for="doctor in filteredDoctors"
                        :key="doctor.id"
                        :to="`/doctors/${doctor.id}`"
                        class="doctor-card"
                        :aria-label="`عرض ملف ${doctor.name}`"
                    >
                        <div class="doctor-head">
                            <div>
                                <h2>{{ doctor.name }}</h2>
                                <p>{{ doctor.description }}</p>
                            </div>
                            <img :src="doctor.image" :alt="doctor.name" class="doctor-avatar" />
                        </div>

                        <div class="doctor-rating" :aria-label="`تقييم ${doctor.ratingAverage} من 5`">
                            <span class="rating-stars" aria-hidden="true">
                                <span
                                    v-for="(star, index) in getRatingStars(doctor.ratingAverage)"
                                    :key="`${doctor.id}-star-${index}`"
                                    class="rating-star"
                                    :class="`is-${star}`"
                                >
                                    ★
                                </span>
                            </span>
                            <span>{{ doctor.ratingAverage.toFixed(1) }} ({{ doctor.reviewsCount }} تقييم)</span>
                        </div>

                        <dl class="doctor-stats">
                            <div>
                                <dt>{{ doctor.price }}$</dt>
                                <dd>الكشف</dd>
                            </div>
                            <div>
                                <dt>{{ doctor.experienceYears }}</dt>
                                <dd>سنة خبرة</dd>
                            </div>
                            <div>
                                <dt>+{{ doctor.patientsCount }}</dt>
                                <dd>مريض</dd>
                            </div>
                        </dl>

                        <div class="doctor-footer">
                            <span>{{ doctor.specialtyName }} </span>
                        </div>
                    </NuxtLink>
                </div>

                <div v-else class="empty-state">
                    <h2>لا توجد نتائج مطابقة</h2>
                    <p>جرّب البحث باسم آخر أو اختر تخصصاً مختلفاً.</p>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, Search } from '@lucide/vue';
import { doctors } from '~/data/doctors';
import { specialties } from '~/data/specialties';

const route = useRoute();
const router = useRouter();

const searchTerm = ref('');
const activeSpecialtySlug = ref('all');
const specialtyWindowStart = ref(0);
const visibleSpecialtiesCount = ref(5);
const specialtySlideDirection = ref<'next' | 'previous'>('next');

const doctorsCount = computed(() => doctors.length);
const specialtiesCount = computed(() => specialties.length);
const maxSpecialtyWindowStart = computed(() => Math.max(specialties.length - visibleSpecialtiesCount.value, 0));
const visibleSpecialties = computed(() => (
    specialties.slice(
        specialtyWindowStart.value,
        specialtyWindowStart.value + visibleSpecialtiesCount.value,
    )
));
const isAtStart = computed(() => specialtyWindowStart.value === 0);
const isAtEnd = computed(() => specialtyWindowStart.value >= maxSpecialtyWindowStart.value);

const normalizeQueryValue = (value: unknown) => Array.isArray(value) ? value[0] : value;

const isKnownSpecialty = (slug: unknown) => (
    typeof slug === 'string' && specialties.some((specialty) => specialty.slug === slug)
);

const clampSpecialtyWindow = () => {
    specialtyWindowStart.value = Math.min(specialtyWindowStart.value, maxSpecialtyWindowStart.value);
};

const placeSpecialtyNextToAll = (slug: string) => {
    const specialtyIndex = specialties.findIndex((specialty) => specialty.slug === slug);

    if (specialtyIndex === -1) {
        return;
    }

    specialtySlideDirection.value = specialtyIndex < specialtyWindowStart.value ? 'previous' : 'next';
    specialtyWindowStart.value = Math.min(specialtyIndex, maxSpecialtyWindowStart.value);
};

const updateVisibleSpecialtiesCount = () => {
    if (window.innerWidth <= 600) {
        visibleSpecialtiesCount.value = 2;
    } else if (window.innerWidth <= 1030) {
        visibleSpecialtiesCount.value = 3;
    } else {
        visibleSpecialtiesCount.value = 5;
    }

    clampSpecialtyWindow();

    if (activeSpecialtySlug.value !== 'all') {
        placeSpecialtyNextToAll(activeSpecialtySlug.value);
    }
};

const showNextSpecialty = () => {
    specialtySlideDirection.value = 'next';
    specialtyWindowStart.value = Math.min(
        specialtyWindowStart.value + 1,
        maxSpecialtyWindowStart.value,
    );
};

const showPreviousSpecialty = () => {
    specialtySlideDirection.value = 'previous';
    specialtyWindowStart.value = Math.max(specialtyWindowStart.value - 1, 0);
};

watch(
    () => route.query.specialty,
    (specialty) => {
        const slug = normalizeQueryValue(specialty);
        activeSpecialtySlug.value = isKnownSpecialty(slug) ? slug : 'all';

        if (activeSpecialtySlug.value !== 'all') {
            placeSpecialtyNextToAll(activeSpecialtySlug.value);
        }
    },
    { immediate: true },
);

const selectSpecialty = (slug: string) => {
    activeSpecialtySlug.value = slug;

    router.replace({
        path: '/doctors',
        query: slug === 'all' ? {} : { specialty: slug },
    });

    if (slug !== 'all') {
        placeSpecialtyNextToAll(slug);
    }
};

const filteredDoctors = computed(() => {
    const term = searchTerm.value.toLowerCase();

    return doctors.filter((doctor) => {
        const matchesSpecialty = activeSpecialtySlug.value === 'all'
            || doctor.specialtySlug === activeSpecialtySlug.value;

        const matchesSearch = !term
            || doctor.name.toLowerCase().includes(term)
            || doctor.specialtyName.toLowerCase().includes(term)
            || doctor.description.toLowerCase().includes(term);

        return matchesSpecialty && matchesSearch;
    });
});

const getRatingStars = (ratingAverage: number) => Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    if (ratingAverage >= starValue - 0.25) {
        return 'full';
    }

    if (ratingAverage >= starValue - 0.75) {
        return 'half';
    }

    return 'empty';
});

useHead({
    title: 'الأطباء | مجمع الحياة الطبي',
});

onMounted(() => {
    updateVisibleSpecialtiesCount();
    window.addEventListener('resize', updateVisibleSpecialtiesCount, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateVisibleSpecialtiesCount);
});
</script>

<style scoped>
.doctors-page {
    min-height: 100vh;
    background: #f6f9ff;
    color: #111827;
}

.doctors-main {
    padding-bottom: 54px;
}

.doctors-hero {
    padding: 48px clamp(16px, 5vw, 80px) 24px;
    text-align: center;
    border-bottom: 1px solid #b9d0f6;
    background: radial-gradient(circle at 12% 10%, #b4d5ff38 0 10%, transparent 10.5% 10.5%),
                radial-gradient(circle at 88% 18%, #ffffffd1 0 11%, transparent 11.5%),
                linear-gradient(180deg, #f9fbff 0%, #e9f5ff 100%);
}

.doctors-hero h1 {
    margin: 18px 0 10px;
    font-size: 40px;
    line-height: 1.25;
    color: #0c59c9;
}

.doctors-hero p {
    margin: 0 auto;
    max-width: 680px;
    color: #4b5563;
    font-size: 17px;
}

.doctors-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 98px;
    padding: 7px 22px;
    border: 1px solid #76a9ff;
    border-radius: 999px;
    background: #dbe9ff;
    color: #0d63ce;
    font-size: 13px;
    font-weight: 700;
}

.doctors-toolbar {
    display: grid;
    grid-template-columns: minmax(220px, 340px) minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    margin: 30px auto 0;
    max-width: 1360px;
}

.search-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 42px;
    padding: 0 14px;
    border: 1px solid #76a9ff;
    border-radius: 999px;
    background: #ffffff;
    color: #1d4ed8;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.12);
}

.search-field input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #111827;
    font: inherit;
}

.search-field input::placeholder {
    color: #6b7280;
}

.specialty-slider {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.specialty-filters {
    display: grid;
    grid-template-columns: 88px repeat(5, minmax(142px, 1fr));
    gap: 12px;
    min-width: 0;
    flex: 1;
    overflow: hidden;
    position: relative;
}

.filter-button {
    min-height: 44px;
    padding: 9px 20px;
    border: 1px solid #76a9ff;
    border-radius: 999px;
    background: #ffffff;
    color: #174ea6;
    cursor: pointer;
    font: inherit;
    font-size: 15px;
    font-weight: 700;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;
}

.specialty-slide-move,
.specialty-slide-enter-active,
.specialty-slide-leave-active {
    transition: opacity 0.28s ease, transform 0.28s ease;
}

.specialty-slide-enter-from,
.specialty-slide-leave-to {
    opacity: 0;
}

.is-moving-next .specialty-slide-enter-from {
    transform: translateX(-22px);
}

.is-moving-next .specialty-slide-leave-to {
    transform: translateX(22px);
}

.is-moving-previous .specialty-slide-enter-from {
    transform: translateX(22px);
}

.is-moving-previous .specialty-slide-leave-to {
    transform: translateX(-22px);
}

.specialty-slide-leave-active {
    position: absolute;
}

.filter-button:hover,
.filter-button.is-active {
    background: #0b63d8;
    color: #ffffff;
    box-shadow: 0 8px 18px rgba(11, 99, 216, 0.18);
}

.slider-arrow {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border: 1px solid #76a9ff;
    border-radius: 999px;
    background: #ffffff;
    color: #174ea6;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.slider-arrow:hover:not(:disabled) {
    background: #0b63d8;
    color: #ffffff;
}

.slider-arrow:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.doctors-results {
    padding: 26px clamp(16px, 5vw, 80px) 0;
}

.doctors-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
    max-width: 1180px;
    margin: 0 auto;
}

.doctor-card {
    display: flex;
    min-height: 232px;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px;
    border: 1px solid #e7eefb;
    border-radius: 8px;
    background: #eef5ff;
    color: inherit;
    text-decoration: none;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    transition: border-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease;
}

.doctor-card:hover {
    border-color: #76a9ff;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.14);
    transform: translateY(-6px);
}

.doctor-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 58px;
    gap: 12px;
    align-items: start;
}

.doctor-head h2 {
    margin: 0 0 6px;
    font-size: 17px;
    line-height: 1.35;
    color: #111827;
}

.doctor-head p {
    margin: 0;
    color: #374151;
    font-size: 13px;
    line-height: 1.6;
}

.doctor-avatar {
    width: 58px;
    height: 58px;
    border: 1px solid #a7b1c2;
    border-radius: 8px;
    background: #ffffff;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.doctor-card:hover .doctor-avatar {
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
    transform: scale(1.06);
}

.doctor-rating {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    margin: 14px 0 12px;
    color: #374151;
    font-size: 12px;
}

.rating-stars {
    display: inline-flex;
    direction: rtl;
    gap: 1px;
    color: #ffad0a;
    font-size: 16px;
    line-height: 1;
}

.rating-star {
    position: relative;
    color: #cbd5e1;
}

.rating-star.is-full {
    color: #ffad0a;
}

.rating-star.is-half::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    overflow: hidden;
    color: #ffad0a;
    content: '★';
}

.doctor-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: auto 0 0;
    padding: 12px 0 0;
    border-top: 1px solid #76a9ff;
}

.doctor-stats div {
    text-align: center;
}

.doctor-stats div + div {
    border-right: 1px solid #76a9ff;
}

.doctor-stats dt {
    color: #075dd0;
    font-weight: 800;
    font-size: 14px;
}

.doctor-stats dd {
    margin: 5px 0 0;
    color: #334155;
    font-size: 12px;
}

.doctor-footer {
    display: flex;
    justify-content: center;
    margin-top: 13px;
    color: #1f2937;
    font-size: 12px;
}

.doctor-footer strong {
    color: #075dd0;
}

.empty-state {
    max-width: 520px;
    margin: 30px auto 0;
    padding: 34px 22px;
    border: 1px solid #d7e5fb;
    border-radius: 8px;
    background: #ffffff;
    text-align: center;
}

.empty-state h2 {
    margin: 0 0 8px;
    font-size: 24px;
}

.empty-state p {
    margin: 0;
    color: #64748b;
}

@media (max-width: 1030px) {
    .doctors-toolbar {
        grid-template-columns: 1fr;
    }

    .specialty-slider {
        justify-content: center;
    }

    .specialty-filters {
        grid-template-columns: 84px repeat(3, minmax(132px, 1fr));
    }

    .doctors-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .doctors-hero {
        padding-top: 32px;
    }

    .doctors-grid {
        grid-template-columns: 1fr;
    }

    .specialty-slider {
        gap: 8px;
    }

    .specialty-filters {
        grid-template-columns: minmax(62px, 0.7fr) repeat(2, minmax(116px, 1fr));
        gap: 8px;
    }

    .filter-button {
        min-width: 0;
        padding-inline: 12px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .slider-arrow {
        width: 36px;
        height: 36px;
        flex-basis: 36px;
    }
}
</style>
