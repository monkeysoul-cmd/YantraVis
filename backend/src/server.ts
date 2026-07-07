import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateYantraDescription } from './ai/flows/generate-yantra-description';
import { generateYantraAnalysis } from './ai/flows/generate-yantra-analysis';
import { YANTRAS } from './lib/yantras';
import { YantraGenerationFormSchema, type YantraData } from './lib/schema/yantra';
import { SAMRAT_JAIPUR_DATA } from './lib/pre-generated/samrat-jaipur';
import { RAMA_JAIPUR_DATA } from './lib/pre-generated/rama-jaipur';
import { JAI_PRAKASH_JAIPUR_DATA } from './lib/pre-generated/jai-prakash-jaipur';
import { RASIVALAYA_JAIPUR_DATA } from './lib/pre-generated/rasivalaya-jaipur';
import { DIGAMSA_JAIPUR_DATA } from './lib/pre-generated/digamsa-jaipur';
import { DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA } from './lib/pre-generated/dhruva-protha-chakra-jaipur';
import { YANTRA_SAMRAT_COMBO_JAIPUR_DATA } from './lib/pre-generated/yantra-samrat-combo-jaipur';
import { GOLAYANTRA_CHAKRA_JAIPUR_DATA } from './lib/pre-generated/golayantra-chakra-jaipur';
import { BHITTI_JAIPUR_DATA } from './lib/pre-generated/bhitti-jaipur';
import { DAKSHINOTTARA_BHITTI_JAIPUR_DATA } from './lib/pre-generated/dakshinottara-bhitti-jaipur';
import { NADI_VALAYA_JAIPUR_DATA } from './lib/pre-generated/nadi-valaya-jaipur';
import { PALAKA_JAIPUR_DATA } from './lib/pre-generated/palaka-jaipur';
import { CHAAPA_JAIPUR_DATA } from './lib/pre-generated/chaapa-jaipur';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.post('/api/yantra', async (req: express.Request, res: express.Response) => {
  try {
    const validatedFields = YantraGenerationFormSchema.safeParse(req.body);

    if (!validatedFields.success) {
      return res.status(400).json({
        data: null,
        error: 'Invalid input. Please check latitude (-90 to 90) and longitude (-180 to 180).',
      });
    }
    
    const { latitude, longitude, yantra } = validatedFields.data;

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
          return res.json({ data: preGeneratedData, error: null });
      }
    }

    const mockDimensions: Record<string, number> = {
      'Base Width': 10 + latitude / 9,
      'Height': 20 + Math.abs(longitude) / 18,
      'Gnomon Angle': latitude,
      'North Alignment': 0.5 - (longitude / 360),
    };

    const selectedYantra = YANTRAS.find((y: any) => y.id === yantra);
    if (!selectedYantra) {
        return res.status(400).json({ data: null, error: 'Invalid Yantra selected' });
    }
    
    const [descriptionResult, analysisResult] = await Promise.all([
      generateYantraDescription({ yantraName: selectedYantra.name }),
      generateYantraAnalysis({ yantraName: selectedYantra.name, dimensions: mockDimensions, location: { latitude, longitude } })
    ]);

    const yantraData: YantraData = {
        yantraId: yantra as any,
        yantraName: selectedYantra.name,
        description: descriptionResult.description,
        dimensions: mockDimensions,
        analysis: analysisResult,
        location: { latitude, longitude }
    };
    
    return res.json({ data: yantraData, error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: null, error: 'Failed to generate yantra details. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
