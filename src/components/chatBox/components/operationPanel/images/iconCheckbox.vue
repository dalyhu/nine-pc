<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#B5B5B5" />
    <path
      v-if="isActive"
      d="M13.4499 5.56767L7.36396 11.6536C6.97344 12.0441 6.34027 12.0441 5.94975 11.6536L2.82797 8.53185"
      stroke="#B5B5B5"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>
