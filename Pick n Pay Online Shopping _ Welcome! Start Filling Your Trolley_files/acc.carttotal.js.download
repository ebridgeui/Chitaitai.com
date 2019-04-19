ACC.carttotal = {
    updateCartTotalValues: function () {
        var targetUrl = ACC.carttotal.getCartTotalUpdateUrl();
        var method = "GET";
        $.ajax({
            url: targetUrl,
            cache: false,
            type: method,
            success: function (data) {
                if (data != null) {

                    $('[name="cartTotal"]').each(
                        function(i, div) {
                            $(div).find('[name="cartTotals-subtotal"]').html(data.subTotalOldPrice);
                            $(div).find('[name="cartTotals-delivery"]').html(data.totalDelivery).toggleClass("free-text-red", (data.isFreeDelivery == 'true'));
                            $(div).find('[name="cartTotals-saving"]').html(data.totalSaving).toggleClass("free-text-red", (data.totalSavingValue != 0));
                            $(div).find('[name="cartTotals-cashOffValue"]').html(data.cashOffValue).toggleClass("free-text-red", (data.cashOffValueValue != 0));
                            // there is no reference to this id on the page.  In minicartcomponent.jsp the id is commented out
                            //$("#miniCartTotals-vouchers").html(data.vouchers);
                            totalPrice = $(div).find('[name="cartTotals-totalPrice"]');
                            totalPrice.html(data.totalPrice);
                            totalPrice.attr('data-total-price-value', data.totalPriceValue);
                        }
                    );

                    // only do this call once
                    // update all totals in components that are affected by any of the cart totals changing
                    ACC.paymentDetails.updateSmartShopperPointsOrderTotal(data.totalPriceValue);
                    ACC.payment.updateAccountOrderTotal(data.totalPriceFormatPrice);
                    ACC.fulfilmentslotcomponent.updateReservedSlotFreeDelivery(data.isFreeDelivery);
                }

            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update cart total values";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });
    },
    getCartTotalUpdateUrl: function () {
        return ACC.config.contextPath + '/cartTotals/refreshvalues';
    }

};

