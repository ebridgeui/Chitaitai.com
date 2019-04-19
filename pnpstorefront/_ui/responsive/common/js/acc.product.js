ACC.product = {

    _autoload: [
        "bindToAddToCartForm",
        "enableStorePickupButton",
        "enableVariantSelectors",
        "bindFacets",
        "bindRemoveFromCart",
        "heartModalDialog",
        "selectProduct"
    ],


    bindFacets: function () {
        $(document).on("click", ".js-show-facets-plp", function (e) {
            e.preventDefault();
            $('#cboxContent').css("background-color","#b9144a");
            var selectRefinementsTitle = $(this).data("selectRefinementsTitle");
            $('#colorbox').addClass('filteredByColorBox');
            $('#colorbox').removeClass('addlist_popup');
            ACC.colorbox.open(selectRefinementsTitle, {
                href: "#product-facet",
                inline: true,
                width: "480px",
                scrolling: true,
                height: window.innerHeight > parseInt(cboxOptions.maxHeight) ? cboxOptions.maxHeight : cboxOptions.height,
                onComplete: function () {
                    $(document).on("click", ".js-product-facet .js-facet-name", function (e) {
                        e.preventDefault();
                        $(".js-product-facet  .js-facet").removeClass("active");
                        $(this).parents(".js-facet").addClass("active");
                        $.colorbox.resize()
                    });
                    $(this).colorbox.resize();
                },
                onCleanup: function () {
                    $('#colorbox').css("left","100%", "opacity", "1");
                },
                onClosed: function () {
                    $(document).off("click", ".js-product-facet .js-facet-name");
                    $('#colorbox').css("left","100%", "opacity", "1");
                }
            });
        });
         // Mini Cart notification close [x] button
                $(document).on("click", ".pdp-cart-notification-remove", function(event){
                    event.preventDefault();
                    $(event.target).closest('.addToCartError-pdp').hide();
                });
    },


    enableAddToCartButton: function () {
        $('.js-enable-btn').each(function () {
            if (!($(this).hasClass('outOfStock') || $(this).hasClass('out-of-stock'))) {
                $(this).removeAttr("disabled");
            }
        });
    },

    enableVariantSelectors: function () {
        $('.variant-select').removeAttr("disabled");
    },

    bindToAddToCartForm: function () {
        var addToCartForm = $('.add_to_cart_form');
        var productCode = null;
        addToCartForm.ajaxForm({
            beforeSend:function(){
                productCode = ACC.product.queryStringToJSON(this.data).productCodePost;
                ACC.common.showLoadingSpinner("#prodtile-addToCartButton-container_"+productCode);
            },
            success: function(){
                var formElement = arguments[3][0]; /*getting the form element here to get the product
                                                    code from the ajax form response so that if two
                                                    concurrent requests are made the product code is
                                                    the correct product code for the specific ajax form
                                                    */
                var cartResult = arguments[0];
                var productCode = $('[name=productCodePost]', formElement).val();
                if(cartResult != undefined){
                    ACC.product.updateAddedToCartDisplay(cartResult, arguments[1], arguments[2], formElement);
                }
                ACC.common.hideLoadingSpinner("#prodtile-addToCartButton-container_"+productCode);
            },
            error: function(xhr){
                var formElement = arguments[3][0];
                var productCode = $('[name=productCodePost]', formElement).val();
                ACC.common.hideLoadingSpinner("#prodtile-addToCartButton-container_"+productCode);
                ACC.product.loginPrompt(xhr);
            }
        });
    },

    loginPrompt: function(xhr, textStatus, errorThrown ) {
        if (xhr.state() == 'rejected') {
            if (xhr.status == 401) {
                // TODO: get the login URL from config
                // Redirection occurred, i.e. login server was hit due to security constraints.
                // The user needs to login. Unfortunately, doing a window.locationj.replace does not
                // work the way we need it to. Leaving the code here for reference as it was a little tricky
                // discovering "xhr.state() == 'rejected'"
                // window.location.replace('/pnpstorefront/openid_connect_login');
                var html = $('.login-modal').css("display","block");
                $.colorbox({
                	html : html,
                    width : '96%',
                    maxWidth : 800,
                    scrolling : false,
                    onClosed : function(){
                    	location.reload();
                    }
                });
		    }
        }
    },

    bindToAddToCartStorePickUpForm: function () {
        var addToCartStorePickUpForm = $('#colorbox #add_to_cart_storepickup_form');
        addToCartStorePickUpForm.ajaxForm({success: ACC.product.updateAddedToCartDisplay});
    },

    enableStorePickupButton: function () {
        $('.js-pickup-in-store-button').removeAttr("disabled");
    },

    updateAddedToCartDisplay: function (cartResult, statusText, xhr, formElement) {
        if (typeof ACC.minicart.updateMiniCartDisplay == 'function') {
            ACC.minicart.updateMiniCartDisplay();
        }
        var titleHeader = $('#addToCartTitle').html();

        var productCode = $('[name=productCodePost]', formElement).val();
        var quantityInCart = $('[name=quantityInCart_' + productCode + ']', formElement).val();

        var quantityField = $('[name=qty]', formElement).val();

        var quantity = 1;
        if (quantityField != undefined) {
            quantity = quantityField;
        }

        var cartAnalyticsData = cartResult.cartAnalyticsData;

        var cartData = {
            "cartCode": cartAnalyticsData.cartCode,
            "productCode": productCode, "quantity": quantity,
            "productPrice": cartAnalyticsData.productPostPrice,
            "productName": cartAnalyticsData.productName
        };
        ACC.track.trackAddToCart(productCode, quantity, cartData);
        var errorMsg = cartResult.cartData.errorMsg;
        var errorMsgForCarousel = cartResult.cartData.errorMsgForCarousel;
        if (errorMsg === undefined || errorMsg == null || !errorMsg.trim()) {
            var totalInCart = parseInt(quantityInCart) + parseInt(quantity);
            $('.lblQuantityInCart_' + productCode).text(cartResult.cartData.entryDisplayCount);
            $('.addedToCartDiv_' + productCode).css("display", "block");
            $('.MiniCart-CheckoutAction #formCheckoutAction').addClass('sticky-addedtocart-animation');
            $('.sticky-addtocart-animation').addClass('sticky-addedtocart-animation');
            $('.addToCartButton_' + productCode).removeClass('notAdded');
            $('[name=quantityInCart_' + productCode + ']', formElement).val(cartResult.cartData.entryQuantity);
            $('.removeFromCartButton_' + productCode).data("removeCartProductUrl", ACC.product.getRemoveCartProductUrl(productCode));
            $('.addToCartError_' + productCode).css("display", "none");
            ACC.minicart.updateMiniCartDisplay();

        } else {
            $('.addToCartError_' + productCode).css({"display": "block", "top": "-30px"});
            $('.addToCartErrorMsg_' + productCode).text(errorMsg);
            if($('.productCarouselItem-overlay').is(':visible') && $('.addToCartError-pdp').is(':visible')) {
                 $('.addToCartError-pdp').css("display", "none");
             }
            if (cartResult.cartData.entryQuantity){
                $('.lblQuantityInCart_' + productCode).text(cartResult.cartData.entryDisplayCount);
            }
            if (!(errorMsgForCarousel === undefined || errorMsgForCarousel == null || !errorMsgForCarousel.trim())) {
                $('.productCarouselItem').find($('.addToCartErrorMsg_' + productCode)).text(errorMsgForCarousel);
            }
        }
    },
    bindRemoveFromCart: function () {
        $(document).on("click",".js-cart-item-remove", function(e) {

            e.preventDefault();

            var productCode = $(this).data("productCode");

            ACC.common.showLoadingSpinner("#addedToCartDiv_"+productCode);
            var removeCartProductUrl = $(this).data("removeCartProductUrl");

            $.ajax({
                url: removeCartProductUrl,
                cache: false,
                type: 'POST',
                success: function(jsonData) {
                    ACC.product.toggleAddToCartButton(productCode);
                    $('input[name=quantityInCart_' + productCode + ']').val(0);
                    $('.addToCartError_' + productCode).css("display", "none");
                    $('.MiniCart-CheckoutAction #formCheckoutAction').removeClass('sticky-addedtocart-animation');
                    $('.sticky-addtocart-animation').removeClass('sticky-addedtocart-animation');
                    if (jsonData.statusCode == 'success') {
                        ACC.minicart.updateMiniCartDisplay();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    var error = "Failed to remove item(s) from cart";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + textStatus + ", " + errorThrown + "]"
                    });
                },
                complete:function () {
                    ACC.common.hideLoadingSpinner("#addedToCartDiv_"+productCode);
                }

            });
        });
    },

    getRemoveCartProductUrl: function (productCode) {
        return ACC.config.contextPath + '/cart/product/'+ productCode + '/remove';
    },

    toggleAddToCartButton: function(productCode) {

    	$('.addedToCartDiv_' + productCode).css("display", "none");

        var buttonContainer = $('#prodtile-addToCartButton-container_' + productCode);

        if (buttonContainer.length === 0) {
            return;
        }

        $('.addToCartButton_' + productCode).toggleClass('notAdded');
        $('.addToCartButton_' + productCode).find(">button>#addbuttontextShort").css('display', 'none');
        $('.addToCartButton_' + productCode).find(">button>#addbuttontextLong").css('display', 'block');

        return;
    },
    queryStringToJSON: function (string) {
        var pairs = string.split('&');
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            var name = pair[0]
            var value = pair[1]
            if (name.length)
                if (result[name] !== undefined) {
                    if (!result[name].push) {
                        result[name] = [result[name]];
                    }
                    result[name].push(value || '');
                } else {
                    result[name] = value || '';
                }
        });
        return (result);
    },

    avgPriceHeight: function () {
        var prodpricewidth = $('.productCarouselItem .product-price').innerWidth();
        if (prodpricewidth <= 150 ) {
            $('.productCarouselItem .product-price').css({
                height: "50px"
            });
        } else {
            $('.productCarouselItem .product-price').css({
                height: "45px"
            });
        }
    },

    heartModalDialog: function() {
        $('.prodFavourite').hover(function(e) {
            $(this).addClass('hoverTempWidth').css('padding-top', '20px');
            $(this).children('div#prodFavourite-overlay').show();
        },
        function() {
            $(this).removeClass('hoverTempWidth').css('padding-top', '0');
            $('div#prodFavourite-overlay').hide();
        });
     },
    selectProduct: function() {
        $('.js-product-selection').change(function(){
            if (this.checked) {
                $('.sticky-addtolist-component').addClass('sticky-addtolist-show');
                $('#productSelectAll').attr('style', 'display:none');
                $('#productDeselectAll').attr('style', 'display:inline-block');
                $('#productAddToList').removeAttr('disabled');
                $('#productAddToTrolley').removeAttr('disabled');
            } else {
                var status = false;
                $('.js-product-selection').each(function () {
                    if(this.checked) {
                       status = true;
                       return false;
                    }
                });
                if (!status) {
                    $('.sticky-addtolist-component').removeClass('sticky-addtolist-show');
                    $('#productSelectAll').attr('style', 'display:inline-block');
                    $('#productDeselectAll').attr('style', 'display:none');
                    $('#productAddToList').attr('disabled', 'disabled');
                    $('#productAddToTrolley').attr('disabled', 'disabled');
                }
            }
        });
    }
};

$(document).ready(function () {
    ACC.product.enableAddToCartButton();
    ACC.product.avgPriceHeight();
});
$(window).on('resize', function () {
    ACC.product.avgPriceHeight();
});