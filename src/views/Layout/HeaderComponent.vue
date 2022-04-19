<template>
	<header class="layout-header">
		<div class="layout-header__breadcrumbs">
			<template 
				v-for="(route, index) in breadCrumbs"
				:key="index"
			>
				<router-link 
					v-if="index !== breadCrumbs.length - 1"
					:to="{ name: route.name }"
					class="layout-header__route"
				>
					{{ route.title }}
				</router-link>

				<div 
					v-else
					class="layout-header__route layout-header__route_last"
				>
					{{ route.title }}
				</div>

				<el-icon
					v-if="index !== breadCrumbs.length - 1"
				>
					<arrow-right-bold />
				</el-icon>
			</template>
		</div>
	</header>
</template>

<script>
import { ArrowRightBold } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import { computed, unref } from 'vue'

export default {
	components: {
		ArrowRightBold
	},
	setup() {
		const route = useRoute()

		const breadCrumbs = computed(() => {
			return route.matched
				.filter(item => item.meta.title)
				.map(item => {
					return {
						name: item.name,
						title: unref(item.meta.title),
						params: route.params
					}
				})
		})

		return {
			breadCrumbs
		}
	}
}
</script>

<style lang="scss" scoped>
.layout-header {
	padding: theme-space(s) theme-space(m);

	&__breadcrumbs {
		display: flex;
		align-items: center;
		gap: theme-space(s);
	}

	&__route {
		font-size: 18px;
		line-height: 24px;
		font-weight: 600;
		color: theme-color(gray-700);
		transition: color 160ms ease;

		&:not(&_last) {
			cursor: pointer;
			color: theme-color(gray-300);
		}
	}
}

.el-icon {
	color: theme-color(gray-300);
}
</style>
