/**
 * Created by MichaelJacobs on 2017/06/19.
 */
ACC.simpleaccordioncomponent = {
    _autoload: [
        ["expandOrCollapse", $(".pnp-accordion").length > 0]
    ],
    expandOrCollapse : function () {
        /*$(document).on('click ', '.pnp-accordion', function(e) {*/
        $('.pnp-accordion').on('click ', function(e) {
            var sacUid = e.target.dataset.sacUid;
            var classList = e.target.classList;

            var active = e.target.dataset.active;
            if (sacUid) {
                if (active == "true") {
                    $('#' + sacUid + '_pnp-accordion-panel').hide(100);
                    $(e.target).removeClass('active');
                    e.target.dataset.active = false;
                } else {
                    $('#' + sacUid + '_pnp-accordion-panel').show(150);
                    $(e.target).addClass('active');
                    e.target.dataset.active = true;
                }
            }
        });
    }
}