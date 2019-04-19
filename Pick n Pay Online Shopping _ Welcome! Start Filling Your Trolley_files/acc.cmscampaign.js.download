ACC.cmscampaign = {

    _autoload: [
        "paragraphSpacing",
        "showMoreLess",
        "threeColumns"
    ],

    paragraphSpacing: function () {
        $('.xup-type-ImageTileComponent, .xup-type-CMSTileListComponent').each(function () {
            if ($(this).siblings('.xup-type-CMSParagraphComponent:visible').length) {
                $(this).addClass('hasParagraph');
            }
        });
    },

    showMoreLess: function () {

        $(window).on("resize", function () {

            if ($(window).width() < 640) {

                var charLimit = 120;

                function truncate(el) {
                    var text = el.text();
                    el.attr("data-originalText", text);
                    el.text(text.substring(0, charLimit) + "...");
                }
                function reveal(el) {
                    el.text(el.attr("data-originalText"));
                }
                $(".truncated").each(function () {
                    truncate($(this));
                });
                $('a.truncateLink').on("click", function (e) {
                    e.preventDefault();
                    if ($(this).text() === "read more") {
                        $(this).text("read less");
                        reveal($(this).prev(".truncated"));
                    } else {
                        $(this).text("read more");
                        truncate($(this).prev(".truncated"));
                    }
                });
            }
        }).resize();
    },


    threeColumns: function () {
        $('.ONE_PLUS_ONE_PLUS_ONE .node-1, .ONE_PLUS_ONE_PLUS_ONE .node-2, .ONE_PLUS_ONE_PLUS_ONE .node-3').each(function () {
            $(this).addClass('col-xs-4');
        });
    }
};


