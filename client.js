// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {Math as VRMath, ReactInstance, Surface} from 'react-360-web';
import KeyboardModule from './react-360-keyboard/KeyboardModule';
import WebVRPolyfill from 'webvr-polyfill';
const polyfill = new WebVRPolyfill();

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [KeyboardModule.addModule],
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('Keyboard360', {
      /* initial props */
    }),
    r360.getDefaultSurface(),
  );
  r360.compositor.setBackground(r360.getAssetURL('360_world.jpg'));

  KeyboardModule.setInstance(r360);
}

window.React360 = {init};
