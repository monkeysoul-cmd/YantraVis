export interface YantraInfo {
  id: string;
  name: string;
  sanskritName: string;
  devanagari: string;
  category: 'Solar Timekeeping' | 'Altitude & Azimuth' | 'Equinoctial & Meridian' | 'Zodiacal & Ecliptic' | 'Armillary & Stellar';
  meaning: string;
  inventor: string;
  era: string;
  primaryPurpose: string;
  astronomicalCoordinates: string[];
  workingPrinciple: string;
  howToRead: {
    step: string;
    description: string;
  }[];
  architecturalDetails: {
    materials: string[];
    geometricPrinciples: string;
    uniqueFeatures: string;
  };
  observatoryLocations: {
    site: string;
    city: string;
    state: string;
    details: string;
  }[];
  vedicSignificance: string;
  accuracy: string;
}

export const YANTRA_KNOWLEDGE: Record<string, YantraInfo> = {
  samrat: {
    id: 'samrat',
    name: 'Samrat Yantra',
    sanskritName: 'Vrihat Samrat Yantra',
    devanagari: 'वृहत् सम्राट यन्त्र',
    category: 'Solar Timekeeping',
    meaning: 'Supreme or King of Instruments — the colossal equinoctial sundial.',
    inventor: 'Maharaja Sawai Jai Singh II and Royal Astrologer Jagannatha Samrat',
    era: '1728–1734 CE',
    primaryPurpose: 'Precise measurement of local solar apparent time down to an accuracy of 2 seconds, and determination of solar declination and meridian transit.',
    astronomicalCoordinates: ['Local Apparent Solar Time', 'Solar Declination (δ)', 'Hour Angle (h)', 'Zenith Distance at Solar Noon'],
    workingPrinciple: 'The Samrat Yantra is an equinoctial sundial of monumental proportions. Its central triangular gnomon is a right-angled triangle whose hypotenuse is oriented strictly parallel to Earth’s rotational axis, pointing directly at the North Celestial Pole (Pole Star). Symmetrically attached to its base on either side are two massive curved marble quadrant arcs, constructed strictly parallel to the plane of the Earth’s equator.',
    howToRead: [
      {
        step: '1. Locate the Gnomon Shadow',
        description: 'Observe the sharp shadow cast by the knife-edge gnomon onto the west quadrant before solar noon, or onto the east quadrant after solar noon.'
      },
      {
        step: '2. Read the Time Scale',
        description: 'The curved marble quadrant is graduated in hours, minutes, and 2-second sub-divisions (as well as traditional Indian Ghatis and Palas, where 1 Ghati = 24 minutes, 1 Pala = 24 seconds).'
      },
      {
        step: '3. Compute Solar Declination',
        description: 'Read the height of the shadow intersection along the scale engraved on the gnomon edge to determine the Sun’s declination north or south of the celestial equator.'
      },
      {
        step: '4. Apply Equation of Time',
        description: 'Combine the local apparent time with the Equation of Time (E) and longitude offset from 82.5° E to obtain Indian Standard Time (IST).'
      }
    ],
    architecturalDetails: {
      materials: ['Local Jaipur Chhatar pink/red sandstone core', 'High-density lime plaster (Chuna mortar)', 'Fine Makrana white marble scale inlays', 'Bronze gnomon edge plates'],
      geometricPrinciples: 'The gnomon angle equals the exact latitude of the observatory site (e.g. 26.92° for Jaipur). The quadrant arc radius is centered along the gnomon hypotenuse, ensuring a linear scale of 15° per hour.',
      uniqueFeatures: 'The Jaipur Vrihat Samrat Yantra stands 27 meters (90 feet) high, casting a shadow that moves at a visible speed of 1 millimeter per second.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Largest stone sundial in the world (Vrihat Samrat Yantra), UNESCO World Heritage Site.' },
      { site: 'Jantar Mantar', city: 'New Delhi', state: 'NCT of Delhi', details: 'Built in 1724, 20.7m gnomon height, prominently stands in Connaught Place.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Historic observatory on the ancient prime meridian of Hindu astronomy.' },
      { site: 'Man Mahal Observatory', city: 'Varanasi', state: 'Uttar Pradesh', details: 'Rooftop observatory overlooking Man Mandir Ghat on the River Ganges.' }
    ],
    vedicSignificance: 'Embraces the ancient Surya Siddhanta principles of diurnal solar rhythm (Kala-Chakra) and provides empirical synchronization for the regional Hindu calendar (Panchanga).',
    accuracy: '±2 seconds of solar time under direct sunlight.'
  },

  rama: {
    id: 'rama',
    name: 'Rama Yantra',
    sanskritName: 'Rama Yantra',
    devanagari: 'राम यन्त्र',
    category: 'Altitude & Azimuth',
    meaning: 'Named in honor of Maharaja Rama Singh, ancestor of Sawai Jai Singh II.',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1724–1730 CE',
    primaryPurpose: 'Simultaneous direct measurement of the altitude (zenith distance) and horizontal azimuth angle of the Sun, planets, and celestial stars.',
    astronomicalCoordinates: ['Celestial Altitude (a)', 'Azimuth Angle (A)', 'Zenith Distance (z = 90° - a)'],
    workingPrinciple: 'Constructed as an open-air cylindrical stone enclosure open to the sky, with a vertical cylindrical pillar at the center. The cylinder radius is engineered to equal exactly the height of the central pillar. The interior floor and perimeter walls are graduated into radial and vertical degrees.',
    howToRead: [
      {
        step: '1. Day Observation (Sun)',
        description: 'Observe the shadow of the central pillar’s tip falling on either the radial floor sectors or the vertical wall sectors.'
      },
      {
        step: '2. Night Observation (Stars & Planets)',
        description: 'An observer aligns their eye with one of the graduation marks on the stone sector and sights the celestial target grazing the top edge of the central pillar.'
      },
      {
        step: '3. Read Altitude & Azimuth',
        description: 'Floor sectors read altitude from 90° (at center) down to 45° (at wall base); wall scales read altitude from 45° down to 0° (horizon). Azimuth is read along the 360° circular perimeter from True North.'
      },
      {
        step: '4. Use the Complementary Pair',
        description: 'Because each instrument has alternating open and stone sectors (30° each), observations falling into an open sector are read on the identical twin instrument located nearby.'
      }
    ],
    architecturalDetails: {
      materials: ['Hand-carved buff sandstone', 'Engraved marble scale insets', 'Lead fill for graduation marks'],
      geometricPrinciples: 'Pillar height H equals cylinder inner radius R. Floor graduations follow r = H × cot(altitude), while wall graduations follow h = R × tan(altitude).',
      uniqueFeatures: 'Built as two complementary twin structures (A and B). The open sectors allow the astronomer to stand and move without casting unintended shadows or blocking line of sight.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Two pristine pairs with wooden sighting rings and intact marble scales.' },
      { site: 'Jantar Mantar', city: 'New Delhi', state: 'NCT of Delhi', details: 'Two majestic cylindrical towers with intact radial interior floors.' }
    ],
    vedicSignificance: 'A uniquely Indian architectural invention with no historical parallel in European or Islamic astrolabes, bringing spherical trigonometry into tangible architectural space.',
    accuracy: '±0.1° (6 arc-minutes) for stellar and solar coordinates.'
  },

  'jai-prakash': {
    id: 'jai-prakash',
    name: 'Jai Prakash Yantra',
    sanskritName: 'Jai Prakash Yantra',
    devanagari: 'जय प्रकाश यन्त्र',
    category: 'Equinoctial & Meridian',
    meaning: 'Light of Jai — the crest jewel of Sawai Jai Singh’s astronomical inventions.',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1730–1734 CE',
    primaryPurpose: 'Comprehensive multi-coordinate observation: maps the inverted celestial sphere directly onto a hemispherical bowl to read altitude, azimuth, declination, hour angle, and zodiac transit in one glance.',
    astronomicalCoordinates: ['Altitude & Azimuth', 'Hour Angle & Local Time', 'Solar Declination', 'Zodiac Constellation on Meridian (Lagna)'],
    workingPrinciple: 'Consists of two complementary hemispherical sunken bowls (Kapala A and B). Taut crosswires stretched along the cardinal North-South and East-West axes intersect at the exact center of the sphere, holding a small central sighting ring. The interior concave surface is a direct inverted map of the celestial hemisphere above.',
    howToRead: [
      {
        step: '1. Sighting the Center Ring Shadow',
        description: 'During sunlight, the intersection of the crosswires casts a sharp shadow point onto the curved marble interior.'
      },
      {
        step: '2. Reading Coordinates Directly',
        description: 'Engraved coordinate grids trace altitude circles, azimuth curves, celestial equator, tropics of Cancer/Capricorn, and the twelve zodiac sectors (Rashis).'
      },
      {
        step: '3. Identifying Zodiac Sign',
        description: 'The point where the shadow rests indicates which zodiac sign is currently rising, setting, or culminating on the meridian.'
      },
      {
        step: '4. Walking Inside the Twin Bowl',
        description: 'Pathways cut into the bowl allow the astronomer to walk down inside to take close vernier readings. Observations falling on a pathway are taken on the complementary companion bowl.'
      }
    ],
    architecturalDetails: {
      materials: ['Carved white marble slabs', 'Lime-mortar subterranean foundations', 'Taut bronze/brass crosswires', 'Central perforated sighting washer'],
      geometricPrinciples: 'Concave hemispherical bowl of radius R. Every point on the sphere corresponds stereographically to an angular coordinate in the sky.',
      uniqueFeatures: 'Considered by modern historians of science to be the most versatile and elegant naked-eye astronomical instrument ever devised in the pre-telescopic world.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Dual bowls in immaculate working order with intricate zodiac and coordinate inlays.' },
      { site: 'Jantar Mantar', city: 'New Delhi', state: 'NCT of Delhi', details: 'Two restored subterranean bowls located south of the Samrat Yantra.' }
    ],
    vedicSignificance: 'Embodies the Vedic concept of the Brahmanda (cosmic sphere) held in human hands, enabling direct visual contemplation of the celestial dance.',
    accuracy: '±3 arc-minutes; provides instant multi-system coordinate verification.'
  },

  rasivalaya: {
    id: 'rasivalaya',
    name: 'Rasivalaya Yantra',
    sanskritName: 'Rasivalaya Yantra',
    devanagari: 'राशिवलय यन्त्र',
    category: 'Zodiacal & Ecliptic',
    meaning: 'Zodiacal Circle Instrument — an ensemble of twelve specialized sundials.',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1730–1735 CE',
    primaryPurpose: 'Direct measurement of celestial latitude and celestial longitude of the Sun, Moon, and planets without requiring mathematical conversion from equatorial coordinates.',
    astronomicalCoordinates: ['Celestial Longitude (λ)', 'Celestial Latitude (β)', 'Ecliptic Transit Time'],
    workingPrinciple: 'Consists of twelve distinct gnomonic instruments, each dedicated to one of the 12 signs of the zodiac (Mesha/Aries through Mina/Pisces). Each instrument is oriented and inclined at a specific angle such that its gnomon points to the pole of the ecliptic at the exact instant that its designated zodiac sign crosses the meridian.',
    howToRead: [
      {
        step: '1. Select Active Zodiac Dial',
        description: 'Identify which of the 12 signs is currently rising or transiting the meridian according to the solar month.'
      },
      {
        step: '2. Observe Gnomon Shadow',
        description: 'When the zodiac sign reaches the meridian, its gnomon lies in the plane of the ecliptic, casting a shadow on the attached quadrant.'
      },
      {
        step: '3. Read Celestial Longitude',
        description: 'The curved marble quadrant indicates degrees of celestial longitude directly along the ecliptic plane.'
      },
      {
        step: '4. Read Celestial Latitude',
        description: 'The displacement of the shadow perpendicular to the quadrant centerline measures the celestial latitude above or below the ecliptic.'
      }
    ],
    architecturalDetails: {
      materials: ['Red/buff sandstone structures', 'Finely calibrated marble quadrant plates', 'Brass gnomon sighting edge'],
      geometricPrinciples: 'Each instrument’s gnomon tilt varies based on the obliquity of the ecliptic (ε ≈ 23.44°) and local latitude (Φ), ranging from 14° to 45°.',
      uniqueFeatures: 'Only one complete set of 12 Rasivalaya instruments exists in the entire world, situated exclusively at Jaipur.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'The only surviving complex of 12 zodiac instruments, fully preserved and functional.' }
    ],
    vedicSignificance: 'Directly serves the computational demands of Vedic Jyotisha for determining exact planetary positions across the 12 Rashis and 27 Nakshatras.',
    accuracy: '±0.2° along the ecliptic wheel.'
  },

  digamsa: {
    id: 'digamsa',
    name: 'Digamsa Yantra',
    sanskritName: 'Digamsa Yantra',
    devanagari: 'दिगंश यन्त्र',
    category: 'Altitude & Azimuth',
    meaning: 'Azimuth Instrument — from Sanskrit Dig (Direction) and Amsa (Degree).',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1728–1732 CE',
    primaryPurpose: 'Measurement of the horizontal azimuth (direction angle) of celestial bodies, and calculation of sunrise/sunset azimuths for calendar synchronization.',
    astronomicalCoordinates: ['Azimuth Angle (0° to 360° from True North)', 'Horizontal Compass Bearing', 'Rising & Setting Azimuth'],
    workingPrinciple: 'Features a central cylindrical pillar surrounded by two concentric circular stone walls of identical height. Sighting strings or wires are stretched from the central pillar across the graduated outer ring walls to sight celestial targets.',
    howToRead: [
      {
        step: '1. Position Central Observer',
        description: 'Place sighting indicator or cross-wire at the center of the vertical pillar.'
      },
      {
        step: '2. Align Target on Horizon',
        description: 'Sight the rising or setting celestial object across the graduated outer wall.'
      },
      {
        step: '3. Read 360° Azimuth Angle',
        description: 'Read the azimuth directly off the circular 360-degree scale engraved with degrees and minutes on the outer wall coping.'
      }
    ],
    architecturalDetails: {
      materials: ['Durable buff sandstone masonry', 'Engraved marble compass rim', 'Lead-filled graduation lines'],
      geometricPrinciples: 'Two concentric cylindrical walls with calibrated radial sightlines aligned with True Meridian.',
      uniqueFeatures: 'Enables rapid, high-accuracy cardinal bearings for surveying and stellar horizon transits.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Large central pillar surrounded by concentric circular stone walls.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Historic circular azimuth instrument on the Tropic of Cancer.' },
      { site: 'Man Mahal Observatory', city: 'Varanasi', state: 'Uttar Pradesh', details: 'Rooftop azimuth ring overlooking the Ganges river basin.' }
    ],
    vedicSignificance: 'Anchors terrestrial observers to the eight cardinal directions (Ashta-Dikpalas) of classical Indian sacred architecture and cosmology.',
    accuracy: '±0.1° of horizontal azimuth.'
  },

  'dhruva-protha-chakra': {
    id: 'dhruva-protha-chakra',
    name: 'Dhruva-Protha-Chakra Yantra',
    sanskritName: 'Dhruva-Protha-Chakra Yantra',
    devanagari: 'ध्रुव-प्रोत-चक्र यन्त्र',
    category: 'Armillary & Stellar',
    meaning: 'Instrument of the Polar Circle — tuned to Dhruva (the unmoving Pole Star).',
    inventor: 'Maharaja Sawai Jai Singh II and court astronomers',
    era: '1724–1730 CE',
    primaryPurpose: 'Observation of the exact meridian transit of circumpolar stars and calculation of stellar right ascension relative to Polaris.',
    astronomicalCoordinates: ['Polar Distance', 'Right Ascension (α)', 'Meridian Altitude of Polaris'],
    workingPrinciple: 'Features a calibrated metallic circular ring mounted on a pivot axis tilted exactly to the observer’s latitude, pointing permanently at Polaris. The ring rotates freely in the polar plane to track star circles.',
    howToRead: [
      {
        step: '1. Sighting Polaris',
        description: 'Verify polar alignment by checking Polaris through the central polar sight tube.'
      },
      {
        step: '2. Rotate Sighting Index',
        description: 'Rotate the graduated bronze sighting chakra until the target star aligns with the sighting slit.'
      },
      {
        step: '3. Read Polar Distance & Angle',
        description: 'Read the angular distance from the north celestial pole on the circle’s graduated circumference.'
      }
    ],
    architecturalDetails: {
      materials: ['Cast brass ring and axis pivots', 'Sandstone mounting pier', 'Engraved bronze vernier plates'],
      geometricPrinciples: 'Axial mounting inclined at Φ (local latitude) with rotational freedom around Earth’s polar axis.',
      uniqueFeatures: 'Directly tracks circumpolar star revolutions without distortion from terrestrial horizon coordinates.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Surmounted on secondary masonry piers near the central plaza.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Polar transit instrument aligned to Ujjain’s ancient 0° latitude baseline.' }
    ],
    vedicSignificance: 'Reveres Dhruva (Polaris) as the immutable cosmic center of the revolving heavens in Puranic astronomy.',
    accuracy: '±0.05° (3 arc-minutes).'
  },

  'yantra-samrat-combo': {
    id: 'yantra-samrat-combo',
    name: 'Samrat Combo Yantra',
    sanskritName: 'Samyukta Samrat Yantra',
    devanagari: 'संयुक्त सम्राट यन्त्र',
    category: 'Solar Timekeeping',
    meaning: 'Unified Observatory System combining daytime sundial with nocturnal stellar sightlines.',
    inventor: 'Sawai Jai Singh II',
    era: '1730 CE',
    primaryPurpose: 'Continuous 24-hour astronomical coverage: solar apparent timekeeping by day, and star altitude/declination tracking by night.',
    astronomicalCoordinates: ['Solar Apparent Time', 'Stellar Right Ascension', 'Meridian Transit Angle'],
    workingPrinciple: 'Integrates the triangular gnomon of the Samrat Yantra with upper sighting chhatris and auxiliary quadrant rings, allowing seamless transition from diurnal to nocturnal observations.',
    howToRead: [
      {
        step: '1. Daytime Solar Reading',
        description: 'Use the lower quadrant arcs to read solar apparent time and declination.'
      },
      {
        step: '2. Nocturnal Stellar Sighting',
        description: 'Ascend to the upper sighting platform and sight target stars through plumb-line markers.'
      }
    ],
    architecturalDetails: {
      materials: ['Buff sandstone structural walls', 'Makrana marble scales', 'Brass sighting attachments'],
      geometricPrinciples: 'Unified trigonometric alignment centered on local latitude and True Astronomical North.',
      uniqueFeatures: 'Dual-purpose design maximizes observatory spatial footprint and computational synergy.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Integrated complex adjoining the great Samrat Yantra enclosure.' }
    ],
    vedicSignificance: 'Harmonizes Surya (Sun) and Chandra/Nakshatra (Moon/Stars) observations in one sacred architectural monument.',
    accuracy: '±2 seconds by day, ±0.1° by night.'
  },

  'golayantra-chakra': {
    id: 'golayantra-chakra',
    name: 'Golayantra Chakra Yantra',
    sanskritName: 'Gola Yantra',
    devanagari: 'गोलयन्त्र चक्र',
    category: 'Armillary & Stellar',
    meaning: 'Armillary Celestial Sphere — physical model of the spherical universe.',
    inventor: 'Classical Indian Astronomers (Aryabhata, Brahmagupta, refined by Jai Singh II)',
    era: '5th Century CE (Classical) / 1730 CE (Jantar Mantar)',
    primaryPurpose: 'Demonstration and physical computation of planetary orbits, solar-lunar eclipses, and coordinate transformations between horizon, equator, and ecliptic.',
    astronomicalCoordinates: ['Right Ascension & Declination', 'Ecliptic Longitude & Latitude', 'Orbital Nodes (Rahu/Ketu)'],
    workingPrinciple: 'Nested series of calibrated metallic concentric rings representing the horizon, prime meridian, celestial equator, ecliptic circle, and solstitial/equinoctial colures.',
    howToRead: [
      {
        step: '1. Align Polar Axis',
        description: 'Orient the central axis to True North and tilt to local latitude.'
      },
      {
        step: '2. Rotate Ecliptic Ring',
        description: 'Position the ecliptic ring to match the current day of the year.'
      },
      {
        step: '3. Sight Celestial Object',
        description: 'Align sighting pins on the movable ring with the planet or moon to read spherical coordinates directly.'
      }
    ],
    architecturalDetails: {
      materials: ['Cast gunmetal and bronze alloy rings', 'Stone base mounting pedestal', 'Engraved angular graduations'],
      geometricPrinciples: 'True spherical projection with concentric rings rotating along cardinal celestial axes.',
      uniqueFeatures: 'Functions as both an observational device and a sophisticated 3D analog computational computer.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Exhibited in the central instruments gallery with brass scale rings.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Historic armillary apparatus on the ancient astronomical meridian.' }
    ],
    vedicSignificance: 'Detailed extensively in the Aryabhatiya (Goladhyaya section) as the fundamental teaching apparatus of Vedic astronomy.',
    accuracy: '±0.25° for planetary simulation and celestial sphere modeling.'
  },

  bhitti: {
    id: 'bhitti',
    name: 'Bhitti Yantra',
    sanskritName: 'Dakshinottara Bhitti Yantra',
    devanagari: 'भित्ति यन्त्र',
    category: 'Equinoctial & Meridian',
    meaning: 'Great Meridian Mural Wall — monumental transit instrument.',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1724–1732 CE',
    primaryPurpose: 'Precise determination of meridian transit altitude, zenith distance of the Sun and stars, and exact timing of solar noon.',
    astronomicalCoordinates: ['Meridian Altitude (h)', 'Zenith Distance (z)', 'Exact Solar Noon Instant'],
    workingPrinciple: 'A colossal vertical masonry wall constructed with extreme precision in the plane of the True Astronomical Meridian (North-South line). On its face are two calibrated quadrant arcs centered on pinhole apertures near the top.',
    howToRead: [
      {
        step: '1. Observe Solar Beam',
        description: 'At solar noon, a sunbeam passes through the upper aperture and strikes the calibrated arc below.'
      },
      {
        step: '2. Read Meridian Zenith Distance',
        description: 'The illuminated point indicates the exact altitude angle of the Sun at its daily apex.'
      },
      {
        step: '3. Determine Solstices & Equinoxes',
        description: 'Compare the daily altitude against previous days to determine the exact date and minute of the solstices.'
      }
    ],
    architecturalDetails: {
      materials: ['Reinforced brick masonry with lime plaster', 'Polished white marble scale arcs', 'Brass aperture plates'],
      geometricPrinciples: 'Vertical plane strictly aligned within 0.01° of True Astronomical North-South meridian.',
      uniqueFeatures: 'Massive scale eliminates structural deflection and vibration during transit observations.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Colossal double mural wall with high-precision marble arcs.' },
      { site: 'Jantar Mantar', city: 'New Delhi', state: 'NCT of Delhi', details: 'Imposing meridian wall south of the central plaza.' },
      { site: 'Man Mahal', city: 'Varanasi', state: 'Uttar Pradesh', details: 'Rooftop meridian wall overlooking the Ganges.' }
    ],
    vedicSignificance: 'The ultimate arbiter of solar noon, defining the midpoint of the Vedic astronomical day (Madhyahna).',
    accuracy: '±0.02° (1 arc-minute) for meridian altitude.'
  },

  'dakshinottara-bhitti': {
    id: 'dakshinottara-bhitti',
    name: 'Dakshinottara Bhitti Yantra',
    sanskritName: 'Dakshinottara Bhitti Yantra',
    devanagari: 'दक्षिणोत्तर भित्ति यन्त्र',
    category: 'Equinoctial & Meridian',
    meaning: 'North-South Double Meridian Wall Instrument.',
    inventor: 'Sawai Jai Singh II',
    era: '1728 CE',
    primaryPurpose: 'Tracking the annual northward (Uttarayana) and southward (Dakshinayana) journeys of the Sun, and exact measurement of the obliquity of the ecliptic.',
    astronomicalCoordinates: ['Solar Declination Drift', 'Solstice Extremes (±23.44°)', 'Meridian Altitude'],
    workingPrinciple: 'Features two distinct marble quadrant scales mounted on the eastern and western faces of a massive north-south wall, allowing simultaneous recording before and after transit.',
    howToRead: [
      {
        step: '1. Sighting through Aperture',
        description: 'Sunlight enters through a precision brass pinhole at the top edge of the wall.'
      },
      {
        step: '2. Read Dual Arc Graduation',
        description: 'The projected beam illuminates the scale divided into degrees, minutes, and seconds.'
      }
    ],
    architecturalDetails: {
      materials: ['Solid sandstone masonry core', 'Chiseled Makrana marble quadrants', 'Engraved graduations'],
      geometricPrinciples: 'Wall centerline parallel to Earth’s meridian plane with dual quadrant arcs.',
      uniqueFeatures: 'Dual faces enable cross-checking and verification of instrumental error.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Features dual East-West faces with immaculate graduation lines.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Constructed directly on the historic Hindu zero-longitude meridian.' }
    ],
    vedicSignificance: 'Fundamental for fixing the astronomical start of Uttarayana (Makar Sankranti) and Dakshinayana (Karka Sankranti).',
    accuracy: '±1 arc-minute.'
  },

  'nadi-valaya': {
    id: 'nadi-valaya',
    name: 'Nadi Valaya Yantra',
    sanskritName: 'Nadi Valaya Yantra',
    devanagari: 'नाड़ी वलय यन्त्र',
    category: 'Solar Timekeeping',
    meaning: 'Equinoctial Dial — from Sanskrit Nadi (Hour/Ghati) and Valaya (Ring/Circle).',
    inventor: 'Maharaja Sawai Jai Singh II',
    era: '1728–1732 CE',
    primaryPurpose: 'Instant detection of the celestial equinoxes, and precise solar timekeeping divided into traditional Ghatis (60 Ghatis in a solar day).',
    astronomicalCoordinates: ['Equinoctial Solar Time (Ghatis & Palas)', 'Equinox Occurrence (Vernal & Autumnal)', 'Solar Hemisphere'],
    workingPrinciple: 'Consists of two circular dial plates tilted parallel to the Earth’s equator (tilted at 90° - Latitude from the horizontal). A central gnomon rod projects perpendicular to both faces. The northern face receives sun during spring and summer (Uttarayana); the southern face receives sun during autumn and winter (Dakshinayana).',
    howToRead: [
      {
        step: '1. Check the Active Face',
        description: 'If the Sun is north of the equator (spring/summer), read the northern face; if south (autumn/winter), read the southern face.'
      },
      {
        step: '2. Detect the Equinox Day',
        description: 'On the day of the equinox, the Sun lies exactly in the plane of the dial, illuminating both faces tangentially.'
      },
      {
        step: '3. Read Ghatis and Minutes',
        description: 'The circular marble face is divided into 60 Ghatis (each 24 minutes), further subdivided into Palas.'
      }
    ],
    architecturalDetails: {
      materials: ['Sandstone masonry base', 'White marble circular faces', 'Brass central gnomon stylus'],
      geometricPrinciples: 'Dial plane inclined at an angle equal to 90° - local latitude, making it parallel to the celestial equator.',
      uniqueFeatures: 'A physical visual indicator of Earth’s orbital tilt and seasonal hemisphere shifts.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Prominently positioned dual-face dial in the central observatory court.' },
      { site: 'Vedh Shala', city: 'Ujjain', state: 'Madhya Pradesh', details: 'Tilted circular dial aligned with prime astronomical latitude.' }
    ],
    vedicSignificance: 'Directly displays time in authentic Vedic Ghatis (घटी) and Palas (पल), preserving indigenous timekeeping methodology.',
    accuracy: '±1 Pala (24 seconds) of solar apparent time.'
  },

  palaka: {
    id: 'palaka',
    name: 'Palaka Yantra',
    sanskritName: 'Palaka Yantra',
    devanagari: 'फलक यन्त्र',
    category: 'Altitude & Azimuth',
    meaning: 'Board / Planar Astrometric Instrument — described by Bhaskaracharya.',
    inventor: 'Acharya Bhaskara II (Siddhanta Shiromani), constructed by Sawai Jai Singh II',
    era: '12th Century CE / 1730 CE',
    primaryPurpose: 'Portable planar measurement of solar altitude, shadow lengths, and angular distance between stars.',
    astronomicalCoordinates: ['Solar Altitude Angle', 'Shadow Length Ratio', 'Zenith Angle'],
    workingPrinciple: 'A rectangular planar board with a central sighting gnomon and plumb-line, graduated with trigonometric tangent scales and 90-degree angular arcs.',
    howToRead: [
      {
        step: '1. Level the Instrument',
        description: 'Ensure the board is vertical using the suspended plumb line (Lamba).'
      },
      {
        step: '2. Align with Sun or Star',
        description: 'Sight celestial object through upper alignment pins or observe shadow of the central pin.'
      },
      {
        step: '3. Read Angle off Quadrant',
        description: 'Read the altitude angle directly off the engraved 90-degree quadrant arc.'
      }
    ],
    architecturalDetails: {
      materials: ['Precision brass plate or seasoned teak wood', 'Fine silk plumb line', 'Engraved trigonometric division lines'],
      geometricPrinciples: 'Right-angled planar geometry linking shadow ratio directly to tan(solar altitude).',
      uniqueFeatures: 'Lightweight, portable field instrument used by travelling astronomers and royal surveyors.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar Museum', city: 'Jaipur', state: 'Rajasthan', details: 'Preserved historical portable astrometric brass plate.' }
    ],
    vedicSignificance: 'Detailed extensively in Bhaskaracharya’s Siddhanta Shiromani as an essential student and field tool.',
    accuracy: '±0.25°.'
  },

  chaapa: {
    id: 'chaapa',
    name: 'Chaapa Yantra',
    sanskritName: 'Chaapa Yantra (Dhanur Yantra)',
    devanagari: 'चाप यन्त्र (धनुर् यन्त्र)',
    category: 'Zodiacal & Ecliptic',
    meaning: 'Bow or Arc Instrument — precision graduated meridian sextant.',
    inventor: 'Classical Indian Astronomers, constructed by Sawai Jai Singh II',
    era: '1728 CE',
    primaryPurpose: 'High-resolution measurement of celestial declination and zenith angles of stars across a 120-degree subtended arc.',
    astronomicalCoordinates: ['Stellar Declination (δ)', 'Zenith Angle', 'Meridian Crossing Altitude'],
    workingPrinciple: 'Features a curved bow-shaped arc (Chaapa) securely mounted on a north-south meridian pier, equipped with movable sighting vanes and vernier graduations.',
    howToRead: [
      {
        step: '1. Sighting Target on Meridian',
        description: 'Sight the star as it transits the meridian through the sliding eyepiece vane.'
      },
      {
        step: '2. Lock and Read Vernier',
        description: 'Lock the vane clamp and read the declination angle down to fractions of an arc-minute.'
      }
    ],
    architecturalDetails: {
      materials: ['Bronze arc sector', 'Sandstone support pier', 'Precision vernier slide index'],
      geometricPrinciples: 'Circular arc segment centered on observer’s nodal point, subtending 120 degrees.',
      uniqueFeatures: 'Precursor to the modern astronomical meridian sextant.'
    },
    observatoryLocations: [
      { site: 'Jantar Mantar', city: 'Jaipur', state: 'Rajasthan', details: 'Surmounted on secondary masonry piers near the central plaza.' }
    ],
    vedicSignificance: 'Symbolizes the celestial bow (Dhanush) of Lord Rama, aiming with pinpoint precision at cosmic targets.',
    accuracy: '±1 arc-minute.'
  }
};
