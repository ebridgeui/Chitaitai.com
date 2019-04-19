ACC.payment = {

    activateSavedPaymentButton: function () {

        $(document).on("click", ".js-saved-payments", function (e) {
            e.preventDefault();

            var title = $("#savedpaymentstitle").html();

            $.colorbox({
                href: "#savedpaymentsbody",
                inline: true,
                maxWidth: "100%",
                opacity: 0.7,
                width: "320px",
                title: title,
                close: '<span class="glyphicon glyphicon-remove"></span>',
                onComplete: function () {
                }
            });
        })
    },
    bindPaymentCardTypeSelect: function () {
        ACC.payment.filterCardInformationDisplayed();
        $("#card_cardType").change(function () {
            var cardType = $(this).val();
            if (cardType == '024') {
                $('#startDate, #issueNum').show();
            }
            else {
                $('#startDate, #issueNum').hide();
            }
        });
    },
    filterCardInformationDisplayed: function () {
        var cardType = $('#card_cardType').val();
        if (cardType == '024') {
            $('#startDate, #issueNum').show();
        }
        else {
            $('#startDate, #issueNum').hide();
        }
    },
    showCreditCardView: function () {
        $("#creditCardPaymentMethodDisplayWrapper").show();
        $("#accountPaymentMethodDisplayWrapper").hide();
    },
    showAccountView: function () {
        $("#creditCardPaymentMethodDisplayWrapper").hide();
        $("#accountPaymentMethodDisplayWrapper").show();
    },
    setupPaymentMenuButtons: function () {
        $("#creditCardButton").click(function () {
            ACC.payment.showCreditCardView();
        });
        $("#onAccountButton").click(function () {
            ACC.payment.showAccountView();
        });
    },
    showPaymentViewOnInitialLoad: function () {
        if ($("#openCreditCardView").val() == "true" || $("#openCreditCardView").length == 0) {
            ACC.payment.showCreditCardView();
        } else if ($("#openCreditCardView").val() == "false") {
            ACC.payment.showAccountView();
        }
    },
    updateAccountOrderTotal: function (totalPriceFormatPrice) {
        if (totalPriceFormatPrice !== undefined) {
            div = $('.js-account-payment-order-total');
            if (div.length) {
                div.html(totalPriceFormatPrice);
            }
        }
    },
    renderAccountPaymentRestrictionPopup: function () {

        var title = $("[name='account-payment-restriction-header-text']").html();
        var text = $("[name='account-payment-restriction-text']").html();

        if (title === undefined || text === undefined) {
            return;
        }

        ACC.colorbox.open(title, {
            className: 'accPayRestrictionOverlay',
            html: text,
            overlayClose: false,
            width: 725,
            scrolling: false,
            escKey: false,
            closeButton: true
        });

    },
    hasCustomerAccountPaymentRestrictionCheck: function () {
        var hasRestriction = $("[name='account-payment-restriction-text']").val();
        if (hasRestriction !== undefined && hasRestriction === 'true') {
            var wrapper = $("#accountPaymentMethodDisplayWrapper");
            if (wrapper !== undefined && wrapper.isVisible()) {
                ACC.payment.renderAccountPaymentRestrictionPopup();
            }
        }
    },
    showFailedToUpdatePaymentPopUpIfNecessary: function () {
        var unableToUpdatePaymentInfoHtml = $(".js-unable-to-update-payment");
        var displayUnableToUpdatePaymentInfo = $(".js-display-unable-to-update-payment").val();
        ACC.payment.showPopUp(unableToUpdatePaymentInfoHtml, displayUnableToUpdatePaymentInfo);
    },
    showSuccessfullyUpdatedPaymentPopUpIfNecessary: function () {
        var successfullyUpdatedPaymentInfoHtml = $(".js-successfully-updated-payment");
        var displaySuccessfullyUpdatedPaymentInfo = $(".js-display-successfully-updated-payment").val();
        ACC.payment.showSuccessfullPopUp(successfullyUpdatedPaymentInfoHtml, displaySuccessfullyUpdatedPaymentInfo);
    },
    showPopUp: function (elementContainingHtml, showPopUpInputElement) {
        if (showPopUpInputElement == "true") {
            elementContainingHtml.css("display", "block");
            ACC.colorbox.open("", {
                className: "unableToUpdatePopUp",
                html: elementContainingHtml,
                overlayClose: false,
                width: 400,
                height: 300,
                scrolling: false,
                escKey: false,
                close: '<span class="glyphicon glyphicon-remove"></span>'
            });
        }
    },
    showSuccessfullPopUp: function (elementContainingHtml, showPopUpInputElement) {
        if (showPopUpInputElement == "true") {
            elementContainingHtml.css("display", "block");
            ACC.colorbox.open("", {
                className: "ableToUpdatePopUp",
                html: elementContainingHtml,
                overlayClose: false,
                width: 400,
                height: 300,
                scrolling: false,
                escKey: false,
                close: '<span class="glyphicon glyphicon-remove"></span>'
            });
        }
    }
}
$(document).ready(function () {
    with (ACC.payment) {
        activateSavedPaymentButton();
        bindPaymentCardTypeSelect();
        showPaymentViewOnInitialLoad();
        setupPaymentMenuButtons();
        showFailedToUpdatePaymentPopUpIfNecessary();
        showSuccessfullyUpdatedPaymentPopUpIfNecessary();
    }
});
	
	
	
