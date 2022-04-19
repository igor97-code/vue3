<template>
	<el-input 
		v-model="searchText"
		size="large"
		placeholder="поиск"
		clearable
		@change="searchHandler"
	>
		<template #append>
			<el-select
				v-model="searchType"
				placeholder="Выберте"
				@change="selectHandler"
			>
				<el-option
					v-for="option in options"
					:key="option.value"
					:label="option.label"
					:value="option.value"
				>
					<el-radio
						v-model="searchType"
						:label="option.value"
					>
						{{ option.label }}
					</el-radio>
				</el-option>
			</el-select>
		</template>
	</el-input>
</template>

<script>
import { ref } from 'vue'

export default {
	props: {
		options: {
			type: Array, default: () => [{
				label: 'везде',
				value: ''
			}]
		}
	},
	emits: {
		search: null
	},
	setup(_, { emit }) {
		const searchText = ref('')
		const searchType = ref('')

		const searchHandler = () => {
			emit('search', searchText.value, searchType.value)
		}

		const selectHandler = () => {
			if (searchText.value) {
				emit('search', searchText.value, searchType.value)
			}
		}

		return {
			searchType,
			searchText,
			searchHandler,
			selectHandler,
		}
	}
}
</script>

<style lang="scss" scoped>
.el-input {
	border-radius: 8px;
	margin-bottom: theme-space(xs);

	:deep(.el-input__inner) {
		background: theme-color(gray-100);
		box-shadow: none !important;
	}

	:deep(.el-input-group__append) {
		width: 150px;
		background: theme-color(gray-100);
		box-shadow: none;
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;

		.el-select {
			.el-input__inner {
				box-shadow: none !important;
				border-radius: 8px;
	
				&:focus {
					box-shadow: none !important;
				}
			}

			.el-input.is-focus {
				--el-input-focus-border-color: #{theme-color(gray-300)};
				background-color: theme-color(default-white);
				border-radius: 8px;
				
			}
		}
	}
}
</style>