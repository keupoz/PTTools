<template>
	<div>
		<div class="fixed-header">
			<header>
				<div class="app-title" :data-version="version">PonyTown tools</div>
				<div class="flex-space"></div>
				<language-switcher />
				<about />
			</header>
			
			<tab-switcher :tabs="tabs" v-model="tab" />
		</div>
		
		<div class="tabs">
			<color-info v-show="tab == 'color-info'" />
			<gradient-editor v-show="tab == 'gradient-editor'" />
		</div>
	</div>
</template>

<script>
import About            from './About.vue'
import ColorInfo        from './ColorInfo.vue'
import GradientEditor   from './GradientEditor.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import TabSwitcher      from './TabSwitcher.vue'

import Dictionary from '../scripts/Dictionary.js'

import { version } from '../../package.json'

export default {
	components: { About, ColorInfo, GradientEditor, LanguageSwitcher, TabSwitcher },
	
	data () {
		let data = {
			version,
			
			tab: localStorage.getItem('tab') || 'color-info',
			tabs: {}
		};
		
		Dictionary.register('tabs', data.tabs);
		
		return data;
	},
	
	watch: {
		tab (tab) {
			localStorage.setItem('tab', tab);
		}
	}
}
</script>
