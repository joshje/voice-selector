(function($) {

    var results;
    $.ajax({
        url: 'data/results.json'
    }).done(function(data) {
        results = data;
        init();
    });

    var slots = [];
    var multiplier = 1;
    var $slots = $('.slots');
    var $slotsPlay = $('.slots-play');
    var $countdown = $('.countdown', $slotsPlay);
    var score = 0;
    var countdownTimer;
    var $score = $('.score');

    var randomInterval = function(from, to) {
        return Math.floor(Math.random()*(to-from+1)+from);
    };

    var updateScore = function(slot) {
        changeScore(multiplier);
        $('.slot').eq(slot).addClass('tweet');
        setTimeout(function() {
            $('.slot').eq(slot).removeClass('tweet');
        }, 800);
    };

    var changeScore = function(amount) {
        score += amount;
        if (score < 0) score = 0;
        $score.text(score);
    };

    var fakeTweet = function(result) {
        var delay = randomInterval(result.min, result.max);
        setTimeout(function() {
            $('.slots').trigger('tweet', [result]);
            fakeTweet(result);
        }, delay);
    };

    $slotsPlay.on('click', function(e) {
        e.preventDefault();
    });

    var countdownStart = function() {
        countdownReset();
        setTimeout(function() {
            $countdown.addClass('animate');
        }, 1);
        countdownTimer = setTimeout(function() {
            $slotsPlay.click();
            countdownReset();
        }, 60 * 1000);
    };
    var countdownReset = function() {
        clearTimeout(countdownTimer);
        $countdown.removeClass('animate');
    };

    var setMultiplier = function(value) {
        multiplier = value;
        $slots.attr('data-multiplier', multiplier);
    };

    var resetMultiplier = function() {
        setMultiplier(1);
    };

    var increaseMultiplier = function(amount) {
        setMultiplier(multiplier * amount);
    };

    var init = function() {
        var slot = '<ul class="slot">' + "\n";
        for (var i = 0, len = results.length; i < len; ++i) {
            var result = results[i];
            slot += '<li>';
            if (result.image) {
                slot += '<img src="' + result.image + '">';
            }
            if (result.type == 'twitter') {
                fakeTweet(result);
            }
            slot += '</li>' + "\n";
        }
        slot += '</ul>' + "\n";

        $slots.append(slot).on('tweet', function(e, result) {
            for (var i = slots.length - 1; i >= 0; i--) {
                if (slots[i] && slots[i] == result.name) {
                    updateScore(i);
                }
            }
        });

        var $slot = $('.slot', $slots);

        $slot.jSlots({
            number : 3,
            winnerNumber : 1,
            spinner : '.slots-play',
            easing : 'easeOutSine',
            time : 3000,
            loops : 6,
            onStart : function() {
                // Stop counting tweets
                slots = [];
                $slot.removeClass('tweet');
                countdownReset();
                changeScore(-20);
            },
            onEnd : function(numbers) {
                slots = [];
                resetMultiplier();
                for (var slot = numbers.length - 1; slot >= 0; slot--) {
                    var result = results[numbers[slot]-1];
                    if (result && result.type == 'twitter') {
                        slots[slot] = result.name;
                    } else {
                        if (result.type == 'multiplier') {
                            increaseMultiplier(result.value);
                        }
                        slots[slot] = null;
                    }
                }
                countdownStart();
            }
        });

    };

})(jQuery);