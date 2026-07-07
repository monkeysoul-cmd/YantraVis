import type { YantraData } from '@/lib/schema/yantra';

export const BHITTI_JAIPUR_DATA: YantraData = {
  yantraId: 'bhitti',
  yantraName: 'Bhitti Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Bhitti Yantra, or Mural Instrument, is a large wall aligned precisely with the local meridian (the North-South line).</li><li>It is used to observe the transit time and altitude of the sun and other celestial bodies as they cross the meridian.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>This is one of the most fundamental observatory instruments, found in various forms across the world (e.g., at Greenwich).</li><li>It was crucial for accurately determining the length of the year and creating solar calendars.</li></ul><h3>✨ Fun Fact</h3><p>Observations with a meridian wall are key to establishing 'local noon', the exact moment the sun is at its highest point in the sky for that location.</p>",
  dimensions: {
    'Wall Length': 30,
    'Wall Height': 10,
    'Wall Thickness': 2,
    'Scale Graduation': 0.1,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar or Ashlar Masonry', quantity: '800 cubic meters' },
      { item: 'Marble or fine plaster for scale', quantity: '150 square meters' },
      { item: 'Precision surveying equipment', quantity: '1 set' },
      { item: 'Massive foundation', quantity: '400 cubic meters' },
    ],
    costEstimate: 'Very high, due to the sheer size and the extreme precision required in its alignment. This is a major architectural and scientific undertaking.',
    accuracy: 'Can be extremely accurate for measuring meridian transit times and altitudes, limited only by the quality of the scale and the observer\'s ability to time the transit.',
    orientation: {
      trueNorthAngle: 'The alignment of this instrument is its most critical feature. The plane of the wall must lie EXACTLY on the North-South meridian line. Any error makes the instrument useless.',
      magneticDeclination: "Magnetic declination (approx. 0.8° East for Jaipur) is the starting point for finding true north, but final alignment would require precise solar or stellar observations.",
      foundationNotes: 'An absolutely massive, deep, and stable foundation is required to ensure the wall does not move, tilt, or settle by even a fraction of an inch over centuries.',
      toleranceGuidance: 'The wall must be perfectly flat and perfectly vertical. The markings for degrees of altitude must be engraved with the highest possible precision.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
