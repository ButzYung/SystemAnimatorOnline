/*
 * vistaFace
 *
 * $Id: vistaFace.js 402 2008-08-18 20:06:28Z tomoyo $
 *
 * Modified by Butz Yung / Anime Theme for use with "System Animator" gadget
 * Homepage: http://www.animetheme.com/
 * Email: webmaster@animetheme.com
 *
 * License: MIT License
 */

var DEFAULT_FACEDEF_DIR = System.Gadget.path + "\\images\\MacFace01.mcface";
var EV_width = 128
var EV_height = 128

function _VistaFace() {
    this.mainFrame = null;
    this.faceDefDir = null;
    this.currentFace = null;
    this.partsBackground = null;

    // cache settings
    this._cache = {
        imgObjs: [],
        backgroundPartFilename : '',
        cpuUsageIndex : -1,
        memUsageIndex : -1,
        marker1 : -1,
        marker2 : -1
    };

    this.settings = {};
};

_VistaFace.prototype = {
    main : function () {
        try {
            this.initialize();
            this.setupFaceDef();
        } catch (e) {}
    }

    , initialize : function () {
//        this.mainFrame = document.getElementById("gadgetMainFrame");
        this.partsBackground = BG;

        this.settings.faceDefDir = Settings.f_path;
    }

    , setupFaceDef : function () {
        // load face
        this.currentFace = this.loadFaceDef(this.settings.faceDefDir);
        if (this.currentFace == null) {
            // default
            this.currentFace = this.loadFaceDef(DEFAULT_FACEDEF_DIR);
        }

// AT special START
var partNum_z = []

var p = this.currentFace.pattern
for (var i = 0; i < p.length; i++) {
  for (var j = 0; j < p[i].length; j++) {
    for (var z = 0; z < p[i][j].length; z++) {
      var partNum = p[i][j][z]

      var z_last = partNum_z[partNum]
      if (!z_last || (z > z_last))
        partNum_z[partNum] = z
    }
  }
}

var z_order = []
for (var i = 0; i < partNum_z.length; i++) {
  var z = partNum_z[i]

  if (!z_order[z])
    z_order[z] = []
  z_order[z].push(i)
}

var z_length = -1
this.partNum_z = []
for (var i = 0; i < z_order.length; i++) {
  var z = z_order[i]
  if (!z)
    continue

  for (var j = 0; j < z.length; j++) {
    this.partNum_z[z[j]] = ++z_length
  }
}
p = this.currentFace.markers
for (var i = 0; i < p.length; i++) {
  this.partNum_z[p[i]] = ++z_length
}

//setTimeout('DEBUG_show("' + this.partNum_z.join(", ") + '")', 1000)

// END

    }

    , loadFaceDef : function (name) {
        this.faceDefDir = name;
        this._cache.backgroundPartFilename = '';
        this._cache.imgObjs = [];
        return this.loadFaceDefPlist(name);
    }
    
    , loadFaceDefPlist : function (name) {
        var faceDefPlist = name + "\\faceDef.plist";
var plistXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
        try {
            plistXMLDoc.async = false;
            plistXMLDoc.resolveExternals = false;
            plistXMLDoc.validateOnParse = false;
            plistXMLDoc.load(faceDefPlist);

            return PlistXMLParser.fromXMLDocument(plistXMLDoc);
        } catch (e) {
            return null;
        }
    }
    
    , addPart : function (partNum) {
         var part = this.currentFace.parts[partNum];

         var imgObj = this._cache.imgObjs[part.filename];
         if (!imgObj) {
             imgObj = this.gimageObjs[this.partNum_z[partNum]];
             imgObj.src = this.faceDefDir + "\\" + part.filename
             imgObj.left = part['pos x']
             imgObj.top = 128 - part['pos y'] - imgObj.height;
             this._cache.imgObjs[part.filename] = imgObj;
         }
         imgObj.opacity = 100;
    }

    , switchPattern : function (cpuUsageIndex, memUsageIndex, marker1, marker2) {
        // compare cache
        if (this._cache.cpuUsageIndex == cpuUsageIndex &&
            this._cache.memUsageIndex == memUsageIndex &&
            this._cache.marker1 == marker1 &&
            this._cache.marker2 == marker2)
        {
            return;
        }

        // save cache
        this._cache.cpuUsageIndex = cpuUsageIndex;
        this._cache.memUsageIndex = memUsageIndex;
        this._cache.marker1 = marker1;
        this._cache.marker2 = marker2;

        // hide all parts
        for (var i in this._cache.imgObjs) {
            this._cache.imgObjs[i].opacity = 0;
        }

        for (var i = 0, n = this.currentFace.pattern[memUsageIndex][cpuUsageIndex].length; i < n; i++) {
            var partNum = this.currentFace.pattern[memUsageIndex][cpuUsageIndex][i];
            var part = this.currentFace.parts[partNum];
            if (i != 0) {
                this.addPart(partNum);
            } else {
              if (this._cache.backgroundPartFilename != part.filename) {
                this._cache.backgroundPartFilename = part.filename;
                this._cache.imgObjs = [];

                this.partsBackground.removeObjects();

// AT special START
this.gimageObjs = []
for (var k = 0; k < this.partNum_z.length; k++)
  this.gimageObjs.push(this.partsBackground.addImageObject("", 0,0))
// END
              }
              this.addPart(partNum);
            }
          
        }
        if (marker1) {
            var partNum = this.currentFace.markers[0];
            //var part = this.currentFace.parts[partNum];
            this.addPart(partNum);
        }
        if (marker2) {
            var partNum = this.currentFace.markers[1];
            //var part = this.currentFace.parts[partNum];
            this.addPart(partNum);
        }
    }
};
var VistaFace = new _VistaFace();
