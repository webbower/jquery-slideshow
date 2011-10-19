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
				$root = $(self.element),
				o = self.options,
				vpW = vpH = 0
			;

			this._slides = $root.find(o.slideSelector).hide();

			this._slides.find('img').each(function(i, el) {
				vpW = Math.max(vpW, el.width);
				vpH = Math.max(vpH, el.height);
			});
			
			this.length = this._slides.length;
			
			// Build the UI
			self._addViewport(vpW, vpH);
			self._addPrevNext();
			self._addIndexNav();

			// Hook up all the functionality
			$root
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
					console.log("Clicked Prev");  // TODO: Remove for Production
					$(this).trigger('prevSlide');
				})
				.delegate('.next', 'click', function(ev) {
					ev.preventDefault();
					console.log("Clicked Next");  // TODO: Remove for Production
					$(this).trigger('nextSlide');
				})
				.delegate('.slideshow-nav a', 'click', function(ev) {
					console.log("Clicked Nav link");  // TODO: Remove for Production
					ev.preventDefault();
					var
						$parent = $(this).parent(),
						$navs = $parent.siblings('li').andSelf()
					;

					$parent.trigger('showSlide', $navs.index($parent));
				})
				.trigger('showSlide', self._currentIndex)
			;
			
			$root.addClass('slideshow-active');
			console.log(this);
		},
		_addViewport: function(w, h) {
			var
				root = $(this.element)
			;
			
			root
				.children('*:first').wrap('<div class="slideshow-viewport" style="width:'+w+'px; height:'+h+'px;"/>')
			;
		},
		_addIndexNav: function() {
			console.log("Build Index Nav");  // TODO: Remove for Production
			var
				self = this,
				$root = $(this.element),
				slideCount = self._slides.length,
				links = []
			;
			
			while(slideCount--) {
				links.push('<li><a href="#">'+(slideCount+1)+'</a></li>');
			}
			
			$('<div class="slideshow-nav"><ul>' + links.reverse().join('') + '</ul></div>').appendTo($root);
		},
		_addPrevNext: function() {
			console.log("Build Prev/Next");  // TODO: Remove for Production
			var
				self = this,
				$root = $(this.element)
			;
			
			$root.append('<div class="slideshow-controls"><a class="prev" href="#">Prev</a><a class="next" href="#">Next</a></div>');
		},
		_getSlideIndex: function() {},
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
			var self = this;
			$(self._currentSlide).hide();
			self._currentSlide = self._slides.eq(idx).show();
			self._currentIndex = idx;
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
				console.log("slideshow init on ", el, opts);  // TODO: Remove for Production
				Slideshow.init(el, opts);
			});
		}
	});

    $(function() {
        $(document.documentElement).removeClass('no-js').addClass('js');

		$('.slideshow').slideshow();
    });
})(jQuery);
