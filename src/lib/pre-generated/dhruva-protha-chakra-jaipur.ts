import type { YantraData } from '@/lib/schema/yantra';

export const DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA: YantraData = {
  yantraId: 'dhruva-protha-chakra',
  yantraName: 'Dhruva-Protha-Chakra',
  description: "<h3>📜 Purpose</h3><ul><li>The Dhruva-Protha-Chakra is specifically designed to observe and find the position of the pole star (Dhruva Tara).</li><li>It can also be used to determine the latitude of the location.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>This instrument highlights the importance of the pole star in ancient navigation and astronomy as a fixed reference point in the sky.</li><li>Its simple design belies its fundamental purpose in establishing local celestial coordinates.</li></ul><h3>✨ Fun Fact</h3><p>The instrument is essentially a pinhole sight aimed at the pole star. The angle of the sighting tube or block directly corresponds to the latitude of the observer.</p>",
  dimensions: {
    'Frame Width': 2,
    'Frame Height': 3,
    'Sighting Hole Diameter': 0.1,
    'Base Angle': 26.91,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Wooden or Masonry Frame', quantity: '1 unit' },
      { item: 'Pinhole Plate (Metal)', quantity: '1 unit' },
      { item: 'Adjustable Protractor/Scale', quantity: '1 unit' },
      { item: 'Stable Base', quantity: '1 unit' },
    ],
    costEstimate: 'Relatively low compared to other yantras. It is a simpler instrument focused on a single observational task, suitable for smaller observatories or educational purposes.',
    accuracy: 'Accuracy is dependent on the stability of the instrument and the precision of the angle measurement. It can determine latitude to within a fraction of a degree.',
    orientation: {
      trueNorthAngle: 'The entire instrument must be aligned on the North-South meridian line to correctly sight the pole star, which lies very close to the true celestial north pole.',
      magneticDeclination: "Correcting for magnetic declination (approx. 0.8° East for Jaipur) is necessary to establish the true north-south line for alignment.",
      foundationNotes: 'Requires a stable, vibration-free platform that can be precisely leveled and aligned. The foundation does not need to be massive, but it must be firm.',
      toleranceGuidance: 'The primary tolerance is in the angle of the sighting mechanism. The scale for measuring the latitude must be finely graduated. The pinhole must be small and perfectly round.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
