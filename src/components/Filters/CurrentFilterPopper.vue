<template>
	<div
		class="current-filter"
	>
		<transition
			name="fade"
			mode="out-in"
		>
			<div 
				v-if="activeFilterComponent" 
				:key="activeFilterComponent"
			>
				<header class="current-filter__header">
					{{ currentFilterTitle }}
				</header>

				<component 
					:is="activeFilterComponent"
					ref="filterForm"
					:current-filter-value="filters[activeFilter].value"
					:options="filters[activeFilter].options"
				/>

				<footer class="current-filter__footer">
					<el-button 
						size="large"
						@click="closeCurrentFilter(close)"
					>
						Отмена
					</el-button>
	
					<el-button 
						size="large"
						type="primary"
						class="current-filter__apply-btn"
						@click="applyFilter(closeMainPopper)"
					>
						Применить
					</el-button>
				</footer>
			</div>
		</transition>
	</div>
</template>

<script>
import ActivityFilter from './ActivityFilter'
import SupplyListFilter from './SupplyListFilter'
import WorkingTimeFilter from './WorkingTimeFilter'
import VehicleTypesFilter from './VehicleTypesFilter'
import CarrierTypesFilter from './CarrierTypesFilter'
import ElectronicDispatcherFilter from './ElectronicDispatcherFilter'
import FactoryListFilter from './FactoryListFilter.vue'

import Popper from 'vue3-popper'

import { ref, toRefs, computed } from 'vue'

export default {
	components: {
		Popper,
		ActivityFilter,
		SupplyListFilter,
		WorkingTimeFilter,
		VehicleTypesFilter,
		CarrierTypesFilter,
		ElectronicDispatcherFilter,
		FactoryListFilter
	},

	props: {
		close: { type: Function, default: () => {} }, 
		filters: { type: Object, default: () => {} },
		activeFilter: { type: String, default: ''},
		closeMainPopper: { type: Function, default: () => {} }
	},
    
	emits: {
		'update-value': null
	},

	setup(props, { emit }) {
		const { 
			filters,
			activeFilter
		} = toRefs(props)

		const filterForm = ref(null)

		const activeFilterComponent = computed(() => {
			return activeFilter.value
				? `${activeFilter.value.charAt(0).toUpperCase()}${activeFilter.value.slice(1)}Filter`
				: ''
		})

		const currentFilterTitle = computed(() => {
			return filters.value[activeFilter.value]?.label ?? ''
		})

		const closeCurrentFilter = close => {
			close()
		}

		const applyFilter = close => {		
			emit('update-value', activeFilter.value, filterForm.value.filterValue)
			
			closeCurrentFilter(close)
		}

		return { 
			filterForm,
			applyFilter,
			closeCurrentFilter,
			currentFilterTitle,
			activeFilterComponent
		}
	}
}
</script>

<style lang="scss" scoped>

.current-filter {
	min-width: 344px;
	padding: theme-space(m) theme-space(xs);
	border: 1px solid theme-color(gray-100);
	background: theme-color(default-white);
	border-radius: 16px;
	box-shadow: 4px 8px 24px rgba(137, 137, 137, 0.1);

	&__header {
		padding: 0 18px;
		font-size: 16px;
		line-height: 20px;
		font-weight: 500;
		color: theme-color(gray-700);
		margin-bottom: theme-space(xs);
	}

	&__footer {
		margin-top: theme-space(m);
		padding: 0 18px;
		display: flex;
	}

	&__apply-btn {
		flex-grow: 1;
	}
}
</style>