(Document version 1.1)

Introduction:

  This is a simple role-playing game demo with MULTIPLAYER support, powered by the upcoming "System Animator 11" which can be used to make online or offline 3D game.

  This game works on Google Chrome and Firefox web browsers. Other browsers have not been tested.

  For more information about System Animator, please visit the following page.
  http://www.animetheme.com/sidebar/

----------------------------

Basic Control:

- Keyboard:
  - Move: WASD
  - Jump: SPACE
  - Dialog/event branch: Numpad 1-9

- Mouse:
  - Camera: drag to rotate, wheel to zoom in/out, double-click to reset
  - Item: double-click to use, drag to re-position
  - PC/NPC/object interaction: double-click

----------------------------

Multiplayer feature:

- Multiplayer gaming is implemented via P2P network (WebRTC/PeerJS). All in-game communications happen among the peers, which means no actual game data is passed through the server (signaling via PeerServer Cloud service).

- This demo game currently supports up to 3 players (including host).

- To host a game, type below in chatbox.

    /host

  This will announce your hosted game in the chatroom, so that other players can join your game by clicking the link.

  NOTE:

    - Once you start hosting a game, you cannot join games hosted by others without restarting.

    - If you decide to host your own game, you can actually press START without manually type the host command. After that, the host command will be automatically executed.

- Normally, you join a game automatically by clicking on the links on the chatbox. However, if you know the peer ID of a host, you can type below in chatbox to connect manually.

    /connect [peer ID]

  Example:
    /connect b5f2bebjemd00000

  NOTE:

    - Once you have successfully joined a game, you cannot host your own game or join another game without restarting.

    - If you press START without joining a game, you can only host your own game.

- The multiplayer feature is still under beta testing. Right now, there isn't much you can do in the game other than walking around. If you notice any bugs, let us know via the contact links at the bottom.  

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

  - JSZip (used under MIT license)
    https://stuk.github.io/jszip/

  - PeerJS
    https://peerjs.com/

  - Various 3D background effects ported and modified from codes found on "Shadertoy"
    https://www.shadertoy.com/

- Other assests:

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


  - もぐ式りょう/りく/りょく/りん by Mogg
    https://3d.nicovideo.jp/works/td55798
    https://3d.nicovideo.jp/works/td55973
    https://3d.nicovideo.jp/works/td56074
    https://3d.nicovideo.jp/works/td56604

  - かばんちゃん by schwarz
    https://3d.nicovideo.jp/works/td28971

  - 空色町 by SkyBlue
    http://seiga.nicovideo.jp/seiga/im2574844

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
