<template>
	<div class="color-info">
		<color-input v-model="color" @input="calcHSV" />
		<div class="space"></div>
		
		<color-picker :hsv="color_hsv" @input="setHSV" />
		<div class="space"></div>
		
		<table>
			<tr>
				<td>{{ lang['remove-outline'] }}</td>
				<td><color-preview :hex="removeOutline" /></td>
				<td><availability-sign :state="removeOutline_check" /></td>
			</tr>
			<tr>
				<td>{{ lang['shadow-outline'] }}</td>
				<td><color-preview :hex="shadowOutline" /></td>
				<td><availability-sign :state="shadowOutline_check" /></td>
			</tr>
		</table>
		<div class="space"></div>
		
		<h3>{{ lang['technical-colors'] }}</h3>
		<div class="space"></div>
		
		<table>
			<tr>
				<td>{{ lang['blush'] }}</td>
				<td><color-preview hex="ff89ae" :faded="isBlushDark" /></td>
				<td><color-preview hex="c90040" :faded="!isBlushDark" /></td>
			</tr>
			<tr>
				<td>{{ lang['rendered-outline'] }}</td>
				<td><color-preview :hex="renderedOutline_main" /></td>
				<td><color-preview :hex="renderedOutline_auto" /></td>
			</tr>
			<tr>
				<td>{{ lang['computed-outline'] }}</td>
				<td><color-preview :hex="computedOutline" /></td>
				<td></td>
			</tr>
			<tr>
				<td>{{ lang['shadow'] }}</td>
				<td><color-preview :hex="shadowColor" /></td>
				<td></td>
			</tr>
		</table>
	</div>
</template>

<script>
import AvailabilitySign from './AvailabilitySign.vue'
import ColorInput       from './ColorInput.vue'
import ColorPicker      from './ColorPicker.vue'
import ColorPreview     from './ColorPreview.vue'

import chroma from 'chroma-js'

import Dictionary from '../scripts/Dictionary.js'
import { hsv2hex, prepareToRender, renderOutline, computeOutline, shadow, check } from '../scripts/utils.js'

export default {
	components: { AvailabilitySign, ColorInput, ColorPicker, ColorPreview },
	
	data () {
		let color = localStorage.getItem('color') || 'forestgreen',
		    color_hsv = chroma(color).hsv(),
		    data = {
				lang: {},
				
				color,
				color_hsv
			};
		
		// make monochrome colors red
		if (isNaN(color_hsv[0])) color_hsv[0] = 0;
		
		Dictionary.register('color-info', data.lang);
		
		return data;
	},
	
	computed: {
		isBlushDark () {
			let [ h,s,v ] = this.color_hsv;
			return (h > 280 || h < 30) && s < 0.6 && s > 0.2 && v > 0.5;
		},
		
		shadowColor_hsv () {
			return shadow(this.color_hsv);
		},
		
		shadowColor () {
			return hsv2hex(this.shadowColor_hsv);
		},
		
		removeOutline_hsv () {
			return prepareToRender(this.color_hsv);
		},
		
		removeOutline () {
			return hsv2hex(this.removeOutline_hsv);
		},
		
		removeOutline_check () {
			return check(this.removeOutline_hsv, this.color_hsv);
		},
		
		shadowOutline_hsv () {
			return prepareToRender(this.shadowColor_hsv);
		},
		
		shadowOutline () {
			return hsv2hex(this.shadowOutline_hsv);
		},
		
		shadowOutline_check () {
			return check(this.shadowOutline_hsv, this.shadowColor_hsv);
		},
		
		computedOutline_hsv () {
			return computeOutline(this.color_hsv);
		},
		
		computedOutline () {
			return hsv2hex(this.computedOutline_hsv);
		},
		
		renderedOutline_main () {
			return hsv2hex(renderOutline(this.color_hsv));
		},
		
		renderedOutline_auto () {
			return hsv2hex(renderOutline(this.computedOutline_hsv));
		}
	},
	
	methods: {
		calcHSV () {
			let hsv = chroma(this.color).hsv();
			
			if (isNaN(hsv[0])) hsv[0] = this.color_hsv[0];
			
			this.color_hsv = hsv;
		},
		
		setHSV (hsv) {
			// hsv is always the same array here, so it's not reactive and has to be recreated
			this.color_hsv = [...hsv];
			this.color = hsv2hex(hsv);
		}
	},
	
	watch: {
		color (color) {
			localStorage.setItem('color', color);
		}
	}
}
</script>
