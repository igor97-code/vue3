<template>
	<section 
		v-loading="pageLoading"
		class="leg-info"
	>
		<leg-component
			class="mb-m"
			:leg-data="activeLeg"
			:btn-reserve="true"
			:btn-more="false"
			:is-collapsable="true"
		/>

		<div class="leg-info__search-wrapper mb-m">
			<search-component
				class="leg-info__search"
				:options="searchParamOptions"
				@search="searchHandler"
			/>

			<div class="color-gray-500 ml-auto">
				данные обновлены

				<span class="weight_semi-bold">
					{{ dateUpdatedText }}
				</span>
			</div>
		</div>

		<el-tabs v-model="activeTab">
			<el-tab-pane 
				v-for="tab in tabs"
				:key="tab.name"
				:label="tab.label"
				:name="tab.name"
			/>
		</el-tabs>

		<leg-events-table 
			v-model:selected-events="selectedEvents"
			v-loading="eventsLoading"
			:events="events"
			:event-types="eventTypes"
		/>
	</section>
</template>

<script>
import { SearchComponent } from '@/components'
import LegEventsTable from './LegEventsTable'
import LegComponent from '../components/LegComponent'

import { legs as legsAPI } from '@/api'
import { useTimeWatchHelper } from '@/composables'

import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const eventTypesGroups = {
	loading: [
		'field',
		'begin_load',
		'load'
	],
	unloading: [
		'factory',
		'begin_unload',
		'unload'
	]
}

export default {
	components: {
		LegComponent,
		LegEventsTable,
		SearchComponent
	},
	setup() {
		const route = useRoute()

		const {
			dateUpdatedText,
			lastTimeWebUpdated,
			lastTimeBackUpdated
		} = useTimeWatchHelper(updateData)

		const search = ref({
			param: '',
			text: ''
		})

		const activeLeg = ref(null)

		const events = ref([])
		const eventTypes = ref({})
		const selectedEvents = ref([])
		const eventsLoading = ref(false)
		
		const pageLoading = ref(false)

		const activeTab = ref('loading')
		const tabs = [
			{
				label: 'Погрузка',
				name: 'loading'
			},
			{
				label: 'Разгрузка',
				name: 'unloading'
			}
		]

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
				label: 'по ФИО',
				value: 'fullName'
			}
		]

		const eventsPayload = computed(() => {
			return {
				eventTypeList: eventTypesGroups[activeTab.value],
				search: search.value
			}
		})

		watch(
			eventsPayload,
			async (value) => {
				eventsLoading.value= true
				selectedEvents.value = []

				await getLegEvents(value)

				eventsLoading.value = false
			}
		)

		onMounted(() => {
			pageLoading.value = true

			Promise.all([
				getLegInfo(),
				getEventTypes(),
				getLegEvents(eventsPayload.value)
			])
				.then(() => pageLoading.value = false)
		})

		const getLegInfo = async () => {
			lastTimeWebUpdated.value = dayjs()

			try {
				const { data } = await legsAPI.getLeg(route.params.legId)
				
				activeLeg.value = data.resp
				lastTimeBackUpdated.value = data.resp?.lastUpdate
			} catch(error) {
				console.error(error)
			}
		}

		const getEventTypes = async () => {
			try {
				const { data } = await legsAPI.getEventTypes()

				eventTypes.value = data.resp
					.reduce((acc, current) => {
						return {
							...acc,
							[current.eventType]: current.description
						}
					}, {})

			} catch(error) {
				console.error(error)
			}
		}

		async function getLegEvents(filtres) {
			try {
				const { data } = await legsAPI.getLegEvents(route.params.legId, filtres)

				events.value = data.resp
					.filter(event => dayjs(event.plannedTime.endEventTime).isValid())  //По идее не должно быть таких событий
					.map(event => {
						return {
							...event,
							id: `${event.runId}:${event.eventType}`
						}
					})
			} catch(error) {
				console.error(error)
			}
		}

		function updateData() {
			getLegInfo()
			getLegEvents(eventsPayload.value)
		}

		const searchHandler = (text, param) => {
			search.value = {
				text,
				param
			}
		}

		return {
			tabs,
			events,
			activeLeg,
			activeTab,
			eventTypes,
			pageLoading,
			searchHandler,
			eventsLoading,
			selectedEvents,
			dateUpdatedText,
			searchParamOptions
		}
	}
}
</script>

<style lang="scss" scoped>
.leg-info {
	padding: theme-space(m);
	display: flex;
	flex-direction: column;

	&__search {
		max-width: 432px;

		&-wrapper {
			display: flex;
			align-items: center;
		}
	}
}

:deep(.el-tabs) {
	padding-left: theme-space(l);
	.el-tabs__header {
		margin: 0;
	}

	.el-tabs__content {
		display: none;
	}
}
</style>