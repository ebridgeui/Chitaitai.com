ACC.checkoutsteps = {

	_autoload: [
		"permeateLinks",
		"showErrorMsgClass",
		"cartBackAction"
	],
			
	permeateLinks: function() {
	
		$(document).on("click",".js-checkout-step",function(e){
			e.preventDefault();
			window.location=$(this).closest("a").attr("href")
		})		
	},
	
	cartBackAction: function() {
		$(document).on("click",".js-cart-back",function(e){
			e.preventDefault();
			window.history.back();
		})
	},

    showErrorMsgClass: function ()
    {
        $(".control-label").each(function(){
            $(this).parent('.addressLine').addClass("hasErrorMsg");
            $(this).closest('#billingInformation').addClass("isValidated");
        })

        $(".isValidated .addressLine").each(function(){
            if (!$(this).hasClass('hasErrorMsg')){
                $(this).addClass("validated");
            }
        })
    }

};