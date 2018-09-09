import {Module, Math as VRMath, Surface} from 'react-360-web';

import type {ReactInstance} from 'react-360-web';
import type {Config} from './Keyboard';
type ResolverID = number;
type Context = any;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

class KeyboardModule extends Module {
  constructor(ctx: Context) {
    super('Keyboard');
    this.dictationAvailable = Boolean(window.SpeechRecognition);
    this._surface = new Surface(700, 350, Surface.SurfaceShape.Flat);
    this._ctx = ctx;
  }

  _frameHook() {
    const cameraDirection = [0, -0.41, -1];
    const cameraQuat = this._instance.getCameraQuaternion();
    VRMath.rotateByQuaternion(cameraDirection, cameraQuat);
    const cx = cameraDirection[0];
    const cy = cameraDirection[1];
    const cz = cameraDirection[2];
    const horizAngle = Math.atan2(cx, -cz);
    const vertAngle = Math.asin(cy / Math.sqrt(cx * cx + cy * cy + cz * cz));
    this._surface.setAngle(horizAngle, vertAngle);
  }

  _setInstance(instance: ReactInstance) {
    this._instance = instance;

    // TODO: persist existing frame hooks
    instance._frameHook = this._frameHook.bind(this);
    instance.renderToSurface(this._instance.createRoot('KeyboardPanel'), this._surface);
  }

  $startDictation(resolveID: ResolverID, rejectID: ResolverID) {
    this._dictationResolver = resolveID;
    this._recognition = new window.SpeechRecognition();
    // var speechRecognitionList = new window.SpeechGrammarList();
    // speechRecognitionList.addFromString(grammar, 1);
    // recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    this._recognition.lang = 'en-US';
    this._recognition.interimResults = false;
    this._recognition.maxAlternatives = 1;

    this._recognition.onresult = event => {
      console.log(event.results);
      this._ctx.invokeCallback(resolveID, [event.results[0][0].transcript]);
    };

    this._recognition.onspeechend = () => {
      this._recognition.stop();
    };

    this._recognition.onnomatch = event => {
      console.log('onnomatch', event);
      this._ctx.invokeCallback(rejectID, []);
    };

    this._recognition.onerror = event => {
      this._ctx.invokeCallback(rejectID, []);
      console.log('onerror', event);
    };

    this._recognition.start();
  }

  $stopDictation() {
    if (this._recognition) {
      this._recognition.stop();
      this._recognition = null;
    }
  }

  $startInput(config: Config, resolveID: ResolverID) {
    if (this._inputResolver) {
      // keyboard already shown
      return;
    }
    this._inputResolver = resolveID;
    if (this._onShowResolver) {
      this._ctx.invokeCallback(this._onShowResolver, [config]);
    }
  }

  $endInput(value: string, resolveID: ResolverID) {
    this._ctx.invokeCallback(resolveID, []);
    if (this._inputResolver) {
      this._ctx.invokeCallback(this._inputResolver, [value]);
      this._inputResolver = null;
    }
  }

  $waitForShow(resolveID: ResolverID) {
    this._onShowResolver = resolveID;
  }
}

let module;

export default {
  addModule: (ctx: Context) => {
    module = new KeyboardModule(ctx);
    return module;
  },
  setInstance: (instance: ReactInstance) => {
    module._setInstance(instance);
  },
};
