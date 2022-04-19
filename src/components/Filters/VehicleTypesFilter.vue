<template>
	<el-checkbox-group v-model="filterValue">
		<el-checkbox 
			v-for="option in options"
			:key="option.id"
			:label="option.id"
		>
			{{ option.type }}
		</el-checkbox>
	</el-checkbox-group>
</template>

<script>
import { ref } from 'vue'

export default {
	props: {
		currentFilterValue: {
			type: Array,
			required: true
		},
		options: {
			type: Array,
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
.el-checkbox {
	margin-right: 0;
	width: 100%;
	padding: 10px 18px;
	border-radius: 8px;
	transition: all 160ms ease;

	:deep(.el-checkbox__label) {
		padding-left: 18px;
	}

	:deep(.el-checkbox__inner) {
		border-radius: 4px;
	}

	&:hover,
	&.is-checked {
		background: theme-color(gray-100);
	}

	&-group {
		display: flex;
		flex-direction: column;
		gap: theme-space(xs);
	}
}
</style>