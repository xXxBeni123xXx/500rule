import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = null;
    
    if (this.apiKey) {
      try {
        this.client = new OpenAI({
          apiKey: this.apiKey,
        });
      } catch (error) {
        console.error('Failed to initialize OpenAI client:', error);
      }
    }
  }

  isConfigured() {
    return !!this.client;
  }

  async generateAstroTips(params) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI API not configured',
        tips: []
      };
    }

    try {
      const { camera, lens, location, skyConditions, targetObject } = params;
      
      const cameraText = typeof camera === 'string' ? camera : `${camera || ''}`;
      const lensText = typeof lens === 'string' ? lens : `${lens || ''}`;
      const prompt = `You are an expert astrophotographer. Generate 3-5 practical tips for the following setup:
      
      Camera: ${cameraText}
      Lens: ${lensText}
      ${location ? `Location: ${location.name || (location.lat && location.lng ? `${location.lat},${location.lng}` : '')}` : ''}
      ${skyConditions ? `Conditions: Moon illumination ${skyConditions.moonPhase || 'Unknown'}%, Weather: ${skyConditions.weather ? JSON.stringify(skyConditions.weather) : 'Unknown'}` : ''}
      ${targetObject ? `Target: ${targetObject}` : ''}
      
      Provide specific, actionable tips for this exact setup. Focus on:
      1. Optimal camera settings for this equipment
      2. Best practices for the current conditions
      3. Common pitfalls to avoid
      4. Post-processing suggestions
      
      Return JSON: { "tips": [ { "title": string, "description": string } ] }`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert astrophotography assistant. Provide practical, specific advice based on the equipment and conditions provided. Return responses in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        success: true,
        tips: parsed.tips || parsed.suggestions || []
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        success: false,
        error: error.message,
        tips: []
      };
    }
  }

  async generateEquipmentRecommendations(params) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI API not configured',
        recommendations: []
      };
    }

    try {
      const { currentEquipment, budget, targetType, experience } = params;
      
      const prompt = `As an astrophotography equipment expert, recommend equipment upgrades or additions for:
      
      Current Equipment: ${currentEquipment || 'None specified'}
      Budget: ${budget || 'Not specified'}
      Primary targets: ${targetType || 'General astrophotography'}
      Experience level: ${experience || 'Intermediate'}
      
      Provide 3-4 specific equipment recommendations with reasoning. Include:
      1. Priority level (essential, recommended, nice-to-have)
      2. Approximate price range
      3. Why it would benefit this user
      4. Specific model suggestions when appropriate
      
      Format as JSON array with 'item', 'priority', 'priceRange', 'reason', and 'models' fields.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an astrophotography equipment expert. Provide specific, practical equipment recommendations based on the user\'s needs and budget. Return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        success: true,
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }

  async analyzeImage(imageData, analysisType = 'general') {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI API not configured'
      };
    }

    try {
      const prompt = analysisType === 'troubleshooting' 
        ? 'Analyze this astrophotography image and identify any issues like star trails, focus problems, noise, or other technical issues. Provide specific solutions.'
        : 'Analyze this astrophotography image and provide feedback on composition, technical quality, and suggestions for improvement.';

      const response = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        max_tokens: 300
      });

      return {
        success: true,
        analysis: response.choices[0].message.content
      };
    } catch (error) {
      console.error('OpenAI Vision API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateSessionPlan(params) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI API not configured'
      };
    }

    try {
      const { date, location, equipment, experience, duration } = params;
      
      const prompt = `Create a detailed astrophotography session plan for:
      
      Date/Time: ${date}
      Location: ${location}
      Equipment: ${equipment}
      Experience: ${experience}
      Session Duration: ${duration} hours
      
      Include:
      1. Pre-session checklist
      2. Recommended targets for the night with timing
      3. Camera settings for each target
      4. Time management suggestions
      5. Weather contingency plans
      
      Format as structured JSON with sections for 'checklist', 'targets', 'timeline', and 'contingency'.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert astrophotography session planner. Create detailed, practical session plans. Return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        success: true,
        plan: parsed
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new OpenAIService();
