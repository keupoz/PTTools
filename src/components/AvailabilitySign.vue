<template>
	<i class="material-icons" :style="{ color }">{{ icon }}</i>
</template>

<script>
export default {
	props: [ 'state' ],
	
	computed: {
		color () {
			return this.state ? '#55aa55' : '#ff6347';
		},
		
		icon () {
			return this.state ? 'check' : 'close';
		}
	}
}
</script>
