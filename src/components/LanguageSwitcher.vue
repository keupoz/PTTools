<template>
	<div class="language-switcher">
		<img
			width="30"
			v-for="code in languageCodes"
			:class="{ selected: current == code }"
			:src="flagUrl(code)"
			:title="languages[code].name"
			@click="setLanguage(code)" />
	</div>
</template>

<script>
import Dictionary from '../scripts/Dictionary.js'

export default {
	data () {
		let data = {
			languageCodes: Dictionary.languageCodes,
			languages: Dictionary.languages
		};
		
		Dictionary.subscribe(function () {
			data.current = Dictionary.current;
		});
		
		return data;
	},
	
	methods: {
		flagUrl (code) {
			return 'assets/flags/' + code + '.svg';
		},
		
		setLanguage (code) {
			Dictionary.setLanguage(code);
		}
	}
}
</script>
