var isResizing = false,
    lastDownX = 0;

$(function() {
    var container = $('#container'),
        left = $('#left_panel'),
        right = $('#right_panel'),
        drag = $('#drag');

    drag.on('mousedown', function(e) {
        isResizing = true;
        lastDownX = e.clientX;
    });

    $(document).on('mousemove', function(e) {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing)
            return;

        var offsetRight = container.width() - (e.clientX - container.offset().left);

        left.css('right', offsetRight);
        right.css('width', offsetRight);
    }).on('mouseup', function(e) {
        // stop resizing
        isResizing = false;
    });

    function span() {
        left.css('right', '0px');
        right.css('width', '0px');
        $('.toggleRightBar').one('click', hide);
    }

    function hide() {
        left.css('right', '40%');
        right.css('width', '40%');
        $('.toggleRightBar').one('click', span);
    }
    $('.toggleRightBar').one('click', span);
});
