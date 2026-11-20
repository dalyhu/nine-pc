<template>
    <CsgoTeam :homeData="homeData" :awayData="awayData"></CsgoTeam>
  
    <div class="csgo-map">
      <div class="head-andy flex-column _row">
        <el-popover placement="bottom" trigger="hover" :content="mapName" effect="dark">
            <template #reference>
                <span class="text-clamp frist-andy">地图:{{ mapName }}</span>
            </template>
         </el-popover>
        <div class="flex-start">
          <img :src="homeData.logo || defaultImage" alt="2" width="18px" />
          <el-popover placement="bottom" trigger="hover" :content="homeData.name" effect="dark">
            <template #reference>
                <span class="text-clamp max-wids">{{ homeData.name }}</span>
            </template>
         </el-popover>
          <!-- 是否获胜 -->
          <img v-if="homeData.win == 1" src="/static/images/live/game/win.png" alt="1" width="18px" />
        </div>
        <div class="flex-start">
          <img :src="awayData.logo || defaultImage" alt="1" width="18px" />
          <el-popover placement="bottom" trigger="hover" :content="awayData.name" effect="dark">
            <template #reference>
                <span class="text-clamp max-wids">{{ awayData.name }}</span>
            </template>
         </el-popover>
          <!-- 是否获胜 -->
          <img v-if="awayData.win == 1" src="/static/images/live/game/win.png" alt="1" width="18px" />
        </div>
      </div>
      <div class="flex-column _row">
        <span class="frist-andy">上半场</span>
        <span
          >{{ homeData.fh_score }}
          <img v-if="homeData.first_kills" src="/static/images/live/game/first_blood_cs.png" alt="1" width="18px" />
        </span>
        <span
          >{{ awayData.fh_score }}
          <img v-if="awayData.first_kills" src="/static/images/live/game/first_blood_cs.png" alt="1" width="18px" />
        </span>
      </div>
      <div class="flex-column _row">
        <span class="frist-andy">下半场</span>
        <span
          >{{ homeData.sh_score }}
          <img v-if="homeData.r16_win" src="/static/images/live/game/r16.png" alt="1" width="18px" />
        </span>
        <span
          >{{ awayData.sh_score }}
          <img v-if="awayData.r16_win" src="/static/images/live/game/r16.png" alt="1" width="18px" />
        </span>
      </div>
      <div class="flex-column _row">
        <span class="frist-andy">加时</span>
        <span>{{ homeData.m_score }}</span>
        <span>{{ awayData.m_score }}</span>
      </div>
      <div class="flex-column bottom-andy _row">
        <span class="frist-andy">总比分</span>
        <span class="flex-start">
          <span style="margin: 0 auto">{{ homeData.score }}</span>
          <img v-if="homeData.first_blood" src="/static/images/live/game/first_blood_cs.png" alt="1" width="18px" />
          <img v-if="homeData.five_kills" src="/static/images/live/game/five_kills_cs.png" alt="1" width="18px" />
          <img v-if="homeData.ten_kills" src="/static/images/live/game/ten_kills_cs.png" alt="1" width="18px" />
          <img v-if="homeData.r16_win" src="/static/images/live/game/r16.png" alt="1" width="18px" />
        </span>
        <span class="flex-start" style="margin: 0 auto">
          <span>{{ awayData.score }}</span>
          <img v-if="awayData.first_blood" src="/static/images/live/game/first_blood_cs.png" alt="1" width="18px" />
          <img v-if="awayData.five_kills" src="/static/images/live/game/five_kills_cs.png" alt="1" width="18px" />
          <img v-if="awayData.ten_kills" src="/static/images/live/game/ten_kills_cs.png" alt="1" width="18px" />
          <img v-if="awayData.r16_win" src="/static/images/live/game/r16.png" alt="1" width="18px" />
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import CsgoTeam from '../csgo-team.vue';
  const props = defineProps({
    defTeams: {
      type: Array,
      default: () => []
    },
    mapName: {
      type: String,
      default: ''
    }
  });
  
  const homeData = computed(() => {
    return props.defTeams.length && props.defTeams[0];
  });
  
  const awayData = computed(() => {
    return props.defTeams.length && props.defTeams[1];
  });
  
 const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
  </script>
  
  <style lang="scss" scoped>
  .csgo-map {
    width: 100%;
    display: flex;
    font-size: 14px;
    .flex-column {
        display:flex;
        flex-direction: column;
    }
    .max-wids {
      width: 50px;
    }
    ._row {
      width: calc((100% - 220px) / 3);
      &.head-andy {
        width: 100px;
      }
      &.bottom-andy {
        width: 120px;
        img {
          margin-left: 2px;
        }
      }
      span {
        text-align: center;
        line-height: 32px;
        img {
          vertical-align: middle;
        }
        &.frist-andy {
          background: #f5f5f5;
        }
      }
    }
  }
  </style>
  