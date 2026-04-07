import React, { useEffect, useRef } from 'react';

const VerificationCaptcha = ({ code }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !code) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background with diagonal lines pattern
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(0, 0, width, height);

    // Draw diagonal lines
    ctx.strokeStyle = '#81c784';
    ctx.lineWidth = 2;
    for (let i = 0; i < width + height; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(0, i);
      ctx.stroke();
    }

    // Add noise dots
    ctx.fillStyle = '#66bb6a';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw code digits with distortion
    const codeStr = String(code);
    const digitWidth = width / codeStr.length;
    
    ctx.font = 'bold 42px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < codeStr.length; i++) {
      const digit = codeStr[i];
      const x = digitWidth * i + digitWidth / 2;
      const y = height / 2;
      
      // Random rotation and position offset for distortion
      const rotation = (Math.random() - 0.5) * 0.3;
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 8;
      
      ctx.save();
      ctx.translate(x + offsetX, y + offsetY);
      ctx.rotate(rotation);
      
      // Add shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw digit
      ctx.fillStyle = '#2e7d32';
      ctx.fillText(digit, 0, 0);
      
      ctx.restore();
    }

    // Add some random curved lines for extra distortion
    ctx.strokeStyle = 'rgba(129, 199, 132, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

  }, [code]);

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={100}
      className="w-full rounded-lg border-2 border-green-300 shadow-sm"
    />
  );
};

export default VerificationCaptcha;
