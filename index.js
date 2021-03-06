/* Licensed under the Apache License, Version 2.0. © 2016 Yury Shulaev <yury.shulaev@gmail.com> */
'use strict'

const escapeHtml = require('escape-html');

class SatoriServer {
	constructor() {
		this.Key = this.constructor.Key;
		this.h = (...args) => this.create(...args);
	}

	create(tag, modifiers, content) {
		modifiers = modifiers || {};
		let attrs = [];

		if (modifiers.class) {
			attrs.push(this.class(modifiers.class));
		}

		if (modifiers.attr) {
			attrs.push(this.attr(modifiers.attr));
		}

		if (modifiers.data) {
			attrs.push(this.data(modifiers.data));
		}

		if (modifiers.css) {
			attrs.push(this.css(modifiers.css));
		}

		if (modifiers.bind) {
			attrs.push(this.bind(modifiers.bind, modifiers));
		}

		if (modifiers.list) {
			content = this.list(modifiers.list);
		}

		const openingTag = '<' + tag + (attrs.length ? ' ' + attrs.join(' ') : '') + '>';
		const isShortTag = this.constructor.SHORT_TAGS.indexOf(tag) !== -1;

		if (isShortTag) {
			return new SafeString(openingTag);
		}

		content = this.getValue(content != null ? content : modifiers.content);
		let escapedContent = '';

		if (content instanceof Array) {
			escapedContent = content.filter(x => x != null).map(conditionalEscape).join('');
		} else if (content != null) {
			escapedContent = conditionalEscape(content);
		}

		return new SafeString(openingTag + escapedContent + '</' + tag + '>');
	}

	class(classes) {
		let classesStr = '';

		if (typeof classes !== 'object') {
			classesStr += escapeHtml(classes);
		} else if (classes instanceof Array) {
			classesStr = escapeHtml(classes.join(' '));
		} else {
			for (let cls in classes) {
				if (this.getValue(classes[cls])) {
					classesStr += (classesStr ? ' ' : '') + escapeHtml(cls);
				}
			}
		}

		return classesStr ? 'class="' + classesStr + '"' : '';
	}

	attr(attrs) {
		let attrsStr = '';

		for (let attr in attrs) {
			let value = this.getValue(attrs[attr]);

			if (value != null && value !== false) {
				attrsStr += (attrsStr ? ' ' : '') + attr + '="' + escapeHtml(value) + '"';
			}
		}

		return attrsStr;
	}

	data(data) {
		let dataStr = '';

		for (let key in data) {
			let value = this.getValue(data[key]);

			if (value != null && value !== false) {
				dataStr += (dataStr ? ' ' : '') + 'data-' + key + '="' + escapeHtml(value) + '"';
			}
		}

		return dataStr;
	}

	css(css) {
		let cssStr = '';

		for (let key in css) {
			let value = this.getValue(css[key]);

			if (value != null && value !== false) {
				cssStr += (cssStr ? ' ' : '') + escapeHtml(key) + ': ' + escapeHtml(value) + ';';
			}
		}

		return cssStr ? 'style="' + cssStr + '"' : '';
	}

	bind(bind, mods) {
		let to = bind.to || (mods.attr && mods.attr.type === 'checkbox' ? 'checked' : 'value');
		let value = bind.model[bind.key];
		return this.attr({[to]: () => value === true ? '' : value});
	}

	list(params) {
		let array = this.getValue(params.array);
		return array ? array.map(params.item) : [];
	}

	getValue(value) {
		return typeof value === 'function' ? value() : value;
	}

	proxy(obj) {
		return obj;
	}

	unproxy(obj) {
		return obj;
	}

	observer(name, func) {
		func();
	}

	inputKeyHandler() {
	}

	sortCompare(a, b) {
		return a !== b ? +(a > b) || -1 : 0;
	}

	pluralize(word, count) {
		return word + (count !== 1 ? 's' : '');
	}
}

function conditionalEscape(str) {
	return str instanceof SafeString ? str.value : escapeHtml(str);
}

class SafeString {
	constructor(value) {
		this.value = value;
	}

	toString() {
		return this.value;
	}

	valueOf() {
		return this.value;
	}
}

SatoriServer.SHORT_TAGS = ['meta', 'link', 'br', 'input'];

SatoriServer.Key = {};

module.exports = {SatoriServer, SafeString};
