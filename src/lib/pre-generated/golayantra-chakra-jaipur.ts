import type { YantraData } from '@/lib/schema/yantra';

export const GOLAYANTRA_CHAKRA_JAIPUR_DATA: YantraData = {
  yantraId: 'golayantra-chakra',
  yantraName: 'Golayantra Chakra',
  description: "<h3>📜 Purpose</h3><ul><li>The Golayantra Chakra is an armillary sphere, a model of the celestial sphere.</li><li>It is used to demonstrate the motion of the stars and to determine celestial coordinates.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Armillary spheres have been used across many cultures, from ancient Greece to India and China.</li><li>They serve as both a scientific instrument and an educational tool to visualize the cosmos.</li></ul><h3>✨ Fun Fact</h3><p>The rings of the Golayantra represent key celestial circles, such as the celestial equator, the ecliptic, and the meridians, making it a 3D map of the heavens.</p>",
  dimensions: {
    'Sphere Diameter': 3,
    'Ring Thickness': 0.1,
    'Number of Rings': 7,
    'Base Height': 1.5,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Bronze or Brass (for rings)', quantity: '500 kg' },
      { item: 'Engraving Tools for markings', quantity: 'Multiple sets' },
      { item: 'Rotational Bearings', quantity: '2 sets' },
      { item: 'Stone or Concrete Pedestal', quantity: '2 cubic meters' },
    ],
    costEstimate: 'High, especially if constructed from traditional materials like bronze. The cost is driven by the skilled metalwork and precision engraving required for the rings.',
    accuracy: 'Primarily an educational and demonstrational tool. Its measurement accuracy is lower than dedicated instruments but is invaluable for understanding celestial mechanics.',
    orientation: {
      trueNorthAngle: 'The main axis of the sphere must be aligned with the celestial poles, meaning it must be parallel to the Earth\'s axis and point towards true north.',
      magneticDeclination: "Correcting for magnetic declination (approx. 0.8° East for Jaipur) is essential for the instrument's primary axis to be a true representation of the sky.",
      foundationNotes: 'Requires a sturdy, level pedestal that can support the weight of the metal sphere and allow for smooth rotation without wobble.',
      toleranceGuidance: 'The rings must be perfectly circular and concentric. The angles between the rings (e.g., the ecliptic angle of 23.5 degrees) must be manufactured with high precision.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
