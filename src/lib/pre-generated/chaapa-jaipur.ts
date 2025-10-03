import type { YantraData } from '@/lib/schema/yantra';

export const CHAAPA_JAIPUR_DATA: YantraData = {
  yantraId: 'chaapa',
  yantraName: 'Chaapa Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Chaapa Yantra is an arc-shaped instrument used to measure the declination and right ascension of celestial bodies.</li><li>It functions as a partial sundial, working around noon.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>It is a simplified version of a full-circle instrument, focusing on the most important part of the sun's daily path.</li><li>Useful for confirming the declination measured by other, larger instruments.</li></ul><h3>✨ Fun Fact</h3><p>The Chaapa is often mounted on a wall or as part of a larger instrument. Its arc shape is designed to match the path of the sun near the meridian.</p>",
  dimensions: {
    'Arc Radius': 5,
    'Arc Angle': 120,
    'Gnomon Length': 0.5,
    'Arc Width': 0.5,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Masonry or Metal for Arc', quantity: '1 unit' },
      { item: 'Gnomon (pin or rod)', quantity: '1 unit' },
      { item: 'Engraved Declination Scale', quantity: '1 set' },
      { item: 'Mounting structure', quantity: '1 unit' },
    ],
    costEstimate: 'Moderate. More complex than a simple portable instrument, but less so than a full meridian wall. Cost is in the precise curvature of the arc and its markings.',
    accuracy: 'Good for measuring declination. Its accuracy is a function of its size (larger radius is better) and the precision of its scale.',
    orientation: {
      trueNorthAngle: 'The arc must be placed in the meridian plane, perfectly aligned with the North-South line, for its readings to be accurate.',
      magneticDeclination: "Accounting for magnetic declination (approx. 0.8° East for Jaipur) is necessary to properly align the instrument's plane with the meridian.",
      foundationNotes: 'Requires a very stable mounting, usually on a vertical wall that is itself aligned with the meridian. The mount must not shift or sag.',
      toleranceGuidance: 'The curvature of the arc must be a perfect circle segment. The gnomon must be placed at the exact center of that circle. The scale must be finely and accurately engraved.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
