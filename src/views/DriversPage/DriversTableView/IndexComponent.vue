<template>
	<div
		v-loading="isPageLoading"
		class="drivers-view"
	>
		<header class="drivers-view__header">
			<div class="flex">
				<div class="drivers-view__filter-panel">
					<search-component
						class="drivers-view__search"
						:options="searchParamOptions"
						@search="searchHandler"
					/>
		
					<filter-component
						:filters="filters"
						:initial-filter-value="initialFilterValue"
						@update-filter="updateFilter"
						@reset-filter="resetFilter"
					/>
				</div>
	
				<div class="general-info__icons">
					<el-button
						class="icon-button"
						size="large"
					>
						<draw-icon />
					</el-button>
	
					<el-button
						class="icon-button"
						size="large"
					>
						<mail-icon />
					</el-button>
	
					<el-button
						class="icon-button"
						size="large"
					>
						<truck-icon />
					</el-button>
				</div>
			</div>

			<div class="drivers-view__filter-tags">
				<filter-tag 
					v-for="(filter, key) in filters"
					:key="key"
					:type="key"
					:filters="filters"
					:current-value="filter.value"
					:initial-value="initialFilterValue[key]"
					@update-filter="(type, value)=> updateFilter(type, value)"
				>
					<template #vehicleTypes>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ getOptionByValue(filter, "type") }}</span>
					</template>

					<template #supplyList>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ getOptionByValue(filter, "name") }}</span>
					</template>

					<template #activity>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ filter.value ? 'Активен' : 'Неактивен' }}</span>
					</template>

					<template #electronicDispatcher>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ filter.value ? 'С цифровым диспетчером' : 'Без цифрового диспетчера' }}</span>
					</template>
					
					<template #workingTime>
						<span class="filter-type">{{ filter.label }}:</span>
						<span class="filter-value">{{ filter.value.join(' - ') }}</span>
					</template>
				</filter-tag>
			</div>
		</header>

		<el-tabs v-model="activeTab">
			<el-tab-pane 
				v-for="tab in tabs"
				:key="tab.name"
				:label="tab.label"
				:name="tab.name"
			/>
		</el-tabs>

		<transition
			name="fade-route"
			mode="out-in"
		>
			<div
				:key="activeTab"
				class="drivers-view__tab-content"
			>
				<drivers-default-table
					v-model:selected-rows="selectedRows"
					v-loading="isDriversLoading"
					class="drivers-view__table"
					:data="driversDataForShow"
				/>
		
				<footer class="drivers-view__footer">
					<div class="drivers-view__footer-left">
						<el-button 
							v-if="showOnlySelectedDrivers"
							size="large"
							@click="showOnlySelectedDrivers = false"
						>
							Вернуться к списку
						</el-button>
		
						<el-button
							v-else
							size="large"
							:disabled="selectedRows.length === 0"
							@click="showOnlySelectedDrivers = true"
						>
							Показать только выделенных
						</el-button>
		
						<span class="drivers-view__selected-count">
							Выделено: 
							<span class="weight_medium">
								{{ selectedRows.length }}
							</span>
						</span>
					</div>
		
		
					<div 
						v-if="!showOnlySelectedDrivers"
						class="drivers-view__footer-right"
					>
						<span v-if="driversData.length">
							Результаты: 
							<span class="weight_medium">
								{{ footerRightInfo }}
							</span>
						</span>
		
						<el-pagination
							v-model:current-page="currentPage" 
							class="drivers-view__pagination"
							layout="prev, pager, next" 
							:hide-on-single-page="true"
							:disabled="isDriversLoading"
							:total="total"
							:page-size="limit"
							:pager-count="5"
						/>
					</div>
				</footer>
			</div>
		</transition>
	</div>
</template>

<script>
import { FilterComponent, SearchComponent, FilterTag }from '@/components'
import DriversDefaultTable from './DriversDefaultTable'

import DrawIcon from '@/assets/icons/draw-icon.svg?inline'
import MailIcon from '@/assets/icons/mail-icon.svg?inline'
import TruckIcon from '@/assets/icons/truck-icon.svg?inline'

import { drivers } from '@/api'

import { useRoute } from 'vue-router'
import { ref, watch, computed, onMounted } from 'vue'

import cloneDeep from 'lodash/cloneDeep'

const initialFilterValue = {
	vehicleTypes: [],
	supplyList: [],
	activity: null,
	workingTime: ['', ''],
	electronicDispatcher: null
}

export default {
	components: {
		DrawIcon,
		MailIcon,
		FilterTag,
		TruckIcon,
		FilterComponent,
		SearchComponent,
		DriversDefaultTable
	},
	setup() {
		const route = useRoute()

		const limit = ref(8)
		const total = ref(6)
		const currentPage = ref(1)

		const search = ref({
			text: '',
			param: ''
		})

		const searchParamOptions = [
			{
				label: 'везде',
				value: ''
			},
			{
				label: 'по транспорту',
				value: 'vehicleNumber'
			},
			{
				label: 'по ИНН',
				value: 'inn'
			}, 
			{
				label: 'по телефону',
				value: 'phone'
			},
			{
				label: 'по ФИО',
				value: 'fullName'
			}
		]
		const driversData = ref([])
		const selectedRows = ref([])

		const isPageLoading = ref(false)
		const isDriversLoading = ref(false)
		const showOnlySelectedDrivers = ref(false)

		const carrierTypes = ref([])
		const activeTab = ref('carrierType:all')
		const tabs = [
			{
				label: 'Все',
				name: 'carrierType:all'
			},
			{
				label: 'АТА',
				name: 'carrierType:1'
			},
			{
				label: 'ИП',
				name: 'carrierType:2'
			},
			{
				label: 'Агрегаторы',
				name: 'carrierType:3'
			}
		]

		const filters = ref({
			vehicleTypes: {
				label: 'Характеристика транспорта'
			},
			supplyList: {
				label: 'Направление'
			},
			activity: {
				label: 'Активность'
			},
			electronicDispatcher: {
				label: 'Наличие ЦД'
			},
			workingTime: {
				label: 'Время работы'
			}
		})

		resetFilter()

		const driversDataForShow = computed(() => {
			return showOnlySelectedDrivers.value
				? selectedRows.value
				: driversData.value
		})

		const filtersPayload = computed(() => {
			const {
				vehicleTypes,
				supplyList,
				activity,
				electronicDispatcher,
				workingTime
			} = filters.value

			return {
				carrierTypes: carrierTypes.value,
				electronicDispatcher: electronicDispatcher.value,
				startWorkTime: workingTime.value ? workingTime.value[0] : '',
				endWorkTime: workingTime.value ? workingTime.value[1] : '',
				supplyIds: supplyList.value,
				vehicleTypes: vehicleTypes.value,
				status: activity.value,
				search: search.value
			}
		})

		const offset = computed(() => {
			return (currentPage.value - 1) * limit.value
		})

		const footerRightInfo = computed(() => {
			return `${offset.value + 1} - ${Math.min(limit.value * currentPage.value, total.value)} из ${total.value}`
		})

		watch(
			filtersPayload,
			() => {
				currentPage.value = 1
			}
		)

		watch(
			activeTab,
			value => {
				if (value.includes('carrierType')) {
					const type = parseInt(value.split(':')[1], 10)

					carrierTypes.value = isNaN(type) ? [] : [type]
				}
				
				selectedRows.value = []
				showOnlySelectedDrivers.value = false
				currentPage.value = 1
			}
		)

		watch(
			showOnlySelectedDrivers,
			() => {
				currentPage.value = 1
			}
		)

		watch(
			[filtersPayload, currentPage, activeTab, showOnlySelectedDrivers],
			() => {
				if (!showOnlySelectedDrivers.value) {
					getDrivers(filtersPayload.value)
				}
			}
		)

		watch(
			selectedRows,
			(value) => {
				if (value.length === 0 && showOnlySelectedDrivers.value) {
					showOnlySelectedDrivers.value = false
				}
			}
		)

		onMounted(() => {
			handleQeury(route)

			getDriversFilter()
			getDrivers(filtersPayload.value)
		})

		const updateFilter = (filter, value) => {
			filters.value[filter].value = value
		}

		const getDrivers = async filters => {
			isDriversLoading.value = true

			try {
				const { data } = await drivers.getDrivers(filters, { limit: limit.value, offset: offset.value })

				driversData.value = data.resp.driverList
				total.value = data.resp.totalDrivers
				
			} catch(error) {
				console.error(error)
			} finally {
				isDriversLoading.value = false
			}
		}

		const getDriversFilter = async () => {
			try {
				const { data } = await drivers.getDriversFilter()

				for (const key in data.resp) {
					if (key in filters.value) {
						filters.value[key].options = data.resp[key]
					}
				}
			} catch(error) {
				console.error(error)
			}
		}

		const searchHandler = (text, param) => {
			search.value = {
				text,
				param
			}
		}
		
		const handleQeury = ({ query }) => {
			for (const key in query) {
				switch(key) {
				case 'working-time':
					filters.value.workingTime.value = query[key].split(',')
					break
				case 'activity':
					console.log(query[key])
					break
				default: 
					break
				}
			}
			// filters.value.workingTime.value = [route.query['start-time'], route.query['end-time']]
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

		function resetFilter() {
			const resultFilter = cloneDeep(filters.value)

			for (const key in initialFilterValue) {
				resultFilter[key].value = initialFilterValue[key]
			}

			filters.value = resultFilter
		}


		return {
			tabs,
			limit,
			total,
			offset,
			filters,
			activeTab,
			driversData,
			currentPage,
			resetFilter,
			selectedRows,
			updateFilter,
			isPageLoading,
			searchHandler,
			filtersPayload,
			footerRightInfo,
			getOptionByValue,
			isDriversLoading,
			searchParamOptions,
			initialFilterValue,
			driversDataForShow,
			showOnlySelectedDrivers,
		}
	} 
}
</script>

<style lang="scss" scoped>
.drivers-view {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding: theme-space(m);
	min-height: 1px;
	max-height: calc(100vh - 72px);

	&__filter-tags {
		display: flex;
		gap: theme-space(xs);
		flex-wrap: wrap;
	}

	&__header {
		margin-bottom: theme-space(m);
	}

	&__selected-count {
		margin-left: theme-space(s);
	}

	&__tab-content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		min-height: 1px;
	}

	&__table {
		margin-bottom: theme-space(m);
	}

	&__filter-panel {
		display: flex;
		margin-right: auto;
	}

	&__search {
		margin-right: theme-space(xs);
		max-width: 440px;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		background: theme-color(gray-100);
		padding: theme-space(xs);
		border-radius: 16px;
		color: theme-color(gray-500);
		//TODO: надо поменять в данный момент так из-за лоадинга у которого z-index: 2000
		z-index: 2001;

		&-right,
		&-left {
			display: flex;
			align-items: center;
		}
	}

	&__pagination {
		margin-left: theme-space(s);
	}

	.el-tabs {
		padding-left: theme-space(l);
	}

	:deep(.el-tabs__content) {
		display: none;
	}

	:deep(.el-tabs__header) {
		margin-bottom: 0;
	}
}
</style>