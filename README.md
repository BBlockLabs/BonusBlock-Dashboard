
ALTER - ALTER Network
=============

# Table of Contents

1. [Project setup](#project-setup)
2. [Comments, advices, random information](#comments-advices-random-information)
3. [SPA and nginx configuration](#spa-and-nginx-configuration)
4. [Code style and development approach](#code-style-and-development-approach)
5. [Random thoughts in no particular order](#random-thoughts-in-no-particular-order)

## Project setup

```
npm install
```

### Compile and run locally on port 8081

```
npm run serve
```

### Compile for pre-production with debug symbols/information

```
npm run buildDebug
```

### Compile for the production

```
npm run build
```

# Comments, advices, random information
## SPA and nginx configuration

UI is designed to be Single-Page application without Serve-Side Rendering addon. That means it can be run using any
static-serving HTTP server (nginx will be in use on production). Due to "history" plugin usage nature additional
configuration must be added to conform URL handling by index.html entrypoint. For nginx that would be

```
location / {
    try_files $uri $uri/ /index.html;
}
```

## Code style and development approach
First and foremost rule: whenever something is not mentioned here &mdash; continue existing code style whenever possible
to reduce refactoring/code review time. If something does not adhere these guidelines - reformat the code accordingly
(preferably in a separate commit).

Configure IntelliJ IDEA (or any other (sic!) IDE) to follow the same standard of line indents and code-formatting rules.
You should induce zero changes when performing "reformat whole file" action on a newly-fetched Git file. Ask your team
members for `settings.jar` file with all relevant code style configuration settings for IDEA.

### Random thoughts in no particular order

* Be familiar with existing frameworks/libraries/dependencies in the project, identify benefits of using them. For
  example, there is `debounce` library to throttle JS method calls (like only once per N seconds),
  and `vue-template-babel-compiler` that provides Optional Chaining(`?.`), Nullish Coalescing(`??`) etc.
* There are two types of pages - always-available (like `/` or `/login`), and auth-required (every other page). All
  other pages must wait until `/auth/getStatus` will fetch current user profile. Do not use `mounted()` for data
  auto-fetch, eg. to populate mail list, wait in `watch{}` for `userDataFetched` variable, that is defined in
  `$store.state` will be `true` first.
* axios .catch() is performed 2 times - once for .catch() in actual axios.get()/.post() call, and also for interceptor.
  It surely is possible to postpone interceptor .catch() resolution by passing `customErrorHandler` param in
  axios config:
  ```
  this.$http.post(
    url,
    postObject,
    {
      customErrorHandler: true
   })
  .then(ret => { magic(ret); })
  .catch(err=>truErrorHandler(err));
  ```
* Remember, that vue-router configuration (`src/router/router-config.js`) does not have global `this` that is pointing
  to the current Vue instance.
* It is possible to let children pages to "project" their views/renders into parent by using separate `router-view` tag.
    * There is also [Portal-Vue](https://github.com/LinusBorg/portal-vue) library, which is currently not in use.
* When creating children pages, make sure that "back" button is handled properly and user still can navigate back/forth
  using web browser buttons. Especially this applies to all modals like /register, /mail/compose, etc.
* If you see your browser behaves strangely during your debug sessions - probably it is browser's fault, not yours.
  Firefox in particular cannot handle long single-tab sessions without restarts, so restart your browser after 2-3 hours
  of debugging.
* There are `@formatter:off` and `@formatter:on` directives in IntelliJ to designate non-formattable blocks. Use with care!
    * Do not reformat "data-driven"-files, like `src/common/fontawesome.js`, its easier to use them in current state.
* Use (adequate) full names for variables/methods:
    * Bad: `pubKey`, good: `publicKey`
    * Bad: `fixKey`, good: `convertBase64ToByteBuffer`
    * Bad: `i++`, good: `totalCount++`. `i` as an array index iterator is surely fine.
* It is possible to get current Bootstrap breakpoint with `$mq` (at this moment we should be concerned only about two
  sizes - `$mq.lg` screens, and everything smaller - `!$mq.lg`, considered as mobile).
* SVG images should be directly embedded into HTML. In that case you can change colors of the strokes/fills in SVG from
  the CSS by applying `text-XXX` classes. Do NOT use `<img src.../>`, it wont be shown on the screen due to WebPack
  processor. Prepend imported SVG component names with `SVG`.
* They promised the reactivity was finally fixed. You can even add new properties to objects dynamically. But in case if
  some variable is not reactive, declare this variable with ref().
* You can use
  * `<!--remove-on-prod-->`SOMETHING`<!--/remove-on-prod-->` for HTML and
  * `/*remove-on-prod*/`SOMETHING`/*/remove-on-prod*/` for JS

  custom comments to strip SOMETHING from the PROD environment resulting files (LOCAL/DEV/STAGING will remain intact).
