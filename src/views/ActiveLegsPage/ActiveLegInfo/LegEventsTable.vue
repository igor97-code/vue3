<template>
	<custom-table
		:data="mappedData"
		:columns="columns"
		:row-class="rowClass(selectedEvents)"
	>
		<template #data:total-checkbox>
			<custom-checkbox
				:option-value="null" 
				:checked="isChecked(selectedEvents, events)"
				:indeterminate="isIndeterminate(selectedEvents, events)"
				@update:model-value="selectRows(selectedEvents, events)"
			/>
		</template>

		<template #data:total-status="{ item }">
			<div class="weight_medium font-size_l">
				{{ item.status }}
			</div>
		</template>

		<template #data:group-total-checkbox="{ group }">
			<custom-checkbox
				:option-value="null"
				:checked="isChecked(selectedEvents, group.rows)"
				:indeterminate="isIndeterminate(selectedEvents, group.rows)"
				@update:model-value="selectRows(selectedEvents, group.rows)"
			/>
		</template>

		<template #data:group-total-status="{ group }">
			<div class="flex items-center">
				{{ group.total.status }}
	
				<button
					class="collapse-button"
					@click="toggleRowCollapse(group)"
				>
					<el-icon :class="{ 'el-icon_rotated': group.collapsed.value }">
						<arrow-down-bold />
					</el-icon>
				</button>
			</div>
		</template>

		<template #data:group-total-vehicleNumber="{ group }">
			<div class="flex items-center">
				{{ group.total.vehicleNumber }}

				<group-info-popover
					:group="group"
				>
					<template #title>
						Общее кол-во водителей тайм-слота
					</template>
				</group-info-popover>
			</div>
		</template>

		<template #data:group-total-tonsAmount="{ group }">
			<div class="flex items-center">
				{{ group.total.tonsAmount }}

				<group-info-popover
					:group="group"
				>
					<template #title>
						Общее кол-во тонн
					</template>
				</group-info-popover>
			</div>
		</template>

		<template #data:checkbox="{ item }">
			<custom-checkbox
				:option-value="null"
				:checked="isChecked(selectedEvents, item)"
				@update:model-value="selectRow(selectedEvents, item)"
			/>
		</template>
	</custom-table>
</template>

<script>
import GroupInfoPopover from './GroupInfoPopover'
import { CustomTable, CustomCheckbox } from '@/components'

import { ArrowDownBold } from '@element-plus/icons-vue'

import { ref, toRefs, computed } from 'vue'
import intersectionBy from 'lodash/intersectionBy'
import cloneDeep from 'lodash/cloneDeep'
import differenceBy from 'lodash/differenceBy'
import xorBy from 'lodash/xorBy'
import concat from 'lodash/concat'
import dayjs from 'dayjs'

export default {
	components: {
		CustomTable,
		ArrowDownBold,
		CustomCheckbox,
		GroupInfoPopover
	},
	props: {
		events: {
			type: Array,
			required: true
		},
		selectedEvents: {
			type: Array,
			required: true
		},
		eventTypes: {
			type: Object,
			required: true
		}
	},
	emits: {
		'update:selectedEvents': null
	},
	setup(props, { emit }) {
		const {
			events,
			eventTypes
		} = toRefs(props)

		const columns = [
			{
				key: 'checkbox',
				width: '47px'
			},
			{
				key: 'status',
				label: 'Статус'
			},
			{
				key: 'lastUpdateTime',
				label: 'Время последнего изменения статуса',
				width: '170px'
			},
			{
				key: 'plannedUpdateTime',
				label: 'Запланированное время изменения статуса',
				width: '220px'
			},
			{
				key: 'driver',
				label: 'Водитель'
			},
			{
				key: 'vehicleNumber',
				label: 'Машина'
			},
			{
				key: 'tonsAmount',
				label: 'Кол-во тонн'
			}
		]

		const mappedData = computed(() => {
			if (!events.value || events.value.length === 0) {
				return {}
			}

			const resultData = {
				total: {
					status: 'Итого за сутки',
					vehicleNumber: 0,
					tonsAmount: 0
				},
				groups: []
			}

			events.value.forEach(event => {
				const plannedStartDate = dayjs(event.plannedTime.startEventTime)
				const plannedEndDate = dayjs(event.plannedTime.endEventTime)

				const timeRange = `${plannedEndDate.format('HH:00')} - ${plannedEndDate.hour(plannedEndDate.hour() + 1).format('HH:00')}`

				const foundGroup = resultData.groups.find(el => el.total.status === timeRange)

				resultData.total.vehicleNumber++
				resultData.total.tonsAmount += event.tonsAmount

				const row = {
					id: event.id,
					status: eventTypes.value[event.eventType],
					lastUpdateTime: event.eventTime ? dayjs(event.eventTime).format('HH:mm') : 'В процессе',
					plannedUpdateTime: `${plannedStartDate.format('HH:mm')} - ${plannedEndDate.format('HH:00')}`,
					driver: event.driver.fullName,
					vehicleNumber: event.vehicleNumber,
					tonsAmount: event.tonsAmount
				}

				if (foundGroup) {
					foundGroup.total.vehicleNumber++
					foundGroup.total.tonsAmount += event.tonsAmount

					foundGroup.rows.push(row)
				} else {
					resultData.groups.push({
						collapsed: ref(false), //Выглядит как костыль кек
						total: {
							status: timeRange,
							vehicleNumber: 1,
							tonsAmount: event.tonsAmount
						},
						rows: [row]
					})
				}
			})

			return resultData.groups.length
				? resultData
				: {}

		})

		const toggleRowCollapse = (group) => {
			group.collapsed.value = !group.collapsed.value
		}

		const selectRow = (selectedRows, row) => {
			const resultRows = cloneDeep(selectedRows)
			const foundIndex = selectedRows.findIndex(el => el.id === row.id)

			if (foundIndex !== -1) {
				resultRows.splice(foundIndex, 1)
			} else {
				const data = events.value.find(el => el.id === row.id)

				resultRows.push(data)
			}

			emit('update:selectedEvents', resultRows)
		}

		const selectRows = (selectedRows, rows) => {
			let resultRows = null

			const difference = differenceBy(rows, selectedRows, 'id')
			const intersection = intersectionBy(events.value, difference, 'id')

			if (difference.length === 0) {
				resultRows = xorBy(rows, selectedRows, 'id')
			} else {
				resultRows = concat(selectedRows, intersection)
			}

			emit('update:selectedEvents', resultRows)
		}

		const isChecked = (selectedRows, valueForCheck) => {
			if (!valueForCheck) {
				return false
			}

			if (Array.isArray(valueForCheck)) {
				return intersectionBy(selectedRows, valueForCheck, 'id').length === valueForCheck.length
			}
				
			return Boolean(selectedRows.find(el => el.id === valueForCheck.id))
		}

		const isIndeterminate = (selectedRows, rows) => {
			return intersectionBy(selectedRows, rows, 'id').length > 0
		}

		const rowClass = selectedRows => {
			return (row, nextRow) => {
				return {
					'custom-table__row_selected': isChecked(selectedRows, row),
					'custom-table__row_next-row-selected': isChecked(selectedRows, row) && isChecked(selectedRows, nextRow)
					// 'custom-table__row_error': getRowErrorState(row),
					// 'custom-table__row_next-row-error': getRowErrorState(nextRow)
				}
			}
		}

		// const getRowErrorState = row => {
		// 	return !row
		// }


		return {
			columns,
			rowClass,
			selectRow,
			isChecked,
			selectRows,
			mappedData,
			isIndeterminate,
			toggleRowCollapse
		}
	}
}
</script>

<style lang="scss" scoped>
.collapse-button {
	background: none;
	border: none;
	padding: 0;
	outline: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	margin-left: theme-space(s);

	.el-icon {
		transition: transform 160ms ease;

		&_rotated {
			transform: rotate(180deg);
		}
	}
}
</style>