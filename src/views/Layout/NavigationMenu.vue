<template>
	<div 
		class="menu"
		:class="{ 'menu_expanded': isExpandedMenu }"
	>
		<div
			class="menu__button"
			@click.prevent="toggleMenu()"
		>
			<hide-menu-icon
				v-if="isExpandedMenu"
				class="menu__icon"
			/>

			<menu-icon
				v-else
				class="menu__icon"
			/>

			<span class="menu__item-text">Свернуть</span>
		</div>

		<router-link
			v-for="navRoute in navRoutes"
			:key="navRoute"
			:to="{ name: navRoute.route }"
			class="menu__item"
		>
			<component
				:is="navRoute.icon"
				class="menu__icon"
			/>

			<span class="menu__item-text">{{ navRoute.text }}</span>
		</router-link>
	</div>
</template>

<script>
import MenuIcon from '@/assets/icons/menu-icon.svg?inline'
import HomeIcon from '@/assets/icons/home-icon.svg?inline'
import QuotaIcon from  '@/assets/icons/quota-icon.svg?inline'
import TruckMenuIcon from '@/assets/icons/truck-menu-icon.svg?inline'
import DriversIcon from '@/assets/icons/drivers-icon.svg?inline'
import NotificationsIcon from '@/assets/icons/notifications-icon.svg?inline'
import LogsIcon from '@/assets/icons/logs-icon.svg?inline'
import PlannerIcon from '@/assets/icons/planner-icon.svg?inline'
import CalculatorIcon from '@/assets/icons/calculator-icon.svg?inline'
import DashboardIcon from '@/assets/icons/dashboard-icon.svg?inline'
import BranchesIcon from '@/assets/icons/branches-icon.svg?inline'
import HideMenuIcon from '@/assets/icons/hide-menu-icon.svg?inline'

import { ref } from 'vue'

export default {
	name: 'NavigationMenuComponent',
	components: {
		MenuIcon,
		QuotaIcon,
		TruckMenuIcon,
		DriversIcon,
		NotificationsIcon,
		LogsIcon,
		PlannerIcon,
		HomeIcon,
		CalculatorIcon,
		DashboardIcon,
		BranchesIcon,
		HideMenuIcon
	},
	setup() {
		const isExpandedMenu = ref(true)

		const navRoutes = [
			{
				route: 'home',
				text: 'Главная',
				icon: 'home-icon'
			},
			{
				route: 'needs-calculator',
				text: 'Калькулятор потребности',
				icon: CalculatorIcon
			},
			{	
				route: 'quotas',
				text: 'Квоты',
				icon: QuotaIcon
			},
			{
				route: 'dashboard',
				text: 'Дашборд',
				icon: DashboardIcon
			},
			{
				route: 'scheduler',
				text: 'Планировщик',
				icon: PlannerIcon
			},
			{
				route: 'filials',
				text: 'Филиалы',
				icon: BranchesIcon
			},
			{
				route: 'drivers',
				text: 'Водители',
				icon: DriversIcon
			},
			{
				route: 'active-legs',
				text: 'Активные плечи',
				icon: TruckMenuIcon
			},
			{
				route: 'notifications',
				text: 'Уведомления',
				icon: NotificationsIcon
			},
			{
				route: 'logs',
				text: 'Логи',
				icon: LogsIcon
			},
		]

		const toggleMenu = () => {
			isExpandedMenu.value = !isExpandedMenu.value
		}

		return {
			navRoutes,
			toggleMenu,
			isExpandedMenu
		}
	}
}
</script>

<style scoped lang="scss">
@keyframes show-stick-animation {
	0% {
		width: 0;
	}
	100% {
		width: 4px;
	}
}

.menu {
	position: sticky;
	top: 0;
    height: 100vh;
    width: 88px;
    border-right: 1px solid theme-color(gray-100);
	transition: width 0.3s ease;
	font-weight: 400;
	flex-shrink: 0;
	overflow: hidden;

	&__icon {
		flex-shrink: 0;
	}

	&__button {
		cursor: pointer;
	}

	&__item-text {
		flex-shrink: 0;
		margin-left: 34px;
	}

    &__button,
	&__item {
		display: flex;
		padding: theme-space(s) theme-space(m);
        color: theme-color(gray-500);
		line-height: 24px;
		transition: color 160ms ease, background-color 160ms ease;
    }

	.router-link {
		&::before {
			display: none;
		}
	}
	
	.router-link-active {
		position: relative;
		background: theme-color(primary-lightest);
		color: theme-color(primary);
		font-weight: 500;

		&::before {
			content: "";
			width: 4px;
			background: theme-color(primary);
			border-radius: 2px;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			animation: show-stick-animation 160ms ease;
		}
	}

    &__item:hover{
        background: theme-color(primary-lightest);
		color: theme-color(primary);
    }

    &__button:hover{
        background: theme-color(primary-lightest);
    }
}

.menu_expanded {
    width: 328px;

    .menu__button {
        color: theme-color(primary);
    }
}
</style>
