// Fix menu header when scrolling 
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 65) {
        $("#logo").attr("src", "/src/public/img/logo3.svg");
        $(".navbar").addClass("bg-light");
        $(".navbar").css('border-bottom', '1px solid #eee');
    } else {
        //remove the background property so it comes transparent again 
        $("#logo").attr("src", "/src/public/img/logo2.svg");
        $(".navbar").removeClass("bg-light");
        $(".navbar").css('border-bottom', 'none');
    }
});