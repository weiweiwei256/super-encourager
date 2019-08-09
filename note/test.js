
var n = /(_z2C\$q|_z&e3B|AzdH3F)/g;
var t = /([a-w\d])/g;
var e = {
  w: "a",
  k: "b",
  v: "c",
  1: "d",
  j: "e",
  u: "f",
  2: "g",
  i: "h",
  t: "i",
  3: "j",
  h: "k",
  s: "l",
  4: "m",
  g: "n",
  5: "o",
  r: "p",
  q: "q",
  6: "r",
  f: "s",
  p: "t",
  7: "u",
  e: "v",
  o: "w",
  8: "1",
  d: "2",
  n: "3",
  9: "4",
  c: "5",
  m: "6",
  0: "7",
  b: "8",
  l: "9",
  a: "0",
  _z2C$q: ":",
  "_z&e3B": ".",
  AzdH3F: "/"
};
function uncompile(r) {
  console.log(r);
  var o = r.replace(n, function(t, n) {
    console.log(t);
    return e[n];
  });
  console.log(o);
  return o.replace(t, function(t, n) {
    return e[n];
  });
}
console.log(
  uncompile(
    "ippr_z2C$qAzdH3FAzdH3Ft42n_z&e3B17tpwg2_z&e3Bv54AzdH3F7rs5w1fAzdH3Ftpj4AzdH3Fda8mamAzdH3Fd9AzdH3Fda8mamd9da9bc8_pQgti_z&e3B3rj2"
  )
);
