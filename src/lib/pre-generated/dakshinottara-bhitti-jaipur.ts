import type { YantraData } from '@/lib/schema/yantra';

export const DAKSHINOTTARA_BHITTI_JAIPUR_DATA: YantraData = {
  yantraId: 'dakshinottara-bhitti',
  yantraName: 'Dakshinottara Bhitti',
  description: "<h3>📜 Purpose</h3><ul><li>The Dakshinottara Bhitti Yantra is a meridian wall instrument specifically used for measuring the altitude of celestial objects at their highest point (noon).</li><li>It helps determine the sun's maximum and minimum altitude during the year, which is used to find the solstices.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>A specialized version of the Bhitti Yantra, it's a key instrument for tracking the annual movement of the sun.</li><li>Observations from this instrument were vital for calendar-making and predicting seasons.</li></ul><h3>✨ Fun Fact</h3><p>The name 'Dakshinottara' refers to the South-North movement of the sun throughout the year, which this instrument is designed to track.</p>",
  dimensions: {
    'Wall Height': 15,
    'Wall Length': 20,
    'Scale Arc Radius': 15,
    'Pinhole Position': 1,
  },
  analysis: {
    billOfMaterials: [
      { item: 'High-quality Masonry for wall', quantity: '500 cubic meters' },
      { item: 'Fine Plaster or Marble for scale', quantity: '100 square meters' },
      { item: 'Gnomon or Pinhole apparatus', quantity: '1 unit' },
      { item: 'Deep, stable foundation', quantity: '200 cubic meters' },
    ],
    costEstimate: 'Extremely high. Similar to a Bhitti Yantra, its cost is driven by the precision of its construction and alignment rather than complexity.',
    accuracy: 'Very high for measuring solar altitude at noon. This accuracy is fundamental for determining the precise dates of the solstices and equinoxes.',
    orientation: {
      trueNorthAngle: 'Like the standard Bhitti Yantra, this wall must be perfectly aligned with the local North-South meridian to function correctly.',
      magneticDeclination: "Correcting for magnetic declination (approx. 0.8° East for Jaipur) is a mandatory first step for aligning the wall to true north.",
      foundationNotes: 'A rock-solid foundation is non-negotiable. Any settling would change the altitude readings and compromise all data collected over years of observation.',
      toleranceGuidance: 'The wall must be perfectly plumb (vertical) and its surface perfectly flat. The altitude scale, usually an engraved quadrant arc, must be precise to arcminutes.',
    },
  },
  location: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
};
