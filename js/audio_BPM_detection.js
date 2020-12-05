/*
  The code for finding out the BPM / tempo is taken from this post:
  http://tech.beatport.com/2014/web-audio/beat-detection-using-web-audio/

  source: https://github.com/JMPerez/beats-audio-api
 */
// Audio BPM detection for SA (2020-10-27)

var BPM_by_id3 = 0

onmessage = function(e) {
  if (typeof e.data == "number") {
    BPM_by_id3 = e.data
    return
  }

  var buffer = new Float32Array(e.data)
  postMessage((BPM_by_id3) ? "BPM by id3:" + BPM_by_id3 : "(Counting BPM...)")

  var peaks = getPeaks(buffer);
  var groups = getIntervals(peaks);

/*
  var peaks,
    initialThresold = 0.9,
    thresold = initialThresold,
    minThresold = 0.3,
    minPeaks = ~~(buffer.length / 44100 * 0.5);

  do {
    peaks = getPeaksAtThreshold(buffer, thresold);
    thresold -= 0.05;
  } while (peaks.length < minPeaks && thresold >= minThresold);

  var intervals = countIntervalsBetweenNearbyPeaks(peaks);

  var groups = groupNeighborsByTempo(intervals, 44100);
*/

  var top_tempo = groups.sort(function(intA, intB) {
    return intB.count - intA.count;
  }).splice(0,3);

  postMessage("(Counting beats...)")

try {
  var tempo_final = 0
  var beat_count_final
  var beat_count_max_final = 1
  var beat_index_final = -1

  var tempo_list = []
  if (BPM_by_id3)
    tempo_list.push(BPM_by_id3)
  var tempo_list2 = []
  for (var i = 0, i_max = top_tempo.length; i < i_max; i++) {
    var champ = top_tempo[i]
    for (var tempo = champ.tempo-0.5; tempo <= champ.tempo+0.5; tempo += 0.1) {
      tempo_list.push(Math.round(tempo * 10) / 10)
      if (tempo*1.5 < 180)
        tempo_list2.push(Math.round(tempo*1.5 * 10) / 10)
    }
  }
  tempo_list = tempo_list.concat(tempo_list2)

  var tempo_checked = {}
  tempo_list.forEach(function (tempo) {
    if (tempo_checked[tempo])
      return
    tempo_checked[tempo] = true

    var beat_count = []
    var interval = Math.round(60/tempo * 44100)

    var length = peaks.length
    for (var i = 0; i < length; i++) {

      var _peak = peaks[i].position
//      var _peak = peaks[i]

      beat_count[i] = 0
      for (var j = 0; j < length; j++) {

        var beats = Math.abs(_peak - peaks[j].position) / interval
//        var beats = Math.abs(_peak - peaks[j]) / interval

        if (beats % 1 < 0.05)
          beat_count[i]++
      }
    }

    var beat_count_max = 1
    var beat_index = -1
    beat_count.forEach(function (count, idx) {
      if (beat_count_max < count) {
        beat_count_max = count
        beat_index = idx
      }
    });

    if (beat_count_max_final < beat_count_max) {
      beat_count_max_final = beat_count_max
      beat_index_final = beat_index
      beat_count_final = beat_count
      tempo_final = tempo
    }
  });

  var beat_zone = []
  for (var i = 0, i_max = Math.ceil(buffer.length / (44100 * 60)); i < i_max; i++)
    beat_zone[i] = { beat_count_max:0, beat_index:-1 }

  beat_count_final.forEach(function (count, idx) {

    var zone = beat_zone[~~(peaks[idx].position / (44100 * 60))]

    if (zone.beat_count_max < count) {
      zone.beat_count_max = count
      zone.beat_index = idx

      zone.beat_time = peaks[idx].position / 44100

    }
  });

  if (BPM_by_id3)
    beat_zone[0].BPM_by_id3 = BPM_by_id3
  beat_zone[0].tempo_list = top_tempo
  beat_zone[0].tempo_final = tempo_final
  beat_zone[0].beat_count_max_final = beat_count_max_final

//postMessage(JSON.stringify(beat_zone).replace(/\}\,/, "}, "))
  postMessage(beat_zone)
}
catch (err) { postMessage([]) }

  close();
};

/*
// v1 START
// Function to identify peaks
function getPeaksAtThreshold(data, threshold) {
  var peaksArray = [];
  var length = data.length;
  for(var i = 0; i < length;) {
    if (data[i] > threshold) {
      peaksArray.push(i);
      // Skip forward ~ 1/4s to get past this peak.
      i += 10000;
    }
    i++;
  }
  return peaksArray;
}

// Function used to return a histogram of peak intervals
function countIntervalsBetweenNearbyPeaks(peaks) {
  var intervalCounts = [];
  peaks.forEach(function(peak, index) {
    for(var i = 0; i < 10; i++) {
      var interval = peaks[index + i] - peak;
      var foundInterval = intervalCounts.some(function(intervalCount) {
        if (intervalCount.interval === interval) {
//          intervalCount.peaks.push(peak)
          return intervalCount.count++;
        }
      });
      if (!foundInterval) {
        intervalCounts.push({
          interval: interval,
          count: 1
//         ,peaks: [peak]
        });
      }
    }
  });
  return intervalCounts;
}

// Function used to return a histogram of tempo candidates.
function groupNeighborsByTempo(intervalCounts, sampleRate) {
  var tempoCounts = [];
  intervalCounts.forEach(function(intervalCount, i) {
    if (intervalCount.interval !== 0) {
      // Convert an interval to tempo
      var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      // AT: rounding to the nearest tenth
      theoreticalTempo = Math.round(theoreticalTempo*10)/10;
      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo) {
//          tempoCount.peaks = tempoCount.peaks.concat(intervalCount.peaks)
          return tempoCount.count += intervalCount.count;
        }
      });
      if (!foundTempo) {
        tempoCounts.push({
          tempo: theoreticalTempo,
          count: intervalCount.count
//         ,peaks: intervalCount.peaks
        });
      }
    }
  });
  return tempoCounts;
}
// v1 END
*/

// v2 START
function getPeaks(data) {

  // What we're going to do here, is to divide up our audio into parts.

  // We will then identify, for each part, what the loudest sample is in that
  // part.

  // It's implied that that sample would represent the most likely 'beat'
  // within that part.

  // Each part is 0.5 seconds long - or 22,050 samples.

  // This will give us 60 'beats' - we will only take the loudest half of
  // those.

  // This will allow us to ignore breaks, and allow us to address tracks with
  // a BPM below 120.

  var partSize = Math.round(22050/3),
// AT: single channel
      parts = data.length / partSize,
//      parts = data[0].length / partSize,
      peaks = [];

  for (var i = 0; i < parts; i++) {
    var max = 0;
    for (var j = i * partSize; j < (i + 1) * partSize; j++) {
// AT: single channel
      var volume = Math.abs(data[j]);
//      var volume = Math.max(Math.abs(data[0][j]), Math.abs(data[1][j]));
      if (!max || (volume > max.volume)) {
        max = {
          position: j,
          volume: volume
        };
      }
    }
    peaks.push(max);
  }

  // We then sort the peaks according to volume...
  peaks.sort(function(a, b) {
    return b.volume - a.volume;
  });

  // ...take the loundest half of those...

  peaks = peaks.splice(0, Math.round(peaks.length/4));

  // ...and re-sort it back based on position.

  peaks.sort(function(a, b) {
    return a.position - b.position;
  });

  return peaks;
}

function getIntervals(peaks) {

  // What we now do is get all of our peaks, and then measure the distance to
  // other peaks, to create intervals.  Then based on the distance between
  // those peaks (the distance of the intervals) we can calculate the BPM of
  // that particular interval.

  // The interval that is seen the most should have the BPM that corresponds
  // to the track itself.

  var groups = [];

  peaks.forEach(function(peak, index) {
    for (var i = 1; (index + i) < peaks.length && i < 10; i++) {
      var group = {
        tempo: (60 * 44100) / (peaks[index + i].position - peak.position),
        count: 1
      };

      while (group.tempo < 90) {
        group.tempo *= 2;
      }

      while (group.tempo > 180) {
        group.tempo /= 2;
      }

// AT: rounded to 1/10
//group.tempo = Math.round(group.tempo*10)/10;
group.tempo = Math.round(group.tempo);

      if (!(groups.some(function(interval) {
        return (interval.tempo === group.tempo ? interval.count++ : 0);
      }))) {
        groups.push(group);
      }
    }
  });
  return groups;
}
// v2 END

postMessage("OK");
