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