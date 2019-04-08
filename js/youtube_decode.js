// Youtube Decode (v0.0.1)
// Source - https://github.com/endlesshack/youtube-video

(function() {
  window.YoutubeVideo = function(id, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var video_info = xhttp.responseText

        var video;
        video = YoutubeVideo.decodeQueryString(video_info);
        if (video.status === "fail") {
          return callback(video);
        }
        video.sources = YoutubeVideo.decodeStreamMap(video.url_encoded_fmt_stream_map);
        video.getSource = function(type, quality) {
          var exact, key, lowest, source, _ref;
          lowest = null;
          exact = null;
          _ref = this.sources;
          for (key in _ref) {
            source = _ref[key];
            if (source.type.match(type)) {
console.log(source)
              if (source.quality.match(quality)) {
                exact = source;
              } else {
                lowest = source;
              }
            }
          }
          return exact || lowest;
        };
        return callback(video);
      }
    };
    xhttp.open("GET", "http://www.youtube.com/get_video_info?video_id=" + id, true);
    xhttp.send();
  };
  window.YoutubeVideo.decodeQueryString = function(queryString) {
    var key, keyValPair, keyValPairs, r, val, _i, _len;
    r = {};
    keyValPairs = queryString.split("&");
    for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
      keyValPair = keyValPairs[_i];
      key = decodeURIComponent(keyValPair.split("=")[0]);
      val = decodeURIComponent(keyValPair.split("=")[1] || "");
      r[key] = val;
    }
    return r;
  };
  window.YoutubeVideo.decodeStreamMap = function(url_encoded_fmt_stream_map) {
    var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
    sources = {};
    _ref = url_encoded_fmt_stream_map.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      urlEncodedStream = _ref[_i];
      stream = YoutubeVideo.decodeQueryString(urlEncodedStream);
      type = stream.type.split(";")[0];
      quality = stream.quality.split(",")[0];
      stream.original_url = stream.url;
      stream.url = "" + stream.url + "&signature=" + stream.sig;
      sources["" + type + " " + quality] = stream;
    }
    return sources;
  };
}).call(this);