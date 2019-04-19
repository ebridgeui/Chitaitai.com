ACC.common = {
	currentCurrency: "USD",
	processingMessage: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif'/>"),


	blockFormAndShowProcessingMessage: function (submitButton)
	{
		var form = submitButton.parents('form:first');
		form.block({ message: ACC.common.processingMessage });
	},

	refreshScreenReaderBuffer: function ()
	{
		// changes a value in a hidden form field in order
		// to trigger a buffer update in a screen reader
		$('#accesibility_refreshScreenReaderBufferField').attr('value', new Date().getTime());
	},

	showLoadingSpinner: function (attributeName, className) {
		var className = className? className: "loading-spinner-active";
        var spinnerActiveDivs = $( "<div class='uil-ellipsis-css'><div class='ib'><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div></div></div>" );

		$(attributeName).addClass(className);
        $(".loading-spinner-active button.hasSpin").prepend( spinnerActiveDivs );
        $(".loading-spinner-active .btn.hasSpin").prepend( spinnerActiveDivs );
        $(".loading-spinner-active .hasSpin.btn-custom").prepend( spinnerActiveDivs );
        $(".btn-custom.loading-spinner-active").prepend( spinnerActiveDivs );
        $(".loading-spinner-active.prodtile-addedToCart").prepend( spinnerActiveDivs );
        $("button.loading-spinner-active").prepend( spinnerActiveDivs );
        $(".loading-spinner-active .listPageHeader .header").prepend( spinnerActiveDivs );

    },

    addFavProductsToTrolley: function () {
	    var products = ACC.common.getSelectedProducts();
        ACC.common.addProductsToTrolleyFromFavPage(products);
        /*$.ajax({
            type: "GET",
            url: ACC.config.encodedContextPath + '/purchased-products/addToList',
            data: {
                'q': ACC.shoppinglist.getSearchString(window.location.href)
            },
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                ACC.common.addProductsToTrolleyFromFavPage(data);
            },
            error: function (data) {
                console.error(data);
            }
        });*/
    },

    addProductsToTrolleyFromFavPage: function (productsList) {
        var productsQuantity = [];
        for (var i = 0; i < productsList.length; i++) {
            productsQuantity.push(1);
        }

        $.ajax({
            type: "POST",
            url: ACC.config.encodedContextPath + '/my-account/addProductsToTrolley',
            data: {
                productsList: productsList || [],
                productsQuantity: productsQuantity
            },
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".add-to-trolley");
                ACC.common.showLoadingSpinner(".fav-add-to-my-trolley");
            },
            success: function (data) {
                var cartValidationHtml = JSON.parse(data).cartValidationPopUpHtml;
                if (!cartValidationHtml) {
                    ACC.colorbox.open(null, {
                        html: $('.productAddedToTrolleyPopUp').html(),
                        width: '96%',
                        maxWidth: 700,
                        height: '100%',
                        onClosed: function () {
                            window.location.reload(true);
                        },
                    });
                }
                else {
                    ACC.shoppinglist.showProductPopUp(cartValidationHtml, true);
                }
            },
            error: function (data) {
                console.error("Error when adding favourite products to cart", data);
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(".add-to-trolley");
            }
        });
	
    },
    
    hideLoadingSpinner: function (attributeName, className) {
        var className = className? className: "loading-spinner-active";
        $(attributeName).removeClass(className);
        //$(".uil-ellipsis-css").remove();
        $(".uil-ellipsis-css").not(".notCleared").remove();
    },
    productSelection: function (selectAction) {
        if (selectAction) {
            $('.sticky-addtolist-component').addClass('sticky-addtolist-show');
            $('#productSelectAll').attr('style', 'display:none');
            $('#productDeselectAll').attr('style', 'display:inline-block');
            $('#productAddToList').removeAttr('disabled');
            $('#productAddToTrolley').removeAttr('disabled');
            $('.js-product-selection').prop('checked', true);
        } else {
            $('.sticky-addtolist-component').removeClass('sticky-addtolist-show');
            $('#productSelectAll').attr('style', 'display:inline-block');
            $('#productDeselectAll').attr('style', 'display:none');
            $('#productAddToList').attr('disabled', 'disabled');
            $('#productAddToTrolley').attr('disabled', 'disabled');
            $('.js-product-selection').prop('checked', false);
        }
	},
    getSelectedProducts: function () {
	    var products = [];
        $('.js-product-selection').each(function () {
            if(this.checked) {
                products.push($(this).attr("data-productcode"));
            }
        });
        return products;
    },
    addFavourite: function (productCode, productDetailView) {
        if (undefined == productDetailView || productDetailView == '') {
            productDetailView = false;
        }
        $.ajax({
            type: "POST",
            url: ACC.config.encodedContextPath + '/favourites/add',
            data: {
                productCode: productCode,
                productDetailView: productDetailView
            },
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".btn-secondary-whiteloyalty");
                ACC.common.showLoadingSpinner("#prodFavourite-overlay .btn-secondary-whiteloyalty");
            },
            success: function (data) {
                $('.defaultWhiteProdFavourite_' + productCode).empty();
                $('.defaultWhiteProdFavourite_' + productCode).html(data)
                ACC.shoppinglist.hideActiveSpinner();
            },
            error: function () {
                ACC.shoppinglist.hideActiveSpinner();
            }
        });
    },
    removeFavourite: function (productCode, productDetailView, removeFromView) {
	    if (undefined == productDetailView || productDetailView == '') {
            productDetailView = false;
        }
        if (undefined == removeFromView || removeFromView == '') {
            removeFromView = false;
        }

        $.ajax({
            type: "POST",
            url: ACC.config.encodedContextPath + '/favourites/remove',
            data: {
                productCode: productCode,
                productDetailView: productDetailView
            },
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".btn-secondary-whiteloyalty");
                ACC.common.showLoadingSpinner("#prodFavourite-overlay .btn-secondary-whiteloyalty");
            },
            success: function (data) {
                ACC.shoppinglist.hideActiveSpinner();
                if (!removeFromView) {
                    $('.defaultWhiteProdFavourite_' + productCode).empty();
                    $('.defaultWhiteProdFavourite_' + productCode).html(data)
                }
                if (removeFromView) {
                    $('#productCarouselItemContainer_' + productCode).remove();
                }
            },
            error: function () {
                ACC.shoppinglist.hideActiveSpinner();
            }
        });
    },
    productDisplayView: function (displayView) {
        $.ajax({
            url: ACC.config.encodedContextPath + "/store/productDisplayView",
            data: {view: displayView},
            type: "POST",
            success: function (data) {
            },
            error: function (xht, textStatus, ex) {
                alert("Error setting productDisplayView - " + displayView);
            }
        });
    }
};

/* Extend jquery with a postJSON method */
jQuery.extend({
	postJSON: function (url, data, callback)
	{
		return jQuery.post(url, data, callback, "json");
	}
});

// add a CSRF request token to POST ajax request if its not available
$.ajaxPrefilter(function (options, originalOptions, jqXHR)
{
	// Modify options, control originalOptions, store jqXHR, etc
	if (options.type === "post" || options.type === "POST")
	{
		var noData = (typeof options.data === "undefined");
		if (typeof options.data !='object' && (noData || options.data.indexOf("CSRFToken") === -1))
		{
			options.data = (!noData ? options.data + "&" : "") + "CSRFToken=" + ACC.config.CSRFToken;
		}
	}
});

//override jQuery ajax error function with a custom error callback
(function($){

    var originalAjaxMethod = $.ajax;

    $.ajax = function(options){

            var thisError = (typeof options.error == 'function') ? options.error : function(){};
            options.error = function(xhr,status,error) {
                if (xhr.responseText != undefined && xhr.responseText.indexOf('AJAXExpiredSessionRedirect') !== -1) {
                    window.location.replace('/pnpstorefront/welcome');
                } else {
                    //call original error callback
                    thisError(xhr,status,error);
                }
            };
        return originalAjaxMethod(options);
    };

})(jQuery);



window.onload = function(){
    var spinnerActiveDivs2 = $( "<div class='uil-ellipsis-css'><div class='ib'><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div><div class='spincircle'><div></div></div></div></div>" );
    $(".loading-spinner-active .listPageHeader .header").prepend( spinnerActiveDivs2 );
};
