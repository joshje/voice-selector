(function($) {

    var slots = [];
    var $slots = $('.slots');
    var score = 0;
    var $score = $('.score');
    var results = [
        {
            type: "twitter",
            name: "anthonyrose",
            image: "https://si0.twimg.com/profile_images/1599447732/Anthony1-small-square.JPG",
            min: 500,
            max: 5000
        },
        {
            type: "blank"
        },
        {
            type: "twitter",
            name: "ErnestoSchmitt",
            image: "https://si0.twimg.com/profile_images/1600852722/image.jpg",
            min: 600,
            max: 6000
        },
        {
            type: "blank"
        },
        {
            type: "twitter",
            name: "mbleyleben",
            image: "https://si0.twimg.com/profile_images/88472831/ImgSheet_8_cr.jpg",
            min: 700,
            max: 7000
        },
        {
            type: "twitter",
            name: "endotoh",
            image: "https://si0.twimg.com/profile_images/1661445920/alex-profile-pic.jpg",
            min: 800,
            max: 8000
        },
        {
            type: "blank"
        }
    ];

    var randomInterval = function(from, to) {
        return Math.floor(Math.random()*(to-from+1)+from);
    };

    var updateScore = function(slot) {
        score++;
        $score.text(score);
        $('.slot').eq(slot).addClass('tweet');
        setTimeout(function() {
            $('.slot').eq(slot).removeClass('tweet');
        }, 800);
    };

    var fakeTweet = function(result) {
        var delay = randomInterval(result.min, result.max);
        setTimeout(function() {
            $('.slots').trigger('tweet', [result]);
            fakeTweet(result);
        }, delay);
    };

    var init = function() {
        var slot = '<ul class="slot">' + "\n";
        for (var i = 0, len = results.length; i < len; ++i) {
            var result = results[i];
            slot += '<li>';
            if (result.type == 'twitter') {
                slot += '<img src="' + result.image + '">';
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
            },
            onEnd : function(numbers) {
                slots = [];
                for (var slot = numbers.length - 1; slot >= 0; slot--) {
                    var result = results[numbers[slot]-1];
                    if (result.type == 'twitter') {
                        slots[slot] = result.name;
                    } else {
                        slots[slot] = null;
                    }
                }
            }
        });

        $('.slots-play').click();
    };

    init();

})(jQuery);