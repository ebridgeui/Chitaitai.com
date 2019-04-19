ACC.paymentDetails = {
    _autoload: [
        "showRemovePaymentDetailsConfirmation"
    ],

    showRemovePaymentDetailsConfirmation: function () {
        $(document).on("click", ".removePaymentDetailsButton", function () {
            var paymentId = $(this).data("paymentId");
            var popupTitle = $(this).data("popupTitle");

            ACC.colorbox.open(popupTitle, {
                inline: true,
                href: "#popup_confirm_payment_removal_" + paymentId,
                onComplete: function () {
                    $(this).colorbox.resize();
                }
            });

        })
    },

    calculateLoyaltyFundsToUse: function (orderTotal, loyaltyFundsToUse, loyaltyFundsAvailable) {

        if (loyaltyFundsAvailable <= 0) {
            return 0;
        }

        if (loyaltyFundsToUse <= 0) {
            return 0;
        }

        /*
        find the lowest of loyaltyFundsToUse, orderTotal, loyaltyFundsAvailable as the value to submit
        */
        if(orderTotal < loyaltyFundsToUse) {
            loyaltyFundsToUse = orderTotal;
        }
        if(loyaltyFundsAvailable < loyaltyFundsToUse) {
            loyaltyFundsToUse = loyaltyFundsAvailable;
        }

        return loyaltyFundsToUse;
    },

    updateSmartShopperPointsOrderTotal: function (orderTotal) {
        if (orderTotal === undefined) {
            return;
        }

        span = $('.js-order-total');
        if (span.length > 0) {
            span.attr('data-order-total', orderTotal);
            ACC.paymentDetails.refreshSmartShopperPoints();
        }
    },

    refreshSmartShopperPoints: function () {
        var loyaltyFundsAvailable = parseFloat($('.js-loyalty-funds-available').attr('data-loyalty-funds-available'));
        var orderTotal = parseFloat($('.js-order-total').attr('data-order-total'));
        var loyaltyFundsToUseInput = $('.js-loyalty-funds-to-use');

        //dont allow blank field
        if( loyaltyFundsToUseInput.is(':empty') ) {
            loyaltyFundsToUseInput.text('0');
        }

        //update order total is this call is being executed because of a carttotal update etc
        $('.js-order-total').html("R" + orderTotal.toLocaleString({ style: "currency" }));

        //The amount of loyalty funds to use is entered into this field for submission
        var loyaltyFundsToUseFormField = $('.js-loyalty-funds-to-use-form-field');
        try {
            var loyaltyFundsToUse = parseFloat(loyaltyFundsToUseInput.html());

            if (loyaltyFundsToUse > orderTotal) {
                loyaltyFundsToUseInput.html(orderTotal);
            } else if (loyaltyFundsToUse > loyaltyFundsAvailable) {
                loyaltyFundsToUseInput.addClass('amount-to-use-error');
            } else {
                loyaltyFundsToUseInput.removeClass('amount-to-use-error');
            }

            loyaltyFundsToUse = ACC.paymentDetails.calculateLoyaltyFundsToUse(orderTotal, loyaltyFundsToUse, loyaltyFundsAvailable)
            loyaltyFundsToUseFormField.val(loyaltyFundsToUse);
            $('.js-total-credit-card-funds-to-use').html("R" + (orderTotal - loyaltyFundsToUse).toLocaleString({ style: "currency" }));

        } catch (e) {
            loyaltyFundsToUseInput.addClass('amount-to-use-error');
            loyaltyFundsToUseFormField.val(0);
        }
    }
};

$(".js-loyalty-funds-to-use").click(function (e) {
    e.stopPropagation();
    $('.smartshopperpointscomponent').find('.js-loyalty-funds-to-use').attr({
        contenteditable: true,
        spellcheck: false
    }).focus();
});

$(document).on("blur", ".smartshopperpointscomponent", function () {
    ACC.paymentDetails.refreshSmartShopperPoints();
});

$(document).on("keypress", ".amount-to-use", function (e) {

    //only allow numerals
    $(this).val($(this).val().replace(/[^0-9.]/g, ''));
    if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
        e.preventDefault();
    }

    //limit to 7 characters
    if (this.innerHTML.length > 6) {
        e.preventDefault();
        e.stopPropagation();
    }
});
