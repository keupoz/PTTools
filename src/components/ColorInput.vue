<template>
	<div class="color-input">
		<div class="color-input-preview" :style="{ 'background-color': outputColor }"></div>
		<input
			type="text"
			checkspell="off"
			:placeholder="placeholder"
			
			ref="input"
			v-model="currentColor"
			@input="parseColor($event.target.value)"
			@focus="locked = true; $emit('focus')"
			@blur="locked = false" />
	</div>
</template>

<script>
import chroma from 'chroma-js'

import Dictionary from '../scripts/Dictionary.js'

export default {
	props: [ 'emptyAllowed', 'value' ],
	
	data () {
		let data = {
			currentColor: this.value,
			outputColor: this.value,
			
			// to prevent changing values from outside while typing
			locked: false
		};
		
		Dictionary.register('color-input', data);
		
		return data;
	},
	
	mounted () {
		let handler = e => {
			if (e.target !== this.$refs.input) this.$refs.input.blur();
		};
		document.addEventListener('click', handler);
		document.addEventListener('mousedown', handler);
		document.addEventListener('touchstart', handler);
	},
	
	methods: {
		parseColor (color) {
			if (this.currentColor === undefined) this.currentColor = color;
			
			color = color.replace(/\s+/g, '');
			
			if (color == '') {
				if (this.emptyAllowed)
					this.outputColor = undefined;
			} else try {
				this.outputColor = chroma(color).hex();
			} catch (e) {}
		}
	},
	
	watch: {
		value (value) {
			if (!this.locked) this.currentColor = this.outputColor = value;
		},
		
		outputColor (color) {
			this.$emit('input', color);
		}
	}
}
</script>
