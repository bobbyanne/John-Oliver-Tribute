function animOffPage($object, offset) {
    // Go back to whence you came.
    $object.stop().animate({
        "right": offset + "px"
    });
}

(function ($) {
    $.fn.pop = function () {
        var top = this.get(-1);
        this.splice(this.length - 1, 1);
        return top;
    };

    $.fn.shift = function () {
        var bottom = this.get(0);
        this.splice(0, 1);
        return bottom;
    };
})(jQuery);



// END GLOBAL //

/////////////////// DOCUMENT READY ///////////////////
$(function () {

    var offset = -750; // The amount we want for the menu when it's offscreen
    var quoteShowing = false;  // Used for animation
    var fastFactsShowing = false;  // Used for animation

    var $landing = $("#landing");
    var $nav = $("#nav");
    var $mobileToggle = $nav.children("#mobile-toggle");  // Using children for speed
    var $quickFacts = $(".quick-fact");  // Get all of the fast facts
    var $quickFactsParent = $quickFacts.parent();  // The box around the fast facts
    var $mobileMenu = $("#mobile-nav-links");  // The mobile menu
    var $timelineItems = $("#timeline li");
    var $timelineImgs = $("#timeline img").not(".article_image");

    function isMenuShowing() {
        //  Checks to see if the mobile menu is showing or not
        return parseInt($mobileMenu.css("right")) > offset;
    }

    function setMenuToBottomOfNav() {
        //  The nav may or may not be fixed to the top of the screen, so we need 
        //  to set the slide out mobile menu to the bottom of the nav.
        //  Also add the horizontal border, in this case it is 4.
        $mobileMenu.css("top", $nav.offset().top - $(window).scrollTop() + $nav.height() + 4 + "px");
    }

    $mobileToggle.click(function () {

        if (isMenuShowing()) {
            // The menu is showing and the user clicked/touched it
            // so slide the menu off the page.
            animOffPage($mobileMenu, offset);
            return;  // We don't need to go any further.
        }

        setMenuToBottomOfNav();

        // The user clicked/touched the hamburger image thing
        // so show the menu and if the user hovers over the
        // menu when their mouse leaves, the menu will go off the page.
        $($mobileMenu).stop().animate({
            "right": "0px"
        }, 800, "easeOutBounce").mouseenter(/*do nothing here*/).mouseleave(function () {
            animOffPage($mobileMenu, offset);
        });

        // REMEMBER $.fn.shift()
        /* END CLICK */
    });

    $(window).scroll(function () {

        //  If the menu is showing and the user scrolls we need to set the mobile menu
        //  to the bottom of the nav, otherwise it will look really bad.
        if (isMenuShowing()) {
            setMenuToBottomOfNav();
        }

        if (!quoteShowing) {
            // The reason why I ( $(window).height() / 1.5 ) is so we no matter the screen
            // size the quote will show around the same position.
            if ($("#quote").offset().top - $(window).scrollTop() < $(window).height() / 1.5) {
                quoteShowing = true;
                $("#quote").animate({
                    "margin-right": "0%",
                    "opacity": 1
                });
            }
        }

        if (!fastFactsShowing) {
            if ($quickFactsParent.offset().top - $(window).scrollTop() < $(window).height() / 1.5) {
                fastFactsShowing = true;

                var $runningMan = $quickFactsParent.children("img");
                var $factsHeader = $quickFactsParent.children("h4");

                $runningMan.animate({
                    "left": "50%"
                });

                // So after the header goes to is position, we want each of the 
                // facts to scroll down it's parent like a waterfall.
                $factsHeader.animate({
                    "left": "50%"
                }, 700, "easeOutElastic", function () {
                    var time = 100;
                    $quickFacts.each(function () {
                        //  I use queue here, so we can take advantage of the delay function
                        $(this).delay(time += 150).queue(function () {
                            $(this).removeClass("quick-fact").addClass("quick-fact-showing");
                        });
                    });
                });
            }
        }

        if ($nav.css("position") === "absolute" &&
            $landing.height() - $(window).scrollTop() < 0) {
            $nav.removeClass("nav-landing").addClass("nav-fixed");
        } else if ($nav.css("position") === "fixed" &&
            $($landing).height() - $(window).scrollTop() > 10) {
            $nav.removeClass("nav-fixed").addClass("nav-landing");
        }

        if ($timelineItems.length > 0) {
            if ($timelineItems.offset().top - $(window).scrollTop() < $(window).height() / 1.5) {
                $($timelineItems[0]).animate({
                    "left": "50%",
                    "opacity": "1"
                });
                if ($timelineImgs.length > 0) {
                    $($timelineImgs[0]).animate({
                        "left": "0%",
                        "opacity": "1"
                    });
                }
                $timelineItems.shift();
                $timelineImgs.shift();
            }
        }


        /* END SCROLL */
    });

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        }
                    });
                }
            }
        });
    /* END DOCUMENT READY */
});