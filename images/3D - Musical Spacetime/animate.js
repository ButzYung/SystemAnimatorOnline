// 3D Musical Spacetime

/**
Original:
 * https://www.shadertoy.com/view/llj3Rz
 *
 * NV15 Space Curvature
 */

var MMD_SA_options = {
  MMD_disabled: true

 ,MME: {
    PostProcessingEffects: {
  enabled: 1
 ,SSAA_scale: 0.1
// ,idle_effect_disabled: ((returnBoolean("UseAudioFFTLiveInput")) ? false : null)
// ,use_FXAA: true
// ,use_solid_bg: 1
// ,use_Diffusion: 1

 ,effects: [

//{name:"CopyShader"}

{ name:"NV15SpaceCurvature", shuffle_group_id:0, use_solid_bg:0, is_render_target:true, VisualizerSpacetimeGrid:1, VisualizerRainbowBlackhole:1 }

//   ,{ name:"NV15SpaceCurvature", shuffle_group_id:0, use_solid_bg:0 }
//   ,{ name:"AmbilightVisualization2", shuffle_group_id:0, use_solid_bg:0, opacity:0.8 }
/*
   ,{ name:"AudioSurfII", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"EmbellishedAV", shuffle_group_id:0, use_solid_bg:0 }

   ,{ name:"Ribbons", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"Cubescape", shuffle_group_id:0, use_solid_bg:0 }

    { name:"CombustibleVoronoi", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"GalaxyOfUniverses", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"NV15SpaceCurvature", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"DeformReliefTunnel", shuffle_group_id:0, use_solid_bg:0, tex0:"F:\\TEMP\\_eva_bg0.png" }//_avengers_tunnel.png" }
   ,{ name:"NoiseAnimationElectric", shuffle_group_id:0, use_solid_bg:0 }
//   ,{ name:"NoiseAnimationFlow", shuffle_group_id:0, use_solid_bg:0 }
   ,{ name:"SubterraneanFlyThrough", shuffle_group_id:0, use_solid_bg:1 }
   ,{ name:"AbstractCorridor", shuffle_group_id:0, use_solid_bg:1 }
   ,{ name:"RemnantX", shuffle_group_id:0, use_solid_bg:0, scale:0.5 }
   ,{ name:"EffectToNormalSize", use_solid_bg:0 }
   ,{ name:"FractalCondos", shuffle_group_id:0, use_solid_bg:1, scale:0.75 }
   ,{ name:"EffectToNormalSize", use_solid_bg:1 }
*/
//,

//    { name:"DiffusionX" }
//   ,{ name:"DiffusionY" }

  ]
    }
  }

// ,use_CircularSpectrum: true
};


(function () {
  if (!MMD_SA_options.use_JSARToolKit) {
    MMD_SA_options.width  = 960
    MMD_SA_options.height = 540
  }

  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.UseAudioFFT = "non_default"
  Settings_default._custom_.Use30FPS = "non_default"
//  Settings_default._custom_.Use32BandSpectrum = "non_default"
  Settings_default._custom_.UpdateInterval = "1"
  Settings_default._custom_.Display = "-1"
  Settings_default._custom_.DisableTransparency = "non_default"

/*
System._browser.wallpaper_opacity = 0.5
System._browser.wallpaper_bg_color = "black"
MMD_SA_options.MME.PostProcessingEffects.effects[0].opacity = 0.9
*/
MMD_SA_options.MME.PostProcessingEffects.effects[0].use_solid_bg = 1

  System._browser.tray_menu_custom = {
    para: {
      name: "Musical Spacetime"
     ,menu: [
  {label: 'Visualizer: Spacetime Grid', type: 'checkbox', click: 'CUSTOM:Musical Spacetime|VisualizerSpacetimeGrid'}
 ,{label: 'Visualizer: Rainbow Blackhole', type: 'checkbox', click: 'CUSTOM:Musical Spacetime|VisualizerRainbowBlackhole'}
      ]
    }

   ,update_tray: function (para) {
if (!MMD_SA._tray_updatable)
  return

var EC = MMD_SA_options.MME.PostProcessingEffects
var EC_by_name = (EC.effects_by_name["NV15SpaceCurvature"] || {});

para.custom_menu_status = {
  name: "Musical Spacetime"
 ,status: [
    { checked:!!((EC_by_name["VisualizerSpacetimeGrid"] == null) || EC_by_name["VisualizerSpacetimeGrid"]) }
   ,{ checked:!!((EC_by_name["VisualizerRainbowBlackhole"] == null) || EC_by_name["VisualizerRainbowBlackhole"]) }
  ]
}
    }

   ,process_func: function (para) {
if (para[0] != "Musical Spacetime")
  return

var v = !!parseInt(para[2])

var EC = MMD_SA_options.MME.PostProcessingEffects
var EC_by_name = (EC.effects_by_name["NV15SpaceCurvature"] || {});

switch (para[1]) {
  case "VisualizerSpacetimeGrid":
    EC_by_name["VisualizerSpacetimeGrid"] = v
//DEBUG_show(v,0,1)
    break
  case "VisualizerRainbowBlackhole":
    EC_by_name["VisualizerRainbowBlackhole"] = v
    break
}
    }
  }
})();


// main js
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
