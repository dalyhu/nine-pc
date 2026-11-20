<template>
  <SportsAnalysis
    v-if="[0, 1].includes(roomDetail.type)"
    :gameId="sportAnalysisGameId"
    :matchId="roomDetail.mars_match_id || roomDetail.match_id"
  ></SportsAnalysis>
  <!-- 火星电竞数据 - 前瞻分析 -->
  <!-- game_id: 1-lol,2-csgo,3-王者荣耀,4-dota2 -->

</template>

<script setup lang="ts">
import SportsAnalysis from '@/views/anchor/components/sportsAnalysis/index.vue'

const props = defineProps({
  roomDetail: {
    type: Object,
    required: true
  }
})

const sportAnalysisGameId = computed(() => {
  return props.roomDetail.type === 1 ? 201 : 202
})
</script>
