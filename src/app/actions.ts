'use server';

import { generateYantraDescription } from '@/ai/flows/generate-yantra-description';
import { YANTRAS } from '@/lib/yantras';
import { z } from 'zod';

const yantraIds = YANTRAS.map(y => y.id) as [string, ...string[]];

const FormSchema = z.object({
  latitude: z.coerce.number().min(-90, 'Must be >= -90').max(90, 'Must be <= 90'),
  longitude: z.coerce.number().min(-180, 'Must be >= -180').max(180, 'Must be <= 180'),
  yantra: z.enum(yantraIds),
});

export type YantraData = {
    yantraId: z.infer<typeof FormSchema>['yantra'];
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

export async function generateYantra(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = FormSchema.safeParse({
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    yantra: formData.get('yantra'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please check latitude (-90 to 90) and longitude (-180 to 180).',
    };
  }
  
  const { latitude, longitude, yantra } = validatedFields.data;

  // Since I can't use external astronomy libraries, this is a mock calculation.
  // A real implementation would use solar position algorithms here.
  const mockDimensions: Record<string, number> = {
    'Base Width': 10 + latitude / 9,
    'Height': 20 + Math.abs(longitude) / 18,
    'Gnomon Angle': latitude,
    'North Alignment': 0.5 - (longitude / 360), // Mock magnetic declination effect
  };

  try {
    const selectedYantra = YANTRAS.find(y => y.id === yantra);
    if (!selectedYantra) {
        throw new Error('Invalid Yantra selected');
    }
    
    // Using the provided AI flow to generate a rich description
    const aiResult = await generateYantraDescription({ yantraName: selectedYantra.name });

    const yantraData: YantraData = {
        yantraId: yantra,
        yantraName: selectedYantra.name,
        description: aiResult.description,
        dimensions: mockDimensions,
        location: { latitude, longitude }
    };
    
    return { data: yantraData, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to generate yantra description. Please try again later.' };
  }
}
