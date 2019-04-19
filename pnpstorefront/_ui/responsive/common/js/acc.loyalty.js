/**
 * Created by MichaelJacobs on 7/25/2016.
 */
ACC.loyalty = {
    _autoload: [
        ["bindBeforeSwitchMsg", $("#frmSwitchPoints").length > 0],
        ["bindBeforeSwitchAllMsgDlg", $("#frmSwitchPoints").length > 0],
        ["switchPoints", $("#frmSwitchPoints").length > 0],
        ["switchAllPoints", $("#frmSwitchPoints").length > 0],
        ["bindAllPointsSwitchValues", $("#frmSwitchPoints").length > 0],
        ["loyaltyAccordion", $(".loyalty-component").length > 0]
    ],
    spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
    switchPoints: function() {
        $('#btnSwitchPoints').click(function() {
            var points = $("#txtSwitchAmount").asNumber({
                parseType: 'int'
            });
            if (!ACC.loyalty.isCorrectPointsValue(points)) {
                $("#switchPoints1").hide();
                $("#maximumPoints").hide();
                $("#minimumPoints").show();
            } else {
                var pointsBalance = $("#pointsBalance").asNumber({
                    parseType: 'int'
                });
                if (points > pointsBalance || points > 1000000) {
                    $("#switchPoints1").hide();
                    $("#maximumPoints").show();
                    $("#minimumPoints").hide();
                } else {
                    $("#frmSwitchPoints").hide();
                    $("#switchPoints1").hide();
                    $("#minimumPoints").hide();
                    $("#maximumPoints").hide();
                    $("#lblPointsToSwitch").text(points + " points");
                    $("#lblPointsToSwitchValue").text(points / 100);
                    $("#lblPointsToSwitchValue").formatCurrency({
                        region: 'en-ZA'
                    });
                    $("#lblNewPointsBalance").text(pointsBalance - points);
                    $('input[name="switchAmount"]').val(points);
                    $("#beforeSwitchMsg").show();
                }
            }
        });
    },
    switchAllPoints: function() {
        $('#btnSwitchAllPoints').click(function() {
            var allPointsToSwitch = $("#allPointsToSwitch").asNumber({
                parseType: 'int'
            });
            var allPointsToSwitchValue = $('#allPointsSwitchValue').asNumber({
                parseType: 'int'
            });
            if (allPointsToSwitch > 1000000) {
                $("#switchPoints1").hide();
                $("#maximumPoints").show();
                $("#minimumPoints").hide();
            } else if (allPointsToSwitch >= 500) {
            $("#frmSwitchAllPoints").hide();
            $("#lblAllPointsToSwitch").text(allPointsToSwitch + " points");
            $("#lblAllPointsToSwitchValue").text(allPointsToSwitchValue);
            $("#lblAllPointsToSwitchValue").formatCurrency({
                region: 'en-ZA'
            });
            var pointsBalance = $("#pointsBalance").asNumber({
                parseType: 'int'
            });
            $("#lblAllNewPointsBalance").text(pointsBalance - allPointsToSwitch);
            $('input[name="switchAmount"]').val(allPointsToSwitch);
            $("#beforeSwitchAllMsg").show();
             }
        });
    },
    bindAllPointsSwitchValues: function() {
        var pointsBalance = $("#pointsBalance").asNumber({
            parseType: 'int'
        });
        if (pointsBalance >= 500) {
            var remainder = pointsBalance % 100;
            var pointsToSwitch = pointsBalance - remainder;
            $('#allPointsToSwitch').text(pointsToSwitch);
            $('#allPointsSwitchValue').text(pointsToSwitch / 100);
            $("#allPointsSwitchValue").formatCurrency({
                region: 'en-ZA'
            });
        }
    },
    bindBeforeSwitchMsg: function() {
        // Click on OK button to switch
        $('#btnSwitchPointsOKAction').click(function() {
            ACC.loyalty.switchToCash();
        });

        // Click on CANCEL button to switch
        $('#btnSwitchPointsCancelAction').click(function() {
            $("#switchAmount").val("");
            $("#txtSwitchAmount").val("");
            $("#frmSwitchPoints").show();
            $("#switchPoints1").show();
            $("#beforeSwitchMsg").hide();
            $("#minimumPoints").hide();
            $("#maximumPoints").hide();
        });

        // Click on OK Success Button
        $('#btnSuccessOKAction').click(function() {
            $("#switchAmount").val("");
            $("#txtSwitchAmount").val("");
            $("#frmSwitchPoints").show();
            $("#switchPoints1").show();
            $("#beforeSwitchMsg").hide();
            $("#switchSuccessMsg").hide();
            $("#minimumPoints").hide();
            $("#maximumPoints").hide();

        });

        // Click on OK Success Button
        $('#btnFailureOKAction').click(function() {
            $("#switchAmount").val("");
            $("#txtSwitchAmount").val("");
            $("#frmSwitchPoints").show();
            $("#switchPoints1").show();
            $("#beforeSwitchMsg").hide();
            $("#switchFailureMsg").hide();
            $("#switchSuccessMsg").hide();
            $("#minimumPoints").hide();
            $("#maximumPoints").hide();
        });
    },

    bindBeforeSwitchAllMsgDlg: function() {

        $('#btnSwitchAllPointsOKAction').click(function() {
            ACC.loyalty.switchAllToCash();
        });

        $('#btnSwitchAllPointsCancelAction').click(function() {
            $("#frmSwitchAllPoints").show();
            $("#beforeSwitchAllMsg").hide();
        });

        // Click on OK Success Button
        $('#btnSuccessSwitchAllOKAction').click(function() {
            $("#switchAllSuccessMsg").hide();
            $("#frmSwitchAllPoints").show();
        });
    },
    isCorrectPointsValue: function(points) {
        if (points < 500 || (points % 100) > 0) {
            return false;
        } else {
            return true;
        }
    },
    loyaltyAccordion: function() {
        var autoExpand = $(".loyalty-component").data("autoExpand");
        if (autoExpand == null) {
            autoExpand = false;
        }
        $(".loyalty-component").accordion({
            collapsible: true,
            active: autoExpand,
            icons: false
        });
        $(".loyalty-component").on("accordionactivate", function(event, ui) {
            if ($(this).find('.ui-state-active').length) {
                ACC.loyalty.updateLoyaltyValues();
            }
        });
    },
    updateLoyaltyValues: function() {
        var targetUrl = ACC.loyalty.getLoyaltyValuesUpdateUrl();
        var method = "POST";
        $.ajax({
            url: targetUrl,
            type: method,
            beforeSend: function(){
                ACC.common.showLoadingSpinner("#switch-container");
            },
            success: function (data) {
                if (data != null) {
                    $('.loyComPointsBalance').text(data.pointsBalance);
                    $('.loyComPointsValue').text('R' + data.pointsValue);
                    $('.loyComSwitchedPoints').text(data.switchedValue);
                    $('.loyComVoucherCount').text(data.availableVoucherCount);
                    $('#headerPointsBalance').text(data.pointsBalance);
                    $('#headerSwitchedPoints').text(data.switchedValue);
                    $('#mobileHeaderPointsBalance').text(data.pointsBalance);
                    $('#mobileHeaderSwitchedPoints').text(data.switchedValue)
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update smartshopper values";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht.responseText + ", " + textStatus + ", " + ex + "]"
                });
            },
            complete:function () {
                ACC.common.hideLoadingSpinner("#switch-container");
            }
        });
    },

    switchToCash: function() {
        var points = $("#txtSwitchAmount").asNumber({
            parseType: 'int'
        });
        var targetUrl = ACC.loyalty.getSwitchToCashUrl();
        var method = "POST";
        $.ajax({
            url: targetUrl,
            data: {
                switchAmount: points
            },
            type: method,
            beforeSend: function(){
                ACC.common.showLoadingSpinner("#btnSwitchPointsOKAction");
              },
            success: function(data) {
                if (data != null && data != "") {

                    $("#pointsBalance").text(data.points);
                    $("#pointsValue").text(data.points / 100);
                    $("#allPointsToSwitch").text(data.points);
                    $("#allPointsSwitchValue").text(data.points / 100);
                    $("#switchedPoints").text(data.switchedPoints);
                    $("#switchSuccessMsg").show();

                } else {
                    $("#switchFailureMsg").show();
                }
            },
            error: function(xht, textStatus, ex) {
                    $("#switchFailureMsg").show();
            },
            complete:function () {
                 ACC.common.hideLoadingSpinner("#btnSwitchPointsOKAction");
                     $("#beforeSwitchMsg").hide();
            }
        });
    },

    switchAllToCash: function() {
        var allPointsToSwitch = $("#allPointsToSwitch").asNumber({
            parseType: 'int'
        });

        var targetUrl = ACC.loyalty.getSwitchToCashUrl();
        var method = "POST";
        $.ajax({
            url: targetUrl,
            data: {
                switchAmount: allPointsToSwitch
            },
            type: method,
            beforeSend: function(){
                  ACC.common.showLoadingSpinner("#btnSwitchAllPointsOKAction");
              },
            success: function(data) {
                if (data != null) {
                    $("#pointsBalance").text(data.points);
                    $("#pointsValue").text(data.points / 100);
                    $("#allPointsToSwitch").text(data.points);
                    $("#allPointsSwitchValue").text(data.points / 100);
                    $("#switchedPoints").text(data.switchedPoints);
                }
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to switch to cash";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            },
            complete:function () {
                ACC.common.hideLoadingSpinner("#btnSwitchAllPointsOKAction");
                            $("#frmSwitchAllPoints").hide();
                            $("#beforeSwitchAllMsg").hide();
                            $("#switchAllSuccessMsg").show();
            }
        });
    },

    getSwitchToCashUrl: function() {
        return ACC.config.contextPath + '/my-account/switch-to-cash/switch';
    },

    getLoyaltyValuesUpdateUrl: function() {
        return ACC.config.contextPath + '/loyalty/refreshvalues';
    }
};

$(document).ready(function() {
    $("#beforeSwitchMsg").hide();
    $("#switchSuccessMsg").hide();
    $("#beforeSwitchAllMsg").hide();
    $("#switchAllSuccessMsg").hide();
    $("#minimumPoints").hide();
    $("#maximumPoints").hide();
    $("#switchFailureMsg").hide();

    if ($('#headerLoyaltyPanel').length) {
        var url = $("#headerLoyaltyPanel").data("headerLoyaltyPanelUrl");
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            success: function(response) {
                $("#headerLoyaltyPanel").html(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to load loyalty component";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            }
        });
    }
});