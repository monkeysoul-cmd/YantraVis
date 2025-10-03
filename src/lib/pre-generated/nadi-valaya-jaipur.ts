import type { YantraData } from '@/lib/schema/yantra';

export const NADI_VALAYA_JAIPUR_DATA: YantraData = {
  yantraId: 'nadi-valaya',
  yantraName: 'Nadi Valaya Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Nadi Valaya Yantra is a unique sundial with two circular faces, one facing north and one facing south.</li><li>It is used to tell time when the sun is in the northern or southern hemisphere, respectively.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>This instrument elegantly solves the problem of a single-faced equatorial sundial, which only works for half the year.</li><li>The instrument's axis is parallel to the Earth's axis.</li></ul><h3>✨ Fun Fact</h3><p>The north face is used from the vernal equinox (March) to the autumnal equinox (September), and the south face is used for the other half of the year. On the equinoxes, the sun illuminates the rim of both dials.</p>",
  dimensions: {
    'Dial Diameter': 5,
    'Gnomon Length': 2.5,
    'Tilt Angle': 26.91,
    'Dial Thickness': 0.5,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Masonry or Metal for dials', quantity: '2 large circular units' },
      { item: 'Central Gnomon (rod)', quantity: '1 unit' },
      { item: 'Supporting structure', quantity: '1 unit' },
      { item: 'Precision Foundation', quantity: '5 cubic meters' },
    ],
    costEstimate: 'Moderate to high. The cost is in creating two large, perfectly flat dials and angling the entire structure precisely to the local latitude.',
    accuracy: 'Very accurate for time-telling. Its accuracy is comparable to the Samrat Yantra but on a smaller scale. Precision depends on the gnomon\'s sharpness and scale markings.',
    orientation: {
      trueNorthAngle: 'The plane of the dials must be parallel to the Earth\'s equatorial plane. This is achieved by tilting the instrument so its axis is parallel to the Earth\'s axis, pointing at the pole star (true north).',
      magneticDeclination: "The entire instrument's alignment along the North-South meridian is critical. Magnetic declination (approx. 0.8° East for Jaipur) must be factored in.",
      foundationNotes: 'The foundation must be perfectly stable and capable of holding the instrument at a fixed, precise angle (equal to the latitude) indefinitely.',
      toleranceGuidance: 'The dial faces must be perfectly flat and parallel to each other. The gnomon must be perfectly straight and perpendicular to the dials. The tilt angle must match the local latitude exactly.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
