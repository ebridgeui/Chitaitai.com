ACC.tvlicence = {

    bindEvents: function () {
        $("#uploadButton").click(ACC.tvlicence.openUploadDialog);
        $("#file").change(ACC.tvlicence.uploadFile);
        $("#verifyIdNumberButton").click(ACC.tvlicence.verifyIdNumber);
        $("#idNumberTextBox").on('input', ACC.tvlicence.changeButtonTextToDisplayVerify);
        $("#idNumberTextBox").on('focus', ACC.tvlicence.clearInvalid);
        $("#idNumberTextBox").on('focusout', ACC.tvlicence.revertIdNumber);
        ACC.tvlicence.getTvLicenceInfo();
    },

    openUploadDialog: function (event) {
        event.preventDefault();
        $("#file").click();
    },

    extractAndSetFileName: function () {
        $("#uploadTextBox").val($('input[type=file]').val().split('\\').pop());
    },

    uploadFile: function () {
        ACC.tvlicence.extractAndSetFileName();
        var form = $("#fileUploadForm")[0];
        var data = new FormData(form);
        data.append("CSRFToken", ACC.config.CSRFToken);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: ACC.config.contextPath + "/tvlicence/upload",
            data: data,
            processData: false, //prevent jQuery from automatically transforming the data into a query string
            contentType: false,
            cache: false,
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#uploadButton");
            },
            success: function (data) {
                $("#uploadButton").html($("#uploadANewFileText").val()).addClass("idValidated");
                ACC.ordersummarycheckoutcomponent.canCheckoutWithOutTvLicense();
            },
            error: function (e) {
                $("#uploadButton").prop("disabled", false);
                $("#uploadTextBox").prop("value", $("#uploadIdErrorMessage").val());
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#uploadButton");
            }
        });
    },

    isIdNumberValid: function (idNumber) {
        if (idNumber == "" || idNumber == null) {
            $("#idNumberTextBox").prop("value", $("#idNumberInvalidMessage").val()).addClass("idnumberInvalid");
            return false;
        }
        return true;
    },

    verifyIdNumber: function () {
        var idNumber = $("#idNumberTextBox").val();
        if (ACC.tvlicence.isIdNumberValid(idNumber)) {
            $.ajax({
                url: ACC.config.contextPath + "/tvlicence/" + idNumber + "/tvlicenceinfo",
                cache: false,
                type: 'POST',
                beforeSend: function () {
                    ACC.common.showLoadingSpinner("#verifyIdNumberButton");
                },
                success: function (data) {
                    if (data.success == false) {
                        $("#errorMessage").prop("innerHTML", data.message).css("display", "block");
                        $(".validatedMessage").prop("innerHTML", "");
                    }
                    else {
                        $("#verifyIdNumberButton").html($("#validatedText").val()).addClass("idValidated");
                        $("#errorMessage").css("display", "none");
                        ACC.tvlicence.getTvLicenceInfo();
                        ACC.ordersummarycheckoutcomponent.canCheckoutWithOutTvLicense();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to update tv licence";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                    });

                },
                complete: function () {
                    ACC.common.hideLoadingSpinner("#verifyIdNumberButton");
                }
            });
        }
    },

    changeButtonTextToDisplayVerify: function () {
        $("#verifyIdNumberButton").html($("#verifyIdNumberText").val());
        if ( $("#verifyIdNumberButton").hasClass("idValidated") ) {
            $("#verifyIdNumberButton").removeClass("idValidated");
        };
    },
    clearInvalid: function () {
        if ( $("#idNumberTextBox").hasClass("idnumberInvalid") ) {
            $("#idNumberTextBox").prop("value", "").removeClass("idnumberInvalid");
        }
    },
    revertIdNumber: function () {
        var newIdNumber = $("#idNumberTextBox").val();
        var verifiedIdNumber = $("#verifiedIdNumber").val();
        if(!newIdNumber) {
            $("#idNumberTextBox").prop("value", $("#verifiedIdNumber").val());
        }
        if(verifiedIdNumber && !newIdNumber) {
            $("#verifyIdNumberButton").html($("#validatedText").val()).addClass("idValidated");
        }
    },

    getTvLicenceInfo: function () {
        $.ajax({
            url: ACC.config.contextPath + "/tvlicence/tvlicenceinfo",
            cache: false,
            type: 'GET',
            beforeSend: function () {
                //showLoadingSpinner
            },
            success: function (data) {
                if (data != "") {
                    var message = "";
                    if (data.valid) {
                        message = $("#idNumberSuccessMessage").val();
                        message += " " + "<br>" + "<span>" + data.firstName + " " + data.lastName + "</span>" + " - " + data.accountNumber;
                    }else{
                        message = $("#tvLicenceValidationExpiredMessage").val();
                        ACC.tvlicence.changeButtonTextToDisplayVerify();
                    }
                    $(".validatedMessage").prop("innerHTML", message);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to get current tv licence info";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {

            }
        });
    }
}
$(document).ready(function () {
    if($(".tvlic").length > 0){
        ACC.tvlicence.bindEvents();
    }
});
