<template>
    <div class="line-chart" v-if="goldDiffList && goldDiffList.length">
      <v-chart :option="chartOptions" autoresize style="width: 100%; height: 300px"></v-chart>
    </div>
  </template>
  <script setup>
  import { getFormatTime } from '@/utils/crypto.ts';
  const props = defineProps({
    goldDiffList: {
      type: Array,
      default: () => []
    }
  });
  
  const dataTime = computed(() => {
    if (props.goldDiffList.length) {
      const list = props.goldDiffList.map((ele) => getFormatTime(ele.time));
      return list;
    }
    return [];
  });
  
  const dataGap = computed(() => {
    if (props.goldDiffList.length) {
      const list = props.goldDiffList.map((ele) => ele.gap);
      return list;
    }
    return [];
  });
  
  const dataExpDiff = computed(() => {
    if (props.goldDiffList.length) {
      const list = props.goldDiffList.map((ele) => ele.exp_diff);
      return list;
    }
    return [];
  });
  
  // const game_id = inject('game_id');
  
  // 王者没有图表
  // const isKing = computed(() => {
  //   return +game_id === 3;
  // });
  
  const chartOptions = ref({
    title: {
      text: ''
    },
    color: ['#d02d54', '#025be8'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      top: '30',
      icon: 'rect',
      itemHeight: '1',
      data: ['经济差', '经验差']
    },
    grid: {
      bottom: '30px',
      left: '50px',
      right: 0
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 紧贴坐标边界
      data: dataTime,
      axisLine: {
        show: true, // 显示轴线
        lineStyle: {
          color: '#999' // 轴线颜色
        }
      },
      // splitLine: { 网格线
      //   show: true,
      //   lineStyle: {
      //     color: ['#000'],
      //   }
      // },
      axisTick: {
        alignWithLabel: true // 对其刻度
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true, // 显示轴线
        lineStyle: {
          color: '#999' // 轴线颜色
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#999']
        }
      }
    },
    series: [
      {
        name: '经济差',
        type: 'line',
        symbol: 'none',
        smooth: true, // 平滑曲线
        data: dataGap,
        lineStyle: {
          // 折现颜色
          color: '#d02d54'
        }
      },
      {
        name: '经验差',
        type: 'line',
        symbol: 'none',
        smooth: true, // 平滑曲线
        data: dataExpDiff,
        lineStyle: {
          // 折现颜色
          color: '#025be8'
        }
      }
    ]
  });
  </script>
  
  <style lang="scss" scoped>
  .line-chart {
    margin-bottom: 18px;
  }
  </style>
  