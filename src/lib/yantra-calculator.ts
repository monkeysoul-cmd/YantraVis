import type { YantraData } from './schema/yantra';
import { YANTRAS } from './yantras';

export function calculateMagneticDeclination(latitude: number, longitude: number): {
  angle: number;
  direction: 'East' | 'West';
  formatted: string;
} {
  // Empirical approximation for Indian subcontinent
  const declination = Number((0.5 + (longitude - 75.0) * 0.04 - (latitude - 20.0) * 0.02).toFixed(2));
  const direction = declination >= 0 ? 'East' : 'West';
  const absAngle = Math.abs(declination);
  return {
    angle: absAngle,
    direction,
    formatted: `Approximately ${absAngle.toFixed(2)}° ${direction}`,
  };
}

export function calculateSolarNoonOffset(longitude: number): {
  minutes: number;
  formatted: string;
} {
  // IST is based on 82.5° East
  const diffDegrees = longitude - 82.5;
  const minutes = Number((diffDegrees * 4).toFixed(1));
  const sign = minutes >= 0 ? '+' : '';
  return {
    minutes,
    formatted: `${sign}${minutes} minutes relative to Indian Standard Time (82.5° E)`,
  };
}

export function calculateParametricDimensions(
  yantraId: string,
  latitude: number,
  longitude: number
): Record<string, number> {
  const rad = (Math.abs(latitude) * Math.PI) / 180;
  const sinLat = Math.max(0.1, Math.sin(rad));
  const tanLat = Math.max(0.1, Math.tan(rad));
  const latVal = Number(latitude.toFixed(4));
  const lonNorm = Number((0.5 - longitude / 360).toFixed(4));

  switch (yantraId) {
    case 'samrat': {
      const baseWidth = Number((10 + Math.abs(latitude) / 9).toFixed(2));
      const height = Number((baseWidth * tanLat).toFixed(2));
      const quadrantRadius = Number((height / sinLat).toFixed(2));
      return {
        'Base Width': baseWidth,
        Height: height,
        'Gnomon Angle': latVal,
        'Quadrant Radius': quadrantRadius,
        'North Alignment': lonNorm,
      };
    }
    case 'rama': {
      const radius = Number((12 + Math.abs(latitude) / 10).toFixed(2));
      const height = Number((20 + Math.abs(longitude) / 15).toFixed(2));
      return {
        'Cylinder Radius': radius,
        Height: height,
        'Slit Width': 1.5,
        'Pillar Height': height,
      };
    }
    case 'jai-prakash': {
      const diameter = Number((12 + Math.abs(latitude) / 10).toFixed(2));
      const depth = Number((diameter / 2).toFixed(2));
      const rimHeight = Number((20 + Math.abs(longitude) / 15).toFixed(2));
      return {
        'Bowl Diameter': diameter,
        'Bowl Depth': depth,
        'Rim Height': rimHeight,
        'Cross-wire Tension': latVal,
      };
    }
    case 'rasivalaya': {
      const gnomonHeight = Number((12 + Math.abs(latitude) / 10).toFixed(2));
      const quadrantRadius = Number((20 + Math.abs(longitude) / 15).toFixed(2));
      return {
        'Gnomon Height': gnomonHeight,
        'Quadrant Radius': quadrantRadius,
        'Gnomon Angle': latVal,
        'Number of Instruments': 12,
      };
    }
    case 'digamsa': {
      const outerDiameter = Number((14 + Math.abs(latitude) / 10).toFixed(2));
      const innerDiameter = Number((outerDiameter * 0.66).toFixed(2));
      return {
        'Outer Wall Diameter': outerDiameter,
        'Inner Wall Diameter': innerDiameter,
        'Pillar Height': 2.5,
        'Wall Height': 2.5,
      };
    }
    case 'dhruva-protha-chakra': {
      return {
        'Frame Width': 2,
        'Frame Height': 3,
        'Sighting Hole Diameter': 0.1,
        'Base Angle': latVal,
      };
    }
    case 'yantra-samrat-combo': {
      const baseWidth = Number((13 + Math.abs(latitude) / 12).toFixed(2));
      const gnomonHeight = Number((baseWidth * tanLat).toFixed(2));
      return {
        'Gnomon Height': gnomonHeight,
        'Base Width': baseWidth,
        'Sighting Unit Angle': latVal,
        'Quadrant Radius': Number((gnomonHeight * 1.1).toFixed(2)),
      };
    }
    case 'golayantra-chakra': {
      return {
        'Sphere Diameter': 3,
        'Ring Thickness': 0.1,
        'Number of Rings': 7,
        'Base Height': 1.5,
        'Axis Tilt': latVal,
      };
    }
    case 'bhitti': {
      return {
        'Wall Length': 30,
        'Wall Height': Number((8 + Math.abs(latitude) / 12).toFixed(2)),
        'Wall Thickness': 2,
        'Scale Graduation': 0.1,
      };
    }
    case 'dakshinottara-bhitti': {
      const wallHeight = Number((12 + Math.abs(latitude) / 10).toFixed(2));
      return {
        'Wall Height': wallHeight,
        'Wall Length': 20,
        'Scale Arc Radius': wallHeight,
        'Pinhole Position': 1,
      };
    }
    case 'nadi-valaya': {
      const dialDiameter = Number((4.5 + Math.abs(latitude) / 25).toFixed(2));
      return {
        'Dial Diameter': dialDiameter,
        'Gnomon Length': Number((dialDiameter / 2).toFixed(2)),
        'Tilt Angle': latVal,
        'Dial Thickness': 0.5,
      };
    }
    case 'palaka': {
      return {
        'Board Length': 0.5,
        'Board Width': 0.3,
        'Sighting Pin Height': 0.1,
        'Scale Divisions': 1,
      };
    }
    case 'chaapa': {
      return {
        'Arc Radius': Number((4.5 + Math.abs(latitude) / 20).toFixed(2)),
        'Arc Angle': 120,
        'Gnomon Length': 0.5,
        'Arc Width': 0.5,
      };
    }
    default:
      return {
        'Base Width': Number((10 + latitude / 9).toFixed(2)),
        Height: Number((20 + Math.abs(longitude) / 18).toFixed(2)),
        'Gnomon Angle': latVal,
        'North Alignment': lonNorm,
      };
  }
}

export function generateParametricYantraData(
  yantraId: string,
  latitude: number,
  longitude: number
): YantraData {
  const selectedYantra = YANTRAS.find((y) => y.id === yantraId) || YANTRAS[0];
  const dimensions = calculateParametricDimensions(selectedYantra.id, latitude, longitude);
  const magDecl = calculateMagneticDeclination(latitude, longitude);
  const solarNoon = calculateSolarNoonOffset(longitude);

  const descriptions: Record<string, string> = {
    samrat: `<h3>📜 Purpose</h3><ul><li>The Samrat Yantra ('Supreme Instrument') is a massive equinoctial sundial calibrated specifically for latitude ${latitude.toFixed(4)}° N.</li><li>Its primary purpose is to measure local solar apparent time with precision down to 2 seconds.</li><li>It accurately determines the celestial declination of the Sun throughout the solar year.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Created by Maharaja Sawai Jai Singh II, it represents the pinnacle of monumental Indian naked-eye observational astronomy.</li><li>The hypotenuse of the gnomon is oriented parallel to Earth's rotational axis, pointing directly at the North Celestial Pole.</li></ul><h3>✨ Precision Calibration</h3><p>At latitude ${latitude.toFixed(4)}° N, the gnomon incline is engineered to precisely ${dimensions['Gnomon Angle'] || latitude.toFixed(2)}°. Local solar noon arrives at ${solarNoon.formatted}.</p><h3>🌌 Cosmic Connection</h3><p>Beyond its precise measurements, this instrument embodies the deep philosophical connection between humanity and the cosmos. In traditional Indian astronomy, the alignment of such monumental structures with the heavens was believed to reflect the profound interconnectedness of the terrestrial and celestial realms, acting as a physical manifestation of Vedic astronomical principles.</p>`,
    rama: `<h3>📜 Purpose</h3><ul><li>The Rama Yantra measures both the altitude (angle above the horizon) and azimuth (cardinal heading) of celestial objects.</li><li>It consists of cylindrical hollow structures with radial stone sectors open to the celestial sphere.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Provides an intuitive direct spherical coordinate scale for celestial bodies.</li><li>Observers walk along the interior pathways to observe celestial coordinates unobstructed.</li></ul><h3>✨ Precision Calibration</h3><p>Engineered for latitude ${latitude.toFixed(4)}° N and longitude ${longitude.toFixed(4)}° E with cylinder radius of ${dimensions['Cylinder Radius'] || 13}m and height of ${dimensions['Height'] || 24}m.</p><h3>🌌 Cosmic Connection</h3><p>The duality of the Rama Yantra's complementary open and closed sectors represents the harmonious interplay of space and matter in Vedic cosmology.</p>`,
    'jai-prakash': `<h3>📜 Purpose</h3><ul><li>The Jai Prakash Yantra is a concave hemispherical reflection of the celestial sphere.</li><li>Equipped with crosswires stretched across the rim, shadows of the crosswire intersection directly map sun coordinates, zodiac constellations, and declination.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Regarded as the most ingenious and versatile astronomical instrument designed by Sawai Jai Singh II.</li><li>Constructed as complementary twin bowls (Kapala) allowing astronomers to move inside markings seamlessly.</li></ul><h3>✨ Precision Calibration</h3><p>Bowl diameter calculated at ${dimensions['Bowl Diameter'] || 13}m with depth of ${dimensions['Bowl Depth'] || 6.5}m tuned to latitude ${latitude.toFixed(4)}°.</p><h3>🌌 Cosmic Connection</h3><p>Looking into the bowl produces an inverted optical mirror of the heavens, where the observer stands at the center of the celestial sphere.</p>`,
    rasivalaya: `<h3>📜 Purpose</h3><ul><li>The Rasivalaya consists of a constellation of twelve instruments, each aligned with one of the twelve zodiac signs (Rashis).</li><li>Measures celestial latitude and longitude at the exact instant the zodiac constellation transits the meridian.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Synthesizes classical Vedic Jyotisha astronomical mathematics with observational rigor.</li></ul><h3>✨ Precision Calibration</h3><p>Gnomon incline fixed at ${dimensions['Gnomon Angle'] || latitude.toFixed(2)}° with radius of ${dimensions['Quadrant Radius'] || 24}m.</p><h3>🌌 Cosmic Connection</h3><p>Connects the observer with the path of the ecliptic across the cosmic zodiac wheel.</p>`,
    digamsa: `<h3>📜 Purpose</h3><ul><li>The Digamsa Yantra measures the horizontal azimuth angle of any celestial body from North.</li><li>Employs concentric circular walls with a vertical central pillar and sighting cords.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Essential for determining precise sunrise/sunset azimuths and planetary alignments.</li></ul><h3>✨ Precision Calibration</h3><p>Outer diameter calculated at ${dimensions['Outer Wall Diameter'] || 15}m with height 2.5m.</p><h3>🌌 Cosmic Connection</h3><p>Encompasses the 360-degree horizon (Dig/Disha), anchoring terrestrial observers within the cosmic cardinal compass.</p>`,
    'dhruva-protha-chakra': `<h3>📜 Purpose</h3><ul><li>Determines the exact meridian transit of the Pole Star (Dhruva) and other circumpolar stars.</li><li>Used to calculate stellar right ascension and polar coordinates.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Anchors the true polar meridian against which all other instruments are calibrated.</li></ul><h3>✨ Precision Calibration</h3><p>Base mounting calibrated to polar angle ${dimensions['Base Angle'] || latitude.toFixed(2)}° matching local latitude.</p><h3>🌌 Cosmic Connection</h3><p>Tuned to Dhruva (the North Star), the unmoving celestial pivot in classical Indian astronomy.</p>`,
    'yantra-samrat-combo': `<h3>📜 Purpose</h3><ul><li>A unified observatory installation combining the high-precision solar timekeeping of the Samrat Yantra with stellar sighting chakra elements.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Allows dual daylight and nocturnal astronomical tracking in a single architectural footprint.</li></ul><h3>✨ Precision Calibration</h3><p>Gnomon height calculated at ${dimensions['Gnomon Height'] || 20}m with sighting angle ${dimensions['Sighting Unit Angle'] || latitude.toFixed(2)}°.</p><h3>🌌 Cosmic Connection</h3><p>Bridges the diurnal solar rhythm with nocturnal stellar navigation.</p>`,
    'golayantra-chakra': `<h3>📜 Purpose</h3><ul><li>An armillary sphere representing the celestial equator, ecliptic, meridian, and tropics.</li><li>Demonstrates planetary paths and models solar-lunar eclipses.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Described in early classical treatises by Aryabhata and Brahmagupta as a prime pedagogical astronomical apparatus.</li></ul><h3>✨ Precision Calibration</h3><p>Central polar axis tilted to local latitude ${dimensions['Axis Tilt'] || latitude.toFixed(2)}°.</p><h3>🌌 Cosmic Connection</h3><p>A miniature dynamic kinetic replica of the Brahmanda (universe).</p>`,
    bhitti: `<h3>📜 Purpose</h3><ul><li>A massive north-south meridian mural wall measuring transit altitude and zenith distance of celestial bodies.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>The cornerstone of meridian astronomy for determining the exact length of the solar tropical year.</li></ul><h3>✨ Precision Calibration</h3><p>Wall length ${dimensions['Wall Length'] || 30}m, scale division 0.1°.</p><h3>🌌 Cosmic Connection</h3><p>Captures the apex moment of every celestial traveler as it crosses the observer's local meridian.</p>`,
    'dakshinottara-bhitti': `<h3>📜 Purpose</h3><ul><li>A double meridian wall tracking the Sun's annual north-south seasonal drift (Uttarayana and Dakshinayana).</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Crucial for determining solstices, equinoxes, and seasonal agricultural calendars.</li></ul><h3>✨ Precision Calibration</h3><p>Wall height ${dimensions['Wall Height'] || 15}m with scale arc radius of ${dimensions['Scale Arc Radius'] || 15}m.</p><h3>🌌 Cosmic Connection</h3><p>Witnesses the eternal dance of the Sun between the northern and southern tropics.</p>`,
    'nadi-valaya': `<h3>📜 Purpose</h3><ul><li>A dual-faced equinoctial dial tilted parallel to the Earth's equator.</li><li>Northern face indicates time during spring and summer; southern face indicates time during autumn and winter.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Immediately signals the exact moment of the equinox when the shadow transitions between dial faces.</li></ul><h3>✨ Precision Calibration</h3><p>Dial axis tilted to ${dimensions['Tilt Angle'] || latitude.toFixed(2)}° with dial diameter ${dimensions['Dial Diameter'] || 5}m.</p><h3>🌌 Cosmic Connection</h3><p>Reflects the seasonal equilibrium of night and day on the celestial equator.</p>`,
    palaka: `<h3>📜 Purpose</h3><ul><li>A portable planar board instrument with plumb lines for determining solar altitude and time.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Widely utilized by traditional travelling astrologers and field navigators.</li></ul><h3>✨ Precision Calibration</h3><p>Board length ${dimensions['Board Length'] || 0.5}m, width ${dimensions['Board Width'] || 0.3}m.</p><h3>🌌 Cosmic Connection</h3><p>A compact tool connecting personal human perception directly to celestial geometry.</p>`,
    chaapa: `<h3>📜 Purpose</h3><ul><li>A graduated arc instrument for direct angular measurement of celestial declination.</li></ul><h3>🏛️ Historical Significance</h3><ul><li>Precursor to modern sextants, providing high precision in an arc geometry.</li></ul><h3>✨ Precision Calibration</h3><p>Arc radius ${dimensions['Arc Radius'] || 5}m across 120° subtended span.</p><h3>🌌 Cosmic Connection</h3><p>Traces the curvature of celestial orbits through clean geometric arcs.</p>`,
  };

  const defaultDescription = descriptions[yantraId] || descriptions.samrat;

  return {
    yantraId: selectedYantra.id as any,
    yantraName: selectedYantra.name,
    description: defaultDescription,
    dimensions,
    analysis: {
      billOfMaterials: [
        { item: 'Reinforced Concrete Foundation (M30)', quantity: `${Math.round(150 + Math.abs(latitude) * 2)} cubic meters` },
        { item: 'Traditional Red/Buff Sandstone & Brickwork', quantity: `${Math.round(300 + Math.abs(latitude) * 4)} cubic meters` },
        { item: 'Polished White Makrana Marble (Scale Markings)', quantity: `${Math.round(80 + Math.abs(latitude))} square meters` },
        { item: 'Bronze / Brass Gnomon & Edge Hardware', quantity: '1 set precision machined' },
      ],
      costEstimate: `Estimated construction cost: ₹1.2 Cr - ₹2.5 Cr ($150,000 - $300,000 USD), varying based on site soil conditions, marble finishing quality, and precision laser engraving.`,
      accuracy: `Expected observational precision: ±2 to 5 arc-seconds under clear viewing conditions, with gnomon edge shadow resolution of 2 seconds of solar time.`,
      orientation: {
        trueNorthAngle: `Align gnomon axis strictly to True Astronomical North (0.00° azimuth). A baseline solar shadow observation or dual-frequency RTK GNSS receiver must be used on site.`,
        magneticDeclination: `${magDecl.formatted}. Magnetic compass needles must be corrected by this offset to locate true meridian. Local solar noon offset is ${solarNoon.formatted}.`,
        foundationNotes: `Foundation must extend below the regional frost/moisture heave line to bedrock or dense compacted strata with less than 0.5mm settlement tolerance over 50 years.`,
        toleranceGuidance: `Angular alignment tolerance for gnomon slope: ±0.01° (must precisely match ${latitude.toFixed(4)}°). Scale graduations engraved to 0.1mm tolerance.`,
      },
    },
    location: {
      latitude,
      longitude,
    },
  };
}
