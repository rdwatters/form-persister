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
                
                // converts selected option text to css class
                formGroupClass = "".concat('.group-', chosenOption.toLowerCase().replace(' ', '-')),
                
                // list of form group classes
                formGroups = [".group-something-else", ".group-new-business", ".group-careers"];
                
                // change display text of option dropdown to the selected option
                document.querySelector('span.dropp-header__title.js-value').textContent = chosenOption;
                
                // grab the two form blocks that show regardless of option, and set aria attribute    
                document.querySelectorAll('.form-block, .info-group-1').forEach(function(block) {
                block.style.display = "block";
                block.setAttribute("aria-hidden","false");

            });

            // Iterate through form group classnames in above array
            for (var k = 0; k < formGroups.length; k++) {
                
                // Hide the form groups if they weren't selected 
                if (formGroups[k] !== formGroupClass) {
                    document.querySelector(formGroups[k]).style.display = "none";
                    document.querySelector(formGroups[k]).setAttribute("aria-hidden", "true");
                }

                // If chosen, show it, update aria 
                else {
                    document.querySelector(formGroups[k]).style.display = "block";
                    document.querySelector(formGroups[k]).setAttribute("aria-hidden", "false");
                }
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

    // If this is a returning visitor, auto-fill inputs from localStorage
    if (hasVisited) {
        autofillInputs(formInputs);
    }
    
    // Function to auto-complete inputs
    function autofillInputs(inputs) {
        inputs.forEach(function(item) {
            // Note this requires a unique ID for each input; you can do this on the client withe assignInputIDs config option
            var specificInput = document.getElementById(item.id);

            // Fill in inputs, but check to make sure they aren't checkboxes or submit buttons
            if ((localStorage.getItem(item.id)) && ((specificInput.type != "submit") && (specificInput.type != "checkbox"))) {
                specificInput.value = localStorage.getItem(item.id);

                // Add class to 3-d transform placeholder text
                specificInput.classList.add('has-value');
            }
        })
    }
};

// Instantiate FormPersister
var contactForm = new FormPersister({
    inputSelector: ".form input, .form textarea",
    addDropdown: true,
    formSelector: ".form",
    disableAutocomplete: true
});
