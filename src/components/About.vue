<template>
	<div class="about-component">
		<button class="material-icons" @click="opened = true">info_outline</button>
		
		<div class="about" v-show="opened">
			<header>
				<div class="flex-space">About</div>
				<button class="material-icons" @click="opened = false">close</button>
			</header>
			<div class="content">
				These tools are tools for <a href="https://pony.town" target="_blank">PonyTown</a> game which can help you create an awesome character.<br />
				<div class="small-space"></div>
				<strong>Author:</strong> <a href="https://github.com/keupoz" target="_blank">Keupoz</a>
				
				<div class="space"></div>
				
				<h3>Used assets:</h3>
				<div class="small-space"></div>
				<ul>
					<li><strong>Flag icons</strong> - free flag icons by <a href="https://www.flaticon.com/packs/international-flags" target="_blank">Freepik</a></li>
					<li><strong>Material icons</strong> - <a href="https://material.io/tools/icons/" target="_blank">Material icons font</a> by Google</li>
				</ul>
				
				<div class="space"></div>
				
				<h3>Used libraries</h3>
				<div class="small-space"></div>
				<ul>
					<li><a href="https://vuejs.org" target="_blank">Vue.js</a></li>
					<li><a href="https://clipboardjs.com" target="_blank">Clipboard.js</a></li>
					<li><a href="https://gka.github.io/chroma.js/" target="_blank">chroma.js</a></li>
					<li><a href="https://keupoz.github.io/ColorWheel/" target="_blank">ColorWheel</a></li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			opened: false
		};
	}
}
</script>
