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
		length: 0,
		element: null,
		options: {},
		init: function(el, opts) {
			this.element = el;
			$.extend(this.options, opts);

			var
				self = this,
				root = $(self.element),
				o = self.options,
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
					self.showSlide(idx);
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
				.trigger('showSlide', 0)
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
		_getSlideIndex: function() {
			
		},
		nextSlide: function() {
			var
				next = this._currentIndex + 1;
			;
			if(next < this.length) this.showSlide(next);
		},
		prevSlide: function() {
			var
				prev = this._currentIndex - 1;
			;
			if(prev >= 0) this.showSlide(prev);
		},
		showSlide: function(idx) {
			// If we're trying to show a new slide...
			if(idx !== this._currentIndex) {
				var
					currSlide = this._currentSlide,
					nextSlide = this._slides.eq(idx),
					currIndex = this._currentIndex,
					nextIndex = idx,
					transitionFunc = (typeof this.options.transition === 'string' ? this._transitions[this.options.transition] : this.options.transition)
				;
				transitionFunc.call(this, currSlide, nextSlide);
				// Store a reference to the next current slide
				this._currentSlide = nextSlide;
				// Update the current index
				this._currentIndex = idx;
				
				// Update the navigation and controls
				this._prev[nextIndex === 0 ? 'addClass' : 'removeClass']('disabled');
				this._next[nextIndex === (this.length - 1) ? 'addClass' : 'removeClass']('disabled');
				
				this._nav
					.filter('.current').removeClass('current')
					.end().eq(nextIndex).addClass('current')
				;
			}
		},
		_transitions: {
			toggle: function(slide1, slide2) {
				if(slide1) slide1.hide();
				slide2.show();
			},
			crossfade: function(slide1, slide2) {
				if(slide1) slide1.fadeOut('slow');
				slide2.fadeIn('slow');
			},
			slideHorz: function(slide1, slide2) {},
			slideVert: function(slide1, slide2) {}
		}
	});

	$.fn.extend({
		slideshow: function(opts) {
			opts = $.extend({
				slideSelector: 'li',
				transition: 'crossfade',
				navStyle: 'thumbnails' // "thumbnails" or "numbers"
			}, opts);
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
