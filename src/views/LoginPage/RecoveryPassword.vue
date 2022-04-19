<template>
	<default-page-container v-loading="isLoading">
		<div class="content">
			<button
				class="content__authorization"
				@click="route.push({ name: 'login' })"
			>
				Авторизоваться
			</button>

			<div class="content__title">
				Восстановление пароля
			</div>

			<div class="content__text">
				Чтобы зарегистироваться в системе, введите
				рабочую электронную почту
			</div>

			<div class="content__text">
				На неё будет отправлена ссылка для создания
				своего пароля
			</div>

			<div class="content__form">
				<el-form
					ref="ruleFormRef"
					:model="formData"
					status-icon
					:rules="rules"
					autocomplete="off"
					@keyup.enter="submitForm"
					@submit.prevent
				>
					<el-form-item
						prop="email"
					>
						<el-input
							v-model="formData.email"
							type="text"
							autocomplete="off"
							placeholder="электронная почта"
						/>
					</el-form-item>

					<el-collapse-transition>
						<div
							v-if="errorText"
							class="content__error"
						>
							<div
								class="content__circle"
							/>

							{{ errorText }}
						</div>
					</el-collapse-transition>

					<el-button
						type="primary"
						:loading="isLoading"
						:disabled="isInvalidForm"
						@click="submitForm(ruleFormRef)"
					>
						Получить ссылку
					</el-button>
				</el-form>
			</div>
		</div>
	</default-page-container>
</template>

<script>
import DefaultPageContainer from '@/components/DefaultPageContainer'
import { reactive, ref } from 'vue'
import { authentication } from '@/api/'
import { useRouter } from 'vue-router'

export default {
	components: {DefaultPageContainer},
	setup() {
		const route = useRouter()
		const ruleFormRef = ref(null)
		const formData = reactive({
			email: '',
		})
		const isInvalidForm = ref(true)
		const isLoading = ref(false)
		const errorText = ref('')

        
		const validateEmail = (rule, value, callback) => {
			//TODO: Вернуть проверку на имейл когда будут актуальные учетки
			//const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
			//if (!reg.test(value)) {

			console.log(value)
			if(!value) {
				callback(new Error(''))
				errorText.value = 'Адрес электронной почты введен неверно. Пожалуйста, попробуйте еще раз'
				isInvalidForm.value = true
				return
			}

			isInvalidForm.value = false
			errorText.value = ''
			callback()
		}
        
		const rules = reactive({
			email: [{ validator: validateEmail, trigger: 'change' }],
		})
        
		const submitForm = () => {
			ruleFormRef.value.validate(async (valid) => {
				if (!valid) {
					return
				}
				try {
					isLoading.value = true
					const {resp} = await authentication.forgotPassword(formData.email)
					const key = resp.split('?')[1].split('\n')[0].split('=')[1]
					await route.push({name: 'create-password', query: { key }})
				}
				catch(error) {
					console.log(error)
				}
				finally {
					isLoading.value = false
				}
			})
		}

		return {
			ruleFormRef,
			validateEmail,
			formData,
			submitForm,
			rules,
			isInvalidForm,
			isLoading,
			route,
			errorText
		}
	}
}
</script>

<style scoped lang="scss">
@import "~@/styles/loginPages.scss";
</style>