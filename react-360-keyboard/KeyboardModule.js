import {Module, Surface} from 'react-360-web';

import type {ReactInstance} from 'react-360-web';
import type {Config} from './Keyboard';
type ResolverID = number;
type Context = any;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

class KeyboardModule extends Module {
  constructor(ctx: Context) {
    super('Keyboard');
    this.dictationAvailable = Boolean(window.SpeechRecognition);
    this._surface = new Surface(700, 350, Surface.SurfaceShape.Flat);
    this._surface.setVisibility(false);
    this._surface.setRadius(3.5);
    this._ctx = ctx;
  }

  _setInstance(instance: ReactInstance) {
    this._instance = instance;

    instance.renderToSurface(
      this._instance.createRoot('KeyboardPanel'),
      this._surface,
    );
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

  rotateByQuaternion(v: Vec3, q: Quaternion) {
    // Optimized implementation of Hamiltonian product, similar to Unity's
    // internal implementation
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const vx = v[0];
    const vy = v[1];
    const vz = v[2];
    const qx2 = qx + qx;
    const qy2 = qy + qy;
    const qz2 = qz + qz;

    const xx2 = qx * qx2;
    const yy2 = qy * qy2;
    const zz2 = qz * qz2;
    const xy2 = qx * qy2;
    const xz2 = qx * qz2;
    const yz2 = qy * qz2;
    const wx2 = qw * qx2;
    const wy2 = qw * qy2;
    const wz2 = qw * qz2;

    v[0] = (1 - yy2 - zz2) * vx + (xy2 - wz2) * vy + (xz2 + wy2) * vz;
    v[1] = (xy2 + wz2) * vx + (1 - xx2 - zz2) * vy + (yz2 - wx2) * vz;
    v[2] = (xz2 - wy2) * vx + (yz2 + wx2) * vy + (1 - xx2 - yy2) * vz;
  }

  $startInput(config: Config, resolveID: ResolverID) {
    if (this._inputResolver) {
      // keyboard already shown
      return;
    }
    this._inputResolver = resolveID;

    const cameraDirection = [0, -0.1, -1];
    const cameraQuat = this._instance.getCameraQuaternion();
    this.rotateByQuaternion(cameraDirection, cameraQuat);
    const cx = cameraDirection[0];
    const cy = cameraDirection[1];
    const cz = cameraDirection[2];
    const horizAngle = Math.atan2(cx, -cz);
    const vertAngle = Math.asin(cy / Math.sqrt(cx * cx + cy * cy + cz * cz));
    this._surface.setAngle(horizAngle, vertAngle);
    this._surface.setVisibility(true);

    if (this._onShowResolver) {
      this._ctx.invokeCallback(this._onShowResolver, [config]);
    }
  }

  $endInput(value: string, resolveID: ResolverID) {
    this._ctx.invokeCallback(resolveID, []);
    this._surface.setVisibility(false);

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
