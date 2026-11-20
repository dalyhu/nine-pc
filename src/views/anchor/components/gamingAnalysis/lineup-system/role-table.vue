<template>
    <div class="role-table" v-if="isDota || isLol">
        <!-- 王者 英雄联盟 -->
        <div class="role-table-box" v-for="item in setTeamdata" :key="item.team_id">
            <div class="title">
                <b class="awaly-hero">常用英雄</b>
                <img :src="item.logo || defaultImage" alt="" width="20px" />
                <span class="hero-name">{{ item.name }}</span>
            </div>
            <el-table :data="item.roles" fit style="width: 100%" height="260px" border>
                <el-table-column prop="" label="排名" type="index" resizable width="60px" align="center"></el-table-column>
                <el-table-column prop="" label="英雄" width="106" resizable show-overflow-tooltip>
                    <template #default="{ row }" >
                        <div class="team-player">
                            <img :src="row.logo || defaultImage" alt="" width="32px" />
                            <span class="text-clamp">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="pick_count" label="出场次数" resizable sortable />
                <el-table-column prop="win_rate" label="胜率" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row.win_rate * 100).toFixed(1) + '%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="first_blood_rate" label="一血率" resizable sortable >
                    <template #default="{ row }" >
                       {{ (row.first_blood_rate * 100).toFixed(1) + '%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="first_turret_rate" label="一塔率" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row.first_turret_rate * 100).toFixed(1) + '%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="first_five_kill_rate" label="五杀率" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row.first_five_kill_rate * 100).toFixed(1) + '%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="first_ten_kill_rate" label="十杀率" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row.first_ten_kill_rate * 100).toFixed(1) + '%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="duration_avg" label="场均时长" resizable sortable>
                    <template #default="{ row }" >
                       {{ getFormatTime(row?.duration_avg.toFixed(0)) }}
                    </template>
                </el-table-column>
                <el-table-column prop="kill_avg" label="场均击杀" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row?.kill_avg).toFixed(1) }}
                    </template>
                </el-table-column>
                <el-table-column prop="assist_avg" label="场均助攻" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row?.assist_avg).toFixed(1) }}
                    </template>
                </el-table-column>
                <el-table-column prop="death_avg" label="场均死亡" resizable sortable>
                    <template #default="{ row }" >
                       {{ (row?.death_avg).toFixed(1) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
 import { getFormatTime } from '@/utils/crypto.ts';
defineProps({
    setTeamdata: {
        type: Array,
        default: () => []
    }
});

const game_id = inject('game_id');
const isDota = computed(() => {
    return +game_id === 4;
});
const isLol = computed(() => {
    return +game_id === 1;
});

const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'

</script>
  
<style lang="scss" scoped>
.role-table {
    margin-top:28px;
    .el-table {
        margin-bottom: 20px;
    }
    .role-table-box .title {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .awaly-hero {
            margin-right: 15px;
            padding-left: 8px;
            position: relative;
            &::before {
                content: '';
                display: block;
                width:4px;
                height: 18px;
                background: #d02d54;
                position: absolute;
                left: 0;
                top:50%;
                transform: translateY(-50%);
            }
        }
        .hero-name {
            margin-left: 8px;
        }
    }
    .team-player {
        display:flex;
        align-items: end;
        span {
            width: 78px;
            margin-left: 5px;
        }
    }
}
</style>
  