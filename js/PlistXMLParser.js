/*
 * PlistXMLParser
 * 
 * $Id: PlistXMLParser.js 86 2007-02-04 16:21:46Z mayuki $
 * Copyright (C) 2007 Mayuki Sawatari <mayuki@misuzilla.org>
 *
 * License: MIT License.
 */
 
// http://www.apple.com/DTDs/PropertyList-1.0.dtd
function _PlistXMLParser() {};
_PlistXMLParser.prototype = {
    fromXMLDocument : function (plistXmlDoc) {
        var plistChild = plistXmlDoc.documentElement.firstChild;
        return this.toObject(plistChild);
    },

    toObject : function (node) {
var v
        switch (node.tagName) {
            case 'dict':
                v = this.dictNode(node);
                break;
            case 'array':
                v = this.arrayNode(node);
                break;
            case 'string':
                v = node.firstChild.nodeValue;
                break;
            case 'true':
                v = true;
                break;
            case 'false':
                v = false;
                break;
            case 'real':
                v = parseFloat(node.firstChild.nodeValue);
                break;
            case 'integer':
                v = parseInt(node.firstChild.nodeValue);
                break;

            case 'date':
            case 'data':
            // TODO:
                v = node.firstChild.nodeValue;
                break;

default:
// Firefox/XUL workaround
  if (node.nextSibling)
    v = this.toObject(node.nextSibling)
        }

        return v
    },
    
    dictNode : function (dictNode) {
        var obj = {};
        var keyNodes = (xul_mode || webkit_mode) ? dictNode.ownerDocument.selectNodes("key", dictNode) : dictNode.selectNodes("key");
        for (var i = 0, n = keyNodes.length; i < n; i++) {
            obj[keyNodes[i].firstChild.nodeValue] = this.toObject(keyNodes[i].nextSibling);
        }
        return obj;
    },
    
    arrayNode : function (arrayNode) {
        var array = [];
        var arrayItems = arrayNode.childNodes;
        for (var i = 0, n = arrayItems.length; i < n; i++) {
          var item = arrayItems[i];
          if (item.tagName)
            array.push(this.toObject(item));
        }
        return array;
    }
};

var PlistXMLParser = new _PlistXMLParser();

// Firefox/XUL workaround
var xul_mode, webkit_mode

if (xul_mode || webkit_mode) {
       XMLDocument.prototype.selectNodes = function(cXPathString, xNode)
       {
          if( !xNode ) { xNode = this; } 
          var oNSResolver = this.createNSResolver(this.documentElement)
          var aItems = this.evaluate(cXPathString, xNode, oNSResolver, 
                       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
          var aResult = [];
          for( var i = 0; i < aItems.snapshotLength; i++)
          {
             aResult[i] =  aItems.snapshotItem(i);
          }
          return aResult;
       }
}