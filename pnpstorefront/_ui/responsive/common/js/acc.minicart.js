ACC.minicart = {

    hitCounterPlus:0,
    hitCounterMinus:0,
    overlayId:0,
    overlaytxt:'',

	_autoload: [
		"bindMiniCart"
	],

	bindMiniCart: function(){


        $(document).on("ready", function(e){
            e.preventDefault();
            ACC.minicart.updateMiniCartDisplay();

            jQuery('.scrollbar-macosx').scrollbar();
        });


        $(document).on("click",".js-mini-cart-link", function(e){
            e.preventDefault();
            var url = $(this).data("miniCartUrl");
            var cartName = ($(this).find(".js-mini-cart-count").html() != 0) ? $(this).data("miniCartName"):$(this).data("miniCartEmptyName");

            ACC.colorbox.open(cartName,{
                href: url,
                maxWidth:"100%",
                width:"380px",
                initialWidth :"380px"
            });
        });

        $(document).on("click",".js-mini-cart-close-button", function(e){
            e.preventDefault();
            ACC.colorbox.close();
        });

        $(document).on("click",".js-mini-cart-remove", function(e){
            e.preventDefault();

            var removeCartItemUrl = $(this).data("removeCartItemUrl");
            var productCode = $(this).data("removeProductCode");

            $.ajax({
                url: removeCartItemUrl,
                cache: false,
                type: 'POST',
                beforeSend: function ()
                {
                    $(e.target).closest('.mini-cart-item').find('.spin-loader').show(); // Show loading spinner
                },
                success: function(jsonData){
                    ACC.product.toggleAddToCartButton(productCode);
                    $('input[name=quantityInCart_' + productCode + ']').val(0);
                    ACC.minicart.updateMiniCartDisplay();
                    if (jsonData.statusCode != 'success') {
                        var id = $(e.target).closest('.mini-cart-item').attr('id');
                        var textMesg = jsonData.statusCode + " : " + jsonData.errorMsg + " : " + jsonData.statusMessage;

                        ACC.minicart.showNotificationOverlay(id, textMesg); //NB: This doesnt actually show the overly, but set's it up to be shown later (workaround for existing code)
                    }
                }
            }).done(function () {
                $(e.target).closest('.mini-cart-item').find('.spin-loader').hide(); // Hide loading spinner
            });
        });

        $(document).on("blur",".js-mini-cart-qty-selector-input", function (e)
        {
            ACC.minicart.updateQuantity(this, e);
        });


        //Mini Cart [+] button
        $(document).on("click", ".js-mini-cart-qty-selector-plus", function(event){

            ACC.minicart.hitCounterPlus++;

            var $elem = $(event.target).closest('.mini-cart-item').find('.js-mini-cart-qty-selector-input');
            var val = $elem.val();
            var num = parseInt(val);

            $elem.val(++num);

            // Only allow make a server call once every 1 sec
            setTimeout(function(){
                if (ACC.minicart.hitCounterPlus > 0) {
                    ACC.minicart.updateQuantity($elem, event);
                    ACC.minicart.hitCounterPlus = 0;
                }
                ACC.minicart.hitCounterPlus=0;
            },1000);
        });


        // Mini Cart [-] button
        $(document).on("click", ".js-mini-cart-qty-selector-minus", function(event){

            ACC.minicart.hitCounterMinus++;

            var $elem = $(event.target).closest('.mini-cart-item').find('.js-mini-cart-qty-selector-input');
            var val = $elem.val();
            var num = parseInt(val);

            // Only allow make a server call once every 1 sec
            if ( num > 1 ) {
                $elem.val(--num);

                setTimeout(function(){
                    if (ACC.minicart.hitCounterMinus > 0) {
                        ACC.minicart.updateQuantity($elem, event);
                        ACC.minicart.hitCounterMinus = 0;
                    }
                    ACC.minicart.hitCounterMinus=0;
                },1000);
            }
        });


        // Mini Cart notification close [x] button
        $(document).on("click", ".js-mini-cart-notification-remove", function(event){
            event.preventDefault();
            $(event.target).closest('.mini-cart-item').find('.notification-message-container').hide();
        });

        ACC.minicart.updateFulfilmentSlotReservationTimer();
        setInterval(ACC.minicart.updateFulfilmentSlotReservationTimer, 5000);

        $(document).on('submit','#formMiniTrolleyUpdateAction',function(e) {
            e.preventDefault();
            ACC.minicart.updateAmendOrder(this, e);
        });

    },

    updateAmendOrder: function(elementRef, e) {

        var url = ACC.config.contextPath + '/cart/miniCart/update';

        $.ajax({
            url: url,
            type: "POST",
            success: function (jsonData) {
                if (jsonData.statusCode == 'success') {
                    window.location = ACC.config.contextPath + jsonData.redirectUrl;
                } else {
                    var error = jsonData.errorMsg;
                    $.toaster({message: error, priority: 'danger', logMessage: error});
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update order preferences on the cart";
                $.toaster({message: error, priority: 'danger', logMessage: error});
            }
        });
    },

    updateQuantity: function (elementRef, e)
    {

        e.preventDefault();
        var updateCartItemUrl = $(elementRef).data("updateCartItemUrl");

        if (updateCartItemUrl == undefined) {
            return;
        }

        var entryNumber = ($(elementRef).attr('id').split("_"))[1]

        var productCode = $("#productCode_" + entryNumber).val();
        var initialCartQuantity = $("#initialQuantity_" + entryNumber).val();
        var newCartQuantity = $("#quantity_" + entryNumber).val();

        if(initialCartQuantity != newCartQuantity)
        {
            ACC.track.trackUpdateCart(productCode, initialCartQuantity, newCartQuantity);
            $.ajax({
                url: updateCartItemUrl,
                cache: false,
                type: 'POST',
                data: {'quantity': newCartQuantity},
                beforeSend: function ()
                {
                    $(e.target).closest('.mini-cart-item').find('.spin-loader').show(); // Show loading spinner
                },
                success: function(jsonData){
                        ACC.minicart.updateMiniCartDisplay();
                        $('.lblQuantityInCart_' + productCode).text(jsonData.cartEntryQuantity);
                        $('#quantity_' + entryNumber).text(jsonData.cartEntryQuantity);
                    if (jsonData.statusCode != 'success') {
                        var id = $(e.target).closest('.mini-cart-item').attr('id');
                        var textMesg = jsonData.statusMessage;

                        ACC.minicart.showNotificationOverlay(id, textMesg); //NB: This doesnt actually show the overly, but set's it up to be shown later (workaround for existing code)
                    }
                }
            }).done(function () {
                $(e.target).closest('.mini-cart-item').find('.spin-loader').hide(); // Hide loading spinner
            });

            return true;
        }

        return false;
    },

    updateMiniCartItems: function(){
        var url = $(".nav-cart").data("miniCartUrl");

        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            success: function(response){
                $("#miniCartItems").html(response);

                if (ACC.minicart.overlayId && ACC.minicart.overlaytxt) { // Would have been set up by showNotificationOverlay()
                    $("#miniCartItems #" + ACC.minicart.overlayId).find('.notification-message-container').toggle();
                    $("#miniCartItems #" + ACC.minicart.overlayId).find('.notification-message-text').text(ACC.minicart.overlaytxt);

                    ACC.minicart.overlayId = null;
                    ACC.minicart.overlaytxt = null;
                }
                // console.log('new');
            }
        });
    },

    updateMiniCartDisplay: function(){
        var cartItems = $(".items-desktop").text();
        var miniCartRefreshUrl = $(".nav-cart").data("miniCartRefreshUrl");

        //Prevent update of minicart when mini cart is not visible
        if (miniCartRefreshUrl == undefined) {
            return;
        }

        $.ajax({
            url: miniCartRefreshUrl,
            cache: false,
            type: 'GET',
            success: function(jsonData){
                $("#myTrolleyCount").html(jsonData.miniCartCount);
                $("#totalItems").html(jsonData.miniCartCount);
                $("#miniCartTotals-subtotal").html(jsonData.subTotalOldPrice);
                $("#miniCartTotals-delivery").html(jsonData.totalDelivery);
                $("#miniCartTotals-saving").html(jsonData.totalSaving);
                $("#miniCartTotals-cashOffValue").html(jsonData.cashOffValue);
                $("#miniCartTotals-vouchers").html(jsonData.vouchers);
                $("#miniCartTotals-totalPrice").html(jsonData.totalPrice);
                $(".js-mini-cart-link .js-mini-cart-price").html(jsonData.miniCartPrice);
                ACC.minicart.checkoutbtntrigger();
            }
        });
        ACC.minicart.updateMiniCartItems();
        ACC.account.updateAccountSummary();

        var abc = $('#myTrolleyCount').text();

        if(abc.length == 3){
        	$('#myTrolleyCount').addClass('myTrolley-counter__three');
        	$( '#myTrolleyCount' ).removeClass('myTrolley-counter__two' );
        }else{
        	$('#myTrolleyCount').addClass('myTrolley-counter__two');
        	$( '#myTrolleyCount' ).removeClass('myTrolley-counter__three' );
        }
    },

    checkoutbtntrigger: function(){
        var cba = $('#myTrolleyCount').text();
        if (cba > 0){
            $('.MiniCart-CheckoutAction #formCheckoutAction').addClass('sticky-addedtocart-animation');
            $('.sticky-addtolist-component').addClass('sticky-checkout-show');
        }else {
            $('.sticky-addtolist-component').removeClass('sticky-checkout-show');
            $('.MiniCart-CheckoutAction #formCheckoutAction').removeClass('sticky-addedtocart-animation');
        }

    },
    

    // Sets up a notification message, which will be executed/shown via updateMiniCartItems()
    showNotificationOverlay: function(id, textMesg) {
        ACC.minicart.overlayId = id;
        ACC.minicart.overlaytxt = textMesg;
    },

    updateFulfilmentSlotReservationTimer: function() {
        var countdownContainers = $("#miniCartSlotReservationCountdownContainer");
        if (countdownContainers && countdownContainers.length > 0) {
            var countdownContainer = countdownContainers[0];
            var expiryTime = new Date(countdownContainers[0].getAttribute("data-fulfilment-slot-expiry-time"));
            var remainingTimeInMinutes = Math.max(0, Math.floor((expiryTime - new Date()) / 60000));
            var minutesText = remainingTimeInMinutes == 1 ? "min" : "mins";
            countdownContainer.innerHTML = "Checkout in " + "<span>" + remainingTimeInMinutes + " " + minutesText + "</span>" + " to confirm";
            $(countdownContainer).css("display", remainingTimeInMinutes ? "block" : "none");
            $("#fulfilmentSlotReservationContainer").css("display", remainingTimeInMinutes ? "block" : "none");
            $("#noFulfilmentSlotReservationMessageContainer").css("display", remainingTimeInMinutes ? "none" : "block");
        }
    }
};