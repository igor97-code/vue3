<template>
	<label 
		class="custom-checkbox"
		:class="{
			'custom-checkbox_checked': isChecked,
			'custom-checkbox_disabled': disabled,
			'custom-checkbox_indeterminate': indeterminate
		}"
	>
		<span class="custom-checkbox__input">
			<input
				class="custom-checkbox__original"
				type="checkbox"
				:checked="isChecked"
				:disabled="disabled"
				@change="changeHandler"
			>

			<span class="custom-checkbox__inner">
				<transition
					name="el-zoom-in-center"
					mode="out-in"
				>
					<check-icon 
						v-if="isChecked"
						class="custom-checkbox__checkmark"
					/>

					<div
						v-else-if="indeterminate"
						class="custom-checkbox__indeterminate-mark"
					/>
				</transition>
			</span>
		</span>

		<span 
			v-if="label || $slots.label"
			class="custom-checkbox__label"
		>
			<slot name="label">
				{{ label }}
			</slot>
		</span>
	</label>
</template>

<script>
import CheckIcon from '@/assets/icons/check-icon.svg?inline'

import { toRefs, computed } from 'vue'

import isEqual from 'lodash/isEqual'

export default {
	components: {
		CheckIcon
	},
	props: {
		checked: {
			type: [Boolean, null],
			default: null
		},
		modelValue: {
			type: [String, Boolean, Object, Number, null],
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: ''
		},
		optionValue: {
			type: [String, Boolean, Object, Number, null],
			required: true
		},
		indeterminate: {
			type: Boolean,
			default: false
		}
	},
	emits: {
		'update:modelValue': null
	},
	setup(props, { emit }) {
		const {
			checked,
			modelValue,
			optionValue
		} = toRefs(props)

		const isChecked = computed(() => {
			if (typeof checked.value === 'boolean') {
				return checked.value
			} else {
				return isEqual(optionValue.value, modelValue.value)
			}
		})

		const changeHandler = () => {
			if (typeof checked.value === 'boolean') {
				emit('update:modelValue', optionValue.value)
			} else {
				emit('update:modelValue', isChecked.value ? null : optionValue.value)
			}
		}

		return {
			isChecked,
			changeHandler
		}
	}
}
</script>

<style lang="scss" scoped>
.custom-checkbox {
	display: flex;

	&_indeterminate {
		.custom-checkbox__inner {
			border-color: theme-color(gray-500);
		}
	}

	&__indeterminate-mark {
		width: 6px;
		height: 1.5px;
		background: theme-color(gray-500);
		border-radius: 1px;
	}

	&__input {
		display: inline-flex;
	}

	&__inner {
		background: theme-color(default-white);
		display: flex;
		align-items: center;
		justify-content: center;
		color: theme-color(default-white);
		cursor: pointer;
		width: 20px;
		height: 20px;
		border:  1.5px solid theme-color(gray-300);
		border-radius: 6px;
		transition: 
			border-color .3s ease,
			background-color .3s ease;

		&:hover {
			border-color: theme-color(gray-500);
		}
	}
	
	&__original {
		opacity: 0;
		outline: none;
		position: absolute;
		margin: 0;
		width: 0;
		height: 0;
		z-index: -1;

		&:checked + .custom-checkbox__inner {
			background-color: theme-color(primary);
			border-color: theme-color(primary);
		}

		&:disabled + .custom-checkbox__inner {
			background-color: theme-color(gray-300);
			border-color: theme-color(gray-300);
			cursor: not-allowed;
		}
	}
}
</style>

