import {Module, Surface} from 'react-360-web';

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
    this._surface.setAngle(0, -0.36);
    this._surface.setRadius(3.5);
    this._surface.setVisibility(Boolean(this._inputResolver));
  }

  _setInstance(instance: ReactInstance) {
    this._instance = instance;

    // TODO: persist existing frame hooks
    instance._frameHook = this._frameHook.bind(this);
    instance.renderToSurface(this._instance.createRoot('KeyboardPanel'), this._surface);
  }

  $startDictation(resolveID: ResolverID, rejectID: ResolverID) {
    this._dictationResolver = resolveID;
    this._dictationRejecter = rejectID;
    this._recognition = new window.SpeechRecognition();
    this._recognition.lang = 'en-US';
    this._recognition.interimResults = false;
    this._recognition.maxAlternatives = 1;

    this._recognition.onresult = event => {
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
    if (this._dictationRejecter) {
      this._ctx.invokeCallback(this._dictationRejecter, []);
      this._dictationRejecter = null;
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
      setTimeout(() => {
        this._inputResolver = null;
      }, 200);
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
