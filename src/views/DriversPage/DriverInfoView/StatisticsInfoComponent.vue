<template>
	<div class="statistics">
		<div class="statistics__header">
			<span>Параметр</span>

			<span>Значение</span>
		</div>

		<div class="statistics__info">
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
		</div>
		<div class="statistics__info">
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
		</div>
		<div class="statistics__info">
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
		</div>
		<div class="statistics__info">
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
			<div class="statistics__info-item">
				<span>тонны / км</span>

				<span>0,3</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'StatisticsInfo'
}
</script>

<style lang="scss" scoped>
.statistics {
    padding-right: 54px;

    &__header {
        color: theme-color(gray-500);
        display: flex;
        justify-content: space-between;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
        margin-bottom: theme-space(s);
    }

    &__info {
		border-bottom: 1px solid theme-color(gray-300);

        &-item {
            margin: theme-space(s) 0;
            display: flex;
            justify-content: space-between;
            text-align: left;

			span {
				font-weight: 400;
				font-size: 14px;
				line-height: 24px;
				color: theme-color(gray-700);

				&:first-child{
					padding-top: theme-space(4xs);
				}

				&:last-child {
					color: theme-color(primary);
					font-weight: 700;
					font-size: 24px;
					line-height: 32px;
				}
			}
        }
		
        &:last-of-type {
            border: none;
        }
    }
}
</style>