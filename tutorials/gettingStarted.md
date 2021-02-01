This tutorial assumes you are making a mod, however it's the same process for a module.

### Setup
To set up BUDM, require it in your userscript header
```js
// @require      https://github.com/boxcrittersmods/BUDM/raw/master/dist/BUDM.min.js
```
### Configuration
Configuration is done by adding parameters in the userscript header.
By default all options are automatically filled out.
```js
// BUDM.id        exampleMod
// BUDM.abbrev    EM
// BUDM.deps      moduleOne, moduleTwo, moduleThree
```
- `.id` - The name of your mod in camelText
- `.abbrev` - An abbreviation of the name of your mod
- `.deps` - A list of the modules neccecary for your mod

### Usage
These variables are used to interface with BUDM:
- *[Module](/Module.html)* `BUDM` - The entire BUDM library.
- *[Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)* `uWindow` - a reliable refererence to the window object (to deal with userscript sandboxing)
- *[Module](/Module.html)* `mod` - This object represents your mod, it's the way all other mods/modules access your mod. It contains information about your mod, any submodules for your mod, and is an **[EventHandler](/external-EventHandler.html)**. You can ignore this, but it's reccomended to use it to give information to other mods and allow them to do things with your mod.