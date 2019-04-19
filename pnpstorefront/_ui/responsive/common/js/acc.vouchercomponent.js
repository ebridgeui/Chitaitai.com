ACC.vouchercomponent = {

    _autoload: [
        ["bindCheckoutButtonsToVoucherComponent", $(".cart-voucher").length > 0]
    ],
    bindCheckoutButtonsToVoucherComponent: function() {
        $('#checkoutButtonTop').click(function() {
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            }
            else {
                var targetUrl = ACC.config.contextPath + '/checkout/multi/summary/next';
                if($('input[name="inAmendOrder"]') && $('input[name="inAmendOrder"]').val() == "true") {
                    targetUrl = ACC.config.contextPath + '/checkout/multi/summary/amendOrder';
                }
                ACC.ordersummarycheckoutcomponent.checkout();
                window.location.href = targetUrl;
            }
        });

        $('#formCartCheckoutAction').submit(function(ev) {
            ev.preventDefault(); // to stop the form from submitting
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            } else {
                this.submit(); // If all the validations succeeded
            }
        });


        $('#formCartCheckoutSideAction').submit(function(ev) {
            ev.preventDefault(); // to stop the form from submitting
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            } else {
                this.submit(); // If all the validations succeeded
            }
        });
        $('#formCheckoutFulfilmentCheckoutSideAction').submit(function(ev) {
            ev.preventDefault(); // to stop the form from submitting
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            } else {
                this.submit(); // If all the validations succeeded
            }
        });

        $('#formCheckoutFulfilmentContinueSideAction').submit(function(ev) {
            ev.preventDefault(); // to stop the form from submitting
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            } else {
                this.submit(); // If all the validations succeeded
            }
        });

        var cartOrderSummaryCheckoutButtonJqueryArray = ACC.vouchercomponent.overrideDefaultButtonOnclick('.js-cart-ord-sum-act-btn');
        cartOrderSummaryCheckoutButtonJqueryArray.click(function() {
            if(ACC.vouchercomponent.hasForgottenVouchers()) {
                ACC.vouchercomponent.displayForgottenVouchersPopup();
            }
            ACC.ordersummarycheckoutcomponent.checkout();
            this.navigateAfterValidation && this.navigateAfterValidation(arguments)

        });
    },
    hasForgottenVouchers: function() {
        if ($('[name="voucherCode"]').length > 0) {
            var voucherCode = $('[name="voucherCode"]').val();
            return $.trim(voucherCode).length > 0;
        } else {
            return false;
        }
    },
    displayForgottenVouchersPopup: function() {
        ACC.colorbox.open(" ", {
            html: $("#forgotVoucher").html(),
            width: "95%",
            height: "100%",
            maxWidth: "550px",
            className: "freeDelVoucherModal"
        });
    },
    overrideDefaultButtonOnclick: function (jquerySelector) {
        var cartOrderSummaryCheckoutButtonJqueryArray = $(jquerySelector);
        for (var i = 0; i < cartOrderSummaryCheckoutButtonJqueryArray.length; i++) {
            var checkoutButton = cartOrderSummaryCheckoutButtonJqueryArray[i];
            checkoutButton.navigateAfterValidation = checkoutButton.onclick;
            checkoutButton.onclick = null;
        }
        return cartOrderSummaryCheckoutButtonJqueryArray;
    }
}
