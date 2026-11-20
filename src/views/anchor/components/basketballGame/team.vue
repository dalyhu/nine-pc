<template>
  <div class="basketball_match_statistics">
    <div class="table_box" v-if="dataBase.away && dataBase.away.length > 1">
      <el-table :data="dataBase.home" :header-cell-class-name="headerCellClass">
        <el-table-column fixed width="150">
          <template #header>
            <div class="header_logo">
              <img class="title_item_logo" :src="gameData.home_team_data.logo" />
              <span>号码/球员</span>
            </div>
          </template>
          <template #default="{ row }">
            <div class="row_item">
              <p>{{ row.shirt_number }}</p>
              <span>{{ row.home }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="首发">
          <template #default="{ row }">
            <span>
              {{
                row.is_substitute === '-'
                  ? row.is_substitute
                  : row.is_substitute == 0
                  ? '首发'
                  : '替补'
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="时间" prop="presence_time">
        </el-table-column>
        <el-table-column width="48" align="center" label="得分" prop="score"> </el-table-column>
        <el-table-column width="48" align="center" label="篮板" prop="total_rebounds">
        </el-table-column>
        <el-table-column width="48" align="center" label="助攻" prop="assists"> </el-table-column>
        <el-table-column width="48" align="center" label="投篮">
          <template #default="{ row }">
            <span> {{ row.hits }}/{{ row.shots }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="三分">
          <template #default="{ row }">
            <span> {{ row.three_pointer }}/{{ row.three_pointer_shot }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="罚球">
          <template #default="{ row }">
            <span> {{ row.free_throw }}/{{ row.free_throw_shots }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="抢断" prop="steals"> </el-table-column>
        <el-table-column width="48" align="center" label="盖帽" prop="blocks"> </el-table-column>
        <el-table-column width="48" align="center" label="失误" prop="number_of_mistakes">
        </el-table-column>
        <el-table-column width="48" align="center" label="犯规" prop="individual_fouls">
        </el-table-column>
      </el-table>

      <el-table :data="dataBase.away" :header-cell-class-name="headerCellClass">
        <el-table-column fixed width="150">
          <template #header>
            <div class="header_logo">
              <img class="title_item_logo" :src="gameData.away_team_data.logo" />
              <span>号码/球员</span>
            </div>
          </template>
          <template #default="{ row }">
            <div class="row_item">
              <p>{{ row.shirt_number }}</p>
              <span>{{ row.home }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="首发">
          <template #default="{ row }">
            <span>
              {{
                row.is_substitute === '-'
                  ? row.is_substitute
                  : row.is_substitute == 0
                  ? '首发'
                  : '替补'
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="时间" prop="presence_time">
        </el-table-column>
        <el-table-column width="48" align="center" label="得分" prop="score"> </el-table-column>
        <el-table-column width="48" align="center" label="篮板" prop="total_rebounds">
        </el-table-column>
        <el-table-column width="48" align="center" label="助攻" prop="assists"> </el-table-column>
        <el-table-column width="48" align="center" label="投篮">
          <template #default="{ row }">
            <span> {{ row.hits }}/{{ row.shots }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="三分">
          <template #default="{ row }">
            <span> {{ row.three_pointer }}/{{ row.three_pointer_shot }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="罚球">
          <template #default="{ row }">
            <span> {{ row.free_throw }}/{{ row.free_throw_shots }} </span>
          </template>
        </el-table-column>
        <el-table-column width="48" align="center" label="抢断" prop="steals"> </el-table-column>
        <el-table-column width="48" align="center" label="盖帽" prop="blocks"> </el-table-column>
        <el-table-column width="48" align="center" label="失误" prop="number_of_mistakes">
        </el-table-column>
        <el-table-column width="48" align="center" label="犯规" prop="individual_fouls">
        </el-table-column>
      </el-table>
    </div>

    <DfEmpty v-else />
  </div>
</template>

<script setup name="team" lang="ts">
import { useStore } from 'vuex'
import { playerData } from '@/api/basketball.js'
import { isEmpty, has } from 'lodash-es'

const store = useStore()

const gameData = computed(() => store.state.gameInfo)

const dataBase = ref({
  away: [],
  home: []
})

const headerCellClass = () => {
  return 'cell-class-name'
}

const initPlayerData = () => {
  if (gameData.value.id) {
    playerData({ id: gameData.value.id }).then((res) => {
      const { data = {} } = res
      if (isEmpty(data)) return
      if (has(data, 'home') && has(data, 'away')) {
        dataBase.value = {
          home: [
            ...data.home,
            { ...data.home_sum, home: '总计', is_substitute: '-', presence_time: '-' }
          ],
          away: [
            ...data.away,
            { ...data.away_sum, home: '总计', is_substitute: '-', presence_time: '-' }
          ]
        }
      }
    })
  }
}

onMounted(initPlayerData)
</script>

<style lang="scss">
.basketball_match_statistics {
  width: 100%;
  .table_box {
    width: 100%;
    .el-table {
      .el-table__cell {
        border-bottom: 1px solid transparent;
      }
      .cell {
        padding: 0;
        .row_item {
          display: flex;
          p {
            width: 38px;
            text-align: center;
          }
        }
        .header_logo {
          .title_item_logo {
            width: 30px;
            height: 30px;
            border-radius: 100%;
            border: 1px solid #dcdcdc;
            margin-right: 10px;
            margin-left: 10px;
          }
        }
      }
      .cell-class-name {
        background-color: var(--el-table-background-color);
      }
    }
  }
}
</style>
