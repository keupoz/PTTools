import ENGLISH from '../lang/en.json'
import RUSSIAN from '../lang/ru.json'

class Dictionary {
	constructor () {
		this.languageCodes = new Array();
		this.languages = new Object();
		
		this.subscribers = new Array();
	}
	
	$update () {
		this.current = localStorage.getItem('lang') || navigator.languages[1] || 'en';
		this.subscribers.forEach(subscriber => subscriber.call(this));
	}
	
	$addLanguage (code, name, dictionary) {
		this.languages[code] = Object.assign({ name }, dictionary);
		this.languageCodes.push(code);
	}
	
	subscribe (subscriber) {
		if (this.subscribers.indexOf(subscriber) == -1) this.subscribers.push(subscriber);
		subscriber.call(this);
	}
	
	register (namespace, object) {
		let keys = Object.keys(this.languages.en[namespace]);
		this.subscribe(function () {
			keys.forEach(key => object[key] = this.get(namespace, key));
		});
	}
	
	setLanguage (lang) {
		if (lang == this.current) return;
		
		if (lang) localStorage.setItem('lang', lang);
		else localStorage.removeItem('lang');
		
		this.$update();
	}
	
	get (namespace, key) {
		return this.languages[this.current] &&
			this.languages[this.current][namespace] &&
			this.languages[this.current][namespace][key] ||
			this.languages.en[namespace] &&
			this.languages.en[namespace][key] || namespace + '.' + key;
	}
}

let instance = new Dictionary();
instance.$addLanguage('en', 'English', ENGLISH);
instance.$addLanguage('ru', 'Русский', RUSSIAN);
instance.$update();

export default instance
