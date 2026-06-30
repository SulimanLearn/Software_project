export type Specialty = {
    title: string;
    slug: string;
    icon: string;
};

export const specialties: Specialty[] = [
    { title: 'أمراض القلب', slug: 'cardiology', icon: '/images/heart.svg' },
    { title: 'طب الأطفال', slug: 'pediatrics', icon: '/images/baby.svg' },
    { title: 'طب الأسنان', slug: 'dentistry', icon: '/images/tooth.svg' },
    { title: 'طب العيون', slug: 'ophthalmology', icon: '/images/eye.svg' },
    { title: 'الطب الباطني', slug: 'internal-medicine', icon: '/images/stethoscope.svg' },
    { title: 'الجلدية', slug: 'dermatology', icon: '/images/face.svg' },
    { title: 'الأعصاب', slug: 'neurology', icon: '/images/brain.svg' },
    { title: 'الطب العام', slug: 'public-medicine', icon: '/images/general.svg' },
    { title: 'الجراحة العامة', slug: 'general-surgery', icon: '/images/surgery.svg' },
    { title: 'أنف و أذن و حنجرة', slug: 'ent', icon: '/images/ear.svg' },
    { title: 'أمراض النساء', slug: 'gynecological-diseases', icon: '/images/woman.svg' },
    { title: 'علاج طبيعي', slug: 'physical-therapy', icon: '/images/massage.svg' },
];
