ACC.cartitem = {

	hitCounterPlus:0,
	hitCounterMinus:0,

	_autoload: [
		"bindCartItem",
		"bindCartItemPanel",
		"initButtons",
		"removeBorderBottomOnCartEmpty",
		"onMyLoad"
	],

	submitTriggered: false,

    bindCartItem: function() {

        // Remove selected
        $('.js-remove-selected-items').on("click", function (e) {
            e.preventDefault();
            ACC.cartitem.handleRemoveSelectedItems(this);
        });
    },

    bindCartItemPanel: function () {

        var cartItemsPanel = $("#cartItemsPanel");

        if (cartItemsPanel == undefined) {
            return;
        }

        //remove
        cartItemsPanel.on("click", '.remove-entry-button', function(e) {
            ACC.cartitem.handleRemoveEntry(this, e);
        });

        //quantity
        cartItemsPanel.on("blur", '.update-entry-quantity-input', function(e) {
            ACC.cartitem.handleUpdateQuantity(this, e);
        });
        cartItemsPanel.on("keyup", '.update-entry-quantity-input', function(e) {
            ACC.cartitem.handleKeyEvent(this, e);
        });
        cartItemsPanel.on("keydown", '.update-entry-quantity-input', function(e) {
            ACC.cartitem.handleKeyEvent(this, e);
        });

        //text note (instructions)
        cartItemsPanel.on("blur", '.update-entry-textNotes-input', function(e) {
            ACC.cartitem.handleUpdateTextNotes(this, e);
        });
        cartItemsPanel.on("keyup", '.update-entry-textNotes-input', function(e) {
            ACC.cartitem.handleTextNotesKeyEvent(this, e);
        });
        cartItemsPanel.on("keydown", '.update-entry-textNotes-input', function(e) {
            ACC.cartitem.handleTextNotesKeyEvent(this, e);
        });

        // Plus
        cartItemsPanel.on("click", '.js-mini-cart-qty-selector-plus', function(e) {
            ACC.cartitem.handlePlusClick(this, e);
        });

        // Minus
        cartItemsPanel.on("click", '.js-mini-cart-qty-selector-minus', function(e) {
            ACC.cartitem.handleMinusClick(this, e);
        });

        // Select Item
        cartItemsPanel.on("click", "input[name=selectItem]", function(e) {
            ACC.cartitem.handleSelectedItemClick(this);
        });


        // Substitute
	    cartItemsPanel.on("click", '.js-cart-entry-substitute-selector', function(e) {
            ACC.cartitem.handleUpdateAllowSubstitute(this, e);
        });

        // Substitute All
        cartItemsPanel.on("click", '#doSubstituteRadioButton', function() {
            ACC.cartitem.updateAllowSubstitutes(true);
        });

        // Substitute None
        cartItemsPanel.on("click", '#doNotSubstituteRadioButton', function(e) {
            ACC.cartitem.updateAllowSubstitutes(false);
        });

        // Weight Drop Down
        cartItemsPanel.on("click", ".js-quantityDropDown", function(e) {
            ACC.cartitem.handleUpdateToFixedQuantity(this, e, true);
        });

        // Messages
        cartItemsPanel.on("click", ".js-close-stock-message-button", function(e) {
            ACC.cartitem.handleCloseStockMessageButton(this, e);
        });

        cartItemsPanel.on("click", ".js-close-stock-message-button-no-update", function(e) {
            ACC.cartitem.handleCloseStockMessageNoUpdateButton(this, e);
        });

        cartItemsPanel.on("click", ".js-continue-message-button", function(e) {
            e.preventDefault();
            var orderCode = $('#hiddenOrderCode').val();
            ACC.cartitem.handleContinueMessageButton(orderCode);
        });
    },

	initButtons: function () {
		ACC.cartitem.enableSelectItemActionButtons(false);

	},

	handlePlusClick: function (elementRef, e) {
		ACC.cartitem.hitCounterPlus++;
		var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
		var form = $('#updateCartForm' + loopIndex[1]);
        var productCode = form.find('input[name=productCode]').val();
		var cartQuantity = form.find('input[name=quantity]');

        //ACC.common.showLoadingSpinner("#product-item_"+productCode);
        $(e.target).closest('.shoppinglists-itemList-item').find('.spin-loader').show(); // Show loading spinner

		// Enable the minus button if the Qty != 1
		var minusButton = form.find('#btnMinus_' + loopIndex[1]);
		minusButton.prop("disabled", (cartQuantity.val() == 1));

		// Only allow make a server call once every 1 sec
		setTimeout(function(){
			if (ACC.cartitem.hitCounterPlus > 0) {
				ACC.cartitem.handleUpdateQuantity(cartQuantity, e);
				ACC.cartitem.hitCounterPlus = 0;
			}
			ACC.cartitem.hitCounterPlus=0;
		},1000);
	},

	handleMinusClick: function (elementRef, e) {
		ACC.cartitem.hitCounterMinus++;
		var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
		var form = $('#updateCartForm' + loopIndex[1]);
        var productCode = form.find('input[name=productCode]').val();
		var cartQuantity = form.find('input[name=quantity]');

		//ACC.common.showLoadingSpinner("#product-item_"+productCode);
        $(e.target).closest('.shoppinglists-itemList-item').find('.spin-loader').show(); // Show loading spinner

		// Disable the minus button if the Qty == 1
		var minusButton = form.find('#btnMinus_' + loopIndex[1]);
		minusButton.prop("disabled", (cartQuantity.val() == 1));

		// Only allow make a server call once every 1 sec
		setTimeout(function(){
			if (ACC.cartitem.hitCounterMinus > 0) {
				ACC.cartitem.handleUpdateQuantity(cartQuantity, e);
				ACC.cartitem.hitCounterMinus = 0;
			}
			ACC.cartitem.hitCounterMinus=0;
		},1000);
	},

	handleKeyEvent: function (elementRef, event) {
		//console.log("key event (type|value): " + event.type + "|" + event.which);

		// If the key pressed was not numeric, ignore it
		if (elementRef.value != elementRef.value.replace(/[^0-9\.]/g, '')) {
			elementRef.value = elementRef.value.replace(/[^0-9\.]/g, '');
			return false;
		}

		if (event.which == 13 && !ACC.cartitem.submitTriggered) {
			ACC.cartitem.submitTriggered = ACC.cartitem.handleUpdateQuantity(elementRef, event);
			return ACC.cartitem.submitTriggered;
		} else {
			// Ignore all key events once submit was triggered
			if (ACC.cartitem.submitTriggered) {
				return false;
			}
		}

		return true;
	},

	handleTextNotesKeyEvent: function (elementRef, event) {
		//console.log("key event (type|value): " + event.type + "|" + event.which);

		if (event.which == 13 && !ACC.cartitem.submitTriggered) {
			ACC.cartitem.submitTriggered = ACC.cartitem.handleUpdateTextNotes(elementRef, event);
			return ACC.cartitem.submitTriggered;
		} else {
			// Ignore all key events once submit was triggered
			if (ACC.cartitem.submitTriggered) {
				return false;
			}
		}

		return true;
	},

	handleUpdateQuantity: function (elementRef, event) {
		var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
		var form = $('#updateCartForm' + loopIndex[1]);
		var productCode = form.find('input[name=productCode]').val();
		var initialCartQuantity = form.find('input[name=initialQuantity]').val();
		var newCartQuantity = form.find('input[name=quantity]').val();

		// If the value entered is not numeric or if less than 1, ignore it.
		if (!$.isNumeric(newCartQuantity) || newCartQuantity < 1)
		{
			form.find('input[name=quantity]').val(initialCartQuantity);
            $(event.target).closest('.shoppinglists-itemList-item').find('.spin-loader').hide(); // Show loading spinner
			return false;
		}

		if (initialCartQuantity != newCartQuantity) {
			ACC.track.trackUpdateCart(productCode, initialCartQuantity, newCartQuantity);
			form.find('input[name=fieldUpdated]').val('quantity');
			ACC.cartitem.updateCartItems(form, event);
			return true;
		}

		$(event.target).closest('.shoppinglists-itemList-item').find('.spin-loader').hide(); // Show loading spinner

        return false;
	},

    handleUpdateToFixedQuantity: function (elementRef, event) {
        var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
        var form = $('#updateCartForm' + loopIndex[1]);

        var newCartQuantity = JSON.parse(form.find('select[name=fixedQuantity]').val()).quantity;

        var quantityInput = form.find('input[name=quantity]');
        quantityInput.val(newCartQuantity);

        //Blur fires the ordinary quantity change event, which will not handle the update
        quantityInput.blur();
    },

	handleUpdateTextNotes: function (elementRef, event) {
		var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
		var form = $('#updateCartForm' + loopIndex[1]);
		var productCode = form.find('input[name=productCode]').val();
		var initialTextNotes = form.find('input[name=initialTextNotes]').val();
		var newTextNotes = form.find('input[name=textNotes]').val();

		if (initialTextNotes != newTextNotes) {
			ACC.track.trackUpdateCartTextNotes(productCode, initialTextNotes, newTextNotes);
			form.find('input[name=fieldUpdated]').val('cartEntryData');
			ACC.cartitem.updateCartItems(form, event);
			return true;
		}

		return false;
	},

	handleUpdateAllowSubstitute: function (elementRef, event) {
		var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
		var form = $('#updateCartForm' + loopIndex[1]);
		var initialAllowSubstitute = form.find('input[name=initialAllowSubstitute]').val();

        var newAllowSubstitute = false;
		if ($(elementRef).hasClass('js-allow-substitute')) {
            newAllowSubstitute = true;
		}

		if (initialAllowSubstitute != newAllowSubstitute) {
			form.find('input[name=fieldUpdated]').val('cartEntryData');
			form.find('input[name=allowSubstitute]').val(newAllowSubstitute);
			ACC.cartitem.updateCartItems(form, event);
			return true;
		}

		return false;
	},

	handleRemoveSelectedItems: function (elementRef) {

		ACC.cartitem.enableSelectItemActionButtons(false);

		var productList = $("#productList")
		var entryList = [];

		var form = $(elementRef).closest("form")

		productList.find("input[name=selectItem]").each(function (index) {
			var formSelected = $(this).closest("form")
			if  ($(this).is(':checked')) {
			    var productCode = formSelected.find('input[name=productCode]').val()
            	entryList.push(productCode);
            }
		});

		if (entryList.length == 0) {
			ACC.cartitem.enableSelectItemActionButtons(true);
			return false;
		}

		var entryItems = entryList.join();

		$.ajax({
            url: ACC.config.contextPath + "/cart/items/remove",
            cache: false,
            type: 'POST',
            data: {entryItems: entryItems},
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".js-remove-selected-items");
            },
            success: function (data) {
                ACC.cartitem.showCartItems();
                return true;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "An error occurred while removing your items(s) from your cart";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
                ACC.cartitem.showCartItems();
                return false;
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(".js-remove-selected-items");
            }
		});

		return true;
	},

	handleSelectAll: function (elementRef) {

		var productList = $("#productList");
		productList.find("input[name=selectItem]").each(function (index) {
			$(this).prop('checked', true);

		});
		ACC.cartitem.enableSelectItemActionButtons(true);

	},

	handleSelectedItemClick: function (elementRef) {

		ACC.cartitem.enableSelectItemActionButtons(false);

		var productList = $("#productList");
		productList.find("input[name=selectItem]").each(function (index) {
			if  ($(this).is(':checked')) {
				ACC.cartitem.enableSelectItemActionButtons(true);
				return;
			}

		});

	},

	enableSelectItemActionButtons: function (enable)
	{
		if(enable) {
            $('.js-remove-selected-items').prop('disabled', false).addClass('remove-selected-red');
            $('.js-save-to-shopping-list').prop('disabled', false);
		} else {
            $('.js-remove-selected-items').prop('disabled', true).removeClass('remove-selected-red');
            $('.js-save-to-shopping-list').prop('disabled', true);		}
    },

  	onMyLoad :function(){
	  	$('.js-save-to-shopping-list').on('click', function(){
	    	event.preventDefault();
	    	$('.js-save-to-shopping-list').prop('type', 'button');
	    	$('.js-save-to-shopping-list').attr('data-option', 'add');
	    	ACC.shoppinglist.addOrCopyItemsToList(this);
	    });
	  },

    updateAllowSubstitutes: function(doSubstitute){
		$.ajax({
			url: ACC.config.contextPath + "/cart/updateAllowSubstitutes",
			data: {doSubstitute: doSubstitute},
			type: "POST",
            success: function (data) {
                if (data != null && data.success === false) {
                    console.log("data:", data);
                    console.error("Failed to execute allow substitutes update", data);
                    var error = data.message;
                    $.toaster({message: error, priority: 'danger', logMessage: error});
                } else {
                    ACC.cartitem.showCartItems();
                }
            },
            error: function (xht, textStatus, ex) {
                console.error("Failed to execute allow substitutes update", xht, textStatus, ex);
                var error = data.message;
                $.toaster({message: error, priority: 'danger'});

            }
		});
	},

    handleRemoveEntry: function(elementRef, event) {
        var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
        var form = $('#updateCartForm' + loopIndex[1]);

        var productCode = form.find('input[name=productCode]').val();
        var initialCartQuantity = form.find('input[name=initialQuantity]');
        var cartQuantity = form.find('input[name=quantity]');

        ACC.track.trackRemoveFromCart(productCode, initialCartQuantity.val());

        cartQuantity.val(0);
        initialCartQuantity.val(0);
        form.find('input[name=fieldUpdated]').val('quantity');

        $(event.target).closest('.shoppinglists-itemList-item').find('.spin-loader').show(); // Show loading spinner
        $(elementRef).attr("disabled", "disabled");

        ACC.cartitem.updateCartItems(form, event);
    },

    handleCloseStockMessageButton: function (elementRef, event) {
        var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
        var form = $('#updateCartForm' + loopIndex[1]);

        var productCode = form.find('input[name=productCode]').val();
        var initialCartQuantity = form.find('input[name=initialQuantity]');
        var cartQuantity = form.find('input[name=quantity]');

        var newCartQuantity = elementRef.dataset.availableQuantity;

        if (newCartQuantity == 0) {
            ACC.track.trackRemoveFromCart(productCode, initialCartQuantity.val());
        }

        cartQuantity.val(newCartQuantity);
        form.find('div .stock-message-container').hide();
        form.find('input[name=fieldUpdated]').val('quantity');
        ACC.cartitem.updateCartItems(form, event);
    },

    handleCloseStockMessageNoUpdateButton: function (elementRef, event) {
        var loopIndex = $(elementRef).attr('id').split(/_(.+)/);
        var form = $('#updateCartForm' + loopIndex[1]);

        form.find('div .stock-message-container').hide();
        ACC.cartitem.refreshCartCheckoutActionButton();
    },

    handleContinueMessageButton: function (orderCode) {
      $.ajax({
      	url: ACC.config.contextPath + "/cart/continue?orderCode="+orderCode,
        type: "GET",
    	success: function(response) {
    	    if (response.statusCode == 'success') {
                 if (response.redirectUrl == "/cart") {
    			        	$('#displayAmendMessage').show();
    			 } else {
                        window.location.href = ACC.config.contextPath + response.redirectUrl;
    			 }
            } else {
                var error = response.errorMsg;
                $.toaster({message: error, priority: 'danger', logMessage: error});

            }
        }, error: function (xht, textStatus, ex) {
              var error = "Failed to continue amend sales order on the cart";
              $.toaster({
                  message: error,
                  priority: 'danger',
                  logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
              });
          }
      });
    },

    refreshCartCheckoutActionButton: function() {
        if (!$(".productlistContainer").find('.stock-message-container').is(':visible')) {
        	ACC.radiodropdown.bindRadioButtonClick();
        }
    },

    displayEmptyCartMiddleContentDiv: function() {
        var firstCartItemForm = $(".updateCartForm0");

        if (firstCartItemForm.length == 0) {
            $('#emptyCartMiddleContentDiv').show();
            ACC.cartitem.removeCartBorderBottom();
               document.location.href = "#top";
               //$("html, body").animate({ scrollTop: 0 }, "slow");
        }
    },

    removeCartBorderBottom: function (firstCartItem) {
        //remove bottom border on cart empty as per spec
        $(".template-pages-CartPageTemplate #accountvoucherlistcomponent.accountvoucherlistcomponent.accountVoucherList-landscape").css("border", "none");
    },

	removeBorderBottomOnCartEmpty: function(){
        //remove bottom border on cart empty as per spec
        var firstCartItemForm = $(".updateCartForm0");
        if (firstCartItemForm.length == 0) {
            ACC.cartitem.removeCartBorderBottom();
        }
    },

    showCartItems: function() {

        $.ajax({
            url: ACC.config.contextPath + "/cart/cartItemsPanel",
            cache: false,
            type: 'GET',
            success: function(response){
                $("#cartItemsPanel").html(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to load cart item(s)";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function(xhr, textStatus ) {
                if (textStatus === 'success') {
                    ACC.cartitem.postUpdateCartItems();
                    if ($('input[name=cartpageTotalItems]').length) {
                        $("#myTrolleyCount").html($('input[name=cartpageTotalItems]').val());
                    }
                }
            }
        });
    },

    updateCartItems: function(form, e) {
        var data = form.serialize();
        var productCode = form.find('input[name=productCode]').val();

        targetId = $(e.currentTarget).attr("id");

        $.ajax({
            url: ACC.config.contextPath + "/cart/update",
            cache: false,
            type: 'POST',
            data: data,
            success: function(response){
                $("#cartItemsPanel").html(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update cart item(s)";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
                //if we got here from a remove entry action, enable the remove button
                if (targetId != undefined && targetId.match("^removeEntry")) {
                    $(e.currentTarget).removeAttr("disabled");
                }
            },
            complete: function(xhr, textStatus ) {
                if (textStatus === 'success') {
                    ACC.cartitem.postUpdateCartItems();
                    //update the round red trolley counter in the header
                    if ($('input[name=cartpageTotalItems]').length) {
                        $("#myTrolleyCount").html($('input[name=cartpageTotalItems]').val());
                    }
                }
                //ACC.common.hideLoadingSpinner("#product-item_"+productCode);
                $(e.target).closest('.shoppinglists-itemList-item').find('.spin-loader').hide(); // Show loading spinner
            }
        });
    },

    postUpdateCartItems: function() {
        ACC.cartitem.refreshCartCheckoutActionButton();
        ACC.cartitem.displayEmptyCartMiddleContentDiv();
        ACC.carttotal.updateCartTotalValues();
        ACC.account.updateAccountSummary();
        ACC.radiodropdown.bindRadioButtonClick();
    }
};

$(document).ready(function (e) {
    $(".js-quantityDropDown").trigger('change');
});