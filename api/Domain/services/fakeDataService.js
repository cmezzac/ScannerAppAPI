/**
 * Generates a fake shipping label with a random name, tracking number, and courier.
 *
 * @returns {{ Name: string, TrackingNumber: string, Courier: string }}
 */
const generateFakeShippingLabel = () => {
  const names = [
    "Christopher Mezzacappa",
    "Michael Mezzacappa",
    "George Mandelos",
    "Ari Zergiotis",
    "Sofia St-Pierre",
    "Bianca D'alescio",
    "Roula Atahansopoulos",
    "Joseph Mezzacappa",
  ];

  const couriers = ["INTL", "USPS", "FEDEX", "UPS", "DHL"];
  const randomCourier = couriers[Math.floor(Math.random() * couriers.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];

  const generateTrackingNumber = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomSuffix = Array.from({ length: 8 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");

    return `${randomCourier}${randomSuffix}`;
  };

  return {
    Name: randomName,
    TrackingNumber: generateTrackingNumber(),
    Courier: randomCourier,
  };
};

module.exports = {
  generateFakeShippingLabel,
};
