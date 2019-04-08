/**
 * @fileoverview Random fractal terrain generator.
 * @author Xueqiao Xu <xueqiaoxu@gmail.com>
 */

// create local scope
(function() {

  /**
   * Generate fractal terrain.
   * @param {number} width - Width of rectangle.
   * @param {number} height - Height of rectangle.
   * @param {number} smoothness - Higher this value, smoother the terrain.
   *      recommended value is 1.
   * @return {Array.<Array.<int>>} A two-dimensional array holding the elevations 
   *     of the vertices of the terrain.
   */
  function generateTerrain(width, height, smoothness) {
    var smoothness = typeof smoothness === 'undefined' ? 1 : smoothness;
    var size = smallestPowerOfTwoAfter(Math.max(width, height));

    var squareTerrain = generateSquareTerrain(size, smoothness);
    var terrain = [];
    // terrain is a matrix of size (width + 1) x (height + 1)
    for (var i = 0; i <= height; ++i) {
      terrain.push(squareTerrain[i].slice(0, width + 1));
    }

    return terrain;
  }

  function smallestPowerOfTwoAfter(n) {
    var ret = 1;
    while (ret < n) {
      ret <<= 1;
    }
    return ret;
  }

  /**
   * Generate a square fractal terrain.
   * @param {number} size - Size of terrain, MUST be a power of 2.
   * @param {number} smoothness - Higher this value, smoother the terrain.
   *      recommended value is 1.
   * @return {Array.<Array.<int>>} A two-dimensional array holding the elevations 
   *     of the vertices of the terrain. Each elevation will be between -1 and 1.
   */
  function generateSquareTerrain(size, smoothness) {
    // throw error if size is not a power of two.
    if (size & (size - 1)) {
      throw new Error('Expected terrain size to be a power of 2, received ' + 
                      size + ' instead.');
    }

    // generate a square matrix
    var mat = generateMatrix(size + 1);

    // iterate on the matrix using the square-diamond algorithm
    iterate(mat, smoothness);

    return mat;
  }

  /**
   * Generate a square matrix
   * @param {number} size - Width and length of the square.
   * @return {Array.<Array.<int>>} The vertices matrix of the square
   */
  function generateMatrix(size) {
    var matrix = [];

    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; ++j) {
        row.push(0);
      }
      matrix.push(row);
    };

    return matrix;
  }


  /**
   * Iterate on the matrix using Diamond-Square algorithm.
   * @param {Array.<Array.<int>>} matrix - Matrix to be iterated on.
   * @param {number} smoothness - Smoothness of terrain.
   */
  function iterate(matrix, smoothness) {
    // the count of iterations applied so far
    var counter = 0;
    // the total number of iterations to apply is log_2^(size of matrix)
    var numIteration = Math.log(matrix.length - 1) / Math.LN2;
    while (counter++ < numIteration) {
      diamond(matrix, counter, smoothness);
      square(matrix, counter, smoothness);
    }
  }


  /**
   * Diamond step of iteration.
   * @param {Array.<Array.<int>>} matrix - Matrix to iterate on.
   * @param {number} depth - Depth of current iteration(starts from 1).
   * @param {number} smoothness - Smoothness of terrain.
   */
  function diamond(matrix, depth, smoothness) {

    var len = matrix.length;
    var terrainSize = len - 1;
    var numSegs = 1 << (depth - 1);
    var span = terrainSize / numSegs;
    var half = span / 2;

    // enumerate sub-squares 
    // for each sub-square, the height of the center is caculated
    // by averaging the height of its four vertices plus a random offset.
    for (var x = 0; x < terrainSize; x += span) {
      for (var y = 0; y < terrainSize; y += span) {
        //  (x, y)
        //    \
        //     a---b---c
        //     |   |   |
        //     d---e---f
        //     |   |   |
        //     g---h---i
        // 
        //     \___ ___/
        //         V
        //       span 
        // 
        var va = [x, y];
        var vc = [x + span, y];
        var ve = [x + half, y + half];
        var vg = [x, y + span];
        var vi = [x + span, y + span];

        // heights of vertices
        var heights = [va, vc, vg, vi].map(function(v) {
          return matrix[v[1]][v[0]];
        });

        // average height
        var avg = average(heights);

        // random offset
        var offset = getH(smoothness, depth);

        // set center height
        matrix[ve[1]][ve[0]] = avg + offset;
      }
    }
  }


  /**
   * Square step of iteration.
   * @param {Array.<Array.<int>>} matrix - Matrix to iterate on.
   * @param {number} depth - Depth of current iteration(starts from 1).
   * @param {number} smoothness - Smoothness of terrain.
   */
  function square(matrix, depth, smoothness) {

    var len = matrix.length
    var terrainSize = len - 1;
    var numSegs = 1 << (depth - 1);
    var span = terrainSize / numSegs;
    var half = span / 2;

    // enumerate sub-dimaonds 
    for (var x = 0; x < terrainSize; x += span) {
      for (var y = 0; y < terrainSize; y += span) {
        // for each sub-square, the height of the center is caculated
        // by averaging the height of its four vertices plus a random offset.
        // for example, 
        //       h = avg(g, c, i, m) + random;
        //       f = avg(a, g, k, i) + random;
        //       j = f;
        //
        //  (x, y)
        //    \
        //     a---b---c---d---e
        //     | \ | / | \ | / |
        //     f---g---h---i---j
        //     | / | \ | / | \ |
        //     k---l---m---n---o
        //     | \ | / | \ | / |
        //     p---q---r---s---t
        //     | / | \ | / | \ |
        //     u---v---w---x---y
        // 
        //     \___ ___/
        //         V
        //       span 
        // 
        var va = [x, y];
        var vb = [x + half, y];
        var vc = [x + span, y];
        var vf = [x, y + half];
        var vg = [x + half, y + half];
        var vh = [x + span, y + half];
        var vk = [x, y + span];
        var vl = [x + half, y + span];
        var vm = [x + span, y + span];
        
        // right of h
        var vhr = [x + half * 3, y + half];
        if (vhr[0] > terrainSize) vhr[0] = half;

        // left of f
        var vfl = [x - half, y + half]
        if (vfl[0] < 0) vfl[0] = terrainSize - half;

        // under l
        var vlu = [x + half, y + half * 3];
        if (vlu[1] > terrainSize) vlu[1] = half;

        // above b
        var vba = [x + half, y - half]
        if (vba[1] < 0) vba[1] = terrainSize - half;

        squareHelper(matrix, depth, smoothness, va, vg, vk, vfl, vf);
        squareHelper(matrix, depth, smoothness, va, vba, vc, vg, vb);
        squareHelper(matrix, depth, smoothness, vc, vhr, vm, vg, vh);
        squareHelper(matrix, depth, smoothness, vk, vg, vm, vlu, vl);
      }
    }

    // set the elevations of the rightmost and bottom vertices to 
    // equal the leftmost and topmost ones'.
    for (var y = 0; y < terrainSize; y += span) {
      matrix[y][terrainSize] = matrix[y][0];
    }
    for (var x = 0; x < terrainSize; x += span) {
      matrix[terrainSize][x] = matrix[0][x];
    }
  }

  function squareHelper(matrix, depth, smoothness, a, b, c, d, t) {
    var heights = [a, b, c, d].map(function(v) {
      return matrix[v[1]][v[0]];
    });
    var avg = average(heights);
    var offset = getH(smoothness, depth);
    matrix[t[1]][t[0]] = avg + offset;
  }


  /**
   * Get a random offset.
   * @param {number} smoothness - Higher the value, smoother the terrain.
   *      recommended value is 1.
   * @param {number} depth - Depth of current iteration(starts from 1).
   */
// AT: custom random
var MT = Math;//new MersenneTwister(0);//
  function getH(smoothness, depth) {
    var sign = MT.random() > 0.5 ? 1 : -1;
    var reduce = 1;
    for (var i = 0; i < depth; ++i) { 
      reduce *= Math.pow(2, -smoothness);
    }
    return sign * MT.random() * reduce;
  }


  function average(numbers) {
    var sum = 0;
    numbers.forEach(function(v) {
      sum += v;
    });
    return sum / numbers.length;
  }


  // export to global
  var root;
  if (typeof exports !== 'undefined' && exports !== null) {
    root = exports;
  } else {
    root = window;
  }
  root.generateTerrain = generateTerrain;

}).call(this);
