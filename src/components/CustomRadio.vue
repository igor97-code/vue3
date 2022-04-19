<template>
	<div
		class="radio-group"
	>
		<label
			class="radio-element"
			:class="{'radio-element_active': label === radioModel.modelValue}"
			@click="radioModel.changeRadio(label)"
		>
			<span class="radio-element__input" />
			<span class="radio-element__label">
				<slot />
			</span>
		</label>
	</div>
</template>

<script>
import {inject} from 'vue'

export default {
	props: {
		label: {
			type: String,
			required: true
		}
	},
	setup() {
		const radioModel = inject('radio')

		return {
			radioModel,
		}
	}
}
</script>

<style scoped lang="scss">
.radio {
    &-element {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: theme-space(2xs) 20px;
        border-radius: 8px;

        &:not(:first-child) {
            margin-top: 8px;
        }

        &:hover {
            background: theme-color(gray-100);
        }

        &__input {
            width: 16px;
            height: 16px;
            background:  theme-color(gray-300);
            border-radius: 50%;
            display: inline-block;
            position: relative;

            &:after {
                content: '';
                width: 8px;
                height: 8px;
                position: absolute;
                left: 50%;
                top: 50%;
                background: theme-color(primary);
                border-radius: 50%;
                transform: translate(-50%,-50%) scale(0);
                transition: transform .15s ease-in;
            }
        }

        &_active {
            background: theme-color(gray-100);

            .radio-element__input {
                background: theme-color(primary-light);

                &:after {
                    transform: translate(-50%,-50%) scale(1);
                }
            }

            .radio-element__label {
                color: theme-color(primary);
            }
        }

        &__label {
            margin-left: 20px;
            font-size: 14px;
            line-height: 16px;
            color: theme-color(gray-500);
        }
    }
}
</style>