/**
 * Created by ZayneArnold on 9/5/2016.
 */

ACC.footer = {

    _autoload: [
        ["bindFooter", $(".main-footer").length >0]
    ],

    carouselConfig:{
        "default":{
        }
    },

    bindFooter: function(){

        $(window).resize(function () {

            if ( $(window).width() > 900 ) { // If changed to ipad landscape view
                _clearAllStyles();
            } else {
                // always hide the ul's after a resize
                $("ul.dropdown-content").hide('slow');
            }
        });


        $('footer .dropdown .title').click(function() {
            if ( $(window).width() < 1019 ) {
                $("ul.dropdown-content").hide('slow');
                $(this).siblings("ul.dropdown-content:visible").hide('slow');
                $(this).siblings("ul.dropdown-content:hidden").show('slow');
            }
        });

        // Clear all applied footer styles & reset to default desktop view
        function _clearAllStyles() {

            $("ul.fed-footer-left-ul-collapsible").show('fast');
            $('footer .footer-left .footer-left-inner .title').removeClass('hovered');
            $('footer .footer-left .footer-left-inner .title').addClass('un-hovered');
        }
    }
};
