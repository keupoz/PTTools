<template>
	<div
		class="color-preview"
		:class="{ faded }"
		:style="{ 'background-color': hex, 'color': textColor }"
		
		:data-hint="hint"
		:data-success="success"
	>{{ hexPreview }}</div>
</template>

<script>
import Dictionary from '../scripts/Dictionary.js'

export default {
	props: {
		hex: {
			default: '#000000'
		},
		faded: Boolean
	},
	
	data () {
		let data = {};
		Dictionary.register('color-preview', data);
		return data;
	},
	
	computed: {
		hexPreview () {
			return this.hex.replace(/^#/, '');
		},
		
		textColor () {
			let color = parseInt(this.hexPreview, 16),
			    r = (color >> 16) & 0xff,
			    g = (color >> 8) & 0xff,
			    b = color & 0xff;
			
			return 0.299 * r + 0.587 * g + 0.114 * b > 127.5 ? '#000000' : '#ffffff';
		}
	}
}
</script>
