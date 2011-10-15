;(function($) {
    // Pre ready() code goes here
	if(!window.Slideshow) Slideshow = {};

	$.extend(Slideshow, {
		slides: null,
		element: null,
		init: function(el) {
			this.element = el;
		},
		buildUI: function() {},
		_addIndexNav: function() {},
		_addPrevNext: function() {},
		nextSlide: function() {},
		prevSlide: function() {},
		goToSlide: function(idx) {}
	});

	$.fn.extend({
		slideshow: function() {
			return this.each(function(i, el) {
				console.log("slideshow init on ", el);  // TODO: Remove for Production
				Slideshow.init(el);
			});
		}
	});

    $(function() {
        $(document.documentElement).removeClass('no-js').addClass('js');

		$('.slideshow').slideshow();
    });
})(jQuery);
