ACC.radiodropdown = {

_autoload: [
		"bindRadioButtonClick"
	],

    bindRadioButtonClick: function() {
        var acc = $('.radiodropdown');
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function(e){
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("show");
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }
    }
};


/*product list table header widths*/

/*var prodlistcol1 = $('.product-item-left1').width();
$("#h1-item-1").css("width", prodlistcol1);
 $("#h1-item-3").css("background-color", "green");*/

/*var prodlistcol1 = $('#productlistcol1').offset().left -78;
$("#h1-item-1").css("left", prodlistcol1)

var prodlistcol2 = $('#productlistcol2').offset().left -88;
$("#h1-item-2").css("left", prodlistcol2)

var prodlistcol3 = $('#productlistcol3').offset().left -88;
$("#h1-item-3").css("left", prodlistcol3)

var prodlistcol4 = $('#productlistcol4').offset().left -88;
$("#h1-item-4").css("left", prodlistcol4)

var prodlistcol5 = $('#productlistcol5').offset().left -88;
$("#h1-item-5").css("left", prodlistcol5)*/





