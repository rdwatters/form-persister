﻿$.fn.enterpress = function (f) {
    return this.each(function () {
        $(this).keypress(function (e) {
            var code = (e.which) ? e.which : e.keyCode;
            if (code === 13) {
                e.preventDefault();
                f();
            }
        });
    });
}

$(document).ready(function () {
    var searchBox = $("input.navbar__search-bar__input");

    var searchPageUrl = $('#searchPageUrl').val();    

    searchBox.enterpress(function () {        
        directSearch(searchBox);
    });

    function directSearch(ele) {
        if (ele.length > 0) {            
            var val = ele.val();            
            if (val !== "") {
                if (searchPageUrl != undefined) {                    
                    window.location = searchPageUrl + val;
                }
                else {                    
                    window.location = '/search/' + val;
                }
            }
        }
    }
});

// Pager js for window scroll
$(window).on('load', function () {
    var hashValue = window.location.hash;
    if (hashValue !== "") {
        var target = $(hashValue);
        if (target.length) {
            var top = target.offset().top;
            $('html,body').animate({ scrollTop: top });
            return false;
        }
    }
});
