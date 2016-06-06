/* Licensed under the Apache License, Version 2.0. © 2016 Yury Shulaev <yury.shulaev@gmail.com> */
'use strict'

class SatoriServer {
	constructor() {
		this.html = this.createTagFactories(this.constructor.TAGS);
		Object.assign(this, this.html);
		this.Key = this.constructor.Key;
	}

	createTagFactories(tags, obj) {
		obj = obj || {};
		tags.forEach(tag => {obj[tag] = (modifiers, content) => this.create(tag, modifiers, content)});
		return obj;
	}

	create(tag, modifiers, content) {
		if (modifiers === null || typeof modifiers !== 'object' || modifiers.constructor !== Object) {
			if (content) {
				throw new Error('Invalid arguments');
			}

			content = modifiers;
			modifiers = {};
		}

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

		content = this.getValue(content != null ? content : modifiers.content);

		if (content instanceof Array) {
			content = content.join('');
		}

		return '<' + tag + (attrs.length ? ' ' + attrs.join(' ') : '') + '>' + (content || '') + '</' + tag + '>';
	}

	class(classes) {
		let classesStr = '';

		if (typeof classes !== 'object') {
			classesStr += classes;
		} else if (classes instanceof Array) {
			classesStr = classes.join(' ');
		} else {
			for (let cls in classes) {
				if (this.getValue(classes[cls])) {
					classesStr += (classesStr ? ' ' : '') + cls;
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
				attrsStr += (attrsStr ? ' ' : '') + attr + '="' + value + '"';
			}
		}

		return attrsStr;
	}

	data(data) {
		let dataStr = '';

		for (let key in data) {
			let value = this.getValue(data[key]);

			if (value != null && value !== false) {
				dataStr += (dataStr ? ' ' : '') + 'data-' + key + '="' + value + '"';
			}
		}

		return dataStr;
	}

	css(css) {
		let cssStr = '';

		for (let key in css) {
			let value = this.getValue(css[key]);

			if (value != null && value !== false) {
				cssStr += (cssStr ? ' ' : '') + key + ': ' + value + ';';
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

// todo: Reuse between client-side and server-side implementations
SatoriServer.TAGS = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li', 'strong', 'em', 'a', 'p', 'br', 'section',
	'header', 'footer', 'nav', 'article', 'img', 'table', 'tr', 'td', 'hr', 'form', 'fieldset', 'button', 'input',
	'label', 'select', 'option', 'textarea', 'blockquote', 'thead', 'tbody', 'tfoot', 'pre', 'code', 'sub', 'sup',
	'abbr', 'audio', 'video', 'canvas', 'dl', 'dd', 'dt', 'kbd',
];

SatoriServer.Key = {};

module.exports = {SatoriServer};
