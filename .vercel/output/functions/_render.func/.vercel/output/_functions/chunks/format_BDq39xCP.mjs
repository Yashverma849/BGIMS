const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const formatINR = (n) => INR.format(n);
const GST_RATE = 0.18;
function feeBreakdown(base) {
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return {
    base,
    gst,
    total,
    baseLabel: formatINR(base),
    gstLabel: formatINR(gst),
    totalLabel: formatINR(total)
  };
}
function formatDate(input, opts) {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString("en-IN", opts ?? { day: "2-digit", month: "short", year: "numeric" });
}

export { formatINR as a, feeBreakdown as b, formatDate as f };
