# Testing `form-persister.js` with RP Contact Form

## Notes

Most modern browsers will [`autocomplete`][auto] certain information for form inputs. In order to make the `form-persister.js` work, you'll need add the `autocomplete` attribute to the `<form>` element:

```html
<form class="form" data-parsley-validate="" autocomplete="off">
```

## UX Considerations for Requested Behavior

Before implementing this script, it's probably worth talking with UX re: whether this is an optimal experience for end users who leverage this functionality frequently. The input fields being used for the RP contact form are typical of those found in either the browser's default `autocomplete` behavior or in user profiles (e.g. Keychain for OSX/iOS, Chrome autocomplete, etc):

* First Name
* Last Name
* Email
* Phone Number

All of the following values map back to basic contact information stored in an end user's device. If you are an iPhone user, you can see this behavior in the wild by visiting <https://www.rightpoint.com/company/contact> and opening the modal form.

![Screenshot of autocomplete functionality on iOS that pulls from the user's contact information](./temp-img/iphone-screenshot.png)

The script included in this repo leverages the HTML5 [`localStorage`][ls] API, which has the advantage of persisting across sessions but will still be deleted when a user clears their history and cache. The default browser behavior mentioned above will, naturally, persist across sessions, domains, and even after a user clears the browser cache and cookies. 



[auto]: https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
[ls]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
