interface AudioResponse {
  text: string;
  audio?: string; 
}

interface RevoltMotorsKnowledge {
  [key: string]: string;
}

export class RevoltMotorsAI {
  private knowledgeBase: RevoltMotorsKnowledge;
  private speechSynthesis: SpeechSynthesis;
  private currentVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.initializeKnowledgeBase();
    this.initializeVoice();
  }

  private initializeVoice() {
    const voices = this.speechSynthesis.getVoices();
    this.currentVoice = voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
    ) || voices[0] || null;

    if (voices.length === 0) {
      this.speechSynthesis.onvoiceschanged = () => {
        const newVoices = this.speechSynthesis.getVoices();
        this.currentVoice = newVoices.find(voice =>
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || newVoices[0] || null;
      };
    }
  }

  private initializeKnowledgeBase() {
    this.knowledgeBase = {
      // Company Info
      'about revolt': 'Revolt Motors is India\'s leading electric motorcycle company, founded in 2019 by Rahul Sharma. We\'re revolutionizing urban mobility with AI-enabled electric motorcycles.',
      'company': 'Revolt Motors is pioneering the electric vehicle revolution in India with cutting-edge technology, sustainable mobility solutions, and innovative electric motorcycles.',
      'location': 'Revolt Motors is headquartered in Gurugram, India, with manufacturing facilities in Manesar, Haryana.',
      'headquarters': 'Revolt Motors is headquartered in Gurugram, India, with manufacturing facilities in Manesar, Haryana.',
      'established': 'Revolt Motors was established in 2019 with a mission to make electric mobility accessible, affordable, and exciting for everyone.',
      'founder': 'Revolt Motors was founded by Rahul Sharma in 2019. He\'s a serial entrepreneur who previously founded Micromax Communications.',
      
      // Leadership
      'rahul sharma': 'Rahul Sharma is the founder and CEO of Revolt Motors. He\'s a visionary entrepreneur who previously founded Micromax Communications.',
      'anjali rattan': 'Anjali Rattan is our Chief Business Officer, leading strategic business development and market expansion across India.',
      
      // Products
      'rv400': 'The RV400 is our flagship model with 150km range, 85km/h top speed, 3000W motor, and AI-enabled features including sound simulator and mobile app connectivity.',
      'rv300': 'The RV300 is perfect for urban commuting with 180km range, 65km/h top speed, and 1500W motor - ideal for daily city rides.',
      'rv1': 'The RV1 and RV1+ are our entry-level models with 100+ km range, perfect for first-time EV buyers and students.',
      'models': 'We offer RV400, RV300, RV1, and RV1+ models, each designed for different riding needs and budgets.',
      'range': 'Our motorcycles offer excellent range - RV400: 150km, RV300: 180km, RV1: 100+ km on a single charge.',
      'speed': 'Top speeds vary by model - RV400: 85km/h, RV300: 65km/h, RV1: 50km/h for safe urban commuting.',
      
      // Technology
      'myrevolt app': 'The MyRevolt app lets you remotely monitor your bike, track rides, manage battery, book service, and connect with the Revolt community.',
      'ai features': 'Our motorcycles feature AI-enabled battery management, predictive maintenance, route optimization, and learning rider behavior patterns.',
      'sound': 'RV400 features artificial engine sounds with 4 different sound options that you can customize through the mobile app.',
      'battery': 'We use advanced Lithium-ion battery technology with 8-year warranty and smart battery management systems.',
      'technology': 'Our bikes feature cutting-edge technology including AI integration, IoT connectivity, GPS tracking, and anti-theft systems.',
      
      // Pricing & Financing
      'price': 'Our bikes are affordably priced - RV400: ₹1,29,463, RV300: ₹99,990, RV1+: ₹84,990 (ex-showroom Delhi).',
      'cost': 'Our bikes are affordably priced - RV400: ₹1,29,463, RV300: ₹99,990, RV1+: ₹84,990 (ex-showroom Delhi).',
      'emi': 'Easy EMI options start from just ₹2,999/month with partnerships with leading financial institutions.',
      'financing': 'We offer flexible financing options, government subsidies, and corporate leasing programs.',
      
      // Service & Support
      'service': 'We have 100+ authorized service centers across India with mobile service vans for doorstep service.',
      'warranty': 'We offer 8-year battery warranty, 3-year motor warranty, and 1-year comprehensive warranty.',
      'support': 'Our 24/7 customer support is available at 1800-121-7931 or care@revoltmotors.com.',
      'maintenance': 'Our electric motorcycles require minimal maintenance compared to petrol bikes, with predictive maintenance through AI.',
      
      // Sustainability
      'environment': 'Our electric motorcycles produce zero direct emissions, reduce air pollution, and have a lower carbon footprint than petrol bikes.',
      'sustainability': 'We\'re committed to sustainable transportation with battery recycling programs and charging infrastructure development.',
      'green': 'Revolt Motors is leading the green mobility revolution with zero-emission electric motorcycles.',
      
      // Sales & Network
      'dealers': 'We have a growing dealer network with 100+ touchpoints across 40+ cities in India.',
      'sales': 'We\'ve sold over 50,000+ electric motorcycles and continue to grow rapidly.',
      'cities': 'We\'re present in 40+ cities across India with plans for pan-India expansion by 2025.',
      
      // General responses
      'greeting': 'Hello! I\'m your Revolt Motors AI assistant. I can help you with everything about our revolutionary electric motorcycles and the future of mobility!',
      'creator': 'I\'m an AI assistant designed to help you discover the exciting world of Revolt Motors and electric mobility.',
      'redirect': 'I specialize in Revolt Motors electric motorcycles. Ask me about our bikes, features, pricing, or how to join the electric revolution!'
    };
  }

  private findBestMatch(input: string): string {
    const lowercaseInput = input.toLowerCase();

    if (lowercaseInput.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return this.knowledgeBase['greeting'];
    }

    if (
      lowercaseInput.includes('who made you') ||
      lowercaseInput.includes('who created you') ||
      lowercaseInput.includes('who built you') ||
      lowercaseInput.includes('your creator')
    ) {
      return this.knowledgeBase['creator'];
    }
    
    if (lowercaseInput.includes('who are you') || lowercaseInput.includes('what are you')) {
      return 'I am your Revolt Motors AI assistant! I can help you with everything about our revolutionary electric motorcycles, from specifications to pricing to the future of electric mobility.';
    }
    
    // Founder-specific queries
    if (lowercaseInput.includes('founder') || lowercaseInput.includes('who founded')) {
      return this.knowledgeBase['founder'];
    }
    
    if (lowercaseInput.includes('rahul sharma') || lowercaseInput.includes('ceo')) {
      return this.knowledgeBase['rahul sharma'];
    }
    
    // Electric vehicle related
    if (lowercaseInput.includes('electric') || lowercaseInput.includes('ev')) {
      return 'Revolt Motors is India\'s pioneer in electric motorcycles! Our AI-enabled bikes offer zero emissions, smart connectivity, and exceptional performance.';
    }
    
    // Specific model queries
    if (lowercaseInput.includes('400') || lowercaseInput.includes('rv400')) {
      return this.knowledgeBase['rv400'];
    }
    
    if (lowercaseInput.includes('300') || lowercaseInput.includes('rv300')) {
      return this.knowledgeBase['rv300'];
    }
    
    if (lowercaseInput.includes('rv1')) {
      return this.knowledgeBase['rv1'];
    }

    let bestMatch = '';
    let bestScore = 0;

    for (const [key, response] of Object.entries(this.knowledgeBase)) {
      const keywords = key.split(' ');
      let score = 0;

      keywords.forEach(keyword => {
        if (lowercaseInput.includes(keyword)) {
          score += keyword.length;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = response;
      }
    }

    return bestScore > 0 ? bestMatch : this.knowledgeBase['redirect'];
  }

  async processInput(text: string): Promise<AudioResponse> {
    const response = this.findBestMatch(text);
    return {
      text: response,
      audio: await this.textToSpeech(response)
    };
  }

  private async textToSpeech(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;

      utterance.onend = () => resolve('audio_complete');
      utterance.onerror = (error) => reject(error);

      this.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    this.speechSynthesis.cancel();
  }
}
