<template>
	<el-radio-group v-model="filterValue">
		<el-radio :label="true">
			Активен
		</el-radio>

		<el-radio :label="false">
			Неактивен
		</el-radio>
	</el-radio-group>
</template>

<script>
import { ref } from 'vue'

export default {
	props: {
		currentFilterValue: {
			type: [Boolean, null],
			required: true
		}
	},
	setup(props) {
		const filterValue = ref(props.currentFilterValue)

		return {
			filterValue
		}
	}
}
</script>

<style lang="scss" scoped>
.el-radio {
	margin-right: 0;
	padding: 10px 18px;
	border-radius: 8px;
	transition: all 160ms ease;

	&:hover,
	&.is-checked {
		background: theme-color(gray-100);
	}

	:deep(.el-radio__label) {
		padding-left: 18px;
	}

	&-group {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: theme-space(xs);
	}
}
</style>