function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

$(document).ready(function(){

    $('input:radio[name="choose-price-group"]').on('change', function(){
        $('.detail-payment-notice').hide();
        $('.transaction-detail').show();
        $('.qr-pay-wrapper').hide();

        let valRadio = $('input:radio[name="choose-price-group"]:checked').val()-0;

        let bonus = 0;

        $('#price-transaction').text(numberWithCommas(valRadio) + " đ");
        
        if(valRadio == 200000){
            bonus = 19999;
        }
        else if(valRadio == 500000){
            bonus = 49999;
        }
        else if(valRadio == 1000000){
            bonus = 99999;
        }
        else if(valRadio == 2000000){
            bonus = 199999;
        }
        else {
            bonus = 0;
        }

        $('#bonus-transaction').text("+ " + numberWithCommas(bonus) + " đ");

        $('#total-transaction').text(numberWithCommas(bonus + valRadio) + " đ");
    });


    let chosen = '';
    $('#viettel-otp').on('click', () => {
        chosen = 'viettel-otp';
        $('.qr-pay-wrapper').hide();
        $('#method-transaction').text("Viettel OTP");
        $('#model-method-label').text("You have chosen: Viettel OTP");
        $('#model-method-img').attr('src', '/src/public/img/viettel_otp.png')
    })

    $('#mobi-sms').on('click', () => {
        chosen = 'mobi-sms';
        $('.qr-pay-wrapper').hide();
        $('#method-transaction').text("Mobiphone SMS");
        $('#model-method-label').text("You have chosen: Mobiphone SMS");
        $('#model-method-img').attr('src', '/src/public/img/mobiphone-sms.png')
    })

    $('#vina-sms').on('click', () => {
        chosen = 'vina-sms';
        $('.qr-pay-wrapper').hide();
        $('#method-transaction').text("Vinaphone OTP");
        $('#model-method-label').text("You have chosen: Vinaphone SMS");
        $('#model-method-img').attr('src', '/src/public/img/vinasms.png')
    })

    $('#atm-ibanking').on('click', () => {
        chosen = 'atm-ibanking';
        $('.qr-pay-wrapper').hide();
        $('#method-transaction').text("ATM - Internet Banking");
        $('#model-method-label').text("You have chosen: ATM - Internet Banking");
        $('#model-method-img').attr('src', '/src/public/img/atm.png')
    })

    
    $('#qr-pay').on('click', () => {
        chosen = 'qr';
        $('#method-transaction').text("QR Pay");
        $('#model-method-label').text("You have chosen: Viettel OTP");
        $('#model-method-img').attr('src', '/src/public/img/qrpay.png')
        
    })

    $('#debit-card').on('click', () => {
        chosen = 'debit-card';
        $('.qr-pay-wrapper').hide();
        $('#method-transaction').text("Debit Card");
        $('#model-method-label').text("You have chosen: Debit Card");
        $('#model-method-img').attr('src', '/src/public/img/visa.png')
    })

    $('#btn-submit-payment').on('click', () => {
        // disable button
        $('#btn-submit-payment').prop("disabled", true);
        // add spinner to button
        $('#btn-submit-payment').html(
            `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...`
        );
      
        setTimeout(function(){
          /*submit the form after 5 secs*/
            if(chosen == 'qr'){
                $('.transaction-detail').hide();
                $('.qr-pay-wrapper').show();
            }
            
            $('#btn-submit-payment').prop("disabled", false);
            $('#btn-submit-payment').html(`Submit Your Payment`);
            
        },1300)

      
    })

});