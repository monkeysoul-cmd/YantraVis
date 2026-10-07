import type { YantraData } from './schema/yantra';

export function generateDxfContent(data: YantraData): string {
  const { yantraName, yantraId, dimensions, location } = data;
  const lat = location.latitude;
  const lon = location.longitude;

  const lines: string[] = [];

  // DXF Header
  lines.push('0', 'SECTION', '2', 'HEADER');
  lines.push('9', '$ACADVER', '1', 'AC1009'); // AutoCAD R11/R12 ASCII DXF (universal compatibility)
  lines.push('9', '$INSUNITS', '70', '4'); // Millimeters
  lines.push('0', 'ENDSEC');

  // DXF Tables (Layers)
  lines.push('0', 'SECTION', '2', 'TABLES');
  lines.push('0', 'TABLE', '2', 'LAYER', '70', '4');

  // Layer 0
  lines.push('0', 'LAYER', '2', '0', '70', '0', '62', '7', '6', 'CONTINUOUS');
  // Layer GNOMON
  lines.push('0', 'LAYER', '2', 'GNOMON', '70', '0', '62', '1', '6', 'CONTINUOUS'); // Red
  // Layer FOUNDATION
  lines.push('0', 'LAYER', '2', 'FOUNDATION', '70', '0', '62', '5', '6', 'CONTINUOUS'); // Blue
  // Layer DIMENSIONS
  lines.push('0', 'LAYER', '2', 'DIMENSIONS', '70', '0', '62', '3', '6', 'CONTINUOUS'); // Green
  // Layer TEXT_ANNOTATION
  lines.push('0', 'LAYER', '2', 'ANNOTATION', '70', '0', '62', '2', '6', 'CONTINUOUS'); // Yellow

  lines.push('0', 'ENDTAB');
  lines.push('0', 'ENDSEC');

  // DXF Entities
  lines.push('0', 'SECTION', '2', 'ENTITIES');

  // Title Text
  lines.push('0', 'TEXT', '8', 'ANNOTATION');
  lines.push('10', '0.0', '20', '35.0', '30', '0.0'); // X, Y, Z
  lines.push('40', '1.5'); // Text height
  lines.push('1', `YANTRAVIS CAD EXPORT: ${yantraName.toUpperCase()}`);

  lines.push('0', 'TEXT', '8', 'ANNOTATION');
  lines.push('10', '0.0', '20', '32.5', '30', '0.0');
  lines.push('40', '1.0');
  lines.push('1', `GEOLOCATION: LAT ${lat.toFixed(4)} DEG N, LON ${lon.toFixed(4)} DEG E`);

  // Parametric Dimensions annotations
  const dims = dimensions || {};
  let textY = 29.0;
  Object.entries(dims).forEach(([key, val]) => {
    lines.push('0', 'TEXT', '8', 'DIMENSIONS');
    lines.push('10', '0.0', '20', textY.toFixed(2), '30', '0.0');
    lines.push('40', '0.8');
    lines.push('1', `${key}: ${val}`);
    textY -= 1.8;
  });

  // Base Foundation Rectangle
  const baseW = Number(dims['Base Width'] || dims['Wall Length'] || dims['Cylinder Radius'] || 15);
  const h = Number(dims['Height'] || dims['Gnomon Height'] || dims['Wall Height'] || 20);

  // Foundation ground line
  lines.push('0', 'LINE', '8', 'FOUNDATION');
  lines.push('10', '-5.0', '20', '0.0', '30', '0.0');
  lines.push('11', (baseW + 5).toFixed(2), '21', '0.0', '31', '0.0');

  if (yantraId === 'samrat' || yantraId === 'yantra-samrat-combo') {
    // 3DFACE for Gnomon Triangle
    lines.push('0', '3DFACE', '8', 'GNOMON');
    lines.push('10', '0.0', '20', '0.0', '30', '0.0');
    lines.push('11', baseW.toFixed(2), '21', '0.0', '31', '0.0');
    lines.push('12', '0.0', '22', h.toFixed(2), '32', '0.0');
    lines.push('13', '0.0', '23', h.toFixed(2), '33', '0.0');

    // Hypotenuse dimension line
    lines.push('0', 'LINE', '8', 'DIMENSIONS');
    lines.push('10', '0.0', '20', h.toFixed(2), '30', '0.0');
    lines.push('11', baseW.toFixed(2), '21', '0.0', '31', '0.0');

    // Quadrant arcs on east and west
    const qRadius = Number(dimensions['Quadrant Radius'] || h);
    lines.push('0', 'ARC', '8', 'GNOMON');
    lines.push('10', '0.0', '20', '0.0', '30', '0.0'); // Center
    lines.push('40', qRadius.toFixed(2)); // Radius
    lines.push('50', '0.0'); // Start angle
    lines.push('51', '90.0'); // End angle
  } else if (yantraId === 'rama' || yantraId === 'digamsa') {
    const radius = Number(dimensions['Cylinder Radius'] || dimensions['Outer Wall Diameter'] || 12);
    lines.push('0', 'CIRCLE', '8', 'GNOMON');
    lines.push('10', (radius + 2).toFixed(2), '20', (radius + 2).toFixed(2), '30', '0.0');
    lines.push('40', radius.toFixed(2));

    // Center gnomon pillar
    lines.push('0', 'CIRCLE', '8', 'GNOMON');
    lines.push('10', (radius + 2).toFixed(2), '20', (radius + 2).toFixed(2), '30', '0.0');
    lines.push('40', '0.8');
  } else if (yantraId === 'jai-prakash') {
    const bowlRadius = Number(dimensions['Bowl Diameter'] || 12) / 2;
    lines.push('0', 'CIRCLE', '8', 'GNOMON');
    lines.push('10', (bowlRadius + 5).toFixed(2), '20', (bowlRadius + 5).toFixed(2), '30', '0.0');
    lines.push('40', bowlRadius.toFixed(2));

    // Cross-wires
    lines.push('0', 'LINE', '8', 'DIMENSIONS');
    lines.push('10', '5.0', '20', (bowlRadius + 5).toFixed(2), '30', '0.0');
    lines.push('11', (bowlRadius * 2 + 5).toFixed(2), '21', (bowlRadius + 5).toFixed(2), '31', '0.0');

    lines.push('0', 'LINE', '8', 'DIMENSIONS');
    lines.push('10', (bowlRadius + 5).toFixed(2), '20', '5.0', '30', '0.0');
    lines.push('11', (bowlRadius + 5).toFixed(2), '21', (bowlRadius * 2 + 5).toFixed(2), '31', '0.0');
  } else {
    // Default rectangle representation
    lines.push('0', '3DFACE', '8', 'GNOMON');
    lines.push('10', '0.0', '20', '0.0', '30', '0.0');
    lines.push('11', baseW.toFixed(2), '21', '0.0', '31', '0.0');
    lines.push('12', baseW.toFixed(2), '22', h.toFixed(2), '32', '0.0');
    lines.push('13', '0.0', '23', h.toFixed(2), '33', '0.0');
  }

  // True North Meridian Vector
  lines.push('0', 'LINE', '8', 'DIMENSIONS');
  lines.push('10', '-3.0', '20', '0.0', '30', '0.0');
  lines.push('11', '-3.0', '21', '12.0', '31', '0.0');

  lines.push('0', 'TEXT', '8', 'DIMENSIONS');
  lines.push('10', '-3.5', '20', '13.0', '30', '0.0');
  lines.push('40', '1.0');
  lines.push('1', 'TRUE NORTH (0.00 DEG)');

  // Close Entities and EOF
  lines.push('0', 'ENDSEC');
  lines.push('0', 'EOF');

  return lines.join('\n');
}
