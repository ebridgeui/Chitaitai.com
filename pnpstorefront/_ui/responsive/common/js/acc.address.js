ACC.address = {

    _autoload: [
        "bindToChangeAddressButton",
        "bindCreateUpdateAddressForm",
        "bindSuggestedDeliveryAddresses",
        "bindCountrySpecificAddressForms",
        "showAddressFormButtonPanel",
        "bindViewAddressBook",
        "bindToColorboxClose",
        "showRemoveAddressFromBookConfirmation",
        "backToListAddresses",
        "bindDeliveryAddressLoad",
        "bindDeliveryOptions",
        "bindDeliveryAddressActions",
        "bindCollectionPointActions",
        "setUpLocationCoordinates",
        ["bindAccountAddressBook", $("#accountAddressBook").length > 0]
    ],

    spinner: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
    addressID: '',

    populateAddressSuggestions: function (e) {
        var url = ACC.config.contextPath + "/deliveryaddress/streetsuggestions";
        $("#addressSuggestions").autocomplete({
            source: function (request, response) {
                var coordinates = ACC.address.coords;
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: "json",
                    data: {
                        searchTerm: request.term.trim(),
                        latitude: (coordinates ? coordinates.latitude : null),
                        longitude: (coordinates ? coordinates.longitude : null)
                    },
                    beforeSend: function () {
                        ACC.common.showLoadingSpinner("#addressSuggestionsDivOuter");
                    },
                    success: function (data) {
                        if (request.term == $("#addressSuggestions").val()) {
                            ACC.common.hideLoadingSpinner("#addressSuggestionsDivOuter");
                            if (data != null && data.length != null && data.length > 0) {
                                response($.map(data, function (item) {
                                    return {
                                        label: item.displayName,
                                        value: item.displayName,
                                        data: item
                                    };
                                }));
                            } else {
                                var noResultsFound = $("#noResultsFoundMessage").val();
                                response([{label: noResultsFound, value: -1}]);
                            }
                        }
                    },
                    error: function (xht, textStatus, ex) {
                        ACC.common.hideLoadingSpinner("#addressSuggestionsDivOuter");
                        var error = "Failed to get address suggestions";
                        $.toaster({
                            message: error,
                            priority: 'danger',
                            logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                        });
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                if (ui.item.value == -1) {
                    ACC.address.selectedAddress = null;
                    $(this).val("");
                    return false;
                }
                var data = ui.item.data;
                if (data.storeCode == null) {
                    $("#addressNotWithinPnPDeliveryArea").show();
                    $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                    ACC.address.recordAddressSelectionFailure(data);
                }
                ACC.address.selectedAddress = ui.item;
            },
            change: function (event, ui) {
                if (ui.item == null) {
                    ACC.address.selectedAddress = null;
                }
            },
            delay: 500,
            maxShowItems: 5
        });
    },
    setUpLocationCoordinates: function () {
        var lock = $(".js-lock-manual-base-store-selection").val();
        if (lock != "true") {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    ACC.address.coords = position.coords;
                    var latitude = ACC.address.coords != null ? ACC.address.coords.latitude : null;
                    var longitude = ACC.address.coords != null ? ACC.address.coords.longitude : null;
                    var hasManuallySelectedBaseStore = $(".js-has-manually-selected-base-store").val();
                    if (hasManuallySelectedBaseStore != "true") { //if homepage only
                        ACC.basestorenavigation.getBaseStoreWithShortestDistance(latitude, longitude);
                    }
                });
            } else {
                console.log("Browser doesn't support geolocation!");
            }
        }
    },
    recordAddressSelectionFailure: function(data){
        $.ajax({
            url:ACC.config.contextPath + "/deliveryaddress/selection/failure",
            cache: false,
            type: 'POST',
            data: data,
            success: function (response) {
               console.log("Successfully record address selection failure");
            },
            error: function (xhr, ajaxOptions, thrownError) {
               console.log("Failed to record address selection failure");
            }
        });
    },
    handleChangeAddressButtonClick: function () {


        ACC.address.addressID = ($(this).data("address")) ? $(this).data("address") : '';
        $('#summaryDeliveryAddressFormContainer').show();
        $('#summaryOverlayViewAddressBook').show();
        $('#summaryDeliveryAddressBook').hide();


        $.getJSON(getDeliveryAddressesUrl, ACC.address.handleAddressDataLoad);
        return false;
    },

    handleAddressDataLoad: function (data) {
        ACC.address.setupDeliveryAddressPopupForm(data);

        // Show the delivery address popup
        ACC.colorbox.open("", {
            inline: true,
            href: "#summaryDeliveryAddressOverlay",
            overlayClose: false,
            onOpen: function () {
                // empty address form fields
                ACC.address.emptyAddressForm();
                $(document).on('change', '#saveAddress', function () {
                    var saveAddressChecked = $(this).prop('checked');
                    $('#defaultAddress').prop('disabled', !saveAddressChecked);
                    if (!saveAddressChecked) {
                        $('#defaultAddress').prop('checked', false);
                    }
                });
            }
        });

    },

    setupDeliveryAddressPopupForm: function (data) {
        // Fill the available delivery addresses
        $('#summaryDeliveryAddressBook').html($('#deliveryAddressesTemplate').tmpl({addresses: data}));
        // Handle selection of address
        $('#summaryDeliveryAddressBook button.use_address').click(ACC.address.handleSelectExistingAddressClick);
        // Handle edit address
        $('#summaryDeliveryAddressBook button.edit').click(ACC.address.handleEditAddressClick);
        // Handle set default address
        $('#summaryDeliveryAddressBook button.default').click(ACC.address.handleDefaultAddressClick);
    },

    emptyAddressForm: function () {
        var options = {
            url: getDeliveryAddressFormUrl,
            data: {addressId: ACC.address.addressID, createUpdateStatus: ''},
            type: 'GET',
            success: function (data) {
                $('#summaryDeliveryAddressFormContainer').html(data);
                ACC.address.bindCreateUpdateAddressForm();
            }
        };

        $.ajax(options);
    },

    handleSelectExistingAddressClick: function () {
        var addressId = $(this).attr('data-address');
        $.postJSON(setDeliveryAddressUrl, {addressId: addressId}, ACC.address.handleSelectExitingAddressSuccess);
        return false;
    },

    handleEditAddressClick: function () {

        $('#summaryDeliveryAddressFormContainer').show();
        $('#summaryOverlayViewAddressBook').show();
        $('#summaryDeliveryAddressBook').hide();

        var addressId = $(this).attr('data-address');
        var options = {
            url: getDeliveryAddressFormUrl,
            data: {addressId: addressId, createUpdateStatus: ''},
            target: '#summaryDeliveryAddressFormContainer',
            type: 'GET',
            success: function (data) {
                ACC.address.bindCreateUpdateAddressForm();
                ACC.colorbox.resize();
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update cart";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    },

    handleDefaultAddressClick: function () {
        var addressId = $(this).attr('data-address');
        var options = {
            url: setDefaultAddressUrl,
            data: {addressId: addressId},
            type: 'GET',
            success: function (data) {
                ACC.address.setupDeliveryAddressPopupForm(data);
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to update address book";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    },

    handleSelectExitingAddressSuccess: function (data) {
        if (data !== null) {
            ACC.refresh.refreshPage(data);
            ACC.colorbox.close();
        }
        else {
            var error = "Failed to set delivery address";
            $.toaster({message: error, priority: 'danger', logMessage: error});
        }
    },

    bindCreateUpdateAddressForm: function () {
        $('.create_update_address_form').each(function () {
            var options = {
                type: 'POST',
                beforeSubmit: function () {
                    $('#checkout_delivery_address').block({message: ACC.address.spinner});
                },
                success: function (data) {
                    $('#summaryDeliveryAddressFormContainer').html(data);
                    var status = $('.create_update_address_id').attr('status');
                    if (status !== null && "success" === status.toLowerCase()) {
                        ACC.refresh.getCheckoutCartDataAndRefreshPage();
                        ACC.colorbox.close();
                    }
                    else {
                        ACC.address.bindCreateUpdateAddressForm();
                        ACC.colorbox.resize();
                    }
                },
                error: function (xht, textStatus, ex) {
                    var error = "Failed to update cart";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                    });

                },
                complete: function () {
                    $('#checkout_delivery_address').unblock();
                }
            };

            $(this).ajaxForm(options);
        });
    },

    refreshDeliveryAddressSection: function (data) {
        $('.summaryDeliveryAddress').replaceWith($('#deliveryAddressSummaryTemplate').tmpl(data));

    },

    bindSuggestedDeliveryAddresses: function () {
        var status = $('.add_edit_delivery_address_id').attr('status');
        if (status !== null && "hasSuggestedAddresses" == status) {
            ACC.address.showSuggestedAddressesPopup();
        }
    },

    showSuggestedAddressesPopup: function () {

        ACC.colorbox.open("", {
            href: "#popup_suggested_delivery_addresses",
            inline: true,
            overlayClose: false,
            width: 525,
        });
    },

    bindCountrySpecificAddressForms: function () {
        $(document).on("change", '#countrySelector select', function () {
            var options = {
                'addressCode': '',
                'countryIsoCode': $(this).val()
            };
            ACC.address.displayCountrySpecificAddressForm(options, ACC.address.showAddressFormButtonPanel);
        });

    },

    showAddressFormButtonPanel: function () {
        if ($('#countrySelector :input').val() !== '') {
            $('#addressform_button_panel').show();
        }
    },

    bindToColorboxClose: function () {
        $(document).on("click", ".closeColorBox", function () {
            ACC.colorbox.close();
        });
    },


    displayCountrySpecificAddressForm: function (options, callback) {
        $.ajax({
            url: ACC.config.encodedContextPath + '/my-account/addressform',
            async: true,
            data: options,
            dataType: "html",
            beforeSend: function () {
                $("#i18nAddressForm").html(ACC.address.spinner);
            }
        }).done(function (data) {
            $("#i18nAddressForm").html($(data).html());
            if (typeof callback == 'function') {
                callback.call();
            }
        });
    },

    bindToChangeAddressButton: function () {
        $(document).on("click", '.summaryDeliveryAddress .editButton', ACC.address.handleChangeAddressButtonClick);
    },

    bindViewAddressBook: function () {

        $(document).on("click", ".js-address-book", function (e) {
            e.preventDefault();

            ACC.colorbox.open("Saved Addresses", {
                href: "#addressbook",
                inline: true,
                width: "380px"
            });

        });


        $(document).on("click", '#summaryOverlayViewAddressBook', function () {
            $('#summaryDeliveryAddressFormContainer').hide();
            $('#summaryOverlayViewAddressBook').hide();
            $('#summaryDeliveryAddressBook').show();
            ACC.colorbox.resize();
        });
    },

    showRemoveAddressFromBookConfirmation: function () {
        $(document).on("click", ".removeAddressFromBookButton", function () {
            var addressId = $(this).data("addressId");
            var popupTitle = $(this).data("popupTitle");

            ACC.colorbox.open(popupTitle, {
                inline: true,
                height: false,
                href: "#popup_confirm_address_removal_" + addressId,
                onComplete: function () {

                    $(this).colorbox.resize();
                }
            });

        });
    },

    backToListAddresses: function () {
        $(".addressBackBtn").on("click", function () {
            var sUrl = $(this).data("backToAddresses");
            window.location = sUrl;
        });
    },

    bindDeliveryAddressLoad: function () {
        $(document).on("ready", function (e) {
            e.preventDefault();
            if ($('#isLoggedIn').val() == "true") {
                $('#addressList').hide();
                //hiding the fulfilment slot along with the address list in landing page
                $("#fulfilmentSlotPanel").css("display", "none")
            }

            if ($('#addressList').length) {
                var url = $("#addressList").data("deliveryAddressUrl");
                ACC.address.getaddressList(url);
            }
            if ("HUB" == $("#selectedFulfilmentPointType").val()) {
                ACC.address.appendDeliveryAddressClassStyle();
            } else if ("CLICK_N_COLLECT" == $("#selectedFulfilmentPointType").val()) {
                ACC.address.appendClickAndCollectClassStyle();
            } else if ("COLLECTION_POINT" == $("#selectedFulfilmentPointType").val()) {
                ACC.address.appendCollectionPointClassStyle();
            }

        });
    },

    bindDeliveryOptions: function () {
        $(document).on("click", ".js-delivery-option", function (e) {
            e.preventDefault();
            $('#addressList').show();
            $('#skipFulfil').hide();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                var url = $(this).data("deliveryAddressUrl");
                ACC.address.getaddressList(url);
            }
        });

        $(document).on("click", ".deliveryOptionTab", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                $(".deliveryOptionTab").removeClass("active");
                $(this).addClass("active");
            }
        });

        $(document).on("click", "#deliveryOptionTab-del", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendDeliveryAddressClassStyle();
                if ("HUB" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                    $(".frequency-selection-component").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                    $(".frequency-selection-component").hide();
                }
            }
        });
        $(document).on("click", "#deliveryOptionTab-cnc", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendClickAndCollectClassStyle();
                if ("CLICK_N_COLLECT" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                    $(".frequency-selection-component").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                    $(".frequency-selection-component").hide();
                }
            }
        });
        $(document).on("click", "#deliveryOptionTab-col", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendCollectionPointClassStyle();
                if ("COLLECTION_POINT" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                    $(".frequency-selection-component").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                    $(".frequency-selection-component").hide();
                }
            }
        });

        $(document).on("click", "#deliveryOptionTab-del-input", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendDeliveryAddressClassStyle();
                if ("HUB" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                }
            }
        });
        $(document).on("click", "#deliveryOptionTab-cnc-input", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendClickAndCollectClassStyle();
                if ("CLICK_N_COLLECT" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                }
            }
        });
        $(document).on("click", "#deliveryOptionTab-col-input", function (e) {
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.appendCollectionPointClassStyle();
                if ("COLLECTION_POINT" == $("#selectedFulfilmentPointType").val()) {
                    $("#fulfilmentSlotDisplayWrapper").show();
                } else {
                    $("#fulfilmentSlotDisplayWrapper").hide();
                }
            }
        });

        /*$(document).on("click","#addNewAddress",function(e){
         $(this).css("display", "none");
         });*/

    },

    getaddressList: function (url) {
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#addressList");
            },
            success: function (response) {
                $("#addressList").html(response);
                if ($('input[name=deliveryAddressSelect]:checked').length > 0 || $('input[name=deliveryPosSelect]:checked').length > 0) {
                    $('#addressList').show();
                    $("#fulfilmentSlotPanel").css("display", "block");
                    $("#fulfilmentSlotDisplayWrapper").css("display", "block");
                    $(".frequency-selection-component").show();
                }else{
                    $("#fulfilmentSlotPanel").css("display", "none");
                    $("#fulfilmentSlotDisplayWrapper").css("display", "none");
                    $(".frequency-selection-component").hide();
                }
                ACC.address.keepFulfilmentSlotsComponentInViewIfNecessary();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to get current address list";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#addressList");
            }
        });
    },

    //This method will keep the fulfilment slot component in view after addresses load higher
    //up the page, if we originally intended to scroll to it -- i.e., if its ID is the
    //document fragment (hash)
    keepFulfilmentSlotsComponentInViewIfNecessary: function () {
        var fulfilmentSlotsComponentId = "#fulfilmentSlotsComponent";
        if (location.hash == fulfilmentSlotsComponentId && !this.alreadyScrolledToFulfilmentSlotsComponent) {
            location.hash = "";
            location.hash = fulfilmentSlotsComponentId;
            this.alreadyScrolledToFulfilmentSlotsComponent = true;
        }
    },

    bindDeliveryAddressActions: function () {

        $(document).on("click", "#js-slot-change-error-msg-btn-yes", function (e) {
            ACC.address.handleChangeFulfilmentPointEvent(this, e, "warningMessage");
        });
        $(document).on("click", "#js-slot-change-error-msg-btn-no", function () {
            $('#slot-change-error-msg').toggle();
            ACC.colorbox.close();
        });

        $(document).on("click", ".js-delivery-address-edit", function (e) {
            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleDeliveryAddressEditEvent(this, e);
            }
        });

        $(document).on("click", ".js-delivery-address-remove", function (e) {
            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleDeliveryAddressRemoveEvent(this, e);
            }
        });

        $(document).on("click", ".js-delivery-address-set-default", function (e) {
            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleDeliveryAddressSetDefaultEvent(this);
            }
        });

        $(document).on("click", ".js-delivery-address-select", function (e) {

            //disable for short delay to prevent overlay message rendering error
            var radioName = $(this).attr("id");
            $(":radio[id='" + radioName + "']").attr("disabled", true);
            setTimeout(function () {
                $(":radio[id='" + radioName + "']").attr("disabled", false);
            }, 1000);

            e.preventDefault();

            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleValidateAddressSelect(this);
            }
        });

        $(document).on("click", ".js-delivery-pos-set-default", function (e) {
            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleDeliveryPointOfServiceSetDefaultEvent(this);
            }
        });

        $(document).on("click", ".js-delivery-pos-select", function (e) {

            //disable for short delay to prevent overlay message rendering error
            var radioName = $(this).attr("id");
            $(":radio[id='" + radioName + "']").attr("disabled", true);
            setTimeout(function () {
                $(":radio[id='" + radioName + "']").attr("disabled", false);
            }, 1000);

            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.handleValidateAddressSelect(this);
            }
        });

        $(document).on("keydown", "#addressSuggestions", function (e) {
            /* remove validation messages */
            $("#addressNotWithinPnPDeliveryArea").hide();
            $("#addressInvalid").hide();
            $("#addressSuggestions").closest(".addressLine").removeClass("validationFailField");
            $("#buildingOrApartment").closest(".addressLine").removeClass("validationFailField");
        });

        $(document).on("keydown", "#buildingOrApartment", function (e) {
            $("#buildingOrApartment").closest(".addressLine").removeClass("validationFailField");
        });

        $(document).on("click", "#addNewAddress", function (e) {
        	$('#fulfilmentSlotDisplayWrapper').toggle();
            e.preventDefault();
            var isOrderModification = ACC.address.isOrderModification();
            if (!isOrderModification) {
                ACC.address.clearAllAddressFormFields();
                $('#addressFormAdd').show();
                $("#addressFormUpdate").hide();
                $('#addressFormDiv').slideToggle(200);
                ACC.address.populateAddressSuggestions();
            }
        });

        $(document).on("click", "#addressFormUpdate", function (e) {
            e.preventDefault();
            ACC.common.showLoadingSpinner("#addressFormUpdate");
            if (ACC.address.isMandatoryFieldsInvalid(true)) {
                ACC.common.hideLoadingSpinner("#addressFormUpdate");
                $(".errorMandatoryFieldsEmpty").show();
                $(this).closest('.addressFormContainer ').addClass("validationFail");
                var storeCode = ACC.address.selectedAddress && ACC.address.selectedAddress.data? ACC.address.selectedAddress.data.storeCode: (ACC.address.addressToEdit? ACC.address.addressToEdit.storeCode: null);
                if (!$("#addressSuggestions").val() || ACC.address.isHubInvalid(storeCode)) {
                    $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                }
                if(ACC.address.isAddressToEditInvalidWhenSelectedAddressIsUndefined()){
                    $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                    $("#addressInvalid").show();
                }
                if (!$("#buildingOrApartment").val().trim()) {
                    $("#buildingOrApartment").closest(".addressLine").addClass("validationFailField");
                }

                return;
            }
            var url = ACC.config.contextPath + '/deliveryaddress/update';
            var successUrl = ACC.config.contextPath + '/deliveryaddress?deliveryOption=HUB';
            var address = ACC.address.createOrUpdateAddressData(ACC.address.selectedAddress, ACC.address.addressToEdit);
            $.ajax({
                url: url,
                cache: false,
                type: 'POST',
                data: address,
                success: function (data) {
                    if (data.success == true) {
                        ACC.address.getaddressList(successUrl);
                        ACC.address.addressToEdit = null;
                    } else {
                        $(document).find('.formMandatory').hide();
                        if (data.errorCode == 100) {
                            $("#addressNotWithinPnPDeliveryArea").show();
                            $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                        } else {
                            $(document).find('#errorMsg').html(data.message);
                            $(document).find('#errorMsg').show();
                            $(document).find('#addressFormDiv').addClass('errorClass');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to update address";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                    });

                },
                complete: function () {
                    ACC.common.hideLoadingSpinner("#addressFormUpdate");
                }
            });
        });

        $(document).on("click", "#addressFormAdd", function (e) {
            e.preventDefault();
            ACC.common.showLoadingSpinner("#addressFormAdd");
            if (ACC.address.isMandatoryFieldsInvalid(false)) {
                ACC.common.hideLoadingSpinner("#addressFormAdd");
                $(".errorMandatoryFieldsEmpty").show();
                $(this).closest('.addressFormContainer ').addClass("validationFail");

                if (!$("#addressSuggestions").val() || ACC.address.isHubInvalid(ACC.address.selectedAddress && ACC.address.selectedAddress.data? ACC.address.selectedAddress.data.storeCode: null)) {
                    $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                }
                if (!$("#buildingOrApartment").val().trim()) {
                    $("#buildingOrApartment").closest(".addressLine").addClass("validationFailField");
                }

                return;
            }
            var url = ACC.config.contextPath + '/deliveryaddress/add';
            var successUrl = ACC.config.contextPath + '/deliveryaddress?deliveryOption=HUB';
            var address = ACC.address.createOrUpdateAddressData(ACC.address.selectedAddress);
            $.ajax({
                url: url,
                cache: false,
                type: 'POST',
                data: address,
                success: function (data) {
                    if (data.success == true) {
                        ACC.address.getaddressList(successUrl);
                        ACC.fulfilmentslotcomponent.loadFulfilmentSlotPanel();
                    } else {
                        $(document).find('.formMandatory').hide();
                        if (data.errorCode == 100) {
                            $("#addressNotWithinPnPDeliveryArea").show();
                            $("#addressSuggestions").closest(".addressLine").addClass("validationFailField");
                        } else {
                            $(document).find('#errorMsg').html(data.message);
                            $(document).find('#errorMsg').show();
                            $(document).find('#addressFormDiv').addClass('errorClass');
                        }
                    }
                    ACC.address.selectedAddress = null;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var error = "Failed to add address";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                },
                complete: function () {
                    ACC.common.hideLoadingSpinner("#addressFormAdd");
                }
            });

        });
    },

    createOrUpdateAddressData: function (selectedAddress, addressToUpdate) {
        var address = addressToUpdate? addressToUpdate: {};

        var addressName = $("#addressNickName").val();
        var buildingOrApartment = $("#buildingOrApartment").val();
        var buildingOrApartmentContainsSpaces = buildingOrApartment.match(/^(\S+)\s(.*)/);
        var building = buildingOrApartmentContainsSpaces != null ? buildingOrApartment.match(/^(\S+)\s(.*)/).slice(1)[1] : buildingOrApartment;
        var apartmentNumber = buildingOrApartmentContainsSpaces != null ? buildingOrApartment.match(/^(\S+)\s(.*)/).slice(1)[0] : null;
        var isDefault = $("#makeDefaultAddress").is(":checked");

        address.addressName = addressName;
        address.building = building;
        address.apartment = apartmentNumber;
        address.defaultAddress = isDefault;

        var addressData = selectedAddress ? selectedAddress.data : null;
        if (addressData != null) {
            address.townName = addressData.municipality;
            address.townId = addressData.municipalityId;
            address.townSubdivisionName = addressData.town;
            address.townSubdivisionId = addressData.townId;
            address.districtId = addressData.suburbId;
            address.districtName = addressData.suburb;
            address.streetId = addressData.id;
            address.streetName = addressData.name;
            address.streetNumber = addressData.streetNumber;
            address.hubId = addressData.hubId;
            address.storeCode = addressData.storeCode;
        }
        return address;
    },
    bindCollectionPointActions: function () {
        // bind click events
        $(document).on("change", "#regionsSelect", function (e) {
            e.preventDefault();
            ACC.address.handleRegionChangeEvent(this, e);
        });
    },

    handleRegionChangeEvent: function (elementRef, e) {

        var selected = $(elementRef).find('option:selected');
        var url = selected.data("deliveryAddressPosUrl");
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#addressList");
            },
            success: function (response) {
                $("#addressList").html(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to handle region change";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#addressList");
            }
        });
    },

    clearAllAddressFormFields: function () {

        $("#addressSuggestions").val("");
        $("#buildingOrApartment").val("");
        $("#addressNickName").val("");
        $("#addressFormDefaultAddress").prop('checked', false);
        $(document).find('.errorClass').hide();
        $(document).find('#addressFormDiv').removeClass('errorClass');
        $(document).find('.formMandatory').show();
    },

    handleDeliveryAddressRemoveEvent: function (elementRef, e) {

        var url = $(elementRef).data("deliveryAddressRemoveUrl");
        var addressId = $(elementRef).data("deliveryAddressId");

        $.ajax({
            url: url,
            cache: false,
            type: 'DELETE',
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#deliveryAddressRemove_" + addressId);
            },
            success: function (data) {
                if (data.success == true) {
                    $(e.target).closest('.js-delivery-address').hide();
                } else {
                    var error = jsonData.errorMsg;
                    document.getElementById("defaultAddressErrorMessage").innerHTML=error;
                    $('.defaultAddressErrorMessage').show();
                }
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#deliveryAddressRemove_" + addressId);
            }
        });
    },

    handleDeliveryAddressEditEvent: function (elementRef, e) {

        var url = $(elementRef).data("deliveryAddressEditUrl");
        var addressId = $(elementRef).data("deliveryAddressId");

        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#deliveryAddressEdit_" + addressId);
            },
            success: function (response) {
                if(response != null){
                    ACC.address.addressToEdit = response;
                    ACC.address.populateFieldsForAddressEdit(response);
                    $('#addressFormAdd').hide();
                    $("#addressFormUpdate").show();
                    $('#addressFormDiv').show();
                    ACC.address.populateAddressSuggestions(e);
                    $('html,body').scrollTop($('#addressFormDiv').offset().top);
                }else{
                   console.log("Address cannot be null.");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to render delivery address edit component";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#deliveryAddressEdit_" + addressId);
            }
        });
    },

    populateFieldsForAddressEdit: function (address) {
        $("#addressSuggestions").val(address.displayName);
        $("#buildingOrApartment").val(address.apartment + " " + address.building);
        $("#addressNickName").val(address.addressName);
        $("#makeDefaultAddress").prop('checked', address.defaultAddress);
    },

    handleDeliveryAddressSetDefaultEvent: function (elementRef, e) {

        var url = $(elementRef).data("deliveryAddressSetDefaultUrl");
        var defaultFalse = ACC.textDeliveryAddressDefaultFalse;
        var defaultTrue = ACC.textDeliveryAddressDefaultTrue;
        var addressId = $(elementRef).data("deliveryAddressId");

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#deliveryAddressSetDefault_" + addressId);
            },
            success: function (response) {
                $('[name=deliveryAddressSetDefault]').removeClass('btn-default-true').addClass('btn-default-false');
                $('[name=deliveryAddressSetDefault]').text(defaultFalse)
                $(elementRef).removeClass('btn-default-false').addClass('btn-default-true');
                $(elementRef).text(defaultTrue);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to set default delivery address";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ("#deliveryAddressSetDefault_" + addressId);
            }
        });
    },

    handleDeliveryPointOfServiceSetDefaultEvent: function (elementRef, e) {

        var url = $(elementRef).data("deliveryPosSetDefaultUrl");
        var pointOfServiceName = $(elementRef).data("deliveryPosName");
        var pointOfServiceType = $(elementRef).data("deliveryPosType");

        var defaultFalse = ACC.textDeliveryAddressDefaultFalse;
        var defaultTrue = ACC.textDeliveryAddressDefaultTrue;

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: {name: pointOfServiceName, type: pointOfServiceType},
            beforeSend: function () {
                ACC.common.showLoadingSpinner(elementRef);
            },
            success: function (response) {
                $('[name=deliveryAddressSetDefault]').removeClass('btn-default-true').addClass('btn-default-false');
                $('[name=deliveryAddressSetDefault]').text(defaultFalse)
                $(elementRef).removeClass('btn-default-false').addClass('btn-default-true');
                $(elementRef).text(defaultTrue);
                if (response.setAsSelectedFulfilmentPoint === 'true') {
                    $("[id='selectedAddress_" + pointOfServiceName + "']").prop('checked', true);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to set default point of service";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner(elementRef);
            }
        });
    },

    handleValidateAddressSelect: function (elementRef, e) {

        var url = $(elementRef).data("validateAddressSelectUrl");
        var id = $(elementRef).data("validateAddressSelectId");
        var type = $(elementRef).data("validateAddressSelectType");
        var changeFulfilmentPointUrl = $(elementRef).data("changeFulfilmentPointUrl");

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: {id: id, type: type},
            beforeSend: function () {
                ACC.common.showLoadingSpinner("#address_" + id);
            },
            success: function (response) {
                // If there are no warning messages the response is empty
                if (response.length <= 0) {
                    $(elementRef).prop("checked", true);
                    ACC.address.handleChangeFulfilmentPoint(changeFulfilmentPointUrl, id, type);
                } else {
                    ACC.address.displayAddressChangeWarningPopup(response);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to validate address";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                ACC.common.hideLoadingSpinner("#address_" + id);
            }
        });
    },

    displayAddressChangeWarningPopup: function (response) {

        $("#slot-change-error-msg").html(response);
        title = '<div class="location-icon"/>' + ACC.addressChangeAddressTitleMessage;
        $('#slot-change-error-msg').toggle();

        ACC.colorbox.open(title, {
            href: "#slot-change-error-msg",
            inline: true,
            overlayClose: false,
            width: 525,

            scrolling: false,
            escKey: false,
            closeButton: false
        });

    },

    handleChangeFulfilmentPointEvent: function (elementRef, e, triggeredBy) {

        var url = $(elementRef).data("changeFulfilmentPointUrl");
        var id = $(elementRef).data("addressId");
        var type = $(elementRef).data("addressType");

        ACC.address.handleChangeFulfilmentPoint(url, id, type, triggeredBy)
    },

    handleChangeFulfilmentPoint: function (url, id, type, triggeredBy) {

        $.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: {id: id, type: type},
            beforeSend: function () {
                if (triggeredBy == "warningMessage") {
                    //spinner should be added to the button and not the address div
                    ACC.common.showLoadingSpinner("#js-slot-change-error-msg-btn-yes");
                } else {
                    ACC.common.showLoadingSpinner("#address_" + id);
                }
            },
            success: function (response) {
                if (response.redirect == 'true') {
                    window.location = ACC.config.encodedContextPath + response.redirectUrl;
                }
                if (response.isFulfilmentSlotRemoved == 'true' || response.isPointOfServiceChanged == 'true' || response.hasPointOfService == 'true') {
                    ACC.fulfilmentslotcomponent.loadFulfilmentSlotPanel();
                    $("#selectedFulfilmentPointType").val(response.selectedFulfilmentPointType);
                    $("#fulfilmentSlotDisplayWrapper").show();
                    // Display fulfilment slot without refreshing the page
                    $("#fulfilmentSlotPanel").css("display", "block");
                    $(".frequency-selection-component").show();

                }
                if (response.setAsDefaultFulfilmentPoint === 'true') {
                    $('[name=deliveryAddressSetDefault]').removeClass('btn-default-true').addClass('btn-default-false');
                    $('[name=deliveryAddressSetDefault]').text(ACC.textDeliveryAddressDefaultFalse);
                    $("[id='deliveryAddressSetDefault_" + id + "']").removeClass('btn-default-false').addClass('btn-default-true');
                    $("[id='deliveryAddressSetDefault_" + id + "']").text(ACC.textDeliveryAddressDefaultTrue);
                }
                $('.headerBasestoreMessageContainer a').text(response.baseStoreDisplayName);
                //check the new selected address radio button.
                $("#selectedAddress_" + id).prop('checked', true);
                $('input[name="hasActiveSlot"]') && $('input[name="hasActiveSlot"]').val("false");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update fulfilment point";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            },
            complete: function () {
                if (triggeredBy == "warningMessage") {
                    //spinner should be removed from the button and not the address div
                    ACC.common.hideLoadingSpinner("#js-slot-change-error-msg-btn-yes");
                    //close spinner when call back to update fulfilment point returns
                    $('#slot-change-error-msg').toggle();
                    ACC.colorbox.close();
                } else {
                    ACC.common.hideLoadingSpinner("#address_" + id);
                }
            }
        });
    },
    isMandatoryFieldsInvalid: function (isEdit) {
        if(isEdit) {
            var selectedAddress = ACC.address.selectedAddress && ACC.address.selectedAddress.data? ACC.address.selectedAddress.data: null;
            if(ACC.address.isAddressToEditInvalidWhenSelectedAddressIsUndefined()){ //meaning there hasnt been a address selection
                return true;
            }
            var selectedAddressSuggestion = selectedAddress == null ? (ACC.address.addressToEdit? ACC.address.addressToEdit.displayName: null) : selectedAddress.displayName;
            var hasStreetNumber = selectedAddressSuggestion != null ? selectedAddressSuggestion.match(/\d+/g) : null;
            var apartmentOrBuilding = $("#buildingOrApartment").val().trim();
            var isHubInvalid = ACC.address.isHubInvalid(selectedAddress == null ? (ACC.address.addressToEdit? ACC.address.addressToEdit.storeCode: null) : selectedAddress.storeCode);
            if (selectedAddressSuggestion == null || (hasStreetNumber == null && !apartmentOrBuilding) || isHubInvalid) {
                return true;
            }
        }else {
            var selectedAddressSuggestion = ACC.address.selectedAddress? ACC.address.selectedAddress.value: null;
            var hasStreetNumber = selectedAddressSuggestion != null? selectedAddressSuggestion.match(/\d+/g) : null;
            var apartmentOrBuilding = $("#buildingOrApartment").val().trim();
            var isHubInvalid = ACC.address.isHubInvalid(ACC.address.selectedAddress && ACC.address.selectedAddress.data? ACC.address.selectedAddress.data.storeCode: null);
            if (selectedAddressSuggestion == null || (hasStreetNumber == null && !apartmentOrBuilding) || isHubInvalid) {
                return true;
            }
        }
        return false;
    },
    isAddressToEditInvalidWhenSelectedAddressIsUndefined: function () {
        /*NB: This method is confusing but very important because when the user opts to edit an address and has not
              selected a listed option from the autocomplete drop down but has just edited the address using free text,
              we should know because this is a bug and user should be alerted that he or she should select something from
              the drop down. This is specific to editing an address. HYB-5312*/
        if(ACC.address.selectedAddress == undefined){ //meaning there hasnt been a address selection
            return (ACC.address.addressToEdit.displayName != $("#addressSuggestions").val());
        }
        return false;
    },
    isHubInvalid: function(storeCode){
        return storeCode == null? true : false;
    },
    appendDeliveryAddressClassStyle: function () {
        $(".account-section-content").removeClass("fulfilmentPointType-cnc");
        $(".account-section-content").removeClass("fulfilmentPointType-col");
        $(".account-section-content").addClass("fulfilmentPointType-del");
    },
    appendClickAndCollectClassStyle: function () {
        $(".account-section-content").removeClass("fulfilmentPointType-del");
        $(".account-section-content").removeClass("fulfilmentPointType-col");
        $(".account-section-content").addClass("fulfilmentPointType-cnc");
    },
    appendCollectionPointClassStyle: function () {
        $(".account-section-content").removeClass("fulfilmentPointType-del");
        $(".account-section-content").removeClass("fulfilmentPointType-cnc");
        $(".account-section-content").addClass("fulfilmentPointType-col");
    },
    bindAccountAddressBook: function () {
        $(document).on("ready", function (e) {
            if ($('#addressList').length) {
                var url = $("#addressList").data("deliveryAddressUrl");
                ACC.address.getaddressList(url);
            }
        });
    },
    isOrderModification: function () {
        var isOrderModification = false;
        if ($("#isOrderModification").length) {
            isOrderModification = $.parseJSON($("#isOrderModification").val());
        }
        return isOrderModification;
    }
};