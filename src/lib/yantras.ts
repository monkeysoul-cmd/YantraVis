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
    description: 'The Samrat Yantra, or "Supreme Instrument", is a giant equinoctial sundial. It measures time to an accuracy of two seconds.',
    Icon: SamratIcon,
  },
  {
    id: 'rama',
    name: 'Rama Yantra',
    description: 'The Rama Yantra is used to measure the altitude and azimuth of celestial objects.',
    Icon: RamaIcon,
  },
  {
    id: 'jai-prakash',
    name: 'Jai Prakash Yantra',
    description: 'The Jai Prakash Yantra consists of two hemispherical bowls that map the celestial sphere. It is used to find the position of celestial objects.',
    Icon: JaiPrakashIcon,
  },
  {
    id: 'rasivalaya',
    name: 'Rasivalaya Yantra',
    description: 'The Rasivalaya Yantras are a set of twelve instruments, one for each sign of the zodiac, used to measure celestial latitude and longitude.',
    Icon: RasivalayaIcon,
  },
  {
    id: 'digamsa',
    name: 'Digamsa Yantra',
    description: 'A cylindrical instrument used to measure the azimuth of a celestial object.',
    Icon: DigamsaIcon,
  },
  {
    id: 'dhruva-protha-chakra',
    name: 'Dhruva-Protha-Chakra',
    description: 'An instrument to find the position of the pole star and other stars.',
    Icon: DhruvaProthaChakraIcon,
  },
  {
    id: 'yantra-samrat-combo',
    name: 'Yantra Samrat (Combo)',
    description: 'Combination of Samrat Yantra and Dhruva-Protha-Chakra Yantra.',
    Icon: YantraSamratComboIcon,
  },
  {
    id: 'golayantra-chakra',
    name: 'Golayantra Chakra',
    description: 'A metallic sphere representing the celestial sphere.',
    Icon: GolayantraChakraIcon,
  },
  {
    id: 'bhitti',
    name: 'Bhitti Yantra',
    description: 'A large wall aligned with the meridian to observe the transit of celestial objects.',
    Icon: BhittiIcon,
  },
  {
    id: 'dakshinottara-bhitti',
    name: 'Dakshinottara Bhitti',
    description: 'A meridian wall instrument for measuring the altitude of the sun at noon.',
    Icon: DakshinottaraBhittiIcon,
  },
  {
    id: 'nadi-valaya',
    name: 'Nadi Valaya Yantra',
    description: 'A cylindrical dial that shows the time in two hemispheres.',
    Icon: NadiValayaIcon,
  },
  {
    id: 'palaka',
    name: 'Palaka Yantra',
    description: 'A simple plane instrument used for various astronomical calculations.',
    Icon: PalakaIcon,
  },
  {
    id: 'chaapa',
    name: 'Chaapa Yantra',
    description: 'An instrument in the form of an arc used to measure the declination of celestial bodies.',
    Icon: ChaapaIcon,
  },
];
