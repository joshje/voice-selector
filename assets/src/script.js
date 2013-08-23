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
    var jSlots;
    var $slots = $('.slots');
    var $slot;
    var $tweets = $('.slot-tweets');
    var $tweetSlots = $('li', $tweets);
    var $slotsPlay = $('.slots-play');
    var $slotsPlayHidden = $('.slots-play-hidden');
    var $countdown = $('.countdown', $slotsPlay);
    var score = 0;
    var countdownTimer;
    var $buzz = $('.slots-buzz');
    var $score = $('.score', $buzz);
    var $mute = $('.mute');
    var muted = false;

    var generateSlot = function() {
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
        return slot;
    };

    var generateAudio = function(src) {
        var audio = document.createElement('audio');
        if (! audio.canPlayType) return false;
        var canPlayMP3 = audio.canPlayType('audio/mpeg;').replace(/no/, '');
        var canPlayOgg = audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '');
        if (! (canPlayMP3 || canPlayOgg)) return false;
        audio.style.display = 'none';
        audio.setAttribute('preload', 'true');
        var s = document.createElement('source');
        s.src = src;
        if (! canPlayMP3) {
            s.src = s.src.replace('mp3', 'ogv');
        }
        audio.appendChild(s);
        document.getElementsByTagName('body')[0].appendChild(audio);
        return audio;
    };
    var audioSlots = [];
    for (var i = 2; i >= 0; i--) {
        audioSlots.push(generateAudio('assets/audio/switch.mp3'));
    };
    var audioSlotsIndex = 2;

    var randomInterval = function(from, to) {
        return Math.floor(Math.random()*(to-from+1)+from);
    };

    var updateScore = function(slot) {
        $tweetSlots.eq(slot).removeClass('tweet');
        setTimeout(function() {
            $tweetSlots.eq(slot).addClass('tweet');
        }, 1);
        setTimeout(function() {
            changeScore(multiplier);
        }, 400);
        setTimeout(function() {
            $tweetSlots.eq(slot).removeClass('tweet');
        }, 800);
    };

    var changeScore = function(amount) {
        var oldScore = score;
        score += amount;
        if (score < 0) {
            score = 0;
        }
        if (oldScore == score) return;
        setTimeout(function() {
           $buzz.addClass('updated');
        }, 1);
        setTimeout(function() {
            $score.text(score);
        }, 150);
        setTimeout(function() {
           $buzz.removeClass('updated');
        }, 500);
    };

    var fakeTweet = function(result) {
        var delay = randomInterval(result.min, result.max);
        setTimeout(function() {
            $('.slots').trigger('tweet', [result]);
            fakeTweet(result);
        }, delay);
    };

    $slotsPlay.on('click', function(e) {
        changeScore(-20);
        $slotsPlayHidden.click();
        e.preventDefault();
    });

    var countdownStart = function() {
        countdownReset();
        setTimeout(function() {
            $countdown.addClass('animate');
        }, 1);
        countdownTimer = setTimeout(function() {
            $slotsPlayHidden.click();
            countdownReset();
        }, 60 * 1000);
    };
    var countdownReset = function() {
        clearTimeout(countdownTimer);
        $countdown.removeClass('animate');
    };

    var setMultiplier = function(value) {
        multiplier = value;
        $tweets.attr('data-multiplier', multiplier);
    };

    var resetMultiplier = function() {
        setMultiplier(1);
    };

    var increaseMultiplier = function(amount) {
        setMultiplier(multiplier * amount);
    };

    var slotsStart = function() {
        slots = [];
        countdownReset();
    };

    var slotsEnd = function(numbers) {
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
    };

    var slotsSlot = function() {
        if (!muted && audioSlots[audioSlotsIndex]) {
            audioSlots[audioSlotsIndex].play();
        }
        audioSlotsIndex--;
        if (audioSlotsIndex < 0) {
            audioSlotsIndex = 2;
        }
    };

    var init = function() {
        var slot = generateSlot();
        $slots.append(slot);
        $slot = $('.slot', $slots);

        jSlots = $slot.jSlots({
            number : 3,
            winnerNumber : 1,
            spinner : '.slots-play-hidden',
            easing : 'easeOutSine',
            time : 3000,
            loops : 6,
            onStart : slotsStart,
            onEnd : slotsEnd,
            onSlot : slotsSlot
        });

        $slots.on('tweet', function(e, result) {
            for (var i = slots.length - 1; i >= 0; i--) {
                if (slots[i] && slots[i] == result.name) {
                    updateScore(i);
                }
            }
        });

        $mute.on('click', function(e) {
            $mute.toggleClass('muted');
            muted = !muted;
            e.preventDefault();
        })

    };

})(jQuery);