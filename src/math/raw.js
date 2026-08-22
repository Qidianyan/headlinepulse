(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function padFrac(frac, decimals) {
    if (frac.length >= decimals) return frac.slice(0, decimals);
    return frac + "0".repeat(decimals - frac.length);
  }

  function expandScientific(text) {
    const m = /^([+-]?)(\d+)(?:\.(\d+))?e([+-]?\d+)$/i.exec(text);
    if (!m) return text;
    const digits = m[2] + (m[3] || "");
    const shift = Number(m[4]) - (m[3] ? m[3].length : 0);
    if (shift >= 0) return m[1] + digits + "0".repeat(shift);
    const idx = digits.length + shift;
    if (idx <= 0) return m[1] + "0." + "0".repeat(-idx) + digits;
    return m[1] + digits.slice(0, idx) + "." + digits.slice(idx);
  }

  HP.toRawInteger = function toRawInteger(human, decimals) {
    const text = expandScientific(String(human));
    const neg = text.startsWith("-");
    const unsigned = neg ? text.slice(1) : text;
    const parts = unsigned.split(".");
    const whole = parts[0] === "" ? "0" : parts[0];
    const raw = BigInt(whole + padFrac(parts[1] || "", decimals));
    return neg ? -raw : raw;
  };

  HP.fromRawInteger = function fromRawInteger(raw, decimals) {
    const negative = raw < 0n;
    const abs = negative ? -raw : raw;
    const digits = abs.toString().padStart(decimals + 1, "0");
    const i = digits.length - decimals;
    const frac = digits.slice(i).replace(/0+$/, "");
    const text = frac ? digits.slice(0, i) + "." + frac : digits.slice(0, i);
    return Number(negative ? "-" + text : text);
  };
})(typeof window !== "undefined" ? window : globalThis);
