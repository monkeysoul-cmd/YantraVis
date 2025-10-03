import type { YantraData } from '@/lib/schema/yantra';

export const JAI_PRAKASH_JAIPUR_DATA: YantraData = {
  yantraId: 'jai-prakash',
  yantraName: 'Jai Prakash Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Jai Prakash Yantra is a 'celestial map' that provides a direct, inverted image of the sky overhead.</li><li>It is used to determine the position of the sun, and by extension, other celestial bodies. It can determine the local time, sun's declination, and the zodiac sign.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>One of the most complex and versatile instruments at the Jantar Mantar observatories.</li><li>It is often composed of two complementary hemispherical bowls, allowing an observer to be in one while observing the other.</li></ul><h3>✨ Fun Fact</h3><p>The pathways and markings inside the bowl are a map of the celestial coordinate system. An observer can stand inside and their head becomes the reference point for aligning with celestial bodies using a cross-wire stretched across the top.</p>",
  dimensions: {
    'Bowl Diameter': 12.99,
    'Bowl Depth': 6.5,
    'Rim Height': 24.21,
    'Cross-wire Tension': 26.91,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Marble Slabs (for bowl construction)', quantity: '150 square meters' },
      { item: 'High-precision Engraving Tools', quantity: 'Multiple sets' },
      { item: 'Taut Wires (for cross-hairs)', quantity: '4 units' },
      { item: 'Concrete Sub-structure', quantity: '100 cubic meters' },
    ],
    costEstimate: 'Extremely high, potentially one of the most expensive instruments due to the vast amount of precision marble work and engraving required to map the celestial coordinates accurately.',
    accuracy: 'Provides very high accuracy in determining the position of celestial objects, often to within a few arcminutes. The precision is limited by the quality of the engraved lines.',
    orientation: {
      trueNorthAngle: 'The North-South and East-West axes of the bowl must be perfectly aligned with the cardinal directions. The rim of the bowl represents the horizon and must be perfectly level.',
      magneticDeclination: "The magnetic declination for Jaipur (approx. 0.8° East) is vital for aligning the instrument's coordinate system with the true celestial poles and equator.",
      foundationNotes: 'Requires an exceptionally stable and perfectly level foundation to ensure the hemispherical bowl does not tilt or warp, which would render the entire celestial map inaccurate.',
      toleranceGuidance: 'The most critical aspect is the precision of the concave surface and the engraved coordinate lines (azimuth and altitude). Any error in the hemisphere\'s shape will distort the sky map.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
