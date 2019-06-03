<template>
	<div class="gradient-editor">
		<strong>{{ lang['original'] }}</strong>
		<div class="small-space"></div>
		<gradient :gradient="gradient" />

		<div class="space"></div>

		<strong>{{ lang['remove-outline'] }}</strong>
		<div class="small-space"></div>
		<gradient :gradient="removeOutline" :check="removeOutline_check" />

		<div class="space"></div>

		<strong>{{ lang['shadow-outline'] }}</strong>
		<div class="small-space"></div>
		<gradient :gradient="shadowOutline" :check="shadowOutline_check" />

		<div class="space"></div>

		<strong>{{ lang['steps'] }}: {{ gradientLength }}</strong>
		<div class="small-space"></div>
		<input type="range" min="3" max="6" step="1" v-model.number="gradientLength" />

		<div class="space"></div>

		<strong>{{ lang['mode'] }}</strong>
		<div class="small-space"></div>
		<custom-select :options="gradientModes" v-model="gradientMode" />

		<div class="space"></div>

		<strong>{{ lang['first-color'] }}</strong>
		<div class="small-space"></div>
		<color-input
			v-model="firstColor"
			@focus="selectInput('firstColor')"
			@input="calcHSV" />

		<div class="space"></div>

		<strong>{{ lang['middle-color'] }}</strong>
		<div class="small-space"></div>
		<color-input
			:emptyAllowed="true"
			v-model="middleColor"
			@focus="selectInput('middleColor')"
			@input="calcHSV" />

		<div class="space"></div>

		<strong>{{ lang['last-color'] }}</strong>
		<div class="small-space"></div>
		<color-input
			v-model="lastColor"
			@focus="selectInput('lastColor')"
			@input="calcHSV" />

		<div v-if="hsv" class="space"></div>

		<color-picker v-if="hsv" :hsv="hsv" @input="setHSV" />
	</div>
</template>

<script>
import CustomSelect from './CustomSelect.vue'
import ColorInput   from './ColorInput.vue'
import ColorPicker  from './ColorPicker.vue'
import Gradient     from './Gradient.vue'

import chroma from 'chroma-js'

import Dictionary from '../scripts/Dictionary.js'
import { hsv2hex, prepareToRender, shadow, renderOutline, check } from '../scripts/utils.js'

export default {
	components: { CustomSelect, ColorInput, ColorPicker, Gradient },

	data () {
		let data = {
			lang: {},

			gradientLength: +localStorage.getItem('gradient_length') || 6,
			gradientMode: localStorage.getItem('gradient_mode') || 'RGB',
			gradientModes: [ 'RGB', 'HSL', 'Lch', 'Lab' ],

			firstColor: localStorage.getItem('first_gradient_color') || 'gold',
			middleColor: localStorage.getItem('middle_gradient_color') || undefined,
			lastColor: localStorage.getItem('last_gradient_color') || 'maroon',

			currentInput: undefined,
			hsv: undefined
		};

		Dictionary.register('gradient-editor', data.lang);

		return data;
	},

	computed: {
		gradient () {
			let colors = new Array();
			colors.push(this.firstColor);
			if (this.middleColor) colors.push(this.middleColor);
			colors.push(this.lastColor);

			return chroma
				.scale(colors)
				.mode(this.gradientMode.toLowerCase())
				.colors(this.gradientLength);
		},

		gradient_hsv () {
			return this.gradient.map(hex => chroma(hex).hsv());
		},

		removeOutline_hsv () {
			return this.gradient_hsv.map(hsv => prepareToRender(hsv));
		},

		removeOutline_check () {
			return this.removeOutline_hsv.map((hsv, i) => check(hsv, this.gradient_hsv[i]));
		},

		removeOutline () {
			return this.removeOutline_hsv.map(hsv => hsv2hex(hsv));
		},

		shadow_hsv () {
			return this.gradient_hsv.map(hsv => shadow(hsv));
		},

		shadowOutline_hsv () {
			return this.shadow_hsv.map(hsv => prepareToRender(hsv));
		},

		shadowOutline_check () {
			return this.shadowOutline_hsv.map((hsv, i) => check(hsv, this.shadow_hsv[i]));
		},

		shadowOutline () {
			return this.shadowOutline_hsv.map(hsv => hsv2hex(hsv));
		}
	},

	methods: {
		selectInput (input) {
			this.currentInput = input;
			this.calcHSV(this[input]);
		},

		setHSV (hsv) {
			this.hsv = hsv;
			this[this.currentInput] = hsv2hex(hsv);
		},

		calcHSV (color) {
			if (color) {
				let hsv = chroma(color).hsv();
				if (isNaN(hsv[0])) hsv[0] = this.hsv && this.hsv[0] || 0;
				this.hsv = hsv;
			} else this.hsv = [0,1,1];
		}
	},

	watch: {
		firstColor (color) {
			localStorage.setItem('first_gradient_color', color);
		},

		middleColor (color) {
			if (color === undefined) localStorage.removeItem('middle_gradient_color');
			else localStorage.setItem('middle_gradient_color', color);
		},

		lastColor (color) {
			localStorage.setItem('last_gradient_color', color);
		},

		gradientLength (length) {
			localStorage.setItem('gradient_length', length);
		},

		gradientMode (mode) {
			localStorage.setItem('gradient_mode', mode);
		}
	}
}
</script>
