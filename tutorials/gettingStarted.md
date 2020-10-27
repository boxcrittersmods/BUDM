# Getting Started
To get started you need to first require UPI in your userscript header
```js
// @require      https://cdn.jsdelivr.net/gh/boxcrittersmods/UPI@latest/dist/UPI.min.js
```

Once you have done that you will also need to setup the configoration of UPI also in the userscript header. (`.abbrev` is optional)
```js
// UPI.id        simpleMod
// UPI.abbrev    SM
```
## Global Vriables
once you have done all that you will then be treated to 3 global variables
- `UPI` - This entire library
- `uWindow` - a reliable refererence to the window object that deals with things like `@grant none`
- `mod` - this object represents your mod/modual and it also acts like the `module.exports` from node.js where what ever you assign to it, any mods that depend on your modual will be able to access.

## Dependencies
want to use an bc modding api that someone else made.
add this to your userscript header
```js
// UPI.deps      [modIds]
```
`modIDs`  - a comma sepperated list of the ids of mods you would like to depend on