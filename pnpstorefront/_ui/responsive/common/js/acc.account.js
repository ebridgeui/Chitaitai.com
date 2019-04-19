ACC.account = {


    _autoload: [
        "bindAll",
        "bindPicker",
        "updateAccountSummary",
        "cardIcons",
        ["initCreditCardPaymentMethod", $(".js-saved-credit-cards").length > 0]
    ],

    updateAccountSummary: function() {
        var url;
        var componentUids = [];
        $('[name="accountSummaryContainer"]').each(
                function(i, div) {
                        if (i === 0) {
                            url = $(div).data('url');
                        }
                        componentUids.push($(div).data('componentUid'))
                }
            );

        $.each(componentUids, function(index, value) {
                ACC.account.updateAccountSummaryContainer(url, value);
            }
        );
    },

    updateAccountSummaryContainer: function(url, componentUid) {
        $.ajax({
            url: url + componentUid,
            type: 'GET',
            success: function (data) {
                $('#accountSummaryContainer_' + componentUid).html(data);
            },
            error: function (xht, textStatus, ex) {
                return null
            }
        });
    },

    bindPicker: function()
    {
        $('#dateRange-container .input-daterange.input-group.date').datepicker({
            format: "dd/mm/yy",
            autoclose: true,
            todayHighlight: true,
            maxViewMode: 2
        });
    },

	bindAll: function () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
        });

        $(document).on("click",'#search', function (e){
   	        ACC.account.handleSearchEvent(this, e);
   		});

        $(document).on("change", "#orderStatusSelect", function (e) {
            e.preventDefault();
            ACC.account.handleOrderStatusSelectChangeEvent(this, e);
        });

        $(document).on("click", ".js-order-cancel-request", function (e) {
            e.preventDefault();
            ACC.account.handleOrderCancelRequestEvent(this, e);
        });

        $(document).on("click", ".js-order-cancel-yes", function (e) {
            e.preventDefault();
            ACC.account.handleOrderCancelYesEvent(this, e);
        });

        $(document).on("click", ".js-order-cancel-no", function (e) {
            e.preventDefault();
            ACC.account.handleOrderCancelNoEvent(this, e);
        });

        $(document).on("click", ".js-subscription-cancel-request", function (e) {
            e.preventDefault();
            ACC.account.handleSubscriptionCancelRequestEvent(this, e);
        });

        $(document).on("click", ".js-subscription-cancel-yes", function (e) {
            e.preventDefault();
            ACC.account.handleSubscriptionCancelYesEvent(this, e);
        });

        $(document).on("click", ".js-subscription-cancel-no", function (e) {
            e.preventDefault();
            ACC.account.handleSubscriptionCancelNoEvent(this, e);
        });

        $(document).on("click", "#clearFromDate", function (e) {
            e.preventDefault();
            ACC.account.handleClearFromDateEvent(this, e);
        });

        $(document).on("click", "#clearToDate", function (e) {
            e.preventDefault();
            ACC.account.handleClearToDateEvent(this, e);
        });

        $(document).on("keydown", "#fromDate", function (e) {
            if(e.keyCode != 9 && !(e.shiftKey && e.keyCode == 9)) {
                e.preventDefault();
            }
        });

        $(document).on("keydown", "#toDate", function (e) {
            if(e.keyCode != 9 && !(e.shiftKey && e.keyCode == 9)) {
                e.preventDefault();
            }
        });

        $(document).on("click", ".cancel-order-popup-success .overlay-close", function (e) {
            e.preventDefault();
            window.location.reload();
        });

        $(document).on("click", ".cancel-subscription-popup-success .overlay-close", function (e) {
            e.preventDefault();
            window.location.reload();
        });

        $(document).on("click", ".cancel-subscription-popup-success-with-orders .overlay-close", function (e) {
            e.preventDefault();
            window.location.reload();
        });

        $(document).on("click", ".js-remove-saved-credit-card-request", function (e) {
            e.preventDefault();
            ACC.account.handleRemoveSavedCreditCardRequest(this, e);
        });

        $(document).on("click", ".js-remove-expired-credit-card", function (e) {
            e.preventDefault();
            ACC.account.handleRemoveExpiredCreditCard(this, e);
        });

        $(document).on("click", ".js-confirm-remove-credit-card-no", function (e) {
            e.preventDefault();
            ACC.account.handleConfirmRemoveCreditCardNo(this, e);
        });

        $(document).on("click", ".js-confirm-remove-credit-card-yes", function (e) {
            e.preventDefault();
            ACC.account.handleConfirmRemoveCreditCardYes(this, e);
        });

        $(document).on("click", ".js-saved-credit-card-selected", function (e) {
            ACC.account.handleSavedCreditCardSelected(this, e);
        });

	},

    initCreditCardPaymentMethod: function () {

        var selectedSavedCreditCard = $("input[name='savedCreditCardPreference']:checked");
        if (selectedSavedCreditCard.length > 0) {
                ACC.account.setHiddenPaymentInfoData(selectedSavedCreditCard.data('paymentInfoId'));
        }
        ACC.account.updatePayNowButton();
    },

	handleClearFromDateEvent: function (elementRef, e) {
	    var form = $(elementRef).closest("form");
	    form.find("#fromDate").val('');
        ($('#dateRange-container .input-daterange.input-group.date').data('datepicker')).pickers[0].setDate('');
	},

	handleClearToDateEvent: function (elementRef, e) {
	    var form = $(elementRef).closest("form");
	    form.find("#toDate").val('');
	    ($('#dateRange-container .input-daterange.input-group.date').data('datepicker')).pickers[1].setDate('');
	},

    handleOrderStatusSelectChangeEvent: function (elementRef, e) {

        var status = elementRef.value;

        ACC.account.handleDoSearch(elementRef, status);
    },

    handleSearchEvent: function(elementRef, e) {

        ACC.account.handleDoSearch(elementRef, undefined);
    },

    handleDoSearch: function(elementRef, selectedStatus) {

        var url = $(elementRef).data("searchUrl");
        var form = $(elementRef).closest("form")

        if( typeof selectedStatus === 'undefined' ) {
            selectedStatus = "&status=" + form.find("#orderStatusSelect").find(":selected").val();
        } else {
            selectedStatus = "&status=" + selectedStatus;
        }

        var fromDate = "&fromDate=" + (form.find("#fromDate").val()).replace(/\//g,'-');
        var toDate = "&toDate=" + (form.find("#toDate").val()).replace(/\//g,'-');

        selectedSource = "&source=" + form.find("#orderSourceSelect").find(":selected").val();

        window.location.href = ACC.config.contextPath + url + selectedSource + selectedStatus + fromDate + toDate;

    },

    handleOrderCancelRequestEvent: function(elementRef, e) {

        var orderCode = $(elementRef).data("orderCode");
        //$(".page-orders .popups-container").show(); //added
        $(".page-orders #popups_" + orderCode).show();
        $("#cancelOrderPopup_" + orderCode).show();
    },

    handleOrderCancelNoEvent: function(elementRef, e) {

        var orderCode = $(elementRef).data("orderCode");
        $(".page-orders .popups-container").hide(); // added
        $("#cancelOrderPopup_" + orderCode).hide();
    },

    handleOrderCancelYesEvent: function(elementRef, e) {

        var url = $(elementRef).data("orderCancelUrl");
        var orderCode = $(elementRef).data("orderCode");

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            success: function(jsonData) {
                if (jsonData.statusCode == 'success') {
                    $("#cancelOrderPopup_" + orderCode).hide();
                    $("#cancelOrderPopupSuccess_" + orderCode).show();
                    $('.overlay-message-dl-2-close').show();
                } else {
                    $("#cancelOrderPopup_" + orderCode).hide();
                    $("#cancelOrderPopupFailure_" + orderCode).show();
                    $('.overlay-message-dl-2-close').show();
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to cancel order";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });

    },

    handleSubscriptionCancelRequestEvent: function(elementRef, e) {

        var orderCode = $(elementRef).data("orderCode");
        //$(".page-orders .popups-container").show(); //added
        $(".page-orders #popups_" + orderCode).show();
        $("#cancelSubscriptionPopup_" + orderCode).show();
    },

    handleSubscriptionCancelNoEvent: function(elementRef, e) {

        var orderCode = $(elementRef).data("orderCode");
        $(".page-orders .popups-container").hide(); // added
        $("#cancelSubscriptionPopup_" + orderCode).hide();
    },

    handleSubscriptionCancelYesEvent: function(elementRef, e) {

        var url = $(elementRef).data("orderCancelUrl");
        var orderCode = $(elementRef).data("orderCode");

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            success: function(jsonData) {
                if (jsonData.statusCode == 'success') {
                    if (!$.isEmptyObject(jsonData.scheduledOrders) ) {
                        $("#cancelSubscriptionPopup_" + orderCode).hide();
                        $("#cancelSubscriptionPopupSuccessWithOrders_" + orderCode).append("<span> <strong>IMPORTANT</strong>: Your subscription has been cancelled. However, one or more of your subscription orders has already been processed. Please cancel the following order(s) manually to ensure you don’t receive them and aren’t charged for them. <ul><li>"+jsonData.scheduledOrders +"</li></ul> </span> <div class=\"overlay-close\"></div>" ).show();
                        $('.overlay-message-dl-2-close').show();
                    } else{
                        $("#cancelSubscriptionPopup_" + orderCode).hide();
                        $("#cancelSubscriptionPopupSuccess_" + orderCode).show();
                        $('.overlay-message-dl-2-close').show();
                    }

                } else {
                    $("#cancelSubscriptionPopup_" + orderCode).hide();
                    $("#cancelSubscriptionPopupFailure_" + orderCode).show();
                    $('.overlay-message-dl-2-close').show();
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to cancel subscription";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });

    },

    handleRemoveSavedCreditCardRequest: function(elementRef, e) {
        $(e.target).closest('.js-saved-credit-card').find('.js-confirm-remove-credit-card').show();
    },

    handleConfirmRemoveCreditCardYes: function(elementRef, e) {
        ACC.account.handleRemoveSavedCreditCard(elementRef, e);
    },

    handleConfirmRemoveCreditCardNo: function(elementRef, e) {
        $(e.target).closest('.js-confirm-remove-credit-card').hide();
    },

    handleRemoveExpiredCreditCard: function(elementRef, e) {
        ACC.account.handleRemoveSavedCreditCard(elementRef, e);
    },

    handleSavedCreditCardSelected: function(elementRef, e) {

        var paymentInfoId = $(elementRef).data("paymentInfoId");
        ACC.account.setHiddenPaymentInfoData(paymentInfoId);
        ACC.account.enablePayNowButton(true);

    },

    handleRemoveSavedCreditCard: function(elementRef, e) {

        var paymentInfoId = $(elementRef).data("paymentInfoId");
        var url = $(elementRef).data("accountUrl") + "/paymentMethod/" + paymentInfoId + "/remove";

        var row = $(e.target).closest('.js-saved-credit-card');
        var radioButton = row.find('.js-saved-credit-card-selected');

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            beforeSend: function(){
                //ACC.common.showLoadingSpinner();
            },
            success: function(jsonData){
                if (jsonData.statusCode == 'success') {
                    if (jsonData.hasSavedCreditCards == "false") {
                            location.reload();
                    } else {
                        var row = $(e.target).closest('.js-saved-credit-card');
                        var radioButton = row.find('.js-saved-credit-card-selected');
                        if (radioButton.prop('checked')) {
                            radioButton.prop('checked', false)
                            ACC.account.enablePayNowButton(false);
                        }
                        row.remove();
                    }
                } else {
                    alert(jsonData.errorMsg);
                }
            },
            complete:function () {
                //ACC.common.hideLoadingSpinner();
            }
        });
    },

    updatePayNowButton: function () {

        var savedCreditCardSelected = $("input[name='savedCreditCardPreference']:checked");

        if (savedCreditCardSelected.length > 0) {
            ACC.account.enablePayNowButton(true);
        } else {
            ACC.account.enablePayNowButton(false);
        }
    },

    setHiddenPaymentInfoData: function (id) {
        $(document).find("#postFormPaymentInfoId").val(id);
    },

    enablePayNowButton: function (status) {
        if (status) {
            $('#payNow').removeAttr('disabled');
        } else {
            $('#payNow').attr('disabled', 'disabled');
        }
    },

    cardIcons: function(){
        $(window).on("resize", function () {
            if ( $('.heading-SavedCards').width() < 570 ) {
                $('.heading-SavedCards').addClass('narrow');
            } else {
                $('.heading-SavedCards').removeClass('narrow');
            }
        }).resize();
    }
};
