import type { YantraData } from '@/lib/schema/yantra';

export const RAMA_JAIPUR_DATA: YantraData = {
  yantraId: 'rama',
  yantraName: 'Rama Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Rama Yantra is used to measure the altitude (angle above the horizon) and azimuth (direction along the horizon) of celestial objects.</li><li>It consists of a pair of cylindrical structures, open to the sky, that are complementary to each other.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>A key instrument in the Jantar Mantar observatories, it provides a direct and easy-to-read scale for celestial coordinates.</li><li>Its design allows an observer to walk inside and take readings from various points.</li></ul><h3>✨ Fun Fact</h3><p>The walls and floor of the Rama Yantra are graduated with markings for measuring altitude and azimuth. The heights of the walls are equal to the radius of the instrument's base.</p>",
  dimensions: {
    'Cylinder Radius': 12.99,
    Height: 24.21,
    'Slit Width': 1.5,
    'Pillar Height': 24.21,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar (Traditional)', quantity: '350 cubic meters' },
      { item: 'Marble Lining (for markings)', quantity: '250 square meters' },
      { item: 'Central Pillar (Gnomon)', quantity: '1 unit' },
      { item: 'Concrete Foundation', quantity: '150 cubic meters' },
    ],
    costEstimate: 'Significant, comparable to a medium-sized public art installation, due to the need for precise circular construction and extensive, accurate markings on the interior surfaces.',
    accuracy: "Highly accurate for visual observation, allowing for measurements of altitude and azimuth to within a fraction of a degree. Its accuracy depends on the precision of the engraved markings.",
    orientation: {
      trueNorthAngle: "While not a sundial, its cardinal directions must be accurately established for the azimuth readings to be meaningful. The North-South and East-West axes must be precise.",
      magneticDeclination: "The magnetic declination for Jaipur is approximately 0.8° East. This is necessary to correctly orient the instrument's base markings to true cardinal directions.",
      foundationNotes: 'A perfectly level and extremely stable circular foundation is essential to prevent any distortion of the cylindrical shape, which would lead to measurement errors.',
      toleranceGuidance: 'The cylindrical walls must be perfectly vertical and the markings on the floor and walls must be engraved with high precision. The central pillar must be perfectly plumb.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
