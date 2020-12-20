function calculate(query) {
  query = query.toLowerCase();
  query = query.replace(/\^/g, "**");
  query = query.replace(/e/g, "Math.E");
  query = query.replace(/pi/g, "Math.PI");
  query = query.replace(/sqrt/g, "Math.sqrt");
  query = query.replace(/ln/g, "log");
  query = query.replace(/log/g, "Math.log");
  query = query.replace(/\)\(/g, ")*(");

  for (let i = 0; i < 10; i++) {
    // fixes number( -> number*(
    var re = new RegExp(i + "\\(");
    query = query.replace(re, i + "*(", "g");

    // fixes )number -> )*number
    re = new RegExp("\\)" + i, "g");
    query = query.replace(re, ")*" + i);
  }

  // fixes log*() -> log()
  query = query.replace(/log10*\(/g, "log10(");

  try {
    res = Function('"use strict";return (' + query + ")")();
  } catch {
    return "NaN";
  }
  if (!isNaN(res)) return res;
  else return "NaN";
}

function factorial(n) {
  if (n == 0 || n == 1) return 1;

  if (f[n] > 0) return f[n];
  return (f[n] = factorial(n - 1) * n);
}

module.exports = { calculate };
