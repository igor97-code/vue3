<template>
	<popper
		placement="bottom-start"
		@close:popper="closeHandler"
	>
		<el-button 
			size="large" 
			class="icon-button"
			:class="{ 
				'icon-button_active': isFilterOpened,
				'icon-button_filter-mark': isFiltersActive
			}"
			@click="isFilterOpened = true"
		>
			<filter-icon />
		</el-button>

		<template #content="{ close: closeMainPopper }">
			<popper
				placement="right-start"
				:show="Boolean(activeFilter)"
			>
				<div 
					class="filters-menu"
				>
					<header class="filters-menu__header">
						Параметры 
							
						<button 
							class="filters-menu__close-btn"
							@click="closeMainPopper"
						>
							<el-icon>
								<close-icon />
							</el-icon>
						</button>
					</header>
		
					<ul class="filters-list">
						<li 
							v-for="(filter, key) in filters"
							:key="key"
							class="filters-list__item"
							:class="{ 'filters-list__item_active': isActiveFilter(key) }"
							@click="selectFilter(key)"
						>	
							{{ filter.label }}
							<el-icon><arrow-right-bold /></el-icon>
						</li>
					</ul> 
				</div>
	
				<template #content="{ close }">
					<current-filter-popper
						:active-filter="activeFilter"
						:filters="filters"
						:close="closeActiveFilter(close)"
						:close-main-popper="closeMainPopper"
						@update-value="(type, value)=> updateFilter(type, value)"
					/>
				</template>
			</popper>
		</template>
	</popper>

	<transition 
		name="fade" 
		mode="out-in"
	>
		<el-button 
			v-if="isFiltersActive"
			class="reset-filter"
			size="large"
			@click="resetFilter"
		>
			Сбросить фильтры
		</el-button>
	</transition>
</template>

<script>
import FilterIcon from '@/assets/icons/filter-icon.svg?inline'
import CurrentFilterPopper from './CurrentFilterPopper.vue'

import Popper from 'vue3-popper'

import { ArrowRightBold, Close as CloseIcon } from '@element-plus/icons-vue'

import { ref, toRefs, computed } from 'vue'
import isEqual from 'lodash/isEqual'

export default {
	components: {
		Popper,
		FilterIcon,
		CloseIcon,
		ArrowRightBold,
		CurrentFilterPopper
	},

	props: {
		filters: {
			type: Object,
			required: true
		},
		initialFilterValue: {
			type: Object,
			required: true
		}
	},
	emits: {
		'update-filter': null,
		'reset-filter': null
	},
	setup(props, { emit }) {
		const {
			filters,
			initialFilterValue
		} = toRefs(props)

		const isFilterOpened = ref(false)

		const activeFilter = ref(null)

		const isFiltersActive = computed(() => {
			let isActive = false

			for (const key in initialFilterValue.value) {
				isActive = !isEqual(initialFilterValue.value[key], filters.value[key].value)

				if (isActive) {
					break
				}
			}

			return isActive
		})

		const selectFilter = filter => {
			activeFilter.value = activeFilter.value === filter
				? null
				: filter
		}

		const isActiveFilter = filter => {
			return activeFilter.value === filter
		}

		const updateFilter = (typeFilter, filterValue) => {
			emit('update-filter', typeFilter, filterValue)
		}

		const closeHandler = () => {
			selectFilter(null)

			isFilterOpened.value = false
		}

		const resetFilter = () => {
			emit('reset-filter')
		}

		const closeActiveFilter = (close) => {
			return () => {
				selectFilter(null)
				close()
			}
		}

		return {
			resetFilter,
			activeFilter,
			selectFilter,
			closeHandler,
			updateFilter,
			isActiveFilter,
			isFilterOpened,
			isFiltersActive,
			closeActiveFilter
		}
	}
}
</script>

<style lang="scss" scoped>

.filters-menu {
	min-width: 300px;
	padding: theme-space(m) theme-space(xs);
	border: 1px solid theme-color(gray-100);
	background: theme-color(default-white);
	border-radius: 16px;
	box-shadow: 4px 8px 24px rgba(137, 137, 137, 0.1);

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 theme-space(xs);
		font-size: 16px;
		line-height: 20px;
		font-weight: 500;
		color: theme-color(gray-700);
		margin-bottom: theme-space(xs);
	}

	&__close-btn {
		display: flex;
		align-items: center;
		border: none;
		padding: 0;
		background: none;
		outline: none;
		cursor: pointer;
		font-size: 18px;
		color: theme-color(gray-500);
		transition: color 160ms ease;

		&:hover {
			color: theme-color(gray-700);
		}
	}
}

.filters-list {
	display: flex;
	flex-direction: column;
	gap: theme-space(xs);
	list-style: none;
	padding: 0;

	&__item {
		padding: theme-space(2xs) theme-space(xs);
		border-radius: 8px;
		color: theme-color(gray-500);
		transition: all 160ms ease;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.el-icon {
			margin-left: theme-space(2xs);
		}

		&:hover {
			background: theme-color(gray-100);
		}

		&_active {
			background: theme-color(gray-100);
			color: theme-color(primary);
			font-weight: 500;
		}
	}
}

.reset-filter {
	margin-left: theme-space(xs);
	color: theme-color(gray-500);
	font-weight: 500;
	font-size: 14px;
	line-height: 24px;
	font-family: 'Inter';
}

</style>