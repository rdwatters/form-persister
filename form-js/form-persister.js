"use strict";

// Quick polyfill for browsers that don't support forEach on node lists (namely, IE11)
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}


var FormPersister = function() {

    //Check to see if user has been to page and filled out at least one input
    var hasVisited = (localStorage.getItem('hasVisited') !== null);
    
    /*CONFIGURATION BEGIN*/
    //Define option defaults
    var defaults = {
        inputSelector: "input, textarea",
        formSelector: "form",
        assignInputIds: false,
        addDropdown: false,
        disableAutocomplete: false
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    // Assign all form inputs to a Nodelist
    var formInputs = document.querySelectorAll(defaults.inputSelector);

    // Assign form to first form denoted in config
    var form = document.querySelector(defaults.formSelector);

    // Disable autocomplete attribute to formSelector
    if (defaults.disableAutocomplete) {
        form.setAttribute('autocomplete', 'off');
    }

    // Adds html IDs to each input on pageload
    if (defaults.assignInputIds) {
        for (var i = 0; i < formInputs.length; i++) {
            formInputs[i].id = "input-id-" + i;
        }
    }

    // NOTE: addDropdown is very specific to this form; therefore the default is set to *not* include the following code to try and keep FormPersister as reusable as possible
    if (defaults.addDropdown) {
        var dropdownInputs = document.querySelectorAll('input[name="dropp"]');
        for (var j = 0; j < dropdownInputs.length; j++) {
            dropdownInputs[j].addEventListener('click', function(evt) {
                var selectedForm = evt.target.value;
                localStorage.setItem('selectedForm', selectedForm);
            }, false);
        }

        // Check to see if both the "Dropp" down is configured to true and that the end user has already selected a option from the list
        if (localStorage.getItem('selectedForm') !== null) {
            var chosenOption = localStorage.getItem('selectedForm'),
                formGroup = "".concat('.group-', chosenOption.toLowerCase().replace(' ', '-'));
            document.querySelector('span.dropp-header__title.js-value').textContent = chosenOption;
            document.querySelector('.form-block').style.display = "block";
            document.querySelector('.form-block .info-group-1').style.display = "block";
            document.querySelector(formGroup).style.display = "block";
            if (chosenOption == "New Business") {
                document.querySelector('.form-block .group-careers').style.display = "none";
                document.querySelector('.form-block .group-something-else').style.display = "none";
            } else if (chosenOption == "Careers") {
                document.querySelector('.form-block .group-something-else').style.display = "none";
                document.querySelector('.form-block .group-new-business').style.display = "none";
            } else if (chosenOption == "Something Else") {
                document.querySelector('.form-block .group-new-business').style.display = "none";
                document.querySelector('.form-block .group-new-careers').style.display = "none";
            }
        }
    }
    /*CONFIGURATION END*/


    // Add blur event to the entire form
    form.addEventListener('blur', function(event) {

        // Grab input's ID and value once the input no longer has focus
        var inputId = event.target.id,
            inputValue = event.target.value;

        // Tell localStorage the visitor has now visited at least once and filled out at least one input
        localStorage.setItem("hasVisited", true);

        // Set key-value in localStorage based on input ID and value
        localStorage.setItem(inputId, inputValue);
    }, true);


    if (hasVisited) {
        autofillInputs(formInputs);
    }

    function autofillInputs(inputs) {
        inputs.forEach(function(item) {
            var specificInput = document.getElementById(item.id);
            if ((localStorage.getItem(item.id)) && ((specificInput.type != "submit") && (specificInput.type != "checkbox"))) {
                specificInput.value = localStorage.getItem(item.id);
                specificInput.classList.add('has-value');
            }
        })
    }
};

var contactForm = new FormPersister({
    inputSelector: ".form input, .form textarea",
    addDropdown: true,
    formSelector: ".form",
    disableAutocomplete: true
});
