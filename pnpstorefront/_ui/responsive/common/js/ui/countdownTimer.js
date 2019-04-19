jQuery(document).ready(function()
{
    var countdownTimers = jQuery(".countdown-timer");

    if (countdownTimers.length)
    {
        var panelNames = ["Days", "Hours", "Minutes", "Seconds"];
        var countdownTimerPanelHtml =
            "<div class=\"countdown-panel panel-name\">" +
            "<div class=\"glyph next\"><div></div></div>" +
            "<div class=\"glyph current\"><div></div></div>" +
            "<div class=\"flipper\">" +
            "<div class=\"front\"><div></div></div>" +
            "<div class=\"back\"><div></div></div>" +
            "</div>" +
            "</div>";

        countdownTimers.each(function()
        {
            var countdownTimer = jQuery(this);
            var countdownDate = null;
            var classes = countdownTimer.attr("class").split(/\s+/);

            jQuery.each(classes, function(index, item)
            {
                if (item.substr(0, 2) === "to")
                {
                    var parts = item.split("_");

                    countdownDate = new Date(parts[1] + "/" + parts[2] + "/" + parts[3] + " " + parts[4] + ":" + parts[5] + ":" + parts[6] + " GMT+0200").getTime();
                }
            });

            if (countdownDate === null || countdownDate < new Date())
                return;

            var countdownTimerPanelContainerlHtml = "<div class=\"countdown-panel-container\">" +
                "<div>New deals live in</div>";

            for (var i = 0; i < panelNames.length; i++)
                countdownTimerPanelContainerlHtml += countdownTimerPanelHtml.replace("panel-name", panelNames[i].toLowerCase());

            countdownTimerPanelContainerlHtml += "</div>";

            countdownTimer.append(countdownTimerPanelContainerlHtml).css({"position": "relative"});

            var countdownTimerPanelContainer = countdownTimer.children("div.countdown-panel-container").eq(0);

            var daysPanel = countdownTimerPanelContainer.find("div.countdown-panel.days").eq(0);
            var daysPanelCurrent = daysPanel.find("div.glyph.current > div").eq(0);
            var daysPanelNext = daysPanel.find("div.glyph.next > div").eq(0);
            var daysPanelFlipper = daysPanel.find("div.flipper").eq(0);
            var daysPanelFlipperFront = daysPanelFlipper.find("div.front > div").eq(0);
            var daysPanelFlipperBack = daysPanelFlipper.find("div.back > div").eq(0);

            var hoursPanel = countdownTimerPanelContainer.find("div.countdown-panel.hours").eq(0);
            var hoursPanelCurrent = hoursPanel.find("div.glyph.current > div").eq(0);
            var hoursPanelNext = hoursPanel.find("div.glyph.next > div").eq(0);
            var hoursPanelFlipper = hoursPanel.find("div.flipper").eq(0);
            var hoursPanelFlipperFront = hoursPanelFlipper.find("div.front > div").eq(0);
            var hoursPanelFlipperBack = hoursPanelFlipper.find("div.back > div").eq(0);

            var minutesPanel = countdownTimerPanelContainer.find("div.countdown-panel.minutes").eq(0);
            var minutesPanelCurrent = minutesPanel.find("div.glyph.current > div").eq(0);
            var minutesPanelNext = minutesPanel.find("div.glyph.next > div").eq(0);
            var minutesPanelFlipper = minutesPanel.find("div.flipper").eq(0);
            var minutesPanelFlipperFront = minutesPanelFlipper.find("div.front > div").eq(0);
            var minutesPanelFlipperBack = minutesPanelFlipper.find("div.back > div").eq(0);

            var secondsPanel = countdownTimerPanelContainer.find("div.countdown-panel.seconds").eq(0);
            var secondsPanelCurrent = secondsPanel.find("div.glyph.current > div").eq(0);
            var secondsPanelNext = secondsPanel.find("div.glyph.next > div").eq(0);
            var secondsPanelFlipper = secondsPanel.find("div.flipper").eq(0);
            var secondsPanelFlipperFront = secondsPanelFlipper.find("div.front > div").eq(0);
            var secondsPanelFlipperBack = secondsPanelFlipper.find("div.back > div").eq(0);

            var now = new Date().getTime();
            var distance = countdownDate - now;

            var daysCurrent = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hoursCurrent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutesCurrent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var secondsCurrent = Math.floor((distance % (1000 * 60)) / 1000);

            var tick = setInterval(function()
            {
                now = new Date().getTime();
                distance = countdownDate - now;

                var daysNext = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hoursNext = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutesNext = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var secondsNext = Math.floor((distance % (1000 * 60)) / 1000);

                daysPanelNext.text(hoursNext);
                daysPanelFlipperBack.text(hoursNext);

                hoursPanelNext.text(hoursNext);
                hoursPanelFlipperBack.text(hoursNext);

                minutesPanelNext.text(minutesNext);
                minutesPanelFlipperBack.text(minutesNext);

                secondsPanelNext.text(secondsNext);
                secondsPanelFlipperBack.text(secondsNext);

                if (daysCurrent != daysNext)
                    daysPanelFlipper.addClass("flip");

                if (hoursCurrent != hoursNext)
                    hoursPanelFlipper.addClass("flip");

                if (minutesCurrent != minutesNext)
                    minutesPanelFlipper.addClass("flip");

                if (secondsCurrent != secondsNext)
                    secondsPanelFlipper.addClass("flip");

                setTimeout(function()
                {
                    daysPanelCurrent.text(daysCurrent);
                    daysPanelFlipperFront.text(daysCurrent);
                    daysPanelFlipper.removeClass("flip");

                    hoursPanelCurrent.text(hoursCurrent);
                    hoursPanelFlipperFront.text(hoursCurrent);
                    hoursPanelFlipper.removeClass("flip");

                    minutesPanelCurrent.text(minutesCurrent);
                    minutesPanelFlipperFront.text(minutesCurrent);
                    minutesPanelFlipper.removeClass("flip");

                    secondsPanelCurrent.text(secondsCurrent);
                    secondsPanelFlipperFront.text(secondsCurrent);
                    secondsPanelFlipper.removeClass("flip");
                }, 500);

                daysCurrent = daysNext;
                hoursCurrent = hoursNext;
                minutesCurrent = minutesNext;
                secondsCurrent = secondsNext;

                if (distance < 1000)
                {
                    window.location.reload();
                    clearInterval(tick);
                }
            }, 1000);
            // Final styling
            var countdownTimerHeight = countdownTimer.outerHeight();
            var countdownTimerPanelContainerHeight = 230; // Magic!

            countdownTimerPanelContainer.css({"padding-top": (countdownTimerHeight - countdownTimerPanelContainerHeight) / 2});
        });
    }

});