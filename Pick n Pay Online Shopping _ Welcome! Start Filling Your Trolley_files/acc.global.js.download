ACC.global = {

    _autoload: [
        ["passwordStrength", $('.password-strength').length > 0],
        "bindToggleOffcanvas",
        "bindToggleXsSearch",
        "bindHoverIntentMainNavigation",
        "initImager",
        "backToHome",
        "bindStickyHeaderScroll",
        "bindHeaderSearchShowHide",
	    "setBodyPaddingTop"
    ],

    passwordStrength: function () {
        $('.password-strength').pstrength({ verdicts: [ACC.pwdStrengthTooShortPwd,
            ACC.pwdStrengthVeryWeak,
            ACC.pwdStrengthWeak,
            ACC.pwdStrengthMedium,
            ACC.pwdStrengthStrong,
            ACC.pwdStrengthVeryStrong],
            minCharText: ACC.pwdStrengthMinCharText });
    },

    bindToggleOffcanvas: function () {
        $(document).on("click", ".js-toggle-sm-navigation", function () {

            $mobileMenu = $('.main-header .main-navigation');

            if ($('.nav-bottom').css('display') == 'none') {
                $('.nav-bottom').css('display', 'block');
            }

            $mobileMenu.toggle();
            $('.js-toggle-sm-navigation').toggleClass('mobile-nav-bottom-border');
            $('.js-toggle-sm-navigation .icon-mobile-menu').toggleClass('icon-mobile-menu-close-x');

            ACC.global.resetXsSearch();
        });
    },

    bindToggleXsSearch: function () {
        $(document).on("click", ".js-toggle-xs-search", function () {
            ACC.global.toggleClassState($(".site-search"), "active");
            ACC.global.toggleClassState($(".main-header-md .sm-navigation"), "search-open");
        });
    },

    resetXsSearch: function () {
        $('.site-search').removeClass('active');
        $(".main-header-md .sm-navigation").removeClass("search-open");
    },

    toggleClassState: function ($e, c) {
        $e.hasClass(c) ? $e.removeClass(c) : $e.addClass(c);
        return $e.hasClass(c);
    },

    bindHoverIntentMainNavigation: function () {

        enquire.register("screen and (min-width:" + screenMdMin + ")", {

            match: function () {
                // on screens larger or equal screenMdMin (1024px) calculate position for .sub-navigation
                $("nav.main-navigation > ul > li").hoverIntent(function () {

                    $('.main-header .main-navigation .sub-navigation .sub-navigation-section ul').hide(); //hide final tier items
                    $('.main-header .main-navigation .sub-navigation .sub-navigation-section img').hide();

                    // do border/line styling ( should be moved to its own func)
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css('border-right', 'none');
                    // $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css('border-left', 'none');
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section:last-child').css('border-bottom', 'none');
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css('background', 'none');


                    var $this = $(this),
                        itemWidth = $this.width();
                    var $subNav = $this.find('.sub-navigation'),
                        subNavWidth = $subNav.outerWidth();
                    var $mainNav = $('.main-navigation'),
                        mainNavWidth = $mainNav.width();

                    // get the left position for sub-navigation to be centered under each <li>
                    var leftPos = $this.position().left + itemWidth / 2 - subNavWidth / 2;
                    // get the top position for sub-navigation. this is usually the height of the <li> unless there is more than one row of <li>
                    var topPos = $this.position().top + $this.height();

                    if (leftPos > 0 && leftPos + subNavWidth < mainNavWidth) {
                        // .sub-navigation is within bounds of the .main-navigation
                        $subNav.css({
                            "left": leftPos,
                            "top": topPos,
                            "right": "auto"
                        });
                    } else if (leftPos < 0) {
                        // .suv-navigation can't be centered under the <li> because it would exceed the .main-navigation on the left side
                        $subNav.css({
                            "left": 0,
                            "top": topPos,
                            "right": "auto"
                        });
                    } else if (leftPos + subNavWidth > mainNavWidth) {
                        // .suv-navigation can't be centered under the <li> because it would exceed the .main-navigation on the right side
                        $subNav.css({
                            "right": 0,
                            "top": topPos,
                            "left": "auto"
                        });
                    }
                    $this.addClass("md-show-sub");
                }, function () {
                    $(this).removeClass("md-show-sub")
                });

                $("nav.main-navigation .sub-navigation .sub-navigation-section > li").hoverIntent(function (e) {

                    $('.main-header .main-navigation .sub-navigation .sub-navigation-section ul').hide();  //hide final tier items

                    $(e.target).parent().find('ul').show();  //show final tier items

                    // do border/line styling ( should be moved to its own func)
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css('border-right', 'solid 1px #ebebeb');
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css('border-left', 'solid 1px #ebebeb');
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section:last-child').css('border-bottom', 'solid 1px #ebebeb');
                    $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').css({
                        'background': 'linear-gradient(180deg, #ffffff, #ebebeb, #ffffff)',
                        'background-position': '200px',
                        'background-repeat': 'repeat-y',
                        'background-size': '1px auto',
                        'background-color': '#ffffff',
                        'height': '40px',
                    });

                    var $img = $(e.target).parent().find('img');

                    $('.main-header .main-navigation .sub-navigation .sub-navigation-section img').hide();

                    // if( $img[0].currentSrc && $img[0].naturalHeight !== null) { // if image actually exists
                        $img.show();
                    // }
                });

                $('.main-header .main-navigation > .nav > li .sub-navigation .item-container').hover( function () {

                        $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').addClass('bg-white');
                    },function () {
                        $('.main-header .main-navigation > .nav > li .sub-navigation .sub-navigation-section').removeClass('bg-white');
                    }
                );
            },

            unmatch: function () {
                // on screens smaller than screenMdMin (1024px) remove inline styles from .sub-navigation and remove hoverIntent
                $("nav.main-navigation > ul > li .sub-navigation").removeAttr("style");
                $("nav.main-navigation > ul > li").hoverIntent(function () {
                    // unbinding hover
                });
            }

        });

        // Only fires for mobile. Handles the level 1 menu click
        $("nav .sub-navigation .sub-navigation-section.container > li > a").click(function (e) {
            if (! ACC.global.isDesktopMode()) {
                e.preventDefault();

                $("nav .sub-navigation .sub-navigation-section.container > li").hide();
                $(e.target).closest('.sub-navigation-section').find('ul').addClass('active');
                $(e.target).removeClass('active');
            }
        });
    },

    initImager: function (elems) {
        elems = elems || '.js-responsive-image';
        this.imgr = new Imager(elems);
    },

    reprocessImages: function (elems) {
        elems = elems || '.js-responsive-image';
        if (this.imgr == undefined) {
            this.initImager(elems);
        } else {
            this.imgr.checkImagesNeedReplacing($(elems));
        }
    },

    // usage: ACC.global.addGoogleMapsApi("callback function"); // callback function name like "ACC.global.myfunction"
    addGoogleMapsApi: function (callback) {
        if (callback != undefined && $(".js-googleMapsApi").length == 0) {
            $('head').append('<script class="js-googleMapsApi" type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=' + ACC.config.googleApiKey + '&sensor=false&callback=' + callback + '"></script>');
        } else if (callback != undefined) {
            eval(callback + "()");
        }
    },

    backToHome: function () {
        $(".backToHome").on("click", function () {
            var sUrl = ACC.config.contextPath;
            window.location = sUrl;
        });
    },

    bindStickyHeaderScroll: function () {

        var position = $(window).scrollTop();

        $(window).scroll(function () {

            var navMenuMobileOpen = $('.close-nav a').hasClass('mobile-nav-bottom-border');
            var navMenuDesktopOpen = $('.js-offcanvas-links > li.js-enquire-has-sub').hasClass('md-show-sub');

            var scroll = $(window).scrollTop();

            if ($(window).scrollTop() === 0 || scroll < position) { // If at top of screen
                // Remove sticky classes
                if (ACC.global.isMobileMode()) {
                    // $('.nav-top').removeClass('sticky-header-mobile');
                    // $('.nav-top .sticky-nav-top').removeClass('sticky-header-mobile');
                    // $('.nav-bottom').removeClass('sticky-header-mobile');
                    // $('.headerLinks-iconsContainer').removeClass('sticky-header-mobile');
                    // $('.headerLinksContainer').removeClass('sticky-header-mobile');
                    // $('.page-homepage .nav-bottom').removeClass('sticky-header-mobile');
                    // $('.carousel-rotating-banner').removeClass('sticky-header-mobile');
                    //
                    // $('.page-homepage main .main-content').removeClass('sticky-header-mobile');
                    // $('main .main-content').removeClass('sticky-header-mobile');
                    // $('main > div  .container').removeClass('sticky-header-mobile');

                } else if (ACC.global.isTabletMode()) {

                    // $('.nav-top').removeClass('sticky-header-tablet');
                    // $('.nav-top .sticky-nav-top').removeClass('sticky-header-tablet');
                    // $('.nav-bottom').removeClass('sticky-header-tablet');
                    // $('.headerLinks-iconsContainer').removeClass('sticky-header-tablet');
                    // $('.headerLinksContainer').removeClass('sticky-header-tablet');
                    // $('.page-homepage .nav-bottom').removeClass('sticky-header-tablet');
                    // $('.carousel-rotating-banner').removeClass('sticky-header-tablet');
                    //
                    // $('.page-homepage main .main-content').removeClass('sticky-header-tablet');
                    // $('main .main-content').removeClass('sticky-header-tablet');
                    // $('main > div  .container').removeClass('sticky-header-tablet');

                } else { // Desktop
                    // $('.nav-top').removeClass('sticky-header-desktop');
                    // $('.nav-top .sticky-nav-top').removeClass('sticky-header-desktop');
                    // $('.nav-bottom').removeClass('sticky-header-desktop');
                    // $('.headerLinks-iconsContainer').removeClass('sticky-header-desktop');
                    // $('.headerLinksContainer').removeClass('sticky-header-desktop');
                    // $('.page-homepage .nav-bottom').removeClass('sticky-header-desktop');
                    // $('.carousel-rotating-banner').removeClass('sticky-header-desktop');

                    // $('.page-homepage main .main-content').removeClass('sticky-header-desktop');
                    // $('main .main-content').removeClass('sticky-header-desktop');
                    // $('main > div  .container').removeClass('sticky-header-desktop');
                }

            } else {

                // Add sticky classes
                if (ACC.global.isMobileMode()) {

                    if ($('body').hasClass('page-intro-home-page')) {
                        return;
                    }
                    if (navMenuMobileOpen || navMenuDesktopOpen) {
                        return;
                    }

                    // $('.nav-top').addClass('sticky-header-mobile');
                    // $('.nav-top .sticky-nav-top').addClass('sticky-header-mobile');
                    // $('.nav-bottom').addClass('sticky-header-mobile');
                    // $('.headerLinks-iconsContainer').addClass('sticky-header-mobile');
                    // $('.headerLinksContainer').addClass('sticky-header-mobile');
                    // $('.page-homepage .nav-bottom').addClass('sticky-header-mobile');
                    // $('.carousel-rotating-banner').addClass('sticky-header-mobile');

                    // $('.page-homepage main .main-content').addClass('sticky-header-mobile');
                    // $('main .main-content').addClass('sticky-header-mobile');
                    // $('main > div .container').addClass('sticky-header-mobile');

                } else if (ACC.global.isTabletMode()) {

                    if ($('body').hasClass('page-intro-home-page')) {
                        return;
                    }
                    if (navMenuMobileOpen || navMenuDesktopOpen) {
                        return;
                    }

                    // $('.nav-top').addClass('sticky-header-tablet');
                    // $('.nav-top .sticky-nav-top').addClass('sticky-header-tablet');
                    // $('.nav-bottom').addClass('sticky-header-tablet');
                    // $('.headerLinks-iconsContainer').addClass('sticky-header-tablet');
                    // $('.headerLinksContainer').addClass('sticky-header-tablet');
                    // $('.page-homepage .nav-bottom').addClass('sticky-header-tablet');
                    // $('.carousel-rotating-banner').addClass('sticky-header-tablet');

                    // $('.page-homepage main .main-content').addClass('sticky-header-tablet');
                    // $('main .main-content').addClass('sticky-header-tablet');
                    // $('main > div .container').addClass('sticky-header-tablet');

                } else { // Desktop

                    if ($('body').hasClass('page-intro-home-page')) {
                        return;
                    }
                    if (navMenuMobileOpen || navMenuDesktopOpen) {
                        return;
                    }

                    // $('.nav-top').addClass('sticky-header-desktop');
                    // $('.nav-top .sticky-nav-top').addClass('sticky-header-desktop');
                    // $('.nav-bottom').addClass('sticky-header-desktop');
                    // $('.headerLinks-iconsContainer').addClass('sticky-header-desktop');
                    // $('.headerLinksContainer').addClass('sticky-header-desktop');
                    // $('.page-homepage .nav-bottom').addClass('sticky-header-desktop');
                    // $('.carousel-rotating-banner').addClass('sticky-header-desktop');

                    // $('.page-homepage main .main-content').addClass('sticky-header-desktop');
                    // $('main .main-content').addClass('sticky-header-desktop');
                    // $('main > div .container').addClass('sticky-header-desktop');
                }
            }
        });
    },

    bindHeaderSearchShowHide: function () {

	    // show
	    $('a.pnp-icon-search-btn2').bind('click', function() {
		    $('div.search-box').show();
		    $('a.icon-header-search-close-x').show();
	    });

	    // hide
	    $('a.icon-header-search-close-x').bind('click', function() {
		    $('div.search-box').hide();
		    $('a.icon-header-search-close-x').hide();
	    });
    },

	setBodyPaddingTop: function() {
    	$("body").css({"padding-top": $("header.main-header").outerHeight(true)});
	},

    isMobileMode: function () {
        if ((ACC.global.getViewPortWidth() < 768)) {
            return true;
        }
    },
    isTabletMode: function () {
        if ((ACC.global.getViewPortWidth() >= 768) && (ACC.global.getViewPortWidth() <= 1024)) {
            return true;
        }
    },

    isDesktopMode: function () {
        if ((ACC.global.getViewPortWidth() > 1024)) {
            return true;
        }
    },

    getViewPortWidth: function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

};
