<template>
  <div class="score-page">
    <Error v-if="isError" />

    <template v-else>
  <div class="score-content">
    <p class="score-content__title">当前积分</p>
    <p class="score-content__value">{{ formatThousandsIntl(totalCreditInfo) || 0 }}</p>

    <div class="score-icons">
      积分组成：
      <div class="item">
        <img class="icon" src="/static/images/spaceAndMine/gold.png" alt="" />
        <span>x 1</span>
      </div>
      +
      <div class="item">
        <img class="icon" src="/static/images/spaceAndMine/pen.png" alt="" />
        <span>x 1</span>
      </div>
      +
      <div class="item">
        <img class="icon" src="/static/images/spaceAndMine/heart.png" alt="" />
        <span>x 1</span>
      </div>
      +
      <div class="item">
        <img class="icon" src="/static/images/spaceAndMine/star.png" alt="" />
        <span>x 3</span>
      </div>
    </div>
  </div>
  <div class="score-list" v-if="scoreList.length > 0">
    <div class="score-item" v-for="item in scoreList" :key="item" @click="viewMedal(item)">
      <div class="item_title">
        <p>{{ item.operation_text }}</p>
        <p class="gold">
          <span v-for="credit in genCreditInfo(item)" :key="credit.extcreditsName">
            {{ Number(credit.extcredits) > 0 ? '+' : '' }} {{ credit.extcredits }}
            {{ credit.extcreditsName }}
          </span>
        </p>
      </div>

      <div class="time">
        <p>{{ formatDateLine(item.dateline, 'YYYY-MM-DD') }}</p>
        <p>{{ formatDateLine(item.dateline, 'HH:mm:ss') }}</p>
      </div>
    </div>
  </div>
    </template>
  </div>
</template>

<script setup>
import { getMemberCreditkApi } from '@/api'
import Error from '../component/Error.vue'
import { formatDateLine, formatThousandsIntl } from '@/utils/common'

const genCreditInfo = (item) => {
  const extcredits = []
  for (const key in item) {
    if (key.includes('extcredits')) {
      if (!isNaN(item[key]) && item[key] && item[key] !== 0) {
        const obj = {}
        obj.extcredits = item[key]
        obj.extcreditsName = item[`${key}_text`]
        extcredits.push(obj)
      }
    }
  }

  return extcredits
}

const totalCreditInfo = ref()
const scoreList = ref([])
const isError = ref(false)

const getMemberMedals = async () => {
  try {
    const res = await getMemberCreditkApi({
      page: 1,
      pageSize: 100
    })
    scoreList.value = res.data.list
    totalCreditInfo.value = res.data.info.credit_number
    isError.value = false
  } catch (error) {
    console.error(error)
    scoreList.value = []
    totalCreditInfo.value = undefined
    isError.value = true
  }
}

onMounted(() => {
  getMemberMedals()
})
</script>
<style scoped lang="scss">
.score-page {
  width: 100%;
  min-height: calc(100% - 180px);
}

.score-content {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;

  &__title {
    line-height: 24px;
    color: #666;
    margin-bottom: 16px;
  }

  &__value {
    font-size: 30px;
    font-weight: bold;
    color: #333;
    line-height: 42px;
  }

  .score-icons {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px;
    margin-top: 16px;
    border-radius: 8px;
    border: 1px solid #e6e7eb;

    .item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 4px;
      border-radius: 4px;
      background: #fff;

      img.icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}

.score-list {
  height: 500px;
  margin-top: 8px;
  overflow-y: scroll;

  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    padding: 8px 16px;
    overflow: hidden;

    &:last-child {
      border-bottom: 0;
    }

    .item_title {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      font-size: 16px;
      color: #666;
      line-height: 22px;

      .gold {
        font-size: 18px;
        font-weight: bold;
        color: #d02d54;
        line-height: 25px;
      }
    }

    .time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: right;
      font-size: 14px;
      color: #666;
      line-height: 20px;
    }
  }
}
</style>
