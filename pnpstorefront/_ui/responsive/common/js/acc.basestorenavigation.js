ACC.basestorenavigation = {

    bindEvents: function () {
        $(".js-region-base-store-display-area").click(ACC.basestorenavigation.openRegionSelect);
        $(".js-region-key").click(ACC.basestorenavigation.selectRegion);
        $(".js-base-store").click(ACC.basestorenavigation.selectBaseStore);
    },

    openRegionSelect: function () {
        $(".js-region-base-store-select").toggle();
    },

    selectRegion: function () {
        var regionSelected = $(this).data("value");
        var region = $(this);
        ACC.basestorenavigation.toggleArrows(region);
        // open base store list for selected region key
        $(".js-base-store").each(function (e) {
            var regionKey = $(this).data("regionKey");
            if (regionKey !== undefined && regionKey == regionSelected) {
                $(this).toggle();
            } else {
                var type = $(this).data("type");
                if (type == undefined || type !== "special-region-base-store-item") {
                    $(this).hide();
                }
            }
        });
    },

    toggleArrows: function(region){
        $(".js-region-key").each(function (e) {
            if($(this).context != region.context){
                $(this).find( ".js-region-key-down-arrow" ).removeClass("js-region-key-up-arrow");
                $(this).removeClass("js-region-key-hover");
            }
        });
        region.find( ".js-region-key-down-arrow" ).toggleClass("js-region-key-up-arrow");
        region.toggleClass("js-region-key-hover");
    },

    selectBaseStore: function () {
        var baseStoreSelected = $(this).data("value");
        $.ajax({
            url: ACC.config.contextPath + "/basestore/" + baseStoreSelected,
            cache: false,
            type: 'POST',
            success: function () {
                window.location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to update base store";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });

            }
        });
    },

    unbindClickOnRegionSelect: function () {
        var lock = $(".js-lock-manual-base-store-selection").val();
        if (lock == "true") {
            $(".js-region-base-store-display-area").unbind("click");
            $(".main-header .md-secondary-navigation > ul > li:first-child").addClass('hidearrow');
        } else {
            $(".js-region-base-store-display-area").bind("click");
            $(".js-region-base-store-display-area a").removeAttr("href");
        }
    },

    getBaseStoreWithShortestDistance: function (latitude, longitude) {
        $.ajax({
            url: ACC.config.contextPath + "/basestore/shortest/distance",
            cache: false,
            type: 'GET',
            data: {
                latitude: latitude,
                longitude: longitude
            },
            success: function (baseStore) {
                if (baseStore != "" && baseStore != null) {
                    var selectedBaseStore = baseStore.uid;
                    var previousBaseStore = $(".js-base-store-uid").val();
                    if (selectedBaseStore != previousBaseStore) {
                        window.location.reload();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Failed to select the base store with the shortest distance";
                $.toaster({
                    message: error,
                    priority: 'danger',
                    logMessage: error + " Error details [" + xhr + ", " + ajaxOptions + ", " + thrownError + "]"
                });
            }
        });
    }
}
$(document).ready(function () {
    if ($(".region-base-store-select").length > 0) {
        ACC.basestorenavigation.bindEvents();
        ACC.basestorenavigation.unbindClickOnRegionSelect();
    }
});
