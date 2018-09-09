# react-360-keyboard

A react-360 keyboard for VR text input. With emoji-support and dictation for speech input.

![alt text](https://raw.githubusercontent.com/danielbuechele/react-360-keyboard/master/demo.gif)

Because react-360 itself doesn't offer any text inputs, I created this keyboard. The keyboard can be triggered via a [NativeModule](https://facebook.github.io/react-360/docs/native-modules.html) and is shown on a flat surface that is added on top of the scene. The user can type using any controller supported by `<VrButton>`. Emoji input is possible using [twemoji](https://github.com/twitter/twemoji). In browsers supporting the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) dictation allows the user to enter the text via speech.

## Try

Check out the [demo](https://danielbuechele.github.io/react-360-keyboard/) of the keyboard.

## Usage

In your `client.js` file you need to add the NativeModules and pass the instance to the module.

```js
import KeyboardModule from 'react-360-keyboard/KeyboardModule';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    fullScreen: true,

    // 1.) add the NativeModule to your instance
    nativeModules: [KeyboardModule.addModule],

    ...options,
  });

  // 2.) pass the instance to the NativeModule, do this after creating your main
  //     surface to ensure the keyboard is rendered on top of your scene
  KeyboardModule.setInstance(r360);
}
```

In your react-360 code, add the keyboard to the AppRegistry and call `NativeModules.Keyboard.startInput` to show it. A promise is returned that resolves with the text entered by the user.

```js
import {VrButton, NativeModules, AppRegistry} from 'react-360';

// 3.) register the Keyboard in your AppRegistry
import {registerKeyboard} from 'react-360-keyboard';
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

The keyboard can be configured by passing an object when starting the input.

```js
NativeModules.Keyboard.startInput(config?: {
  initialValue?: string,
  placeholder?: string,
  sound?: boolean,
  emoji?: boolean,
  dictation?: boolean,
  returnKeyLabel?: string,
  tintColor?: string,
}): Promise<?string>
```

| Property       | Type      | default     | Description                                                                              |
| :------------- | :-------- | :---------- | :--------------------------------------------------------------------------------------- |
| initialValue   | `string`  | `null`      | Initial value of the text field. This is useful for editing texts.                       |
| placeholder    | `string`  | `null`      | Placeholder text that is shown while no text is entered                                  |
| sound          | `boolean` | `true`      | Enable keyboard UI sound (e.g. keyboard clicks)                                          |
| emoji          | `boolean` | `true`      | Allow emoji input                                                                        |
| dictation      | `boolean` | `true`      | Allow speech to text input. Not available in all clients. Works with Chrome and Firefox. |
| returnKeyLabel | `string`  | `'Return'`  | Label for the button that submits the input and hides the keyboard                       |
| tintColor      | `string`  | `'#81D9FD'` | Color of the letters on the keyboard                                                     |
