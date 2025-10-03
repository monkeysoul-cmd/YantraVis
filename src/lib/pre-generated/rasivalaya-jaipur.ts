import type { YantraData } from '@/lib/schema/yantra';

export const RASIVALAYA_JAIPUR_DATA: YantraData = {
  yantraId: 'rasivalaya',
  yantraName: 'Rasivalaya Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Rasivalaya are a set of twelve instruments, each corresponding to one of the twelve signs of the zodiac.</li><li>They are used to measure the celestial latitude and longitude of celestial objects when the corresponding zodiac sign is on the meridian.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>This set of instruments showcases the deep integration of astronomy and astrology in historical Indian science.</li><li>Each instrument is similar in form to the Samrat Yantra but is uniquely angled to correspond to its zodiac sign.</li></ul><h3>✨ Fun Fact</h3><p>To use a Rasivalaya, an astronomer would wait until the specific zodiac sign it represents was crossing the local meridian (the North-South line in the sky) and then take measurements.</p>",
  dimensions: {
    'Gnomon Height': 12.99,
    'Quadrant Radius': 24.21,
    'Gnomon Angle': 26.91,
    'Number of Instruments': 12,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar (for 12 structures)', quantity: '~1200 cubic meters' },
      { item: 'Marble Slabs (for all 12)', quantity: '~300 square meters' },
      { item: 'Bronze or Copper Plates (for markings)', quantity: '12 sets' },
      { item: 'Extensive Concrete Foundations', quantity: '~500 cubic meters' },
    ],
    costEstimate: 'Extremely high due to it being a collection of twelve separate, large instruments. This would be a massive public works project, likely the most expensive single installation in an observatory.',
    accuracy: 'The accuracy of each instrument is similar to that of a Samrat Yantra, allowing for precise time and positional measurements, but only when the specific zodiac constellation is active on the meridian.',
    orientation: {
      trueNorthAngle: 'Each of the 12 instruments must be perfectly aligned with the meridian. Their individual gnomons are then tilted at different angles corresponding to the ecliptic plane for each zodiac sign.',
      magneticDeclination: "The magnetic declination for Jaipur (approx. 0.8° East) is a baseline for aligning the entire observatory, but each Rasivalaya has its own unique orientation relative to the ecliptic.",
      foundationNotes: 'Each of the 12 instruments requires its own massive, stable foundation, similar to a Samrat Yantra, making the foundation work for the entire set incredibly extensive.',
      toleranceGuidance: 'The construction tolerances for each of the 12 instruments are as strict as for the Samrat Yantra. The angles of the gnomons for each zodiac sign must be calculated and constructed with extreme precision.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
