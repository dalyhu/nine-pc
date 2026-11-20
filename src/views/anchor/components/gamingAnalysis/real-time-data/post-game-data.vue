<template>
    <SmallTitle title="赛后数据"></SmallTitle>
    <div v-for="sub in defTeams" :key="sub.team_id" class="table-box">
        <el-table :data="sub.players" fit style="width: 100%" border>
          <el-table-column prop="" label="" show-overflow-tooltip width="130">
            <template #header>
              <el-popover placement="bottom" trigger="hover" :content="sub.name" effect="dark">
                <template #reference>
                  <div class="team-name-title flex-start">
                    <img :src="sub.logo || defaultImage" alt="" width="30px" />
                    <span class="text-clamp" style="width: 98px">{{ sub.name }}</span>
                  </div>
                </template>
              </el-popover>
            </template>
            <template #default="{ row }">
              <div class="team-name-title flex-start">
                <img :src="row.logo || defaultImage" alt="" width="30px" />
                <span class="text-clamp" style="width: 98px">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="kast" label="KAST"/>
          <el-table-column prop="kd_diff" label="KD Diff"/>
          <el-table-column prop="adr" label="ADR"/>
          <el-table-column prop="fk_diff" label="FK Diff"/>
          <el-table-column prop="rating" label="RATING"/>
          <el-table-column prop="kills" label="击杀数"/>
          <el-table-column prop="assists" label="助功数"/>
          <el-table-column prop="deaths" label="死亡数"/>
          <el-table-column prop="headshot" label="暴头数"/>
          <el-table-column prop="flasher" label="闪光数"/>
        </el-table>
    </div>
  </template>
  <script setup>
  import SmallTitle from '../small-title.vue';
  defineProps({
    defTeams: {
      type: Array,
      default: () => []
    }
  });
  const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
  </script>
  
  <style lang="scss" scoped>
.table-box {
  margin-bottom: 20px;
  margin-top: 10px;
  .team-name-title {
    align-items: end;
    span { margin-left: 4px;}
  }
}
  </style>
  