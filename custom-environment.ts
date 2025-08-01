
export class RevoltMotorsEnvironmentGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 2048;
    this.canvas.height = 1024;
    this.ctx = this.canvas.getContext('2d')!;
  }

  generateRevoltMotorsEnvironment(): HTMLCanvasElement {
    const width = this.canvas.width;
    const height = this.canvas.height;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.2, '#1a1a1a');
    gradient.addColorStop(0.4, '#333333');
    gradient.addColorStop(0.7, '#cc0000');
    gradient.addColorStop(0.85, '#ff3333');
    gradient.addColorStop(1, '#ff6666');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    this.addElectricPattern();
    this.addRevoltMotorsBranding();
    this.addEnvironmentalElements();
    
    this.addRevoltMotorsText();

    return this.canvas;
  }

  private addElectricPattern() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.globalCompositeOperation = 'screen';
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 3 + 1;
      
      const electricGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 10);
      electricGradient.addColorStop(0, `rgba(255, 0, 0, ${Math.random() * 0.4})`);
      electricGradient.addColorStop(0.5, `rgba(255, 255, 255, ${Math.random() * 0.3})`);
      electricGradient.addColorStop(1, 'rgba(204, 0, 0, 0)');
      
      this.ctx.fillStyle = electricGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 10, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = 'source-over';
  }

  private addRevoltMotorsBranding() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.globalAlpha = 0.15;
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = 'bold 80px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    

    const positions = [
      { x: width * 0.25, y: height * 0.3 },
      { x: width * 0.75, y: height * 0.3 },
      { x: width * 0.5, y: height * 0.7 }
    ];

    positions.forEach(pos => {
      this.ctx.fillText('REVOLT MOTORS', pos.x, pos.y);
    });

    this.ctx.globalAlpha = 1;
  }

  private addRevoltMotorsText() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';
    
    const text = "REVOLT MOTORS";
    const letters = text.split('');
    
    this.ctx.font = 'bold 130px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const totalTextWidth = this.ctx.measureText(text).width;
    const startX = (width - totalTextWidth) / 2;
    const centerY = height / 2;
    
    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    this.ctx.shadowBlur = 40;
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    this.ctx.fillText(text, width / 2, centerY);
    
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    
    let currentX = startX;
    
    letters.forEach((letter, index) => {
      if (letter === ' ') {
        currentX += this.ctx.measureText(' ').width;
        return;
      }
      
      const letterWidth = this.ctx.measureText(letter).width;
      const letterCenterX = currentX + letterWidth / 2;
      
      const hueShift = (index * 30) % 360;
      
      this.ctx.shadowColor = `hsl(${hueShift}, 100%, 70%)`;
      this.ctx.shadowBlur = 30 + (index % 3) * 15;
      this.ctx.shadowOffsetX = Math.sin(index) * 4;
      this.ctx.shadowOffsetY = Math.cos(index) * 4;
      
      const letterGradient = this.ctx.createLinearGradient(
        letterCenterX - letterWidth/2, 
        centerY - 90, 
        letterCenterX + letterWidth/2, 
        centerY + 90
      );
      
      const color1 = `hsl(${hueShift}, 100%, 85%)`;
      const color2 = `hsl(${(hueShift + 60) % 360}, 100%, 70%)`;
      const color3 = `hsl(${(hueShift + 120) % 360}, 100%, 80%)`;
      
      letterGradient.addColorStop(0, color1);
      letterGradient.addColorStop(0.5, color2);
      letterGradient.addColorStop(1, color3);
      
      this.ctx.fillStyle = letterGradient;
      this.ctx.fillText(letter, letterCenterX, centerY);
      
      this.addLetterSparks(letterCenterX, centerY, letterWidth, index);
      
      currentX += letterWidth;
    });
    
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }
  
  private addLetterSparks(x: number, y: number, letterWidth: number, letterIndex: number) {
    const sparkCount = 8 + (letterIndex % 4);
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const sparkX = x + Math.cos(angle) * distance;
      const sparkY = y + Math.sin(angle) * distance;
      
      const sparkGradient = this.ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 8);
      const sparkHue = (letterIndex * 45 + i * 30) % 360;
      
      sparkGradient.addColorStop(0, `hsla(${sparkHue}, 100%, 80%, ${0.6 + Math.random() * 0.4})`);
      sparkGradient.addColorStop(0.5, `hsla(${sparkHue}, 100%, 60%, ${0.3 + Math.random() * 0.3})`);
      sparkGradient.addColorStop(1, `hsla(${sparkHue}, 100%, 40%, 0)`);
      
      this.ctx.fillStyle = sparkGradient;
      this.ctx.beginPath();
      this.ctx.arc(sparkX, sparkY, 6 + Math.random() * 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      if (Math.random() < 0.3) {
        this.ctx.strokeStyle = `hsla(${sparkHue}, 100%, 90%, ${0.4 + Math.random() * 0.4})`;
        this.ctx.lineWidth = 1 + Math.random() * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(sparkX + (Math.random() - 0.5) * 20, sparkY + (Math.random() - 0.5) * 20);
        this.ctx.stroke();
      }
    }
  }

  private addEnvironmentalElements() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.globalAlpha = 0.15;
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = height * 0.4 + Math.random() * height * 0.4;
      const size = Math.random() * 50 + 20;
      
      this.ctx.fillStyle = `rgba(0, 180, 216, ${Math.random() * 0.3})`;
      this.ctx.fillRect(x, y, size, size * 0.1);
    }

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = height * 0.6;
      const lineHeight = Math.random() * height * 0.3 + 50;
      const lineWidth = Math.random() * 4 + 1;
      
      this.ctx.fillStyle = `rgba(255, 214, 10, ${Math.random() * 0.2})`;
      this.ctx.fillRect(x, y, lineWidth, lineHeight);
    }

    this.ctx.globalAlpha = 1;
  }

  generateAsDataURL(): string {
    this.generateRevoltMotorsEnvironment();
    return this.canvas.toDataURL('image/png', 1.0);
  }

  generateAsCanvas(): HTMLCanvasElement {
    this.generateRevoltMotorsEnvironment();
    return this.canvas;
  }
}
