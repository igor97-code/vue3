<template>
	<div class="container">
		<img
			src="@/assets/images/logo.png"
			alt="logo"
		>
		<slot />
	</div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 145px;
}
</style>
