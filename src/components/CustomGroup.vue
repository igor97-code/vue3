<template>
	<div class="radio-group">
		<slot />
	</div>
</template>

<script>
import {provide,computed} from 'vue'

export default {
	props: {
		modelValue: {
			type: [String, Number, null],
			required: true
		}
	},
	emits: {
		'update:modelValue': null
	},
	setup(props, ctx) {
		const changeRadio = (radioName) => {
			ctx.emit('update:modelValue', radioName)
		}

		provide('radio', computed( () => {
			return {
				...props,
				changeRadio,
			}
		}))

		return {
			changeRadio,
		}
	}
}
</script>