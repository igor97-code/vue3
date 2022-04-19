<template>
	<div class="active-legs">
		<header class="active-legs__header">
			<div class="flex">
				<div class="active-legs__filter-panel">
					<search-component
						class="active-legs__search"
						:options="searchOptions"
						@search="searchHandler"
					/>

					<filter-component
						:filters="filters"
						:initial-filter-value="initialFilterValue"
						@update-filter="updateFilter"
						@reset-filter="resetFilter"
					/>
				</div>

				<sort-component
					:options="activeLegsSortOptions"
					:sort-order="sort.order"
					:sort-param="sort.param"
					@sort="sortingActiveLegs"
				/>
				
				<div class="color-gray-500 ml-auto">
					данные обновлены

					<span class="weight_semi-bold">
						{{ dateUpdatedText }}
					</span>
				</div>
			</div>
			<div class="active-legs__filter-tags">
				<filter-tag 
					v-for="(filter, key) in filters"
					:key="key"
					:type="key"
					:filters="filters"
					:current-value="filter.value"
					:initial-value="initialFilterValue[key]"
					@update-filter="(type, value)=> updateFilter(type, value)"
				>
					<template #supplyList>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ getOptionByValue(filter, "name") }}</span>
					</template>

					<template #factoryList>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ getOptionByValue(filter, "name") }}</span>
					</template>
				</filter-tag>
			</div>
		</header>

		<div
			v-loading="isLoading"
			class="active-legs__list"
		>
			<leg-component
				v-for="leg in legList"
				:key="leg.legId"
				:leg-data="leg"
				:btn-reserve="true"
				:btn-more="true"
				:is-collapsable="false"
			/>
		</div>
	</div>
</template>

<script>
import LegComponent from '../components/LegComponent'

import { legs as legsAPI } from '@/api'
import { useTimeWatchHelper } from '@/composables'

import { ref, watch, onMounted, computed } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'

const initialFilterValue = {
	supplyList: [],
	factoryList: [],
}

import { FilterComponent, SearchComponent, SortComponent, FilterTag } from '@/components'

export default {
	components: {
		LegComponent,
		SortComponent,
		FilterComponent,
		SearchComponent,
		FilterTag,
	},
	setup() {
		const {
			dateUpdatedText,
			lastTimeWebUpdated,
			lastTimeBackUpdated
		} = useTimeWatchHelper(updateData)

		const search = ref({
			text: '',
			param: ''
		})

		const sort = ref({
			param: 'quota',
			order: ''
		})

		const searchOptions = [
			{
				label: 'везде',
				value: ''
			},
			{
				label: 'по филиалу',
				value: 'supply'
			},
			{
				label: 'по пункту приемки',
				value: 'factory'
			}
		]

		const activeLegsSortOptions = [
			{
				label: 'по наличию транспорта',
				value: 'transport'
			},
			{
				label: 'по выполнению квоты',
				value: 'quota'
			}
		]

		const filters = ref({
			supplyList: {
				label: 'Филиал'
			},
			factoryList: {
				label: 'Пункт приемки'
			}
		})

		const filtersPayload = computed(() => {
			const {
				supplyList,
				factoryList
			} = filters.value

			return {
				factoryIds: factoryList.value,
				supplyIds: supplyList.value,
				search: search.value,
				sorting: {
					param: sort.value.param,
					order: sort.value.order
				}
			}
		})

		const legList = ref([])
		const isLoading = ref(false)

		resetFilter()

		watch(
			[filtersPayload, sort],
			async () => {
				isLoading.value = true

				await getLegsList(filtersPayload.value)

				isLoading.value = false
			}
		)

		onMounted(() => {
			isLoading.value = true

			Promise.all([
				getLegsFilter(),
				getLegsList(filtersPayload.value)
			])
				.then(() => isLoading.value = false)
		})

		const updateFilter = (filter, value) => {
			filters.value[filter].value = value
		}

		const getLegsFilter = async () => {
			try {
				const { data } = await legsAPI.getLegsFilter()

				for (const key in data.resp) {
					if (key in filters.value) {
						filters.value[key].options = data.resp[key]
					}
				}
			} catch(error) {
				console.error(error)
			}
		}

		async function getLegsList(filters) {
			lastTimeWebUpdated.value = dayjs()

			try {
				const { data } = await legsAPI.getLegsList(filters)
				
				legList.value = data.resp?.legList ?? []
				lastTimeBackUpdated.value = data.resp?.lastUpdate
			} catch(error) {
				console.error(error)
			}
		}

		const sortingActiveLegs = (param, order) => {
			sort.value = {
				param, order
			}
		}

		const searchHandler = (text, param) => {
			search.value = {
				text,
				param
			}
		}

		function resetFilter() {
			const resultFilter = cloneDeep(filters.value)

			for (const key in initialFilterValue) {
				resultFilter[key].value = initialFilterValue[key]
			}

			filters.value = resultFilter
		}
		
		function updateData() {
			getLegsList(filtersPayload.value)
		}

		const getOptionByValue = (obj, fieldName) => {
			const arrayValues = obj.value

			const result = []

			for (let i = 0; i < arrayValues.length; i++) {
				obj.options.forEach((el) => {
					if (el.id === arrayValues[i]) {
						result.push(el[fieldName])
					}
				})
			}

			return result.join(', ')
		}
		
		return {
			sort,
			filters,
			legList,
			isLoading,
			resetFilter,
			updateFilter,
			searchOptions,
			searchHandler,
			dateUpdatedText,
			sortingActiveLegs,
			initialFilterValue,
			activeLegsSortOptions,
			getOptionByValue,
		}
	},
}
</script>
<style lang="scss" scoped>

.active-legs {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding: theme-space(m);

	&__list {
		flex-grow: 1;
	}

	&__header {
		align-items: center;
		align-items: center;
		margin-bottom: theme-space(m);
	}

	&__filter-panel {
		display: flex;
	}

	&__search {
		margin-right: theme-space(xs);
		max-width: 440px;
	}
	&__filter-tags {
        display: flex;
        gap: theme-space(xs);
        flex-wrap: wrap;
	}
}
</style>