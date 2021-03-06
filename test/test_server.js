'use strict'

require('mocha');
const {SatoriServer} = require('..');
const assert = require('chai').assert;

describe('SatoriServer', function () {
	let view;
	let h;
	let model;
	let array;

	beforeEach(function () {
		let rawModel = {
			id: 0,
			title: 'First',
			text: 'Text',
			tags: ['One', 'Two'],
			isPublished: false,
		};

		let rawArray = [rawModel, {id: 1, title: 'Second', text: 'Content'}, {id: 2, title: 'Third', text: 'Content'}];
		view = new SatoriServer(global);
		h = view.h;
		model = view.proxy(rawModel);
		array = view.proxy(rawArray);
	});

	describe('create', function () {
		it('should create element with text', function () {
			let html = h('h1', null, model.title);
			assert.equal(html, '<h1>First</h1>');
		});

		it('should create element with children', function () {
			let html = h('h1', null, [h('span', null, model.title), h('span', null, 'Test')]);
			assert.equal(html, '<h1><span>First</span><span>Test</span></h1>');
		});

		it('should create element with class', function () {
			let html = h('h1', {class: 'header'}, model.title);
			assert.equal(html, '<h1 class="header">First</h1>');
		});

		it('should create element with class using object, true', function () {
			let html = h('h1', {class: {header: true}}, model.title);
			assert.equal(html, '<h1 class="header">First</h1>');
		});

		it('should create element with class using object, false', function () {
			let html = h('h1', {class: {title: true, header: false}}, model.title);
			assert.equal(html, '<h1 class="title">First</h1>');
		});

		it('should create element with attribute', function () {
			let html = h('h1', {attr: {id: 'header'}}, model.title);
			assert.equal(html, '<h1 id="header">First</h1>');
		});

		it('should create element with data', function () {
			let html = h('h1', {data: {a: 123}}, model.title);
			assert.equal(html, '<h1 data-a="123">First</h1>');
		});

		it('should create element with CSS', function () {
			let html = h('h1', {css: {color: 'blue'}}, model.title);
			assert.equal(html, '<h1 style="color: blue;">First</h1>');
		});
	});

	describe('list', function () {
		let item = value => h('li', null, value.title);
		let itemHtml = value => '<li>' + value.title + '</li>';

		it('should create elements for array items', function () {
			let html = h('ul', {list: {array: () => array, item}});
			assert.equal(html, '<ul>' + array.map(itemHtml).join('') + '</ul>');
		});
	});
});
