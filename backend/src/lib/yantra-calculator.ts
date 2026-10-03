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

import { YANTRA_KNOWLEDGE } from './yantra-knowledge';

export function generateParametricYantraData(
  yantraId: string,
  latitude: number,
  longitude: number
): YantraData {
  const selectedYantra = YANTRAS.find((y) => y.id === yantraId) || YANTRAS[0];
  const dimensions = calculateParametricDimensions(selectedYantra.id, latitude, longitude);
  const magDecl = calculateMagneticDeclination(latitude, longitude);
  const solarNoon = calculateSolarNoonOffset(longitude);
  const info = YANTRA_KNOWLEDGE[selectedYantra.id] || YANTRA_KNOWLEDGE.samrat;

  const howToReadHtml = info.howToRead
    .map(
      (item) =>
        `<div style="margin-bottom: 12px; padding: 10px 14px; background: hsla(220, 25%, 12%, 0.5); border-left: 3px solid hsl(43, 100%, 52%); border-radius: 6px;">
          <strong style="color: hsl(43, 100%, 65%); display: block; margin-bottom: 4px;">${item.step}</strong>
          <span style="color: hsl(38, 20%, 80%); font-size: 13px; line-height: 1.5;">${item.description}</span>
        </div>`
    )
    .join('');

  const sitesHtml = info.observatoryLocations
    .map(
      (loc) =>
        `<li style="margin-bottom: 6px;"><strong>${loc.site}, ${loc.city}</strong> (${loc.state}) — <span style="opacity: 0.85;">${loc.details}</span></li>`
    )
    .join('');

  const coordsHtml = info.astronomicalCoordinates
    .map(
      (c) =>
        `<span style="display: inline-block; margin: 2px 4px 2px 0; padding: 3px 8px; border-radius: 9999px; background: hsla(24, 90%, 55%, 0.12); border: 1px solid hsla(24, 90%, 55%, 0.25); color: hsl(24, 95%, 65%); font-size: 11px;">${c}</span>`
    )
    .join('');

  const materialsHtml = info.architecturalDetails.materials
    .map((m) => `<li>${m}</li>`)
    .join('');

  const richDescription = `
    <div style="margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid hsla(220, 25%, 16%, 1);">
      <div style="font-size: 18px; font-weight: 700; color: hsl(43, 100%, 60%); margin-bottom: 2px;">
        ${info.devanagari} · ${info.sanskritName}
      </div>
      <div style="font-size: 12px; color: hsl(38, 20%, 70%); font-style: italic;">
        "${info.meaning}"
      </div>
      <div style="margin-top: 8px;">${coordsHtml}</div>
    </div>

    <h3>📜 Purpose & Astronomical Function</h3>
    <p style="margin-bottom: 12px; line-height: 1.6;">${info.primaryPurpose}</p>
    <p style="margin-bottom: 16px; line-height: 1.6;">${info.workingPrinciple}</p>

    <h3>🏛️ Historical Heritage & Creation</h3>
    <p style="margin-bottom: 8px; line-height: 1.6;">
      <strong>Conceived by:</strong> ${info.inventor} (${info.era}).
    </p>
    <p style="margin-bottom: 16px; line-height: 1.6;">${info.vedicSignificance}</p>

    <h3>🔭 Observational Method (How an Astronomer Reads It)</h3>
    <div style="margin-bottom: 16px;">
      ${howToReadHtml}
    </div>

    <h3>📐 Architectural & Mathematical Engineering</h3>
    <ul style="margin-bottom: 12px; padding-left: 20px; line-height: 1.6;">
      <li><strong>Geometric Formula:</strong> ${info.architecturalDetails.geometricPrinciples}</li>
      <li><strong>Unique Architecture:</strong> ${info.architecturalDetails.uniqueFeatures}</li>
      <li><strong>Precision Accuracy:</strong> ${info.accuracy}</li>
    </ul>
    <p style="font-size: 12px; color: hsl(38, 20%, 70%); margin-bottom: 6px;"><strong>Authentic Historic Materials:</strong></p>
    <ul style="margin-bottom: 16px; padding-left: 20px; font-size: 12px; line-height: 1.5; color: hsl(38, 20%, 80%);">
      ${materialsHtml}
    </ul>

    <h3>📍 Historical Observatories with this Instrument</h3>
    <ul style="margin-bottom: 16px; padding-left: 20px; line-height: 1.6;">
      ${sitesHtml}
    </ul>

    <div style="padding: 12px; background: hsla(24, 90%, 55%, 0.08); border: 1px solid hsla(24, 90%, 55%, 0.2); border-radius: 8px; font-size: 12px; line-height: 1.5;">
      <strong>Local Calibration Notice:</strong> This instrument model is calibrated for latitude <strong>${latitude.toFixed(4)}° N</strong> and longitude <strong>${longitude.toFixed(4)}° E</strong>. Local solar noon arrives at <strong>${solarNoon.formatted}</strong>. Magnetic compass correction is <strong>${magDecl.formatted}</strong>.
    </div>
  `.trim();

  return {
    yantraId: selectedYantra.id as any,
    yantraName: selectedYantra.name,
    description: richDescription,
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
