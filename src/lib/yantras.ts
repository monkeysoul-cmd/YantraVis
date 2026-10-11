import type { ComponentType, SVGProps } from 'react';
import { SamratIcon, RamaIcon, JaiPrakashIcon, RasivalayaIcon, DigamsaIcon, DhruvaProthaChakraIcon, YantraSamratComboIcon, GolayantraChakraIcon, BhittiIcon, DakshinottaraBhittiIcon, NadiValayaIcon, PalakaIcon, ChaapaIcon } from '@/components/icons';

export type Yantra = {
  id: 'samrat' | 'rama' | 'jai-prakash' | 'rasivalaya' | 'digamsa' | 'dhruva-protha-chakra' | 'yantra-samrat-combo' | 'golayantra-chakra' | 'bhitti' | 'dakshinottara-bhitti' | 'nadi-valaya' | 'palaka' | 'chaapa';
  name: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const YANTRAS: readonly Yantra[] = [
  {
    id: 'samrat',
    name: 'Samrat Yantra',
    description: 'The Samrat Yantra ("Supreme Instrument") is a colossal equinoctial sundial and the crown jewel of Jantar Mantar. Its massive triangular gnomon, angled precisely to the local latitude, is oriented parallel to Earth\'s rotational axis. The symmetrical quadrant arcs on either side are calibrated in hours, minutes, and 2-second intervals, making it the most precise pre-telescopic timekeeping instrument ever constructed. The Jaipur version stands 27 meters tall — a UNESCO World Heritage masterpiece.',
    Icon: SamratIcon,
  },
  {
    id: 'rama',
    name: 'Rama Yantra',
    description: 'The Rama Yantra is a uniquely Indian invention with no parallel in European or Islamic astronomy. Built as two complementary open-air cylindrical towers, each houses a central pillar whose height equals the cylinder\'s inner radius. Together they simultaneously measure both the altitude and azimuth of celestial objects. The alternating open and stone sectors across the twin structures ensure complete 360° coverage without sightline obstruction.',
    Icon: RamaIcon,
  },
  {
    id: 'jai-prakash',
    name: 'Jai Prakash Yantra',
    description: 'The Jai Prakash Yantra ("Light of Victory") is considered by historians of science to be the most versatile naked-eye astronomical instrument ever conceived. It consists of two complementary hemispherical bowls that create an inverted map of the entire celestial sphere. Taut bronze crosswires stretched across the rim hold a central sighting ring; its shadow on the concave marble interior simultaneously reveals altitude, azimuth, declination, hour angle, and the zodiac sign on the meridian.',
    Icon: JaiPrakashIcon,
  },
  {
    id: 'rasivalaya',
    name: 'Rasivalaya Yantra',
    description: 'The Rasivalaya Yantras are a unique ensemble of twelve specialized zodiacal instruments — one dedicated to each Rashi (zodiac sign) from Aries to Pisces. Each gnomon is angled to point at the ecliptic pole when its designated constellation transits the meridian, enabling direct measurement of celestial longitude and latitude without mathematical conversion. The complete set of 12 instruments exists only at Jaipur — the sole surviving example in the world.',
    Icon: RasivalayaIcon,
  },
  {
    id: 'digamsa',
    name: 'Digamsa Yantra',
    description: 'The Digamsa Yantra ("Direction-Degree Instrument") is a precision azimuth measurement device featuring two concentric cylindrical stone walls with a central sighting pillar. Its 360-degree graduated outer rim allows rapid, high-accuracy measurement of horizontal bearings for sunrise/sunset azimuths, stellar horizon transits, and cardinal direction surveys. The instrument anchors observers to the eight sacred directions (Ashta-Dikpalas) of classical Indian cosmology.',
    Icon: DigamsaIcon,
  },
  {
    id: 'dhruva-protha-chakra',
    name: 'Dhruva-Protha-Chakra Yantra',
    description: 'The Dhruva-Protha-Chakra ("Polar Axis Wheel") is a specialized stellar instrument permanently aligned to the North Celestial Pole (Polaris). Its calibrated metallic ring, mounted on a latitude-tilted pivot axis, rotates freely in the polar plane to track circumpolar star circles. Used to determine stellar right ascension and polar distances, it reveres Dhruva (the Pole Star) as the immovable cosmic center of the revolving heavens in Puranic astronomy.',
    Icon: DhruvaProthaChakraIcon,
  },
  {
    id: 'yantra-samrat-combo',
    name: 'Samrat Combo Yantra',
    description: 'The Samyukta Samrat Yantra is a unified observatory complex that integrates the triangular gnomon sundial of the Samrat Yantra with upper sighting platforms and auxiliary stellar chakra rings. This dual-purpose design enables continuous 24-hour astronomical coverage: solar apparent timekeeping by day using the quadrant arcs, and star altitude/declination tracking by night through plumb-line sighting markers on the upper chhatris.',
    Icon: YantraSamratComboIcon,
  },
  {
    id: 'golayantra-chakra',
    name: 'Golayantra Chakra Yantra',
    description: 'The Gola Yantra is a multi-ring armillary celestial sphere — a physical 3D analog computer of the universe. Its nested concentric bronze rings represent the celestial equator, ecliptic circle, horizon, prime meridian, solstitial colures, and planetary orbital planes. Detailed in the Aryabhatiya\'s Goladhyaya chapter, it demonstrates planetary orbits, solar-lunar eclipses, and coordinate transformations between horizon, equatorial, and ecliptic systems.',
    Icon: GolayantraChakraIcon,
  },
  {
    id: 'bhitti',
    name: 'Bhitti Yantra',
    description: 'The Bhitti Yantra ("Great Meridian Mural Wall") is a colossal vertical masonry wall constructed with extreme precision in the plane of the True Astronomical Meridian. Calibrated quadrant arcs on its face, centered on pinhole apertures, precisely determine the altitude of the Sun at solar noon, the exact instant of local noon passage, and seasonal zenith distance changes. It is the ultimate arbiter of solar noon — defining the midpoint of the Vedic astronomical day.',
    Icon: BhittiIcon,
  },
  {
    id: 'dakshinottara-bhitti',
    name: 'Dakshinottara Bhitti Yantra',
    description: 'The Dakshinottara Bhitti ("North-South Double Meridian Wall") tracks the annual northward (Uttarayana) and southward (Dakshinayana) journeys of the Sun. It features dual marble quadrant scales mounted on eastern and western wall faces, enabling simultaneous recording before and after transit. This instrument precisely measures the obliquity of the ecliptic (±23.44°) and fixes the astronomical start of Makar Sankranti and Karka Sankranti.',
    Icon: DakshinottaraBhittiIcon,
  },
  {
    id: 'nadi-valaya',
    name: 'Nadi Valaya Yantra',
    description: 'The Nadi Valaya ("Equinoctial Dial") consists of two circular dial plates tilted parallel to Earth\'s equatorial plane, with a central gnomon rod projecting perpendicularly through both faces. The northern face receives sunlight during Uttarayana (spring/summer), the southern during Dakshinayana (autumn/winter). On equinox days, sunlight illuminates both faces tangentially — a physical visual indicator of Earth\'s orbital tilt. Time is marked in traditional Ghatis and Palas.',
    Icon: NadiValayaIcon,
  },
  {
    id: 'palaka',
    name: 'Palaka Yantra',
    description: 'The Palaka Yantra ("Planar Board Instrument") is a portable astrometric device described in Bhaskaracharya\'s 12th-century Siddhanta Shiromani. It features a rectangular calculating board with a central sighting gnomon (Shanku), plumb-line, and graduated trigonometric tangent scales. Used by travelling astronomers and royal surveyors, it measures solar altitude, shadow length ratios, and angular distances between stars through direct right-angled planar geometry.',
    Icon: PalakaIcon,
  },
  {
    id: 'chaapa',
    name: 'Chaapa Yantra',
    description: 'The Chaapa Yantra ("Bow/Arc Instrument" or Dhanur Yantra) is a precision graduated meridian sextant featuring a curved bow-shaped arc mounted on a north-south masonry pier. Equipped with movable sighting vanes and vernier graduations, it measures celestial declination and zenith angles of stars across a 120-degree subtended arc. The instrument symbolizes the celestial bow (Dhanush) of Lord Rama, aiming with pinpoint precision at cosmic targets.',
    Icon: ChaapaIcon,
  },
];

