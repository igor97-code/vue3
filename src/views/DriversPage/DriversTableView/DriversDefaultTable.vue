<template>
	<custom-table
		class="drivers-table"
		:columns="columns"
		:data="mappedData"
		:row-class="rowClass"
		:column-class="columnClass"
	>
		<template #header:checkbox>
			<custom-checkbox
				:option-value="null"
				:model-value="null"
				:checked="isAllRowsChecked"
				:indeterminate="isIndeterminate"
				:disabled="data.length === 0"
				@update:model-value="selectAllRows"
			/>
		</template>

		<template #data:checkbox="{ item }">
			<custom-checkbox
				:checked="isRowChecked(item)"
				:option-value="item"
				@update:model-value="selectRow"
			/>
		</template>

		<template #data:fullName="{ item }">
			<router-link 
				:to="{ name: 'driver-info', params: { driverId: item.id }, meta: { title: 'test' } }"
				class="drivers-table__driver-info-link"
			>
				{{ item.fullName }}
			</router-link>
		</template>

		<template #data:electronicDispatcher="{ item }">
			<span 
				class="drivers-table__electronic-dispatcher"
				:class="{ 'drivers-table__electronic-dispatcher_active': item.electronicDispatcher }"
			/>
		</template>
	</custom-table>
</template>

<script>
import { CustomTable, CustomCheckbox } from '@/components'

import { ref, toRefs, computed } from 'vue'

import { formatPhoneNumber } from '@/utils'

import cloneDeep from 'lodash/cloneDeep'
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import xorBy from 'lodash/xorBy'
import concat from 'lodash/concat'

const columns = [
	{
		key: 'checkbox',
		width: '47px'
	},
	{
		key: 'fullName',
		label: 'ФИО'
	},
	{
		key: 'contactPhone',
		label: 'Контактный телефон',
		width: '170px'
	},
	{
		key: 'vehicleNumber',
		label: 'Транспорт'
	},
	{
		key: 'supply',
		label: 'Филиал'
	},
	{
		key: 'carrierType',
		label: 'Контрагент'
	},
	{
		key: 'workTime',
		label: 'Время работы',
		width: '130px'
	},
	{
		key: 'activity',
		label: 'Активность',
		width: '110px'
	},
	{
		key: 'electronicDispatcher',
		label: 'Наличие ЦД'
	}
]

export default {
	components: {
		CustomTable,
		CustomCheckbox
	},
	props: {
		selectedRows: {
			type: Array,
			required: true
		},
		data: {
			type: Array,
			required: true
		},

	},
	emits: {
		'update:selectedRows': null
	},
	setup(props, { emit }) {
		const {
			data,
			selectedRows
		} = toRefs(props)

		const checkbox = ref(null)

		const mappedData = computed(() => {
			return data.value.map(el => {
				return {
					id: el.id,
					fullName: el.fullName,
					contactPhone: formatPhoneNumber(el.contactPhone),
					vehicleNumber: el.vehicle?.vehicleNumber ?? '---',
					supply: el.supply?.name ?? '---',
					carrierType: el.carrier?.carrierTypeString ?? '---',
					workTime: !el.startWorkTime || !el.endWorkTime 
						? 'Не определено' 
						: `${el.startWorkTime} - ${el.endWorkTime}`,
					activity: el.status ? 'Активен' : 'Неактивен',
					electronicDispatcher: el.electronicDispatcher
				} 
			})
		})

		const isIndeterminate = computed(() => {
			return data.value.length > 0 && intersectionBy(data.value, selectedRows.value, 'id').length !== 0
		})

		const isAllRowsChecked = computed(() => {
			return data.value.length > 0 && differenceBy(data.value, selectedRows.value, 'id').length === 0
		})

		const isRowChecked = row => {
			if (!row) {
				return false
			}

			return Boolean(selectedRows.value.find(el => el.id === row.id))
		}

		const selectRow = row => {
			const resultRows = cloneDeep(selectedRows.value)
			const foundRowIndex = resultRows.findIndex(el => el.id === row.id)

			if (foundRowIndex !== -1) {
				resultRows.splice(foundRowIndex, 1)
			} else {
				const resultRow = data.value.find(el => el.id === row.id)
				resultRows.push(resultRow)
			}

			emit('update:selectedRows', resultRows)
		}

		const selectAllRows = () => {
			const resultRows = cloneDeep(selectedRows.value)
			const difference = differenceBy(data.value, resultRows, 'id')

			if (difference.length === 0) {
				emit('update:selectedRows', xorBy(resultRows, data.value, 'id'))
			} else {
				console.log(concat(resultRows, difference))
				emit('update:selectedRows', concat(resultRows, difference))
			}
		}

		const rowClass = (row, index) => {
			return {
				'custom-table__row_selected': isRowChecked(row),
				'custom-table__row_next-row-selected': isRowChecked(row) && isRowChecked(mappedData.value[index + 1])
			}
		}

		const columnClass = key => {
			if (key === 'electronicDispatcher') {
				return 'electronic-dispatcher-td'
			}
		}

		return {
			columns,
			rowClass,
			checkbox,
			selectRow,
			mappedData,
			columnClass,
			isRowChecked,
			selectAllRows,
			isIndeterminate,
			isAllRowsChecked
		}
	}
}
</script>

<style lang="scss" scoped>
.drivers-table {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	min-height: 1px;

	&__electronic-dispatcher {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: theme-color(gray-300);
		display: inline-flex;

		&_active {
			background: var(--el-color-primary-dark-2);
		}
	}

	&__driver-info-link {
		color: inherit;
	}
}

:deep(.electronic-dispatcher-td) {
	text-align: center;
}
</style>