ACC.rotatingbannercarousel = {

	_autoload: [
		["bindCarousel", $(".js-owl-rotatingbannercarousel").length >0],
        "owlNavFader"
	],

	carouselConfig:{
		"default":{
			nav:false,
			dots: ($(".js-owl-rotatingbannercarousel .owl-item").length > 3) ? true : false,
			loop: true,
			autoplay: 2500,
			navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			itemsCustom : [[0, 2], [640, 4], [1024, 5], [1400, 7]]
		},
		"rotating-image":{

			navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			items:1,
			margin:10,
			items:1,
			loop:(function(){
				if ( $(".carousel-rotating-banner").data( "autorotate" ) === true) {
					return true;
				}
			}()),

			autoplay:(function(){
				if ( $(".carousel-rotating-banner").data( "autorotate" ) === true) {
					return true;
				}
			}()),

			autoplayTimeout:(function(){
				var tt = $(".carousel-rotating-banner").data( "transitiontime" );
				if (tt === 0) {
					tt = 1000;
				}
				return (typeof(tt) === 'number') ?  tt*1000 :  5000;
			}()),

			autoplaySpeed:(function(){
				var tt = $(".carousel-rotating-banner").data( "transitiontime" );
				if (tt === 0) {
					tt = 1000;
				}
				return (typeof(tt) === 'number') ?  tt*1000 :  5000;
			}()),

			loop:true,
            responsive:{
                0:{
                    nav: false,
                    dots: true,
                },
                760:{
                    nav: false,
                    dots: true,
                },
                1400:{
                    nav: true,
                    dots: false
                },
            },
		},
		"lazy-reference":{
			nav:false,
			navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
			dots:true,
			loop: true,
            autoplay: 2500,
			lazyLoad:true,
			//itemsDesktop : [5000,7],
			//itemsDesktopSmall : [1200,5],
			//itemsTablet: [768,4],
			//itemsMobile : [480,3],
			responsive:{
				0:{
					items:3,
					nav:false,
					dots: true,
				},
				768:{
					items:4,
					nav:false,
					dots: true,
				},
				1200:{
					items:5,
					nav:false,
                    dots: true,
				},
				5000:{
					items:7,
					nav:false,
                    dots: true,
				},
			},

		},
        "rotating-tile":{
            items : 3, //10 items above 1000px browser width
            dots:true,
            nav:false,

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

            loop: true,
            autoplay: 2500,
            //navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
            navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],
            addClassActive : true
        },
        "rotating-single":{
            items : 1, //10 items above 1000px browser width

            responsive:{
                0:{
                    items:1,
                    nav:false,
                    dots: false,
                },
                900:{
                    items:1,
                    nav:false,
                },
            },

            dots:true,
            nav:false,
			loop: true,
            autoplay: 2500,
            navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
            //navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],
            addClassActive : true
        },
        "rotating-campaign":{
            items : 3, //10 items above 1000px browser width
            dots:true,
            nav:false,

            responsive:{
                0:{
                    items: 1,
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


            navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
            addClassActive : true,
            loop:true,
			margin:10
        }
	},

	bindCarousel: function() {

		$(".js-owl-rotatingbannercarousel").each(function() {
			var $c = $(this);
            $.each(ACC.rotatingbannercarousel.carouselConfig, function (key, config) {
                if ($c.hasClass("js-owl-" + key)) {
                    var $e = $(".js-owl-" + key);
                    if (key === "rotating-image" && $("body").hasClass("page-homepage")) {
                        var navigationOption = $c.parent().data("navigationoption").toLowerCase();
                        if (navigationOption === 'dots' || navigationOption === 'both')
                            config["responsive"]["1400"]["dots"] = true;
                    }
					$e.owlCarousel(config);
                    ACC.rotatingbannercarousel.hideCarouselControls($c, key);
				}
			});
		});

        $('.carousel-rotating-banner .owl-lazy.item').css('visibility','visible');
    },
    isDesktopMode: function () {
        if ( (ACC.rotatingbannercarousel.getViewPortWidth() > 1024)) {
            return true;
        }
    },
    getViewPortWidth: function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
    hideCarouselControls: function ($c, key) {
        $(document).ready(function () {

            var num_carousel_items_visible = ACC.rotatingbannercarousel.carouselConfig[key].responsive[0].items; // mobile num items
            if (ACC.global.isDesktopMode()) {
                num_carousel_items_visible = ACC.rotatingbannercarousel.carouselConfig[key].responsive[1400].items;
            }

            var cloned_items = $c.closest('.cmstilecomponent').find('.owl-item.cloned').length; // If there are any clones, count them
            var num_carousel_items_total = ($c.closest('.cmstilecomponent').find('.owl-item').length) - cloned_items;

            if (num_carousel_items_total <= num_carousel_items_visible) {
                $c.closest(".cmstilecomponent").find(".owl-dots").hide();
                $c.closest(".cmstilecomponent").find(".owl-nav").hide();
            }
        });
    },
    owlNavFader : function () {
        $(document).on('mouseenter', '.cms-owl-nav-hider', function() {
            $(".cms-owl-nav-hider .owl-controls .owl-nav").addClass('cms-owl-nav-shower');
        });

        $(document).on('mouseleave', '.cms-owl-nav-hider', function() {
            $(".cms-owl-nav-hider .owl-controls .owl-nav").removeClass('cms-owl-nav-shower');
        });
    }
};
