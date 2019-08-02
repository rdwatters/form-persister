// Form Dropdown  
$(document).ready(function() {


    $(function() {
        $('form.form').parsley().on('field:validated', function() {
                var ok = $('.parsley-error').length === 0;
                $('.bs-callout-info').toggleClass('hidden', !ok);
                $('.bs-callout-warning').toggleClass('hidden', ok);
            })
            .on('form:submit', function() {
                return false; // Don't submit form for this demo
            });
    });


    // Default dropdown action to show/hide dropdown content

    $('.dropp-header').click(function(e) {
        e.preventDefault();
        $('.js-dropp-action').toggleClass('js-open');
        $('.dropp-body').toggleClass('js-open');
    });

    // Using as fake input select dropdown
    $('label').click(function() {
        $(this).addClass('js-open').siblings().removeClass('js-open');
        $('.dropp-body,.js-dropp-action').removeClass('js-open');
    });

    // get the value of checked input radio and display as dropp title
    $('input[name="dropp"]').change(function() {
        var value = $("input[name='dropp']:checked").val();
        $('.js-value').text(value);

        if (value == "New Business") {
            $(".form-block").show();
            $(".form-block .info-group-1").show();
            $(".form-block .group-new-business").show();
            $(".form-block .group-careers").hide();
            $(".form-block .group-something-else").hide();
        } else if (value == "Careers") {
            $(".form-block").show();
            $(".form-block .info-group-1").show();
            $(".form-block .group-something-else").hide();
            $(".form-block .group-new-business").hide();
            $(".form-block .group-careers").show();
        } else if (value == "Something Else") {
            $(".form-block").show();
            $(".form-block .info-group-1").show();
            $(".form-block .group-new-business").hide();
            $(".form-block .group-careers").hide();
            $(".form-block .group-something-else").show();
        }

    });

});


// Radio Buttons
$(function() {
    $('.form .input-group input').focusout(function() {
        var text_val = $(this).val();
        if (text_val === "") {
            $(this).removeClass('has-value');
        } else {
            $(this).addClass('has-value');
        }

    });
});


(function($) {

    $(document).ready(function() {

        // From Validation 
        var parsleyInstance = $('form.form').parsley();

        var parsleyConfig = {
            errorsContainer: function(pEle) {
                var $err = pEle.$element.siblings('.errorBlock');
                console.log($err);
                return $err;
            }
        }
        var $parsley = $('form.form').parsley(parsleyConfig);
        $parsley.parsley({ trigger: "change keyup" });

        // Custom Validation errors messages for Parsley

        Parsley.addMessages('da', {
            type: {
                email: "Please enter a valid email address.",
            },
            required: "An email is required.",
        });

        Parsley.setLocale('da');

    });

    window.onload = function() {
        $('.loader__text').addClass('active');
    }


})(jQuery);
