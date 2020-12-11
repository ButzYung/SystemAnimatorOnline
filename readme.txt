(Document version 2.5)

Introduction:

  This is a PREVIEW version of "System Animator 11", which now works (partially) on web browsers (Google Chrome/Firefox only, for now) instead of being just a desktop gadget.

  For more information about System Animator, please visit the following page.
  http://www.animetheme.com/sidebar/

----------------------------

Featured Demos:

- 3D Miku The Dancer (drop any MP3 and she will dance for you)
  https://sao.animetheme.com/

- 3D Miku RPG
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku_rpg01

- 3D Vocaloid Fighters - Miku vs Teto
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku_battle_arena01

- 3D Multiplayer RPG (up to 3 players)
  https://sao.animetheme.com/SystemAnimator_online_multiplayer.html

- 3D Miku - Augmented Reality (AR) demo
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku00

  All demos support the use of custom MMD (MikuMikuDance) model. Drop a zip of your favorite MMD model at the beginning, press the START button, and the demo will proceed with your model instead of the default one.

----------------------------

Augmented Reality (AR) support:

  Some demos support the "Augmented Reality" (AR) mode on mobile phones, which renders the 3D models that appear as if they exist in the real world. The AR mode requires mobile phones that support Google's ARCore technology, Chrome browser and the experimental WebXR API. Follow the steps below.

1) Check below for a list of ARCore-supported devices.
   https://developers.google.com/ar/discover/supported-devices

2) Install "Google Play Services for AR" (ARCore) on Google Play.
   https://play.google.com/store/apps/details?id=com.google.ar.core

3) Install Chrome browser.

4) While WebXR support is on by default for Chrome, enabling certain WebXR-related flag(s) is recommended for extra features.

    1) Type chrome://flags in the URL bar.
    2) Type webxr in the Search flags input field.
    3) Set the "WebXR Incubations" (#webxr-incubations) flag to Enabled. This one is optional, but highly recommended.
    4) Tap RELAUNCH NOW to ensure the updated flags take effect.

    Still confused? Check out the following page (the "Ensure AR features are enabled on Chrome" paragraph).
    https://codelabs.developers.google.com/codelabs/ar-with-webxr/#1

  Are you ready for the AR experience? Check out the demo below with the AR feature enabled!
  https://sao.animetheme.com/?cmd_line=/TEMP/DEMO/miku00

  After the page has been fully loaded, click on the little phone button on the top-left (or bottom-left) menu to activate the AR mode. Once the AR mode is enabled, you will see what your phone's camera is showing. Move your camera around the ground where you want to place the 3D model, and a white circle should apppear. Double-tap on the screen, and the 3D model will be placed over the white circle. Double-tab again to re-summon the white circle if you want to place the model elsewhere.

  Check out these videos for demonstration.
  https://youtu.be/SkPRVoZGbPU
  https://youtu.be/G4tBwlAhFxY
  https://youtu.be/mdJAuW48CnQ


Selfie feature:

  The latested demo supports the AR selfie feature, using both the frond camera (for AR) AND the "selfie" camera, allowing you to take a selfie with Miku in AR mode. It runs directly on Chrome 83+ (which is still Beta right now). For Chrome 81 or older, some WebXR-related flags need to be enabled in order to use the AR selfie feature. To enjoy all features, the "WebXR Incubations" flag need to be enabled.

  Before you enter the AR mode, you need to click the Selfie icon and enable the Selfie mode first. Then you can toggle the Selfie mode at any time during the AR session. By default, Miku is always displayed in front of you in Selfie mode. Click the "BodyPix AI" icon to enable the AI mode, which detects your shape inside the camera, allowing Miku to blend into the background and appear to be behind you. Note that the AI mode is SLOW. You will probably need the latest Android phone to get a smooth frame rate.

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
    http://electron.atom.io/

  - three.js
    https://threejs.org/

  - jThree v2 (NOTE: jThree has been discontinued. Its successor is known as "Grimoire.js")
    https://github.com/GrimoireGL/GrimoireJS

  - ammo.js, a port of Bullet Physics to JavaScript, zlib licensed
    https://github.com/kripken/ammo.js

  - JSZip (used under MIT license)
    https://stuk.github.io/jszip/

  - PeerJS
    https://peerjs.com/

- Other third-party assests:

  - "Appearance Miku" 3D Model
    - Readme/License:
      http://www.animetheme.com/system_animator_online/jThree/model/Appearance%20Miku/Readme.txt

  - ローポリ雑魚敵 by 黒胡椒 さん
    http://www.nicovideo.jp/watch/sm11196123

  - 気休めモーション配布 by モコキッカー さん
    http://www.nicovideo.jp/watch/sm24249428

  - 格闘シーン簡易作成用モーション by spinach さん
    http://www.nicovideo.jp/watch/sm29537433

  - Some texture/image sources
    https://3dtextures.me/
    https://opengameart.org/content/rpg-inventory
    https://opengameart.org/content/fantasy-icon-pack-by-ravenmore-0
    https://opengameart.org/content/potion-bottles

  - 3D skydome textures by Ryntaro Nukata/額田倫太郎
    http://www.geocities.jp/miew_miew_fc/MMD.htm 

  - Simple Explosion by Bleed
    https://remusprites.carbonmade.com/
    https://opengameart.org/content/simple-explosion-bleeds-game-art

  - Cartoon_Punch_02.wav by RSilveira_88
    https://freesound.org/people/RSilveira_88/sounds/216198/

  - Various 3D background effects ported and modified from codes found on "Shadertoy"
    https://www.shadertoy.com/


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
  http://www.animetheme.com/sidebar/

- YouTube:
  https://www.youtube.com/user/AnimeThemeGadget

- Facebook:
  https://www.facebook.com/AnimeThemeGadgets/

- Twitter:
  https://twitter.com/butz_yung

- Email:
  webmaster@animetheme.com
