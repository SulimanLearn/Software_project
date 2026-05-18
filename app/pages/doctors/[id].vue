<template>
  <NavBar />
  <div class="doctor-profile-page" dir="rtl">
    <main v-if="doctor" class="profile-main">
      <section class="hero-section" :aria-labelledby="ui.heroTitleId">
        <div class="hero-container">
          <div class="doctor-image-wrap">
            <img :src="doctor.image" :alt="doctor.name" class="doctor-image" />
          </div>

          <div class="hero-content">
            <NuxtLink to="/doctors" class="hero-kicker">
              <span class="hero-kicker-arrow" aria-hidden="true">{{ ui.hero.backIcon }}</span>
              <span>{{ ui.hero.kicker }}</span>
            </NuxtLink>
            <h1 :id="ui.heroTitleId">{{ doctor.name }}</h1>
            <p class="hero-specialty">{{ doctor.specialty }}</p>

            <div class="hero-badges" :aria-label="ui.hero.badgesLabel">
              <span
                v-for="badge in heroBadges"
                :key="badge"
                class="hero-badge"
              >
                {{ badge }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-container" :aria-label="ui.sections.profile">
        <div class="main-grid">
          <aside class="booking-card card" :aria-labelledby="ui.bookingTitleId">
            <div class="card-heading centered">
              <h2 :id="ui.bookingTitleId">{{ ui.booking.title }}</h2>
              <p>{{ ui.booking.subtitle }}</p>
            </div>

            <div class="calendar-panel">
              <div class="calendar-header">
                <button
                  type="button"
                  class="calendar-arrow"
                  :aria-label="ui.booking.previousMonth"
                  @click="goToPreviousMonth"
                >
                  {{ ui.calendar.previousIcon }}
                </button>
                <strong>{{ currentMonthLabel }}</strong>
                <button
                  type="button"
                  class="calendar-arrow"
                  :aria-label="ui.booking.nextMonth"
                  @click="goToNextMonth"
                >
                  {{ ui.calendar.nextIcon }}
                </button>
              </div>

              <div class="week-days">
                <span v-for="day in ui.calendar.weekDays" :key="day">{{ day }}</span>
              </div>

              <div class="calendar-days">
                <button
                  v-for="date in calendarCells"
                  :key="date.id"
                  type="button"
                  class="date-button"
                  :class="{
                    'is-selected': selectedDate === date.dateKey,
                    'is-muted': !date.dateKey,
                    'is-disabled': date.dateKey && !date.isAvailable,
                  }"
                  :disabled="!date.dateKey || !date.isAvailable"
                  @click="selectDate(date.dateKey)"
                >
                  {{ date.day }}
                </button>
              </div>
            </div>

            <div class="time-picker">
              <h3>{{ ui.booking.timesTitle }}</h3>
              <div class="time-grid">
                <button
                  v-for="time in selectedDateTimes"
                  :key="time"
                  type="button"
                  class="time-button"
                  :class="{ 'is-active': selectedAppointmentTime === time }"
                  @click="selectedAppointmentTime = time"
                >
                  {{ time }}
                </button>
              </div>
              <p v-if="!selectedDateTimes.length" class="empty-times">
                {{ ui.booking.noTimes }}
              </p>
            </div>

            <button type="button" class="primary-button confirm-button" @click="confirmBooking">
              {{ ui.booking.confirm }}
            </button>

            <p class="fee-line">
              <strong>{{ ui.booking.feeLabel }}</strong>
              <span>{{ doctor.consultationFee }} {{ ui.currency }}</span>
            </p>
          </aside>

          <section class="doctor-info" :aria-label="ui.sections.info">
            <div class="stats-card card">
              <div class="card-label">{{ ui.stats.title }}</div>
              <dl class="stats-grid">
                <div v-for="stat in doctorStats" :key="stat.label" class="stat-item">
                  <dt>{{ stat.value }}</dt>
                  <dd>{{ stat.label }}</dd>
                </div>
              </dl>
            </div>

            <article class="bio-card card">
              <h2>{{ ui.bio.title }}</h2>
              <p>{{ doctor.bio }}</p>
            </article>

            <article class="reviews-card card">
              <h2>{{ ui.reviews.title }}</h2>
              <div
                class="reviews-list"
                :class="{ 'is-scrollable': doctor.reviews.length > 4 }"
              >
                <section
                  v-for="review in doctor.reviews"
                  :key="review.id"
                  class="review-item"
                  :aria-label="`${ui.reviews.reviewBy} ${review.patientName}`"
                >
                  <div class="review-header">
                    <div>
                      <h3>{{ review.patientName }}</h3>
                      <div class="stars" :aria-label="`${review.rating} ${ui.reviews.outOfFive}`">
                        <span
                          v-for="star in ui.ratingStars"
                          :key="`${review.id}-${star}`"
                          :class="{ 'is-filled': star <= review.rating }"
                        >
                          {{ ui.starIcon }}
                        </span>
                      </div>
                    </div>
                    <time>{{ review.date }}</time>
                  </div>
                  <p>{{ review.comment }}</p>
                </section>
              </div>
            </article>
          </section>
        </div>

        <section class="comment-card card" :aria-labelledby="ui.commentTitleId">
          <div class="card-heading centered">
            <h2 :id="ui.commentTitleId">{{ ui.comment.title }}</h2>
            <p>{{ ui.comment.subtitle }}</p>
          </div>

          <div class="rating-picker" :aria-label="ui.comment.ratingLabel">
            <span>{{ ui.comment.ratingLabel }}</span>
            <div class="rating-buttons">
              <button
                v-for="star in ui.ratingStars"
                :key="star"
                type="button"
                class="rating-star"
                :class="{ 'is-selected': star <= selectedRating }"
                :aria-label="`${star} ${ui.reviews.outOfFive}`"
                @click="selectedRating = star"
              >
                {{ ui.starIcon }}
              </button>
            </div>
          </div>

          <textarea
            v-model="commentText"
            class="comment-textarea"
            :placeholder="ui.comment.placeholder"
            :aria-label="ui.comment.placeholder"
          />

          <button type="button" class="primary-button submit-button" @click="submitComment">
            {{ ui.comment.submit }}
          </button>
        </section>
      </section>
    </main>

    <main v-else class="not-found" role="alert">
      <p>{{ ui.notFound }}</p>
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const isLoggedIn = useState('isLoggedIn', () => false);

const ui = {
  currency: '₪',
  starIcon: '★',
  ratingStars: [1, 2, 3, 4, 5],
  heroTitleId: 'doctor-profile-title',
  bookingTitleId: 'booking-title',
  commentTitleId: 'comment-rating-title',
  notFound: 'لم يتم العثور على الطبيب',
  hero: {
    kicker: 'العودة للأطباء',
    backIcon: '→',
    badgesLabel: 'مميزات الطبيب',
  },
  sections: {
    profile: 'ملف الطبيب وحجز الموعد',
    info: 'معلومات الطبيب',
  },
  booking: {
    title: 'احجز موعداً',
    subtitle: 'اختر التاريخ والوقت المناسب لك',
    timesTitle: 'الأوقات المتاحة',
    noTimes: 'لا توجد أوقات متاحة لهذا اليوم',
    confirm: 'تأكيد الحجز',
    feeLabel: 'رسوم الكشف :',
    previousMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
  },
  calendar: {
    previousIcon: '‹',
    nextIcon: '›',
    weekDays: ['أحد', 'اثن', 'ث', 'أربع', 'خميس', 'جمعة', 'سبت'],
  },
  stats: {
    title: 'إحصائيات',
    rating: 'التقييم',
    patients: 'مريض',
    experience: 'سنة خبرة',
  },
  bio: {
    title: 'نبذة عن الطبيب',
  },
  reviews: {
    title: 'آراء المرضى',
    reviewBy: 'تقييم من',
    outOfFive: 'من 5',
  },
  comment: {
    title: 'التعليق والتقييم',
    subtitle: 'شارك تجربتك لمساعدة الآخرين',
    ratingLabel: 'التقييم',
    placeholder: 'اكتب تعليقك هنا...',
    submit: 'إرسال التعليق',
  },
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addDays = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return formatDateKey(date);
};

const createAvailability = (days, times) => (
  days.reduce((availability, dayOffset, index) => {
    const rotatedTimes = index % 2 === 0 ? times : times.slice(0, Math.max(times.length - 1, 1));
    availability[addDays(dayOffset)] = rotatedTimes;

    return availability;
  }, {})
);

const withAvailability = (doctor, availableTimes) => ({
  ...doctor,
  availableDates: Object.keys(availableTimes),
  availableTimes,
});

const cardiologyAvailability = createAvailability([0, 1, 3, 5, 8, 10, 14, 18, 24, 31, 36], ['09:00', '11:00', '12:00', '13:00', '14:00', '15:00']);
const pediatricsAvailability = createAvailability([0, 2, 4, 7, 9, 12, 16, 22, 29, 35], ['10:00', '11:30', '12:30', '14:00', '16:00']);
const dentistryAvailability = createAvailability([1, 3, 6, 8, 11, 15, 21, 26, 33, 39], ['09:30', '10:30', '12:00', '13:30', '15:00']);
const ophthalmologyAvailability = createAvailability([0, 4, 5, 9, 13, 17, 23, 30, 34, 41], ['09:00', '10:00', '11:00', '13:00', '14:30']);

const doctors = ref([
  withAvailability({
    id: 1,
    name: 'د. خالد السيد',
    specialty: 'أمراض القلب و الرعاية الدموية',
    image: '/images/doctor.png',
    experienceYears: 15,
    patientsCount: 320,
    rating: 4.9,
    reviewsCount: 1000,
    bio: 'استشاري أمراض القلب والرعاية الدموية، حاصل على الدكتوراه ومتابعة الكفاءة. خبرة تزيد عن 15 عاماً في التشخيص والعلاج.',
    consultationFee: 100,
    reviews: [
      {
        id: 1,
        patientName: 'أحمد محمود',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'طبيب ممتاز، اهتمام عالي كثيراً وشرح لي كل شيء بالتفصيل. أنصح بشدة بزيارته.',
      },
      {
        id: 2,
        patientName: 'خالد حسين',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'متابعة دقيقة وتعامل مهني، والموعد كان منظماً ومريحاً.',
      },
      {
        id: 3,
        patientName: 'نور يوسف',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'شرح واضح وخطة علاج مفهومة، تجربة ممتازة من البداية للنهاية.',
      },
      {
        id: 4,
        patientName: 'محمد عبد الله',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'استقبال رائع والطبيب أعطاني الوقت الكافي للإجابة عن كل الأسئلة.',
      },
    ],
  }, cardiologyAvailability),
  withAvailability({
    id: 2,
    name: 'د. رهام أحمد',
    specialty: 'طب الأطفال وحديثي الولادة',
    image: '/images/doctors_img.png',
    experienceYears: 11,
    patientsCount: 280,
    rating: 4.8,
    reviewsCount: 720,
    bio: 'طبيبة أطفال بخبرة واسعة في متابعة نمو الأطفال والتطعيمات والتعامل مع الحالات الطارئة للأطفال.',
    consultationFee: 100,
    reviews: [
      {
        id: 1,
        patientName: 'سارة علي',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'تعامل لطيف جداً مع الأطفال وشرح واضح للأهل.',
      },
      {
        id: 2,
        patientName: 'مريم حسن',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'دكتورة مميزة، الموعد كان سريعاً والمنشأة منظمة.',
      },
    ],
  }, pediatricsAvailability),
  withAvailability({
    id: 3,
    name: 'د. سامي علي',
    specialty: 'طب الأسنان وجراحة الفم',
    image: '/images/doctor.png',
    experienceYears: 15,
    patientsCount: 120,
    rating: 4.8,
    reviewsCount: 540,
    bio: 'استشاري طب الأسنان وجراحة الفم، متخصص في علاج الجذور والتركيبات وخطط العناية الوقائية.',
    consultationFee: 110,
    reviews: [
      {
        id: 1,
        patientName: 'رامي يوسف',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'تجربة مريحة ونتيجة ممتازة، الطبيب شرح كل خطوة قبل العلاج.',
      },
    ],
  }, dentistryAvailability),
  withAvailability({
    id: 4,
    name: 'د. نور حسين',
    specialty: 'طب العيون وجراحات القرنية',
    image: '/images/doctors_img.png',
    experienceYears: 12,
    patientsCount: 240,
    rating: 4.7,
    reviewsCount: 410,
    bio: 'استشارية طب العيون، متخصصة في فحوصات النظر وجراحات القرنية ومتابعة أمراض الشبكية.',
    consultationFee: 100,
    reviews: [
      {
        id: 1,
        patientName: 'ليان خالد',
        rating: 5,
        date: 'أبريل 2026',
        comment: 'فحص شامل ودقيق، والتعامل كان محترفاً.',
      },
    ],
  }, ophthalmologyAvailability),
]);

const doctor = computed(() =>
  doctors.value.find((item) => String(item.id) === String(route.params.id)),
);

const selectedAppointmentTime = ref('');
const selectedDate = ref('');
const calendarCursor = ref(new Date());
const selectedRating = ref(0);
const commentText = ref('');

const heroBadges = computed(() => {
  if (!doctor.value) {
    return [];
  }

  return [
    `${doctor.value.experienceYears} سنة خبرة`,
    `+${doctor.value.reviewsCount} تقييم إيجابي`,
  ];
});

const doctorStats = computed(() => {
  if (!doctor.value) {
    return [];
  }

  return [
    { label: ui.stats.rating, value: doctor.value.rating },
    { label: ui.stats.patients, value: `${doctor.value.patientsCount}+` },
    { label: ui.stats.experience, value: `${doctor.value.experienceYears}+` },
  ];
});

const currentMonthLabel = computed(() => (
  new Intl.DateTimeFormat('ar', {
    month: 'long',
    year: 'numeric',
  }).format(calendarCursor.value)
));

const calendarCells = computed(() => {
  const year = calendarCursor.value.getFullYear();
  const month = calendarCursor.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDates = new Set(doctor.value?.availableDates ?? []);
  const cells = [];

  for (let index = 0; index < firstDayOfMonth.getDay(); index += 1) {
    cells.push({
      id: `empty-${year}-${month}-${index}`,
      day: '',
      dateKey: '',
      isAvailable: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);

    cells.push({
      id: dateKey,
      day,
      dateKey,
      isAvailable: availableDates.has(dateKey),
    });
  }

  return cells;
});

const selectedDateTimes = computed(() => {
  if (!doctor.value || !selectedDate.value) {
    return [];
  }

  return doctor.value.availableTimes[selectedDate.value] ?? [];
});

const setCalendarToDate = (dateKey) => {
  const [year, month] = dateKey.split('-').map(Number);
  calendarCursor.value = new Date(year, month - 1, 1);
};

const selectDate = (dateKey) => {
  if (!dateKey || !doctor.value?.availableDates.includes(dateKey)) {
    return;
  }

  selectedDate.value = dateKey;
  selectedAppointmentTime.value = doctor.value.availableTimes[dateKey]?.[0] ?? '';
};

const goToPreviousMonth = () => {
  calendarCursor.value = new Date(
    calendarCursor.value.getFullYear(),
    calendarCursor.value.getMonth() - 1,
    1,
  );
};

const goToNextMonth = () => {
  calendarCursor.value = new Date(
    calendarCursor.value.getFullYear(),
    calendarCursor.value.getMonth() + 1,
    1,
  );
};

const confirmBooking = async () => {
  if (!isLoggedIn.value) {
    await router.push('/login');
    return;
  }

  await router.push('/patient/booking');
};

const submitComment = async () => {
  if (!isLoggedIn.value) {
    await router.push('/login');
    return;
  }

  const comment = commentText.value.trim();

  if (!doctor.value || !comment || selectedRating.value === 0) {
    return;
  }

  doctor.value.reviews.unshift({
    id: Date.now(),
    patientName: 'مستخدم مسجل',
    rating: selectedRating.value,
    date: new Intl.DateTimeFormat('ar', {
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
    comment,
  });

  const nextReviewsCount = doctor.value.reviewsCount + 1;
  doctor.value.rating = Number((
    ((doctor.value.rating * doctor.value.reviewsCount) + selectedRating.value) / nextReviewsCount
  ).toFixed(1));
  doctor.value.reviewsCount = nextReviewsCount;

  commentText.value = '';
  selectedRating.value = 0;
};

watch(
  doctor,
  (selectedDoctor) => {
    const firstAvailableDate = selectedDoctor?.availableDates[0] ?? '';

    selectedDate.value = firstAvailableDate;
    selectedAppointmentTime.value = firstAvailableDate
      ? selectedDoctor?.availableTimes[firstAvailableDate]?.[0] ?? ''
      : '';

    if (firstAvailableDate) {
      setCalendarToDate(firstAvailableDate);
    }
  },
  { immediate: true },
);

useHead(() => ({
  title: doctor.value ? `${doctor.value.name} | MediConnect` : ui.notFound,
}));
</script>

<style scoped>
.doctor-profile-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 15% 10%, #3b82f61a, transparent 24%),
    linear-gradient(180deg, #f4f8ff 0%, #ffffff 58%, #edf5ff 100%);
  color: #101827;
}

.hero-section {
  min-height: 178px;
  padding: 30px clamp(18px, 7vw, 100px) 28px;
  border-bottom: 1px solid #93c5fd73;
  background: radial-gradient(circle at 12% 10%, #b4d5ff38 0 10%, transparent 10.5% 10.5%),
              radial-gradient(circle at 88% 18%, #ffffffd1 0 11%, transparent 11.5%),
              linear-gradient(180deg, #f9fbff 0%, #e9f5ff 100%);
  }

.hero-container {
  display: grid;
  grid-template-columns: 142px minmax(0, 1fr);
  gap: 30px;
  align-items: center;
  max-width: 1060px;
  margin: 0 auto;
}

.doctor-image-wrap {
  width: 132px;
  height: 132px;
  overflow: hidden;
  border: 1px solid #dbeafef2;
  border-radius: 18px;
  background: linear-gradient(145deg, #ffffff, #f1f7ff);
  box-shadow: 0 18px 34px #2563eb24;
}

.doctor-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.doctor-image-wrap:hover {
  border-color: #76a9ff;
  box-shadow: 0 18px 34px #0f172a24;
  transform: translateY(-6px);
  transition: border-color 0.24s ease, box-shadow 0.24s ease, transform 0.24s ease;
}
.hero-content {
  text-align: right;
}

.hero-kicker {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.hero-kicker:hover {
  color: #1d4ed8;
  transform: translateX(2px);
}

.hero-kicker-arrow {
  font-size: 16px;
  line-height: 1;
}

.hero-content h1 {
  margin: 0 0 10px;
  color: #070b14;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.2;
  font-weight: 900;
}

.hero-specialty {
  margin: 0;
  color: #172033;
  font-size: 21px;
  line-height: 1.5;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 5px 16px;
  border: 1px solid #93c5fd;
  border-radius: 25px;
  background: #ffffffb3;
  color: #174174;
  font-size: 12px;
  font-weight: 700;
}

.content-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 22px 18px 26px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.25fr);
  gap: 18px;
  align-items: start;
  direction: ltr;
}

.booking-card,
.doctor-info {
  direction: rtl;
}

.card {
  border: 1px solid #bfdbfedb;
  border-radius: 14px;
  background: #ffffffd1;
  box-shadow: 0 14px 32px #0f172a14;
  backdrop-filter: blur(8px);
}

.booking-card {
  padding: 18px 18px 16px;
}

.card-heading h2,
.bio-card h2,
.reviews-card h2,
.comment-card h2 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 900;
}

.card-heading p {
  margin: 6px 0 0;
  color: #27364f;
  font-size: 13px;
}

.centered {
  text-align: center;
}

.calendar-panel {
  margin-top: 15px;
  padding: 13px;
  border: 1px solid #8bbdfc;
  border-radius: 10px;
  background: #f8fbffe6;
}

.calendar-header,
.week-days,
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
}

.calendar-header {
  grid-template-columns: 32px 1fr 32px;
  margin-bottom: 12px;
}

.calendar-header strong {
  text-align: center;
  color: #0f172a;
  font-size: 13px;
}

.calendar-arrow {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 100%;
  background: transparent;
  color: #0f172a;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: background 0.2s ease, color 0.2s ease;
}

.calendar-arrow:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.week-days {
  margin-bottom: 10px;
  color: #26364e;
  font-size: 12px;
  text-align: center;
}

.calendar-days {
  gap: 7px 6px;
}

.date-button {
  width: 34px;
  height: 34px;
  justify-self: center;
  border: 0;
  border-radius: 100%;
  background: transparent;
  color: #172033;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.date-button:hover,
.date-button.is-selected {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  box-shadow: 0 8px 16px #2563eb42;
}

.date-button.is-muted {
  color: #94a3b8;
}

.date-button.is-disabled {
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.5;
}

.date-button:disabled:hover {
  background: transparent;
  box-shadow: none;
  color: #9ca3af;
}

.time-picker {
  margin-top: 20px;
  text-align: center;
}

.time-picker h3 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 14px;
  font-weight: 800;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px 14px;
}

.time-button {
  min-height: 33px;
  border: 1px solid #93c5fd;
  border-radius: 7px;
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.time-button:hover,
.time-button.is-active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  box-shadow: 0 9px 18px #2563eb38;
  transform: translateY(-1px);
}

.empty-times {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 12px;
  text-align: center;
}

.primary-button {
  border: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, #005edc, #3b82f6);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  box-shadow: 0 14px 24px #2563eb3d;
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.primary-button:hover {
  filter: saturate(1.08);
  box-shadow: 0 18px 30px #2563eb52;
  transform: translateY(-2px);
}

.confirm-button {
  display: block;
  width: min(230px, 100%);
  min-height: 48px;
  margin: 34px auto 12px;
  font-size: 15px;
}

.fee-line {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0;
  color: #080d18;
  font-size: 13px;
  font-weight: 800;
}

.doctor-info {
  display: grid;
  gap: 14px;
}

.stats-card,
.bio-card,
.reviews-card {
  padding: 14px 16px;
}

.card-label {
  margin-bottom: 10px;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  margin: 0;
}

.stat-item {
  min-height: 62px;
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2f73e7, #4f9bff);
  color: #ffffff;
  text-align: center;
  box-shadow: 0 12px 24px #2563eb33;
}

.stat-item dt {
  font-size: 17px;
  font-weight: 900;
}

.stat-item dd {
  margin: 4px 0 0;
  font-size: 12px;
}

.bio-card h2,
.reviews-card h2 {
  margin-bottom: 14px;
  font-size: 15px;
}

.bio-card p {
  margin: 0;
  color: #172033;
  font-size: 15px;
  line-height: 1.9;
}

.reviews-list {
  display: grid;
  gap: 9px;
}
.reviews-list.is-scrollable {
  max-height: 350px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-color: #8bbdfc #dbeafeb8;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  direction: ltr;
  padding-left: 6px;
}

.reviews-list.is-scrollable::-webkit-scrollbar {
  width: 6px;
}

.reviews-list.is-scrollable::-webkit-scrollbar-track {
  border-radius: 100%;
  background: #dbeafeb8;
}

.reviews-list.is-scrollable::-webkit-scrollbar-thumb {
  border-radius: 100%;
  background: linear-gradient(180deg, #60a5fa, #2563eb);
}

.reviews-list.is-scrollable::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
}
.review-item {
  padding: 8px 10px;
  border: 1px solid #93c5fd;
  border-radius: 7px;
  background: #ffffff9e;
}

.review-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.review-header h3 {
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.2;
}

.review-header time {
  color: #26364e;
  font-size: 11px;
  white-space: nowrap;
}

.stars {
  display: flex;
  gap: 1px;
  margin-top: 2px;
  color: #cbd5e1;
  font-size: 13px;
}

.stars .is-filled {
  color: #f8b400;
}

.review-item p {
  margin: 4px 0 0;
  color: #27364f;
  font-size: 13px;
  line-height: 1.65;
}

.comment-card {
  margin-top: 18px;
  padding: 18px 16px 16px;
}

.rating-picker {
  margin-top: 18px;
  text-align: center;
}

.rating-picker > span {
  display: block;
  color: #27364f;
  font-size: 13px;
  margin-bottom: 8px;
}

.rating-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.rating-star {
  border: 0;
  background: transparent;
  color: #bcc7d6;
  cursor: pointer;
  font-size: 34px;
  line-height: 1;
  text-shadow: 0 2px 4px #0f172a1f;
  transition: color 0.18s ease, transform 0.18s ease;
}

.rating-star:hover,
.rating-star.is-selected {
  color: #f8b400;
  transform: translateY(-2px);
}

.comment-textarea {
  display: block;
  width: 100%;
  min-height: 92px;
  margin-top: 24px;
  padding: 16px;
  resize: vertical;
  border: 1px solid #c8d8ee;
  border-radius: 8px;
  background: #ffffffdb;
  color: #111827;
  font: inherit;
  line-height: 1.7;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.comment-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px #3b82f621;
}

.comment-textarea::placeholder {
  color: #9ca3af;
}

.submit-button {
  display: block;
  width: min(220px, 100%);
  min-height: 50px;
  margin: 13px auto 8px;
  font-size: 15px;
}

.not-found {
  display: grid;
  min-height: 60vh;
  place-items: center;
  padding: 24px;
  color: #1e3a8a;
  font-size: 24px;
  font-weight: 900;
}

@media (max-width: 1030px) {
  .hero-section {
    min-height: 150px;
    padding-block: 22px;
  }

  .hero-container,
  .content-container {
    max-width: 920px;
  }

  .hero-container {
    grid-template-columns: 118px minmax(0, 1fr);
    gap: 22px;
  }

  .doctor-image-wrap {
    width: 112px;
    height: 112px;
  }

  .hero-specialty {
    font-size: 18px;
  }

  .content-container {
    padding-inline: 14px;
  }

  .main-grid {
    grid-template-columns: minmax(300px, 0.86fr) minmax(360px, 1.14fr);
    gap: 14px;
  }

  .booking-card {
    padding: 16px 14px;
  }

  .calendar-panel {
    padding: 10px;
  }

  .date-button {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .time-grid {
    gap: 9px;
  }

  .stats-grid {
    gap: 22px;
  }

  .card-heading h2,
  .comment-card h2 {
    font-size: 20px;
  }
}

@media (max-width: 720px) {
  .content-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .hero-container {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .hero-content {
    text-align: center;
  }

  .hero-badges {
    justify-content: center;
  }

  .main-grid {
    display: contents;
    direction: rtl;
  }

  .doctor-info {
    display: contents;
  }

  .booking-card,
  .doctor-info,
  .comment-card {
    width: 100%;
    min-width: 0;
  }

  .stats-card {
    order: 1;
  }

  .bio-card {
    order: 2;
  }

  .booking-card {
    order: 3;
  }

  .reviews-card {
    order: 4;
  }

  .comment-card {
    order: 5;
    margin-top: 0;
  }

  .time-grid {
    grid-template-columns: 1fr;
  }

  .stats-card {
    padding: 16px 18px;
  }

  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
  }

  .stat-item {
    min-height: 78px;
    display: grid;
    place-items: center;
    align-content: center;
    padding: 12px 8px;
  }

  .stat-item dt {
    font-size: 22px;
  }

  .stat-item dd {
    font-size: 13px;
  }

  .confirm-button,
  .submit-button {
    width: 100%;
  }

  .review-header {
    flex-direction: column;
    gap: 5px;
  }

  .rating-buttons {
    gap: 10px;
  }

  .rating-star {
    font-size: 30px;
  }
  .booking-card,
  .bio-card,
  .reviews-card,
  .comment-card {
    padding-inline: 12px;
  }

  .calendar-days {
    gap: 5px 3px;
  }

  .date-button {
    width: 28px;
    height: 28px;
  }
}

</style>
