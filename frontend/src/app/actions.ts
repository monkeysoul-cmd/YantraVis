'use server';

import { YantraGenerationFormSchema, type ActionState } from '@/lib/schema/yantra';
import { generateParametricYantraData } from '@/lib/yantra-calculator';

export async function generateYantra(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawPayload = {
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      yantra: formData.get('yantra'),
    };

    const validation = YantraGenerationFormSchema.safeParse(rawPayload);
    if (!validation.success) {
      return {
        data: null,
        error: 'Invalid input. Please provide valid coordinates: Latitude (-90° to 90°) and Longitude (-180° to 180°).',
      };
    }

    const { latitude, longitude, yantra } = validation.data;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${baseUrl}/api/yantra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, yantra }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          return {
            data: result.data,
            error: null,
          };
        }
      }
    } catch (networkError) {
      console.warn('Backend service offline or unreachable, using local parametric calculation engine:', networkError);
    }

    // Seamless fallback to high-precision parametric astronomical calculation
    const calculatedData = generateParametricYantraData(yantra, latitude, longitude);
    return {
      data: calculatedData,
      error: null,
    };
  } catch (error) {
    console.error('Error generating yantra:', error);
    return { data: null, error: 'Failed to generate yantra details. Please try again.' };
  }
}
