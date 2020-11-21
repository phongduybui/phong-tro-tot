
$(document).ready(function(){
    $('input:radio[name="choose-price-group"]').on('change', function(){
        $('.detail-payment-notice').hide();
        $('.transaction-detail').show();
    });
});