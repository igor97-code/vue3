<template>
	<extended-popover
		trigger="click"
		width="336px"
	>
		<template #reference="{ visible }">
			<info-icon
				width="16px"
				height="16px"
				class="info-icon" 
				:class="{ 'info-icon_active': visible }"
			/>
		</template>

		<template #default>
			<div class="info-popup">
				<header class="info-popup__header">
					<slot name="title" />
				</header>

				<ul class="info-popup__content">
					<li class="info-popup__content-item color-gray-500 weight_medium">
						<div>
							Статус
						</div>

						<div>
							Количество
						</div>
					</li>

					<li 
						v-for="item in group.rows"
						:key="item.status"
						class="info-popup__content-item color-gray-700 weight_regular"
					>
						<div>
							{{ item.status }}
						</div>

						<div class="weight_bold font-size_xl">
							1
						</div>
					</li>
				</ul>
			</div>
		</template>
	</extended-popover>
</template>

<script>
import { ExtendedPopover } from '@/components'

import InfoIcon from '@/assets/icons/info-icon.svg?inline'

export default {
	components: {
		InfoIcon,
		ExtendedPopover
	},
	props: {
		group: {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>
.info {

	&-icon {
		margin-left: theme-space(3xs);
		cursor: pointer;
		outline: none;
		color: #999;
		transition: color 160ms ease;

		&.info-icon_active {
			color: theme-color(gray-700);
		}
	}

	&-popup {

		&__header {
			font-weight: 500;
			color: theme-color(gray-700);
			font-size: 16px;
			line-height: 20px;
			padding-right: 20px;
			margin-bottom: theme-space(s);
			word-break: break-word;
			text-align: left;
		}

		&__content {
			list-style: none;
			padding: 0;
			margin: 0;

			&-item {
				display: grid;
				grid-template-columns: 3fr 2fr;
				align-items: center;
				gap: theme-space(s);
				font-size: 14px;
				line-height: 16px;
				word-break: break-word;
				text-align: left;

				&:not(:last-child) {
					margin-bottom: theme-space(s);
				}
			}
		}
	}
}
</style>