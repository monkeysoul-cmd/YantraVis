import type { ComponentType, SVGProps } from 'react';
import { SamratIcon, RamaIcon, JaiPrakashIcon, RasivalayaIcon } from '@/components/icons';

export type Yantra = {
  id: 'samrat' | 'rama' | 'jai-prakash' | 'rasivalaya';
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
];
