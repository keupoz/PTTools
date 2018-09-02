<template>
	<div class="color-picker" ref="container"></div>
</template>

<script>
import ColorWheel from 'colorwheel'

export default {
	props: [ 'hsv' ],
	
	data () {
		let picker = new ColorWheel(state => {
			switch (state) {
				case 1:
					this.locked = true;
					this.$emit('input', this.picker.HSV);
					break;
				case 2:
					this.locked = false;
					break;
			}
		});
		picker.setHSV.apply(picker, this.hsv);
		
		return {
			picker,
			
			// to prevent changing from outside while changing tone
			locked: false
		};
	},
	
	mounted () {
		this.$refs.container.appendChild(this.picker.canvas);
	},
	
	watch: {
		hsv (hsv) {
			if (!this.locked) this.picker.setHSV.apply(this.picker, hsv);
		}
	}
}
</script>
