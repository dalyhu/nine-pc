<template>
    <div class="equipment">
        <!-- 王者 英雄联盟 -->
        <div class="equ-box" v-for="item in defTeams" :key="item.team_id">
            <el-table :data="item.players" fit style="width: 100%" border>
                <el-table-column prop="" label="" width="130" show-overflow-tooltip>
                    <template #header>
                        <el-popover placement="bottom" trigger="hover" :content="item.name" effect="dark">
                            <template #reference>
                                <div class="flex-start team-name-title">
                                    <img :src="item.logo || defaultImage" alt="" width="39px" />
                                    <span class="text-clamp" style="width: 90px">{{ item.name }}</span>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                    <template #default="{ row }" >
                        <!-- 王者 -->
                        <div class="team-player">
                            <img :src="row.logo || defaultImage" alt="" width="39px" />
                            <span class="text-clamp">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                 <!-- lol天赋 -->
                <el-table-column v-if="isLol" prop="" label="天赋" resizable >
                    <template #default="{ row }">
                       <span v-for="(m,id) in row.skills" :key="id" class="sub-logo"><img :src="m.logo || defaultImage" alt="" width="22px" /></span>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="等级" resizable />
                <el-table-column prop="" label="K/D/A" resizable>
                    <template #default="{ row }">
                       <span>{{ row.kills }}/</span>
                       <span>{{ row.deaths }}/</span>
                       <span>{{ row.assists }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="gold_earned" label="经济" resizable></el-table-column>
                <el-table-column v-if="isDota" prop="gold_per_min" label="GPM" resizable></el-table-column>
                <el-table-column v-if="isDota" prop="xp_per_min" label="XPM" resizable></el-table-column>
                <el-table-column v-if="isLol || isKing" prop="damage" label="输出" resizable></el-table-column>
                <el-table-column v-if="isLol || isKing" prop="damage_taken" label="承伤" resizable></el-table-column>
                <el-table-column prop="equipments" label="出装" min-width="160" resizable>
                    <template #default="{ row }">
                       <span v-for="(sub,id) in row.equipments" :key="id" class="sub-logo"><img :src="sub.logo || defaultImage" alt="" width="22px" /></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
defineProps({
    defTeams: {
        type: Array,
        default: () => []
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

const defaultImage = '/static/images/theme/personalCenter/default_avatar.png'

</script>
  
<style lang="scss" scoped>
.equipment {
    margin-top: 10px;
}
.equ-box {
    margin-bottom:15px;
    .team-player,.team-name-title {
        display: flex;
        align-items: end;
        span {
            width: 90px;
            margin-left: 5px;
        }
    }
    .sub-logo {
        margin-right:2px;
    }
}
</style>
  