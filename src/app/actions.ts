'use server';

import { generateYantraDescription } from '@/ai/flows/generate-yantra-description';
import { generateYantraAnalysis } from '@/ai/flows/generate-yantra-analysis';
import { YANTRAS } from '@/lib/yantras';
import { YantraGenerationFormSchema } from '@/lib/schema/yantra';
import type { ActionState, YantraData } from '@/lib/schema/yantra';


export async function generateYantra(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = YantraGenerationFormSchema.safeParse({
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
    
    // Using the provided AI flow to generate a rich description and analysis
    const [descriptionResult, analysisResult] = await Promise.all([
      generateYantraDescription({ yantraName: selectedYantra.name }),
      generateYantraAnalysis({ yantraName: selectedYantra.name, dimensions: mockDimensions, location: { latitude, longitude } })
    ]);

    const yantraData: YantraData = {
        yantraId: yantra,
        yantraName: selectedYantra.name,
        description: descriptionResult.description,
        dimensions: mockDimensions,
        analysis: analysisResult,
        location: { latitude, longitude }
    };
    
    return { data: yantraData, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to generate yantra details. Please try again later.' };
  }
}
