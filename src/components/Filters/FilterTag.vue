<template>
	<popper 
		v-if="isShowTag"
		placement="bottom-start"
	>
		<div
			class="tag"
		>
			<slot
				:name="type"
			>
				<span class="tag__type">{{ type }}:</span> 
				<span class="tag__value">{{ currentValue }}</span>
			</slot>

			<close-icon
				class="tag__icon"
				@click="deleteFilter(type)"
			/>
		</div>

		<template #content="{ close }">
			<current-filter-popper
				:active-filter="type"
				:filters="filters"
				:close="close"
				:close-main-popper="close"
				@update-value="(type, value)=> updateFilter(type, value)"
			/>
		</template>
	</popper>
</template>

<script>
import { computed } from 'vue'
import CloseIcon from '@/assets/icons/close-icon.svg?inline'
import CurrentFilterPopper from './CurrentFilterPopper.vue'
import isEqual from 'lodash/isEqual'

import Popper from 'vue3-popper'

export default {
	components:{
		CloseIcon,
		CurrentFilterPopper,
		Popper,
	},
	props: {
		type: { type: String, default: '' },
		currentValue: { type: Array, default: () => [] },
		initialValue: { type: Array, default: () => [] },
		filters: { type: Object, default: () => {} }
	},
	emits: {
		'update-filter': null, 
	},
	setup(props, { emit }) {

		const isShowTag = computed(() => {
			return !isEqual(props.currentValue, props.initialValue)
		})
		
		const updateFilter = (typeFilter, filterValue) => {
			emit('update-filter', typeFilter, filterValue)
		}

		const deleteFilter = (typeFilter) => {
			updateFilter(typeFilter, props.initialValue)
		}

		return {
			isShowTag,

			updateFilter,
			deleteFilter,
		}
	}
}
</script>

<style lang="scss" scoped>
.tag {
	cursor: pointer;
	display: flex;
	align-items: center;

	padding: theme-space(3xs) theme-space(xs);

	max-width: 400px;
	height: 40px;
	
	border: 1px solid theme-color(gray-300);
	border-radius: 8px;

	font-size: 14px;
	font-family: 'Inter';
	font-weight: 500;
	line-height: 24px;
	color: theme-color(gray-500);
	transition: all 160ms ease;

	&:hover,
	&:focus {
		background-color: theme-color(gray-100);
		border-color: theme-color(gray-100);
	}

	&__value {
		color: theme-color(primary);
		padding-left: theme-space(4xs);
		max-width: 160px;
		white-space: pre;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__type {
		white-space: pre;
	}

	&__icon {
		margin-left: theme-space(2xs);
		color: theme-color(gray-500);
		overflow: initial;
		transition: color 160ms ease;

		&:hover {
			color: theme-color(gray-700);
		}
	} 	
}

:deep(.filter-value) {
	color: theme-color(primary);
	padding-left: theme-space(4xs);
	max-width: 160px;
	white-space: pre;
	overflow: hidden;
	text-overflow: ellipsis;
}

:deep(.filter-type) {
	white-space: pre;
}
</style>