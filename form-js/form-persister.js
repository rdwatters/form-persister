"use strict";

// Quick polyfill for browsers that don't support forEach on node lists (i.e. IE11)
// See here: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
// if (window.NodeList && !NodeList.prototype.forEach) {
//     NodeList.prototype.forEach = function(callback, thisArg) {
//         thisArg = thisArg || window;
//         for (var i = 0; i < this.length; i++) {
//             callback.call(thisArg, this[i], i, this);
//         }
//     };
// }


var FormPersister = function() {

    //Check to see if user has been to page and filled out at least one input
    var hasVisited = (localStorage.getItem('hasVisited') !== null);

    //Define option defaults
    var defaults = {
        inputSelector: "input, textarea",
        formSelector: "form",
        assignInputIds: false
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

    // Add blur event to the entire form
    form.addEventListener('blur', function(event) {

        // Grab input's ID and value
        var inputId = event.target.id,
            inputValue = event.target.value;

        // Tell localStorage the visitor has now visited at least once and filled out at least one input
        localStorage.setItem("hasVisited", true);

        // Set key-value in localStorage based on input ID and value
        localStorage.setItem(inputId, inputValue);
    }, true);

    // Adds html IDs to each input on pageload
    if (defaults.assignInputIds) {
        for (var i = 0; i < formInputs.length; i++) {
            formInputs[i].id = "input-id-" + i;
        }
    }
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

var formPersist = new FormPersister({
    inputSelector: ".form input, .form textarea",
    assignInputIds: false
});
