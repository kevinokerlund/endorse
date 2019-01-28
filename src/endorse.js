const rules = {};

export default class Endorse {
	static get rules() {
		return rules;
	}

	static addRule(name, cb) {
		rules[name] = cb;
	}

	static isFormValid(form) {
		return Array
			.from(form.querySelectorAll('[data-endorse]:not([data-endorse=""])'))
			.every(Endorse.isFieldValid);
	}

	static isFieldValid(field) {
		const ruleText = field.getAttribute('data-endorse');
		const fieldRules = parseRules(ruleText);

		if (!fieldRules.required && !rules.required(field)) {
			return true;
		}

		return Object.keys(fieldRules).every(rule => test(field, rule, ...fieldRules[rule]));
	}

	static handleSubmit(e) {
		e.preventDefault();
		console.log('SUBMISSION CAUGHT', e);
		if (Endorse.isFormValid(e.target)) {
			console.log('Let it through');
		}
	}

	static form(form) {
		console.log('You want me to endorse this form?', form);
		form.onsubmit = Endorse.handleSubmit;
	}
}

function test(field, name, ...args) {
	return rules[name](field, ...args);
}

function parseRules(ruleText) {
	return splitOnUnescaped(ruleText, ',')
		.map(rule => rule.trim())
		.map(rule => splitOnUnescaped(rule, ':'))
		.reduce((obj, rule) => {
			obj[rule[0]] = rule.slice(1);
			return obj;
		}, {});
}

function splitOnUnescaped(string, delimiter) {
	let regex = new RegExp(`(\\\\*)${delimiter}`, 'g');
	return string
		.replace(regex, (m, c) => (c.length % 2) ? m : 'ENDORSE__SPLIT')
		.split('ENDORSE__SPLIT');
}

Endorse.addRule('required', element => element.value !== '');
Endorse.addRule('number', element => !isNaN(parseFloat(element.value)) && isFinite(element.value));
Endorse.addRule('min', (element, min) => parseInt(element.value) >= parseInt(min));
Endorse.addRule('max', (element, max) => parseInt(element.value) <= parseInt(max));
Endorse.addRule('minLength', (element, minLength) => element.value.length >= parseInt(minLength));
Endorse.addRule('maxLength', (element, maxLength) => element.value.length <= parseInt(maxLength));
Endorse.addRule('pattern', (element, pattern) => new RegExp(pattern).test(element.value));
Endorse.addRule('length', (element, min, max = min) => {
	return rules['minLength'](element, min) && rules['maxLength'](element.value, max);
});
