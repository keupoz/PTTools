<template>
	<div class="tab-switcher">
		<div
			v-for="(label, name) in tabs"
			:class="{ current: value == name }"
			@click.prevent="select(name)"
		>{{ label }}</div>
	</div>
</template>

<script>
export default {
	props: [ 'tabs', 'value' ],
	
	methods: {
		select (name) {
			this.value = name;
			this.$emit('input', name);
		}
	}
}
</script>
