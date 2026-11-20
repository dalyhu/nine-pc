<template>
    <div class="empty"></div>
  
    <div class="total-num flex">
      <div v-for="(item, index) in [...new Set(homeimgList)]" :key="index">
        <img :src="item" alt="" width="18px" />
        <div>{{ totalFristTeamNum[index + 1] }}</div>
      </div>
      <div v-for="(item, index) in [...new Set(awayimgList)]" :key="index">
        <img :src="item" alt="" width="18px" />
        <div>{{ totalSecondTeamNum[index + 1] }}</div>
      </div>
    </div>
  
    <SmallTitle title="上半场"></SmallTitle>
    <table class="down-table">
      <tbody>
        <tr class="haader">
          <td class="down-title sticky-column"><span>场次</span></td>
          <td v-for="(item, index) in homeList.up_win" :key="index" class="down-title">{{ index + 1 }}</td>
        </tr>
        <!-- 横向第一排 -->
        <tr class="body haader">
          <td class="down-title sticky-column">
            <img :src="homeList.logo" alt="" width="28px" />
          </td>
          <td v-for="(up, id) in homeList.up_win" :key="id" class="down-title">
            <img v-if="up > 0" :src="homeimgList[up - 1]" alt="" width="18px" />
          </td>
        </tr>
        <!-- 横向第2排 -->
        <tr class="body haader">
          <td class="down-title sticky-column">
            <img :src="awayList.logo" alt="" width="28px" />
          </td>
          <td v-for="(up, id) in awayList.up_win" :key="id" class="down-title">
            <img v-if="up > 0" :src="awayimgList[up - 1]" alt="" width="18px" />
          </td>
        </tr>
      </tbody>
    </table>
    <SmallTitle title="下半场"></SmallTitle>
    <table class="down-table">
      <tbody>
        <tr class="haader">
          <td class="down-title sticky-column"><span>场次</span></td>
          <td v-for="(item, index) in homeList.down_win" :key="index" class="down-title">{{ index + 1 }}</td>
        </tr>
        <!-- 横向第一排 -->
        <tr class="body haader">
          <td class="down-title sticky-column">
            <img :src="homeList.logo" alt="" width="28px" />
          </td>
          <td v-for="(up, id) in homeList.down_win" :key="id" class="down-title">
            <img v-if="up > 0" :src="homeimgList[up - 1]" alt="" width="18px" />
          </td>
        </tr>
        <!-- 横向第2排 -->
        <tr class="body haader">
          <td class="down-title sticky-column">
            <img :src="awayList.logo" alt="" width="28px" />
          </td>
          <td v-for="(up, id) in awayList.down_win" :key="id" class="down-title">
            <img v-if="up > 0" :src="awayimgList[up - 1]" alt="" width="18px" />
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import SmallTitle from '../small-title.vue';
  const props = defineProps({
    defTeams: {
      type: Array,
      default: () => []
    }
  });
  
  const homeList = computed(() => {
    return props.defTeams.length && props.defTeams[0];
  });
  
  const awayList = computed(() => {
    return props.defTeams.length && props.defTeams[1];
  });
  
  const totalFristTeamNum = computed(() => {
    const upHome = homeList.value.up_win.map((ele) => ele);
    const upAway = homeList.value.down_win.map((ele) => ele);
    const list = [...upHome, ...upAway];
    return calcCountFun(list);
  });
  
  const totalSecondTeamNum = computed(() => {
    const upHome = awayList.value.up_win.map((ele) => ele);
    const upAway = awayList.value.down_win.map((ele) => ele);
    const list = [...upHome, ...upAway];
    return calcCountFun(list);
  });
  
  const calcCountFun = (list) => {
    const count = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (let i = 0; i < list.length; i++) {
      const num = list[i];
      if (num >= 0 && num <= 5) {
        count[num]++;
      }
    }
    return {
      1: count[1] + count[2],
      2: count[3],
      3: count[4],
      4: count[5]
    };
  };
  
  const homeimgList = [
    '/static/images/live/game/home_1.png',
    '/static/images/live/game/home_1.png',
    '/static/images/live/game/home_3.png',
    '/static/images/live/game/home_4.png',
    '/static/images/live/game/home_5.png'
  ];
  const awayimgList = [
    '/static/images/live/game/away_1.png',
    '/static/images/live/game/away_1.png',
    '/static/images/live/game/away_3.png',
    '/static/images/live/game/away_4.png',
    '/static/images/live/game/away_5.png'
  ];
  </script>
  <style lang="scss" scoped>
  .empty {
    height: 32px;
    width: 100%;
    background: #f5f5f5;
  }
  .total-num {
    padding-top: 8px;
    div {
      text-align: center;
    }
  }
  .down-table {
    margin-top: 8px;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    overflow-x: auto;
    overflow-y: hidden;
    display: block;
    white-space: nowrap;
    .haader {
      display: flex;
      background: #f5f5f5;
      &.body {
        background: #ffff;
        .sticky-column {
          background: #ffff !important;
        }
      }
    }
    .down-title {
      width: 31px;
      padding: 6px 0;
      text-align: center;
      white-space: nowrap;
      &.sticky-column {
        background: #f5f5f5;
        width: 40px;
        position: sticky;
        left: -1px;
        z-index: 1;
      }
    }
  
    .body {
      display: flex;
    }
  }
  </style>
  