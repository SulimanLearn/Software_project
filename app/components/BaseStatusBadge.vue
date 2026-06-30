<template>
  <span :class="[baseClass, normalizedClass]" :data-status="status">
    {{ status }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  },
  statusClass: {
    type: String,
    default: ''
  },
  baseClass: {
    type: [String, Array, Object],
    default: 'base-status-badge'
  }
})

const statusMap = {
  'مكتمل': 'completed',
  'تم التسليم': 'delivered',
  'تم التسليم للعميل': 'delivered',
  'متوفر': 'available',
  'مقبول': 'accepted',
  'مؤكد': 'confirmed',
  'جديد': 'new',
  'قيد الانتظار': 'pending',
  'قيد المراجعة': 'pending',
  'قيد المعالجة': 'processing',
  'يتم التحضير': 'preparing',
  'جاهز': 'packaged',
  'في التوصيل': 'delivery',
  'منخفض': 'low',
  'ملغي': 'cancelled',
  'مرفوض': 'rejected',
  'غير متوفر': 'unavailable',
  'منتهي الصلاحية': 'expired'
}

const normalizedClass = computed(() => props.statusClass || statusMap[props.status] || '')
</script>
