<template>
	<page-wrapper>
		<template #title>
			500
		</template>

		<template #subtitle>
			Ошибка сервера
		</template>
		
		<template #text>
			<div class="error__text">
				На сервере произошла непредвиденная ошибка.
				Приносим извинения за предоставленные неудобства.
				Ошибка вскоре будет исправлена.
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
    width: 435px;
}
</style>
