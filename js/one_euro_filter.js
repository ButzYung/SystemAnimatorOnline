// https://gist.github.com/3846masa/5628f711e86fd62bea56b18e32177c60
// https://github.com/vrpn/vrpn/blob/master/vrpn_OneEuroFilter.h

// modified by Butz Yung - https://github.com/ButzYung
// THREE.Quaternion required
// (2024-05-08)

class LowPassFilter {
  constructor(alpha, type) {
    this.setAlpha(alpha);
    this.y = null;
    this.s = null;

    this.type = type;

    LowPassFilter.#init();
  }

  static #q1;
  static #q2;

  static #initialized = false;
  static #init() {
if (LowPassFilter.#initialized) return;
LowPassFilter.#initialized = true;

if (self.THREE) {
  LowPassFilter.#q1 = new THREE.Quaternion();
  LowPassFilter.#q2 = new THREE.Quaternion();
}
  }

  setAlpha(alpha) {
    if (alpha <= 0 || alpha > 1.0) {
      throw new Error();
    }
    this.alpha = alpha;
  }

  filter(value, timestamp, alpha) {
    if (alpha) {
      this.setAlpha(alpha);
    }
    let s;
    if (!this.y) {
      s = value;
    } else {
      if (Array.isArray(value)) {
        if (this.type == 4) { s = LowPassFilter.#q1.fromArray(this.s).slerp(LowPassFilter.#q2.fromArray(value), this.alpha).toArray(); } else
        s = value.map((v,i)=>this.alpha * v + ( 1.0 - this.alpha ) * this.s[i]);
//        if (this.type == 4) s = LowPassFilter.#q1.fromArray(s).normalize().toArray();
      }
      else {
        s = this.alpha * value + ( 1.0 - this.alpha ) * this.s;
      }
    }
    this.y = value;
    this.s = s;
    return s;
  }

  lastValue() {
    return this.y;
  }
}

class OneEuroFilter {
  constructor(freq=30.0, minCutOff=1.0, beta=0.0, dCutOff=1.0, type=0) {
    if (freq <= 0 || minCutOff <= 0 || dCutOff <= 0) {
      throw new Error();
    }
    this.freq = freq;
    this.minCutOff = minCutOff;
    this.beta = beta;
    this.dCutOff = dCutOff;
    this.x = new LowPassFilter(this.alpha(this.minCutOff), type);
    this.dx = new LowPassFilter(this.alpha(this.dCutOff), type);
    this.lasttime = null;

// type 0=scalar, 3=vector, 4=quaternion
    this.type = type;

    OneEuroFilter.#init();
  }

  static #q1_dx;
  static #q2_dx;

  static #initialized = false;
  static #init() {
if (OneEuroFilter.#initialized) return;
OneEuroFilter.#initialized = true;

if (self.THREE) {
  OneEuroFilter.#q1_dx = new THREE.Quaternion();
  OneEuroFilter.#q2_dx = new THREE.Quaternion();
}
  }

  computeDerivative(x) {
    const prevX = this.x.lastValue();

    let dx;
    if (!prevX) {
      switch (this.type) {
        case 3:
          dx = [0,0,0];
          break;
        case 4:
          dx = [0,0,0,1];
          break;
        default:
          dx = 0;
      }
    }
    else {
      if (this.type == 3) {
        const dt = 1 / this.freq;

        dx = x.map((v,i)=>( v - prevX[i] ) / dt);
      }
      else if (this.type == 4) {
        const dt = 1 / this.freq;

        const rate = 1.0 / dt;

        OneEuroFilter.#q1_dx.fromArray(prevX).conjugate();
        dx = OneEuroFilter.#q2_dx.fromArray(x).multiply(OneEuroFilter.#q1_dx);
/*
// nlerp instead of slerp
        dx.x *= rate;
        dx.y *= rate;
        dx.z *= rate;
        dx.w = dx.w * rate + (1.0 - rate);
        dx = dx.normalize().toArray();
*/
//q_slerp(dx, identity, dx, 1.0 / dt);
        dx = OneEuroFilter.#q1_dx.set(0,0,0,1).slerp(dx, rate).toArray();
      }
      else {
        dx = ( x - prevX ) * this.freq;
      }
    }

    return dx;
  }

  computeDerivativeMagnitude(dx) {
    let edx;
    if (this.type == 3) {
      let sqnorm = 0;
      dx.forEach(x=>{sqnorm += x*x});
      edx = Math.sqrt(sqnorm);
    }
    else if (this.type == 4) {
/// Should be safe since the quaternion we're given has been normalized.
      edx = 2.0 * Math.acos(dx[3]);
    }
    else {
      edx = Math.abs(dx);
    }

    return edx;
  }

  alpha(cutOff) {
    const te = 1.0 / this.freq;
    const tau = 1.0 / ( 2 * Math.PI * cutOff );
    return 1.0 / ( 1.0 + tau / te );
  }

  filter(x, timestamp=null, time_scale=1) {
    if (this.lasttime && timestamp) {
// AT: convert timestamp to seconds
// avoid infinity when time delta is 0
      this.freq = 1.0 / (Math.max( (timestamp - this.lasttime)/1000, 1/60 ) * time_scale);
    }
    this.lasttime = timestamp;

    const dx = this.computeDerivative(x);
    const edx = this.computeDerivativeMagnitude(this.dx.filter(dx, timestamp, this.alpha(this.dCutOff)));

    const cutOff = this.minCutOff + this.beta * edx;
//if (!this._cutOff_max_) this._cutOff_max_=[]; this._cutOff_max_.unshift(cutOff); this._cutOff_max_.length=Math.min(this._cutOff_max_.length,100); System._browser.camera.DEBUG_show(((this.id && (this.id+'-'))||'')+'cutOff(' + cutOff+'/'+Math.max(...this._cutOff_max_) + '/freq:' + this.freq);
    return this.x.filter(x, timestamp, this.alpha(cutOff));
  }
}
