const crypto = require('crypto'),
i2a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
a2i = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
MAXINT = 4294967295;


function pack(a) {
  var b = "";
  for (var c = 0; c < a.length; c++) {
    var d = a.charAt(c);
    if (d == " " || d == "\t" || d == "\r" || d == "\n") {} else {
      b += d
    }
  }
  return b
}



function str2utf8(a) {
  var b = [];
  var c = a.length;
  var d = 0;
  for (var e = 0; e < c; e++) {
    var f = a.charCodeAt(e);
    if (f <= 127) {
      b[d++] = f
    } else if (f <= 2047) {
      b[d++] = 192 | 31 & f >>> 6;
      b[d++] = 128 | 63 & f >>> 0
    } else if (f <= 65535) {
      b[d++] = 224 | 15 & f >>> 12;
      b[d++] = 128 | 63 & f >>> 6;
      b[d++] = 128 | 63 & f >>> 0
    } else if (f <= 1114111) {
      b[d++] = 240 | 7 & f >>> 18;
      b[d++] = 128 | 63 & f >>> 12;
      b[d++] = 128 | 63 & f >>> 6;
      b[d++] = 128 | 63 & f >>> 0
    } else {
      throw "error"
    }
  }
  return b
}

function base64_decode(a) {
  var b = a.length;
  var c = Math.floor(b / 4);
  if (4 * c != b) throw "String length must be a multiple of four.";
  var d = 0;
  if (b != 0) {
    if (a.charAt(b - 1) == "=") {
      d++;
      c--
    }
    if (a.charAt(b - 2) == "=") d++
  }
  var e = 3 * c - d;
  if (e < 0) {
    e = 0
  }
  var f = new Array(e);
  var g = 0;
  var h = 0;
  for (var i = 0; i < c; i++) {
    var j = get_a2i(a.charCodeAt(g++));
    var k = get_a2i(a.charCodeAt(g++));
    var l = get_a2i(a.charCodeAt(g++));
    var m = get_a2i(a.charCodeAt(g++));
    f[h++] = 255 & (j << 2 | k >> 4);
    f[h++] = 255 & (k << 4 | l >> 2);
    f[h++] = 255 & (l << 6 | m)
  }
  if (d == 0) {} else if (d == 1) {
    var j = get_a2i(a.charCodeAt(g++));
    var k = get_a2i(a.charCodeAt(g++));
    var l = get_a2i(a.charCodeAt(g++));
    f[h++] = 255 & (j << 2 | k >> 4);
    f[h++] = 255 & (k << 4 | l >> 2)
  } else if (d == 2) {
    var j = get_a2i(a.charCodeAt(g++));
    var k = get_a2i(a.charCodeAt(g++));
    f[h++] = 255 & (j << 2 | k >> 4)
  } else {
    throw "never happen"
  }
  return f
}

function get_a2i(a) {
  var b = 0 <= a && a < a2i.length ? a2i[a] : -1;
  if (b < 0) throw "Illegal character " + a;
  return b
}

function base64_encode(a) {
  var b = a.length;
  var c = Math.floor(b / 3);
  var d = b - 3 * c;
  var e = "";
  var f = 0;
  for (var g = 0; g < c; g++) {
    var h = a[f++] & 255;
    var i = a[f++] & 255;
    var j = a[f++] & 255;
    e += i2a[h >> 2];
    e += i2a[h << 4 & 63 | i >> 4];
    e += i2a[i << 2 & 63 | j >> 6];
    e += i2a[j & 63]
  }
  if (d == 0) {} else if (d == 1) {
    var h = a[f++] & 255;
    e += i2a[h >> 2];
    e += i2a[h << 4 & 63];
    e += "=="
  } else if (d == 2) {
    var h = a[f++] & 255;
    var i = a[f++] & 255;
    e += i2a[h >> 2];
    e += i2a[h << 4 & 63 | i >> 4];
    e += i2a[i << 2 & 63];
    e += "="
  } else {
    throw "never happen"
  }
  return e
}

function execute(a, b) {
  this.open(a, b);
  for (;;) {
    var c = this.operate();
    if (0 < c) {
      continue
    } else {
      break
    }
  }
  return this.close()
}

function close() {
  this.modeClose();
  if (this.direction == DIRECTIONS.DECRYPT) {
    this.padding.remove(this.dataBytes)
  }
  return this.dataBytes
}

function operate() {
  return this.modeExec()
}

function open(a, b) {
  if (a == null) throw "keyBytes is null";
  if (b == null) throw "dataBytes is null";
  this.keyBytes = a.concat();
  this.dataBytes = b;
  this.dataOffset = 0;
  this.dataLength = b.length;
  if (this.direction == DIRECTIONS.ENCRYPT) {
    this.padding.append(this.dataBytes)
  }
  this.modeOpen()
}

function Cipher(a, b, c, d, e) {
  if (!(e == 128 || e == 192 || e == 256)) return "";
  this.nBits = e;
  this.algorithm = a;
  this.direction = b;
  this.mode = c;
  this.padding = d;
  this.modeOpen = c[b].open;
  this.modeExec = c[b].exec;
  this.modeClose = c[b].close;
  this.keyBytes = null;
  this.dataBytes = null;
  this.dataOffset = -1;
  this.dataLength = -1
}

function createNoPadding() {
  function b(a) {
    return a
  }

  function a(a) {
    return a
  }
  return {
    append: a,
    remove: b
  }
}



function createCBC() {
  function f() {
    this.algorithm.close();
    this.dataBytes.splice(0, 16);
    while (this.dataBytes[this.dataBytes.length - 1] == 0) this.dataBytes.pop()
  }

  function e() {
    var a = this.dataBytes.slice(this.dataOffset, this.dataOffset + 16);
    this.algorithm.decrypt(this.dataBytes, this.dataOffset);
    for (var b = 0; b < 16; b++) this.dataBytes[this.dataOffset + b] ^= this.iv[b];
    this.dataOffset += this.algorithm.blocksize;
    this.iv = a;
    if (this.dataLength <= this.dataOffset) {
      return 0
    } else {
      return this.dataLength - this.dataOffset
    }
  }

  function d() {
    this.algorithm.open(this.keyBytes);
    this.dataLength = this.dataBytes.length;
    this.dataOffset = 16;
    this.iv = this.dataBytes.slice(0, 16);
    return
  }

  function c() {
    this.algorithm.close()
  }

  function b() {
    for (var a = this.dataOffset; a < this.dataOffset + 16; a++) this.dataBytes[a] ^= this.dataBytes[a - 16];
    this.algorithm.encrypt(this.dataBytes, this.dataOffset);
    this.dataOffset += this.algorithm.blocksize;
    if (this.dataLength <= this.dataOffset) {
      return 0
    } else {
      return this.dataLength - this.dataOffset
    }
  }

  function a() {
    this.algorithm.open(this.keyBytes);
    this.dataBytes.unshift(randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte());
    this.dataLength = this.dataBytes.length;
    this.dataOffset = 16;
    return
  }
  return {
    encrypt: {
      open: a,
      exec: b,
      close: c
    },
    decrypt: {
      open: d,
      exec: e,
      close: f
    }
  }
}


function createSerpent() {
  function q(a, d) {
    b = a;
    c = d;
    var e = b.slice(c, c + 16);
    e.reverse();
    var g = [getW(e, 0), getW(e, 4), getW(e, 8), getW(e, 12)];
    f(g, 0, 1, 2, 3, 32);
    var i = 0,
      k = m[i];
    while (j[7 - i % 8](g, k % 5, k % 7, k % 11, k % 13, k % 17), i < 31) {
      k = m[++i];
      h(g, k % 5, k % 7, k % 11, k % 13, k % 17, 32 - i)
    }
    f(g, 2, 3, 1, 4, 0);
    setWInv(b, c, g[4]);
    setWInv(b, c + 4, g[1]);
    setWInv(b, c + 8, g[3]);
    setWInv(b, c + 12, g[2]);
    c += 16
  }

  function p(a, d) {
    b = a;
    c = d;
    var e = b.slice(c, c + 16);
    e.reverse();
    var h = [getW(e, 0), getW(e, 4), getW(e, 8), getW(e, 12)];
    f(h, 0, 1, 2, 3, 0);
    var j = 0,
      k = l[j];
    while (i[j % 8](h, k % 5, k % 7, k % 11, k % 13, k % 17), j < 31) {
      k = l[++j];
      g(h, k % 5, k % 7, k % 11, k % 13, k % 17, j)
    }
    f(h, 0, 1, 2, 3, 32);
    for (var m = 3; m >= 0; m--, c += 4) setWInv(b, c, h[m])
  }

  function o() {
    e = []
  }

  function n(b) {
    function l(a, b, c, d, f) {
      e[f] = m[a];
      e[f + 1] = m[b];
      e[f + 2] = m[c];
      e[f + 3] = m[d]
    }

    function j(a, b, c, d, f) {
      m[a] = e[f];
      m[b] = e[f + 1];
      m[c] = e[f + 2];
      m[d] = e[f + 3]
    }

    function h(a, b, c, d, f) {
      e[f] = m[b] = rotw(e[a] ^ m[b] ^ m[c] ^ m[d] ^ 2654435769 ^ f, 11)
    }
    a = b;
    var c, d, f, g;
    a.reverse();
    a[a.length] = 1;
    while (a.length < 32) a[a.length] = 0;
    for (c = 0; c < 8; c++) {
      e[c] = a[4 * c + 0] & 255 | (a[4 * c + 1] & 255) << 8 | (a[4 * c + 2] & 255) << 16 | (a[4 * c + 3] & 255) << 24
    }
    var m = [e[3], e[4], e[5], e[6], e[7]];
    c = 0;
    d = 0;
    while (h(d++, 0, 4, 2, c++), h(d++, 1, 0, 3, c++), c < 132) {
      h(d++, 2, 1, 4, c++);
      if (c == 8) {
        d = 0
      }
      h(d++, 3, 2, 0, c++);
      h(d++, 4, 3, 1, c++)
    }
    c = 128;
    d = 3;
    g = 0;
    while (f = k[g++], i[d++ % 8](m, f % 5, f % 7, f % 11, f % 13, f % 17), f = k[g], l(f % 5, f % 7, f % 11, f % 13, c), c > 0) {
      c -= 4;
      j(f % 5, f % 7, f % 11, f % 13, c)
    }
  }

  function h(a, b, c, d, f, g, h) {
    a[b] ^= e[4 * h + 0];
    a[c] ^= e[4 * h + 1];
    a[d] ^= e[4 * h + 2];
    a[f] ^= e[4 * h + 3];
    a[b] = rotw(a[b], 27);
    a[d] = rotw(a[d], 10);
    a[g] = a[c];
    a[d] ^= a[f];
    a[b] ^= a[f];
    a[g] = a[g] << 7 & MAXINT;
    a[b] ^= a[c];
    a[c] = rotw(a[c], 31);
    a[d] ^= a[g];
    a[f] = rotw(a[f], 25);
    a[g] = a[b] << 3 & MAXINT;
    a[c] ^= a[b];
    a[f] ^= a[g];
    a[b] = rotw(a[b], 19);
    a[c] ^= a[d];
    a[f] ^= a[d];
    a[d] = rotw(a[d], 29)
  }

  function g(a, b, c, d, f, g, h) {
    a[b] = rotw(a[b], 13);
    a[d] = rotw(a[d], 3);
    a[c] ^= a[b];
    a[g] = a[b] << 3 & MAXINT;
    a[f] ^= a[d];
    a[c] ^= a[d];
    a[c] = rotw(a[c], 1);
    a[f] ^= a[g];
    a[f] = rotw(a[f], 7);
    a[g] = a[c];
    a[b] ^= a[c];
    a[g] = a[g] << 7 & MAXINT;
    a[d] ^= a[f];
    a[b] ^= a[f];
    a[d] ^= a[g];
    a[f] ^= e[4 * h + 3];
    a[c] ^= e[4 * h + 1];
    a[b] = rotw(a[b], 5);
    a[d] = rotw(a[d], 22);
    a[b] ^= e[4 * h + 0];
    a[d] ^= e[4 * h + 2]
  }

  function f(a, b, c, d, f, g) {
    a[b] ^= e[4 * g];
    a[c] ^= e[4 * g + 1];
    a[d] ^= e[4 * g + 2];
    a[f] ^= e[4 * g + 3]
  }
  var a = null;
  var b = null;
  var c = -1;
  var d = null;
  d = "serpent";
  var e = [];
  var i = [function(a, b, c, d, e, f) {
    a[f] = a[e];
    a[e] |= a[b];
    a[b] ^= a[f];
    a[f] ^= a[d];
    a[f] = ~a[f];
    a[e] ^= a[c];
    a[c] &= a[b];
    a[c] ^= a[f];
    a[d] ^= a[b];
    a[b] ^= a[e];
    a[f] |= a[b];
    a[b] ^= a[d];
    a[d] &= a[c];
    a[e] ^= a[d];
    a[c] = ~a[c];
    a[d] ^= a[f];
    a[c] ^= a[d]
  }, function(a, b, c, d, e, f) {
    a[f] = a[c];
    a[c] ^= a[b];
    a[b] ^= a[e];
    a[e] = ~a[e];
    a[f] &= a[c];
    a[b] |= a[c];
    a[e] ^= a[d];
    a[b] ^= a[e];
    a[c] ^= a[e];
    a[e] ^= a[f];
    a[c] |= a[f];
    a[f] ^= a[d];
    a[d] &= a[b];
    a[d] ^= a[c];
    a[c] |= a[b];
    a[b] = ~a[b];
    a[b] ^= a[d];
    a[f] ^= a[c]
  }, function(a, b, c, d, e, f) {
    a[e] = ~a[e];
    a[c] ^= a[b];
    a[f] = a[b];
    a[b] &= a[d];
    a[b] ^= a[e];
    a[e] |= a[f];
    a[d] ^= a[c];
    a[e] ^= a[c];
    a[c] &= a[b];
    a[b] ^= a[d];
    a[d] &= a[e];
    a[e] |= a[c];
    a[b] = ~a[b];
    a[e] ^= a[b];
    a[f] ^= a[b];
    a[b] ^= a[d];
    a[c] |= a[d]
  }, function(a, b, c, d, e, f) {
    a[f] = a[c];
    a[c] ^= a[e];
    a[e] |= a[b];
    a[f] &= a[b];
    a[b] ^= a[d];
    a[d] ^= a[c];
    a[c] &= a[e];
    a[d] ^= a[e];
    a[b] |= a[f];
    a[f] ^= a[e];
    a[c] ^= a[b];
    a[b] &= a[e];
    a[e] &= a[f];
    a[e] ^= a[d];
    a[f] |= a[c];
    a[d] &= a[c];
    a[f] ^= a[e];
    a[b] ^= a[e];
    a[e] ^= a[d]
  }, function(a, b, c, d, e, f) {
    a[f] = a[e];
    a[e] &= a[b];
    a[b] ^= a[f];
    a[e] ^= a[d];
    a[d] |= a[f];
    a[b] ^= a[c];
    a[f] ^= a[e];
    a[d] |= a[b];
    a[d] ^= a[c];
    a[c] &= a[b];
    a[c] ^= a[f];
    a[f] &= a[d];
    a[d] ^= a[e];
    a[f] ^= a[b];
    a[e] |= a[c];
    a[c] = ~a[c];
    a[e] ^= a[b]
  }, function(a, b, c, d, e, f) {
    a[f] = a[c];
    a[c] |= a[b];
    a[d] ^= a[c];
    a[e] = ~a[e];
    a[f] ^= a[b];
    a[b] ^= a[d];
    a[c] &= a[f];
    a[f] |= a[e];
    a[f] ^= a[b];
    a[b] &= a[e];
    a[c] ^= a[e];
    a[e] ^= a[d];
    a[b] ^= a[c];
    a[d] &= a[f];
    a[c] ^= a[d];
    a[d] &= a[b];
    a[e] ^= a[d]
  }, function(a, b, c, d, e, f) {
    a[f] = a[c];
    a[e] ^= a[b];
    a[c] ^= a[d];
    a[d] ^= a[b];
    a[b] &= a[e];
    a[c] |= a[e];
    a[f] = ~a[f];
    a[b] ^= a[c];
    a[c] ^= a[d];
    a[e] ^= a[f];
    a[f] ^= a[b];
    a[d] &= a[b];
    a[f] ^= a[c];
    a[d] ^= a[e];
    a[e] &= a[c];
    a[e] ^= a[b];
    a[c] ^= a[d]
  }, function(a, b, c, d, e, f) {
    a[c] = ~a[c];
    a[f] = a[c];
    a[b] = ~a[b];
    a[c] &= a[d];
    a[c] ^= a[e];
    a[e] |= a[f];
    a[f] ^= a[d];
    a[d] ^= a[e];
    a[e] ^= a[b];
    a[b] |= a[c];
    a[d] &= a[b];
    a[b] ^= a[f];
    a[f] ^= a[e];
    a[e] &= a[b];
    a[f] ^= a[c];
    a[d] ^= a[f];
    a[e] ^= a[c];
    a[f] |= a[b];
    a[f] ^= a[c]
  }];
  var j = [function(a, b, c, d, e, f) {
    a[f] = a[e];
    a[c] ^= a[b];
    a[e] |= a[c];
    a[f] ^= a[c];
    a[b] = ~a[b];
    a[d] ^= a[e];
    a[e] ^= a[b];
    a[b] &= a[c];
    a[b] ^= a[d];
    a[d] &= a[e];
    a[e] ^= a[f];
    a[d] ^= a[e];
    a[c] ^= a[e];
    a[e] &= a[b];
    a[c] ^= a[b];
    a[b] ^= a[d];
    a[f] ^= a[e]
  }, function(a, b, c, d, e, f) {
    a[c] ^= a[e];
    a[f] = a[b];
    a[b] ^= a[d];
    a[d] = ~a[d];
    a[f] |= a[c];
    a[f] ^= a[e];
    a[e] &= a[c];
    a[c] ^= a[d];
    a[d] &= a[f];
    a[f] ^= a[c];
    a[c] |= a[e];
    a[e] ^= a[b];
    a[d] ^= a[b];
    a[b] |= a[f];
    a[d] ^= a[f];
    a[c] ^= a[b];
    a[f] ^= a[c]
  }, function(a, b, c, d, e, f) {
    a[d] ^= a[c];
    a[f] = a[e];
    a[e] = ~a[e];
    a[e] |= a[d];
    a[d] ^= a[f];
    a[f] ^= a[b];
    a[e] ^= a[c];
    a[c] |= a[d];
    a[d] ^= a[b];
    a[c] ^= a[f];
    a[f] |= a[e];
    a[d] ^= a[e];
    a[f] ^= a[d];
    a[d] &= a[c];
    a[d] ^= a[e];
    a[e] ^= a[f];
    a[f] ^= a[b]
  }, function(a, b, c, d, e, f) {
    a[d] ^= a[c];
    a[f] = a[c];
    a[c] &= a[d];
    a[c] ^= a[b];
    a[b] |= a[f];
    a[f] ^= a[e];
    a[b] ^= a[e];
    a[e] |= a[c];
    a[c] ^= a[d];
    a[c] ^= a[e];
    a[b] ^= a[d];
    a[d] ^= a[e];
    a[e] &= a[c];
    a[c] ^= a[b];
    a[b] &= a[d];
    a[f] ^= a[e];
    a[e] ^= a[b];
    a[b] ^= a[c]
  }, function(a, b, c, d, e, f) {
    a[d] ^= a[e];
    a[f] = a[b];
    a[b] &= a[c];
    a[b] ^= a[d];
    a[d] |= a[e];
    a[f] = ~a[f];
    a[c] ^= a[b];
    a[b] ^= a[d];
    a[d] &= a[f];
    a[d] ^= a[b];
    a[b] |= a[f];
    a[b] ^= a[e];
    a[e] &= a[d];
    a[f] ^= a[e];
    a[e] ^= a[c];
    a[c] &= a[b];
    a[f] ^= a[c];
    a[b] ^= a[e]
  }, function(a, b, c, d, e, f) {
    a[f] = a[c];
    a[c] |= a[d];
    a[d] ^= a[f];
    a[c] ^= a[e];
    a[e] &= a[f];
    a[d] ^= a[e];
    a[e] |= a[b];
    a[b] = ~a[b];
    a[e] ^= a[d];
    a[d] |= a[b];
    a[f] ^= a[c];
    a[d] ^= a[f];
    a[f] &= a[b];
    a[b] ^= a[c];
    a[c] ^= a[e];
    a[b] &= a[d];
    a[d] ^= a[e];
    a[b] ^= a[d];
    a[d] ^= a[f];
    a[f] ^= a[e]
  }, function(a, b, c, d, e, f) {
    a[b] ^= a[d];
    a[f] = a[b];
    a[b] &= a[e];
    a[d] ^= a[e];
    a[b] ^= a[d];
    a[e] ^= a[c];
    a[d] |= a[f];
    a[d] ^= a[e];
    a[e] &= a[b];
    a[b] = ~a[b];
    a[e] ^= a[c];
    a[c] &= a[d];
    a[f] ^= a[b];
    a[e] ^= a[f];
    a[f] ^= a[d];
    a[b] ^= a[c];
    a[d] ^= a[b]
  }, function(a, b, c, d, e, f) {
    a[f] = a[e];
    a[e] &= a[b];
    a[b] ^= a[d];
    a[d] |= a[f];
    a[f] ^= a[c];
    a[b] = ~a[b];
    a[c] |= a[e];
    a[f] ^= a[b];
    a[b] &= a[d];
    a[b] ^= a[c];
    a[c] &= a[d];
    a[e] ^= a[d];
    a[f] ^= a[e];
    a[d] &= a[e];
    a[e] |= a[b];
    a[c] ^= a[f];
    a[e] ^= a[f];
    a[f] &= a[b];
    a[f] ^= a[d]
  }];
  var k = [7788, 63716, 84032, 7891, 78949, 25146, 28835, 67288, 84032, 40055, 7361, 1940, 77639, 27525, 24193, 75702, 7361, 35413, 83150, 82383, 58619, 48468, 18242, 66861, 83150, 69667, 7788, 31552, 40054, 23222, 52496, 57565, 7788, 63716];
  var l = [44255, 61867, 45034, 52496, 73087, 56255, 43827, 41448, 18242, 1939, 18581, 56255, 64584, 31097, 26469, 77728, 77639, 4216, 64585, 31097, 66861, 78949, 58006, 59943, 49676, 78950, 5512, 78949, 27525, 52496, 18670, 76143];
  var m = [44255, 60896, 28835, 1837, 1057, 4216, 18242, 77301, 47399, 53992, 1939, 1940, 66420, 39172, 78950, 45917, 82383, 7450, 67288, 26469, 83149, 57565, 66419, 47400, 58006, 44254, 18581, 18228, 33048, 45034, 66508, 7449];
  return {
    name: "serpent",
    blocksize: this.nBits / 8,
    open: n,
    close: o,
    encrypt: p,
    decrypt: q
  }
}

function randByte() {
  return Math.floor(Math.random() * 256)
}

function setWInv(a, b, c) {
  a.splice(b, 4, c >>> 24 & 255, c >>> 16 & 255, c >>> 8 & 255, c & 255)
}

function setW(a, b, c) {
  a.splice(b, 4, c & 255, c >>> 8 & 255, c >>> 16 & 255, c >>> 24 & 255)
}

function getW(a, b) {
  return a[b] | a[b + 1] << 8 | a[b + 2] << 16 | a[b + 3] << 24
}

function rotw(a, b) {
  return (a << b | a >>> 32 - b) & MAXINT
}


var Base64 = {
  code: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(a, b) {
    b = typeof b == "undefined" ? false : b;
    var c, d, e, f, g, h, i, j, k = [],
      l = "",
      m, n, o;
    var p = Base64.code;
    n = b ? a.encodeUTF8() : a;
    m = n.length % 3;
    if (m > 0) {
      while (m++ < 3) {
        l += "=";
        n += "?"
      }
    }
    for (m = 0; m < n.length; m += 3) {
      c = n.charCodeAt(m);
      d = n.charCodeAt(m + 1);
      e = n.charCodeAt(m + 2);
      f = c << 16 | d << 8 | e;
      g = f >> 18 & 63;
      h = f >> 12 & 63;
      i = f >> 6 & 63;
      j = f & 63;
      k[m / 3] = p.charAt(g) + p.charAt(h) + p.charAt(i) + p.charAt(j)
    }
    o = k.join("");
    o = o.slice(0, o.length - l.length) + l;
    return o
  },
  decode: function(a, b) {
    b = typeof b == "undefined" ? false : b;
    var c, d, e, f, g, h, i, j, k = [],
      l, m;
    var n = Base64.code;
    m = b ? a.decodeUTF8() : a;
    for (var o = 0; o < m.length; o += 4) {
      f = n.indexOf(m.charAt(o));
      g = n.indexOf(m.charAt(o + 1));
      h = n.indexOf(m.charAt(o + 2));
      i = n.indexOf(m.charAt(o + 3));
      j = f << 18 | g << 12 | h << 6 | i;
      c = j >>> 16 & 255;
      d = j >>> 8 & 255;
      e = j & 255;
      k[o / 4] = String.fromCharCode(c, d, e);
      if (i == 64) k[o / 4] = String.fromCharCode(c, d);
      if (h == 64) k[o / 4] = String.fromCharCode(c)
    }
    l = k.join("");
    return b ? l.decodeUTF8() : l
  }
}

var Serpent = {
  encrypt: function(a, b, c) {
    var d = Cipher.create("SERPENT", "ENCRYPT", "CBC", "NO_PADDING", c);
    var e = str2utf8(a);
    var f = base64_decode(pack(b));
    ciphertext = d.execute(f.concat(), e.concat());
    return Buffer.from(ciphertext).toString('base64')
  },
  decrypt: function(a, b, c) {
    var d = Cipher.create("SERPENT", "DECRYPT", "CBC", "NO_PADDING", c);
    var e = base64_decode(pack(a));
    var f = base64_decode(pack(b));
    e = Buffer.from(d.execute(f.concat(), e.concat()));
    return e.toString();
  }
};

var DIRECTIONS = {
  ENCRYPT: "encrypt",
  DECRYPT: "decrypt"
};

Cipher.prototype = {
  inherit: Cipher,
  open: open,
  close: close,
  operate: operate,
  execute: execute
}

Cipher.create = function(a, b, c, d, e) {
  return new Cipher(createSerpent(), DIRECTIONS[b], createCBC(), createNoPadding(), e)
};

module.exports = Serpent;
