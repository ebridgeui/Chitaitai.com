ACC.ratingstars = {

	_autoload: [
		["bindRatingStars", $(".js-ratingCalc").length > 0],
		["bindRatingStarsSet", $(".js-ratingCalcSet").length > 0]
	],

	bindRatingStars: function(){

		$e = $(".js-ratingCalc");

		$e.each(function(){
			var ratingData = $(this).data("rating");
			var $ratingIcon = $(this).find(".js-ratingIcon");
			var $clonelh;

			for (var i = 1; i <= ratingData.total; i++) {
				var $clone = $ratingIcon.clone().removeClass("js-ratingIcon");
				
				// adds the active class to the stars that are less than or equal than the current rating
				if(i <= ratingData.rating){
					$clone.addClass("active")
				}

				// inert the rating icons in the dom
				$clone.insertBefore($ratingIcon);
				if($clonelh){
					$clonelh.insertBefore($ratingIcon);
					$clonelh=null
				}
			}
			// delete the template icon
			$ratingIcon.remove()
		})
	},
	bindRatingStarsSet: function(){

		$e = $(".js-ratingCalcSet");


		$e.on("mouseenter",".js-rationIconSet",function(e){
			e.preventDefault();
			$(this).parent().children().removeClass("active")
			var cindex =  $(this).index()+1;
			var $i = $(this).parent().children(".js-rationIconSet:lt("+cindex+")")
			$i.addClass("active")
		})


		$(document).on("mouseleave",".js-ratingCalcSet",function(e){
			e.preventDefault();

			$(this).find(".js-rationIconSet").removeClass("active")
			var rating = $(".js-ratingSetInput").val();
			var $i = $(this).find(".js-rationIconSet:lt("+rating+")")
			$i.addClass("active")
		})

		$e.on("click",".js-rationIconSet",function(e){
			e.preventDefault();
			var ratingData = $e.data("rating");
			var cindex =  $(this).index()+1;
			ratingData.rating = cindex;

			$(".js-ratingSetInput").val(ratingData.rating)
		})

		$e.each(function(){
			var ratingData = $(this).data("rating");
			var $ratingIcon = $(this).find(".js-ratingIcon");
			var $clonelh;

			for (var i = 1; i <= ratingData.total; i++) {
				var $clone = $ratingIcon.clone().removeClass("js-ratingIcon");
				
				// inert the rating icons in the dom
				$clone.insertBefore($ratingIcon);
				if($clonelh){
					$clonelh.insertBefore($ratingIcon);
					$clonelh=null
				}
			}
			// delete the template icon
			$ratingIcon.remove()
		})
	}

};