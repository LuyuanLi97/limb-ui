$(".dropdown").hover(
    function() {
        $(this).addClass("open");
    },
    function() {
        $(this).delay(8000).removeClass("open");
    }
);
