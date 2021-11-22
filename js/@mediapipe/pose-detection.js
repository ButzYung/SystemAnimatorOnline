/**
    * @license
    * Copyright 2021 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("@mediapipe/pose"), require("@tensorflow/tfjs-converter"), require("@tensorflow/tfjs-core")) : "function" == typeof define && define.amd ? define(["exports", "@mediapipe/pose", "@tensorflow/tfjs-converter", "@tensorflow/tfjs-core"], t) : t((e = e || self).poseDetection = {}, e.Pose, e.tf, e.tf)
}(this, (function(e, t, i, n) {
    "use strict";
    var r = function(e, t) {
        return (r = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var i in t)
                t.hasOwnProperty(i) && (e[i] = t[i])
        }
        )(e, t)
    };
    function o(e, t) {
        function i() {
            this.constructor = e
        }
        r(e, t),
        e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype,
        new i)
    }
    var s = function() {
        return (s = Object.assign || function(e) {
            for (var t, i = 1, n = arguments.length; i < n; i++)
                for (var r in t = arguments[i])
                    Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }
        ).apply(this, arguments)
    };
    function a(e, t, i, n) {
        return new (i || (i = Promise))((function(r, o) {
            function s(e) {
                try {
                    l(n.next(e))
                } catch (e) {
                    o(e)
                }
            }
            function a(e) {
                try {
                    l(n.throw(e))
                } catch (e) {
                    o(e)
                }
            }
            function l(e) {
                var t;
                e.done ? r(e.value) : (t = e.value,
                t instanceof i ? t : new i((function(e) {
                    e(t)
                }
                ))).then(s, a)
            }
            l((n = n.apply(e, t || [])).next())
        }
        ))
    }
    function l(e, t) {
        var i, n, r, o, s = {
            label: 0,
            sent: function() {
                if (1 & r[0])
                    throw r[1];
                return r[1]
            },
            trys: [],
            ops: []
        };
        return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
        },
        "function" == typeof Symbol && (o[Symbol.iterator] = function() {
            return this
        }
        ),
        o;
        function a(o) {
            return function(a) {
                return function(o) {
                    if (i)
                        throw new TypeError("Generator is already executing.");
                    for (; s; )
                        try {
                            if (i = 1,
                            n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n),
                            0) : n.next) && !(r = r.call(n, o[1])).done)
                                return r;
                            switch (n = 0,
                            r && (o = [2 & o[0], r.value]),
                            o[0]) {
                            case 0:
                            case 1:
                                r = o;
                                break;
                            case 4:
                                return s.label++,
                                {
                                    value: o[1],
                                    done: !1
                                };
                            case 5:
                                s.label++,
                                n = o[1],
                                o = [0];
                                continue;
                            case 7:
                                o = s.ops.pop(),
                                s.trys.pop();
                                continue;
                            default:
                                if (!(r = s.trys,
                                (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                    s = 0;
                                    continue
                                }
                                if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                    s.label = o[1];
                                    break
                                }
                                if (6 === o[0] && s.label < r[1]) {
                                    s.label = r[1],
                                    r = o;
                                    break
                                }
                                if (r && s.label < r[2]) {
                                    s.label = r[2],
                                    s.ops.push(o);
                                    break
                                }
                                r[2] && s.ops.pop(),
                                s.trys.pop();
                                continue
                            }
                            o = t.call(e, s)
                        } catch (e) {
                            o = [6, e],
                            n = 0
                        } finally {
                            i = r = 0
                        }
                    if (5 & o[0])
                        throw o[1];
                    return {
                        value: o[0] ? o[1] : void 0,
                        done: !0
                    }
                }([o, a])
            }
        }
    }
    var u = ["nose", "left_eye", "right_eye", "left_ear", "right_ear", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_hip", "right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle"]
      , h = ["nose", "left_eye_inner", "left_eye", "left_eye_outer", "right_eye_inner", "right_eye", "right_eye_outer", "left_ear", "right_ear", "mouth_left", "mouth_right", "left_shoulder", "right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_pinky", "right_pinky", "left_index", "right_index", "left_thumb", "right_thumb", "left_hip", "right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel", "right_heel", "left_foot_index", "right_foot_index"]
      , c = {
        left: [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
        right: [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
        middle: [0]
    }
      , p = {
        left: [1, 3, 5, 7, 9, 11, 13, 15],
        right: [2, 4, 6, 8, 10, 12, 14, 16],
        middle: [0]
    }
      , d = [[0, 1], [0, 2], [1, 3], [2, 4], [5, 6], [5, 7], [5, 11], [6, 8], [6, 12], [7, 9], [8, 10], [11, 12], [11, 13], [12, 14], [13, 15], [14, 16]]
      , f = [[0, 1], [0, 4], [1, 2], [2, 3], [3, 7], [4, 5], [5, 6], [6, 8], [9, 10], [11, 12], [11, 13], [11, 23], [12, 14], [14, 16], [12, 24], [13, 15], [15, 17], [16, 18], [16, 20], [15, 17], [15, 19], [15, 21], [16, 22], [17, 19], [18, 20], [23, 25], [23, 24], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [27, 31], [28, 32], [29, 31], [30, 32]]
      , m = {
        runtime: "mediapipe",
        enableSmoothing: !0,
        modelType: "full"
    };
    var y = function() {
        function e(e) {
            var i, n = this;
            switch (this.width = 0,
            this.height = 0,
            this.selfieMode = !1,
// AT: use global Pose
            this.poseSolution = new Pose({
//            this.poseSolution = new t.Pose({
                locateFile: function(t, i) {
// AT: remote load
console.log(t)
return PoseAT.path_adjusted('@mediapipe/pose/' + t);
//return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + t;
//                    return e.solutionPath ? e.solutionPath.replace(/\/+$/, "") + "/" + t : i + "/" + t
                }
            }),
            e.modelType) {
            case "lite":
                i = 0;
                break;
            case "heavy":
                i = 2;
                break;
            case "full":
            default:
                i = 1
            }
            this.poseSolution.setOptions({
                modelComplexity: i,
                smoothLandmarks: e.enableSmoothing || !0,
                selfieMode: this.selfieMode
            }),
            this.poseSolution.onResults((function(e) {
                n.height = e.image.height,
                n.width = e.image.width,
                null == e.poseLandmarks ? n.poses = [] : n.poses = [n.translateOutput(e.poseLandmarks, e.poseWorldLandmarks)]
            }
            ))
        }
        return e.prototype.translateOutput = function(e, t) {
            var i = this
              , n = {
                keypoints: e.map((function(e, t) {
                    return {
                        x: e.x * i.width,
                        y: e.y * i.height,
                        z: e.z,
                        score: e.visibility,
                        name: h[t]
                    }
                }
                ))
            };
            return null != t && (n.keypoints3D = t.map((function(e, t) {
                return {
                    x: e.x,
                    y: e.y,
                    z: e.z,
                    score: e.visibility,
                    name: h[t]
                }
            }
            ))),
            n
        }
        ,
        e.prototype.estimatePoses = function(e, t, i) {
            return a(this, void 0, void 0, (function() {
                return l(this, (function(n) {
                    switch (n.label) {
                    case 0:
                        return t && t.flipHorizontal && t.flipHorizontal !== this.selfieMode && (this.selfieMode = t.flipHorizontal,
                        this.poseSolution.setOptions({
                            selfieMode: this.selfieMode
                        })),
                        [4, this.poseSolution.send({
                            image: e
                        }, i)];
                    case 1:
                        return n.sent(),
                        [2, this.poses]
                    }
                }
                ))
            }
            ))
        }
        ,
        e.prototype.dispose = function() {
            this.poseSolution.close()
        }
        ,
        e.prototype.reset = function() {
            this.poseSolution.reset()
        }
        ,
        e.prototype.initialize = function() {
            return this.poseSolution.initialize()
        }
        ,
        e
    }();
    function g(e) {
        return a(this, void 0, void 0, (function() {
            var t, i;
            return l(this, (function(n) {
                switch (n.label) {
                case 0:
                    return t = function(e) {
                        if (null == e)
                            return s({}, m);
                        var t = s({}, e);
                        return t.runtime = "mediapipe",
                        null == t.enableSmoothing && (t.enableSmoothing = m.enableSmoothing),
                        null == t.modelType && (t.modelType = m.modelType),
                        t
                    }(e),
                    [4, (i = new y(t)).initialize()];
                case 1:
                    return n.sent(),
                    [2, i]
                }
            }
            ))
        }
        ))
    }
    function v(e) {
        return e instanceof n.Tensor ? {
            height: e.shape[0],
            width: e.shape[1]
        } : {
            height: e.height,
            width: e.width
        }
    }
    function x(e) {
        return e - 2 * Math.PI * Math.floor((e + Math.PI) / (2 * Math.PI))
    }
    function w(e) {
        return e instanceof n.Tensor ? e : n.browser.fromPixels(e)
    }
    function k(e, t) {
        n.util.assert(0 !== e.width, (function() {
            return t + " width cannot be 0."
        }
        )),
        n.util.assert(0 !== e.height, (function() {
            return t + " height cannot be 0."
        }
        ))
    }
    function M(e, t, i) {
        var r = t.inputResolution
          , o = t.keepAspectRatio
          , s = v(e)
          , a = function(e, t) {
            return t ? {
                xCenter: t.xCenter * e.width,
                yCenter: t.yCenter * e.height,
                width: t.width * e.width,
                height: t.height * e.height,
                rotation: t.rotation
            } : {
                xCenter: .5 * e.width,
                yCenter: .5 * e.height,
                width: e.width,
                height: e.height,
                rotation: 0
            }
        }(s, i)
          , l = function(e, t, i) {
            if (void 0 === i && (i = !1),
            !i)
                return {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                };
            var n = t.height
              , r = t.width;
            k(t, "targetSize"),
            k(e, "roi");
            var o, s, a = n / r, l = e.height / e.width, u = 0, h = 0;
            return a > l ? (o = e.width,
            s = e.width * a,
            h = (1 - l / a) / 2) : (o = e.height / a,
            s = e.height,
            u = (1 - a / l) / 2),
            e.width = o,
            e.height = s,
            {
                top: h,
                left: u,
                right: u,
                bottom: h
            }
        }(a, r, o);
        return {
            imageTensor: n.tidy((function() {
                var t = w(e)
                  , i = n.tensor2d(function(e, t, i, n) {
                    k(n, "inputResolution");
                    var r = 1 / t.width
                      , o = 1 / t.height
                      , s = e.xCenter
                      , a = e.yCenter
                      , l = Math.cos(e.rotation)
                      , u = Math.sin(e.rotation)
                      , h = i ? -1 : 1
                      , c = e.width
                      , p = e.height;
                    return [1 / n.width * c * l * h * r * t.width, 1 / n.height * -p * u * r * t.width, (-.5 * c * l * h + .5 * p * u + s) * r * t.width, 1 / n.width * c * u * h * o * t.height, 1 / n.height * p * l * o * t.height, (-.5 * p * l - .5 * c * u * h + a) * o * t.height, 0, 0]
                }(a, s, !1, r), [1, 8]);
                return n.image.transform(n.expandDims(n.cast(t, "float32")), i, "bilinear", "nearest", 0, [r.height, r.width])
            }
            )),
            padding: l
        }
    }
    function b(e) {
        return null != e && null != e.currentTime
    }
    var S = function() {
        function e(e) {
            this.alpha = e,
            this.initialized = !1
        }
        return e.prototype.apply = function(e, t) {
            var i;
            return this.initialized ? i = null == t ? this.storedValue + this.alpha * (e - this.storedValue) : this.storedValue + this.alpha * t * Math.asinh((e - this.storedValue) / t) : (i = e,
            this.initialized = !0),
            this.rawValue = e,
            this.storedValue = i,
            i
        }
        ,
        e.prototype.applyWithAlpha = function(e, t, i) {
            return this.alpha = t,
            this.apply(e, i)
        }
        ,
        e.prototype.hasLastRawValue = function() {
            return this.initialized
        }
        ,
        e.prototype.lastRawValue = function() {
            return this.rawValue
        }
        ,
        e.prototype.reset = function() {
            this.initialized = !1
        }
        ,
        e
    }()
      , T = function() {
        function e(e) {
            this.frequency = e.frequency,
            this.minCutOff = e.minCutOff,
            this.beta = e.beta,
            this.thresholdCutOff = e.thresholdCutOff,
            this.thresholdBeta = e.thresholdBeta,
            this.derivateCutOff = e.derivateCutOff,
            this.x = new S(this.getAlpha(this.minCutOff)),
            this.dx = new S(this.getAlpha(this.derivateCutOff)),
            this.lastTimestamp = 0
        }
        return e.prototype.apply = function(e, t, i) {
            if (null == e)
                return e;
            var n = Math.trunc(t);
            if (this.lastTimestamp >= n)
                return e;
            0 !== this.lastTimestamp && 0 !== n && (this.frequency = 1 / (1e-6 * (n - this.lastTimestamp))),
            this.lastTimestamp = n;
            var r = this.x.hasLastRawValue() ? (e - this.x.lastRawValue()) * i * this.frequency : 0
              , o = this.dx.applyWithAlpha(r, this.getAlpha(this.derivateCutOff))
              , s = this.minCutOff + this.beta * Math.abs(o)
              , a = null != this.thresholdCutOff ? this.thresholdCutOff + this.thresholdBeta * Math.abs(o) : null;
            return this.x.applyWithAlpha(e, this.getAlpha(s), a)
        }
        ,
        e.prototype.getAlpha = function(e) {
            return 1 / (1 + this.frequency / (2 * Math.PI * e))
        }
        ,
        e
    }()
      , P = function() {
        function e(e) {
            this.config = e
        }
        return e.prototype.apply = function(e, t, i) {
            var n = this;
            if (null == e)
                return this.reset(),
                null;
            this.initializeFiltersIfEmpty(e);
            var r = 1;
            if (!this.config.disableValueScaling) {
                if (i < this.config.minAllowedObjectScale)
                    return e.slice();
                r = 1 / i
            }
            return e.map((function(e, i) {
                var o = s({}, e, {
                    x: n.xFilters[i].apply(e.x, t, r),
                    y: n.yFilters[i].apply(e.y, t, r)
                });
                return null != e.z && (o.z = n.zFilters[i].apply(e.z, t, r)),
                o
            }
            ))
        }
        ,
        e.prototype.reset = function() {
            this.xFilters = null,
            this.yFilters = null,
            this.zFilters = null
        }
        ,
        e.prototype.initializeFiltersIfEmpty = function(e) {
            var t = this;
            null != this.xFilters && this.xFilters.length === e.length || (this.xFilters = e.map((function(e) {
                return new T(t.config)
            }
            )),
            this.yFilters = e.map((function(e) {
                return new T(t.config)
            }
            )),
            this.zFilters = e.map((function(e) {
                return new T(t.config)
            }
            )))
        }
        ,
        e
    }();
    function _(e, t) {
        return e.map((function(e) {
            var i = s({}, e, {
                x: e.x / t.width,
                y: e.y / t.height
            });
            return null != e.z && (e.z = e.z / t.width),
            i
        }
        ))
    }
    var F = function() {
        function e(e) {
            this.config = e,
            this.window = [],
            this.lowPassFilter = new S(1),
            this.lastValue = 0,
            this.lastValueScale = 1,
            this.lastTimestamp = -1
        }
        return e.prototype.apply = function(e, t, i) {
            if (null == e)
                return e;
            var n, r = Math.trunc(t);
            if (this.lastTimestamp >= r)
                return e;
            if (-1 === this.lastTimestamp)
                n = 1;
            else {
                for (var o = e * i - this.lastValue * this.lastValueScale, s = r - this.lastTimestamp, a = o, l = s, u = (1 + this.window.length) * (1e6 / 30), h = 0, c = this.window; h < c.length; h++) {
                    var p = c[h];
                    if (l + p.duration > u)
                        break;
                    a += p.distance,
                    l += p.duration
                }
                var d = a / (1e-6 * l);
                n = 1 - 1 / (1 + this.config.velocityScale * Math.abs(d)),
                this.window.unshift({
                    distance: o,
                    duration: s
                }),
                this.window.length > this.config.windowSize && this.window.pop()
            }
            return this.lastValue = e,
            this.lastValueScale = i,
            this.lastTimestamp = r,
            this.lowPassFilter.applyWithAlpha(e, n)
        }
        ,
        e
    }()
      , O = function() {
        function e(e) {
            this.config = e
        }
        return e.prototype.apply = function(e, t, i) {
            var n = this;
            if (null == e)
                return this.reset(),
                null;
            var r = 1;
            if (!this.config.disableValueScaling) {
                if (i < this.config.minAllowedObjectScale)
                    return e.slice();
                r = 1 / i
            }
            return this.initializeFiltersIfEmpty(e),
            e.map((function(e, i) {
                var o = s({}, e, {
                    x: n.xFilters[i].apply(e.x, t, r),
                    y: n.yFilters[i].apply(e.y, t, r)
                });
                return null != e.z && (o.z = n.zFilters[i].apply(e.z, t, r)),
                o
            }
            ))
        }
        ,
        e.prototype.reset = function() {
            this.xFilters = null,
            this.yFilters = null,
            this.zFilters = null
        }
        ,
        e.prototype.initializeFiltersIfEmpty = function(e) {
            var t = this;
            null != this.xFilters && this.xFilters.length === e.length || (this.xFilters = e.map((function(e) {
                return new F(t.config)
            }
            )),
            this.yFilters = e.map((function(e) {
                return new F(t.config)
            }
            )),
            this.zFilters = e.map((function(e) {
                return new F(t.config)
            }
            )))
        }
        ,
        e
    }();
    function z(e, t) {
        return e.map((function(e) {
            var i = s({}, e, {
                x: e.x * t.width,
                y: e.y * t.height
            });
            return null != e.z && (i.z = e.z * t.width),
            i
        }
        ))
    }
    var R = function() {
        function e(e) {
            if (null != e.velocityFilter)
                this.keypointsFilter = new O(e.velocityFilter);
            else {
                if (null == e.oneEuroFilter)
                    throw new Error("Either configure velocityFilter or oneEuroFilter, but got " + e + ".");
                this.keypointsFilter = new P(e.oneEuroFilter)
            }
        }
        return e.prototype.apply = function(e, t, i, n, r) {
            if (void 0 === n && (n = !1),
            null == e)
                return this.keypointsFilter.reset(),
                null;
            var o = null != r ? function(e, t) {
                return (e.width * t.width + e.height * t.height) / 2
            }(r, i) : 1
              , s = n ? z(e, i) : e
              , a = this.keypointsFilter.apply(s, t, o);
            return n ? _(a, i) : a
        }
        ,
        e
    }();
    function C(e, t) {
        var i = function(e, t, i, n) {
            var r = t - e
              , o = n - i;
            if (0 === r)
                throw new Error("Original min and max are both " + e + ", range cannot be 0.");
            var s = o / r;
            return {
                scale: s,
                offset: i - e * s
            }
        }(0, 255, t[0], t[1]);
        return n.tidy((function() {
            return n.add(n.mul(e, i.scale), i.offset)
        }
        ))
    }
    function E(e, t, i) {
        var n = i.rotationVectorStartKeypointIndex
          , r = i.rotationVectorEndKeypointIndex
          , o = e.locationData
          , s = o.relativeKeypoints[n].x * t.width
          , a = o.relativeKeypoints[n].y * t.height
          , l = o.relativeKeypoints[r].x * t.width
          , u = o.relativeKeypoints[r].y * t.height
          , h = 2 * Math.sqrt((l - s) * (l - s) + (u - a) * (u - a))
          , c = function(e, t, i) {
            var n, r = e.locationData, o = i.rotationVectorStartKeypointIndex, s = i.rotationVectorEndKeypointIndex;
            n = i.rotationVectorTargetAngle ? i.rotationVectorTargetAngle : Math.PI * i.rotationVectorTargetAngleDegree / 180;
            var a = r.relativeKeypoints[o].x * t.width
              , l = r.relativeKeypoints[o].y * t.height
              , u = r.relativeKeypoints[s].x * t.width
              , h = r.relativeKeypoints[s].y * t.height;
            return x(n - Math.atan2(-(h - l), u - a))
        }(e, t, i);
        return {
            xCenter: s / t.width,
            yCenter: a / t.height,
            width: h / t.width,
            height: h / t.height,
            rotation: c
        }
    }
    function A(e, t, i, n) {
        return 1 === n ? .5 * (e + t) : e + (t - e) * i / (n - 1)
    }
    function I(e, t) {
        return n.tidy((function() {
            var i = function(e) {
                return n.tidy((function() {
                    var t = n.slice(e, [0, 0, 0], [1, -1, 1]);
                    return [n.sigmoid(t), n.slice(e, [0, 0, 1], [1, -1, -1])]
                }
                ))
            }(t.predict(e))
              , r = i[0]
              , o = i[1];
            return {
                boxes: n.squeeze(o),
                scores: n.squeeze(r)
            }
        }
        ))
    }
    function B(e) {
        for (var t = {
            locationData: {
                relativeKeypoints: []
            }
        }, i = Number.MAX_SAFE_INTEGER, n = Number.MIN_SAFE_INTEGER, r = Number.MAX_SAFE_INTEGER, o = Number.MIN_SAFE_INTEGER, s = 0; s < e.length; ++s) {
            var a = e[s];
            i = Math.min(i, a.x),
            n = Math.max(n, a.x),
            r = Math.min(r, a.y),
            o = Math.max(o, a.y),
            t.locationData.relativeKeypoints.push({
                x: a.x,
                y: a.y
            })
        }
        return t.locationData.relativeBoundingBox = {
            xMin: i,
            yMin: r,
            xMax: n,
            yMax: o,
            width: n - i,
            height: o - r
        },
        t
    }
    function N(e, t, i, r) {
        return a(this, void 0, void 0, (function() {
            var o, s, a, u, h;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return o = n.tensor2d(e.map((function(e) {
                        return [e.locationData.relativeBoundingBox.yMin, e.locationData.relativeBoundingBox.xMin, e.locationData.relativeBoundingBox.yMax, e.locationData.relativeBoundingBox.xMax]
                    }
                    ))),
                    s = n.tensor1d(e.map((function(e) {
                        return e.score[0]
                    }
                    ))),
                    [4, n.image.nonMaxSuppressionAsync(o, s, t, i, r)];
                case 1:
                    return [4, (a = l.sent()).array()];
                case 2:
                    return u = l.sent(),
                    h = e.filter((function(e, t) {
                        return u.indexOf(t) > -1
                    }
                    )),
                    n.dispose([o, s, a]),
                    [2, h]
                }
            }
            ))
        }
        ))
    }
    function L(e, t, i) {
        return a(this, void 0, void 0, (function() {
            var r, o, a, u, h, c, p, d, f, m, y, g, v, x, w, k, M, b, S, T, P, _, F, O;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    if (r = n.squeeze(t, [0]),
                    o = r.shape,
                    a = o[0],
                    u = o[1],
                    h = o[2],
                    e.length !== h)
                        throw new Error("Expected heatmap to have same number of channels as the number of landmarks. But got landmarks length: " + e.length + ", heatmap length: " + h);
                    return c = [],
                    [4, r.buffer()];
                case 1:
                    for (p = l.sent(),
                    d = 0; d < e.length; d++)
                        if (f = e[d],
                        m = s({}, f),
                        c.push(m),
                        y = Math.trunc(m.x * u),
                        g = Math.trunc(m.y * a),
                        !(y < 0 || y >= u || g < 0 || y >= a)) {
                            for (v = Math.trunc((i.kernelSize - 1) / 2),
                            x = Math.max(0, y - v),
                            w = Math.min(u, y + v + 1),
                            k = Math.max(0, g - v),
                            M = Math.min(a, g + v + 1),
                            b = 0,
                            S = 0,
                            T = 0,
                            P = 0,
                            _ = k; _ < M; ++_)
                                for (F = x; F < w; ++F)
                                    O = p.get(_, F, d),
                                    b += O,
                                    P = Math.max(P, O),
                                    S += F * O,
                                    T += _ * O;
                            P >= i.minConfidenceToRefine && b > 0 && (m.x = S / u / b,
                            m.y = T / a / b)
                        }
                    return r.dispose(),
                    [2, c]
                }
            }
            ))
        }
        ))
    }
    function V(e, t, i) {
        return a(this, void 0, void 0, (function() {
            var r, o, s, a, u;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return r = e[0],
                    o = e[1],
                    s = function(e, t, i) {
                        return n.tidy((function() {
                            var r, o, s, a;
                            i.reverseOutputOrder ? (o = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 0], [-1, 1])),
                            r = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 1], [-1, 1])),
                            a = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 2], [-1, 1])),
                            s = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 3], [-1, 1]))) : (r = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 0], [-1, 1])),
                            o = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 1], [-1, 1])),
                            s = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 2], [-1, 1])),
                            a = n.squeeze(n.slice(e, [0, i.boxCoordOffset + 3], [-1, 1]))),
                            o = n.add(n.mul(n.div(o, i.xScale), t.w), t.x),
                            r = n.add(n.mul(n.div(r, i.yScale), t.h), t.y),
                            i.applyExponentialOnBoxSize ? (s = n.mul(n.exp(n.div(s, i.hScale)), t.h),
                            a = n.mul(n.exp(n.div(a, i.wScale)), t.w)) : (s = n.mul(n.div(s, i.hScale), t.h),
                            a = n.mul(n.div(a, i.wScale), t.h));
                            var l = n.sub(r, n.div(s, 2))
                              , u = n.sub(o, n.div(a, 2))
                              , h = n.add(r, n.div(s, 2))
                              , c = n.add(o, n.div(a, 2))
                              , p = n.concat([n.reshape(l, [i.numBoxes, 1]), n.reshape(u, [i.numBoxes, 1]), n.reshape(h, [i.numBoxes, 1]), n.reshape(c, [i.numBoxes, 1])], 1);
                            if (i.numKeypoints)
                                for (var d = 0; d < i.numKeypoints; ++d) {
                                    var f = i.keypointCoordOffset + d * i.numValuesPerKeypoint
                                      , m = void 0
                                      , y = void 0;
                                    i.reverseOutputOrder ? (m = n.squeeze(n.slice(e, [0, f], [-1, 1])),
                                    y = n.squeeze(n.slice(e, [0, f + 1], [-1, 1]))) : (y = n.squeeze(n.slice(e, [0, f], [-1, 1])),
                                    m = n.squeeze(n.slice(e, [0, f + 1], [-1, 1])));
                                    var g = n.add(n.mul(n.div(m, i.xScale), t.w), t.x)
                                      , v = n.add(n.mul(n.div(y, i.yScale), t.h), t.y);
                                    p = n.concat([p, n.reshape(g, [i.numBoxes, 1]), n.reshape(v, [i.numBoxes, 1])], 1)
                                }
                            return p
                        }
                        ))
                    }(o, t, i),
                    a = n.tidy((function() {
                        var e = r;
                        return i.sigmoidScore ? (null != i.scoreClippingThresh && (e = n.clipByValue(r, -i.scoreClippingThresh, i.scoreClippingThresh)),
                        e = n.sigmoid(e)) : e
                    }
                    )),
                    [4, q(s, a, i)];
                case 1:
                    return u = l.sent(),
                    n.dispose([s, a]),
                    [2, u]
                }
            }
            ))
        }
        ))
    }
    function q(e, t, i) {
        return a(this, void 0, void 0, (function() {
            var n, r, o, s, a, u, h, c, p, d, f, m;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return n = [],
                    [4, e.data()];
                case 1:
                    return r = l.sent(),
                    [4, t.data()];
                case 2:
                    for (o = l.sent(),
                    s = 0; s < i.numBoxes; ++s)
                        if (!(null != i.minScoreThresh && o[s] < i.minScoreThresh || (a = s * i.numCoords,
                        u = D(r[a + 0], r[a + 1], r[a + 2], r[a + 3], o[s], i.flipVertically, s),
                        (h = u.locationData.relativeBoundingBox).width < 0 || h.height < 0))) {
                            if (i.numKeypoints > 0)
                                for ((c = u.locationData).relativeKeypoints = [],
                                p = i.numKeypoints * i.numValuesPerKeypoint,
                                d = 0; d < p; d += i.numValuesPerKeypoint)
                                    f = a + i.keypointCoordOffset + d,
                                    m = {
                                        x: r[f + 0],
                                        y: i.flipVertically ? 1 - r[f + 1] : r[f + 1]
                                    },
                                    c.relativeKeypoints.push(m);
                            n.push(u)
                        }
                    return [2, n]
                }
            }
            ))
        }
        ))
    }
    function D(e, t, i, n, r, o, s) {
        return {
            score: [r],
            ind: s,
            locationData: {
                relativeBoundingBox: {
                    xMin: t,
                    yMin: o ? 1 - i : e,
                    xMax: n,
                    yMax: o ? 1 - e : i,
                    width: n - t,
                    height: i - e
                }
            }
        }
    }
    function K(e, t, i, n) {
        return void 0 === i && (i = !1),
        void 0 === n && (n = !1),
        a(this, void 0, void 0, (function() {
            var r, o, s, a, u, h, c, p;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return r = e.size,
                    o = r / t.numLandmarks,
                    [4, e.data()];
                case 1:
                    for (s = l.sent(),
                    a = [],
                    u = 0; u < t.numLandmarks; ++u)
                        h = u * o,
                        (p = {
                            x: 0,
                            y: 0
                        }).x = i ? t.inputImageWidth - s[h] : s[h],
                        o > 1 && (p.y = n ? t.inputImageHeight - s[h + 1] : s[h + 1]),
                        o > 2 && (p.z = s[h + 2]),
                        o > 3 && (p.score = (d = s[h + 3],
                        1 / (1 + Math.exp(-d)))),
                        a.push(p);
                    for (c = 0; c < a.length; ++c)
                        (p = a[c]).x = p.x / t.inputImageWidth,
                        p.y = p.y / t.inputImageHeight,
                        p.z = p.z / t.inputImageWidth / (t.normalizeZ || 1);
                    return [2, a]
                }
                var d
            }
            ))
        }
        ))
    }
    function j(e, t, i) {
        var n = e.width
          , r = e.height
          , o = e.rotation;
        if (null == i.rotation && null == i.rotationDegree || (o = function(e, t) {
            null != t.rotation ? e += t.rotation : null != t.rotationDegree && (e += Math.PI * t.rotationDegree / 180);
            return x(e)
        }(o, i)),
        0 === o)
            e.xCenter = e.xCenter + n * i.shiftX,
            e.yCenter = e.yCenter + r * i.shiftY;
        else {
            var s = (t.width * n * i.shiftX * Math.cos(o) - t.height * r * i.shiftY * Math.sin(o)) / t.width
              , a = (t.width * n * i.shiftX * Math.sin(o) + t.height * r * i.shiftY * Math.cos(o)) / t.height;
            e.xCenter = e.xCenter + s,
            e.yCenter = e.yCenter + a
        }
        if (i.squareLong) {
            var l = Math.max(n * t.width, r * t.height);
            n = l / t.width,
            r = l / t.height
        } else if (i.squareShort) {
            var u = Math.min(n * t.width, r * t.height);
            n = u / t.width,
            r = u / t.height
        }
        return e.width = n * i.scaleX,
        e.height = r * i.scaleY,
        e
    }
    var H = function() {
        function e(e) {
            this.alpha = e.alpha
        }
        return e.prototype.apply = function(e) {
            var t = this;
            if (null == e)
                return this.visibilityFilters = null,
                null;
            null != this.visibilityFilters && this.visibilityFilters.length === e.length || (this.visibilityFilters = e.map((function(e) {
                return new S(t.alpha)
            }
            )));
            for (var i = [], n = 0; n < e.length; ++n) {
                var r = e[n]
                  , o = s({}, r);
                o.score = this.visibilityFilters[n].apply(r.score),
                i.push(o)
            }
            return i
        }
        ,
        e
    }()
      , U = {
        reduceBoxesInLowestlayer: !1,
        interpolatedScaleAspectRatio: 1,
        featureMapHeight: [],
        featureMapWidth: [],
        numLayers: 5,
        minScale: .1484375,
        maxScale: .75,
        inputSizeHeight: 224,
        inputSizeWidth: 224,
        anchorOffsetX: .5,
        anchorOffsetY: .5,
        strides: [8, 16, 32, 32, 32],
        aspectRatios: [1],
        fixedAnchorSize: !0
    }
      , X = {
        runtime: "tfjs",
        modelType: "full",
        enableSmoothing: !0,
        detectorModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",
        landmarkModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/1"
    }
      , W = {
        maxPoses: 1,
        flipHorizontal: !1
    }
      , Y = {
        applyExponentialOnBoxSize: !1,
        flipVertically: !1,
        ignoreClasses: [],
        numClasses: 1,
        numBoxes: 2254,
        numCoords: 12,
        boxCoordOffset: 0,
        keypointCoordOffset: 4,
        numKeypoints: 4,
        numValuesPerKeypoint: 2,
        sigmoidScore: !0,
        scoreClippingThresh: 100,
        reverseOutputOrder: !0,
        xScale: 224,
        yScale: 224,
        hScale: 224,
        wScale: 224,
        minScoreThresh: .5
    }
      , G = -1
      , Q = .3
      , Z = {
        shiftX: 0,
        shiftY: 0,
        scaleX: 1.25,
        scaleY: 1.25,
        squareLong: !0
    }
      , $ = {
        inputResolution: {
            width: 224,
            height: 224
        },
        keepAspectRatio: !0
    }
      , J = {
        inputResolution: {
            width: 256,
            height: 256
        },
        keepAspectRatio: !0
    }
      , ee = {
        numLandmarks: 39,
        inputImageWidth: 256,
        inputImageHeight: 256
    }
      , te = {
        numLandmarks: 39,
        inputImageWidth: 1,
        inputImageHeight: 1
    }
      , ie = {
        kernelSize: 7,
        minConfidenceToRefine: .5
    }
      , ne = {
        alpha: .1
    }
      , re = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: .05,
            beta: 80,
            derivateCutOff: 1,
            minAllowedObjectScale: 1e-6
        }
    }
      , oe = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: .01,
            beta: 10,
            derivateCutOff: 1,
            minAllowedObjectScale: 1e-6
        }
    }
      , se = {
        oneEuroFilter: {
            frequency: 30,
            minCutOff: .1,
            beta: 40,
            derivateCutOff: 1,
            minAllowedObjectScale: 1e-6,
            disableValueScaling: !0
        }
    };
    var ae = function() {
        function e(e, t, i, r) {
            this.detectorModel = e,
            this.landmarkModel = t,
            this.enableSmoothing = i,
            this.modelType = r,
            this.regionOfInterest = null,
            this.anchors = function(e) {
                for (var t = [], i = 0; i < e.numLayers; ) {
                    for (var n = [], r = [], o = [], s = [], a = i; a < e.strides.length && e.strides[a] === e.strides[i]; ) {
                        var l = A(e.minScale, e.maxScale, a, e.strides.length);
                        if (0 === a && e.reduceBoxesInLowestLayer)
                            o.push(1),
                            o.push(2),
                            o.push(.5),
                            s.push(.1),
                            s.push(l),
                            s.push(l);
                        else {
                            for (var u = 0; u < e.aspectRatios.length; ++u)
                                o.push(e.aspectRatios[u]),
                                s.push(l);
                            if (e.interpolatedScaleAspectRatio > 0) {
                                var h = a === e.strides.length - 1 ? 1 : A(e.minScale, e.maxScale, a + 1, e.strides.length);
                                s.push(Math.sqrt(l * h)),
                                o.push(e.interpolatedScaleAspectRatio)
                            }
                        }
                        a++
                    }
                    for (var c = 0; c < o.length; ++c) {
                        var p = Math.sqrt(o[c]);
                        n.push(s[c] / p),
                        r.push(s[c] * p)
                    }
                    var d = 0
                      , f = 0;
                    if (e.featureMapHeight.length > 0)
                        d = e.featureMapHeight[i],
                        f = e.featureMapWidth[i];
                    else {
                        var m = e.strides[i];
                        d = Math.ceil(e.inputSizeHeight / m),
                        f = Math.ceil(e.inputSizeWidth / m)
                    }
                    for (var y = 0; y < d; ++y)
                        for (var g = 0; g < f; ++g)
                            for (var v = 0; v < n.length; ++v) {
                                var x = {
                                    xCenter: (g + e.anchorOffsetX) / f,
                                    yCenter: (y + e.anchorOffsetY) / d,
                                    width: 0,
                                    height: 0
                                };
                                e.fixedAnchorSize ? (x.width = 1,
                                x.height = 1) : (x.width = r[v],
                                x.height = n[v]),
                                t.push(x)
                            }
                    i = a
                }
                return t
            }(U);
            var o = n.tensor1d(this.anchors.map((function(e) {
                return e.width
            }
            )))
              , s = n.tensor1d(this.anchors.map((function(e) {
                return e.height
            }
            )))
              , a = n.tensor1d(this.anchors.map((function(e) {
                return e.xCenter
            }
            )))
              , l = n.tensor1d(this.anchors.map((function(e) {
                return e.yCenter
            }
            )));
            this.anchorTensor = {
                x: a,
                y: l,
                w: o,
                h: s
            }
        }
        return e.prototype.estimatePoses = function(e, t, i) {
            return a(this, void 0, void 0, (function() {
                var r, o, a, u, c, p, d, f, m, y, g, x, k, M, S, T, P, _;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return r = function(e) {
                            var t;
                            if (null == (t = null == e ? W : s({}, e)).maxPoses && (t.maxPoses = 1),
                            t.maxPoses <= 0)
                                throw new Error("Invalid maxPoses " + t.maxPoses + ". Should be > 0.");
                            if (t.maxPoses > 1)
                                throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");
                            return t
                        }(t),
                        null == e ? (this.reset(),
                        [2, []]) : (this.maxPoses = r.maxPoses,
                        this.timestamp = null != i ? 1e3 * i : b(e) ? 1e6 * e.currentTime : null,
                        o = v(e),
                        a = n.tidy((function() {
                            return n.cast(w(e), "float32")
                        }
                        )),
                        null != (u = this.regionOfInterest) ? [3, 2] : [4, this.detectPose(a)]);
                    case 1:
                        if (0 === (c = l.sent()).length)
                            return this.reset(),
                            a.dispose(),
                            [2, []];
                        p = c[0],
                        u = this.poseDetectionToRoi(p, o),
                        l.label = 2;
                    case 2:
                        return [4, this.poseLandmarksByRoi(u, a)];
                    case 3:
                        return d = l.sent(),
                        a.dispose(),
                        null == d ? (this.reset(),
                        [2, []]) : (f = d.actualLandmarks,
                        m = d.auxiliaryLandmarks,
                        y = d.poseScore,
                        g = d.actualWorldLandmarks,
                        x = this.poseLandmarkFiltering(f, m, g, o),
                        k = x.actualLandmarksFiltered,
                        M = x.auxiliaryLandmarksFiltered,
                        S = x.actualWorldLandmarksFiltered,
                        T = this.poseLandmarksToRoi(M, o),
                        this.regionOfInterest = T,
                        null != (P = null != k ? z(k, o) : null) && P.forEach((function(e, t) {
                            e.name = h[t]
                        }
                        )),
                        null != (_ = S) && _.forEach((function(e, t) {
                            e.name = h[t]
                        }
                        )),
                        [2, [{
                            score: y,
                            keypoints: P,
                            keypoints3D: _
                        }]])
                    }
                }
                ))
            }
            ))
        }
        ,
        e.prototype.dispose = function() {
            this.detectorModel.dispose(),
            this.landmarkModel.dispose(),
            n.dispose([this.anchorTensor.x, this.anchorTensor.y, this.anchorTensor.w, this.anchorTensor.h])
        }
        ,
        e.prototype.reset = function() {
            this.regionOfInterest = null,
            this.visibilitySmoothingFilterActual = null,
            this.visibilitySmoothingFilterAuxiliary = null,
            this.landmarksSmoothingFilterActual = null,
            this.landmarksSmoothingFilterAuxiliary = null
        }
        ,
        e.prototype.detectPose = function(e) {
            return a(this, void 0, void 0, (function() {
                var t, i, r, o, s, a, u, h, c;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return t = M(e, $),
                        i = t.imageTensor,
                        r = t.padding,
                        o = C(i, [-1, 1]),
                        s = I(o, this.detectorModel),
                        a = s.boxes,
                        [4, V([u = s.scores, a], this.anchorTensor, Y)];
                    case 1:
                        return [4, N(l.sent(), this.maxPoses, Q, G)];
                    case 2:
                        return h = l.sent(),
                        c = function(e, t) {
                            void 0 === e && (e = []);
                            for (var i = t.left, n = t.top, r = t.left + t.right, o = t.top + t.bottom, s = 0; s < e.length; s++) {
                                var a = e[s]
                                  , l = a.locationData.relativeBoundingBox
                                  , u = (l.xMin - i) / (1 - r)
                                  , h = (l.yMin - n) / (1 - o)
                                  , c = l.width / (1 - r)
                                  , p = l.height / (1 - o);
                                l.xMin = u,
                                l.yMin = h,
                                l.width = c,
                                l.height = p;
                                for (var d = 0; d < a.locationData.relativeKeypoints.length; ++d) {
                                    var f = a.locationData.relativeKeypoints[d]
                                      , m = (f.x - i) / (1 - r)
                                      , y = (f.y - n) / (1 - o);
                                    f.x = m,
                                    f.y = y
                                }
                            }
                            return e
                        }(h, r),
                        n.dispose([i, o, u, a]),
                        [2, c]
                    }
                }
                ))
            }
            ))
        }
        ,
        e.prototype.poseDetectionToRoi = function(e, t) {
            return 0,
            1,
            j(E(e, t, {
                rotationVectorEndKeypointIndex: 1,
                rotationVectorStartKeypointIndex: 0,
                rotationVectorTargetAngleDegree: 90
            }), t, Z)
        }
        ,
        e.prototype.poseLandmarksByRoi = function(e, t) {
            return a(this, void 0, void 0, (function() {
                var i, r, o, a, u, h, c, p, d, f, m, y, g, v, x, w, k, b, S, T;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        if (i = M(t, J, e),
                        r = i.imageTensor,
                        o = i.padding,
                        a = C(r, [0, 1]),
                        "lite" !== this.modelType && "full" !== this.modelType && "heavy" !== this.modelType)
                            throw new Error("Model type must be one of lite, full or heavy,but got " + this.modelType);
                        return u = this.landmarkModel.execute(a, ["ld_3d", "output_poseflag", "activation_heatmap", "world_3d"]),
                        h = u[0],
                        c = u[1],
                        p = u[2],
                        d = u[3],
                        [4, c.data()];
                    case 1:
                        return (f = l.sent()[0]) < .5 ? (n.dispose(u),
                        n.dispose([r, a]),
                        [2, null]) : [4, K(h, ee)];
                    case 2:
                        return [4, L(m = l.sent(), p, ie)];
                    case 3:
                        return y = l.sent(),
                        g = function(e, t) {
                            var i = t.left
                              , n = t.top
                              , r = t.left + t.right
                              , o = t.top + t.bottom;
                            return e.map((function(e) {
                                return s({}, e, {
                                    x: (e.x - i) / (1 - r),
                                    y: (e.y - n) / (1 - o),
                                    z: e.z / (1 - r)
                                })
                            }
                            ))
                        }(y, o),
                        v = function(e, t, i) {
                            void 0 === i && (i = {
                                ignoreRotation: !1
                            });
                            for (var n = [], r = 0, o = e; r < o.length; r++) {
                                var a = o[r]
                                  , l = a.x - .5
                                  , u = a.y - .5
                                  , h = i.ignoreRotation ? 0 : t.rotation
                                  , c = Math.cos(h) * l - Math.sin(h) * u
                                  , p = Math.sin(h) * l + Math.cos(h) * u;
                                c = c * t.width + t.xCenter,
                                p = p * t.height + t.yCenter;
                                var d = a.z * t.width
                                  , f = s({}, a);
                                f.x = c,
                                f.y = p,
                                f.z = d,
                                n.push(f)
                            }
                            return n
                        }(g, e),
                        x = v.slice(0, 33),
                        w = v.slice(33, 35),
                        [4, K(d, te)];
                    case 4:
                        return k = l.sent(),
                        b = function(e, t, i) {
                            void 0 === i && (i = !0);
                            for (var n = [], r = 0; r < e.length; r++) {
                                var o = s({}, t[r]);
                                i && (o.score = e[r].score),
                                n.push(o)
                            }
                            return n
                        }(m, k, !0),
                        S = function(e, t) {
                            for (var i = [], n = 0, r = e; n < r.length; n++) {
                                var o = r[n]
                                  , a = o.x
                                  , l = o.y
                                  , u = t.rotation
                                  , h = Math.cos(u) * a - Math.sin(u) * l
                                  , c = Math.sin(u) * a + Math.cos(u) * l
                                  , p = s({}, o);
                                p.x = h,
                                p.y = c,
                                i.push(p)
                            }
                            return i
                        }(b, e),
                        T = S.slice(0, 33),
                        n.dispose(u),
                        n.dispose([r, a]),
                        [2, {
                            actualLandmarks: x,
                            auxiliaryLandmarks: w,
                            poseScore: f,
                            actualWorldLandmarks: T
                        }]
                    }
                }
                ))
            }
            ))
        }
        ,
        e.prototype.poseLandmarksToRoi = function(e, t) {
            return j(E(B(e), t, {
                rotationVectorStartKeypointIndex: 0,
                rotationVectorEndKeypointIndex: 1,
                rotationVectorTargetAngleDegree: 90
            }), t, Z)
        }
        ,
        e.prototype.poseLandmarkFiltering = function(e, t, i, n) {
            var r, o, s;
            if (null != this.timestamp && this.enableSmoothing) {
                var a = E(B(t), n, {
                    rotationVectorEndKeypointIndex: 0,
                    rotationVectorStartKeypointIndex: 1,
                    rotationVectorTargetAngleDegree: 90
                });
                null == this.visibilitySmoothingFilterActual && (this.visibilitySmoothingFilterActual = new H(ne)),
                r = this.visibilitySmoothingFilterActual.apply(e),
                null == this.visibilitySmoothingFilterAuxiliary && (this.visibilitySmoothingFilterAuxiliary = new H(ne)),
                o = this.visibilitySmoothingFilterAuxiliary.apply(t),
                s = this.visibilitySmoothingFilterActual.apply(i),
                null == this.landmarksSmoothingFilterActual && (this.landmarksSmoothingFilterActual = new R(re)),
                r = this.landmarksSmoothingFilterActual.apply(r, this.timestamp, n, !0, a),
                null == this.landmarksSmoothingFilterAuxiliary && (this.landmarksSmoothingFilterAuxiliary = new R(oe)),
                o = this.landmarksSmoothingFilterAuxiliary.apply(o, this.timestamp, n, !0, a),
                null == this.worldLandmarksSmoothingFilterActual && (this.worldLandmarksSmoothingFilterActual = new R(se)),
                s = this.worldLandmarksSmoothingFilterActual.apply(i, this.timestamp)
            } else
                r = e,
                o = t,
                s = i;
            return {
                actualLandmarksFiltered: r,
                auxiliaryLandmarksFiltered: o,
                actualWorldLandmarksFiltered: s
            }
        }
        ,
        e
    }();
    function le(e) {
        return a(this, void 0, void 0, (function() {
            var t, n, r, o, a, u;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return t = function(e) {
                        var t = s({}, null == e ? X : e);
                        if (null == t.enableSmoothing && (t.enableSmoothing = X.enableSmoothing),
                        null == t.modelType && (t.modelType = X.modelType),
                        null == t.detectorModelUrl && (t.detectorModelUrl = X.detectorModelUrl),
                        null == t.landmarkModelUrl)
                            switch (t.modelType) {
                            case "lite":
                                t.landmarkModelUrl = "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/lite/1";
                                break;
                            case "heavy":
                                t.landmarkModelUrl = "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/heavy/1";
                                break;
                            case "full":
                            default:
                                t.landmarkModelUrl = "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/1"
                            }
                        return t
                    }(e),
                    n = t.detectorModelUrl.indexOf("https://tfhub.dev") > -1,
                    r = t.landmarkModelUrl.indexOf("https://tfhub.dev") > -1,
                    [4, Promise.all([i.loadGraphModel(t.detectorModelUrl, {
                        fromTFHub: n
                    }), i.loadGraphModel(t.landmarkModelUrl, {
                        fromTFHub: r
                    })])];
                case 1:
                    return o = l.sent(),
                    a = o[0],
                    u = o[1],
                    [2, new ae(a,u,t.enableSmoothing,t.modelType)]
                }
            }
            ))
        }
        ))
    }
    var ue, he, ce = function() {
        function e(e) {
            !function(e) {
                if (e.maxTracks < 1)
                    throw new Error("Must specify 'maxTracks' to be at least 1, but encountered " + e.maxTracks);
                if (e.maxAge <= 0)
                    throw new Error("Must specify 'maxAge' to be positive, but encountered " + e.maxAge);
                if (void 0 !== e.keypointTrackerParams) {
                    if (e.keypointTrackerParams.keypointConfidenceThreshold < 0 || e.keypointTrackerParams.keypointConfidenceThreshold > 1)
                        throw new Error("Must specify 'keypointConfidenceThreshold' to be in the range [0, 1], but encountered " + e.keypointTrackerParams.keypointConfidenceThreshold);
                    if (e.keypointTrackerParams.minNumberOfKeypoints < 1)
                        throw new Error("Must specify 'minNumberOfKeypoints' to be at least 1, but encountered " + e.keypointTrackerParams.minNumberOfKeypoints);
                    for (var t = 0, i = e.keypointTrackerParams.keypointFalloff; t < i.length; t++) {
                        var n = i[t];
                        if (n <= 0)
                            throw new Error("Must specify each keypoint falloff parameterto be positive but encountered " + n)
                    }
                }
            }(e),
            this.tracks = [],
            this.maxTracks = e.maxTracks,
            this.maxAge = 1e3 * e.maxAge,
            this.minSimilarity = e.minSimilarity,
            this.nextID = 1
        }
        return e.prototype.apply = function(e, t) {
            this.filterOldTracks(t);
            var i = this.computeSimilarity(e);
            return this.assignTracks(e, i, t),
            this.updateTracks(t),
            e
        }
        ,
        e.prototype.getTracks = function() {
            return this.tracks.slice()
        }
        ,
        e.prototype.getTrackIDs = function() {
            return new Set(this.tracks.map((function(e) {
                return e.id
            }
            )))
        }
        ,
        e.prototype.filterOldTracks = function(e) {
            var t = this;
            this.tracks = this.tracks.filter((function(i) {
                return e - i.lastTimestamp <= t.maxAge
            }
            ))
        }
        ,
        e.prototype.assignTracks = function(e, t, i) {
            for (var n = Array.from(Array(t[0].length).keys()), r = [], o = 0, s = Array.from(Array(e.length).keys()); o < s.length; o++) {
                var a = s[o];
                if (0 !== n.length) {
                    for (var l = -1, u = -1, h = 0, c = n; h < c.length; h++) {
                        var p = c[h]
                          , d = t[a][p];
                        d >= this.minSimilarity && d > u && (l = p,
                        u = d)
                    }
                    if (l >= 0) {
                        var f = this.tracks[l];
                        f = Object.assign(f, this.createTrack(e[a], i, f.id)),
                        e[a].id = f.id;
                        var m = n.indexOf(l);
                        n.splice(m, 1)
                    } else
                        r.push(a)
                } else
                    r.push(a)
            }
            for (var y = 0, g = r; y < g.length; y++) {
                a = g[y];
                var v = this.createTrack(e[a], i);
                this.tracks.push(v),
                e[a].id = v.id
            }
        }
        ,
        e.prototype.updateTracks = function(e) {
            this.tracks.sort((function(e, t) {
                return t.lastTimestamp - e.lastTimestamp
            }
            )),
            this.tracks = this.tracks.slice(0, this.maxTracks)
        }
        ,
        e.prototype.createTrack = function(e, t, i) {
            var n = {
                id: i || this.nextTrackID(),
                lastTimestamp: t,
                keypoints: e.keypoints.slice().map((function(e) {
                    return s({}, e)
                }
                ))
            };
            return void 0 !== e.box && (n.box = s({}, e.box)),
            n
        }
        ,
        e.prototype.nextTrackID = function() {
            var e = this.nextID;
            return this.nextID += 1,
            e
        }
        ,
        e.prototype.remove = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            this.tracks = this.tracks.filter((function(t) {
                return !e.includes(t.id)
            }
            ))
        }
        ,
        e.prototype.reset = function() {
            this.tracks = []
        }
        ,
        e
    }(), pe = function(e) {
        function t(t) {
            return e.call(this, t) || this
        }
        return o(t, e),
        t.prototype.computeSimilarity = function(e) {
            var t = this;
            return 0 === e.length || 0 === this.tracks.length ? [[]] : e.map((function(e) {
                return t.tracks.map((function(i) {
                    return t.iou(e, i)
                }
                ))
            }
            ))
        }
        ,
        t.prototype.iou = function(e, t) {
            var i = Math.max(e.box.xMin, t.box.xMin)
              , n = Math.max(e.box.yMin, t.box.yMin)
              , r = Math.min(e.box.xMax, t.box.xMax)
              , o = Math.min(e.box.yMax, t.box.yMax);
            if (i >= r || n >= o)
                return 0;
            var s = (r - i) * (o - n);
            return s / (e.box.width * e.box.height + t.box.width * t.box.height - s)
        }
        ,
        t
    }(ce), de = function(e) {
        function t(t) {
            var i = e.call(this, t) || this;
            return i.keypointThreshold = t.keypointTrackerParams.keypointConfidenceThreshold,
            i.keypointFalloff = t.keypointTrackerParams.keypointFalloff,
            i.minNumKeyoints = t.keypointTrackerParams.minNumberOfKeypoints,
            i
        }
        return o(t, e),
        t.prototype.computeSimilarity = function(e) {
            if (0 === e.length || 0 === this.tracks.length)
                return [[]];
            for (var t = [], i = 0, n = e; i < n.length; i++) {
                for (var r = n[i], o = [], s = 0, a = this.tracks; s < a.length; s++) {
                    var l = a[s];
                    o.push(this.oks(r, l))
                }
                t.push(o)
            }
            return t
        }
        ,
        t.prototype.oks = function(e, t) {
            for (var i = this.area(t.keypoints) + 1e-6, n = 0, r = 0, o = 0; o < e.keypoints.length; ++o) {
                var s = e.keypoints[o]
                  , a = t.keypoints[o];
                if (!(s.score < this.keypointThreshold || a.score < this.keypointThreshold)) {
                    r += 1;
                    var l = Math.pow(s.x - a.x, 2) + Math.pow(s.y - a.y, 2)
                      , u = 2 * this.keypointFalloff[o];
                    n += Math.exp(-1 * l / (2 * i * Math.pow(u, 2)))
                }
            }
            return r < this.minNumKeyoints ? 0 : n / r
        }
        ,
        t.prototype.area = function(e) {
            var t = this
              , i = e.filter((function(e) {
                return e.score > t.keypointThreshold
            }
            ))
              , n = Math.min.apply(Math, [1].concat(i.map((function(e) {
                return e.x
            }
            ))))
              , r = Math.max.apply(Math, [0].concat(i.map((function(e) {
                return e.x
            }
            ))))
              , o = Math.min.apply(Math, [1].concat(i.map((function(e) {
                return e.y
            }
            ))));
            return (r - n) * (Math.max.apply(Math, [0].concat(i.map((function(e) {
                return e.y
            }
            )))) - o)
        }
        ,
        t
    }(ce);
    function fe(t) {
        switch (t) {
        case e.SupportedModels.BlazePose:
            return h.reduce((function(e, t, i) {
                return e[t] = i,
                e
            }
            ), {});
        case e.SupportedModels.PoseNet:
        case e.SupportedModels.MoveNet:
            return u.reduce((function(e, t, i) {
                return e[t] = i,
                e
            }
            ), {});
        default:
            throw new Error("Model " + t + " is not supported.")
        }
    }
    (ue = e.TrackerType || (e.TrackerType = {})).Keypoint = "keypoint",
    ue.BoundingBox = "boundingBox",
    (he = e.SupportedModels || (e.SupportedModels = {})).MoveNet = "MoveNet",
    he.BlazePose = "BlazePose",
    he.PoseNet = "PoseNet";
    var me = Object.freeze({
        __proto__: null,
        getKeypointIndexBySide: function(t) {
            switch (t) {
            case e.SupportedModels.BlazePose:
                return c;
            case e.SupportedModels.PoseNet:
            case e.SupportedModels.MoveNet:
                return p;
            default:
                throw new Error("Model " + t + " is not supported.")
            }
        },
        getAdjacentPairs: function(t) {
            switch (t) {
            case e.SupportedModels.BlazePose:
                return f;
            case e.SupportedModels.PoseNet:
            case e.SupportedModels.MoveNet:
                return d;
            default:
                throw new Error("Model " + t + " is not supported.")
            }
        },
        getKeypointIndexByName: fe
    })
      , ye = ["SinglePose.Lightning", "SinglePose.Thunder", "MultiPose.Lightning"]
      , ge = {
        modelType: "SinglePose.Lightning",
        enableSmoothing: !0
    }
      , ve = {}
      , xe = {
        frequency: 30,
        minCutOff: 2.5,
        beta: 300,
        derivateCutOff: 2.5,
        thresholdCutOff: .5,
        thresholdBeta: 5,
        disableValueScaling: !0
    }
      , we = {
        maxTracks: 18,
        maxAge: 1e3,
        minSimilarity: .2,
        keypointTrackerParams: {
            keypointConfidenceThreshold: .3,
            keypointFalloff: [.026, .025, .025, .035, .035, .079, .079, .072, .072, .062, .062, .107, .107, .087, .087, .089, .089],
            minNumberOfKeypoints: 4
        }
    }
      , ke = {
        maxTracks: 18,
        maxAge: 1e3,
        minSimilarity: .15,
        trackerParams: {}
    };
    function Me(e, t, i, n) {
        for (var r = {}, o = 0, s = u; o < s.length; o++) {
            var a = s[o];
            r[a] = [t[i[a]].y * n.height, t[i[a]].x * n.width]
        }
        if (function(e, t) {
            return (e[t.left_hip].score > .2 || e[t.right_hip].score > .2) && (e[t.left_shoulder].score > .2 || e[t.right_shoulder].score > .2)
        }(t, i)) {
            var l = (r.left_hip[0] + r.right_hip[0]) / 2
              , h = (r.left_hip[1] + r.right_hip[1]) / 2
              , c = function(e, t, i, n, r) {
                for (var o = ["left_shoulder", "right_shoulder", "left_hip", "right_hip"], s = 0, a = 0, l = 0; l < o.length; l++) {
                    (d = Math.abs(n - i[o[l]][0])) > s && (s = d),
                    (f = Math.abs(r - i[o[l]][1])) > a && (a = f)
                }
                for (var u = 0, h = 0, c = 0, p = Object.keys(i); c < p.length; c++) {
                    var d, f, m = p[c];
                    if (!(e[t[m]].score < .2))
                        (d = Math.abs(n - i[m][0])) > u && (u = d),
                        (f = Math.abs(r - i[m][1])) > h && (h = f)
                }
                return [s, a, u, h]
            }(t, i, r, l, h)
              , p = c[0]
              , d = c[1]
              , f = c[2]
              , m = c[3]
              , y = Math.max(1.9 * d, 1.9 * p, 1.2 * f, 1.2 * m)
              , g = [l - (y = Math.min(y, Math.max(h, n.width - h, l, n.height - l))), h - y];
            if (y > Math.max(n.width, n.height) / 2)
                return be(null == e, n);
            var v = 2 * y;
            return {
                yMin: g[0] / n.height,
                xMin: g[1] / n.width,
                yMax: (g[0] + v) / n.height,
                xMax: (g[1] + v) / n.width,
                height: (g[0] + v) / n.height - g[0] / n.height,
                width: (g[1] + v) / n.width - g[1] / n.width
            }
        }
        return be(null == e, n)
    }
    function be(e, t) {
        var i, n, r, o;
        return e ? t.width > t.height ? (i = 1,
        n = t.height / t.width,
        r = 0,
        o = (t.width / 2 - t.height / 2) / t.width) : (i = t.width / t.height,
        n = 1,
        r = (t.height / 2 - t.width / 2) / t.height,
        o = 0) : t.width > t.height ? (i = t.width / t.height,
        n = 1,
        r = (t.height / 2 - t.width / 2) / t.height,
        o = 0) : (i = 1,
        n = t.height / t.width,
        r = 0,
        o = (t.width / 2 - t.height / 2) / t.width),
        {
            yMin: r,
            xMin: o,
            yMax: r + i,
            xMax: o + n,
            height: i,
            width: n
        }
    }
    function Se(t) {
        var i, n = null == t ? ge : s({}, t);
        if (null == n.modelType)
            n.modelType = "SinglePose.Lightning";
        else if (ye.indexOf(n.modelType) < 0)
            throw new Error("Invalid architecture " + n.modelType + ". Should be one of " + ye);
        if (null == n.enableSmoothing && (n.enableSmoothing = !0),
        null != n.minPoseScore && (n.minPoseScore < 0 || n.minPoseScore > 1))
            throw new Error("minPoseScore should be between 0.0 and 1.0");
        if (null != n.multiPoseMaxDimension && (n.multiPoseMaxDimension % 32 != 0 || n.multiPoseMaxDimension < 128 || n.multiPoseMaxDimension > 512))
            throw new Error("multiPoseResolution must be a multiple of 32 and between 128 and 512");
        if ("MultiPose.Lightning" === n.modelType && null == n.enableTracking && (n.enableTracking = !0),
        "MultiPose.Lightning" === n.modelType && !0 === n.enableTracking)
            if (null == n.trackerType && (n.trackerType = e.TrackerType.BoundingBox),
            n.trackerType === e.TrackerType.Keypoint)
                null != n.trackerConfig ? n.trackerConfig = function(e) {
                    var t = Te(we, e);
                    t.keypointTrackerParams = s({}, we.keypointTrackerParams),
                    null != e.keypointTrackerParams && (null != e.keypointTrackerParams.keypointConfidenceThreshold && (t.keypointTrackerParams.keypointConfidenceThreshold = e.keypointTrackerParams.keypointConfidenceThreshold),
                    null != e.keypointTrackerParams.keypointFalloff && (t.keypointTrackerParams.keypointFalloff = e.keypointTrackerParams.keypointFalloff),
                    null != e.keypointTrackerParams.minNumberOfKeypoints && (t.keypointTrackerParams.minNumberOfKeypoints = e.keypointTrackerParams.minNumberOfKeypoints));
                    return t
                }(n.trackerConfig) : n.trackerConfig = we;
            else {
                if (n.trackerType !== e.TrackerType.BoundingBox)
                    throw new Error("Tracker type not supported by MoveNet");
                null != n.trackerConfig ? n.trackerConfig = (i = n.trackerConfig,
                Te(ke, i)) : n.trackerConfig = ke
            }
        return n
    }
    function Te(e, t) {
        var i = {
            maxTracks: e.maxTracks,
            maxAge: e.maxAge,
            minSimilarity: e.minSimilarity
        };
        return null != t.maxTracks && (i.maxTracks = t.maxTracks),
        null != t.maxAge && (i.maxAge = t.maxAge),
        null != t.minSimilarity && (i.minSimilarity = t.minSimilarity),
        i
    }
    var Pe = function() {
        function t(t, i) {
            this.moveNetModel = t,
            this.modelInputResolution = {
                height: 0,
                width: 0
            },
            this.keypointIndexByName = fe(e.SupportedModels.MoveNet),
            "SinglePose.Lightning" === i.modelType ? (this.modelInputResolution.width = 192,
            this.modelInputResolution.height = 192) : "SinglePose.Thunder" === i.modelType && (this.modelInputResolution.width = 256,
            this.modelInputResolution.height = 256),
            this.multiPoseModel = "MultiPose.Lightning" === i.modelType,
            this.multiPoseModel || (this.keypointFilter = new P(xe),
            this.cropRegionFilterYMin = new S(.9),
            this.cropRegionFilterXMin = new S(.9),
            this.cropRegionFilterYMax = new S(.9),
            this.cropRegionFilterXMax = new S(.9)),
            this.enableSmoothing = i.enableSmoothing,
            i.minPoseScore ? this.minPoseScore = i.minPoseScore : this.minPoseScore = .25,
            i.multiPoseMaxDimension ? this.multiPoseMaxDimension = i.multiPoseMaxDimension : this.multiPoseMaxDimension = 256,
            this.enableTracking = i.enableTracking,
            this.multiPoseModel && this.enableTracking && (i.trackerType === e.TrackerType.Keypoint ? this.tracker = new de(i.trackerConfig) : i.trackerType === e.TrackerType.BoundingBox && (this.tracker = new pe(i.trackerConfig)),
            this.enableSmoothing && (this.keypointFilterMap = new Map))
        }
        return t.prototype.runSinglePersonPoseModel = function(e) {
            return a(this, void 0, void 0, (function() {
                var t, i, r, o, s;
                return l(this, (function(a) {
                    switch (a.label) {
                    case 0:
                        if (4 !== (t = this.moveNetModel.execute(e)).shape.length || 1 !== t.shape[0] || 1 !== t.shape[1] || 17 !== t.shape[2] || 3 !== t.shape[3])
                            throw t.dispose(),
                            new Error("Unexpected output shape from model: [" + t.shape + "]");
                        return "webgpu" === n.getBackend() ? [3, 1] : (i = t.dataSync(),
                        [3, 3]);
                    case 1:
                        return [4, t.data()];
                    case 2:
                        i = a.sent(),
                        a.label = 3;
                    case 3:
                        for (t.dispose(),
                        r = {
                            keypoints: [],
                            score: 0
                        },
                        o = 0,
                        s = 0; s < 17; ++s)
                            r.keypoints[s] = {
                                y: i[3 * s],
                                x: i[3 * s + 1],
                                score: i[3 * s + 2]
                            },
                            r.keypoints[s].score > .2 && (++o,
                            r.score += r.keypoints[s].score);
                        return o > 0 && (r.score /= o),
                        [2, r]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.runMultiPersonPoseModel = function(e) {
            return a(this, void 0, void 0, (function() {
                var t, i, r, o, s, a, u, h;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        if (3 !== (t = this.moveNetModel.execute(e)).shape.length || 1 !== t.shape[0] || 56 !== t.shape[2])
                            throw t.dispose(),
                            new Error("Unexpected output shape from model: [" + t.shape + "]");
                        return "webgpu" === n.getBackend() ? [3, 1] : (i = t.dataSync(),
                        [3, 3]);
                    case 1:
                        return [4, t.data()];
                    case 2:
                        i = l.sent(),
                        l.label = 3;
                    case 3:
                        for (t.dispose(),
                        r = [],
                        o = i.length / 56,
                        s = 0; s < o; ++s)
                            for (r[s] = {
                                keypoints: []
                            },
                            a = 56 * s + 51,
                            r[s].box = {
                                yMin: i[a],
                                xMin: i[a + 1],
                                yMax: i[a + 2],
                                xMax: i[a + 3],
                                width: i[a + 3] - i[a + 1],
                                height: i[a + 2] - i[a]
                            },
                            u = 56 * s + 55,
                            r[s].score = i[u],
                            r[s].keypoints = [],
                            h = 0; h < 17; ++h)
                                r[s].keypoints[h] = {
                                    y: i[56 * s + 3 * h],
                                    x: i[56 * s + 3 * h + 1],
                                    score: i[56 * s + 3 * h + 2]
                                };
                        return [2, r]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.estimatePoses = function(e, t, i) {
            return void 0 === t && (t = ve),
            a(this, void 0, void 0, (function() {
                var r, o, a, h, c, p;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return t = function(e) {
                            return null == e ? ve : s({}, e)
                        }(t),
                        null == e ? (this.reset(),
                        [2, []]) : (null == i ? b(e) && (i = 1e6 * e.currentTime) : i *= 1e3,
                        r = w(e),
                        o = v(r),
                        a = n.expandDims(r, 0),
                        e instanceof n.Tensor || r.dispose(),
                        h = [],
                        this.multiPoseModel ? [3, 2] : [4, this.estimateSinglePose(a, o, i)]);
                    case 1:
                        return h = l.sent(),
                        [3, 4];
                    case 2:
                        return [4, this.estimateMultiplePoses(a, o, i)];
                    case 3:
                        h = l.sent(),
                        l.label = 4;
                    case 4:
                        for (c = 0; c < h.length; ++c)
                            for (p = 0; p < h[c].keypoints.length; ++p)
                                h[c].keypoints[p].name = u[p],
                                h[c].keypoints[p].y *= o.height,
                                h[c].keypoints[p].x *= o.width;
                        return [2, h]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.estimateSinglePose = function(e, t, i) {
            return a(this, void 0, void 0, (function() {
                var r, o, s, a, u = this;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return this.cropRegion || (this.cropRegion = be(null == this.cropRegion, t)),
                        r = n.tidy((function() {
                            var t = n.tensor2d([[u.cropRegion.yMin, u.cropRegion.xMin, u.cropRegion.yMax, u.cropRegion.xMax]])
                              , i = n.zeros([1], "int32")
                              , r = [u.modelInputResolution.height, u.modelInputResolution.width];
                            return n.cast(n.image.cropAndResize(e, t, i, r, "bilinear", 0), "int32")
                        }
                        )),
                        e.dispose(),
                        [4, this.runSinglePersonPoseModel(r)];
                    case 1:
                        if (o = l.sent(),
                        r.dispose(),
                        o.score < this.minPoseScore)
                            return this.reset(),
                            [2, []];
                        for (s = 0; s < o.keypoints.length; ++s)
                            o.keypoints[s].y = this.cropRegion.yMin + o.keypoints[s].y * this.cropRegion.height,
                            o.keypoints[s].x = this.cropRegion.xMin + o.keypoints[s].x * this.cropRegion.width;
                        return null != i && this.enableSmoothing && (o.keypoints = this.keypointFilter.apply(o.keypoints, i, 1)),
                        a = Me(this.cropRegion, o.keypoints, this.keypointIndexByName, t),
                        this.cropRegion = this.filterCropRegion(a),
                        [2, [o]]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.estimateMultiplePoses = function(e, t, i) {
            return a(this, void 0, void 0, (function() {
                var r, o, s, a, u, h, c, p, d, f, m, y = this;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return 32,
                        t.width > t.height ? (o = this.multiPoseMaxDimension,
                        s = Math.round(this.multiPoseMaxDimension * t.height / t.width),
                        r = n.image.resizeBilinear(e, [s, o]),
                        u = o,
                        h = 32 * Math.ceil(s / 32),
                        a = n.pad(r, [[0, 0], [0, h - s], [0, 0], [0, 0]])) : (o = Math.round(this.multiPoseMaxDimension * t.width / t.height),
                        s = this.multiPoseMaxDimension,
                        r = n.image.resizeBilinear(e, [s, o]),
                        u = 32 * Math.ceil(o / 32),
                        h = s,
                        a = n.pad(r, [[0, 0], [0, 0], [0, u - o], [0, 0]])),
                        r.dispose(),
                        e.dispose(),
                        c = n.cast(a, "int32"),
                        a.dispose(),
                        [4, this.runMultiPersonPoseModel(c)];
                    case 1:
                        for (p = l.sent(),
                        c.dispose(),
                        p = p.filter((function(e) {
                            return e.score >= y.minPoseScore
                        }
                        )),
                        f = 0; f < p.length; ++f)
                            for (d = 0; d < p[f].keypoints.length; ++d)
                                p[f].keypoints[d].y *= h / s,
                                p[f].keypoints[d].x *= u / o;
                        if (this.enableTracking && (this.tracker.apply(p, i),
                        this.enableSmoothing)) {
                            for (f = 0; f < p.length; ++f)
                                this.keypointFilterMap.has(p[f].id) || this.keypointFilterMap.set(p[f].id, new P(xe)),
                                p[f].keypoints = this.keypointFilterMap.get(p[f].id).apply(p[f].keypoints, i, 1);
                            m = this.tracker.getTrackIDs(),
                            this.keypointFilterMap.forEach((function(e, t) {
                                m.has(t) || y.keypointFilterMap.delete(t)
                            }
                            ))
                        }
                        return [2, p]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.filterCropRegion = function(e) {
            if (e) {
                var t = this.cropRegionFilterYMin.apply(e.yMin)
                  , i = this.cropRegionFilterXMin.apply(e.xMin)
                  , n = this.cropRegionFilterYMax.apply(e.yMax)
                  , r = this.cropRegionFilterXMax.apply(e.xMax);
                return {
                    yMin: t,
                    xMin: i,
                    yMax: n,
                    xMax: r,
                    height: n - t,
                    width: r - i
                }
            }
            return this.cropRegionFilterYMin.reset(),
            this.cropRegionFilterXMin.reset(),
            this.cropRegionFilterYMax.reset(),
            this.cropRegionFilterXMax.reset(),
            null
        }
        ,
        t.prototype.dispose = function() {
            this.moveNetModel.dispose()
        }
        ,
        t.prototype.reset = function() {
            this.cropRegion = null,
            this.resetFilters()
        }
        ,
        t.prototype.resetFilters = function() {
            this.keypointFilter.reset(),
            this.cropRegionFilterYMin.reset(),
            this.cropRegionFilterXMin.reset(),
            this.cropRegionFilterYMax.reset(),
            this.cropRegionFilterXMax.reset()
        }
        ,
        t
    }();
    function _e(e) {
        return void 0 === e && (e = ge),
        a(this, void 0, void 0, (function() {
            var t, r, o, s;
            return l(this, (function(a) {
                switch (a.label) {
                case 0:
                    return t = Se(e),
                    o = !0,
                    t.modelUrl ? (o = t.modelUrl.indexOf("https://tfhub.dev") > -1,
                    [4, i.loadGraphModel(t.modelUrl, {
                        fromTFHub: o
                    })]) : [3, 2];
                case 1:
                    return r = a.sent(),
                    [3, 4];
                case 2:
                    return s = void 0,
                    "SinglePose.Lightning" === t.modelType ? s = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4" : "SinglePose.Thunder" === t.modelType ? s = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4" : "MultiPose.Lightning" === t.modelType && (s = "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1"),
                    [4, i.loadGraphModel(s, {
                        fromTFHub: o
                    })];
                case 3:
                    r = a.sent(),
                    a.label = 4;
                case 4:
                    return "webgl" === n.getBackend() && n.env().set("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD", 0),
                    [2, new Pe(r,t)]
                }
            }
            ))
        }
        ))
    }
    var Fe = {
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: .75,
        inputResolution: {
            height: 257,
            width: 257
        }
    }
      , Oe = ["MobileNetV1", "ResNet50"]
      , ze = {
        MobileNetV1: [8, 16],
        ResNet50: [16]
    }
      , Re = [8, 16, 32]
      , Ce = {
        MobileNetV1: [.5, .75, 1],
        ResNet50: [1]
    }
      , Ee = [1, 2, 4]
      , Ae = {
        maxPoses: 1,
        flipHorizontal: !1
    }
      , Ie = {
        maxPoses: 5,
        flipHorizontal: !1,
        scoreThreshold: .5,
        nmsRadius: 20
    }
      , Be = [-123.15, -115.9, -103.06];
    function Ne(e) {
        return Math.floor(e / 2)
    }
    var Le = function() {
        function e(e, t) {
            this.priorityQueue = new Array(e),
            this.numberOfElements = -1,
            this.getElementValue = t
        }
        return e.prototype.enqueue = function(e) {
            this.priorityQueue[++this.numberOfElements] = e,
            this.swim(this.numberOfElements)
        }
        ,
        e.prototype.dequeue = function() {
            var e = this.priorityQueue[0];
            return this.exchange(0, this.numberOfElements--),
            this.sink(0),
            this.priorityQueue[this.numberOfElements + 1] = null,
            e
        }
        ,
        e.prototype.empty = function() {
            return -1 === this.numberOfElements
        }
        ,
        e.prototype.size = function() {
            return this.numberOfElements + 1
        }
        ,
        e.prototype.all = function() {
            return this.priorityQueue.slice(0, this.numberOfElements + 1)
        }
        ,
        e.prototype.max = function() {
            return this.priorityQueue[0]
        }
        ,
        e.prototype.swim = function(e) {
            for (; e > 0 && this.less(Ne(e), e); )
                this.exchange(e, Ne(e)),
                e = Ne(e)
        }
        ,
        e.prototype.sink = function(e) {
            for (; 2 * e <= this.numberOfElements; ) {
                var t = 2 * e;
                if (t < this.numberOfElements && this.less(t, t + 1) && t++,
                !this.less(e, t))
                    break;
                this.exchange(e, t),
                e = t
            }
        }
        ,
        e.prototype.getValueAt = function(e) {
            return this.getElementValue(this.priorityQueue[e])
        }
        ,
        e.prototype.less = function(e, t) {
            return this.getValueAt(e) < this.getValueAt(t)
        }
        ,
        e.prototype.exchange = function(e, t) {
            var i = this.priorityQueue[e];
            this.priorityQueue[e] = this.priorityQueue[t],
            this.priorityQueue[t] = i
        }
        ,
        e
    }();
    function Ve(e, t, i, n, r, o) {
        for (var s = o.shape, a = s[0], l = s[1], u = !0, h = Math.max(i - r, 0), c = Math.min(i + r + 1, a), p = h; p < c; ++p) {
            for (var d = Math.max(n - r, 0), f = Math.min(n + r + 1, l), m = d; m < f; ++m)
                if (o.get(p, m, e) > t) {
                    u = !1;
                    break
                }
            if (!u)
                break
        }
        return u
    }
    function qe(e) {
        return a(this, void 0, void 0, (function() {
            return l(this, (function(t) {
                return [2, Promise.all(e.map((function(e) {
                    return e.buffer()
                }
                )))]
            }
            ))
        }
        ))
    }
    function De(e, t, i, n) {
        return {
            y: n.get(e, t, i),
            x: n.get(e, t, i + 17)
        }
    }
    function Ke(e, t, i) {
        var n = De(e.heatmapY, e.heatmapX, e.id, i)
          , r = n.y
          , o = n.x;
        return {
            x: e.heatmapX * t + o,
            y: e.heatmapY * t + r
        }
    }
    function je(e, t, i, n) {
        var r = i.x
          , o = i.y;
        return e.some((function(e) {
            var i, s, a, l, u, h, c = e.keypoints;
            return i = o,
            s = r,
            a = c[n].y,
            l = c[n].x,
            (u = a - i) * u + (h = l - s) * h <= t
        }
        ))
    }
    var He = u.reduce((function(e, t, i) {
        return e[t] = i,
        e
    }
    ), {})
      , Ue = [["nose", "left_eye"], ["left_eye", "left_ear"], ["nose", "right_eye"], ["right_eye", "right_ear"], ["nose", "left_shoulder"], ["left_shoulder", "left_elbow"], ["left_elbow", "left_wrist"], ["left_shoulder", "left_hip"], ["left_hip", "left_knee"], ["left_knee", "left_ankle"], ["nose", "right_shoulder"], ["right_shoulder", "right_elbow"], ["right_elbow", "right_wrist"], ["right_shoulder", "right_hip"], ["right_hip", "right_knee"], ["right_knee", "right_ankle"]].map((function(e) {
        var t = e[0]
          , i = e[1];
        return [He[t], He[i]]
    }
    ))
      , Xe = Ue.map((function(e) {
        return e[1]
    }
    ))
      , We = Ue.map((function(e) {
        return e[0]
    }
    ));
    function Ye(e, t, i) {
        return e < t ? t : e > i ? i : e
    }
    function Ge(e, t, i, n) {
        return {
            y: Ye(Math.round(e.y / t), 0, i - 1),
            x: Ye(Math.round(e.x / t), 0, n - 1)
        }
    }
    function Qe(e, t) {
        return {
            x: e.x + t.x,
            y: e.y + t.y
        }
    }
    function Ze(e, t, i, n, r, o, s, a) {
        void 0 === a && (a = 2);
        for (var l = n.shape, h = l[0], c = l[1], p = {
            y: t.y,
            x: t.x
        }, d = Qe(p, function(e, t, i) {
            var n = i.shape[2] / 2;
            return {
                y: i.get(t.y, t.x, e),
                x: i.get(t.y, t.x, n + e)
            }
        }(e, Ge(p, o, h, c), s)), f = 0; f < a; f++) {
            var m = Ge(d, o, h, c)
              , y = De(m.y, m.x, i, r);
            d = Qe({
                x: m.x * o,
                y: m.y * o
            }, {
                x: y.x,
                y: y.y
            })
        }
        var g = Ge(d, o, h, c)
          , v = n.get(g.y, g.x, i);
        return {
            y: d.y,
            x: d.x,
            name: u[i],
            score: v
        }
    }
    function $e(e, t, i, n, r, o) {
        var s = t.shape[2]
          , a = Xe.length
          , l = new Array(s)
          , h = e.part
          , c = e.score
          , p = Ke(h, n, i);
        l[h.id] = {
            score: c,
            name: u[h.id],
            y: p.y,
            x: p.x
        };
        for (var d = a - 1; d >= 0; --d) {
            var f = Xe[d]
              , m = We[d];
            l[f] && !l[m] && (l[m] = Ze(d, l[f], m, t, i, n, o))
        }
        for (d = 0; d < a; ++d) {
            f = We[d],
            m = Xe[d];
            l[f] && !l[m] && (l[m] = Ze(d, l[f], m, t, i, n, r))
        }
        return l
    }
    function Je(e, t, i) {
        return i.reduce((function(i, n, r) {
            var o = n.y
              , s = n.x
              , a = n.score;
            return je(e, t, {
                y: o,
                x: s
            }, r) || (i += a),
            i
        }
        ), 0) / i.length
    }
    function et(e, t, i, n, r, o, s, u) {
        return void 0 === s && (s = .5),
        void 0 === u && (u = 20),
        a(this, void 0, void 0, (function() {
            var a, h, c, p, d, f, m, y, g, v, x, w;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return [4, qe([e, t, i, n])];
                case 1:
                    for (a = l.sent(),
                    h = a[0],
                    c = a[1],
                    p = a[2],
                    d = a[3],
                    f = [],
                    m = function(e, t, i) {
                        for (var n = i.shape, r = n[0], o = n[1], s = n[2], a = new Le(r * o * s,(function(e) {
                            return e.score
                        }
                        )), l = 0; l < r; ++l)
                            for (var u = 0; u < o; ++u)
                                for (var h = 0; h < s; ++h) {
                                    var c = i.get(l, u, h);
                                    c < e || Ve(h, c, l, u, t, i) && a.enqueue({
                                        score: c,
                                        part: {
                                            heatmapY: l,
                                            heatmapX: u,
                                            id: h
                                        }
                                    })
                                }
                        return a
                    }(s, 1, h),
                    y = u * u; f.length < o && !m.empty(); )
                        g = m.dequeue(),
                        v = Ke(g.part, r, c),
                        je(f, y, v, g.part.id) || (x = $e(g, h, c, r, p, d),
                        w = Je(f, y, x),
                        f.push({
                            keypoints: x,
                            score: w
                        }));
                    return [2, f]
                }
            }
            ))
        }
        ))
    }
    function tt(e) {
        var t = e.shape
          , i = t[0]
          , r = t[1]
          , o = t[2];
        return n.tidy((function() {
            var t, s, a = n.reshape(e, [i * r, o]), l = n.argMax(a, 0), u = n.expandDims(n.div(l, n.scalar(r, "int32")), 1), h = n.expandDims((t = l,
            s = r,
            n.tidy((function() {
                var e = n.div(t, n.scalar(s, "int32"));
                return n.sub(t, n.mul(e, n.scalar(s, "int32")))
            }
            ))), 1);
            return n.concat([u, h], 1)
        }
        ))
    }
    function it(e, t, i) {
        return n.tidy((function() {
            var r = function(e, t) {
                for (var i = [], r = 0; r < u.length; r++) {
                    var o = e.get(r, 0).valueOf()
                      , s = e.get(r, 1).valueOf()
                      , a = nt(o, s, r, t)
                      , l = a.x
                      , h = a.y;
                    i.push(h),
                    i.push(l)
                }
                return n.tensor2d(i, [u.length, 2])
            }(e, i);
            return n.add(n.cast(n.mul(e.toTensor(), n.scalar(t, "int32")), "float32"), r)
        }
        ))
    }
    function nt(e, t, i, n) {
        return {
            y: n.get(e, t, i),
            x: n.get(e, t, i + u.length)
        }
    }
    function rt(e, t, i) {
        return a(this, void 0, void 0, (function() {
            var n, r, o, s, a, h, c, p, d, f;
            return l(this, (function(l) {
                switch (l.label) {
                case 0:
                    return n = 0,
                    r = tt(e),
                    [4, Promise.all([e.buffer(), t.buffer(), r.buffer()])];
                case 1:
                    return o = l.sent(),
                    s = o[0],
                    a = o[1],
                    h = o[2],
                    [4, (c = it(h, i, a)).buffer()];
                case 2:
                    return p = l.sent(),
                    d = Array.from(function(e, t) {
                        for (var i = t.shape[0], n = new Float32Array(i), r = 0; r < i; r++) {
                            var o = t.get(r, 0)
                              , s = t.get(r, 1);
                            n[r] = e.get(o, s, r)
                        }
                        return n
                    }(s, h)),
                    f = d.map((function(e, t) {
                        return n += e,
                        {
                            y: p.get(t, 0),
                            x: p.get(t, 1),
                            score: e,
                            name: u[t]
                        }
                    }
                    )),
                    r.dispose(),
                    c.dispose(),
                    [2, {
                        keypoints: f,
                        score: n / f.length
                    }]
                }
            }
            ))
        }
        ))
    }
    function ot(e, t) {
        return (e - 1) % t == 0
    }
    var st = "https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/"
      , at = "https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";
    function lt(e, t) {
        return function(e, t) {
            return (e - 1) % t == 0
        }(e, t) ? e : Math.floor(e / t) * t + 1
    }
    var ut = function() {
        function e(e, t) {
            this.posenetModel = e;
            var i = this.posenetModel.inputs[0].shape;
            n.util.assert(-1 === i[1] && -1 === i[2], (function() {
                return "Input shape [" + i[1] + ", " + i[2] + "] must both be equal to or -1"
            }
            ));
            var r, o, s = (r = t.inputResolution,
            o = t.outputStride,
            {
                height: lt(r.height, o),
                width: lt(r.width, o)
            });
            !function(e) {
                n.util.assert(Re.indexOf(e) >= 0, (function() {
                    return "outputStride of " + e + " is invalid. It must be either 8 or 16."
                }
                ))
            }(t.outputStride),
            function(e, t) {
                n.util.assert(ot(e.height, t), (function() {
                    return "height of " + e.height + " is invalid for output stride " + t + "."
                }
                )),
                n.util.assert(ot(e.width, t), (function() {
                    return "width of " + e.width + " is invalid for output stride " + t + "."
                }
                ))
            }(s, t.outputStride),
            this.inputResolution = s,
            this.outputStride = t.outputStride,
            this.architecture = t.architecture
        }
        return e.prototype.estimatePoses = function(e, t) {
            return void 0 === t && (t = Ae),
            a(this, void 0, void 0, (function() {
                var i, r, o, a, u, h, c, p, d, f, m, y, g, x, w;
                return l(this, (function(l) {
                    switch (l.label) {
                    case 0:
                        return i = function(e) {
                            var t = e;
                            if (null == t.maxPoses && (t.maxPoses = 1),
                            t.maxPoses <= 0)
                                throw new Error("Invalid maxPoses " + t.maxPoses + ". Should be > 0.");
                            if (t.maxPoses > 1) {
                                if ((t = s({}, Ie, t)).scoreThreshold < 0 || t.scoreThreshold > 1)
                                    throw new Error("Invalid scoreThreshold " + t.scoreThreshold + ". Should be in range [0.0, 1.0]");
                                if (t.nmsRadius <= 0)
                                    throw new Error("Invalid nmsRadius " + t.nmsRadius + ".")
                            }
                            return t
                        }(t),
                        null == e ? [2, []] : (this.maxPoses = i.maxPoses,
                        r = M(e, {
                            inputResolution: this.inputResolution,
                            keepAspectRatio: !0
                        }),
                        o = r.imageTensor,
                        a = r.padding,
                        u = "ResNet50" === this.architecture ? n.add(o, Be) : C(o, [-1, 1]),
                        h = this.posenetModel.predict(u),
                        "ResNet50" === this.architecture ? (c = n.squeeze(h[2], [0]),
                        p = n.squeeze(h[3], [0]),
                        d = n.squeeze(h[0], [0]),
                        f = n.squeeze(h[1], [0])) : (c = n.squeeze(h[0], [0]),
                        p = n.squeeze(h[1], [0]),
                        d = n.squeeze(h[2], [0]),
                        f = n.squeeze(h[3], [0])),
                        m = n.sigmoid(p),
                        1 !== this.maxPoses ? [3, 2] : [4, rt(m, c, this.outputStride)]);
                    case 1:
                        return g = l.sent(),
                        y = [g],
                        [3, 4];
                    case 2:
                        return [4, et(m, c, d, f, this.outputStride, this.maxPoses, i.scoreThreshold, i.nmsRadius)];
                    case 3:
                        y = l.sent(),
                        l.label = 4;
                    case 4:
                        return x = v(e),
                        w = function(e, t, i, n) {
                            var r = t.height
                              , o = t.width
                              , s = r / (i.height * (1 - n.top - n.bottom))
                              , a = o / (i.width * (1 - n.left - n.right))
                              , l = -n.top * i.height
                              , u = -n.left * i.width;
                            if (1 === a && 1 === s && 0 === l && 0 === u)
                                return e;
                            for (var h = 0, c = e; h < c.length; h++)
                                for (var p = 0, d = c[h].keypoints; p < d.length; p++) {
                                    var f = d[p];
                                    f.x = (f.x + u) * a,
                                    f.y = (f.y + l) * s
                                }
                            return e
                        }(y, x, this.inputResolution, a),
                        i.flipHorizontal && (w = function(e, t) {
                            for (var i = 0, n = e; i < n.length; i++)
                                for (var r = 0, o = n[i].keypoints; r < o.length; r++) {
                                    var s = o[r];
                                    s.x = t.width - 1 - s.x
                                }
                            return e
                        }(w, x)),
                        o.dispose(),
                        u.dispose(),
                        n.dispose(h),
                        c.dispose(),
                        p.dispose(),
                        d.dispose(),
                        f.dispose(),
                        m.dispose(),
                        [2, w]
                    }
                }
                ))
            }
            ))
        }
        ,
        e.prototype.dispose = function() {
            this.posenetModel.dispose()
        }
        ,
        e.prototype.reset = function() {}
        ,
        e
    }();
    function ht(e) {
        return void 0 === e && (e = Fe),
        a(this, void 0, void 0, (function() {
            var t, n, r, o, s;
            return l(this, (function(a) {
                switch (a.label) {
                case 0:
                    return "ResNet50" !== (t = function(e) {
                        var t = e || Fe;
                        if (null == t.architecture && (t.architecture = "MobileNetV1"),
                        Oe.indexOf(t.architecture) < 0)
                            throw new Error("Invalid architecture " + t.architecture + ". Should be one of " + Oe);
                        if (null == t.inputResolution && (t.inputResolution = {
                            height: 257,
                            width: 257
                        }),
                        null == t.outputStride && (t.outputStride = 16),
                        ze[t.architecture].indexOf(t.outputStride) < 0)
                            throw new Error("Invalid outputStride " + t.outputStride + ". Should be one of " + ze[t.architecture] + " for architecture " + t.architecture + ".");
                        if (null == t.multiplier && (t.multiplier = 1),
                        Ce[t.architecture].indexOf(t.multiplier) < 0)
                            throw new Error("Invalid multiplier " + t.multiplier + ". Should be one of " + Ce[t.architecture] + " for architecture " + t.architecture + ".");
                        if (null == t.quantBytes && (t.quantBytes = 4),
                        Ee.indexOf(t.quantBytes) < 0)
                            throw new Error("Invalid quantBytes " + t.quantBytes + ". Should be one of " + Ee + " for architecture " + t.architecture + ".");
                        if ("MobileNetV1" === t.architecture && 32 === t.outputStride && 1 !== t.multiplier)
                            throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");
                        return t
                    }(e)).architecture ? [3, 2] : (l = t.outputStride,
                    u = t.quantBytes,
                    h = "model-stride" + l + ".json",
                    n = 4 === u ? at + "float/" + h : at + "quant" + u + "/" + h,
                    [4, i.loadGraphModel(t.modelUrl || n)]);
                case 1:
                    return r = a.sent(),
                    [2, new ut(r,t)];
                case 2:
                    return o = function(e, t, i) {
                        var n = {
                            1: "100",
                            .75: "075",
                            .5: "050"
                        }
                          , r = "model-stride" + e + ".json";
                        return 4 === i ? st + "float/" + n[t] + "/" + r : st + "quant" + i + "/" + n[t] + "/" + r
                    }(t.outputStride, t.multiplier, t.quantBytes),
                    [4, i.loadGraphModel(t.modelUrl || o)];
                case 3:
                    return s = a.sent(),
                    [2, new ut(s,t)]
                }
                var l, u, h
            }
            ))
        }
        ))
    }
    var ct = {
        keypointsToNormalizedKeypoints: _
    }
      , pt = {
        modelType: {
            SINGLEPOSE_LIGHTNING: "SinglePose.Lightning",
            SINGLEPOSE_THUNDER: "SinglePose.Thunder",
            MULTIPOSE_LIGHTNING: "MultiPose.Lightning"
        }
    };
    e.calculators = ct,
    e.createDetector = function(t, i) {
        return a(this, void 0, void 0, (function() {
            var n, r;
            return l(this, (function(o) {
                switch (t) {
                case e.SupportedModels.PoseNet:
                    return [2, ht(i)];
                case e.SupportedModels.BlazePose:
                    if (r = void 0,
                    null != (n = i)) {
                        if ("tfjs" === n.runtime)
                            return [2, le(i)];
                        if ("mediapipe" === n.runtime)
                            return [2, g(i)];
                        r = n.runtime
                    }
                    throw new Error("Expect modelConfig.runtime to be either 'tfjs' or 'mediapipe', but got " + r);
                case e.SupportedModels.MoveNet:
                    return [2, _e(i)];
                default:
                    throw new Error(t + " is not a supported model name.")
                }
            }
            ))
        }
        ))
    }
    ,
    e.movenet = pt,
    e.util = me,
    Object.defineProperty(e, "__esModule", {
        value: !0
    })
}
));
