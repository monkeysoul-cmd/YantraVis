import type { YantraData } from '@/lib/schema/yantra';

export const PALAKA_JAIPUR_DATA: YantraData = {
  yantraId: 'palaka',
  yantraName: 'Palaka Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Palaka Yantra is a simple, often handheld, rectangular board instrument.</li><li>It can be used for various calculations, such as determining the time from the altitude of the sun, or finding the height of objects.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Represents a class of simple, portable astronomical instruments, precursors to the modern sextant or astrolabe.</li><li>It demonstrates how basic geometric principles can be used for complex astronomical calculations.</li></ul><h3>✨ Fun Fact</h3><p>Despite its simplicity, a Palaka Yantra, when used with a plumb line and sighting pin, could be a surprisingly versatile tool in the hands of a skilled astronomer.</p>",
  dimensions: {
    'Board Length': 0.5,
    'Board Width': 0.3,
    'Sighting Pin Height': 0.1,
    'Scale Divisions': 1,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Wood or Metal Plate', quantity: '1 unit' },
      { item: 'Plumb Line with Bob', quantity: '1 unit' },
      { item: 'Sighting Pin', quantity: '1 unit' },
      { item: 'Engraved Scales', quantity: '1 set' },
    ],
    costEstimate: 'Very low. This is the simplest and cheapest instrument to construct, often used for educational purposes or as a personal tool for an astronomer.',
    accuracy: 'Low to moderate. Its accuracy is limited by its small size and the steadiness of the observer\'s hand. It is more of a demonstrational tool than a precision instrument.',
    orientation: {
      trueNorthAngle: 'Orientation depends on the measurement being taken. For time-telling, it needs to be aligned with the sun and the local vertical (plumb line).',
      magneticDeclination: "Not directly relevant for most of the instrument's functions, which rely on direct sighting and local gravity (plumb line).",
      foundationNotes: 'No foundation is required as it is a small or handheld instrument. A stable, level surface to place it on is sufficient.',
      toleranceGuidance: 'The board must be perfectly flat and the edges perfectly square. The accuracy of the engraved scales is the most critical factor.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
