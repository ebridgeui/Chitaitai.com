$(document).ready(function() {

    //var owl = $("#owl-rotatingbannertile");
    var owl = $(".tileContainer-hasMobileAuto");

    owl.owlCarousel({
        items : 3, //10 items above 1000px browser width

        responsive:{
            0:{
                items:2,
                nav:true,
            },
            760:{
                items:3,
                nav:true,
            },
        },

        nav:false,
        navText : ["<span class='glyphicon glyphicon-chevron-left'></span>", "<span class='glyphicon glyphicon-chevron-right'></span>"],
        addClassActive : true
    });

});