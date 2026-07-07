'use server';

import type { ActionState } from '@/lib/schema/yantra';

export async function generateYantra(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const payload = {
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      yantra: formData.get('yantra'),
    };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';
    
    const response = await fetch(`${baseUrl}/api/yantra`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error || 'Failed to generate yantra details.',
      };
    }

    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    console.error('Error calling /api/yantra:', error);
    return { data: null, error: 'Failed to generate yantra details due to a network error.' };
  }
}
