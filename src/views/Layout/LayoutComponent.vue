<template>
	<div class="layout">
		<NavigationMenu />
		<div class="layout__content">
			<header-component />

			<router-view v-slot="{ Component }">
				<transition
					name="fade-route"
					mode="out-in"
				>
					<component
						:is="Component"
					/>
				</transition>
			</router-view>
		</div>
	</div>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue'
import NavigationMenu from './NavigationMenu.vue'
import { useRoute } from 'vue-router'

export default {
	components: {
		HeaderComponent,
		NavigationMenu,
	},
	setup() {
		const route = useRoute()

		return {
			route
		}
	}
}
</script>
<style lang="scss" scoped>
	.layout {
		display: flex;
		flex-grow: 1;

		&__content {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			min-height: 100vh;
		}
	}
</style>
