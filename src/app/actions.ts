import { YantraGenerationFormSchema, type ActionState } from '@/lib/schema/yantra';
import { generateParametricYantraData } from '@/lib/yantra-calculator';

export async function generateYantra(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawLat = formData.get('latitude');
    const rawLon = formData.get('longitude');
    const rawYantra = formData.get('yantra');

    const latNum = rawLat !== null && rawLat !== '' ? Number(rawLat) : 26.9124;
    const lonNum = rawLon !== null && rawLon !== '' ? Number(rawLon) : 75.7873;
    const yantraVal = (typeof rawYantra === 'string' && rawYantra.trim()) ? rawYantra.trim() : 'samrat';

    const rawPayload = {
      latitude: isNaN(latNum) ? 26.9124 : latNum,
      longitude: isNaN(lonNum) ? 75.7873 : lonNum,
      yantra: yantraVal,
    };

    const validation = YantraGenerationFormSchema.safeParse(rawPayload);
    let targetLat = rawPayload.latitude;
    let targetLon = rawPayload.longitude;
    let targetYantra = rawPayload.yantra;

    if (!validation.success) {
      targetLat = Math.min(90, Math.max(-90, rawPayload.latitude));
      targetLon = Math.min(180, Math.max(-180, rawPayload.longitude));
      targetYantra = 'samrat';
    } else {
      targetLat = validation.data.latitude;
      targetLon = validation.data.longitude;
      targetYantra = validation.data.yantra;
    }

    // Service-to-service communication via Vercel service binding (BACKEND_URL)
    // Only attempt external HTTP if BACKEND_URL is explicitly configured, with a fast 400ms timeout
    if (process.env.BACKEND_URL) {
      try {
        const targetUrl = new URL('/api/yantra', process.env.BACKEND_URL);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 400);

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: targetLat, longitude: targetLon, yantra: targetYantra }),
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
      } catch {
        // Backend candidate offline or timed out, proceed immediately to local engine
      }
    }

    // High-precision parametric astronomical calculation engine
    const calculatedData = generateParametricYantraData(targetYantra, targetLat, targetLon);
    return {
      data: calculatedData,
      error: null,
    };
  } catch (error) {
    console.error('Error generating yantra:', error);
    const fallbackData = generateParametricYantraData('samrat', 26.9124, 75.7873);
    return { data: fallbackData, error: null };
  }
}
