<template>
	<el-popover 
		ref="popover"
		v-bind="{ ...$attrs, ...$props }"
		:persistent="false" 
		:popper-class="`${popperClass} extended-popover`"
		@before-enter="visible = true"
		@before-leave="visible = false"
	>
		<template #reference>
			<slot
				name="reference"
				:visible="visible"
			/>
		</template>

		<slot :close="closeHandler" />
	</el-popover>
</template>

<script>
import { ref } from 'vue'

export default {
	props: {
		popperOptions: {
			type: Object,
			default: () => {
				return {
					placement: 'auto',
					modifiers: [
						{
							name: 'flip',
							options: {
								allowedAutoPlacements: ['bottom', 'top']
							}
						}
					]
				}
			}
		},
		popperClass: {
			type: String,
			default: ''
		}
	},
	setup() {
		const popover = ref(null)
		const visible = ref(false)

		const closeHandler = () => {
			popover.value.hide()
		}

		return {
			popover,
			visible,
			closeHandler
		}
	}
}
</script>

<style lang="scss">
.extended-popover.el-popper {
	border-radius: 8px !important;
	border: 1px solid theme-color(gray-300) !important;
	background: theme-color(default-white);
	padding: theme-space(s) theme-space(m);
	box-shadow: none !important;
}
</style>