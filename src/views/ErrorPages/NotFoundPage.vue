<template>
	<page-wrapper>
		<template #title>
			404
		</template>

		<template #subtitle>
			Страница не найдена
		</template>
		
		<template #text>
			<div class="error__text">
				Страница, которую вы ищете, не существует или была удалена
			</div>
		</template>
	</page-wrapper>
</template>

<script>
import PageWrapper from './PageWrapper'

export default {
	components: { PageWrapper }
}
</script>

<style scoped lang="scss">
.error__text {
    width: 358px;
}
</style>
