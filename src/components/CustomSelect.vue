<template>
	<div class="select-wrapper" :class="{ open }">
		<div class="select" :style="{ 'z-index': zIndex }">
			<div class="select-label" ref="label" @click="toggle(true, true)">
				<span class="flex-space">{{ value }}</span>
				<i class="material-icons">keyboard_arrow_down</i>
			</div>
			<div class="select-options">
				<div
					v-for="option in list"
					class="select-option"
					:class="{ selected: value === option }"
					@click="select(option)"
				>{{ option }}</div>
			</div>
		</div>
		<div class="select-space">
			<div class="select-hide">
				<select :value="value" @blur="toggle(false)" ref="select">
					<option v-for="option in list" :value="option"></option>
				</select>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		list: Array,
		value: String
	},
	
	data () {
		return {
			isLabelClickable: true,
			open: false,
			zIndex: 0
		};
	},
	
	methods: {
		toggle (value = !this.open, byLabel) {
			if (byLabel && !this.isLabelClickable) return;
			
			this.open = value;
			if (this.open) {
				this.zIndex = 1;
				this.$refs.select.focus();
			} else {
				this.isLabelClickable = false;
				setTimeout(function () {
					this.isLabelClickable = true;
				}.bind(this), 0);
				
				setTimeout(function () {
					this.zIndex = 0;
				}.bind(this), 100);
			}
		},
		
		select (value) {
			this.value = this.$refs.select.value = value;
			this.$emit('input', value);
		}
	}
}
</script>
