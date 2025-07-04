function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readImageLabel(ocrText) {
  console.log("INSIDE THE LABEL READER:");
  console.log(ocrText);

  const lines = ocrText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const joinedText = lines.join(" ");

  return {
    name: extractName(lines),
    apartment: extractApartment(lines),
    courier: extractCourier(joinedText),
    trackingNumber: extractTrackingNumber(joinedText),
  };
}

function extractTrackingNumber(text) {
  const trackingRegexes = [
    /\b1Z[0-9A-Z]{16}\b/, // UPS
    /\b\d{12}\b/, // Purolator, DHL
    /\b\d{15,22}\b/, // FedEx
    /\b[A-Z]{2}\d{9}[A-Z]{2}\b/, // Canada Post: CC123456789CA
  ];

  for (const regex of trackingRegexes) {
    const match = text.match(regex);
    if (match) return match[0];
  }

  // Fallback: Long alphanumeric string (no spaces/dashes)
  const fallback = text.match(/\b[A-Z0-9]{10,30}\b/);
  if (fallback) return fallback[0];

  return null;
}

function extractCourier(text) {
  const couriers = [
    "purolator",
    "fedex",
    "ups",
    "canada post",
    "dhl",
    "amazon",
  ];
  for (const courier of couriers) {
    if (text.toLowerCase().includes(courier)) {
      return toTitleCase(courier);
    }
  }
  return null;
}

function extractName(lines) {
  const nameCandidates = [];

  for (const line of lines) {
    // Remove symbols like | or :
    const cleanLine = line.replace(/[|:]/g, "").trim();

    // Looks like a name if it has two words, both starting with uppercase
    if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(cleanLine)) {
      nameCandidates.push(toTitleCase(cleanLine));
    }
  }

  // Remove duplicates
  const unique = [...new Set(nameCandidates)];

  return unique.length > 0 ? unique[0] : null;
}

function extractApartment(lines) {
  const apartmentRegex = /\b(?:APT|APARTMENT|UNIT|#)?\s*(\d{1,5}[A-Z]?)\b/i;
  for (const line of lines) {
    const match = line.match(apartmentRegex);
    if (match) return match[1];
  }
  return null;
}

module.exports = { readImageLabel };
