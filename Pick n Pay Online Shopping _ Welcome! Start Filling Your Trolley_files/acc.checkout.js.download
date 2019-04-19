ACC.checkout = {

	_autoload: [
		"bindCheckO",
		"bindForms",
		"bindSavedPayments",
		"setupSubscriptionFrequencyDisplay"
	],


	bindForms:function(){

		$(document).on("click","#addressSubmit",function(e){
			e.preventDefault();
			$('#addressForm').submit();	
		})
		
		$(document).on("click","#deliveryMethodSubmit",function(e){
			e.preventDefault();
			$('#selectDeliveryMethodForm').submit();	
		})

		$(document).on("click",".js-subscription-frequency-once-off",function(e){
			$(".js-subscription-frequency-information-block").css('display', 'none');
			ACC.checkout.updateFulfilmentPanelHeaderText("once-off");
			ACC.checkout.updateSubscriptionDeliveryDate("once-off");
			ACC.checkout.updateSubscriptionFrequency($(".js-subscription-frequency-once-off").attr('value'));
		})

		$(document).on("click",".js-subscription-frequency-weekly",function(e){
			$(".js-subscription-frequency-information-block").css('display', 'block');
			ACC.checkout.updateFulfilmentPanelHeaderText("weekly");
			ACC.checkout.updateSubscriptionDeliveryDate("weekly");
			ACC.checkout.updateSubscriptionFrequency($(".js-subscription-frequency-weekly").attr('value'));
		})

		$(document).on("click",".js-subscription-frequency-monthly",function(e){
			$(".js-subscription-frequency-information-block").css('display', 'block');
			ACC.checkout.updateFulfilmentPanelHeaderText("monthly");
			ACC.checkout.updateSubscriptionDeliveryDate("monthly");
			ACC.checkout.updateSubscriptionFrequency($(".js-subscription-frequency-monthly").attr('value'));
		})
	},

	updateFulfilmentPanelHeaderText: function(subscriptionType) {
		(subscriptionType == "once-off") ? $(".js-book-a-slot-header-text-once-off").css('display', 'block'): $(".js-book-a-slot-header-text-once-off").css('display', 'none');
		(subscriptionType == "weekly") ? $(".js-book-a-slot-header-text-weekly").css('display', 'block'): $(".js-book-a-slot-header-text-weekly").css('display', 'none');
		(subscriptionType == "monthly") ? $(".js-book-a-slot-header-text-monthly").css('display', 'block'): $(".js-book-a-slot-header-text-monthly").css('display', 'none');
	},

	updateSubscriptionDeliveryDate: function(subscriptionType) {
		console.log($(".js-is-reservation-booked").get);

		if(subscriptionType == "weekly" && $(".js-is-reservation-booked").val() == "true") {
			$(".js-subscription-delivery-date-info-block").css("display", "block");
			$(".js-subscription-weekly-delivery-date-info").css("display", "block");
			$(".js-subscription-monthly-delivery-date-info").css("display", "none");
		} else if (subscriptionType == "monthly" && $(".js-is-reservation-booked").val() == "true") {
			$(".js-subscription-delivery-date-info-block").css("display", "block");
			$(".js-subscription-weekly-delivery-date-info").css("display", "none");
			$(".js-subscription-monthly-delivery-date-info").css("display", "block");
		} else {
			$(".js-subscription-delivery-date-info-block").css("display", "none");
		}
	},

	bindSavedPayments:function(){
		$(document).on("click",".js-saved-payments",function(e){
			e.preventDefault();

			var title = $("#savedpaymentstitle").html();

			$.colorbox({
				href: "#savedpaymentsbody",
				inline:true,
				maxWidth:"100%",
				opacity:0.7,
				//width:"320px",
				title: title,
				close:'<span class="glyphicon glyphicon-remove"></span>',
				onComplete: function(){
				}
			});
		})
	},

	bindCheckO: function ()
	{
		var cartEntriesError = false;
		
		// Alternative checkout flows options
		$('.doFlowSelectedChange').change(function ()
		{
			if ('multistep-pci' == $('#selectAltCheckoutFlow').attr('value'))
			{
				$('#selectPciOption').css('display', '');
			}
			else
			{
				$('#selectPciOption').css('display', 'none');

			}
		});



		$('.continueShoppingButton').click(function ()
		{
			var checkoutUrl = $(this).data("continueShoppingUrl");
			window.location = checkoutUrl;
		});

		
		$('.expressCheckoutButton').click(function()
				{
					document.getElementById("expressCheckoutCheckbox").checked = true;
		});
		
		$(document).on("input",".confirmGuestEmail,.guestEmail",function(){
			  
			  var orginalEmail = $(".guestEmail").val();
			  var confirmationEmail = $(".confirmGuestEmail").val();
			  
			  if(orginalEmail === confirmationEmail){
			    $(".guestCheckoutBtn").removeAttr("disabled");
			  }else{
			     $(".guestCheckoutBtn").attr("disabled","disabled");
			  }
		});
		
		$('.checkoutButton').click(function ()
		{
			var checkoutUrl = $(this).data("checkoutUrl");
			
			cartEntriesError = ACC.pickupinstore.validatePickupinStoreCartEntires();
			if (!cartEntriesError)
			{
				var expressCheckoutObject = $('.express-checkout-checkbox');
				if(expressCheckoutObject.is(":checked"))
				{
					window.location = expressCheckoutObject.data("expressCheckoutUrl");
				}
				else
				{
					var flow = $('#selectAltCheckoutFlow').attr('value');
					if ( flow == undefined || flow == '')
					{
						// No alternate flow specified, fallback to default behaviour
						window.location = checkoutUrl;
					}
					else
					{
						// Fix multistep-pci flow
						if ('multistep-pci' == flow)
						{
						flow = 'multistep';
						}
						var pci = $('#selectPciOption').attr('value');

						// Build up the redirect URL
						var redirectUrl = checkoutUrl + '/select-flow?flow=' + flow + '&pci=' + pci;
						window.location = redirectUrl;
					}
				}
			}
			return false;
		});

	},

	updateSubscriptionFrequency: function (subscriptionFrequency) {
		$.ajax({
			url: ACC.config.contextPath + "/cart/updateSubscriptionFrequency",
			data: {subscriptionFrequency: subscriptionFrequency},
			type: "POST"
		});
	},

	setupSubscriptionFrequencyDisplay: function() {
		if($(".js-subscription-frequency-once-off").is(':checked')) {
			console.log("js-subscription-frequency-once-off checked");
			$(".js-subscription-frequency-information-block").css('display', 'none');
		}

		if($(".js-subscription-frequency-weekly").is(':checked')) {
			console.log("js-subscription-frequency-weekly checked");
			$(".js-subscription-frequency-information-block").css('display', 'block');
		}

		if($(".js-subscription-frequency-monthly").is(':checked')) {
			console.log("js-subscription-frequency-monthly checked");
			$(".js-subscription-frequency-information-block").css('display', 'block');
		}
	}

};

$(document).find('.custom-ss-voucher-deliverybanner h6').each(function () {
    if( !$.trim( $(this).html() ).length ) {
        $(this).parents('.custom-ss-voucher-deliverybanner').hide;
    }
});
