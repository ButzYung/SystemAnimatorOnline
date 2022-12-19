(Document version 4.0)

System Animator Online - Overview:

  We are proud to launch System Animator 11 Online, a major version advancement with focus on working as a web app instead of being just a desktop gadget. It fully supports MikuMikuDance (MMD) models and motions, as well as the latest VRM models and FBX/BVH motions, to create an immersive 3D environment.

  It's hard to describe what System Animator Online can do in a few words. From a simple animated CPU meter to an interactive 3D music visualizer, a simple AR gadget on your phone to a full-body motion tracking app on your PC, the possibility is endless.

  For more information about the desktop gadget version of System Animator, please visit the following page.
  https://www.animetheme.com/sidebar/

----------------------------

XR Animator:

  "XR　Animator" is our new featured web app based on System Animator Online, which supports full-body motion tracking using just a single webcam, right on your web browser. It uses the machine learning (ML) solution from MediaPipe and TensorFlow.js to detect the 3D poses from a live webcam video, which is then used to drive the 3D avatar (MMD/VRM model) as if you are controlling it with your body. It can be used for whatever XR purpose, and even for VTubing.

  It has a variety of motion tracking options. You can choose to track the face, full body, or something in between (any combination of face/body/hands).

  The online version works on all major web browsers both on desktop and smartphone. On browsers supporting both web worker and OffscreenCanvas (e.g. Chrome), it can achieve 60fps visual rendering and 30fps body pose detection on a medicore PC. On smartphones with limited processing power, you may want to use limit its usage on face tracking.

  XR Animator - online version
  https://sao.animetheme.com/XR_Animator.html

  The Windows app version (powered by Electron) is also availabe for download, which provides a few extra features (e.g. VMC-protocol, transparent background) available only in a native-OS environment.

----------------------------

XR Animator - Features:

- Support full-body AI motion tracking using a single webcam or media file (image/video)

- Support using any MMD/VRM model as your 3D avatar

- Record mocap motion and export it to VMD motion format

- Support loading VMD/BVH/FBX(Mixamo) format 3D motions

- Export BVH/FBX motions to VMD format

- Customize the background with still image, 3D panorama, 3D object (.x format), or a plain simple green screen for VTubing and video recording with a transparent background

- Support VMC-protocol to animate a 3D model elsewhere in other VMC-enabled applications such as VSeeFace, Unity and Unreal Engine (Electron mode only)

- Support frameless window with transparent background (via green screen) on video capture apps such as OBS (Electron mode only) (*)

- Support AR (Augmented Reality) on Chrome browser (Android only)

  Check out these video demos and watch XR Animator in action!
  https://youtube.com/playlist?list=PLLpwhHMvOCSt3i7NQcyJq1fFhoMiSmm5H

(*) - To capture the online version of XR Animator on OBS without the browser UI, you have to open XR Animator on OBS browser. A few extra command line parameters on OBS are required to allow camera access.
      https://twitter.com/yeemachine/status/1461908260638785540

----------------------------

XR Animator - Augmented Reality (AR) support:

  XR　Animator and some other demos of System Animator Online support the "Augmented Reality" (AR) mode on mobile phones, which renders the 3D models that appear as if they exist in the real world. The AR mode requires mobile phones that support Google's ARCore technology, Chrome browser and the new WebXR API. Follow the steps below.

1) Check below for a list of ARCore-supported devices.
   https://developers.google.com/ar/discover/supported-devices

2) Install "Google Play Services for AR" (ARCore) on Google Play.
   https://play.google.com/store/apps/details?id=com.google.ar.core

3) Install Chrome browser.

  Are you ready for the AR experience? Check out the demo below on your Android Chrome browser!
  https://sao.animetheme.com/XR_Animator.html

  After the page has been fully loaded, click on the little phone button on the top-left (or bottom-left) menu to activate the AR mode. Once the AR mode is enabled, you will see what your phone's camera is showing. Move your camera around the ground where you want to place the 3D model, and a white circle should apppear. Double-tap on the screen, and the 3D model will be placed over the white circle. Double-tab again to re-summon the white circle if you want to place the model elsewhere.

  Check out these videos for demonstration.
  https://youtu.be/SkPRVoZGbPU
  https://youtu.be/G4tBwlAhFxY
  https://youtu.be/mdJAuW48CnQ

----------------------------

XR Animator - AR Selfie feature:

  XR　Animator also supports the AR selfie feature, using both the frond camera (for AR) AND the "selfie" camera, allowing you to take a selfie with the 3D avatar in AR mode.

  Before you enter the AR mode, you need to click the Selfie icon and enable the Selfie mode first. Then you can toggle the Selfie mode at any time during the AR session. By default, Miku is always displayed in front of you in Selfie mode. Click the "BodyPix AI" icon to enable the AI mode, which detects your shape inside the camera, allowing Miku to blend into the background and appear to be behind you. Note that the AI mode is SLOW. You will probably need the latest Android phone to get a smooth frame rate.

  You may also use the "BodyPix AI" directly and display the 3D model behind you without going through the AR mode.

  Lastly, click the Snapshot icon and a still photo will be generated. This can be saved into your phone for whatever purpose you want, showing off to your friends perhaps!

  Check out the following video for demonstration.
  https://youtu.be/TIMPqV9lVH8

----------------------------

Donation:

  System Animator was born more than 10 years ago, and is still growing strong. While System Animator is free, lots of time, efforts and money have been spent to keep this project running. If you like our works, please consider making a donation. Your financial support is needed to keep us going!🙏

- Donate via PayPal.Me
  https://www.paypal.me/AnimeThemeGadgets

- Donate via Bitcoin
  1KkHVxgn4tusMhXNt1qFqSpiCiDRcqUh8p

----------------------------

XR Animator - Version history:

v0.0.1

  - Initial release

----------------------------

Other demos based on System Animator Online:

- 3D Miku The Dancer (drop any MP3 and she will dance for you)
  https://sao.animetheme.com/

- 3D Miku RPG
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku_rpg01

- 3D Vocaloid Fighters - Miku vs Teto
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku_battle_arena01

- 3D Multiplayer RPG (up to 3 players)
  https://sao.animetheme.com/SystemAnimator_online_multiplayer.html

  All demos support the use of custom MMD (MikuMikuDance) model. Drop a zip of your favorite MMD model at the beginning, press the START button, and the demo will proceed with your model instead of the default one.

----------------------------

Copyright/License/Credits:

- Core apps/libraries:

  - System Animator © Butz Yung/Anime Theme
    http://www.animetheme.com/sidebar/
    - License (CC BY-NC-SA 4.0) (*):
      http://creativecommons.org/licenses/by-nc-sa/4.0/
      (*) - System Animator's license does NOT cover any third-party assets which may have incompatible licenses of their own.
    - Disclaimer:
      http://www.animetheme.com/system_animator_online/docs/disclaimer.txt

  - Electron
    https://www.electronjs.org/

  - three.js
    https://threejs.org/

  - three-vrm
    https://github.com/pixiv/three-vrm

  - jThree v2 (NOTE: jThree has been discontinued. Its successor is known as "Grimoire.js")
    https://github.com/GrimoireGL/GrimoireJS

  - ammo.js, a port of Bullet Physics to JavaScript, zlib licensed
    https://github.com/kripken/ammo.js

  - JSZip (used under MIT license)
    https://stuk.github.io/jszip/

  - MediaPipe
    https://github.com/google/mediapipe

  - TensorFlow.js
    https://github.com/tensorflow/tfjs

  - osc-js
    https://github.com/adzialocha/osc-js

  - PeerJS
    https://peerjs.com/


- Other third-party assests:

  - "ニコニ立体ちゃん" 3D Model
    http://3d.nicovideo.jp/alicia/

  - "Appearance Miku" MMD Model
    - Readme/License:
      http://www.animetheme.com/system_animator_online/jThree/model/Appearance%20Miku/Readme.txt

  - ローポリ雑魚敵 by 黒胡椒 さん
    http://www.nicovideo.jp/watch/sm11196123

  - 気休めモーション配布 by モコキッカー さん
    http://www.nicovideo.jp/watch/sm24249428

  - 格闘シーン簡易作成用モーション by spinach さん
    http://www.nicovideo.jp/watch/sm29537433

  - Some texture/image/icon sources
    https://3dtextures.me/
    https://opengameart.org/content/rpg-inventory
    https://opengameart.org/content/fantasy-icon-pack-by-ravenmore-0
    https://opengameart.org/content/potion-bottles
    https://www.flaticon.com/
    https://www.iconfinder.com/
    https://icon-icons.com/en/pack/Social-Distancing/2274
    https://github.com/icons8/flat-color-icons
    https://www.behance.net/gallery/41818673/FREE-SPORT-ICONS

  - 3D skydome textures by Ryntaro Nukata/額田倫太郎
    http://ryntaro-n.anime.coocan.jp/MMD.htm

  - Simple Explosion by Bleed
    https://remusprites.carbonmade.com/
    https://opengameart.org/content/simple-explosion-bleeds-game-art

  - Cartoon_Punch_02.wav by RSilveira_88
    https://freesound.org/people/RSilveira_88/sounds/216198/

  - Various 3D background effects ported and modified from codes found on "Shadertoy"
    https://www.shadertoy.com/


- Other third-party assests used in some demos:

  - もぐ式りょう/りく/りょく/りん by Mogg
    https://3d.nicovideo.jp/works/td55798
    https://3d.nicovideo.jp/works/td55973
    https://3d.nicovideo.jp/works/td56074
    https://3d.nicovideo.jp/works/td56604

  - "Stranger Things" - A Remix ft. Michael Jobity
    https://soundcloud.com/foreignmachine/stranger-remix

  - Dragon Ball Super I Ultra Instinct OST I Clash of Gods Remix I Hip Hop Instrumental I @AndrezoWorks
    https://www.youtube.com/watch?v=KJ71dY4mkNo


- For some third-party programming libraries/3D data/assets used in System Animator, please refer to the corresponding script/readme for license and terms (can be found on the downloadable/Github version of System Animator).

- Credits are given to the authors of any other image/media files used in System Animator.

----------------------------

Contact:

- Homepage:
  https://www.animetheme.com/sidebar/

- YouTube:
  https://www.youtube.com/user/AnimeThemeGadget

- Facebook:
  https://www.facebook.com/AnimeThemeGadgets/

- Twitter:
  https://twitter.com/butz_yung

- Email:
  webmaster@animetheme.com
