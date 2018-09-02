<template>
	<div class="gradient">
		<color-preview
			class="big"
			
			v-for="i in 6"
			v-show="i <= gradient.length"
			:key="'color-' + (i - 1)"
			
			:faded="check && !check[i - 1]"
			:hex="gradient[i - 1]" />
	</div>
</template>

<script>
import ColorPreview from './ColorPreview.vue'

export default {
	props: [ 'gradient', 'check' ],
	
	components: { ColorPreview }
}
</script>
