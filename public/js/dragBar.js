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
});
