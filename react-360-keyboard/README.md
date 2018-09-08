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
    NativeModules.Keyboard.startInput('Placeholder text').then(input =>
      console.log(input),
    );
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
