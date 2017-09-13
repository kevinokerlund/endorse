const rules = {};

export default class Endorse {
	static addRule(name, cb) {
		rules[name] = cb;
	}

	static formIsValid(form) {
		return Array
			.from(form.querySelectorAll('[data-endorse]:not([data-endorse=""])'))
			.every(Endorse.fieldIsValid);
	}

	static fieldIsValid(field) {
		const ruleText = field.getAttribute('data-endorse');
		const fieldRules = parseRules(ruleText);
		const fieldRuleNames = fieldRules.map(rule => rule[0]);
		if (!fieldRuleNames.includes('required') && !rules['required'](field.value)) {
			return true;
		}
		return fieldRules.every(rule => test(field.value, ...rule));
	}
}

function test(value, name, ...args) {
	return rules[name](value, ...args);
}

function parseRules(ruleText) {
	return splitOnUnescaped(ruleText, ',\\s+')
		.map(rule => splitOnUnescaped(rule, ':'));
}

function splitOnUnescaped(string, delimiter) {
	let regex = new RegExp(`(\\\\*)${delimiter}`, 'g');
	return string
		.replace(regex, (m, c) => (c.length % 2) ? m : 'ENDORSE__SPLIT')
		.split('ENDORSE__SPLIT');
}

Endorse.addRule('required', value => value.trim() !== '');
Endorse.addRule('number', value => !isNaN(parseFloat(value)) && isFinite(value));
Endorse.addRule('min', (value, min) => parseInt(value) >= parseInt(min));
Endorse.addRule('max', (value, max) => parseInt(value) <= parseInt(max));
Endorse.addRule('minLength', (value, minLength) => value.length >= parseInt(minLength));
Endorse.addRule('maxLength', (value, maxLength) => value.length <= parseInt(maxLength));
Endorse.addRule('pattern', (value, pattern) => new RegExp(pattern).test(value));
Endorse.addRule('length', (value, min, max = min) => {
	return rules['minLength'](value, min) && rules['maxLength'](value, max);
});
