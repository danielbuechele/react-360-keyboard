import {Module, Math as VRMath, Surface, ReactInstance} from 'react-360-web';

type ResolverID = number;

class KeyboardModule extends Module {
  constructor(ctx) {
    super('Keyboard');
    this._surface = new Surface(700, 350, Surface.SurfaceShape.Flat);
    this._keyboardVisible = false;
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

  showKeyboard() {}

  hideKeyboard() {
    this._keyboardVisible = false;
  }

  $startInput(placeholder: string, resolveID: ResolverID) {
    this._keyboardVisible = true;
    this._inputResolver = resolveID;
    if (this._onShowResolver) {
      this._ctx.invokeCallback(
        this._onShowResolver,
        [placeholder], // array of arguments passed to resolve method
      );
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
export default input => {
  if (module && input instanceof ReactInstance) {
    module._setInstance(input);
  } else {
    module = new KeyboardModule(input);
    return module;
  }
};
