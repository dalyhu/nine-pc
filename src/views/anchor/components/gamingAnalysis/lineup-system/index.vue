<template>
    <div class="lineup-system hide_scrollbar">
      <!-- 位置信息切换 -->
      <template v-if="setTeamdata && setTeamdata.length">
        <div v-if="!isCsgo" class="lineup-system-table">
          <ul class="flex position-info">
            <li v-for="(item, index) in postionList" :key="item" :class="{ isActived: `${defaultPos}` === `${index}` }" @click="handleChnagePos(index)">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <!-- csgo -->
        <CsgoContent v-if="isCsgo" :homeData="setTeamdata[0]" :awayData="setTeamdata[1]">
        </CsgoContent>
        <!-- lol dota 王者 -->
        <OtherContent v-if="!isCsgo" :setTeamdata="setTeamdata" :defaultPos="defaultPos">
            <div class="team-info flex" v-if="setTeamdata && setTeamdata.length">
                <div class="logo-pos flex">
                    <el-popover placement="bottom" trigger="hover" :content="setTeamdata[0].name" effect="dark">
                      <template #reference>
                        <span class="text-clamp">{{ setTeamdata[0].name }}</span>
                      </template>
                  </el-popover>
                    <img :src="setTeamdata[0].logo || defaultImage" alt="logo" width="30" height="auto"/>
                </div>
                <!-- 下拉菜单 -->
                <el-dropdown trigger="click">
                    <div class="session-select" @click="handleOpen">{{ !currentSession ? '全部' : `近${currentSession}场` }}</div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="item in numSessionList" :key="item.value" @click="handleCommand(item)">
                                {{ item.text }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
  
                <div class="logo-pos flex">
                    <el-popover placement="bottom" trigger="hover" :content="setTeamdata[1].name " effect="dark">
                      <template #reference>
                        <span class="text-clamp">{{ setTeamdata[1].name }}</span>
                      </template>
                    </el-popover>
                    <img :src="setTeamdata[1].logo || defaultImage" alt="member" width="30" height="auto"  @error="(e) => e.target.src=defaultImage"/>
                  </div>
            </div>
  
            <!-- 队员 -->
          <div class="member-attiver-info flex" v-if="setTeamdata && setTeamdata.length">
            <div class="member-info-left flex-center">
                <div class="member-pos">
                    <img :src="setTeamdata[0].players[defaultPos].logo || defaultImage" alt="member" width="100%" 
                    @error="(e) => e.target.src=defaultImage" />
                </div>
                <span> {{ setTeamdata[0].players[defaultPos].name }}</span>
            </div>

            <div class="vs-nam-icon">
              <img src="/static/images/live/game/icon-vs.png" width="28px" alt />
            </div>
  
            <div class="member-info-right flex-center">
                <div class="member-pos">
                  <img :src="setTeamdata[1].players[defaultPos].logo || defaultImage" alt="member" width="100%" 
                  @error="(e) => e.target.src=defaultImage" />
                </div>
                <span>{{ setTeamdata[1].players[defaultPos].name }}</span>
            </div>
          </div>
        </OtherContent>
      </template>

      <!-- 暂无数据 -->
      <DfEmpty v-else/>
    </div>
</template>

<script setup>
import { getTeamData } from '@/api/game'
import OtherContent from './other-content.vue'
import CsgoContent from './csgo-content.vue'
const props = defineProps({
    currentTab: {
    default: '',
    type: String
  },
  matchId: {
    default: '',
    type: String
  }
});

const game_id = inject('game_id');
// 王者荣耀
const isCsgo = computed(() => {
  return +game_id === 2;
});
// 阵容体系
const setTeamdata = ref([]);
const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
const currentSession = ref('');
const numSessionList = [
  { text: '全部', value: '' },
  { text: '近10场', value: '10' },
  { text: '近20场', value: '20' },
  { text: '近30场', value: '30' },
  { text: '近40场', value: '40' },
  { text: '近50场', value: '50' }
];

const defaultPos = ref(0);
const positionKingList = ['对抗', '打野', '中路', '发育', '游走'];
const positionDotaList = ['一号位', '二号位', '三号位', '四号位', '五号位'];
const positionLolList = ['上单', '打野', '中单', 'ADC', '辅助'];

// 获取比赛队伍阵容
const getTeamDataFun = async (val = '') => {
  try {
    const res = await getTeamData({
      game_id: +game_id,
      match_id: +props.matchId,
      match_num: !val ? '' : +val // 比赛场数
    });
    setTeamdata.value = res?.data;
  } catch(error) {
    setTeamdata.value = []
  }
};

const handleChnagePos = (index) => {
  defaultPos.value = index;
};


const handleCommand = (item) => {
    const value = item.value;
  if (value !== currentSession.value) {
    currentSession.value = value;
    getTeamDataFun(currentSession.value)
  }
};

watch(() =>props.currentTab, (val)=> {
    if (val === 'zrtx') {
        getTeamDataFun();
        defaultPos.value = 0
    }
})


// 选手位置信息
const postionList = computed(() => {
  if (+game_id === 3) {
    return positionKingList;
  } else if (+game_id === 4) {
    return positionDotaList;
  } else if (+game_id === 1) {
    return positionLolList;
  } else {
    return [];
  }
});

</script>

<style lang="scss" scoped>
.lineup-system {
  overflow: auto;
  height: 100%;
  .position-info {
      border-radius: 4px;
      font-size: 14px;
      justify-content: center;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      li {
        height: 32px;
        flex: 0 0 50px;
        text-align: center;
        cursor: pointer;
        span {
            display: inline-block;
            height: 100%;
        }
        &.isActived span {
            border-radius: 1px;
            border-bottom: 3px solid #d02d54;
        }
  }
  }

  .team-info {
      margin-top: 20px;
    //   全部下拉
      .session-select {
        cursor: pointer;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #999;
        width: 80px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        position: relative;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border-top: 6px solid #999;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          position: absolute;
          top: 50%;
          right: 4px;
          transform: translateY(-50%);
        }
      }
      .logo-pos {
         flex-direction: column;
         max-width: 120px;
         span { margin-bottom: 4px;}
      }
  }

  .member-attiver-info {
    margin:30px 0 20px;
    .member-info-right,.member-info-left {
      flex-direction: column;
      .member-pos {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        padding: 2px;
        border: 1px solid #d02d54;
        margin-bottom: 10px;
        img { border-radius: 50%; }
      }
    }
    .member-info-right .member-pos {
      border: 1px solid #025be8;
    }
  }
}
</style>