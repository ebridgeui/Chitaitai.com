ACC.clubs = {

    bindEvents: function () {
        $(".js-signup-for-club-button").click(ACC.clubs.signUpForClub);
    },

    signUpForClub: function (event) {
        var club = $(".js-club").val();
        var redirectUrl = $(".js-redirectUrl").val();
        $.ajax({
            url: ACC.config.contextPath + "/signup/club",
            cache: false,
            data: {club: club},
            type: 'POST',
            beforeSend: function () {
                ACC.common.showLoadingSpinner(".js-signup-for-club-button");
            },
            success: function (data) {
                $(location).attr("href", redirectUrl);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Error has occurred joining cliub");
                $(".js-signup-for-club-error-message").show();

            },
            complete: function () {
                ACC.common.hideLoadingSpinner(".js-signup-for-club-button");
            }
        });
    }
}
$(document).ready(function () {
    if ($(".js-clubs").length > 0) {
        ACC.clubs.bindEvents();
    }
});
