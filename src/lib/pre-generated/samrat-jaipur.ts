import type { YantraData } from '@/lib/schema/yantra';

export const SAMRAT_JAIPUR_DATA: YantraData = {
  yantraId: 'samrat',
  yantraName: 'Samrat Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Samrat Yantra, or 'Supreme Instrument', is a massive equinoctial sundial.</li><li>Its primary purpose is to measure the local time with remarkable precision.</li><li>It can also be used to determine the declination of the sun.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>This instrument is the centerpiece of the Jantar Mantar observatories in India.</li><li>It represents the pinnacle of ancient Indian astronomical prowess.</li><li>The largest Samrat Yantra, located in Jaipur, is the world's largest sundial.</li></ul><h3>✨ Fun Fact</h3><p>The Jaipur Samrat Yantra's gnomon is 27 meters high, and its shadow moves at a visibly perceptible speed of about 1 millimeter per second.</p>",
  dimensions: {
    'Base Width': 13,
    Height: 22.11,
    'Gnomon Angle': 26.9124,
    'North Alignment': 0.288,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar (Traditional)', quantity: '500 cubic meters' },
      { item: 'Marble Slabs (for markings)', quantity: '100 square meters' },
      { item: 'Structural Steel (Modern Reinforcement)', quantity: '10 tons' },
      { item: 'Concrete Foundation', quantity: '200 cubic meters' },
    ],
    costEstimate: 'As a large-scale public monument, the cost would be substantial, likely in the range of several million dollars, considering materials, skilled labor for precision masonry, and land.',
    accuracy: "The Samrat Yantra's accuracy is exceptional for its time, potentially measuring time down to a precision of 2 seconds, assuming perfect construction and a clear day.",
    orientation: {
      trueNorthAngle: "Alignment with true north is absolutely critical. The gnomon's wall must be perfectly parallel to the Earth's axis of rotation. Any deviation will result in inaccurate time readings throughout the day.",
      magneticDeclination: "The magnetic declination for Jaipur is approximately 0.8° East. This is a crucial estimate; for actual construction, a precise, on-site measurement using a solar compass or GPS is required, as declination varies over time.",
      foundationNotes: 'Requires a massive, stable concrete foundation that goes deep into the ground to prevent any possibility of shifting or settling over time, which would compromise its accuracy.',
      toleranceGuidance: "The gnomon's edge must be perfectly sharp and straight to cast a distinct shadow. The degree and minute markings on the quadrants must be engraved with extreme precision, ideally to within 1/60th of a degree.",
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
