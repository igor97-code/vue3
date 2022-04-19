<template>
	<default-page-container>
		<div class="content">
			<div class="content__title">
				<slot name="title" />
			</div>
            
			<div class="content__subtitle">
				<slot name="subtitle" />
			</div>

			<div class="content__text">
				<slot name="text" />
			</div>

			<el-button
				size="large"
				class="content__back-main"
				@click="$router.push({ name: 'home' })"
			>
				Вернуться на Главную страницу
			</el-button>
		</div>
	</default-page-container>
</template>

<script>
import { DefaultPageContainer } from '@/components'

export default {
	components: { DefaultPageContainer }
}
</script>

<style scoped lang="scss">
.content {
    margin-top: 62px;

    &__title {
        color: #47A76A;
        font-weight: 600;
        font-size: 96px;
        line-height: 96px;
    }

    &__subtitle {
        font-weight: 600;
        font-size: 32px;
        line-height: 40px;
        color: #47A76A;
        margin-top: 43px;
    }

    &__text {
        margin-top: 14px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #828282;
    }

    &__back-main {
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        padding: 8px 16px;
        color: #47A76A;
        background: #FFFFFF;
        border: 1px solid #DADADA;
        border-radius: 8px;
        margin-top: 50px;
        cursor: pointer;
    }
}
</style>
