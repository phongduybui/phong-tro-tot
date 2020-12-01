
//Form tab smart wizard 

$(document).ready(function () {
    $('#smartwizard').smartWizard({
        selected: 0, // Initial selected step, 0 = first step
        theme: 'default', // theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        darkMode: false, // Enable/disable Dark Mode if the theme supports. true/false
        autoAdjustHeight: true, // Automatically adjust content height
        cycleSteps: false, // Allows to cycle the navigation of steps
        backButtonSupport: true, // Enable the back button support
        enableURLhash: true, // Enable selection of the step based on url hash
        transition: {
            animation: 'none', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
            speed: '400', // Transion animation speed
            easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
        },
        toolbarSettings: {
            toolbarPosition: 'bottom', // none, top, bottom, both
            toolbarButtonPosition: 'right', // left, right, center
            showNextButton: true, // show/hide a Next button
            showPreviousButton: true, // show/hide a Previous button
            toolbarExtraButtons: [
                $('<button></button>').text('Submit').addClass('btn btn-danger submit-post-form').attr('type', 'submit')
                // on('click', function () {
                //     alert("Payment successful!");
                // })
            ] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
        },
        anchorSettings: {
            anchorClickable: true, // Enable/Disable anchor navigation
            enableAllAnchors: false, // Activates all anchors clickable all times
            markDoneStep: true, // Add done state on navigation
            markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
            enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
        },
        keyboardSettings: {
            keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            keyLeft: [37], // Left key code
            keyRight: [39] // Right key code
        },
        lang: { // Language variables for button
            next: 'Next',
            previous: 'Previous'
        },
        disabledSteps: [], // Array Steps disabled
        errorSteps: [], // Highlight step with errors
        hiddenSteps: [] // Hidden steps
    });


    $('.sw-btn-next').on('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })

    $('.sw-btn-prev').on('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })



    // $(".submit-post-form").prop('disabled', true);
    // let stepIndex;
    // $(".sw-btn-next").on('click', function () {
    //     stepIndex = $('#smartwizard').smartWizard("getStepIndex");

    //     if (stepIndex == 4) {
    //         $(".submit-post-form").prop('disabled', false);
    //     }
    //     else {
    //         $(".submit-post-form").prop('disabled', true);
    //     }
    // })

    // $(".sw-btn-prev").on('click', function () {
    //     stepIndex = $('#smartwizard').smartWizard("getStepIndex");

    //     if (stepIndex == 4) {
    //         $(".submit-post-form").prop('disabled', false);
    //     }
    //     else {
    //         $(".submit-post-form").prop('disabled', true);
    //     }
    // })
});



/* Show Payment Visa Card */
$(document).ready(function() {
    $('input[name=radio-choose-method-payment]').on('change', function(e) {
        console.log(11);
        if($('input[name=radio-choose-method-payment]:checked').val() == "2"){
            $(".payment-visacard-wrapper").show();
            $(".payment-system-account").hide();
        }
        else {
            $(".payment-visacard-wrapper").hide();
            $(".payment-system-account").show();
            
        }
        
     });
    
});
/* Show Payment Visa Card */


/*Get address*/
$(document).ready(function() {
   let province = "";
   let district = "";
   let ward = "";;
   let street = "";
   let apartmentNumber = "";
   let address = "";
   $("#province").on('change', function(){
        province = $( "#province option:selected" ).text();
        address = `${apartmentNumber}${street}${ward}${district}${province}`;
        $("#full-address").val(address);
   });

   $("#district").on('change', function(){
        district = $( "#district option:selected" ).text() + ", ";
        address = `${apartmentNumber}${street}${ward}${district}${province}`;
        $("#full-address").val(address);
    });

    $("#ward").on('change', function(){
        ward = $( "#ward option:selected" ).text() + ", ";
        address = `${apartmentNumber}${street}${ward}${district}${province}`;
        $("#full-address").val(address);
    });

    $("#street").on('change', function(){
        street = $( "#street" ).val() + ", ";
        address = `${apartmentNumber}${street}${ward}${district}${province}`;
        $("#full-address").val(address);
    });

    $("#apartmentNumber").on('change', function(){
        apartmentNumber = $( "#apartmentNumber" ).val() + " ";
        address = `${apartmentNumber}${street}${ward}${district}${province}`;
        $("#full-address").val(address);
    });
    
});
/*Get address*/

/* Function convert number to number with commas */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* Get total of money */
$(document).ready(function() {
    let unitPrice = 0;
    let timeNews = 0;
    let priceNumber;
    let optionPackage = $("#package-news option:selected").val();
    let remainAmount;
    calculateTotal();

    function calculatePayment(){
        $("#amount-pay").text($("#total-money").text());
        $(".paid-amount-value").text(priceNumber+" đ");
        let existAmount = $(".exist-amount-value").text() - 0;
        remainAmount = existAmount - priceNumber;
        $(".remain-amount-value").text(remainAmount + " đ");

        $('input[name=radio-choose-method-payment]').on('change', function(e) {
            if(remainAmount < 0 && $('input[name=radio-choose-method-payment]:checked').val() == "1")
            {
                $(".info-amount-account-item-warning").show();
            }
            else {
                $(".info-amount-account-item-warning").hide();
            }
        });
    }

    function calculateTotal(){
        $("#package-news").on('change', function(){
            optionPackage = $("#package-news option:selected").val();
            $("#type-pricing-package").text($( "#package-news option:selected" ).text()+"s (*)")
            calculateTotal();
        })
        if(optionPackage === "week"){
            priceNumber = timeNews*unitPrice*0.9*7;
        }
        else if(optionPackage === "month"){
            priceNumber = timeNews*unitPrice*0.8*30;
        }
        else {
            priceNumber = timeNews*unitPrice;
        }
        $("#total-money").text(numberWithCommas(priceNumber)+" đ");
        calculatePayment();
    }

    $("#time-news").on('input', function(){
        timeNews = $("#time-news").val();
        calculateTotal();
    });

    $("#normal-package").on('click',function(){
        $("#kind-news").val("Normal");
        $(".into-money-title").css('background-color', '#C64545');
        unitPrice = 2000;
        calculateTotal();
    })

    $("#vip-package").on('click',function(){
        $("#kind-news").val("Vip");
        $(".into-money-title").css('background-color', '#2D5772');
        unitPrice = 20000;
        calculateTotal();
    })

    $("#special-package").on('click',function(){
        $("#kind-news").val("Special");
        $(".into-money-title").css('background-color', '#5BA95D');
        unitPrice = 30000;
        calculateTotal();
    })

    // function commaSeparateNumber(val){
    //     while (/(\d+)(\d{3})/.test(val.toString())){
    //       val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    //     }
    //     return val;
    //   }
    // $('#price-input').on('input', function(){
    //     let temp = this.value.split(',').join('') - 0;
    //     this.value = commaSeparateNumber(temp);
     
    // });
  
})



/* Get total of money */