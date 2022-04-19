<template>
	<div class="tabs-container">
		<el-tabs
			v-model="activeName"
		>
			<el-tab-pane
				label="Статистические данные"
				name="statistics"
			>
				<StatisticsInfo />
			</el-tab-pane>

			<el-tab-pane
				label="История изменений"
				name="history"
			>
				<HistoryInfo />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import { ref } from 'vue'
import HistoryInfo from './HistoryInfoComponent.vue'
import StatisticsInfo from './StatisticsInfoComponent.vue'

export default {
	name: 'TabsInfo',
	components:{
		HistoryInfo,
		StatisticsInfo
	},
	setup() {
		const activeName = ref('statistics')

		return {
			activeName
		}
	}
}
</script>
<style lang="scss" scoped>
.tabs-container {
    flex-grow: 1;
    margin-left: theme-space(l);
}
</style>