<template>
	<div class="sort">
		<el-select
			v-model="activeSortParam"
			placeholder="Выберте"
			size="large"
			class="sort__select"
			@change="selectType"
		>
			<el-option
				v-for="option in options"
				:key="option.value"
				:label="option.label"
				:value="option.value"
				class="sort__option"
			>
				<el-radio
					v-model="activeSortParam"
					:label="option.value"
				>
					{{ option.label }}
				</el-radio>
			</el-option>
			<template #prefix>
				<span class="sort__prefix">Сортировать:</span>
			</template>
		</el-select>

		<el-button 
			size="large" 
			class="icon-button"
			:class="{ 
				'icon-button_active': activeSortOrder,
				'icon-button_transform': isTransformIcon,
			}"
			@click="sortActiveLegs"
		>
			<sort-icon
				class="sort__icon"
			/>
		</el-button>
	</div>
</template>

<script>
import SortIcon from '@/assets/icons/sort-icon.svg?inline'

import { ref } from 'vue'
import debounce from 'lodash/debounce'

export default {
	components: {
		SortIcon
	},
	props: {
		options: { type: Array, default: () => [] },
		sortOrder: { type: String, default: 'asc' },
		sortParam: {type: String, default: 'quota' }
	},
	emits: {
		sort: null
	},

	setup(props, { emit }) {
		const activeSortParam = ref(props.sortParam)
		const activeSortOrder = ref(props.sortOrder)
		const isTransformIcon = ref(false)

		const sortActiveLegs = debounce(() => {
			if (activeSortOrder.value === 'desc') {
				activeSortOrder.value = 'asc'
				isTransformIcon.value = false
			}

			else if (!activeSortOrder.value) {
				isTransformIcon.value = true
				activeSortOrder.value = 'desc'
			}
			else {
				activeSortOrder.value = ''
			}
				
			emit('sort', activeSortParam.value, activeSortOrder.value)
		}, 500)

		const selectType = () => {
			if (activeSortOrder.value) {
				emit('sort', activeSortParam.value, activeSortOrder.value)
			}
		}

		return {
			selectType,
			sortActiveLegs,
			isTransformIcon,
			activeSortParam,
			activeSortOrder
		}
	}
}
</script>

<style lang="scss" scoped>

.sort {
	display: flex;
	margin-left: theme-space(xs);

	&__prefix {
		color: theme-color(gray-700);
		line-height: 24px;
		font-weight: 400;
	}
	&__option {
		height: 40px;
		display: flex;
		align-items: center;

		:deep(.el-radio) {
			.el-radio__label {
				padding-left: theme-space(s);
			}
		}
	}
	&__select {
		max-width: 320px;

		:deep(.el-input__inner) {
			padding-left: 116px !important;
			border: 1px solid theme-color(gray-300);
			box-shadow: none !important; 
			color: theme-color(primary);
			font-weight: 500;
			line-height: 20px;
			font-family: Inter;

			&:hover {
				background-color: theme-color(gray-100);
				border: 1px solid theme-color(gray-100);
				box-shadow: none !important; 
			}
		}
	}
	:deep(.el-select .el-input.is-focus .el-input__inner) {
		background-color: theme-color(gray-100);
		border: 1px solid theme-color(gray-100);
		box-shadow: none !important; 
	}

	.icon-button {
		margin-left: theme-space(xs);

		.sort__icon {
			transition: all 0.2s linear 0.2s;
		}

		&_transform {
			.sort__icon {
				transform:  scale(1, -1);
			}
		}

		&:focus {
			background-color: #FFFFFF;
			border: 1px solid theme-color(gray-300);
		}

		&_active:focus {
			background: theme-color(gray-100);
			border: 1px solid theme-color(gray-100);
		}
	}
}
</style>