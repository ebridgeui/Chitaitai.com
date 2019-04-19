/**
 * Created by MichaelJacobs on 12/8/2016.
 */
ACC.fulfilmentslotcomponent = {
    _autoload: [
        ["bindButtonRemoveReservation", $("#fulfilmentSlotPanel").length > 0],
        ["bindFulfilmentSlotPanelLoad", $("#fulfilmentSlotPanel").length > 0],
        ["loadFulfilmentSlotGrid", $("#fulfilmentSlotGrid").length > 0],
        ["loadFulfilmentSlotInfoBlock", $("#fulfilmentSlotInfoBlock").length > 0],
        ["bindSlotSelectionButtons", $("#fulfilmentSlotPanel").length > 0],
        ["bindPagingButtons", $("#fulfilmentSlotPanel").length > 0],
        ["initCheckoutFulfilmentCheckoutSideAction", $("#formCheckoutFulfilmentCheckoutSideAction").length > 0]
    ],

    // visibleDays are the amount of days & associated slots that is set in backend
    // visibleDays = $("*[data-visibleDays]").data('visibledays');
    visibleDays:0,

    // $dayCols are the day name cols/cells/items eg: 'Mon 12 Dec', Tues 13 Dec', 'Wed 14 Dec', ...
    // $dayCols = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');
    $dayCols:null,

    // $slotCols are the vertical cols containing our time slots. 1 col = 1 day
    // $slotCols = $('.fulfillmentslotcomponent .slots-panel-container .slider-container-col-slots .col-slots');
    $slotCols:null,

    // $dayColsTot = ACC.fulfilmentslotcomponent.$dayCols.length;
    $dayColsTot: 0,

    // A 'page' is a group/division/bunch of days & asscoiated slots, the amount of which = visibledays
    // pageTot = Math.ceil(ACC.fulfilmentslotcomponent.$dayColsTot / ACC.fulfilmentslotcomponent.visibleDays);
    pageTot:0,

    // pageCur = 1;
    pageCur: 1,

    bindFulfilmentSlots: function () {

        /******** Set up vars ******/
        ACC.fulfilmentslotcomponent.visibleDays = $("*[data-visibleDays]").data('visibledays');
        ACC.fulfilmentslotcomponent.$dayCols = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');
        ACC.fulfilmentslotcomponent.$slotCols = $('.fulfillmentslotcomponent .slots-panel-container .slider-container-col-slots .col-slots');
        ACC.fulfilmentslotcomponent.$dayColsTot = (function () {
            // return ACC.fulfilmentslotcomponent.$dayCols.length;
            var daycols = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');
            return daycols.length;
        }());
        ACC.fulfilmentslotcomponent.pageTot = (function () {
            // return Math.ceil(ACC.fulfilmentslotcomponent.$dayColsTot / ACC.fulfilmentslotcomponent.visibleDays);
            var daycols = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');
            var daycolstot = daycols.length;
            var visdays = $("*[data-visibleDays]").data('visibledays');
            return Math.ceil(daycolstot / visdays);
        }());

        /******** Set up post renders ******/
        ACC.fulfilmentslotcomponent.postRenderHeightCut();
        ACC.fulfilmentslotcomponent.postRenderContainerWidthCut();

        ACC.fulfilmentslotcomponent.isTabletMode() ? ACC.fulfilmentslotcomponent.postRenderAddBr() : null;

        ACC.fulfilmentslotcomponent.isMobileMode() ? (
                ACC.fulfilmentslotcomponent.postRenderShortenTimes(),
                    ACC.fulfilmentslotcomponent.postRenderShowMobSlotBtns(),
                    ACC.fulfilmentslotcomponent.postRenderHighlightSlot1(),
                    ACC.fulfilmentslotcomponent.postRenderMobShortDays()
            ) : null;

        ACC.fulfilmentslotcomponent.highlightReservedSlot();

        // hover div
        if ( ACC.fulfilmentslotcomponent.isDesktopMode() ) {
            $(document).on('mouseenter', '.col-slots .fulfillment', function (e) {
                ACC.fulfilmentslotcomponent.clearOverlays();

                if (!$(e.target).hasClass('not-avail')) {
                    ACC.fulfilmentslotcomponent.overlayToggle(e.target);
                    $(e.target).addClass('js-hover-slot');
                }
            });
            $(document).on('mouseenter', '.overlay-left', function() {
                $('.col-slots .fulfillment').find('.overlay-left').hide();
            });
            $(document).on('mouseenter', '.overlay-right', function() {
                $('.col-slots .fulfillment').find('.overlay-right').hide();
            });
        }
        $(document).on('click', '.js-voucher-mesg-btn-close', function(e) {
            ACC.fulfilmentslotcomponent.clearVoucherMesgHighlights(e);
        });
    },
    bindSlotSelectionButtons: function () {

        // Select/click div>span , as well as mobile only button
        $(document).on('click', '.col-slots .fulfillment, .col-slots .fulfillment span, .col-slots .fulfillment .mobile-choose-btn-avail', function(e) {

            $('.fulfillment').removeClass("clickedSlot");

            e.stopPropagation();
            e.preventDefault();

            if (!$(e.target).closest('.fulfillment').hasClass('not-avail')) {
                ACC.fulfilmentslotcomponent.addSlotOrShowChangeSlotConfirmation(e.target);
            };

            $(e.target).closest('.fulfillment').addClass("clickedSlot");

            var positionTop = $('.clickedSlot').position().top + $('.clickedSlot').outerHeight();
            var positionLeft = $('.clickedSlot').position().left - 70;
            var selectedWidth = $('.clickedSlot').outerWidth() + 70;

            if ( ACC.fulfilmentslotcomponent.isMobileMode() ) {
                $('#voucherHiddenSlot').css({
                        top: positionTop,
                        left: 'auto',
                        right: 7,
                        width: selectedWidth
                    }
                );
            } else {
                $('#voucherHiddenSlot').css({
                        top: positionTop,
                        left: positionLeft,
                        right: 'auto',
                        width: selectedWidth
                    }
                );
            };

            if ($('.fulfillment').hasClass('hasPopup')) {
                $('.fulfillment').removeClass('hasPopup');
                $('#voucherHiddenSlot').css('display', 'none');
            }
        });
    },
    bindPagingButtons: function () {

        $(document).on('click', 'a.right-nav-container', function(e) {
            if ( ACC.fulfilmentslotcomponent.isMobileMode() ) {
                ACC.fulfilmentslotcomponent.mobileNextClick(e);
            } else {
                ACC.fulfilmentslotcomponent.desktopNextClick(e);
            }
        });

        $(document).on('click', 'a.left-nav-container', function(e) {
            if ( ACC.fulfilmentslotcomponent.isMobileMode() ) {
                ACC.fulfilmentslotcomponent.mobilePrevClick(e);
            } else {
                ACC.fulfilmentslotcomponent.desktopPrevClick(e);
            }
        });

        $(document).on('click', 'span.day-slot', function(e) {
            if (ACC.fulfilmentslotcomponent.isMobileMode())
                ACC.fulfilmentslotcomponent.mobileDateClick(e, $(this).index());
        });

    },
    overlayToggle: function (target) {

        if ($(target).hasClass('fulfillment')) { // if div hovered
            $(target).find('.overlay-left').toggle();
            $(target).find('.overlay-right').toggle();
        } else {    // else if inner span hovered
            $(target).closest('.fulfillment').find('.overlay-left').toggle();
            $(target).closest('.fulfillment').find('.overlay-right').toggle();
        }

        //---------- Position and Show left overlay bar

        var overlayWidth = $('.overlay-left').width();
        var paddingLeft = $('.fulfillment').css('padding-left');
        paddingLeft = paddingLeft.replace('px', "");
        paddingLeft = parseInt(paddingLeft);

        $(target).find('.overlay-left').css({
            'right': overlayWidth+paddingLeft,
        });

        //---------- Position and Show right overlay bar

        var width = $(target).width();

        var paddingRight = $('.fulfillment').css('padding-right');
        paddingRight = paddingRight.replace('px', "");
        paddingRight = parseInt(paddingRight);

        cellWidth = width+paddingRight;

        $(target).find('.overlay-right').css({
            'left': cellWidth,
        });
    },
    bindButtonRemoveReservation: function() {
        $(document).on('click', '#slot_info_block_remove_button, .overbooked-close', function () {
            $("#voucherHiddenSlot").css('display', 'none');
            $('.fulfillment').removeClass("clickedSlot");
            $('.fulfillment').removeClass('hasPopup');
            ACC.fulfilmentslotcomponent.removeReservationFromCart();
            ACC.fulfilmentslotcomponent.clearAll();
        });
    },
    postRenderHeightCut: function () {
        var hourPixelHeight = 26.5;
        var newHeight = 0;
        var numHours = $("*[data-gridSpan]").data('gridspan');

        newHeight = numHours * hourPixelHeight;
        newHeight = newHeight+"px";

        $('.fulfillmentslotcomponent .slots-panel-container .content-container').css("height", newHeight);
    },
    postRenderContainerWidthCut: function () {
        if ( ACC.fulfilmentslotcomponent.isMobileMode() ) {
            if ( $("*[data-visibleDays]").data('visibledays') === 7 ) {
                $('.fulfillmentslotcomponent .slots-panel-container').css("width", "100%");
            }
            //TODO - widths cases for other visible day amounts (you already have 7)
        }
        if ( ACC.fulfilmentslotcomponent.isDesktopMode() ) {
            if ( $("*[data-visibleDays]").data('visibledays') === 7 ) {

                if ( $('.fulfillmentslotcomponent .slots-panel-container').parent().css("width") < '818px' ) {
                    $('.fulfillmentslotcomponent .slots-panel-container').css("width", "100%");
                }
            }
            //TODO - widths cases for other visible day amounts (you already have 7)
        }

        if ( ACC.fulfilmentslotcomponent.isTabletMode() ) {
            if ( $("*[data-visibleDays]").data('visibledays') === 7 ) {
                $('.fulfillmentslotcomponent .slots-panel-container').css("width", "99%");
            }
            //TODO - widths cases for other visible day amounts (you already have 7)
        }
    },
    postRenderAddBr: function () {
        var $data = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');

        $.each($data, function(index, val) {

            var str = val.innerHTML;
            val.innerHTML = str.replace(" ", "<br/>");
        });
    },
    postRenderShortenTimes: function() {
        var $data = $('.fulfillmentslotcomponent .slots-panel-container .time_slot_label_left div');

        $.each($data, function(index, val) {

            var str = val.innerHTML;
            meridiem = ( parseInt(str.slice(0,2) ) > 11 ) ? 'PM' : 'AM';


            val.innerHTML = str.replace(/:00/g, "") + meridiem;
        });
    },
    postRenderShowMobSlotBtns: function() {
        $('.fulfillmentslotcomponent .slots-panel-container .slider-container-col-slots .col-slots .fulfillment .mobile-choose-btn-avail').hide();
        $('.fulfillmentslotcomponent .slots-panel-container .slider-container-col-slots .col-slots .fulfillment .mobile-choose-btn-unavail').hide();
    },
    postRenderMobShortDays: function() {
        var $data = $('.fulfillmentslotcomponent .slots-panel-container .row-days .slider-container-daily-slot .day-slot');

        $.each($data, function(index, val) {
            var str = val.innerHTML;

            str = str.slice(4);
            str = str.replace(" ", "<br/>");
            val.innerHTML = str;
        });
    },
    postRenderHighlightSlot1: function() {
        ACC.fulfilmentslotcomponent.$dayCols.eq(0).addClass('selected-slot');
    },
    isMobileMode: function () {
        if ( (ACC.fulfilmentslotcomponent.getViewPortWidth() < 768) ) {
            return true;
        }
    },
    isTabletMode: function () {
        if ( (ACC.fulfilmentslotcomponent.getViewPortWidth() > 768) && (ACC.fulfilmentslotcomponent.getViewPortWidth() < 1024)) {
            return true;
        }
    },
    isDesktopMode: function () {
        if ( (ACC.fulfilmentslotcomponent.getViewPortWidth() > 1024)) {
            return true;
        }
    },
    getViewPortWidth: function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
    clearOverlays: function () {
        $('.col-slots .fulfillment').find('.overlay-left').hide();
        $('.col-slots .fulfillment').find('.overlay-right').hide();
        $('.col-slots .fulfillment').removeClass('js-hover-slot');
    },
    clearAll: function () {
        ACC.fulfilmentslotcomponent.clearOverlays();
        $('.col-slots .fulfillment').removeClass('js-selected-slot');
    },
    clearVoucherMesgHighlights: function(e) {
        e.preventDefault();
        $('.fulfillment').removeClass('js-voucher-mesg-slot');
        $('.fulfillmentslotcomponent .js-voucher-mesg-textbox').hide();
        $('.fulfillment .mobile-choose-btn-avail').removeClass("white-txt");
    },
    desktopNextClick: function(e) {

        e.preventDefault();
        //            console.log('NEXT clicked');

        if (ACC.fulfilmentslotcomponent.pageCur === ACC.fulfilmentslotcomponent.pageTot) {
            //                console.log('End reached');
            return;
        }

        ACC.fulfilmentslotcomponent.pageCur++;
        //            console.log('increment.....');
        ACC.fulfilmentslotcomponent.$slotCols.hide();
        ACC.fulfilmentslotcomponent.$dayCols.hide();
        var start = (ACC.fulfilmentslotcomponent.pageCur * ACC.fulfilmentslotcomponent.visibleDays) - ACC.fulfilmentslotcomponent.visibleDays;
        var end = (ACC.fulfilmentslotcomponent.pageCur * ACC.fulfilmentslotcomponent.visibleDays);

        $.each(ACC.fulfilmentslotcomponent.$dayCols, function(index, val) {
            //                console.log('index: '+index + ',prev: start='+start + ','+'end:'+end);

            if (index  === end ) {
                //                    console.log('ended');
                return false;
            }

            if (index >= start) {
                $(val).show();
                ACC.fulfilmentslotcomponent.$slotCols.eq(index).show();
            }
        });
        //            console.log('curpage: '+ACC.fulfilmentslotcomponent.pageCur);
    },
    mobileNextClick: function(e) {
        e.preventDefault();

        if (ACC.fulfilmentslotcomponent.pageCur === ACC.fulfilmentslotcomponent.$dayColsTot) {
            return;
        }

        ACC.fulfilmentslotcomponent.pageCur++;

        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur-2).hide();
        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur-2).removeClass('selected-slot');
        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).addClass('selected-slot');

        ACC.fulfilmentslotcomponent.$slotCols.hide();
        ACC.fulfilmentslotcomponent.$slotCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).show();

    },
    desktopPrevClick: function(e) {
        e.preventDefault();

        ACC.fulfilmentslotcomponent.pageCur--;
        ACC.fulfilmentslotcomponent.pageCur = (ACC.fulfilmentslotcomponent.pageCur < 1) ? 1 : ACC.fulfilmentslotcomponent.pageCur;

        if (ACC.fulfilmentslotcomponent.pageCur === 1) { // handle for 1st week
            ACC.fulfilmentslotcomponent.$slotCols.hide();
            ACC.fulfilmentslotcomponent.$dayCols.hide();
            ACC.fulfilmentslotcomponent.$slotCols.show();
            ACC.fulfilmentslotcomponent.$dayCols.show();
            return;
        }

        var start = ACC.fulfilmentslotcomponent.visibleDays *(ACC.fulfilmentslotcomponent.pageCur-1)-1;
        start = (start <=1)? 0 : start;

        var end= start+ACC.fulfilmentslotcomponent.visibleDays+1;

        ACC.fulfilmentslotcomponent.$slotCols.hide();
        ACC.fulfilmentslotcomponent.$dayCols.hide();

        $.each(ACC.fulfilmentslotcomponent.$dayCols, function(index, val) {
            if (index === end ) {
                //                    console.log('ended');
                return false;
            }
            if (index > start) {
                //                    console.log('in show, start:'+start +' , end:'+end+', index:'+index);
                $(val).show();
                ACC.fulfilmentslotcomponent.$slotCols.eq(index).show();
            }
        });

    },

    mobilePrevClick: function(e) {

        e.preventDefault();

        if (ACC.fulfilmentslotcomponent.pageCur === 1) {
            return;
        }

        ACC.fulfilmentslotcomponent.pageCur--;

        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).show();
        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).addClass('selected-slot');
        ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur).removeClass('selected-slot');

        ACC.fulfilmentslotcomponent.$slotCols.hide();
        ACC.fulfilmentslotcomponent.$slotCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).show();

    },

    mobileDateClick: function(e, dateIndex) {

        e.preventDefault();

        if (ACC.fulfilmentslotcomponent.pageCur === ++dateIndex)
            return;
        else
        {
            ACC.fulfilmentslotcomponent.pageCur = dateIndex;
            ACC.fulfilmentslotcomponent.$dayCols.slice(0, --dateIndex).removeClass('selected-slot').hide();
            ACC.fulfilmentslotcomponent.$dayCols.eq(ACC.fulfilmentslotcomponent.pageCur - 1).addClass('selected-slot');
            ACC.fulfilmentslotcomponent.$slotCols.hide();
            ACC.fulfilmentslotcomponent.$slotCols.eq(ACC.fulfilmentslotcomponent.pageCur-1).show();
        }

    },

    changeFulfilmentSlotConfirmation: function(target){
        var targetUrl = ACC.config.contextPath + '/cart/changeSlotConfirmation';
        var method = "POST";
        var slotCode = ACC.fulfilmentslotcomponent.getSlotCodeForElement(target);
        var componentUid = $('input[name="componentUid"]').val();
        $.ajax({
            url: targetUrl,
            type: method,
            data: {slotCode: slotCode, componentUid: componentUid},
            success: function (data) {
                ACC.common.hideLoadingSpinner("#formFulfillmentBookAction");
                var titleText =  $(data).find("#header")[0].innerHTML;
                title = '<div class="pnp-icon-tuktuk"/><h2 class="headline-change-text">' + titleText +'</div>';
                ACC.colorbox.open(title,{
                    html: data,
                    overlayClose: false,
                    width: 725,

                    scrolling: false,
                    escKey: false,
                    closeButton: false
                });
                ACC.fulfilmentslotcomponent.setDialogColor();

                $("button[name=changeSlotButton]").on("click", function (e) {
                    ACC.common.showLoadingSpinner(".rhs");
                    ACC.fulfilmentslotcomponent.addReservationToCart(target);
                });
                $("button[name=cancelSlotChangeButton]").on("click", function (e) {
                    ACC.colorbox.close();
                });
            },
            error: function (xht, textStatus, ex) {
                window.location.reload();
                return null
            }
        });
    },
    setDialogColor: function() {

    if ($('.fulfilmentPointType-del')[0]) {
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-delivery-detail #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-delivery-detail #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');

        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-multiStepCheckoutDeliveryPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');

        $('.page-loggedInPage #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-loggedInPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');

    } else if ($('.fulfilmentPointType-cnc')[0]) {
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-delivery-detail #cboxContent #cboxTitle').addClass('setDialogColor-cnc');
        $('.page-delivery-detail #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-cnc');

        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').addClass('setDialogColor-cnc');
        $('.page-multiStepCheckoutDeliveryPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-cnc');

        $('.page-loggedInPage #cboxContent #cboxTitle').addClass('setDialogColor-cnc');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-loggedInPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-cnc');

    }else if ($('.fulfilmentPointType-col')[0]) {
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-delivery-detail #cboxContent #cboxTitle').addClass('setDialogColor-col');
        $('.page-delivery-detail #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-col');

        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').addClass('setDialogColor-col');
        $('.page-multiStepCheckoutDeliveryPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-col');

        $('.page-loggedInPage #cboxContent #cboxTitle').addClass('setDialogColor-col');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-del');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-loggedInPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-col');

     }else {
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-delivery-detail #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-delivery-detail #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-delivery-detail #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');

        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-multiStepCheckoutDeliveryPage #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-multiStepCheckoutDeliveryPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');

        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-cnc');
        $('.page-loggedInPage #cboxContent #cboxTitle').removeClass('setDialogColor-col');
        $('.page-loggedInPage #cboxContent #cboxTitle').addClass('setDialogColor-del');
        $('.page-loggedInPage #slot-time-change-modal-msg .js-variable-color').addClass('setDialogTextColor-del');
      }

    },
    addReservationToCart: function (target) {
        var targetUrl = ACC.config.contextPath + '/cart/addSlotReservation';
        var method = "POST";

        var previousSlotCode = $('input[name="selectedSlotCode"]').val();
        $('input[name="previousSelectedSlotCode"]').val(previousSlotCode);

        var slotCode = ACC.fulfilmentslotcomponent.getSlotCodeForElement(target);
        if (!slotCode || slotCode == '') {
            var warning = "You have not selected a fulfilment slot";
            $.toaster({message: warning, priority: 'warning', logMessage: warning});
        } else {
            $.ajax({
                url: targetUrl,
                type: method,
                data: {slotCode: slotCode},
                success: function (data) {
                    var status = data.status;
                    if(status == 'error') {
                       ACC.fulfilmentslotcomponent.showSlotCapacityHasBeenExceededPopUp(target);
                    } else {
                        ACC.fulfilmentslotcomponent.clearAll()
                        var slotCode = ACC.fulfilmentslotcomponent.getSlotCodeForElement(target);
                        $('input[name="selectedSlotCode"]').val(slotCode);
                        ACC.fulfilmentslotcomponent.loadFulfilmentSlotInfoBlock();
                        ACC.fulfilmentslotcomponent.enableCheckout(true);
                        $('input[name="hasActiveSlot"]').val("true");
                        $('input[name="cartSlotCode"]').val(slotCode)
                        $('input[name="fsgIsFreeDelivery"]').val(data.isFreeDelivery);
                        ACC.fulfilmentslotcomponent.highlightReservedSlot();
                        ACC.fulfilmentslotcomponent.updateReservedSlotCost();
                        ACC.carttotal.updateCartTotalValues();
                    }
                },
                error: function (xht, textStatus, ex) {
                    ACC.common.hideLoadingSpinner("#formFulfillmentBookAction");
                    ACC.common.hideLoadingSpinner(".rhs");
                    var error = "Failed to reserve your selected slot";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                    });
                }
            });
        }
    },
    showSlotCapacityHasBeenExceededPopUp:function(target){
        target.innerHTML=$('#overbooked-full-box').html();
        var slotCode = ACC.fulfilmentslotcomponent.getSlotCodeForElement(target);
        $('#voucherHiddenSlot').css('display', 'block').addClass( slotCode );
        $('.fulfillment').removeClass('hasPopup');
        $('.fulfillment.clickedSlot').addClass('hasPopup');
    },
    showPopUp: function (target) {
        var targetUrl = ACC.config.contextPath + '/cart/isslotcapacityexceeded';
        var method = "GET";
        var slotCode = ACC.fulfilmentslotcomponent.getSlotCodeForElement(target);
        $.ajax({
            url: targetUrl,
            type: method,
            data: {slotCode: slotCode},
            success: function (data) {
                if(data == true){
                   ACC.fulfilmentslotcomponent.showSlotCapacityHasBeenExceededPopUp(target);
                }else{
                    ACC.fulfilmentslotcomponent.changeFulfilmentSlotConfirmation(target);
                }
            },
            error: function (xht, textStatus, ex) {
                return false;
            }
        });
    },
    addSlotOrShowChangeSlotConfirmation: function(target) {
        if($('input[name="hasActiveSlot"]') && $('input[name="hasActiveSlot"]').val() == "true"){
            if (ACC.fulfilmentslotcomponent.getSlotCodeForElement(target) != $('input[name="cartSlotCode"]').val()) {
                ACC.fulfilmentslotcomponent.showPopUp(target);
            }
        }else{
            ACC.fulfilmentslotcomponent.addReservationToCart(target);
        }

    },
    getSlotCodeForElement: function(target) {
        return (target.dataset.slotcode ? target.dataset.slotcode : $(target).closest('.fulfillment').data('slotcode'));

    },
    removeReservationFromCart: function() {
        var originalSlotCode;
        if($('input[name="inAmendOrder"]') && $('input[name="inAmendOrder"]').val() == "true"){
            originalSlotCode = $('input[name="amendSlotCode"]').val();
        }

        $.ajax({
            url: ACC.config.contextPath + "/cart/removeSlotReservation",
            type: "POST",
            beforeSend: function(){
                ACC.common.showLoadingSpinner("#fulfilmentSlotInfoBlock");
            },
            success: function() {
                ACC.fulfilmentslotcomponent.loadFulfilmentSlotInfoBlock();
                if($('input[name="inAmendOrder"]') && $('input[name="inAmendOrder"]').val() == "true"){
                    $('input[name="hasActiveSlot"]').val("true");
                    $('input[name="selectedSlotCode"]').val(originalSlotCode);
                    ACC.fulfilmentslotcomponent.clearAll();
                    ACC.fulfilmentslotcomponent.highlightReservedSlot();
                } else {
                    ACC.fulfilmentslotcomponent.enableCheckout(false);
                    $('input[name="hasActiveSlot"]').val("false");
                }
                ACC.carttotal.updateCartTotalValues();
                ACC.fulfilmentslotcomponent.restoreReservedSlotCost();
                ACC.fulfilmentslotcomponent.clearSelectedSlotCode();
            },
            error: function (xht, textStatus, ex) {
                var error = "Failed to remove reservation";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xht + ", " + textStatus + ", " + ex + "]"
                });
            }
        });
    },
    highlightReservedSlot: function () {

        var slotCode = $('input[name="selectedSlotCode"]').val();

        if (slotCode) {
            $theDiv =  $("div[data-slotcode='" + slotCode +"']");
            $theDiv.addClass('js-selected-slot');

            //---------- Position and Show left overlay bar
            $theDiv.find('.overlay-left').toggle();
            var overlayWidth = $('.overlay-left').width();
            var padding = $('.fulfillment').css('padding');
            padding = padding.replace('px', "");
            padding = parseInt(padding);

            $theDiv.find('.overlay-left').css({
                'right': overlayWidth+padding,
            });

            //---------- Position and Show right overlay bar
            $theDiv.find('.overlay-right').toggle();
            var width = $('.fulfillment').width();

            var padding2 = $('.fulfillment').css('padding');
            padding2 = padding2.replace('px', "");
            padding2 = parseInt(padding2);

            cellWidth = width+padding2;

            $theDiv.find('.overlay-right').css({
                'left': cellWidth,
            });
        };

    },

    updateReservedSlotCost: function() {

        var slotCode = $('input[name="selectedSlotCode"]').val();
        var previousSlotCode = $('input[name="previousSelectedSlotCode"]').val();
        var freeDelivery = $('input[name="fsgIsFreeDelivery"]').val();

        if (slotCode) {
            $theDiv =  $("div[data-slotcode='" + slotCode +"']");
            span = $theDiv.children("span");

	        var price = parseInt($theDiv.data('slotprice').replace(/\D/g, ""));

	        if (price <= 0) {
                span.text("FREE");
            } else {
                slotPrice = span.data("slotprice");
                span.text(slotPrice);
            }
        }

        if (previousSlotCode) {
            $theDiv =  $("div[data-slotcode='" + previousSlotCode +"']");
            span = $theDiv.children("span");

	        var price = parseInt($theDiv.data('slotprice').replace(/\D/g, ""));

	        if (price <= 0) {
		        span.text("FREE");
	        } else {
		        slotPrice = span.data("slotprice");
		        span.text(slotPrice);
	        }
        }
    },

    restoreReservedSlotCost: function() {

        var slotCode = $('input[name="selectedSlotCode"]').val();

        if (slotCode) {
            $theDiv =  $("div[data-slotcode='" + slotCode +"']");
            span = $theDiv.children("span")
            slotPrice = span.data('slotprice');
            span.text(slotPrice);
        }
    },

    clearSelectedSlotCode: function() {

        var slotCode = $('input[name="selectedSlotCode"]').val();
        if (slotCode) {
             $('input[name="selectedSlotCode"]').val("");
        }
    },

    bindFulfilmentSlotPanelLoad: function () {
        $(document).on("ready", function(e) {
            e.preventDefault();
            ACC.fulfilmentslotcomponent.loadFulfilmentSlotPanel();
        });
    },
    loadFulfilmentSlotPanel: function () {
        if ($('#fulfilmentSlotPanel').length) {
            var url = $("#fulfilmentSlotPanel").data("fulfilmentSlotPanelUrl");
            var componentUid = $('input[name="componentUid"]').val();
            $.ajax({
                url: url,
                data: {componentUid: componentUid},
                cache: false,
                type: 'GET',
                beforeSend: function() {
                    ACC.common.showLoadingSpinner("#fulfilmentSlotPanel");
                },
                success: function(response){
                    $("#fulfilmentSlotPanel").html(response);
                    ACC.fulfilmentslotcomponent.loadFulfilmentSlotGrid();
                    ACC.fulfilmentslotcomponent.bindCheckoutFulfilmentAction();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotPanel");
                    var error = "Failed to load fulfilment slot component";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                }
            });
        }
    },

    /* Convenience method intended to be called from methods
    * that might need the ReservedSlotCost updated if visible
    */
    updateReservedSlotFreeDelivery: function (isFreeDelivery) {

        if (isFreeDelivery !== undefined) {

            var freeDelivery = $('input[name="fsgIsFreeDelivery"]');

            if (freeDelivery.length) {

                freeDelivery.val(isFreeDelivery);

                ACC.fulfilmentslotcomponent.updateReservedSlotCost();
                ACC.fulfilmentslotcomponent.loadFulfilmentSlotInfoBlock();
            }
        }
    },

    loadFulfilmentSlotGrid: function () {
        if ($('#fulfilmentSlotGrid').length) {
            var url = $("#fulfilmentSlotGrid").data("fulfilmentSlotGridUrl");
            var componentUid = $('input[name="componentUid"]').val();

            $.ajax({
                url: url,
                cache: false,
                data: {componentUid: componentUid},
                type: 'GET',
                success: function(response){
                    if($(".js-subscription-delivery-frequency-number").length > 0) {
                        $(".js-book-a-slot-number").text("3");
                    }
                    $("#fulfilmentSlotGrid").html(response);
                    // We need to bind these methods here, because only at this point is the grid rendered
                    ACC.fulfilmentslotcomponent.bindFulfilmentSlots();
                    ACC.fulfilmentslotcomponent.updateReservedSlotCost();
                    ACC.fulfilmentslotcomponent.loadFulfilmentSlotInfoBlock();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotPanel");
                    var error = "Failed to load fulfilment slot grid";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                }
            });
        }
    },
    loadFulfilmentSlotInfoBlock: function () {
        if ($('#fulfilmentSlotInfoBlock').length) {
            var originalSlotCode;
            if($('input[name="inAmendOrder"]') && $('input[name="inAmendOrder"]').val() == "true"){
                originalSlotCode = $('input[name="amendSlotCode"]').val();
            }
            var url = $("#fulfilmentSlotInfoBlock").data("fulfilmentSlotInfoUrl");
            var componentUid = $('input[name="componentUid"]').val();
            $.ajax({
                url: url,
                cache: false,
                data: {componentUid: componentUid},
                type: 'GET',
                success: function(response){
                    if($('input[name="inAmendOrder"]') && $('input[name="inAmendOrder"]').val() == "true"){
                        var slotCode = $('input[name="selectedSlotCode"]').val();
                        var originalSlotCode = $('input[name="amendSlotCode"]').val();
                        if (!slotCode) {
                            $('input[name="selectedSlotCode"]').val(originalSlotCode);
                        }
                        $('input[name="hasActiveSlot"]').val("true");
                        ACC.fulfilmentslotcomponent.clearAll();
                        ACC.fulfilmentslotcomponent.highlightReservedSlot();
                    }
                    $("#fulfilmentSlotInfoBlock").html(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    ACC.common.hideLoadingSpinner("#formFulfillmentBookAction");
                    ACC.common.hideLoadingSpinner(".rhs");
                    ACC.colorbox.close();
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotInfoBlock");
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotPanel");
                    var error = "Failed to load fulfilment slot information block";
                    $.toaster({
                        message: error,
                        priority: 'danger',
                        logMessage: error + " Error details [" + xhr.responseText + ", " + ajaxOptions + ", " + thrownError + "]"
                    });
                },
                complete: function(){
                    ACC.common.hideLoadingSpinner("#formFulfillmentBookAction");
                    ACC.common.hideLoadingSpinner(".rhs");
                    ACC.colorbox.close();
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotInfoBlock");
                    ACC.common.hideLoadingSpinner("#fulfilmentSlotPanel");
                }
            });

        }
    },
    enableCheckout: function (status) {
        if ($('#formCheckoutFulfilmentCheckoutAction').length) {
            if (status) {
                $('#formCheckoutFulfilmentCheckoutAction').find(':submit').removeAttr('disabled');
            } else {
                $('#formCheckoutFulfilmentCheckoutAction').find(':submit').attr('disabled', 'disabled');
            }
        }
        if ($('#formCheckoutFulfilmentCheckoutSideAction').length) {
            if (status) {
                $('#formCheckoutFulfilmentCheckoutSideAction').find(':submit').removeAttr('disabled');
            } else {
                $('#formCheckoutFulfilmentCheckoutSideAction').find(':submit').attr('disabled', 'disabled');
            }
        }
    },
    initCheckoutFulfilmentCheckoutSideAction: function () {

        $.ajax({
            url: ACC.config.contextPath + "/cart/hasSlotReservation",
            type: "GET",
            success: function(data) {
                if (data.hasReservation === 'true') {
                    $('#formCheckoutFulfilmentCheckoutSideAction').find(':submit').removeAttr('disabled');
                } else {
                    $('#formCheckoutFulfilmentCheckoutSideAction').find(':submit').attr('disabled', 'disabled');
                }
            }
        });
    },
    bindCheckoutFulfilmentAction: function () {
        if ($('#formCheckoutFulfilmentCheckoutAction').length > 0) {
            $('#formCheckoutFulfilmentCheckoutAction').submit(function (ev) {
                ev.preventDefault(); // to stop the form from submitting
                if (ACC.vouchercomponent.hasForgottenVouchers()) {
                    ACC.vouchercomponent.displayForgottenVouchersPopup();
                } else {
                    this.submit(); // If all the validations succeeded
                }
            });
        }


        if($('#formCheckoutFulfilmentContinueAction').length > 0) {
            $('#formCheckoutFulfilmentContinueAction').submit(function (ev) {
                ev.preventDefault(); // to stop the form from submitting
                if (ACC.vouchercomponent.hasForgottenVouchers()) {
                    ACC.vouchercomponent.displayForgottenVouchersPopup();
                } else {
                    this.submit(); // If all the validations succeeded
                }
            });
        }
    }
};



$(window).on("resize", function () {
    var $tabHeight = $('.deliveryOptionTab.active').innerHeight();

    if ($(window).width() < 620) {
        $('.deliveryOptionTab').css('margin-bottom', ($tabHeight + 10))
    } else {
        $('.deliveryOptionTab').css('margin-bottom', 0)
    }
}).resize();
