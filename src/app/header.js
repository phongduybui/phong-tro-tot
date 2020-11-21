// Fix menu header when scrolling 
$(document).ready(function() {
    $('li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active'); 
});

$(window).on("scroll", function () {
    if($("#homepage-flag").length > 0){
        if ($(window).scrollTop() > 65) {
            $("#logo").attr("src", "/src/public/img/logo3.svg");
            $(".navbar").addClass("bg-light");
            $(".navbar").css('box-shadow', '0px 0px 15px 0px rgba(0,0,0,0.1)');
        } else {
            //remove the background property so it comes transparent again 
            $("#logo").attr("src", "/src/public/img/logo2.svg");
            $(".navbar").removeClass("bg-light");
            $(".navbar").css('box-shadow', 'none');
        }
    }
});