ACC.accountsummary = {

    _autoload: [
        "bindPaymentOptionsRadioButtons"
    ],

    bindPaymentOptionsRadioButtons: function(){

            $(document).on("click", ".js-account-summary-pay-by-card", function (e) {
                e.preventDefault();
                ACC.accountsummary.ajaxSetPaymentMethod(this, e, "js-account-summary-pay-by-card");
            });

            $(document).on("click", ".js-account-summary-pay-by-account", function (e) {
                e.preventDefault();
                ACC.accountsummary.ajaxSetPaymentMethod(this, e, "js-account-summary-pay-by-account");
            });
    },
    
    ajaxSetPaymentMethod: function (elementRef, e, jsClassRef) {

        var targetUrl = $(elementRef).data('url');
        var paymentMode = $(elementRef).data('paymentMode');
        var errorMessage = $(elementRef).data('errorMessage');

        $.ajax({
            url: targetUrl,
            data: {paymentMode: paymentMode},
            type: "POST",
            success: function (data) {
                if (data != null && data.isSuccess === 'false') {
                    console.error(errorMessage, data);
                    $.toaster({message: errorMessage, priority: 'danger'});

                } else {
                    if (data.hasCustomerAccountPaymentRestriction === 'true') {
                        ACC.payment.renderAccountPaymentRestrictionPopup();
                    } else {
                        $(document).find("." + jsClassRef).each(function (index) {
                            $(this).prop('checked', true);
                        });
                    }
                }
            },
            error: function (xht, textStatus, ex) {
                console.error(errorMessage, xht, textStatus, ex);
                $.toaster({message: errorMessage, priority: 'danger'});
            }
        });
    }
}



