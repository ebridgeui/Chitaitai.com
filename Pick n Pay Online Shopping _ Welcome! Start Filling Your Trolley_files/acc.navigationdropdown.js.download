/**
 * Created by MichaelJacobs on 7/25/2016.
 */
ACC.navigationdropdown = {
    _autoload: [
        ["headerDropdown", $("#header-nav-dropdown").length > 0]
    ],
    headerDropdown: function () {
        var windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
        var autoExpand = $("#header-nav-dropdown").data("autoExpand");

        if (autoExpand == null) {
            autoExpand = false;
        }
        $("#header-nav-dropdown").accordion({
            collapsible: true,
            active: autoExpand,
            icons: false,
            animate: 150
        });


        $(document).click(function(e) {
            if (!$( "#header-nav-dropdown" ).is(e.target) && !$( "#header-nav-dropdown" ).has(e.target).length) {
                $('#header-nav-dropdown').accordion({
                	active: false
                });
            }

        });


        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll > 200) {
             if($("#header-nav-dropdown").length>0){
            	 $('#header-nav-dropdown').accordion({
                 	active: false
                 });
               }

            }

         });

        // Only once fully opened/activated
        $("#header-nav-dropdown").on("accordionactivate", function() {

            if (ACC.global.isMobileMode()) {
                var itemHeight = windowHeight / 25;

                $(".header-accordion #header-nav-dropdown.ui-accordion .ui-accordion-content.loyalty-accordion-container").css("height",windowHeight-35);

                $(".header-accordion-links-item").css({'paddingTop':itemHeight, 'paddingBottom':itemHeight});
                $(".header-accordion-links-item-bottom").css({'paddingTop':itemHeight, 'paddingBottom':itemHeight});
            }
        });

        $("#header-nav-dropdown").on("click", function() {

            var $iconOpenClose = $('.header-accordion #header-nav-dropdown h3.ui-accordion-header .loyalty-accordion-icon-right');
            var active = $( "#header-nav-dropdown" ).accordion('option','active');

            if (active === false) {
                $iconOpenClose.css('background-position-y','-24px');
            } else {
                $iconOpenClose.css('background-position-y','-39px');
            }
        });
    }
}