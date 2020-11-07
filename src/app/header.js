// Fix menu header when scrolling 
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 65) {
        $("#logo").attr("src", "https://svgshare.com/i/REo.svg");
        $(".navbar").addClass("bg-light");
    } else {
        //remove the background property so it comes transparent again 
        $("#logo").attr("src", "https://svgshare.com/i/RCw.svg");
        $(".navbar").removeClass("bg-light");
    }
});