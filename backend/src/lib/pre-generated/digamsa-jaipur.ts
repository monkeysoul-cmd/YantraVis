import type { YantraData } from '@/lib/schema/yantra';

export const DIGAMSA_JAIPUR_DATA: YantraData = {
  yantraId: 'digamsa',
  yantraName: 'Digamsa Yantra',
  description: "<h3>📜 Purpose</h3><ul><li>The Digamsa Yantra is used to measure the azimuth (horizontal angle or direction) of celestial objects.</li><li>It consists of a central pillar surrounded by two concentric circular walls.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>An essential instrument for accurately mapping the position of stars and planets relative to the observer's horizon.</li><li>Its design allows for readings to be taken from any direction.</li></ul><h3>✨ Fun Fact</h3><p>A string is stretched from the top of the central pillar to the outer wall. The point where the string crosses the inner wall indicates the azimuth of the celestial object being sighted.</p>",
  dimensions: {
    'Outer Wall Diameter': 15,
    'Inner Wall Diameter': 10,
    'Pillar Height': 2.5,
    'Wall Height': 2.5,
  },
  analysis: {
    billOfMaterials: [
      { item: 'Brick and Mortar for walls', quantity: '150 cubic meters' },
      { item: 'Marble or Plaster for markings', quantity: '120 square meters' },
      { item: 'Central Pillar', quantity: '1 unit' },
      { item: 'Taut String/Wire', quantity: '1 unit' },
    ],
    costEstimate: 'High, due to the need for two perfectly circular walls and a perfectly vertical central pillar. The precision of the circular construction is paramount.',
    accuracy: 'Provides high accuracy for azimuth measurements, often within a few minutes of arc, depending on the observer\'s skill and the string\'s tension.',
    orientation: {
      trueNorthAngle: 'The zero-degree mark on the circular walls must be perfectly aligned with True North. This alignment is fundamental for all azimuth readings to be correct.',
      magneticDeclination: "The magnetic declination for Jaipur (approx. 0.8° East) is crucial for the initial setup to ensure the instrument's base is aligned with the Earth's cardinal points.",
      foundationNotes: 'Requires a very stable and perfectly level foundation to support the concentric walls and central pillar, preventing any lean which would introduce errors.',
      toleranceGuidance: 'The circularity of the walls, the verticality of the pillar, and the uniform graduation of the azimuth scale are the most critical tolerances for this instrument.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
