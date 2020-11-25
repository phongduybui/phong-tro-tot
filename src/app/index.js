
//Script for news card
$(document).ready(function(){
    $('.btn-map').click(function(event) {
        $('.map-on-detail-page').css('display', 'block');
    });
    
    $('.map-back').click(function(event) {
        $('.map-on-detail-page').css('display', 'none');
    });


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

