<template>
  <div
    class="vue-select"
    :class="{ open }"
    @click.stop
    @keyup.esc="hideDropdown">

    <label @click="toggleDropdown">{{ label }}</label>

    <div @click="toggleDropdown" class="vue-select--label">
      <label>{{ current }}</label>
      <button class="material-icons">keyboard_arrow_down</button>
    </div>

    <ul class="vue-select--options">
      <li
        v-for="option in options"
        :key="option"
        :class="{ selected: current == option }"

        @click="select(option)">{{ option }}</li>
    </ul>
  </div>
</template>

<script>
let last = null;

function hideLast () {
  if (last) last.hideDropdown();
}

document.body.addEventListener('click', hideLast);

export default {
  props: [ 'label', 'options', 'value' ],

  data () {
    return {
      open: false,
      current: this.value
    };
  },

  methods: {
    showDropdown () {
      this.open = true;
      hideLast();
      last = this;
    },

    hideDropdown () {
      this.open = false;
      last = null;
    },

    toggleDropdown () {
      if (this.open) this.hideDropdown();
      else this.showDropdown();
    },

    select (option) {
			this.current = option;
      this.hideDropdown();
      this.$emit('input', option);
    }
  },

  watch: {
    value (newVal) {
      this.current = newVal;
    }
  }
}
</script>
