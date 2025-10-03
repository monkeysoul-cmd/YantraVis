import type { YantraData } from '@/lib/schema/yantra';

export const YANTRA_SAMRAT_COMBO_JAIPUR_DATA: YantraData = {
  yantraId: 'yantra-samrat-combo',
  yantraName: 'Yantra Samrat (Combo)',
  description: "<h3>📜 Purpose</h3><ul><li>This is a composite instrument, typically combining the features of a Samrat Yantra and a Dhruva-Protha-Chakra.</li><li>It measures local time, declination of the sun, and the position of the pole star.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Represents an efficient design, integrating multiple measurement capabilities into a single structure.</li><li>Not a standard classical design, but illustrates the principles of combining functionalities.</li></ul><h3>✨ Fun Fact</h3><p>Such a combination would allow an observer to calibrate the local time using the sundial component and then determine their latitude using the pole star sighting component in a single evening.</p>",
  dimensions: {
    'Gnomon Height': 20,
    'Base Width': 15,
    'Sighting Unit Angle': 26.91,
    'Quadrant Radius': 22,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar', quantity: '600 cubic meters' },
      { item: 'Marble Slabs for markings', quantity: '120 square meters' },
      { item: 'Sighting Apparatus', quantity: '1 unit' },
      { item: 'Massive Concrete Foundation', quantity: '250 cubic meters' },
    ],
    costEstimate: 'Very high, approaching the cost of a full Samrat Yantra. The complexity of integrating two instruments into one structure adds to the engineering and construction challenges.',
    accuracy: 'Accuracy would be comparable to the individual Samrat and Dhruva-Protha-Chakra instruments, provided the integration does not compromise their individual geometries.',
    orientation: {
      trueNorthAngle: 'Alignment is doubly critical. The Samrat Yantra component must be parallel to the Earth\'s axis (aligned with true north), which automatically aligns the pole star sighting component.',
      magneticDeclination: "The magnetic declination (approx. 0.8° East for Jaipur) must be accounted for to ensure the entire combined instrument is perfectly aligned on the meridian.",
      foundationNotes: 'Requires a foundation as robust and stable as a large Samrat Yantra to ensure long-term accuracy for both time-telling and latitude measurement functions.',
      toleranceGuidance: 'Tolerances for both the sundial (sharp gnomon edge, precise quadrant markings) and the pole star sight (accurate angle) must be strictly maintained.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
