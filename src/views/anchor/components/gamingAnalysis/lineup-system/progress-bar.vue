<template>
    <div class="progress-bar">
      <template v-if="isDota">
        <div v-for="item in dotaList" :key="item.name">
          <div class="up-text flex">
            <span
              >{{ item.num1 ? item.num1.toFixed(2) : 0 }}
              <i v-if="item.type">%</i>
              <div v-if="item.avgL" class="avg-red">{{ item.avgL }}</div>
            </span>
            <span class="_name">{{ item.name }}</span>
            <span style="text-align: right;">
                {{ item.num2 ? item.num2.toFixed(2) : 0 }}
                <i v-if="item.type">%</i>
                <div v-if="item.avgR" class="avg-red">{{ item.avgR }}</div>
            </span>
          </div>
          <div class="down-bar">
            <div class="red-bar" :style="{ width: isLeftWidth(item) }"></div>
            <div class="blue-bar" :style="{ width: isRIghtWidth(item) }"></div>
          </div>
        </div>
      </template>
  
      <template v-if="isKing">
        <div v-for="item in kingList" :key="item.name">
          <div class="up-text flex">
            <span
              >{{ item.num1 ? item.num1.toFixed(2) : 0 }}
              <span v-if="item.type">%</span>
              <span class="no-red">全队NO.{{ item.noL }}</span>
            </span>
            <span class="_name">{{ item.name }}</span>
            <span>
              <span class="no-blue">全队NO.{{ item.noR }}</span>
              {{ item.num2.toFixed(2) }}
              <span v-if="item.type">%</span>
            </span>
          </div>
          <div class="down-bar">
            <div class="red-bar" :style="{ width: isLeftWidth(item) }"></div>
            <div class="blue-bar" :style="{ width: isRIghtWidth(item) }"></div>
          </div>
        </div>
      </template>
  
      <template v-if="isLol">
        <div v-for="item in lolList" :key="item.name">
          <div class="up-text flex">
            <span
              >{{ item.num1 ? item.num1.toFixed(2) : 0 }}
              <span v-if="item.type">%</span>
              <span v-if="item.avgL" class="avg-red">{{ item.avgL }}</span>
            </span>
            <span class="_name">{{ item.name }}</span>
            <span style="text-align: right;">
              {{ item.num2 ? item.num2.toFixed(2) : 0 }}
              <span v-if="item.type">%</span>
              <span v-if="item.avgR" class="avg-red">{{ item.avgR }}</span>
            </span>
          </div>
          <div class="down-bar">
            <div class="red-bar" :style="{ width: isLeftWidth(item) }"></div>
            <div class="blue-bar" :style="{ width: isRIghtWidth(item) }"></div>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    leftPlayer: {
      type: Object,
      default: () => ({})
    },
    rightPlayer: {
      type: Object,
      default: () => ({})
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
  
  const dotaList = computed(() => {
    const homeTeam = props.leftPlayer;
    const awayTeam = props.rightPlayer;
    return [
      {
        name: 'KDA',
        num1: homeTeam.kda_avg,
        num2: awayTeam.kda_avg,
        avgL: `${homeTeam.kill_avg?.toFixed(2) || 0}/${homeTeam.death_avg?.toFixed(2) || 0}/${homeTeam.assist_avg?.toFixed(2) || 0}`,
        avgR: `${awayTeam.kill_avg?.toFixed(2) || 0}/${awayTeam.death_avg?.toFixed(2) || 0}/${awayTeam.assist_avg?.toFixed(2) || 0}`
      },
      { name: '参战率', num1: homeTeam.kill_participation_avg * 100, num2: awayTeam.kill_participation_avg * 100, type: true },
      { name: 'GPM', num1: homeTeam.gold_per_min, num2: awayTeam.gold_per_min },
      { name: 'XPM', num1: homeTeam.exp_per_min, num2: awayTeam.exp_per_min },
      { name: '场均伤害', num1: homeTeam.damage_avg, num2: awayTeam.damage_avg }
    ];
  });
  
  const kingList = computed(() => {
    const homeTeam = props.leftPlayer;
    const awayTeam = props.rightPlayer;
    return [
      { name: 'KDA', num1: homeTeam.kda_avg, num2: awayTeam.kda_avg, noL: homeTeam.NOA, noR: awayTeam.NOA },
      { name: '经济', num1: homeTeam.gold_per_min * 100, num2: awayTeam.gold_per_min * 100, noL: homeTeam.NOB, noR: awayTeam.NOB },
      { name: '输出伤害', num1: homeTeam.damage_per_min, num2: awayTeam.damage_per_min, noL: homeTeam.NOC, noR: awayTeam.NOC },
      {
        name: '输出上海占比',
        type: true,
        noL: homeTeam.NOC,
        noR: awayTeam.NOC,
        num1: (homeTeam.damage_per_min / homeTeam.damage_avg) * 100,
        num2: (awayTeam.damage_per_min / awayTeam.damage_avg) * 100
      },
      { name: '承受伤害', num1: homeTeam.damage_taken_per_min, num2: awayTeam.damage_taken_per_min, noL: homeTeam.NOD, noR: awayTeam.NOD },
      {
        name: '承受伤害占比',
        type: true,
        noL: homeTeam.NOD,
        noR: awayTeam.NOD,
        num1: (homeTeam.damage_taken_per_min / homeTeam.damage_taken_avg) * 100,
        num2: (awayTeam.damage_taken_per_min / awayTeam.damage_taken_avg) * 100
      },
      { name: '参团率', num1: homeTeam.kill_participation_avg, num2: awayTeam.kill_participation_avg, type: true, noL: homeTeam.NOE, noR: awayTeam.NOE }
    ];
  });
  
  const lolList = computed(() => {
    const homeTeam = props.leftPlayer;
    const awayTeam = props.rightPlayer;
    return [
      {
        name: 'KDA',
        num1: homeTeam.kda_avg,
        num2: awayTeam.kda_avg,
        avgL: `${homeTeam.kill_avg?.toFixed(2) || 0}/${homeTeam.death_avg?.toFixed(2) || 0}/${homeTeam.assist_avg?.toFixed(2) || 0}`,
        avgR: `${awayTeam.kill_avg?.toFixed(2) || 0}/${awayTeam.death_avg?.toFixed(2) || 0}/${awayTeam.assist_avg?.toFixed(2) || 0}`
      },
      { name: '参团率', num1: homeTeam.kill_participation_avg * 100, num2: awayTeam.kill_participation_avg * 100, type: true },
      { name: '分均承伤', num1: homeTeam.damage_taken_per_min, num2: awayTeam.damage_taken_per_min },
      { name: '分均伤害', num1: homeTeam.damage_per_min, num2: awayTeam.damage_per_min },
      { name: '分均经济', num1: homeTeam.gold_per_min, num2: awayTeam.gold_per_min }
    ];
  });
  
  const isLeftWidth = (item) => {
    if (+item.num1 !== 0) {
      return (item.num1 / (+item.num1 + +item.num2)) * 100 + '%';
    }
    return '0px';
  };
  const isRIghtWidth = (item) => {
    if (+item.num2 !== 0) {
      return (item.num2 / (+item.num1 + +item.num2)) * 100 + '%';
    }
    return '0px';
  };
  </script>
  
  <style scoped lang="scss">
  .progress-bar {
    flex: 1;
    padding-bottom: 20px;
    .avg-red {
      color: #999;
    }
    .up-text {
      margin: 6px 0;
      font-size: 12px;
      ._name {
        color: #999;
      }
    }
    .no-red {
      color: #d02d54;
      padding-left: 12px;
    }
    .no-blue {
      color: #025be8;
      padding-right: 12px;
    }
    .down-bar {
      position: relative;
      height: 6px;
      background: #ccc;
      border-radius: 40px;
      .red-bar {
        position: absolute;
        left: 0;
        height: 100%;
        border-radius: 40px 0 0 40px;
        background: #d02d54;
      }
      .blue-bar {
        position: absolute;
        right: 0;
        height: 100%;
        border-radius: 0 40px 40px 0;
        background: #025be8;
      }
    }
  }
  </style>
  