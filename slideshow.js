// TODO Add ability for nav to slide if nav is longer than can be shown in module
// TODO Might need to add prev/next controls for nav :-/
;(function($) {
    // Pre ready() code goes here
	if(!window.Slideshow) Slideshow = {};

	$.extend(Slideshow, {
		_currentSlide: null,
		_currentIndex: null,
		_slides: null,
		_nav: null,
		_prev: null,
		_next: null,
		_autoplayCount: null,
		length: 0,
		element: null,
		options: {
			loop: false, // TODO Implement looping functionality. Affects controls and autoplay. Set to true if autoplay enabled
			autoplay: false, // TODO Implement autoplay functionality. Implies loop: true
			autoplayCount: null, // TODO Implement autoplayCount. 0 = no limit, 1+ = repeat n times
			autoplayDelay: null, // TODO Implement autoplayDelay. Delay between each transition
			autoplayStop: 'interaction', // TODO Implement autoplayStop. 'interaction' (stop when user interacts with controls) or 'manual' (creates a button to stop autoplay)
			autoplayControls: false, // Whether to show autoplay controls. false (no controls), 'pause' (pause only), 'playpause' (control to start and stop)
			easing: 'swing',
			slideSelector: 'li',
			transition: 'toggle',
			transitionSpeed: 'slow',
			navStyle: 'numbers', // "thumbnails" or "numbers"
			currentClass: 'current',
			disabledClass: 'disabled'
		},
		init: function(el, opts) {
			this.element = el;

			var
				self = this,
				root = $(self.element),
				o = $.extend(this.options, (opts || {}), root.data()),
				vpW = vpH = 0
			;

			// Store local references
			this._slides = root.find(o.slideSelector).addClass('slide').hide();

			this.length = this._slides.length;

			// Determine size of the viewport based on the biggest width and height of images
			this._slides.find('img').each(function(i, el) {
				vpW = Math.max(vpW, el.width);
				vpH = Math.max(vpH, el.height);
			});
			
			// Build the UI
			self._addViewport(vpW, vpH);
			self._addPrevNext();
			self._addIndexNav();

			// References to the controls
			this._nav = root.find('.slideshow-nav a');
			this._prev = root.find('.prev');
			this._next = root.find('.next');

			// Hook up all the functionality
			root
				.bind('prevSlide', function(ev) {
					self.prevSlide();
				})
				.bind('nextSlide', function(ev) {
					self.nextSlide();
				})
				.bind('showSlide', function(ev, idx) {
					var fx = true;
					if(idx.constructor === Object) {
						fx = idx.hasOwnProperty('fx') ? idx.fx : true;
						idx = idx.index;
					}
					self.showSlide(idx, fx);
				})
				.bind('stopAutoplay', function(ev) {
					// TODO Implement ability to stop autoplay
				})
				.bind('startAutoplay', function(ev) {
					// TODO Implement ability to start/resume autoplay
				})
				.delegate('.prev', 'click', function(ev) {
					ev.preventDefault();
					var $el = $(this);
					if(!$el.hasClass('disabled')) {
						$el.trigger('prevSlide');
					}
				})
				.delegate('.next', 'click', function(ev) {
					ev.preventDefault();
					var $el = $(this);
					if(!$el.hasClass('disabled')) {
						$el.trigger('nextSlide');
					}
				})
				.delegate('.slideshow-nav a', 'click', function(ev) {
					ev.preventDefault();
					var
						$parent = $(this).parent(),
						$navs = $parent.siblings('li').andSelf()
					;

					$parent.trigger('showSlide', $navs.index($parent));
				})
				.delegate('.slideshow-autoplay', 'click', function(ev) {
					// TODO Implement handler for clicking on the autoplay control
				})
				.trigger('showSlide', {index:0,fx:false})
				.addClass('slideshow-active')
			;
			
		},
		_addViewport: function(w, h) {
			$(this.element)
				.children('*:first').wrap('<div class="slideshow-viewport" style="width:'+w+'px; height:'+h+'px;"/>')
			;
		},
		_addIndexNav: function() {
			var
				slideCount = this.length,
				links = []
			;
			
			while(slideCount--) {
				links.push('<li><a href="#">'+(slideCount+1)+'</a></li>');
			}
			
			$('<div class="slideshow-nav"><ul>' + links.reverse().join('') + '</ul></div>').appendTo($(this.element));
		},
		_addPrevNext: function() {
			var
				self = this,
				root = $(this.element)
			;
			
			root.append('<div class="slideshow-controls"><a class="prev" href="#">Prev</a><a class="next" href="#">Next</a></div>');
		},
		_addAutoplayControls: function() {
			// TODO Inject autoplay control HTML
		},
		_getSlideIndex: function() {
			
		},
		nextSlide: function() {
			var
				next = this._currentIndex + 1;
			;
			if(next < this.length) this.showSlide(next);
			else this.showSlide(0);
		},
		prevSlide: function() {
			var
				prev = this._currentIndex - 1;
			;
			if(prev >= 0) this.showSlide(prev);
			else this.showSlide(this.length - 1);
		},
		showSlide: function(idx, fx) {
			// If we're trying to show a new slide...
			if(idx !== this._currentIndex) {
				var
					currSlide = this._currentSlide,
					nextSlide = this._slides.eq(idx),
					currIndex = this._currentIndex,
					nextIndex = idx,
					transitionFunc
				;
				
				switch(true) {
					case fx === false:
						transitionFunc = this._transitions.toggle;
						break;

					case (typeof this.options.transition === 'string' && !!this._transitions[this.options.transition]):
						transitionFunc = this._transitions[this.options.transition];
						break;

					case $.isFunction(this.options.transition):
					default:
						transitionFunc = this.options.transition;
						break;
				}
				
				transitionFunc.call(this, {slide:currSlide,index:currIndex}, {slide:nextSlide,index:nextIndex}, this.options);
				// Store a reference to the next current slide
				this._currentSlide = nextSlide;
				// Update the current index
				this._currentIndex = idx;
				
				// Update the navigation and controls
				this._prev[!this.options.loop && nextIndex === 0 ? 'addClass' : 'removeClass'](this.options.disabledClass);
				this._next[!this.options.loop && nextIndex === (this.length - 1) ? 'addClass' : 'removeClass'](this.options.disabledClass);
				
				this._nav
					.filter('.current').removeClass(this.options.currentClass)
					.end().eq(nextIndex).addClass(this.options.currentClass)
				;
			}
		},
		_transitions: {
			toggle: function(slide1, slide2, options) {
				if(slide1.slide) slide1.slide.hide();
				slide2.slide.show();
			},
			crossfade: function(slide1, slide2, options) {
				if(slide1.slide) slide1.slide.fadeOut(options.transitionSpeed, options.easing);
				slide2.slide.fadeIn(options.transitionSpeed, options.easing);
			},
			slidehorz: function(slide1, slide2, options) {
				if(slide1.index < slide2.index) {
					slide2.slide.css('left','100%').show();
					slide1.slide.animate({'left':'-100%'}, options.transitionSpeed, options.easing, function() {
						$(this).hide().css('left', null);
					});
					slide2.slide.animate({'left':'0'}, options.transitionSpeed, options.easing);
				} else {
					slide2.slide.css('left','-100%').show();
					slide1.slide.animate({'left':'100%'}, options.transitionSpeed, options.easing, function() {
						$(this).hide().css('left', null);
					});
					slide2.slide.animate({'left':'0'}, options.transitionSpeed, options.easing);
				}
			},
			slidevert: function(slide1, slide2, options) {
				if(slide1.index < slide2.index) {
					slide2.slide.css('top','100%').show();
					slide1.slide.animate({'top':'-100%'}, options.transitionSpeed, options.easing, function() {
						$(this).hide().css('top', null);
					});
					slide2.slide.animate({'top':'0'}, options.transitionSpeed, options.easing);
				} else {
					slide2.slide.css('top','-100%').show();
					slide1.slide.animate({'top':'100%'}, options.transitionSpeed, options.easing, function() {
						$(this).hide().css('top', null);
					});
					slide2.slide.animate({'top':'0'}, options.transitionSpeed, options.easing);
				}
			}
		}
	});

	$.fn.extend({
		slideshow: function(opts) {
			return this.each(function(i, el) {
				Slideshow.init(el, opts);
			});
		}
	});

    $(function() {
        $(document.documentElement).removeClass('no-js').addClass('js');

		$('.slideshow').slideshow();
    });
})(jQuery);
