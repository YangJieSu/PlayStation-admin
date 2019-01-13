export default function (num) {
  const n = Number(num);
  return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
    return currency;
  })}`;
  // var p = n.toFixed(2).split(".");
  // return "$" + p[0].split("").reverse().reduce(function (acc, n, i, orig) {
  //   return n == "-" ? acc : n + (i && !(i % 3) ? "," : "") + acc;
  // }, "") + "." + p[1];
};