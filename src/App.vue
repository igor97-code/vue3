<template>
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
</template>

<style lang="scss">
#app {
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow-y: auto;
}
</style>
