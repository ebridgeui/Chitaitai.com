/**
 * Created by MichaelJacobs on 7/27/2016.
 */
ACC.voucherlist = {
    _autoload: [
        ["bindVoucherOperations", $("#accountvoucherlistcomponent").length > 0]
    ],
    spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
    bindVoucherOperations: function(){
        ACC.voucherlist.voucherSelectionOperation();
        ACC.voucherlist.voucherDeselectionOperation();
        ACC.voucherlist.voucherAdditionOperation();
        ACC.voucherlist.voucherRemovalOperation();
    },
    voucherSelectionOperation: function () {
        $("button[id^='btnSelectVoucher']").click(function () {
            ACC.voucherlist.executeVoucherUpdate(ACC.config.contextPath + "/loyalty/selectvoucherforuseinstore", $(this).data("vouchernumber"), "select", "An error occurred while selecting your voucher", "#btnSelectVoucher");
        });
    },
    voucherDeselectionOperation: function () {
        $("button[id^='btnDeselectVoucher']").click(function () {
            ACC.voucherlist.executeVoucherUpdate(ACC.config.contextPath + "/loyalty/deselectvoucherforuseinstore", $(this).data("vouchernumber"), "deselect", "An error occurred while deselecting your voucher", "#btnDeselectVoucher");
        });
    },
    voucherAdditionOperation: function () {
        $("button[id^='btnAddVoucherToCart']").click(function () {
            ACC.voucherlist.executeVoucherUpdate(ACC.config.contextPath + "/loyalty/addvouchertocart", $(this).data("vouchernumber"), "add", "An error occurred while adding your voucher", "#btnAddVoucherToCart");
        });
    },
    voucherRemovalOperation: function () {
        $("button[id^='btnRemoveVoucherFromCart']").click(function () {
            ACC.voucherlist.executeVoucherUpdate(ACC.config.contextPath + "/loyalty/removevoucherfromcart", $(this).data("vouchernumber"), "remove", "An error occurred while removing your voucher", "#btnRemoveVoucherFromCart");

            var cmsPageUid = $(this).data("cmsPageUid");
            if (cmsPageUid == "cartPage") {
                window.location.reload();
            }
        });
    },
    executeVoucherUpdate: function (targetUrl, voucherNumber, operation, errorMessage, buttonName) {
        $.ajax({
            url: targetUrl,
            data: {voucherNumber: voucherNumber},
            type: "POST",
            beforeSend: function () {
                ACC.common.showLoadingSpinner(buttonName+"-"+voucherNumber);
            },
            success: function (data) {
                if (data != null && data.success === false) {
                    console.error("Failed to execute voucher update", data);
                    $.toaster({message: errorMessage, priority: 'danger'});
                } else {
                    ACC.voucherlist.updateVoucherView(voucherNumber, operation);
                }
            },
            error: function (xht, textStatus, ex) {
                console.error("Failed to execute voucher update", xht, textStatus, ex);
                $.toaster({message: errorMessage, priority: 'danger'});
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(buttonName+"-"+voucherNumber);
            }
        });
    },
    updateVoucherView: function (voucherNumber, operation) {
        var showAddButton = false;
        var showRemoveButton = false;
        var showSelectButton = false;
        var showDeselectButton = false;

        var addGreyedOutStyle = false;
        var addDefaultStyle = false;
        var removeGreyedOutStyle = false;
        var removeDefaultStyle = false;

        if (operation == "add") {
            showRemoveButton = true;
            removeDefaultStyle = true;
            addGreyedOutStyle = true;
        }
        else if (operation == "select") {
            showDeselectButton = true;
            removeDefaultStyle = true;
            addGreyedOutStyle = true;
        }
        else if (operation == "remove" || operation == "deselect") {
            showAddButton = true;
            showSelectButton = true;
            removeGreyedOutStyle = true;
            addDefaultStyle = true;
        }

        $("#btnAddColumn-" + voucherNumber).css(ACC.voucherlist.getRowCssStyle(showAddButton ? "block" : "none"));
        $("#btnRemoveColumn-" + voucherNumber).css(ACC.voucherlist.getRowCssStyle(showRemoveButton ? "block" : "none"));
        $("#btnSelectColumn-" + voucherNumber).css(ACC.voucherlist.getRowCssStyle(showSelectButton ? "block" : "none"));
        $("#btnDeselectColumn-" + voucherNumber).css(ACC.voucherlist.getRowCssStyle(showDeselectButton ? "block" : "none"));

        var voucherContainer = $("#ssVoucherContainer-" + voucherNumber);

        addGreyedOutStyle && voucherContainer.addClass("voucherAdded");
        removeGreyedOutStyle && voucherContainer.removeClass("voucherAdded");
        //Gary: Commented these out. They were breaking the grey-out
        //removeDefaultStyle && voucherContainer.removeClass("ssvoucher-container");
        //addDefaultStyle && voucherContainer.addClass("ssvoucher-container");
    },
    getRowCssStyle: function (display) {
        return {
            display: display
        };
    }
};