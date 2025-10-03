'use server';

import { generateYantraDescription } from '@/ai/flows/generate-yantra-description';
import { generateYantraAnalysis } from '@/ai/flows/generate-yantra-analysis';
import { YANTRAS } from '@/lib/yantras';
import { YantraGenerationFormSchema } from '@/lib/schema/yantra';
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { SAMRAT_JAIPUR_DATA } from '@/lib/pre-generated/samrat-jaipur';
import { RAMA_JAIPUR_DATA } from '@/lib/pre-generated/rama-jaipur';
import { JAI_PRAKASH_JAIPUR_DATA } from '@/lib/pre-generated/jai-prakash-jaipur';
import { RASIVALAYA_JAIPUR_DATA } from '@/lib/pre-generated/rasivalaya-jaipur';
import { DIGAMSA_JAIPUR_DATA } from '@/lib/pre-generated/digamsa-jaipur';
import { DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA } from '@/lib/pre-generated/dhruva-protha-chakra-jaipur';
import { YANTRA_SAMRAT_COMBO_JAIPUR_DATA } from '@/lib/pre-generated/yantra-samrat-combo-jaipur';
import { GOLAYANTRA_CHAKRA_JAIPUR_DATA } from '@/lib/pre-generated/golayantra-chakra-jaipur';
import { BHITTI_JAIPUR_DATA } from '@/lib/pre-generated/bhitti-jaipur';
import { DAKSHINOTTARA_BHITTI_JAIPUR_DATA } from '@/lib/pre-generated/dakshinottara-bhitti-jaipur';
import { NADI_VALAYA_JAIPUR_DATA } from '@/lib/pre-generated/nadi-valaya-jaipur';
import { PALAKA_JAIPUR_DATA } from '@/lib/pre-generated/palaka-jaipur';
import { CHAAPA_JAIPUR_DATA } from '@/lib/pre-generated/chaapa-jaipur';

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

  // Pre-generated data for Jaipur (26.9124, 75.7873)
  const isJaipurDefaults = latitude === 26.9124 && longitude === 75.7873;
  if (isJaipurDefaults) {
    let preGeneratedData: YantraData | undefined;
    switch(yantra) {
        case 'samrat': preGeneratedData = SAMRAT_JAIPUR_DATA; break;
        case 'rama': preGeneratedData = RAMA_JAIPUR_DATA; break;
        case 'jai-prakash': preGeneratedData = JAI_PRAKASH_JAIPUR_DATA; break;
        case 'rasivalaya': preGeneratedData = RASIVALAYA_JAIPUR_DATA; break;
        case 'digamsa': preGeneratedData = DIGAMSA_JAIPUR_DATA; break;
        case 'dhruva-protha-chakra': preGeneratedData = DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA; break;
        case 'yantra-samrat-combo': preGeneratedData = YANTRA_SAMRAT_COMBO_JAIPUR_DATA; break;
        case 'golayantra-chakra': preGeneratedData = GOLAYANTRA_CHAKRA_JAIPUR_DATA; break;
        case 'bhitti': preGeneratedData = BHITTI_JAIPUR_DATA; break;
        case 'dakshinottara-bhitti': preGeneratedData = DAKSHINOTTARA_BHITTI_JAIPUR_DATA; break;
        case 'nadi-valaya': preGeneratedData = NADI_VALAYA_JAIPUR_DATA; break;
        case 'palaka': preGeneratedData = PALAKA_JAIPUR_DATA; break;
        case 'chaapa': preGeneratedData = CHAAPA_JAIPUR_DATA; break;
    }
    if (preGeneratedData) {
        return { data: preGeneratedData, error: null };
    }
  }

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
