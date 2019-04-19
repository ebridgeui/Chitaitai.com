ACC.productDetail = {

    _autoload: [
        "initPageEvents",
        "bindVariantOptions"
    ],


    checkQtySelector: function (self, mode) {
        var input = $(self).parents(".js-qty-selector").find(".js-qty-selector-input");
        var inputVal = parseInt(input.val());
        var max = input.data("max");
        var minusBtn = $(self).parents(".js-qty-selector").find(".js-qty-selector-minus");
        var plusBtn = $(self).parents(".js-qty-selector").find(".js-qty-selector-plus");

        $(self).parents(".js-qty-selector").find(".btn").removeAttr("disabled");

        if (mode == "minus") {
            if (inputVal != 1) {
                ACC.productDetail.updateQtyValue(self, inputVal - 1)
                if (inputVal - 1 == 1) {
                    minusBtn.attr("disabled", "disabled")
                }

            } else {
                minusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "reset") {
            ACC.productDetail.updateQtyValue(self, 1)

        } else if (mode == "plus") {
            if (max == "FORCE_IN_STOCK") {
                ACC.productDetail.updateQtyValue(self, inputVal + 1)
            } else if (inputVal < max) {
                ACC.productDetail.updateQtyValue(self, inputVal + 1)
                if (inputVal + 1 == max) {
                    plusBtn.attr("disabled", "disabled")
                }
            } else {
                plusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "input") {
            if (inputVal == 1) {
                minusBtn.attr("disabled", "disabled")
            } else if (max == "FORCE_IN_STOCK" && inputVal > 0) {
                ACC.productDetail.updateQtyValue(self, inputVal)
            } else if (inputVal == max) {
                plusBtn.attr("disabled", "disabled")
            } else if (inputVal < 1) {
                ACC.productDetail.updateQtyValue(self, 1)
                minusBtn.attr("disabled", "disabled")
            } else if (inputVal > max) {
                ACC.productDetail.updateQtyValue(self, max)
                plusBtn.attr("disabled", "disabled")
            }
        } else if (mode == "focusout") {
            if (isNaN(inputVal)) {
                ACC.productDetail.updateQtyValue(self, 1);
                minusBtn.attr("disabled", "disabled")
            }
        }

    },

    updateQtyValue: function (self, quantity, unitCode) {
        var input = $(self).parents(".js-qty-selector").find(".js-qty-selector-input");
        var addToCartForm = $(self).parents(".addtocart-component").find("#addToCartForm");
        var addToCartQuantity = addToCartForm.find(".js-qty-selector-input");
        var addToCartUnit = addToCartForm.find(".js-unit-selector-input");
        input.val(quantity);
        addToCartUnit.val(unitCode);
        addToCartQuantity.val(quantity);
    },

    updateDisplayedPriceForFixedQuantity: function (self, formattedPrice, displayQuantity, formattedSavingsIcon) {
        var productCard = $(self).parents(".js-product-card-item");
        var productPriceDiv = productCard.find(".product-price");
        productPriceDiv.html(formattedPrice);

        if (formattedSavingsIcon) {
            //js-product-carousel-item targets the parent container in the product carousel
            var productContainer = $(self).parents(".js-product-carousel-item");
            //js-product-card-item targets the parent container on the PDP (even though it doesn't actually use the product card)
            productContainer = productContainer.length ? productContainer : $(self).parents(".js-product-card-item");
            var savingsIcon = productContainer.find(".js-savings-amount-off");
            savingsIcon.replaceWith(formattedSavingsIcon);
        }
        var selectedQuantityDiv = productPriceDiv.find(".selectedQuantityDiv");
        selectedQuantityDiv.html("(" + displayQuantity + ")");
    },

    initPageEvents: function () {
        $(document).on("click", '.js-qty-selector .js-qty-selector-minus', function () {
            ACC.productDetail.checkQtySelector(this, "minus");
        })

        $(document).on("click", '.js-qty-selector .js-qty-selector-plus', function () {
            ACC.productDetail.checkQtySelector(this, "plus");
        })

        $(document).on("keydown", '.js-qty-selector .js-qty-selector-input', function (e) {

            if (($(this).val() != " " && ((e.which >= 48 && e.which <= 57 ) || (e.which >= 96 && e.which <= 105 ))  ) || e.which == 8 || e.which == 46 || e.which == 37 || e.which == 39 || e.which == 9) {
            }
            else if (e.which == 38) {
                ACC.productDetail.checkQtySelector(this, "plus");
            }
            else if (e.which == 40) {
                ACC.productDetail.checkQtySelector(this, "minus");
            }
            else {
                e.preventDefault();
            }
        })

        $(document).on("keyup", '.js-qty-selector .js-qty-selector-input', function (e) {
            ACC.productDetail.checkQtySelector(this, "input");
            ACC.productDetail.updateQtyValue(this, $(this).val());

        })

        $(document).on("focusout", '.js-qty-selector .js-qty-selector-input', function (e) {
            ACC.productDetail.checkQtySelector(this, "focusout");
            ACC.productDetail.updateQtyValue(this, $(this).val());
        })

        $("#Size").change(function () {
            changeOnVariantOptionSelection($("#Size option:selected"));
        });

        $("#variant").change(function () {
            changeOnVariantOptionSelection($("#variant option:selected"));
        });

        $(".selectPriority").change(function () {
            window.location.href = $(this[this.selectedIndex]).val();
        });

        function changeOnVariantOptionSelection(optionSelected) {
            window.location.href = optionSelected.attr('value');
        }

        ACC.productDetail.bindQuantityDropDown();
    },

    bindVariantOptions: function () {
        ACC.productDetail.bindCurrentStyle();
        ACC.productDetail.bindCurrentSize();
        ACC.productDetail.bindCurrentType();
    },

    bindCurrentStyle: function () {
        var currentStyle = $("#currentStyleValue").data("styleValue");
        var styleSpan = $(".styleName");
        if (currentStyle != null) {
            styleSpan.text(": " + currentStyle);
        }
    },

    bindCurrentSize: function () {
        var currentSize = $("#currentSizeValue").data("sizeValue");
        var sizeSpan = $(".sizeName");
        if (currentSize != null) {
            sizeSpan.text(": " + currentSize);
        }
    },

    bindCurrentType: function () {
        var currentSize = $("#currentTypeValue").data("typeValue");
        var sizeSpan = $(".typeName");
        if (currentSize != null) {
            sizeSpan.text(": " + currentSize);
        }
    },

    bindQuantityDropDown: function () {
        $(".quantity-drop-down").change(function () {
            ACC.productDetail.updateFixedQuantityValue(this);
        });
        $(".quantity-drop-down").trigger('change');
    },

    updateFixedQuantityValue: function (dropDown) {
        if (dropDown.value) {
            var selectedOption = JSON.parse(dropDown.value);
            this.updateQtyValue(dropDown, selectedOption.quantity, selectedOption.unitCode);
            this.updateDisplayedPriceForFixedQuantity(dropDown, selectedOption.formattedPrice, selectedOption.displayQuantity, selectedOption.formattedSavingsIcon);
        }
    }
};