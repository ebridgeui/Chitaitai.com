/**
 * Created by MichaelJacobs on 2017/06/21.
 */
ACC.cmscomponentpopupcomponent = {
    _autoload: [
        ["bindCMSPopupComponentButton", $(".cmscomponentpopupcomponent").length > 0]
    ],
    bindCMSPopupComponentButton : function () {
        $('.cmscomponentpopupcomponent').on('click ', function(e) {
            var componentUid = e.target.dataset.componentUid;
            $( '#' + componentUid + "_dlgCmsComponentPopupComponentId").dialog("open");
        });
    }
}

$(document).ready(function () {
   var dialog = $(".dlgCmsComponentPopupComponentClass").dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: true,
        height: "auto",
        width: "auto",
        modal: true
    });
});

