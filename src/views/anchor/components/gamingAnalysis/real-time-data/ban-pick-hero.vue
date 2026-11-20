<template>
    <div v-if="homeBanPick && awayBanPick" class="ban-pick-hero">
      <div class="tema-logo-name flex">
        <el-popover placement="bottom" trigger="hover" :content="homeBanPick.name" effect="dark">
            <template #reference>
              <span class="left-name text-clamp">{{ homeBanPick.name }}</span>
            </template>
        </el-popover>
        <div class="middle-info">
          <div class="_logo">
            <img :src="homeBanPick.logo || defaultImage" alt="LOGO-LEFT" width="100%" height="100%" />
          </div>
          <!-- 时间和击杀数量 -->
          <div class="kills-time flex-center">
            <span class="score">{{ getFormatTime(getTime) }}</span>
            <span>
              <b>{{ homeBanPick.kills }} </b>
              <el-popover placement="bottom" trigger="hover" content="击杀" effect="dark">
                  <template #reference>
                  <img :src="`/static/images/live/game/jisha.png`" alt="" width="14" />
                  </template>s
              </el-popover>
              <b> {{ awayBanPick.kills }}</b>
            </span>
          </div>

          <div class="_logo right_logo">
            <img :src="awayBanPick.logo || defaultImage" alt="LOGO-LEFT" width="100%" height="100%" />
          </div>
        </div>
        <el-popover placement="bottom" trigger="hover" :content="awayBanPick.name" effect="dark">
          <template #reference>
            <span class="right-name text-clamp">{{ awayBanPick.name }}</span>
          </template>
        </el-popover>
      </div>
  
      <div class="only-flex">
        <!-- home队 -->
        <div class="home-hero">
          <!-- 被i禁英雄 -->
          <div class="ban-hero flex-start">
            <div v-for="(bans, index) in homeBanPick.ban" :key="index" class="defin-img-box">
              <img :src="bans.logo || defaultImage" :alt="index" height="100%" width="100%" />
            </div>
          </div>
          <!-- 被选英雄 -->
          <div class="pick-hero flex-start">
            <div v-for="(picks, index) in homeBanPick.pick" :key="index" class="defin-img-box">
              <img :src="picks.logo || defaultImage" :alt="index" width="100%" height="100%" />
            </div>
          </div>
          <!-- 战况 -->
          <div class="war-hero">
            <div v-for="item in homeWarSituationList" :key="item.id">
                <el-popover placement="bottom" trigger="hover" :content="item.label" effect="dark">
                   <template #reference>
                        <img :src="`/static/images/live/game/${item.id}.png`" alt="" width="100%" height="100%"/>
                   </template>
                </el-popover>
            </div>
          </div>
        </div>
  
        <div class="hero-middle">
          <div class="ban-middle"><img src="/static/images/live/game/ban.png" alt="ban" width="100%" /></div>
          <div class="bick-middle"><img src="/static/images/live/game/pick.png" alt="pick" width="100%" /></div>
        </div>
  
        <!-- away队 -->
        <div class="away-hero">
          <!-- 被i静英雄 -->
          <div class="ban-hero flex-start">
            <div v-for="(bans, index) in awayBanPick.ban" :key="index" class="defin-img-box">
              <img :src="bans.logo || defaultImage" :alt="index" height="100%" width="100%" />
            </div>
          </div>
          <!-- 被选英雄 -->
          <div class="pick-hero flex-start">
            <div v-for="(picks, index) in awayBanPick.pick" :key="index" class="defin-img-box">
              <img :src="picks.logo || defaultImage" :alt="index" height="100%" width="100%" />
            </div>
          </div>
          <!-- 战况 -->
          <div class="war-hero">
            <div v-for="item in awayWarSituationList" :key="item.id">
                <el-popover placement="bottom" trigger="hover" :content="item.label" effect="dark">
                   <template #reference>
                        <img :src="`/static/images/live/game/${item.id}.png`" alt="" width="100%" height="100%"/>
                   </template>
                </el-popover>
            </div>
          </div>
        </div>
      </div>
  
      <div class="hero-table">
        <div class="economy column-flex">
          <span>
            {{ isKing ? '暴君' : isDota ? '经济' : '大龙' }}
            <img :src="`/static/images/live/game/baojun.png`" alt="" width="14" v-if="isKing"/>
            <img :src="`/static/images/live/game/golds.png`" alt="" width="14" v-if="isDota"/>
            <img :src="`/static/images/live/game/big_dragon.png`" alt="" width="14" v-if="isLol" />
          </span>
          <b v-if="isKing">{{ homeBanPick.dragon_kills }} : {{ awayBanPick.dragon_kills }}</b>
          <b v-else-if="isDota">{{ homeBanPick.golds }} : {{ awayBanPick.golds }}</b>
          <b v-else>{{ homeBanPick.baron_kills }} : {{ awayBanPick.baron_kills }}</b>
        </div>
        <div class="experience column-flex">
          <span>
            {{ isKing ? '主宰' : isDota ? '经验' : '小龙' }}
            <img :src="`/static/images/live/game/zhuzai.png`" alt="" width="14" v-if="isKing"/>
            <img :src="`/static/images/live/game/golds.png`" alt="" width="14" v-if="isDota"/>
            <img :src="`/static/images/live/game/ssmall_dragon.png`" alt="" width="14" v-if="isLol"/>
          </span>
          <b v-if="isKing">{{ homeBanPick.baron_kills }} : {{ awayBanPick.baron_kills }}</b>
          <b v-else-if="isDota">{{ homeBanPick.exp }} : {{ awayBanPick.exp }}</b>
          <b v-else>{{ homeBanPick.dragon_kills }} : {{ awayBanPick.dragon_kills }} </b>
        </div>
        <div class="push-tower column-flex">
          <span>
            推塔
            <img :src="`/static/images/live/game/tower-number.png`" alt="" width="14" />
          </span>
          <b>{{ homeBanPick.tower_kills }} : {{ awayBanPick.tower_kills }}</b>
        </div>
        <div class="bar-rack column-flex">
          <template v-if="!isKing">
            <span>
              {{ isDota ? '兵营' : '水晶' }}
              <img :src="`/static/images/live/game/soldier.png`" alt="" width="14" v-if="isDota" />
              <img :src="`/static/images/live/game/water_golds.png`" alt="" width="14" v-if="isLol" />
            </span>
            <b>{{ homeBanPick.barrack_kills }} : {{ awayBanPick.barrack_kills }}</b>
          </template>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { getFormatTime } from '@/utils/crypto.ts';
const props = defineProps({
  defTeams: {
    type: Array,
    default: () => []
  },
  getTime: {
    type: Number,
    default: 0
  }
});

const game_id = inject('game_id');
// 王者荣耀
const isKing = computed(() => {
  return +game_id === 3;
});
const isDota = computed(() => {
  return +game_id === 4;
});
const isLol = computed(() => {
  return +game_id === 1;
});

const homeBanPick = computed(() => {
  // 红
  return props.defTeams.length ? props.defTeams.filter((ele) => ele.side === 1)[0] : null;
});

const awayBanPick = computed(() => {
  // 蓝
  return props.defTeams.length ? props.defTeams.filter((ele) => ele.side === 2)[0] : null;
});

const list = [
  { label: '一血', id: 'first_blood' },
  { label: '一塔', id: 'first_towers' },
  { label: '五杀', id: 'five_kills' },
  { label: '十杀', id: 'ten_kills' },
  { label: '首大龙', id: 'first_baron' },
  { label: '首小龙', id: 'first_drakes', type:4 }
];

const homeWarSituationList = computed(() => {
  return list.filter((item) => homeBanPick.value[item.id] > 0) || [];
});
const awayWarSituationList = computed(() => {
  return list.filter((item) => awayBanPick.value[item.id] > 0) || [];
});

const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'
</script>

<style scoped lang="scss">
  .el-popover.el-popper {
    min-width: 50px;
    padding: 5px;
    line-height: 1;
    width: auto!important;
  }
</style>
  
  <style scoped lang="scss">    
  .ban-pick-hero {
    font-size: 14px;
    margin-top:20px;
    .kills-time {
      font-size: 14px;
      flex-direction: column;
    }
    .tema-logo-name {
        justify-content: center;
      .middle-info {
        display: flex;
        align-items: center;
        padding: 0 5px;
        ._logo {
          width: 48px;
          height: 48px;
          overflow: hidden;
          border-radius: 50%;
          padding: 4px;
          border: 1px solid #d02d54;
          &.right_logo {
            border: 1px solid #025be8;
          }
          img {
            border-radius: 50%;
          }
        }
        span {
          margin: 0 5px;
          &.score {
            color: #999;
            margin-bottom: 4px;
          }
        }
      }
      .left-name,
      .right-name {
        font-weight: 550;
        flex:1;
      }
      .left-name {
        text-align: right;
      }
    }
    .only-flex {
        margin-top:18px;
      display: flex;
    }
    .away-hero {
      .ban-hero div:first-child,
      .pick-hero div:first-child {
        margin-left: auto;
      }
    }
    .home-hero,
    .away-hero {
      width: calc(100% / 2 - 24px);
      .defin-img-box {
        width: 32px;
        height: 32px;
        margin-right: 4px;
        flex: 0 0 32px;
      }
      .flex-start {
        display: flex;
        align-items: center;
      }
      .pick-hero {
        margin: 4px 0;
      }
      .ban-hero {
        opacity: 0.5;
        filter: grayscale(100%);
      }
      .ban-hero,
      .pick-hero {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }
      .war-hero {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        cursor: pointer;
        div {
            width: 24px;
            margin-right: 5px;
        }
      }
    }
    .away-hero .war-hero {
        justify-content: flex-end;
    }
  
    .hero-middle {
      width: 30px;
      margin: 0 6px;
      text-align: center;
      div {
        width: 28px;
        &.ban-middle {
            margin-bottom: 5px;
          color: #1b0e0e;
        }
      }
    }
  
    .hero-table {
      border: 1px solid #999;
      height: 90px;
      display: grid;
      margin-top: 18px;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      div {
        box-sizing: border-box;
        &.economy,
        &.experience {
          border-bottom: 1px solid #999;
        }
        &.economy,
        &.push-tower {
          border-right: 1px solid #999;
        }
      }
      .column-flex {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 14px;
        span {
          display: flex;
          align-items: center;
          color: #999;
        }
      }
    }
  }
  </style>
  