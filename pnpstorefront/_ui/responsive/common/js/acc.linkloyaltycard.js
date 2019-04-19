ACC.linkloyaltycard = {

    bindEvents: function () {
        $(".mini-card .nextButton").click({parent: ".mini-card "}, ACC.linkloyaltycard.updateBusinessPartnerIdOrPassportNumber);
        $(".large-card .nextButton").click({parent: ".large-card "}, ACC.linkloyaltycard.updateBusinessPartnerIdOrPassportNumber);

        $(".mini-card .linkButton").click({parent: ".mini-card "}, ACC.linkloyaltycard.linkSmartShopperCardNumber);
        $(".large-card .linkButton").click({parent: ".large-card "}, ACC.linkloyaltycard.linkSmartShopperCardNumber);

        $(".mini-card input[name ^= 'idOrPassportRadioButton']").change({parent: ".mini-card "}, ACC.linkloyaltycard.hideOrShowDateOfBirthTextBox);
        $(".large-card input[name ^= 'idOrPassportRadioButton']").change({parent: ".large-card "}, ACC.linkloyaltycard.hideOrShowDateOfBirthTextBox);

        $(".mini-card input[name ^= 'idOrPassportRadioButton']").change({parent: ".mini-card "}, ACC.linkloyaltycard.clearLinkloyaltyHasIdError);
        $(".large-card input[name ^= 'idOrPassportRadioButton']").change({parent: ".large-card "}, ACC.linkloyaltycard.clearLinkloyaltyHasIdError);

        $(".mini-card .idOrPassportNumberTextBox").focus({parent: ".mini-card "}, ACC.linkloyaltycard.clearLinkloyaltyHasIdError);
        $(".large-card .idOrPassportNumberTextBox").focus({parent: ".large-card "}, ACC.linkloyaltycard.clearLinkloyaltyHasIdError);

        $(".mini-card .dateOfBirthTextBox").focus({parent: ".mini-card "}, ACC.linkloyaltycard.clearLinkloyaltyDOBHasIdError);
        $(".large-card .dateOfBirthTextBox").focus({parent: ".large-card "}, ACC.linkloyaltycard.clearLinkloyaltyDOBHasIdError);

        //$(".mini-card .dateOfBirthTextBox").focusout({parent: ".mini-card "}, ACC.linkloyaltycard.clearLinkloyaltyDOBHasIdErrorfocusout);
        //$(".large-card .dateOfBirthTextBox").focusout({parent: ".large-card "}, ACC.linkloyaltycard.clearLinkloyaltyDOBHasIdErrorfocusout);

        $(".mini-card .smartShopperCardNumberTextBox").focus({parent: ".mini-card "}, ACC.linkloyaltycard.clearLinkloyaltySSHasIdError);
        $(".large-card .smartShopperCardNumberTextBox").focus({parent: ".large-card "}, ACC.linkloyaltycard.clearLinkloyaltySSHasIdError);
    },

    hideOrShowDateOfBirthTextBox: function (event) {
        var parent = event.data.parent;
        $(parent +".idOrPassportNumberTextBox").val("");
        $(parent +".dateOfBirthTextBox").val("");
        var idOrPassportRadioButton = $(parent +"input[name ^= 'idOrPassportRadioButton']:checked");
        var dateOfBirthTextBox = $(parent +".dateOfBirthTextBox");
        if (idOrPassportRadioButton.val() == "id") {
            dateOfBirthTextBox.hide();
            $('.idOrPassportNumberTextBox').attr('placeholder','Enter your ID number').removeClass('input_passport');
        } else if (idOrPassportRadioButton.val() == "passport") {
            dateOfBirthTextBox.show();
            $('.idOrPassportNumberTextBox').attr('placeholder','Enter your passport number').addClass('input_passport');
        }
    },

    updateBusinessPartnerIdOrPassportNumber: function (event) {
        var parent = event.data.parent;
        var idOrPassportRadioButton = $(parent + "input[name ^= 'idOrPassportRadioButton']:checked");
        var idOrPassportNumberTextBox = $(parent +".idOrPassportNumberTextBox");

        if (idOrPassportRadioButton.val() == "id") {
            if (idOrPassportNumberTextBox.val().length != 13 || isNaN(idOrPassportNumberTextBox.val())) {
                var idNumberLengthErrorMessage = $(parent +".idNumberLengthErrorMessage").val();
                idOrPassportNumberTextBox.val(idNumberLengthErrorMessage).addClass(parent +"linkloyalty-hasIdError");
                $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
            } else {
                ACC.linkloyaltycard.updateBusinessPartnerIdNumber(parent);
            }
        } else if (idOrPassportRadioButton.val() == "passport") {
            var dateTextBox = $(parent +".dateOfBirthTextBox");
            var passportNumber = $(parent +".idOrPassportNumberTextBox").val();

            if (passportNumber.length <= 0) {
                var invalidPassportNumberErrorMessage = $(parent +".invalidPassportNumberErrorMessage").val();
                idOrPassportNumberTextBox.val(invalidPassportNumberErrorMessage);
                idOrPassportNumberTextBox.addClass(parent +"linkloyalty-hasIdError");
                $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
            }
            if (!ACC.linkloyaltycard.isValidDateOfBirth(dateTextBox.val())) {
                var invalidDateOfBirthErrorMessage = $(parent +".invalidDateOfBirthErrorMessage").val();
                dateTextBox.val(invalidDateOfBirthErrorMessage);
                dateTextBox.addClass(parent +"linkloyalty-hasIdError");
                $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
            } else {
                ACC.linkloyaltycard.updateBusinessPartnerPassportNumberAndDateOfBirth(parent);
            }
        }
    },

    clearLinkloyaltyHasIdError: function (event) {
        var parent = event.data.parent;
        var idOrPassportNumberTextBox = $(parent+ ".idOrPassportNumberTextBox");
        if ( idOrPassportNumberTextBox.hasClass("linkloyalty-hasIdError") ) {
            idOrPassportNumberTextBox.prop("value", "");
            idOrPassportNumberTextBox.removeClass("linkloyalty-hasIdError");
            $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", false);
        }
    },
    clearLinkloyaltyDOBHasIdError: function (event) {
        var parent = event.data.parent;
        var dateTextBox = $(parent +".dateOfBirthTextBox");
        if (dateTextBox.hasClass("linkloyalty-hasIdError") ) {
            dateTextBox.prop("value", "");
            dateTextBox.removeClass("linkloyalty-hasIdError");
            $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", false);
        }
    },
    clearLinkloyaltyDOBHasIdErrorfocusout: function (event) {
        var parent = event.data.parent;
        var dateTextBox = $(parent +".dateOfBirthTextBox");
        dateTextBox.prop("value", "");
    },

    linkSmartShopperCardNumber: function (event) {
        var parent = event.data.parent;
        var smartShopperCardNumberTextBox = $(parent +".smartShopperCardNumberTextBox");
        if (smartShopperCardNumberTextBox.val().length != 16 || isNaN(smartShopperCardNumberTextBox.val())) {
            var smartShopperCardNumberLengthErrorMessage = $(parent +".smartShopperCardNumberLengthErrorMessage").val();
            smartShopperCardNumberTextBox.val(smartShopperCardNumberLengthErrorMessage).addClass("linkloyalty-hasIdError");
            $(parent +".linkButton").prop("disabled", true);
        } else {
            ACC.linkloyaltycard.updateBusinessPartnerSmartShopperCardNumber(parent);
        }
    },
    clearLinkloyaltySSHasIdError: function (event) {
        var parent = event.data.parent;
        var smartShopperCardNumberTextBox = $(parent +".smartShopperCardNumberTextBox");
        if ( smartShopperCardNumberTextBox.hasClass("linkloyalty-hasIdError") ) {
            smartShopperCardNumberTextBox.prop("value", "");
            smartShopperCardNumberTextBox.removeClass("linkloyalty-hasIdError");
            $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", false);
        };
        if ( $(parent +".linkloyaltycardFormDiv").hasClass("alreadyLinked") ) {
            $(parent +".linkButton").css("display", "inline-block");
            $(parent +".whyIsThisHappeningLink").hide();
            $(parent +".linkloyaltycardFormDiv").removeClass("alreadyLinked");
        };
    },

    updateBusinessPartnerIdNumber: function (parent) {
        var idNumber = $(parent +".idOrPassportNumberTextBox").val();
        $.ajax({
            url: ACC.config.contextPath + "/linkloyaltycard/byidnumber",
            cache: false,
            data: {idNumber: idNumber},
            type: 'POST',
            beforeSend: function () {
                ACC.common.showLoadingSpinner(parent +".nextButton");
            },
            success: function (data) {
                if (data.success == true) {
                    ACC.linkloyaltycard.showStepTwoInLinkCardProcess(parent);
                }
                else {
                    var idOrPassportNumberTextBox = $(parent +".idOrPassportNumberTextBox");
                    if (data.errorCode == 103) {
                        var invalidIdNumberErrorMessage = $(parent +".invalidIdNumberErrorMessage").val();
                        idOrPassportNumberTextBox.val(invalidIdNumberErrorMessage).addClass(parent +"linkloyalty-hasIdError");
                    } else if (data.errorCode == 1001) { // id already linked
                        var idNumberAlreadyLinkedErrorMessage = $(parent +".idNumberAlreadyLinkedErrorMessage").val();
                        idOrPassportNumberTextBox.val(idNumberAlreadyLinkedErrorMessage);

                        idOrPassportNumberTextBox.addClass("linkloyalty-hasIdError");
                        $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
                    }
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update id number";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(parent +".nextButton");
            }
        });
    },

    updateBusinessPartnerPassportNumberAndDateOfBirth: function (parent) {
        var passportNumber = $(parent +".idOrPassportNumberTextBox").val();
        var dateOfBirth = $(parent +".dateOfBirthTextBox").val();
        $.ajax({
            url: ACC.config.contextPath + "/linkloyaltycard/bypassportnumber",
            cache: false,
            data: {passportNumber: passportNumber, dateOfBirth: dateOfBirth},
            type: 'POST',
            beforeSend: function () {
                ACC.common.showLoadingSpinner(parent +".nextButton");
            },
            success: function (data) {
                if (data.success == true) {
                    ACC.linkloyaltycard.showStepTwoInLinkCardProcess(parent);
                }
                else {
                    var idOrPassportNumberTextBox = $(parent +".idOrPassportNumberTextBox");
                    if (data.errorCode == 103) {
                        var invalidIdNumberErrorMessage = $(parent +".invalidIdNumberErrorMessage").val();
                        idOrPassportNumberTextBox.val(invalidIdNumberErrorMessage).addClass(parent +"linkloyalty-hasIdError");
                    }
                    if (data.errorCode == 1002) { //passport already linked
                        var idNumberAlreadyLinkedErrorMessage = $(parent +".idNumberAlreadyLinkedErrorMessage").val();
                        idOrPassportNumberTextBox.val(idNumberAlreadyLinkedErrorMessage);

                        idOrPassportNumberTextBox.addClass("linkloyalty-hasIdError");
                        $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update passport number and date of birth";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(parent +".nextButton");
            }
        });
    },

    updateBusinessPartnerSmartShopperCardNumber: function (parent) {
        var smartShopperCardNumber = $(parent +".smartShopperCardNumberTextBox").val();
        var refreshPage = $(parent +".refreshPage").val();
        $.ajax({
            url: ACC.config.contextPath + "/linkloyaltycard/bysmartshoppercardnumber",
            cache: false,
            data: {smartShopperCardNumber: smartShopperCardNumber},
            type: 'POST',
            beforeSend: function () {
                ACC.common.showLoadingSpinner(parent +".linkButton");
            },
            success: function (data) {
                if (data.success == true) {
                    refreshPage == "true" && window.location.reload();
                }
                else {
                    var smartShopperCardNumberTextBox = $(parent +".smartShopperCardNumberTextBox");
                    if (data.errorCode == 1003) {
                        var invalidCardErrorMessage = $(parent +".invalidCardErrorMessage").val();
                        smartShopperCardNumberTextBox.val(invalidCardErrorMessage).addClass(parent +"linkloyalty-hasIdError");
                    } else if (data.errorCode == 1004) { //card already linked
                        var cardAlreadyLinkedErrorMessage = $(parent +".cardAlreadyLinkedErrorMessage").val();
                        smartShopperCardNumberTextBox.val(cardAlreadyLinkedErrorMessage);
                        $(parent +".linkButton").hide();
                        $(parent +".whyIsThisHappeningLink").css("display", "inline-block");
                        $(parent +".smartShopperCardNumberTextBox").parent(".linkloyaltycardFormDiv").addClass("alreadyLinked");

                        smartShopperCardNumberTextBox.addClass("linkloyalty-hasIdError");
                        $(parent +".linkloyaltycardFormDiv .btn").prop("disabled", true);
                    }
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update smart shopper card number";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(parent +".linkButton");
            }
        });
    },

    isValidDateOfBirth: function (date) {
        var dateReg = /^\d{2}([\/])\d{2}\1\d{2}$/;

        if (date.match(dateReg) == null) {
            return false;
        }

        var temp = date.split('/');
        // date = new Date(Number(temp[2]), Number(temp[1]) - 1, Number(temp[0]));

        var day = Number(temp[0]);
        var month = Number(temp[1]);
        var year = Number(temp[2]);

        if (day == NaN || month == NaN || year == NaN) {
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        /* if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
         monthLength[1] = 29;
         if (!((year.toString().length == 4) && (year > 1800 && year < new Date().getFullYear()))) {
         return false;
         }*/
        if (!(month > 0 && month < 13)) {
            return false;
        }
        if (day < 0 || day > monthLength[month - 1]) {
            return false;
        }
        return true;
    },

    showStepTwoInLinkCardProcess: function (parent) {
        $(parent +".stepOneSection").hide();
        $(parent +".stepTwoSection").show();
        $(parent +".smartShopperPromptWithoutStepMessage").hide();
        $(parent +".smartShopperPromptMessage").show();
    }

}
$(document).ready(function () {
    if ($(".linkloyaltycardcomponent").length > 0) {
        ACC.linkloyaltycard.bindEvents();
    }
});
