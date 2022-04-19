<template>
	<div class="history">
		<div class="history__item">
			<div class="history__header">
				<span>Водитель был исключен из процесса перевозки</span>

				<span class="history__header-date">22.01.2022 14:55</span>
			</div>

			<div class="history__author">
				Внёс изменения: <span class="history__author-name">Иванов Иван Иванович</span>
			</div>
		</div>

		<div class="history__item">
			<div class="history__header">
				<span>Водитель был исключен из процесса перевозки</span>

				<span class="history__header-date">22.01.2022 14:55</span>
			</div>

			<div class="history__author">
				Внёс изменения: <span class="history__author-name">Иванов Иван Иванович</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'HistoryInfo',
}
</script>

<style lang="scss" scoped>
.history {
    cursor: pointer;

    &__item {
        margin-top: 20px;
        border-bottom: 1px solid theme-color(gray-300);
    }

    &__header{
        display: flex;
        justify-content: space-between;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: theme-color(gray-700);
        margin-bottom: theme-space(4xs);

        &-date {
            color: theme-color(primary);
            font-size: 14px;
            font-weight: 300;
        }
    }
    &__author{
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        color: rgba(130, 130, 130, 0.5);
        margin-bottom: 18px;

        &-name{
            color: rgba(130, 130, 130, 1);
        }
    }
}  
</style>