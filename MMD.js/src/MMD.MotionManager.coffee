class MMD.MotionManager
  constructor: ->
    @modelMotions = []
    @cameraMotion = []
    @cameraFrames = []
    @lightMotion = []
    @lightFrames = []
    @lastFrame = 0
    return

  addModelMotion: (model, motion, merge_flag, frame_offset) ->
    for mm, i in @modelMotions
      break if model == mm.model

    if i == @modelMotions.length
      mm = new ModelMotion(model)
      @modelMotions.push(mm)

    mm.addBoneMotion(motion.bone, merge_flag, frame_offset)
    mm.addMorphMotion(motion.morph, merge_flag, frame_offset)

    @lastFrame = mm.lastFrame
    return

  getModelFrame: (model, frame) ->
    for mm, i in @modelMotions
      break if model == mm.model

    return {} if i == @modelMotions.length

    return {
      bones: mm.getBoneFrame(frame)
      morphs: mm.getMorphFrame(frame)
    }

  addCameraLightMotion: (motion, merge_flag, frame_offset) ->
    @addCameraMotoin(motion.camera, merge_flag, frame_offset)
    @addLightMotoin(motion.light, merge_flag, frame_offset)
    return

  addCameraMotoin: (camera, merge_flag, frame_offset) ->
    return if camera.length == 0
    if not merge_flag
      @cameraMotion = []
      @cameraFrames = []

    frame_offset = frame_offset || 0

    for c in camera
      frame = c.frame + frame_offset
      @cameraMotion[frame] = c
      @cameraFrames.push(frame)
      @lastFrame = frame if @lastFrame < frame
    @cameraFrames = @cameraFrames.sort((a, b) -> a - b)
    return

  addLightMotoin: (light, merge_flag, frame_offset) ->
    return if light.length == 0
    if not merge_flag
      @lightMotion = []
      @lightFrames = []

    frame_offset = frame_offset || 0

    for l in light
      frame = l.frame + frame_offset
      @lightMotion[frame] = l
      @lightFrames.push(frame)
      @lastFrame = frame if @lastFrame < frame
    @lightFrames = @lightFrames.sort((a, b) -> a - b)
    return

  getCameraFrame: (frame) ->
    return null if not @cameraMotion.length
    timeline = @cameraMotion
    frames = @cameraFrames
    lastFrame = frames[frames.length - 1]
    if lastFrame <= frame
      camera = timeline[lastFrame]
    else
      idx = previousRegisteredFrame(frames, frame)
      p = frames[idx]
      n = frames[idx + 1]
      frac = fraction(frame, p, n)
      prev = timeline[p] # previous registered frame
      next = timeline[n] # next registered frame

      cache = []
      bez = (i)->
        X1 = next.interpolation[i * 4    ]
        X2 = next.interpolation[i * 4 + 1]
        Y1 = next.interpolation[i * 4 + 2]
        Y2 = next.interpolation[i * 4 + 3]
        id = X1 | (X2 << 8) | (Y1 << 16) | (Y2 << 24)
        return cache[id] if cache[id]?
        return cache[id] = frac if X1 == Y1 and X2 == Y2
        return cache[id] = bezierp(X1 / 127, X2 / 127, Y1 / 127, Y2 / 127, frac)

      camera = {
        location: vec3.createLerp3(prev.location, next.location, [bez(0), bez(1), bez(2)])
        rotation: vec3.createLerp(prev.rotation, next.rotation, bez(3))
        distance: lerp1(prev.distance, next.distance, bez(4))
        view_angle: lerp1(prev.view_angle, next.view_angle, bez(5))
      }

    return camera

  getLightFrame: (frame) ->
    return null if not @lightMotion.length
    timeline = @lightMotion
    frames = @lightFrames
    lastFrame = frames[frames.length - 1]
    if lastFrame <= frame
      light = timeline[lastFrame]
    else
      idx = previousRegisteredFrame(frames, frame)
      p = frames[idx]
      n = frames[idx + 1]
      frac = fraction(frame, p, n)
      prev = timeline[p] # previous registered frame
      next = timeline[n] # next registered frame

      light = {
        color: vec3.createLerp(prev.color, next.color, frac)
        location: vec3.lerp(prev.location, next.location, frac)
      }

    return light

class ModelMotion
  constructor: (@model) ->
    @boneMotions = {}
    @boneFrames = {}
    @morphMotions = {}
    @morphFrames = {}
    @lastFrame = 0

  addBoneMotion: (bone, merge_flag, frame_offset) ->
    if not merge_flag
      @boneMotions = {}
      @boneFrames = {}

    frame_offset = frame_offset || 0

    for b in bone
      if not @boneMotions[b.name] # set 0th frame
        @boneMotions[b.name] = [{location: vec3.create(), rotation: quat4.create([0, 0, 0, 1])}]

      frame = b.frame + frame_offset
      @boneMotions[b.name][frame] = b
      @lastFrame = frame if @lastFrame < frame

    for name of @boneMotions
      @boneFrames[name] = (@boneFrames[name] || []).
        concat(Object.keys(@boneMotions[name]).map(Number)).sort((a,b) -> a - b)

    return

  addMorphMotion: (morph, merge_flag, frame_offset) ->
    if not merge_flag
      @morphMotions = {}
      @morphFrames = {}

    frame_offset = frame_offset || 0

    for m in morph
      continue if m.name == 'base'
      @morphMotions[m.name] = [0] if !@morphMotions[m.name] # set 0th frame as 0
      frame = m.frame + frame_offset
      @morphMotions[m.name][frame] = m.weight
      @lastFrame = frame if @lastFrame < frame

    for name of @morphMotions
      @morphFrames[name] = (@morphFrames[name] || []).
        concat(Object.keys(@morphMotions[name]).map(Number)).sort((a,b) -> a - b)

    return

  getBoneFrame: (frame) ->
    bones = {}

    for name of @boneMotions
      timeline = @boneMotions[name]
      frames = @boneFrames[name]
      lastFrame = frames[frames.length - 1]
      if lastFrame <= frame
        bones[name] = timeline[lastFrame]
      else
        idx = previousRegisteredFrame(frames, frame)
        p = frames[idx]
        n = frames[idx + 1]
        frac = fraction(frame, p, n)
        prev = timeline[p]
        next = timeline[n]

        cache = []
        bez = (i)->
          X1 = next.interpolation[i * 4    ]
          X2 = next.interpolation[i * 4 + 1]
          Y1 = next.interpolation[i * 4 + 2]
          Y2 = next.interpolation[i * 4 + 3]
          id = X1 | (X2 << 8) | (Y1 << 16) | (Y2 << 24)
          return cache[id] if cache[id]?
          return cache[id] = frac if X1 == Y1 and X2 == Y2
          return cache[id] = bezierp(X1 / 127, X2 / 127, Y1 / 127, Y2 / 127, frac)

        if quat4.dot(prev.rotation, next.rotation) >= 0
          rotation = quat4.createSlerp(prev.rotation, next.rotation, bez(3))
        else
          r = prev.rotation
          rotation = quat4.createSlerp([-r[0], -r[1], -r[2], -r[3]], next.rotation, bez(3))

        bones[name] = {
          location: vec3.createLerp3(prev.location, next.location, [bez(0), bez(1), bez(2)])
          rotation: rotation
        }

    return bones

  getMorphFrame: (frame) ->
    morphs = {}

    for name of @morphMotions
      timeline = @morphMotions[name]
      frames = @morphFrames[name]
      lastFrame = frames[frames.length - 1]
      if lastFrame <= frame
        morphs[name] = timeline[lastFrame]
      else
        idx = previousRegisteredFrame(frames, frame)
        p = frames[idx]
        n = frames[idx + 1]
        frac = fraction(frame, p, n)
        prev = timeline[p] # previous registered frame
        next = timeline[n] # next registered frame

        morphs[name] = lerp1(prev, next, frac)

    return morphs


# utils
previousRegisteredFrame = (frames, frame) ->
  ###
    'frames' is key frames registered, 'frame' is the key frame I'm enquiring about
    ex. frames: [0,10,20,30,40,50], frame: 15
    now I want to find the numbers 10 and 20, namely the ones before 15 and after 15
    I'm doing a bisection search here.
  ###
  idx = 0
  delta = frames.length
  while true
    delta = (delta >> 1) || 1
    if frames[idx] <= frame
      break if delta == 1 and frames[idx + 1] > frame
      idx += delta
    else
      idx -= delta
      break if delta == 1 and frames[idx] <= frame
  return idx

fraction = (x, x0, x1) ->
  return (x - x0) / (x1 - x0)

lerp1 = (x0, x1, a) ->
  return x0 + a * (x1 - x0)

bezierp = (x1, x2, y1, y2, x) ->
  ###
    interpolate using Bezier curve (http://musashi.or.tv/fontguide_doc3.htm)
    Bezier curve is parametrized by t (0 <= t <= 1)
      x = s^3 x_0 + 3 s^2 t x_1 + 3 s t^2 x_2 + t^3 x_3
      y = s^3 y_0 + 3 s^2 t y_1 + 3 s t^2 y_2 + t^3 y_3
    where s is defined as s = 1 - t.
    Especially, for MMD, (x_0, y_0) = (0, 0) and (x_3, y_3) = (1, 1), so
      x = 3 s^2 t x_1 + 3 s t^2 x_2 + t^3
      y = 3 s^2 t y_1 + 3 s t^2 y_2 + t^3
    Now, given x, find t by bisection method (http://en.wikipedia.org/wiki/Bisection_method)
    i.e. find t such that f(t) = 3 s^2 t x_1 + 3 s t^2 x_2 + t^3 - x = 0
    One thing to note here is that f(t) is monotonically increasing in the range [0,1]
    Therefore, when I calculate f(t) for the t I guessed,
    Finally find y for the t.
  ###
  #Adopted from MMDAgent
  t = x
  while true
    v = ipfunc(t, x1, x2) - x
    break if v * v < 0.0000001 # Math.abs(v) < 0.0001
    tt = ipfuncd(t, x1, x2)
    break if tt == 0
    t -= v / tt
  return ipfunc(t, y1, y2)

ipfunc = (t, p1, p2) ->
  ((1 + 3 * p1 - 3 * p2) * t * t * t + (3 * p2 - 6 * p1) * t * t + 3 * p1 * t)

ipfuncd = (t, p1, p2) ->
  ((3 + 9 * p1 - 9 * p2) * t * t + (6 * p2 - 12 * p1) * t + 3 * p1)

