ACC.ordersummarycheckoutcomponent = {

    _autoload: [
        "bindOrderSummaryCheckout",
        ["bindTvLicenseCheckout", $("#tvLicenceRequiredModalDialog").length > 0]
    ],

    bindOrderSummaryCheckout: function () {

        var shopBagPreference;
        var currentShoppingBagPreference;
        var currentDeliveryInstructions;
        var erpUnavailable;
        var customerIsBlocked;
        var creditLimitExceeded;


        $(document).ready(function ()
        {
            currentDeliveryInstructions = $('#hiddenDeliveryInstructions').val();
            currentShoppingBagPreference = $('#hiddenShoppingBagPreference').val();
            erpUnavailable = $('#isErpUnavailable').val();
            customerIsBlocked = $('#isCustomerIsBlocked').val();
            creditLimitExceeded = $('#isCreditLimitExceeded').val();

            $('#deliveryInstructions').val(currentDeliveryInstructions);

            if (currentShoppingBagPreference == "true") {

                $('#shoppingBagPreference').prop('checked', true);
                $('#noShoppingBagPreference').prop('checked', false);

            } else {
                $('#shoppingBagPreference').prop('checked', false);
                $('#noShoppingBagPreference').prop('checked', true);

            }

            if (erpUnavailable == "true") {
                ACC.colorbox.open("", {
                    title: $(document).find('#erpTitle').html(),
                    html: $(document).find('#erpBody').html(),
                    overlayClose: false,
                    width: 725,
                    scrolling: false,
                    escKey: false,
                    closeButton: true
                });
            } else if (customerIsBlocked == "true") {
                ACC.colorbox.open("", {
                    title: $(document).find('#blockedTitle').html(),
                    html: $(document).find('#blockedBody').html(),
                    overlayClose: false,
                    width: 725,
                    scrolling: false,
                    escKey: false,
                    closeButton: true
                });
            } else if (creditLimitExceeded == "true") {
                ACC.colorbox.open("", {
                    title: $(document).find('#limitTitle').html(),
                    html: $(document).find('#limitBody').html(),
                    overlayClose: false,
                    width: 725,
                    scrolling: false,
                    escKey: false,
                    closeButton: true
                });
            }
        });


        $(document).on("blur", "#deliveryInstructions", ACC.ordersummarycheckoutcomponent.updateOrderPreferences);
        $("input[name='shoppingBagPreference']").change(ACC.ordersummarycheckoutcomponent.updateOrderPreferences);
        $(document).on("blur", ".js-purchase-order-number-field>span>.inputField", ACC.ordersummarycheckoutcomponent.updateOrderPreferences);
        ACC.ordersummarycheckoutcomponent.setupSubscriptionInformationDisplay($("#subscriptionFrequency").val());
    },
    checkout: function () {
        if ($(".js-delivery-contact-number").length > 0) {
            ACC.deliverycontactnumber.updateContactNumber();
        }
    },
    updateOrderPreferences: function () {

        var deliveryInstructions = $('#deliveryInstructions').val();

        var shopBagPreference = $("input[name='shoppingBagPreference']:checked").val();

        var purchaseOrderNumber = $('.js-purchase-order-number-field>span>.inputField').val();

        var orderPreferenceForm = {};

        orderPreferenceForm.deliveryInstructions = deliveryInstructions;
        orderPreferenceForm.shoppingBagPreference = shopBagPreference;
        orderPreferenceForm.purchaseOrderNumber = purchaseOrderNumber;

        var targetUrl = ACC.config.contextPath + '/checkout/multi/summary/orderPreferences';
        var method = "POST";
        $.ajax({
            url: targetUrl,
            type: method,
            data: orderPreferenceForm,
            success: function (response) {

            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update order preferences on the cart";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });
    },

    bindTvLicenseCheckout: function () {

        $(document).on("click", "#js-continute-without-tv-btn", function (e) {
            var targetUrl = ACC.config.contextPath + '/checkout/multi/summary/forceCheckoutWithOutTvLicense';

            $.ajax({
                url: targetUrl,
                type: 'POST',
                beforeSend: function () {
                    ACC.common.showLoadingSpinner(".noTV-hasSpinContainer");
                },
                success: function (response) {

                    $("#tvLicenceDiv").hide();
                    ACC.ordersummarycheckoutcomponent.displayTvLicenseModalDialogCheckoutAction(false);
                    ACC.ordersummarycheckoutcomponent.displayTvLicensecheckoutButtonTop(true)

                    ACC.carttotal.updateCartTotalValues();
                    ACC.colorbox.close();

                    if (response.redirectUrl != null && response.redirectUrl != "") {
                        window.location = ACC.config.encodedContextPath + response.redirectUrl;
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to force checkout without tv License";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                },
                complete: function () {
                    ACC.common.hideLoadingSpinner(".noTV-hasSpinContainer");
                }
            });
        });

        $(document).on("click", "#js-verify-tv-license-btn", function () {
            ACC.colorbox.close();
        });

        $('.js-tv-license-modal-dialog-checkout-action').click(function () {

            var deliveryContactNumberValid = $(".js-delivery-contact-number").length > 0? ACC.deliverycontactnumber.validate() : true;
            if(deliveryContactNumberValid){
                var tvlicTitle = $(document).find('#tvlicTitle').html();

                ACC.colorbox.open(" ", {
                    html: $("#displayTvLicenseModalDialog").html(),
                    title: '<div class="headline"><span class="headline-text">' + tvlicTitle + '</span></div>',
                    width: "95%",
                    maxWidth: "680px",
                    className: "tvlic-cbox"
                });
            }
        });
    },

    canCheckoutWithOutTvLicense: function () {
        var targetUrl = ACC.ordersummarycheckoutcomponent.canCheckoutWithOutTvLicenseUrl();
        $.ajax({
            url: targetUrl,
            cache: false,
            type: 'GET',
            success: function (response) {

                if (response.cannotCheckout == 'true') {
                    ACC.ordersummarycheckoutcomponent.displayTvLicenseModalDialogCheckoutAction(true);
                    ACC.ordersummarycheckoutcomponent.displayTvLicensecheckoutButtonTop(false)

                } else {
                    ACC.ordersummarycheckoutcomponent.displayTvLicenseModalDialogCheckoutAction(false);
                    ACC.ordersummarycheckoutcomponent.displayTvLicensecheckoutButtonTop(true)
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to verify CheckoutWithOutTvLicense";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });

    },

    canCheckoutWithOutTvLicenseUrl: function () {
        return ACC.config.contextPath + '/checkout/multi/summary/canCheckoutWithOutTvLicense';
    },

    displayTvLicenseModalDialogCheckoutAction: function (show) {
        $(".js-tv-license-modal-dialog-checkout-action").each(function (index) {
            if (show) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },

    displayTvLicensecheckoutButtonTop: function (show) {
        $(".js-tv-license-checkout-button-top").each(function (index) {
            if (show) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },

    setupSubscriptionInformationDisplay: function (subscriptionFrequency) {
        var weeklySubscriptionInformation = $(".js-order-summary-weekly-subscription-information");
        var monthlySubscriptionInformation = $(".js-order-summary-monthly-subscription-information");

        if (subscriptionFrequency == "weekly") {
            weeklySubscriptionInformation.css("display", "inline-block");
            monthlySubscriptionInformation.css("display", "none");

        } else if (subscriptionFrequency == "monthly") {
            weeklySubscriptionInformation.css("display", "none");
            monthlySubscriptionInformation.css("display", "inline-block");

        } else {
            weeklySubscriptionInformation.css("display", "none");
            monthlySubscriptionInformation.css("display", "none");
        }

    }
};