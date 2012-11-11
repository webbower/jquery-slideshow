/*
 * jQuery Slideshow Widget
 *
 * Copyright (c) 2012 Matt Bower
 * Licensed under the none license.
 *
 * Depends:
 *   jquery.js 1.8
 *   jquery.ui.core.js 1.8.17
 *   jquery.ui.widget.js 1.8.17
 */

; (function ($) {
	'use strict';

	var
		_parent = $.Widget,
		_parentProto = _parent.prototype
	;
	
	$.widget('ui.slideshow', {
		// Default options
		options: {
			loop: false, // TODO Implement looping functionality. Affects controls and autoplay. Set to true if autoplay enabled
			autoplay: false, // TODO Implement autoplay functionality. Implies loop: true
			autoplayCount: null, // TODO Implement autoplayCount. 0 = no limit, 1+ = repeat n times
			autoplayDelay: null, // TODO Implement autoplayDelay. Delay between each transition
			autoplayStop: 'interaction', // TODO Implement autoplayStop. 'interaction' (stop when user interacts with controls) or 'manual' (creates a button to stop autoplay)
			autoplayControls: false, // Whether to show autoplay controls. false (no controls), 'pause' (pause only), 'playpause' (control to start and stop)
			showPrevNext: true,
			showNav: true,
			firstSlide: 0,
			easing: 'swing',
			slideSelector: 'li',
			transition: 'toggle',
			transitionSpeed: 'slow',
			navStyle: 'numbers' // TODO Implement thumbnail nav style. "thumbnails" or "numbers"
		},

		_create: function() {
			var
				self = this,
				$root = self.element,
				elData = $root[0].dataset || $root.data(),
				optData = {},
				vpW = 0,
				vpH = 0,
				o
			;

			// Cast boolean properties
			$.each(['loop', 'showPrevNext', 'showNav'], function(i, p) {
				if(p in elData) {
					optData[p] = (elData[p] === 'true' || elData[p] === '');
					delete elData[p];
				}
			});

			$.each(['firstSlide'/*, 'autoplayCount', 'autoplayDelay'*/], function(i, p) {
				if(p in elData) {
					optData[p] = (+elData[p]);
					delete elData[p];
				}
			});
			
			$.each(elData, function(k, v) {
				optData[k] = v;
			});
			
			o = $.extend(self.options, optData);
			
			$root.addClass('ui-slideshow ui-slideshow-viewport');
			
			self._slides = $root.find(o.slideSelector).addClass('ui-slideshow-slide');

			self._slides.find('img').each(function(i, el) {
				vpW = Math.max(vpW, el.width);
				vpH = Math.max(vpH, el.height);
			});

			self._buildViewport(vpW, vpH);
			// console.log(self.uiSlideshow);
			// console.log(self._slides);
			
			if(o.showPrevNext) {
				self._buildPrevNext();
				// console.log(self._prev);
				// console.log(self._next);
			}

			if(o.showNav) {
				self._buildIndexNav();
				// console.log(self._nav);
			}
			
			self._bind();
			
			self._currentSlide = null;
			self._currentIndex = null;
			// self._autoplayCount = null;
			
			this.show(+o.firstSlide, 'direct', false);
		},

		_init: function() {},

		_setOption: function(option, value) {
			switch(option) {
				case 'transition':
					// Want to make sure the string value matches a function name or is a function. otherwise no change
					if(
						!(
							(typeof value === 'string' && value in $.ui.slideshow.transitions) ||
							$.isFunction(value)
						)
					) {
						return;
					}
					break;
			}
			
			_parentProto._setOption.call(this, option, value);

			switch(option) {
				case 'loop':
					this._refreshState(this._currentIndex);
					break;

				case 'transition':
					if(typeof value === 'string') {
						
					}
					break;
			}
			
		},

		_buildViewport: function(w, h) {
			this.element
				//.wrap('<div class="ui-slideshow-root" style="max-width:'+w+'px;max-height:'+h+'px;min-width:'+Math.floor(w/2)+'px;min-height:'+Math.floor(h/2)+'px;"></div>')
				.wrap('<div class="ui-slideshow-root" style="max-width:'+w+'px;height:'+h+'px;"></div>')
			;
			
			this.uiSlideshow = this.element.parent();
		},

		_buildPrevNext: function() {
			var self = this;
			self.uiSlideshow.append('<div class="ui-slideshow-controls"><a class="ui-slideshow-prev" href="#">Prev</a><a class="ui-slideshow-next" href="#">Next</a></div>');
			self._prev = self.uiSlideshow.find('.ui-slideshow-prev');
			self._next = self.uiSlideshow.find('.ui-slideshow-next');
		},

		_buildIndexNav: function() {
			var
				slideCount = this.length(),
				links = []
			;
			
			while(slideCount--) {
				links.push('<li><a href="#">' + ( slideCount + 1 ) + '</a></li>');
			}

			$('<div class="ui-slideshow-nav"><ul>' + links.reverse().join('') + '</ul></div>').appendTo(this.uiSlideshow);
			this._nav = this.uiSlideshow.find('.ui-slideshow-nav a');
		},

		_bind: function() {
			var self = this;
			
			self.widget()
				.on('click.ui-slideshow', '.ui-slideshow-prev', function(ev) {
					ev.preventDefault();
					if(!$(this).hasClass('ui-state-disabled')) {
						self.prev();
					}
				})
				.on('click.ui-slideshow', '.ui-slideshow-next', function(ev) {
					ev.preventDefault();
					if(!$(this).hasClass('ui-state-disabled')) {
						self.next();
					}
				})
				.on('click.ui-slideshow', '.ui-slideshow-nav a', function(ev) {
					ev.preventDefault();
					if(!$(this).hasClass('ui-state-active')) {
						self.show(self._nav.index(this), 'direct');
					}
				})
			;
		},

		_unbind: function() {
			this.widget().off('.ui-slideshow');
		},

		_refreshState: function(index) {
			var
				self = this,
				o = self.options
			;

			// Update the navigation and controls
			if(o.showPrevNext) {
				self._prev.toggleClass('ui-state-disabled', !o.loop && index === 0);
				self._next.toggleClass('ui-state-disabled', !o.loop && index === (self.length() - 1));
			}
				
			if(o.showNav) {
				self._nav
					.filter('.ui-state-active').removeClass('ui-state-active')
					.end().eq(index).addClass('ui-state-active')
				;
			}
		},

		show: function(index, action, fx) {
			var
				self = this,
				o = self.options,
				$widget = this.widget()
			;
			
			// If we're trying to show a new slide...
			if(!$widget.hasClass('ui-state-transitioning') || index !== self._currentIndex) {
				var
					currSlide = self._currentSlide,
					nextSlide = self._slides.eq(index),
					currIndex = self._currentIndex,
					nextIndex = index,
					transitionFunc
				;
				
				$widget.addClass('ui-state-transitioning');
				
				// No transition effect, just use toggle
				if(fx === false) {
					transitionFunc = $.ui.slideshow.transitions.toggle;
				}
				// Defined transition and it exists
				else if(typeof o.transition === 'string' && o.transition in $.ui.slideshow.transitions) {
					transitionFunc = $.ui.slideshow.transitions[o.transition];
				}
				// Build your own transition
				else if($.isFunction(o.transition)) {
					transitionFunc = o.transition;
				}
				// Default to toggle
				else {
					transitionFunc = $.ui.slideshow.transitions.toggle;
				}

				transitionFunc.call(
					self,
					{
						slide: currSlide,
						index: currIndex
					},
					{
						slide: nextSlide,
						index: nextIndex
					},
					action,
					o
				);
				// Store a reference to the next current slide
				self._currentSlide = nextSlide;
				// Update the current index
				self._currentIndex = index;
				
				self._refreshState(nextIndex);
				
				$widget.removeClass('ui-state-transitioning');
			}
		},

		prev: function() {
			if(!this.options.loop && this._currentIndex === 0) {
				return;
			}
			this.show(this._currentIndex === 0 ? this.length() - 1 : this._currentIndex - 1, 'prev');
		},

		next: function() {
			if(!this.options.loop && (this._currentIndex + 1) === this.length()) {
				return;
			}
			this.show((this._currentIndex + 1) % this.length(), 'next');
		},
		
		widget: function() {
			return this.uiSlideshow;
		},

		index: function() {
			return this._currentIndex;
		},

		length: function() {
			return this._slides.length;
		},

		destroy: function() {
			// Call parent method
			_parentProto.destroy.apply(this, arguments);
		}
	});
	
	$.ui.slideshow.transitions = {
		toggle: function(slide1, slide2, action, options) {
			if(slide1.slide) {
				slide1.slide.removeClass('ui-state-active');
			}
			
			slide2.slide.addClass('ui-state-active');
		},
		crossfade: function(slide1, slide2, action, options) {
			if(slide1.slide) {
				slide1.slide.fadeOut(options.transitionSpeed, options.easing);
			}
			
			slide2.slide.fadeIn(options.transitionSpeed, options.easing);
		},
		slidehorz: function(slide1, slide2, action, options) {
			var slide1End, slide2Start;
			if(action === 'next' || (action === 'direct' && slide1.index < slide2.index)) {
				slide1End = '-100%';
				slide2Start = '100%';
			} else {
				slide1End = '100%';
				slide2Start = '-100%';
			}
			slide2.slide.css('left',slide2Start).show();
			slide1.slide.animate({'left':slide1End}, options.transitionSpeed, options.easing, function() {
				$(this).hide().css('left', null);
			});
			slide2.slide.animate({'left':'0'}, options.transitionSpeed, options.easing);
		},
		slidevert: function(slide1, slide2, action, options) {
			var slide1End, slide2Start;
			if(action === 'next' || (action === 'direct' && slide1.index < slide2.index)) {
				slide1End = '-100%';
				slide2Start = '100%';
			} else {
				slide1End = '100%';
				slide2Start = '-100%';
			}
			slide2.slide.css('top', slide2Start).show();
			slide1.slide.animate({'top':slide1End}, options.transitionSpeed, options.easing, function() {
				$(this).hide().css('top', null);
			});
			slide2.slide.animate({'top':'0'}, options.transitionSpeed, options.easing);
		}
	};
})(jQuery);
