ACC.carousel = {

	_autoload: [
		["bindCarousel", $(".js-owl-carousel").length >0],
        "owlNavFader"
	],

	carouselConfig:{
		"default":{
			margin:10,
			nav:false,
			dots:true,
			//navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],

			itemsCustom : [[0, 2], [640, 4], [1024, 5], [1400, 7]],
			items:3,
		},
		"rotating-image":{
			nav:false,
			pagination:true,
			dots:true,
			items:1,
		},
		"lazy-reference":{
			nav:false,
			navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			dots:true,
			lazyLoad:true,
			//itemsDesktop : [5000,7],
			//itemsDesktopSmall : [1200,5],
			//itemsTablet: [768,4],
			//itemsMobile : [480,3],
			responsive:{
				0:{
					items:3,
					nav:false,
				},
				768:{
					items:4,
					nav:false,
				},
				1200:{
					items:5,
					nav:false,
				},
				5000:{
					items:7,
					nav:false,
				},
			},

		},
		"lazy-product-reference":{
			margin : 10,
			nav : false,
			//navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],
			dots : true,
			lazyLoad : true,
			loop: true,

			items : 3,
			responsive:{
				0:{
					items: 2,
					nav: false,
					dots: true,
				},
				760:{
					items: 3,
					nav: false,
					dots: true,
				},
				1400:{
					items: 3,
					nav: true,
					dots: false,
				},
			},
		},
	},

    bindCarousel: function(){

        $(".js-owl-carousel").each(function(){
            var $c = $(this)
            $.each(ACC.carousel.carouselConfig,function(key,config){
                if($c.hasClass("js-owl-"+key)){
                    var $e = $(".js-owl-"+key);
                    $e.owlCarousel(config);
                    ACC.carousel.hideCarouselControls($c);
                }
            });
        });
    },

    hideCarouselControls: function ($c) {
        $(document).ready(function () {

            var num_carousel_items_visible = ACC.carousel.carouselConfig["lazy-product-reference"].responsive[0].items; // mobile num items
            if (ACC.global.isDesktopMode()) {
                num_carousel_items_visible = ACC.carousel.carouselConfig["lazy-product-reference"].responsive[1400].items;
            }

            var cloned_items = $c.closest('.js-owl-carousel').find('.owl-item.cloned').length; // If there are any clones, count them
            var num_carousel_items_total = ($c.closest('.js-owl-carousel').find('.owl-item').length) - cloned_items;

            if (num_carousel_items_total <= num_carousel_items_visible) {
                $c.closest(".js-owl-carousel").find(".owl-dots").hide();
                $c.closest(".js-owl-carousel").find(".owl-nav").hide();
            }

            if (! ACC.global.isDesktopMode()) {
                $c.closest(".js-owl-carousel").find(".owl-nav").hide();
            }
        });
    },

    owlNavFader : function () {
        $(document).on('mouseenter', '.cms-owl-nav-hider', function() {
            $(".cms-owl-nav-hider .owl-theme .owl-controls .owl-nav").addClass('cms-owl-nav-shower');
        });

        $(document).on('mouseleave', '.cms-owl-nav-hider', function() {
            $(".cms-owl-nav-hider .owl-theme .owl-controls .owl-nav").removeClass('cms-owl-nav-shower');
        });
    }
};