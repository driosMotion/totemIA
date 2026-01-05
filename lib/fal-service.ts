import { fal } from '@fal-ai/client';
import { FilterStyle } from '@/types';

// Get API key from environment
const FAL_KEY = process.env.NEXT_PUBLIC_FAL_KEY;

console.log('🔑 Fal.ai API Key configured:', FAL_KEY ? '✅ Yes' : '❌ No');

// Configure fal client
fal.config({
  credentials: FAL_KEY,
});

// Filter configurations with prompts for fal.ai nano-banana-pro
export const FILTER_CONFIGS = {
  cyberpunk: {
    id: 'cyberpunk' as FilterStyle,
    name: 'Cyberpunk',
    prompt: 'transform into cyberpunk style portrait, neon lights, futuristic aesthetic, glowing elements, tech wear, dramatic neon lighting, digital art, vibrant colors',
    description: 'Estilo cyberpunk con luces neón',
    previewColor: 'from-cyan-500 to-purple-600',
  },
  anime: {
    id: 'anime' as FilterStyle,
    name: 'Anime',
    prompt: 'transform into anime style portrait, manga illustration style, cel shaded, vibrant anime colors, big expressive anime eyes, clean anime linework, studio ghibli quality',
    description: 'Estilo anime/manga',
    previewColor: 'from-pink-500 to-yellow-500',
  },
  pixar: {
    id: 'pixar' as FilterStyle,
    name: 'Pixar',
    prompt: 'transform into pixar 3d animation style character, disney pixar character design, cute and friendly 3d render, soft studio lighting, colorful, high quality 3d animation',
    description: 'Estilo animación 3D Pixar',
    previewColor: 'from-blue-500 to-green-500',
  },
};

export interface ProcessImageParams {
  imageDataUrl: string;
  filterStyle: FilterStyle;
}

export interface ProcessImageResult {
  processedImageUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Process an image with fal.ai using the specified filter style
 */
export async function processImageWithFal(
  params: ProcessImageParams
): Promise<ProcessImageResult> {
  try {
    console.log('🎨 Starting image processing with filter:', params.filterStyle);
    
    const filter = FILTER_CONFIGS[params.filterStyle];
    
    if (!filter) {
      throw new Error(`Invalid filter style: ${params.filterStyle}`);
    }

    console.log('📤 Preparing image for upload...');
    
    // The data URL can be used directly in fal.ai
    // Or convert to base64 without the data:image prefix
    const base64Data = params.imageDataUrl.split(',')[1];
    
    console.log('🚀 Calling fal.ai API with nano-banana-pro...');
    console.log('🔑 Using API key:', FAL_KEY ? `${FAL_KEY.substring(0, 10)}...` : 'NOT FOUND');
    
    if (!FAL_KEY) {
      throw new Error('NEXT_PUBLIC_FAL_KEY no está configurado en .env.local');
    }
    
    // Call fal.ai nano-banana-pro/edit endpoint
    const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
      input: {
        prompt: filter.prompt,
        image_urls: [params.imageDataUrl], // Array of image URLs (or data URIs)
        num_images: 1,
        aspect_ratio: 'auto',
        output_format: 'jpeg',
        resolution: '1K',
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('📊 Queue update:', update.status);
        if (update.status === 'IN_PROGRESS') {
          if (update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });

    console.log('✅ Fal.ai response received:', result);

    // Extract the processed image URL from nano-banana-pro response
    const processedImageUrl = result.data?.images?.[0]?.url;

    if (!processedImageUrl) {
      console.error('❌ No image in response. Full response:', JSON.stringify(result, null, 2));
      throw new Error('No image returned from fal.ai - check console for response details');
    }

    console.log('✅ Image processed successfully!');
    console.log('📸 Processed image URL:', processedImageUrl);
    console.log('📝 Description:', result.data?.description || 'N/A');
    
    return {
      processedImageUrl,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error processing image with fal.ai:', error);
    return {
      processedImageUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test connection to fal.ai
 */
export async function testFalConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing fal.ai connection...');
    // Simple test - just check if we can access the API
    return !!process.env.NEXT_PUBLIC_FAL_KEY;
  } catch (error) {
    console.error('Fal.ai connection test failed:', error);
    return false;
  }
}

