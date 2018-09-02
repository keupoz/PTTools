import Vue from 'vue'
import Clipboard from 'clipboard'

import App from '../components/App.vue'

new Clipboard('.color-preview', { target: trigger => trigger }).on('success', function (e) {
	e.trigger.classList.add('copied');
	setTimeout(function () {
		e.trigger.classList.remove('copied');
	}, 1500);
});

new Vue({
    el: '#app',
    render: h => h(App)
});
