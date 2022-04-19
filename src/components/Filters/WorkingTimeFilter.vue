<template>
	<div class="working-time-filter">
		<el-input 
			v-model="fromTime"
			v-maska="'##:##'"
			size="large"
			placeholder="00:00"
		>
			<template #prefix>
				от
			</template>
		</el-input>
		
		<span class="working-time-filter__separator">
			-
		</span>

		<el-input 
			v-model="toTime"
			v-maska="'##:##'"
			size="large"
			placeholder="00:00"
		>
			<template #prefix>
				до
			</template>
		</el-input>
	</div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
	props: {
		currentFilterValue: {
			type: Array,
			required: true
		}
	},
	setup(props) {
		const fromTime = ref(props.currentFilterValue[0])
		const toTime = ref(props.currentFilterValue[1])

		const filterValue = computed(() => {
			return [fromTime.value, toTime.value]
		})

		return {
			toTime,
			fromTime,
			filterValue
		}
	}
}
</script>

<style lang="scss" scoped>
.working-time-filter {
	display: flex;
	padding: 0 18px;
	gap: theme-space(xs);
	align-items: center;

	&__separator {
		font-size: 16px;
		font-weight: 500;
	}
}
</style>