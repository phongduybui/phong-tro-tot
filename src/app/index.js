$(function(){
    let provinceOption;
    let districtOption;
    let wardOption;
    let firstTime = 1;
    $.getJSON('src/app/json/province.json', function(result){
        $.each(result, function(i, province){
            //<option value="province.id">pronvice.name</option>
            if(firstTime==1){
                provinceOption += `<option>Province / City</option>`;
                firstTime = 2;
            }
            provinceOption += `<option value="${province.id}">${province.name}</option>`;
        });
        $('#province').html(provinceOption);
    });
    $("#province").on('change', function(){
        districtOption = '';
        $('#ward').html('`<option>Ward</option>`');
        let provinceId = $(this).val();
        $.getJSON('src/app/json/district.json', function(result){
            $.each(result, function(i, district){
                if(firstTime==2){
                    districtOption += `<option>District</option>`;
                    firstTime = 3;
                }
                if(provinceId == district.tinh_id){
                    districtOption += `<option value="${district.id}">${district.name}</option>`;
                } 
            });
            $('#district').html(districtOption);
        });
    });

    $("#district").on('change', function(){
        wardOption = '';
        let districtId = $(this).val();
        $.getJSON('src/app/json/ward.json', function(result){
            $.each(result, function(i, ward){
                if(firstTime==3){
                    wardOption += `<option>Ward</option>`;
                    firstTime = 4;
                }
                if(districtId == ward.huyen_id){
                    wardOption += `<option value="${ward.id}">${ward.name}</option>`;
                } 
            });
            $('#ward').html(wardOption);
        });
    });
});

// Button Scroll
$(document).ready(function (){
    $(".chevron").click(function (){
        $('html, body').animate({
            scrollTop: $(".map-search").offset().top
        }, 1070);
    });
});


const slideValue = document.querySelector(".area-span");
const inputSlider = document.querySelector(".area-input");
inputSlider.oninput = (() => {
    let value = inputSlider.value;
    slideValue.textContent = value;
    slideValue.style.left = (value / 2) + "%";
    slideValue.classList.add("show");
});
inputSlider.onblur = (() => {
    slideValue.classList.remove("show");
});


$(document).ready(function(){
    $('.top__map-1').click(function(event) {
        $('.map-detail-1').css('display', 'block');
    });
    $('.map-back-1').click(function(event) {
        $('.map-detail-1').css('display', 'none');
    });
    $('.top__map-2').click(function(event) {
        $('.map-detail-2').css('display', 'block');
    });
    $('.map-back-2').click(function(event) {
        $('.map-detail-2').css('display', 'none');
    });
    $('.top__map-3').click(function(event) {
        $('.map-detail-3').css('display', 'block');
    });
    $('.map-back-3').click(function(event) {
        $('.map-detail-3').css('display', 'none');
    });
    $('.top__map-4').click(function(event) {
        $('.map-detail-4').css('display', 'block');
    });
    $('.map-back-4').click(function(event) {
        $('.map-detail-4').css('display', 'none');
    });
    $('.top__map-5').click(function(event) {
        $('.map-detail-5').css('display', 'block');
    });
    $('.map-back-5').click(function(event) {
        $('.map-detail-5').css('display', 'none');
    });
    $('.top__map-6').click(function(event) {
        $('.map-detail-6').css('display', 'block');
    });
    $('.map-back-6').click(function(event) {
        $('.map-detail-6').css('display', 'none');
    });

    $('.top__map-7').click(function(event) {
        $('.map-detail-7').css('display', 'block');
    });
    $('.map-back-7').click(function(event) {
        $('.map-detail-7').css('display', 'none');
    });
    $('.top__map-8').click(function(event) {
        $('.map-detail-8').css('display', 'block');
    });
    $('.map-back-8').click(function(event) {
        $('.map-detail-8').css('display', 'none');
    });
    $('.top__map-9').click(function(event) {
        $('.map-detail-9').css('display', 'block');
    });
    $('.map-back-9').click(function(event) {
        $('.map-detail-9').css('display', 'none');
    });
    $('.top__map-10').click(function(event) {
        $('.map-detail-10').css('display', 'block');
    });
    $('.map-back-10').click(function(event) {
        $('.map-detail-10').css('display', 'none');
    });
    $('.top__map-11').click(function(event) {
        $('.map-detail-11').css('display', 'block');
    });
    $('.map-back-11').click(function(event) {
        $('.map-detail-11').css('display', 'none');
    });

    

    $('.card-title-top__heart').on('click', function(e){
        e.preventDefault();
        //notification dialog
        bs4pop.notice('Added to favorites !', {
            type: 'info', 
            position: 'bottomright', 
            // append, prepend
            appendType: 'append', 
            // shows close button
            closeBtn: false,
            // auto dismisses after 2 seconds
            autoClose: 2000,
            // CSS class
            className: ''

        });
    });
});



