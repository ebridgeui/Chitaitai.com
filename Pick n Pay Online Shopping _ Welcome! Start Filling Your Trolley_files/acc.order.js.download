ACC.order = {

	_autoload: [
	    "backToOrderHistory",
	    "backToOrders",
	    "bindMultidProduct",
	    "initButtons",
		"setupOrderConfirmationSubscriptionActiveBlock"
	],

	initButtons : function(){
		$('.add-to-my-list').addClass('dsb-list-btn');
		$('.add-to-trl').addClass('dsb-list-btn');
	},
	
  	onCheckBoxClick:function(){
  		$('button[data-select-all]').attr('data-select-all', '1').text('SELECT ALL');
 		$("input[type='checkbox']").change(function () {
 			
 		   var chkArray = [];
 		   $(".chk:checked").each(function() {
 		    chkArray.push($(this).val());
 		   });
 		   
 		   var selected;
 		   selected = chkArray.join(',') + ",";
 		   if(selected.length > 1){
 		    $('.add-to-my-list').removeClass('dsb-list-btn');
 		    $('.add-to-trl').removeClass('dsb-list-btn');
 		   $('button[data-select-all]').attr('data-select-all', '1').text('DESELECT ALL');
 		   }else{
 		    $('.add-to-my-list').addClass('dsb-list-btn');
 		    $('.add-to-trl').addClass('dsb-list-btn');
 		   }
 		});
 	},
 	
	backToOrderHistory: function(){
		$(".orderBackBtn").on("click", function(){
			var sUrl = $(this).data("backToOrders");
			window.location = sUrl;
		});
	},
	backToOrders: function(){
		$(".orderTopBackBtn").on("click", function(){
			var sUrl = $(this).data("backToOrders");
			window.location = sUrl;
		});
	},
	
	bindMultidProduct: function ()
	{
		// link to display the multi-d grid in read-only mode
		$(document).on("click",'.showMultiDGridInOrder', function (event){
			ACC.order.populateAndShowGrid(this, event, true);
			return false;
		});

		// link to display the multi-d grid in read-only mode
		$(document).on("click",'.showMultiDGridInOrderOverlay', function (event){
			ACC.order.populateAndShowCheckoutGridOverlay(this, event);
		});

	},

	populateAndShowGrid: function(element, event, readOnly)
	{
		var itemIndex = $(element).data("index");
		grid = $("#ajaxGrid" + itemIndex);
		var gridEntries = $('#grid' + itemIndex);
		
		$(element).toggleClass('open');
		
		if (!grid.is(":hidden")) {
        	grid.slideUp();
        	return;
        }

		if(grid.html() != "") {
			grid.slideToggle("slow");
			return;
		}

		var strSubEntries = gridEntries.data("sub-entries");
		var arrSubEntries= strSubEntries.split(',');
		var firstVariantCode = arrSubEntries[0].split(':')[0];

		var targetUrl = gridEntries.data("target-url");
		if (targetUrl == '') {
			targetUrl = ACC.config.contextPath + '/my-account/order/'+ gridEntries.data("order-code")  +'/getReadOnlyProductVariantMatrix';
		}

		var method = "GET";
		$.ajax({
			url: targetUrl,
			data: {productCode: firstVariantCode},
			type: method,
			success: function(data)
			{
				grid.html(data);
				grid.slideDown("slow");
			},
            error: function (xht, textStatus, ex) {
                var error = "Failed to get variant matrix";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }

		});
	},

	populateAndShowCheckoutGridOverlay: function(element, event )
	{
		event.preventDefault();

		var itemIndex = $(element).data("index");
		var gridEntries = $('#grid' + itemIndex);

		var strSubEntries = gridEntries.data("sub-entries");
		var productName = gridEntries.data("product-name");
		var arrSubEntries= strSubEntries.split(',');
		var firstVariantCode = arrSubEntries[0].split(':')[0];
		var orderCode = gridEntries.data("order-code");

		var targetUrl = ACC.config.contextPath + '/my-account/order/'+ orderCode +'/getReadOnlyProductVariantMatrix?productCode=' + firstVariantCode;

		$.colorbox({
			href:   targetUrl,
			title:  productName,
			className: 'read-only-grid',
			close:'<span class="glyphicon glyphicon-remove"></span>',
			width: window.innerWidth > parseInt(cboxOptions.maxWidth) ? cboxOptions.maxWidth : cboxOptions.width,
			height: window.innerHeight > parseInt(cboxOptions.maxHeight) ? cboxOptions.maxHeight : cboxOptions.height,
			onComplete: function() {

				var cTitle = $('#cboxTitle').clone();
				$('#cboxTitle').remove();
				cTitle.insertBefore('#cboxLoadedContent');
				$('body').addClass('offcanvas');
				var oH = $('#cboxLoadedContent').height();
				$('#cboxLoadedContent').height((oH - $('#cboxTitle').height()) +'px');

			},

			onClosed: function() {
				$('body').removeClass('offcanvas');
			}

		});
	},
	
	addProductsToTrolleyFromOrderPage : function(th){
		var productsList = new Array();
		$('.shoppinglists-itemList > .listPageHeader-short').each(function(){
			$(this).find('.shoppinglists-itemList-item .thumbSelect .chk').each(function(){
				if($(this).is(':checked')){
					productsList.push($(this).closest('.row').find('.data-prod').val());
				}
			});
		});
		var productsQuantity = new Array();		
		$('.shoppinglists-itemList > .listPageHeader-short').each(function(){
			$(this).find('.shoppinglists-itemList-item .thumbSelect .chk').each(function(){
				if($(this).is(':checked')){
					var quantity = $(this).closest('.row').find('.data-qty').val();
					if (quantity !== "0") {
                        productsQuantity.push(quantity);
                    } else {
                        productsQuantity.push(1);
					}
				}
			});
		});
		if (productsList === undefined || productsList.length == 0) {		
			productsList= [''];		
		}		
		if (productsQuantity === undefined || productsQuantity.length == 0) {		
			productsQuantity= [''];		
		}				
		$.ajax({
			type : "POST",
			url : ACC.config.encodedContextPath + '/my-account/addProductsToTrolley',
			data : {
				'productsList':productsList,'productsQuantity':productsQuantity
			},
			beforeSend: function(){
				ACC.common.showLoadingSpinner(".add-to-trolley");
			},
			success : function(data) {
				var jsonResponseData = JSON.parse(data);
				var uniqueProductCount = jsonResponseData.uniqueProductsAdded;
				var emptyHTML = false;
				var html = "";
				if(jsonResponseData.cartValidationPopUpHtml == ""){
					emptyHTML = true;
				}
				else{
					html = jsonResponseData.cartValidationPopUpHtml;
				}
				if(uniqueProductCount > 0 && emptyHTML){				
					var productCount = $('.pd-Added').attr('data-added-count',uniqueProductCount);
						html = $('.productAddedToTrolleyPopUp').html();
						$.colorbox({		
		  		    		  html : html,
		  		    		  width : '96%',
		  		    		  maxWidth : 700
		  		    	  });
					}
				else{
					ACC.shoppinglist.showProductPopUp(html, true);
				}
			},
			error : function(data) {
				console.log(data);
			},
			complete: function () {
                ACC.common.hideLoadingSpinner(".add-to-trolley");
            }
		});
	},

	setupOrderConfirmationSubscriptionActiveBlock: function() {
		if($(".js-order-confirmation-component").data("subscriptionFrequency") == "once-off") {
			$(".js-subscriptionConfirmationActiveBlock").css("display", "none");
		} else {
			$(".js-subscriptionConfirmationActiveBlock").css("display", "block");
		}

	}
};