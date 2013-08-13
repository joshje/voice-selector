(function($) {
    $('.slots .slot').jSlots({
        number : 3,
        winnerNumber : 1,
        spinner : '.slots-play',
        easing : 'easeOutSine',
        time : 7000,
        loops : 6,
        onStart : function() {
            // Stop counting tweets
        },
        onEnd : function(winCount, winners, finalNumbers) {
            // Start counting tweets for shown celebs
            console.log('winCount', winCount);
            console.log('winners', winners);
            console.log('finalNumbers', finalNumbers);
        }
    });
})(jQuery);