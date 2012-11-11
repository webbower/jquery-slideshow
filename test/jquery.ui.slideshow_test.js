/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
	*/

	module('jQueryUI#slideshow', {
		setup: function() {
			this.slideshow = $('#qunit-fixture').children('.slideshow');
		}
	});

	test('is chainable', 1, function() {
		// Not a bad test to run on collection methods.
		strictEqual(this.slideshow.slideshow({}), this.slideshow, 'should be chaninable');
	});

	test('has data-* properly read in and cast', 4, function() {
		var $slideshow = this.slideshow.slideshow({});
		strictEqual($slideshow.slideshow('option', 'transition'), 'slidehorz', 'Should read in attributes to options');
		strictEqual($slideshow.slideshow('option', 'loop'), true, 'Boolean attribute with only property name should cast correctly');
		strictEqual($slideshow.slideshow('option', 'showNav'), false, 'Boolean attribute set to "false" should cast correctly');
		strictEqual($slideshow.slideshow('option', 'firstSlide'), 2, 'Should cast numerical attributes correctly');
	});

	test('initializes properly', 2, function() {
		var $slideshow = this.slideshow.slideshow({
			firstSlide: 2,
			showPrevNext: false,
			showNav: false
		});
		strictEqual($slideshow.slideshow('index'), 2, 'Current index should be 2');
		strictEqual($slideshow.slideshow('length'), 5, 'Current index should be 2');
	});

}(jQuery));