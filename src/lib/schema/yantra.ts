import { YANTRAS } from '@/lib/yantras';
import { z } from 'zod';

const yantraIds = YANTRAS.map(y => y.id) as [string, ...string[]];

export const YantraGenerationFormSchema = z.object({
  latitude: z.coerce.number().min(-90, 'Must be >= -90').max(90, 'Must be <= 90'),
  longitude: z.coerce.number().min(-180, 'Must be >= -180').max(180, 'Must be <= 180'),
  yantra: z.enum(yantraIds),
});

export type YantraData = {
    yantraId: z.infer<typeof YantraGenerationFormSchema>['yantra'];
    yantraName: string;
    description: string;
    dimensions: Record<string, number>;
    location: {
        latitude: number;
        longitude: number;
    }
};

export type ActionState = {
  data: YantraData | null;
  error: string | null;
};
