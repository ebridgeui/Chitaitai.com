$(function () {
    if($('body').is('.template-pages-layout-fullPageLayoutTemplate')) {

        /*-------------------------*/
        /*----- sticky footer -----*/
        /*-------------------------*/
        (function () {
            var
                $window = $(window),
                $body = $(document.body),
                $footer = $("footer.main-footer"),
                condition = false,
                resizing = false,
                interval = 100
                ;
            function positionFooter() {
                if (resizing) {
                    setTimeout(function () {
                        if (resizing == false) {
                            positionFooter();
                        }
                    }, interval);
                    return true;
                }
                var
                    footer_position = $footer.css('position'),
                    body_height = $body.height(),
                    window_height = $window.height(),
                    footer_height = $footer.outerHeight();

                if (footer_position == 'absolute') {
                    condition = body_height + footer_height < window_height
                }
                else {
                    condition = body_height < window_height
                }
                if (condition) {
                    $footer.css('position', 'absolute').css('bottom', 0);
                }
                else {
                    $footer.css('position', 'relative');
                }
                resizing = setTimeout(function () {
                    resizing = false;
                }, interval);
                return true;
            }
            $window.bind("load", function () {
                positionFooter();
                $("footer.main-footer").css('visibility', 'visible'); // will only hit on mobile
            });
            $window.resize(positionFooter);
        }());


        /*----------------------------------------*/
        /*----- vertical-aign center content -----*/
        /*----------------------------------------*/
        function vertcenter() {
            var divH = $('.introPageBodyContainer').innerHeight() / 2;
            var pageH = $(window).innerHeight() / 2;
            var footerH = $('.fullpage-stickyfooter').innerHeight();
            var deliveryBannerH = $('.customerBlockedPage').innerHeight() / 2;
            var deliveryBannerInnerH = $('.deliveryBannerContent').innerHeight() / 2;
            var topValue = pageH - divH - footerH;

            if (topValue <= 10 ) {
                $('.introPageBodyContainer').css({
                    top: "10px",
                    display: "block"
                });
            } else {
                $('.introPageBodyContainer').css({
                    top: (topValue),
                    display: "block"
                });
            };
            $('.deliveryBannerContent').css({top: (deliveryBannerH - deliveryBannerInnerH)});
        }
        vertcenter();
        $(window).on('resize', function () {
            vertcenter();
        });


    }
});