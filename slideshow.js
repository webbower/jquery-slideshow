;(function($) {
    // Pre ready() code goes here
	if(!window.Slideshow) Slideshow = {};

	$.extend(Slideshow, {
		_currentSlide: null,
		_currentIndex: 0,
		_slides: null,
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
			this._slides = root.find(o.slideSelector).hide();

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

			// Hook up all the functionality
			root
				.bind('nextSlide', function(ev) {
					console.log("Show Next Slide");  // TODO: Remove for Production
					self.nextSlide();
				})
				.bind('prevSlide', function(ev) {
					console.log("Show Prev Slide");  // TODO: Remove for Production
					self.prevSlide();
				})
				.bind('showSlide', function(ev, idx) {
					self.showSlide(idx);
				})
				.delegate('.prev', 'click', function(ev) {
					ev.preventDefault();
					$(this).trigger('prevSlide');
				})
				.delegate('.next', 'click', function(ev) {
					ev.preventDefault();
					$(this).trigger('nextSlide');
				})
				.delegate('.slideshow-nav a', 'click', function(ev) {
					ev.preventDefault();
					var
						$parent = $(this).parent(),
						$navs = $parent.siblings('li').andSelf()
					;

					$parent.trigger('showSlide', $navs.index($parent));
				})
				.trigger('showSlide', self._currentIndex)
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
			$(this._currentSlide).hide();
			this._currentSlide = this._slides.eq(idx).show();
			this._currentIndex = idx;
		},
		_transitions: {
			crossfade: function(slide1, slide2) {},
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
