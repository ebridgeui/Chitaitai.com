ACC.deliverycontactnumber = {

    bindEvents: function () {
        $(".js-delivery-contact-number .inputField").on("blur", ACC.deliverycontactnumber.validate);
        $(".js-delivery-contact-number .inputField").on("keyup", ACC.deliverycontactnumber.validateOnKeyPress);
        $("#js-no-delivery-contact-number-checkbox").on("change", ACC.deliverycontactnumber.handleCheckboxChange);
        ACC.deliverycontactnumber.populateContactNumber();
    },
    populateContactNumber: function () {
        var contactNumber = $("input[name ^= 'contactNumberValue']").val();
        $(".js-delivery-contact-number .inputField").val(contactNumber);
        ACC.deliverycontactnumber.validate(contactNumber);
    },
    validate: function (contactNumber) {
        var contactNumber = contactNumber ? contactNumber : $(".js-delivery-contact-number .inputField").val();
        var contactNumberValid = ACC.deliverycontactnumber.isContactNumberValid();
        if (contactNumber) {
            contactNumberValid ? ACC.deliverycontactnumber.showValidContactNumber() : ACC.deliverycontactnumber.showInvalidContactNumber();
        }
        return contactNumberValid;
    },
    validateOnKeyPress: function () {
        var contactNumber = $(".js-delivery-contact-number .inputField").val();
        contactNumber = contactNumber.replace(/\s/g, "");
        if (!ACC.deliverycontactnumber.onlyContainsNumbers(contactNumber) || !ACC.deliverycontactnumber.hasValidCountryCode(contactNumber)) {
            ACC.deliverycontactnumber.validate();
        }
        var normalizeContactNumber = ACC.deliverycontactnumber.normalizeContactNumber(contactNumber);
        if (normalizeContactNumber.length == 12) {
            ACC.deliverycontactnumber.validate(normalizeContactNumber);
        }
    },
    handleCheckboxChange: function () {
        var doesNotHaveValidSAContact = $("#js-no-delivery-contact-number-checkbox").is(':checked');
        if (doesNotHaveValidSAContact) {
            $(".js-delivery-contact-number .inputField").prop('disabled', true);
            ACC.deliverycontactnumber.showNoContactNumberValidation();
        } else {
            $(".js-delivery-contact-number .inputField").prop('disabled', false);
            ACC.deliverycontactnumber.validate();
        }
    },
    normalizeContactNumber: function (contactNumber) {
        if (!contactNumber.startsWith("+27")) {
            return contactNumber.replace("0", "+27");
        }
        return contactNumber;
    },
    hasValidCountryCode: function (number) {
        var regEx = new RegExp(/^((?:\+27)|0)/);
        return regEx.test(number);
    },
    onlyContainsNumbers: function (number) {
        var regExp = new RegExp(/^[0-9 +]+$/);
        return regExp.test(number);
    },
    isContactNumberValid: function () {
        var contactNumber = $(".js-delivery-contact-number .inputField").val();
        if (contactNumber) {
            contactNumber = contactNumber.replace(/\s/g, "");
            var regExp = new RegExp(/^((?:\+27)|0)(=60|61|62|63|64|65|66|67|71|72|73|74|76|78|79|81|82|83|84)(\d{7})$/);
            return regExp.test(contactNumber);
        }
        return false;
    },
    updateContactNumber: function () {
        var doesNotHaveValidSAContact = $("#js-no-delivery-contact-number-checkbox").is(':checked');
        if (!doesNotHaveValidSAContact) {
            if (ACC.deliverycontactnumber.isContactNumberValid()) {
                ACC.deliverycontactnumber.updateNumber();
            } else {
                ACC.deliverycontactnumber.showInvalidContactNumber();
            }
        }
    },
    updateNumber: function () {
        var url = ACC.config.contextPath + '/delivery-contact-number';
        var contactNumber = $(".js-delivery-contact-number .inputField").val();
        var doesNotHaveValidSAContact = $("#js-no-delivery-contact-number-checkbox").is(':checked');
        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: {contactNumber: contactNumber, doesNotHaveValidSAContact: doesNotHaveValidSAContact},
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".js-cart-ord-sum-act-btn");
            },
            success: function (data) {
                if (data.success == false) {
                    ACC.deliverycontactnumber.showInvalidContactNumber();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to save contact number";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });

            },
            complete: function () {
                ACC.common.hideLoadingSpinner(".js-cart-ord-sum-act-btn");
            }
        });
    },
    showInvalidContactNumber: function () {
        $(".js-invalid-contact-number-message").show();
        $(".js-delivery-contact-number .inputField").focus();
        $(".js-delivery-contact-number .inputField").removeClass("valid-green");
        $(".js-delivery-contact-number .inputField").addClass("invalid-red");
        $(".js-valid-tick").hide();
        $(".js-invalid-tick").show();

    },
    showValidContactNumber: function () {
        $(".js-invalid-contact-number-message").hide();
        $(".js-delivery-contact-number .inputField").removeClass("invalid-red");
        $(".js-delivery-contact-number .inputField").addClass("valid-green");
        $(".js-invalid-tick").hide();
        $(".js-valid-tick").show();
    },
    showNoContactNumberValidation: function () {
        $(".js-invalid-contact-number-message").hide();
        $(".js-delivery-contact-number .inputField").removeClass("valid-green");
        $(".js-delivery-contact-number .inputField").removeClass("invalid-red");
        $(".js-valid-tick").hide();
        $(".js-invalid-tick").hide();
    },
    redirectToNext: function (redirectUrl) {
        window.location.href = redirectUrl;
    }
}
$(document).ready(function () {
    if ($(".js-delivery-contact-number").length > 0) {
        ACC.deliverycontactnumber.bindEvents();
    }
});
