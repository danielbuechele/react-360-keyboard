# react-360-keyboard

A react-360 keyboard for VR text input. With emoji-support and dictation for speech input.

## Adding to your react-360 application

In your `client.js` file you need to add the NativeModules to your instance and pass the instance to the module.

```js
import {Keyboard} from './react-360-keyboard';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    fullScreen: true,

    // 1.) add the NativeModule to your instance
    nativeModules: [Keyboard],

    ...options,
  });

  // 2.) pass the instance to the NativeModule, do this after creating your main
  //     surface to ensure the keyboard is rendered on top of your scene
  Keyboard(r360);
}
```

In your react-360 code, add the keyboard to the AppRegistry and show it:

```js
import {VrButton, NativeModules, AppRegistry} from 'react-360';

// 3.) register the Keyboard in your AppRegistry
import {registerKeyboard} from './react-360-keyboard';
AppRegistry.registerComponent(...registerKeyboard);

export default class MyVRApp extends React.Component {
  onClick() {
    // 4.) show the keyboard
    NativeModules.Keyboard.startInput({
      placeholder: 'Enter your name',
    }).then(input => console.log(input));
  }
  render() {
    return (
      <VrButton onClick={this.onClick}>
        <Text>Show Keyboard</Text>
      </VrButton>
    );
  }
}
```

## Configuration

| Property       | Type      | default     | Description                                                                                   |
| :------------- | :-------- | :---------- | :-------------------------------------------------------------------------------------------- |
| initialValue   | `string`  | `null`      | Initial value of the text field. This is useful for editing texts.                            |
| placeholder    | `string`  | `null`      | Placeholder text that is shown while no text is entered                                       |
| sound          | `boolean` | `true`      | Enable keyboard UI sound (e.g. keyboard clicks)                                               |
| emoji          | `boolean` | `true`      | Enable the emoji keyboad                                                                      |
| dictation      | `boolean` | `true`      | Allow dictation as input method. Not available in all clients. Works with Chrome and Firefox. |
| returnKeyLabel | `string`  | `'Return'`  | Label for the button that finishes input and hides the keyboard                               |
| tintColor      | `string`  | `'#81D9FD'` | Color of the letters on the keyboard                                                          |
