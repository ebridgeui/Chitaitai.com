ACC.imagegallery = {

	_autoload: [
		"bindImageGallery",
	],

	bindImageGallery: function (){

		$(".js-gallery").each(function(){
			var $image = $(this).find(".js-gallery-image");
			var $carousel = $(this).find(".js-gallery-carousel")
			var imageTimeout;


			$image.owlCarousel({

				items:1, 
				nav:false,
				dots: false,
				lazyLoad:true,
				navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],
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
                        dots: false,
                    },
                },
				afterAction : function(){
					ACC.imagegallery.syncPosition($image,$carousel,this.currentItem)
					$image.data("zoomEnable",true)

                    ACC.carousel.owlNavFader(); // Won't work until the PDP img gallery is turned into a CMS component that can be given a style class
                },
				startDragging: function(){

					$image.data("zoomEnable",false)
				},
				afterLazyLoad:function(e){

					var b = $image.data("owlCarousel") || {}
					if(!b.currentItem){
						b.currentItem = 0
					}

					var $e=$($image.find("img.owl-lazy")[b.currentItem]);
					startZoom($e.parent())
				}
			});


			$carousel.owlCarousel({
				nav:false,
				navText : ["<span class='glyphicon small-chevron icon-chevron-small-left'></span>", "<span class='glyphicon small-chevron icon-chevron-small-right'></span>"],
				dots:($(".js-gallery-image .owl-item img").length > 3) ? true : false,
				items:15,
				lazyLoad:true,
				margin:10,
				loop: true,
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
						items:5,
						nav:false,
					},
					1200:{
						items:5,
						nav:false,
					},
				},
				afterAction : function(){

				},
			});


			$carousel.on("click",'a.item',function(e){
				e.preventDefault();

				var links = $('.js-gallery-carousel a.item');
				var thumbIndex = $(links).index(this);
				$image.trigger('to.owl.carousel', [thumbIndex, 300, true]);
			});


			function startZoom(e){


				$(e).zoom({
					url: $(e).find("img.owl-lazy").data("zoomImage"),
					touch: true,
					on: "grab",
					touchduration:300,

					onZoomIn:function(){

					},

					onZoomOut:function(){
						var owl = $image.data('owlCarousel');
						owl.dragging(true)
						$image.data("zoomEnable",true)
					},

					zoomEnableCallBack:function(){
						var bool = $image.data("zoomEnable")

						var owl = $image.data('owlCarousel');
						if(bool==false){
							owl.dragging(true)
						}
						else{

							owl.dragging(false)
						}
						return bool;
					}
				});
			}

            ACC.imagegallery.hideCarouselControls($image);
		})
	},


	syncPosition: function($image,$carousel,currentItem){
		$carousel.trigger("owl.goTo",currentItem);
	},

    // Force hide the carousel controls if less than 2 items. Runs after DOM ready
    hideCarouselControls: function ($img) {
        $(document).ready(function () {

            var num_carousel_items_visible = 1;

            var cloned_items = $img.closest('.js-gallery-image').find('.owl-item.cloned').length; // If there are any clones, count them
            var num_carousel_items_total = ($img.closest('.js-gallery-image').find('.owl-item').length) - cloned_items;

            if (num_carousel_items_total <= num_carousel_items_visible) {
                $img.closest(".js-gallery-image").find(".owl-dots").hide();
                $img.closest(".js-gallery-image").find(".owl-nav").hide();
            }
        });
    },
};