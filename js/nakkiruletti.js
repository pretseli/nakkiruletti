/*global window*/
/*global $*/
(function(window, $) {
    "use strict";
    // // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) {

        $.fn.transition = $.fn.animate;

        /* This easing-function is from:
         * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
         */
        jQuery.extend(jQuery.easing,
                {
                    easeOutCirc: function(x, t, b, c, d) {
                        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                    }
                });

    }

    var players = ["Pelaaja 1", "Pelaaja 2", "Pelaaja 3", "Pelaaja 4"], //array for storing all the current players
            current_rotation = 0, //the current rotation of the roulette in angles
            spinning = false, //is the roulette spinning?
            pointer = $(".pointer"); //the element for roulette pointer

    function playRoulette() {
        var amount = players.length;
        spinning = true;
        $(".players > div").css({color: "inherit"});
        var chosen = Math.floor(Math.random() * amount) + 1;
        var rotation = (360 / amount) * (chosen - 1) + 360 * 7 - current_rotation;
        current_rotation = (360 / amount) * (chosen - 1);
        pointer.transition({rotate: "+=" + rotation + "deg"}, 6000, "easeOutCirc",
                function() {
                    spinning = false;
                    $("#player" + chosen).css({color: "white"});
                });

    }

    function drawPlayers() {
        var amount = players.length;
        var sector = 360 / amount;
        //distance of the player names from the roulette center
        var player_distance = Math.ceil(pointer.width() / 2) + 22;

        //the position of the center of the pointer
        var center_y = pointer.position().top + pointer.height() / 2;
        var center_x = pointer.position().left + pointer.width() / 2;

        //redrawing player names, remove old ones
        $(".players").empty();
        for (var i = 0; i < amount; ++i) {

            //the angle for this player in radians
            var radians = (i * sector - 90) * (Math.PI / 180);
            //the name can be wider at the bottom and top.
            var style = "max-width: " + Math.floor(200 - 126 * (Math.abs(Math.cos(radians)))) + "px;";
            //the div for player's name
            var el = $("<div/>", {
                id: "player" + (i + 1),
                text: players[i],
                style: style,
                title: players[i]
            }
            ).appendTo(".players");

            //the names on the left side and over/under the roulette have to be
            //shifted left, so that they don't lie over the roulette
            var x_offset = Math.round(Math.cos(radians) * (el.width() / 2) - el.width() / 2);

            var y = Math.round(Math.sin(radians) * player_distance) + center_y;
            var x = Math.round(Math.cos(radians) * player_distance) + center_x;
            el.css({left: (x + x_offset) < 10 ? 10 : x + x_offset, top: y - 5});

        }
    }
    function addPlayerRow(player_name) {
        if ($(".player_list li").length < 8) {

            var row = $("<li><input type=\"text\" maxlength=\"16\" value=\"" + (player_name || "") + "\"></li>");
            row.click(function() {
                $(this).children("input").focus();
            });
            row.appendTo(".player_list");
            row.children("input").focus()
                    .blur(function() {
                        if (!$(this).val()) {
                            $(this).val("Pelaaja " + ($(".player_list li").index($(this).parent()) + 1));
                        }
                    });
        }
    }

    $(document).ready(function() {

        $("#btn_set_players").click(function() {
            //only show settings if roulette is not spinning
            if (!spinning) {
                $(".players_settings").fadeIn();
            }
        });

        $("#btn_play").click(function() {
            //only allow playing if roulette is not spinning
            if (!spinning) {
                playRoulette();
            }
        });

        $("#btn_ok").click(function() {

            //when settings changed -> set the roulette to defaults
            pointer.transition({rotate: "0deg"}, 0);
            current_rotation = 0;
            players.length = 0;
            //get the players from the list
            $(".player_list li input").each(function() {
                players.push($(this).val());
            });
            //.. and draw the players
            drawPlayers();

            $(".players_settings").fadeOut();
        });

        $("#btn_add_player").click(function() {
            addPlayerRow();
        });

        $("#btn_remove_player").mousedown(function(e) {
            var focused = $(".player_list li input:focus");
            //dont't remove the last player
            if ($(".player_list li").length > 1) {
                //if some player is focused, remove that
                if (focused.length > 0) {
                    focused.parent().remove();

                }
                //otherwise remove the last player
                else {
                    $(".player_list li:last-child").remove();
                }
            }

        });

        $(".player_list li input").blur(function() {
            if (!$(this).val()) {
                $(this).val("Pelaaja " + ($(".player_list li").index($(this).parent()) + 1));
            }
        });

        $(document).on("dragstart", function(e) {
            if (e.target.nodeName.toUpperCase() == "A") {
                return false;
            }
        });

        //get the players from the list (if there are any)
        $(".player_list li input").each(function() {
            players.push($(this).val());
        });

        $.each(players, function(k, p) {
            addPlayerRow(p);
            //$(".player_list").append("<li><input type=\"text\" maxlength=\"16\" value=\"" + p + "\"></li>")
        });
        //.. and draw the players
        drawPlayers();

    });

})(window, $);