import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DinoGameProps {
  isPlaying: boolean;
  onGameOver: (score: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const DinoGame: React.FC<DinoGameProps> = ({ isPlaying, onGameOver, setIsPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Game loop logic
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Early return if context is not available
    if (!ctx) {
      console.error("Could not get canvas 2D context");
      return;
    }
    
    // Set canvas dimensions with a terminal-like aspect ratio
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        // Get container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Set canvas size to fit container with 16:9 ratio capped at container height
        const aspectRatio = 16 / 9;
        let canvasWidth = containerWidth;
        let canvasHeight = canvasWidth / aspectRatio;
        
        // If height exceeds container, adjust dimensions
        if (canvasHeight > containerHeight) {
          canvasHeight = containerHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Scale all game elements based on canvas height
        SCALE_FACTOR = canvasHeight / 400; // Base scale on 400px reference height
      }
    };
    
    // Update canvas size initially and on resize
    let SCALE_FACTOR = 1;
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Terminal effect settings
    const TERMINAL = {
      textColor: '#00FF66', // Terminal green
      bgColor: '#0A0E17',
      gridColor: 'rgba(0, 255, 102, 0.1)',
      fontFamily: 'monospace',
      scanlineOpacity: 0.05,
      scanlineSpacing: 4,
      glitchFrequency: 0.001, // How often glitches occur
      characters: "01", // Binary for digital effect
    };
    
    // Game variables
    let animationId: number;
    let gameSpeed = 5 * SCALE_FACTOR;
    let gravity = 0.5 * SCALE_FACTOR;
    let score = 0;
    let spawnTimer = 0;
    let spawnInterval = 100;
    let powerUpTimer = 0;
    let gameFrame = 0;
    
    // Player character
    const player = {
      x: 50 * SCALE_FACTOR,
      y: canvas.height - (60 * SCALE_FACTOR),
      width: 30 * SCALE_FACTOR,
      height: 50 * SCALE_FACTOR,
      jumping: false,
      ducking: false,
      velocityY: 0,
      jumpPower: -12 * SCALE_FACTOR,
      hasShield: false,
      shieldTimer: 0,
      legFrame: 0,
      legAnimationSpeed: 6,
      
      draw() {
        if (this.hasShield) {
          // Draw shield effect - terminal style
          ctx.beginPath();
          ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/1.3 + Math.sin(gameFrame * 0.1) * 2, 0, Math.PI * 2);
          
          // Matrix-style shield
          const glowStrength = 0.3 + Math.sin(gameFrame * 0.1) * 0.1;
          const gradient = ctx.createRadialGradient(
            this.x + this.width/2, this.y + this.height/2, 0,
            this.x + this.width/2, this.y + this.height/2, this.width * 1.2
          );
          gradient.addColorStop(0, `rgba(0, 255, 102, ${glowStrength})`);
          gradient.addColorStop(1, 'rgba(0, 255, 102, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add digital artifacts to shield
          for (let i = 0; i < 10; i++) {
            const charX = this.x + this.width/2 + (Math.random() - 0.5) * this.width * 2;
            const charY = this.y + this.height/2 + (Math.random() - 0.5) * this.height * 2;
            const char = TERMINAL.characters.charAt(Math.floor(Math.random() * TERMINAL.characters.length));
            ctx.fillStyle = `rgba(0, 255, 102, ${Math.random() * 0.5})`;
            ctx.font = `${8 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
            ctx.fillText(char, charX, charY);
          }
        }
        
        if (this.ducking) {
          // Draw ducking dinosaur - terminal style
          this.drawTerminalDinoDucking(ctx);
        } else {
          // Draw standing dinosaur - terminal style
          this.drawTerminalDinoStanding(ctx);
        }
      },
      
      drawTerminalDinoStanding(ctx: CanvasRenderingContext2D) {
        // Terminal ASCII-art style dinosaur
        const matrix = [
          "  ▄███",
          " █████",
          "██ ██ ",
          "█████ ",
          "██    ",
          "█ █   "
        ];
        
        const charSize = 5 * SCALE_FACTOR;
        ctx.fillStyle = TERMINAL.textColor;
        
        // Draw ASCII dinosaur
        for (let y = 0; y < matrix.length; y++) {
          for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== " ") {
              ctx.fillRect(
                this.x + (x * charSize),
                this.y + (y * charSize) - this.height/2,
                charSize,
                charSize
              );
            }
          }
        }
        
        // Add animation for running
        if (!this.jumping) {
          this.legFrame += 0.1;
          const legOffset = Math.abs(Math.sin(this.legFrame * this.legAnimationSpeed));
          
          // Animated legs as ASCII blocks
          ctx.fillRect(
            this.x + charSize, 
            this.y + (matrix.length * charSize) - this.height/2, 
            charSize, 
            charSize * 2 - legOffset * charSize
          );
          
          ctx.fillRect(
            this.x + (charSize * 3), 
            this.y + (matrix.length * charSize) - this.height/2, 
            charSize, 
            charSize * 2 - legOffset * charSize * 0.7
          );
        } else {
          // Tucked legs during jump
          ctx.fillRect(
            this.x + charSize, 
            this.y + (matrix.length * charSize) - this.height/2, 
            charSize, 
            charSize
          );
          
          ctx.fillRect(
            this.x + (charSize * 3), 
            this.y + (matrix.length * charSize) - this.height/2, 
            charSize, 
            charSize
          );
        }
        
        // Digital artifacts/glitch effect occasionally
        if (Math.random() < TERMINAL.glitchFrequency) {
          const glitchX = this.x + Math.random() * this.width;
          const glitchY = this.y - this.height/2 + Math.random() * this.height;
          ctx.fillStyle = TERMINAL.textColor;
          ctx.fillRect(glitchX, glitchY, Math.random() * 10 * SCALE_FACTOR, Math.random() * 2 * SCALE_FACTOR);
        }
      },
      
      drawTerminalDinoDucking(ctx: CanvasRenderingContext2D) {
        // Terminal ASCII-art style ducking dinosaur
        const matrix = [
          "       ",
          "  ▄███ ",
          "███████",
          "███████",
        ];
        
        const charSize = 5 * SCALE_FACTOR;
        ctx.fillStyle = TERMINAL.textColor;
        
        // Draw ASCII ducking dinosaur
        for (let y = 0; y < matrix.length; y++) {
          for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== " ") {
              ctx.fillRect(
                this.x + (x * charSize),
                this.y + (y * charSize) - 5 * SCALE_FACTOR,
                charSize,
                charSize
              );
            }
          }
        }
        
        // Animation for feet while ducking
        this.legFrame += 0.1;
        const legOffset = Math.abs(Math.sin(this.legFrame * this.legAnimationSpeed));
        
        ctx.fillRect(
          this.x + charSize, 
          this.y + (matrix.length * charSize) - 5 * SCALE_FACTOR, 
          charSize, 
          charSize - legOffset * charSize * 0.3
        );
        
        ctx.fillRect(
          this.x + (charSize * 5), 
          this.y + (matrix.length * charSize) - 5 * SCALE_FACTOR, 
          charSize, 
          charSize - legOffset * charSize * 0.3
        );
      },
      
      update() {
        // Jumping logic
        if (this.jumping) {
          this.y += this.velocityY;
          this.velocityY += gravity;
          
          // Ground collision
          if (this.y >= canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.jumping = false;
            this.velocityY = 0;
          }
        }
        
        // Shield timer
        if (this.hasShield) {
          this.shieldTimer--;
          if (this.shieldTimer <= 0) {
            this.hasShield = false;
          }
        }
      },
      
      jump() {
        if (!this.jumping) {
          this.jumping = true;
          this.velocityY = this.jumpPower;
          this.ducking = false;
        }
      },
      
      duck(isDucking: boolean) {
        if (!this.jumping) {
          this.ducking = isDucking;
          if (isDucking) {
            this.height = 25;
            this.y = canvas.height - this.height;
          } else {
            this.height = 50;
            this.y = canvas.height - this.height;
          }
        }
      },
      
      activateShield() {
        this.hasShield = true;
        this.shieldTimer = 300; // Shield lasts for 300 frames (about 5 seconds)
      }
    };
    
    // Obstacles class
    class Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      speed: number;
      type: 'cactus' | 'bird';
      frameCounter: number;
      
      constructor(type: 'cactus' | 'bird') {
        this.type = type;
        this.speed = gameSpeed;
        this.frameCounter = 0;
        
        if (type === 'cactus') {
          this.width = (20 + Math.random() * 20) * SCALE_FACTOR;
          this.height = (50 + Math.random() * 30) * SCALE_FACTOR;
          this.x = canvas.width;
          this.y = canvas.height - this.height;
          this.color = TERMINAL.textColor;
        } else {
          this.width = 40 * SCALE_FACTOR;
          this.height = 20 * SCALE_FACTOR;
          this.x = canvas.width;
          this.y = canvas.height - (50 + Math.random() * 120) * SCALE_FACTOR;
          this.color = TERMINAL.textColor;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        if (this.type === 'cactus') {
          // Draw terminal-style cactus
          const cactusWidth = Math.floor(this.width / (5 * SCALE_FACTOR));
          const cactusHeight = Math.floor(this.height / (5 * SCALE_FACTOR));
          
          ctx.fillStyle = this.color;
          
          // Base cactus trunk
          for (let y = 0; y < cactusHeight; y++) {
            for (let x = 0; x < cactusWidth; x++) {
              // Create a pattern for the cactus
              if ((x === 0 || x === cactusWidth - 1 || y % 3 === 0) && Math.random() > 0.3) {
                ctx.fillRect(
                  this.x + x * (5 * SCALE_FACTOR),
                  this.y + y * (5 * SCALE_FACTOR),
                  5 * SCALE_FACTOR,
                  5 * SCALE_FACTOR
                );
              }
            }
          }
          
          // Add some branching arms
          const armHeight = Math.floor(cactusHeight * 0.3);
          const armY = Math.floor(cactusHeight * 0.2);
          
          for (let y = 0; y < armHeight; y++) {
            ctx.fillRect(
              this.x - (5 * SCALE_FACTOR),
              this.y + (armY + y) * (5 * SCALE_FACTOR),
              5 * SCALE_FACTOR,
              5 * SCALE_FACTOR
            );
            
            ctx.fillRect(
              this.x + this.width,
              this.y + (armY + y) * (5 * SCALE_FACTOR),
              5 * SCALE_FACTOR,
              5 * SCALE_FACTOR
            );
          }
          
        } else {
          // Draw terminal-style bird
          ctx.fillStyle = this.color;
          this.frameCounter++;
          
          // Animated wings
          const wingState = Math.floor(this.frameCounter / 10) % 2;
          
          if (wingState === 0) {
            // Wings up - ASCII representation
            ctx.fillRect(this.x, this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (5 * SCALE_FACTOR), this.y - (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (10 * SCALE_FACTOR), this.y - (10 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (15 * SCALE_FACTOR), this.y - (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (20 * SCALE_FACTOR), this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (25 * SCALE_FACTOR), this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (30 * SCALE_FACTOR), this.y - (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (15 * SCALE_FACTOR), this.y + (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
          } else {
            // Wings down - ASCII representation
            ctx.fillRect(this.x, this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (5 * SCALE_FACTOR), this.y + (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (10 * SCALE_FACTOR), this.y + (10 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (15 * SCALE_FACTOR), this.y + (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (20 * SCALE_FACTOR), this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (25 * SCALE_FACTOR), this.y, 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (30 * SCALE_FACTOR), this.y + (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
            ctx.fillRect(this.x + (15 * SCALE_FACTOR), this.y - (5 * SCALE_FACTOR), 5 * SCALE_FACTOR, 5 * SCALE_FACTOR);
          }
        }
      }
      
      update() {
        this.x -= this.speed;
        this.draw();
      }
    }
    
    // PowerUp class
    class PowerUp {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      
      constructor() {
        this.width = 20 * SCALE_FACTOR;
        this.height = 20 * SCALE_FACTOR;
        this.x = canvas.width;
        this.y = (canvas.height - 150 * SCALE_FACTOR) - Math.random() * 100 * SCALE_FACTOR;
        this.speed = gameSpeed;
      }
      
      draw() {
        if (!ctx) return;
        
        // Terminal-style power-up
        const size = 5 * SCALE_FACTOR;
        ctx.fillStyle = TERMINAL.textColor;
        
        // Draw a terminal-style power symbol
        ctx.fillRect(this.x + size, this.y, size, size * 3);
        ctx.fillRect(this.x, this.y + size, size * 3, size);
        
        // Add pulsing glow effect
        const pulseSize = (5 + Math.sin(gameFrame * 0.1) * 2) * SCALE_FACTOR;
        
        const gradient = ctx.createRadialGradient(
          this.x + this.width/2, this.y + this.height/2, 0,
          this.x + this.width/2, this.y + this.height/2, pulseSize
        );
        gradient.addColorStop(0, 'rgba(0, 255, 102, 0.5)');
        gradient.addColorStop(0.7, 'rgba(0, 255, 102, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 102, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add binary characters around the power-up
        ctx.fillStyle = 'rgba(0, 255, 102, 0.3)';
        ctx.font = `${6 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
        
        for (let i = 0; i < 4; i++) {
          const angle = (gameFrame * 0.02) + (i * Math.PI / 2);
          const orbitX = this.x + this.width/2 + Math.cos(angle) * this.width;
          const orbitY = this.y + this.height/2 + Math.sin(angle) * this.height;
          const digit = Math.random() > 0.5 ? '1' : '0';
          ctx.fillText(digit, orbitX, orbitY);
        }
      }
      
      update() {
        this.x -= this.speed;
        this.draw();
      }
    }
    
    const obstacles: Obstacle[] = [];
    const powerUps: PowerUp[] = [];
    
    // Handle keyboard controls
    const keys: {[key: string]: boolean} = {};
    
    function handleKeyDown(e: KeyboardEvent) {
      keys[e.code] = true;
      
      // Jump with Space or ArrowUp
      if ((e.code === 'Space' || e.code === 'ArrowUp') && isPlaying && !isPaused) {
        player.jump();
        e.preventDefault();
      }
      
      // Duck with ArrowDown
      if (e.code === 'ArrowDown' && isPlaying && !isPaused) {
        player.duck(true);
        e.preventDefault();
      }
      
      // Pause with Escape or P
      if ((e.code === 'Escape' || e.code === 'KeyP') && isPlaying) {
        setIsPaused(prev => !prev);
        e.preventDefault();
      }
    }
    
    function handleKeyUp(e: KeyboardEvent) {
      keys[e.code] = false;
      
      // Stop ducking when ArrowDown is released
      if (e.code === 'ArrowDown') {
        player.duck(false);
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Check collision between two objects
    function checkCollision(obj1: any, obj2: any) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    }
    
    // Draw ground
    function drawGround() {
      if (!ctx) return;
      
      const groundY = canvas.height - (10 * SCALE_FACTOR);
      
      // Terminal-style ground
      ctx.fillStyle = TERMINAL.textColor;
      ctx.fillRect(0, groundY, canvas.width, 2 * SCALE_FACTOR);
      
      // Draw scrolling terminal characters along the ground
      ctx.font = `${8 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.fillStyle = 'rgba(0, 255, 102, 0.3)';
      
      const charSpacing = 15 * SCALE_FACTOR;
      const scrollOffset = gameFrame % charSpacing;
      
      for (let x = -scrollOffset; x < canvas.width; x += charSpacing) {
        const randomChar = TERMINAL.characters.charAt(Math.floor(Math.random() * TERMINAL.characters.length));
        ctx.fillText(randomChar, x, groundY + (7 * SCALE_FACTOR));
      }
    }
    
    // Draw score
    function drawScore() {
      if (!ctx) return;
      
      // Terminal-style score display
      ctx.fillStyle = TERMINAL.textColor;
      ctx.font = `bold ${16 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE: ${Math.floor(score)}`, canvas.width - (20 * SCALE_FACTOR), 30 * SCALE_FACTOR);
      
      // Show shield timer if active
      if (player.hasShield) {
        ctx.fillStyle = 'rgba(0, 255, 102, 0.8)';
        ctx.fillText(`SHIELD: ${Math.floor(player.shieldTimer / 60)}s`, canvas.width - (20 * SCALE_FACTOR), 55 * SCALE_FACTOR);
      }
    }
    
    // Draw pause screen
    function drawPauseScreen() {
      if (!ctx) return;
      
      // Terminal-style pause screen
      ctx.fillStyle = 'rgba(10, 14, 23, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw terminal decorations
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.2)';
      ctx.lineWidth = 1;
      
      // Draw border
      const borderWidth = 10 * SCALE_FACTOR;
      ctx.strokeRect(borderWidth, borderWidth, canvas.width - 2 * borderWidth, canvas.height - 2 * borderWidth);
      
      // Draw binary rows in background
      ctx.font = `${8 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.fillStyle = 'rgba(0, 255, 102, 0.1)';
      
      for (let y = borderWidth * 2; y < canvas.height - borderWidth * 2; y += 20 * SCALE_FACTOR) {
        let binaryRow = '';
        for (let i = 0; i < 30; i++) {
          binaryRow += Math.random() > 0.5 ? '1' : '0';
        }
        ctx.fillText(binaryRow, borderWidth * 2, y);
      }
      
      // Draw main text
      ctx.fillStyle = TERMINAL.textColor;
      ctx.font = `bold ${24 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM PAUSED', canvas.width / 2, canvas.height / 2);
      
      ctx.font = `${18 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.fillText('Press P or ESC to resume', canvas.width / 2, canvas.height / 2 + 35 * SCALE_FACTOR);
      
      // Add simulated cursor blink
      if (Math.floor(gameFrame / 30) % 2 === 0) {
        ctx.fillRect(canvas.width / 2 + 180 * SCALE_FACTOR, canvas.height / 2 + 35 * SCALE_FACTOR, 10 * SCALE_FACTOR, 3 * SCALE_FACTOR);
      }
    }
    
    // Draw game over screen
    function drawGameOverScreen() {
      if (!ctx) return;
      
      // Terminal-style game over screen
      ctx.fillStyle = 'rgba(10, 14, 23, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw "broken screen" effect
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 300 * SCALE_FACTOR;
        const height = Math.random() * 5 * SCALE_FACTOR;
        
        ctx.fillStyle = `rgba(0, 255, 102, ${Math.random() * 0.2})`;
        ctx.fillRect(x, y, width, height);
      }
      
      // Main error message
      ctx.fillStyle = TERMINAL.textColor;
      ctx.font = `bold ${24 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM FAILURE', canvas.width / 2, canvas.height / 2 - 50 * SCALE_FACTOR);
      
      ctx.font = `${18 * SCALE_FACTOR}px ${TERMINAL.fontFamily}`;
      ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText('Press ENTER to restart', canvas.width / 2, canvas.height / 2 + 40 * SCALE_FACTOR);
    }
    
    // Draw scanlines overlay for CRT effect
    function drawScanlines() {
      if (!ctx) return;
      
      ctx.fillStyle = `rgba(0, 0, 0, ${TERMINAL.scanlineOpacity})`;
      for (let y = 0; y < canvas.height; y += TERMINAL.scanlineSpacing) {
        ctx.fillRect(0, y, canvas.width, 1);
      }
    }
    
    // Game loop
    function animate() {
      if (!ctx) return;
      
      if (isPaused) {
        drawPauseScreen();
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw terminal-style background
      ctx.fillStyle = TERMINAL.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw terminal grid
      ctx.strokeStyle = TERMINAL.gridColor;
      ctx.lineWidth = 1;
      
      const gridSize = 30 * SCALE_FACTOR;
      
      // Vertical grid lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw and update player
      player.draw();
      player.update();
      
      // Draw ground
      drawGround();
      
      // Spawn obstacles
      spawnTimer++;
      if (spawnTimer >= spawnInterval) {
        const obstacleType = Math.random() > 0.3 ? 'cactus' : 'bird';
        obstacles.push(new Obstacle(obstacleType));
        
        // Adjust spawn rate based on score (gets harder)
        spawnInterval = Math.max(40, 100 - Math.floor(score / 100));
        spawnTimer = 0;
      }
      
      // Spawn power-ups (less frequently)
      powerUpTimer++;
      if (powerUpTimer >= 500 && Math.random() > 0.7) {
        powerUps.push(new PowerUp());
        powerUpTimer = 0;
      }
      
      // Update and draw obstacles
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        
        // Check for collision with player
        if (checkCollision(player, obstacles[i])) {
          if (player.hasShield) {
            // Shield protects from one hit
            player.hasShield = false;
            obstacles.splice(i, 1);
            i--;
            continue;
          } else {
            // Game over
            cancelAnimationFrame(animationId);
            onGameOver(Math.floor(score));
            setScore(Math.floor(score));
            return;
          }
        }
        
        // Remove obstacles that go off screen
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
          i--;
        }
      }
      
      // Update and draw power-ups
      for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].update();
        
        // Check for collision with player
        if (checkCollision(player, powerUps[i])) {
          // Activate shield power-up
          player.activateShield();
          powerUps.splice(i, 1);
          i--;
          continue;
        }
        
        // Remove power-ups that go off screen
        if (powerUps[i].x + powerUps[i].width < 0) {
          powerUps.splice(i, 1);
          i--;
        }
      }
      
      // Update score and game speed
      score += 0.1;
      if (score % 100 === 0) {
        gameSpeed += 0.1;
      }
      
      // Add scanlines for CRT effect
      drawScanlines();
      
      // Draw score
      drawScore();
      
      // Update displayed score
      setScore(Math.floor(score));
      gameFrame++;
      
      // Continue animation loop
      animationId = requestAnimationFrame(animate);
    }
    
    // Start game animation
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isPlaying, isPaused, onGameOver]);
  
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="mb-2 flex items-center justify-center gap-4 pt-1">
        <div className="text-[#00FF66] font-mono">SYSTEM.STATUS: <span className={isPlaying && !isPaused ? "animate-pulse" : ""}>ACTIVE</span></div>
        {isPlaying && (
          <button 
            onClick={() => setIsPaused(prev => !prev)} 
            className="px-3 py-1 bg-[#001A0D] border border-[#00FF66] hover:bg-[#003319] text-[#00FF66] rounded text-sm font-mono"
          >
            {isPaused ? '> RESUME' : '> PAUSE'}
          </button>
        )}
      </div>
      
      <div className="relative w-full h-full border border-[#00FF66]/50 rounded-lg overflow-hidden bg-[#0A0E17] flex items-center justify-center">
        {/* Terminal decorations */}
        <div className="absolute top-0 left-0 w-full h-6 bg-[#001A0D] border-b border-[#00FF66]/50 flex items-center px-3 z-[5]">
          <div className="text-xs font-mono text-[#00FF66] flex-1">
            CYBER_RUNNER.EXE - RUNTIME ENVIRONMENT
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-[#0A0E17]/90 backdrop-blur-sm flex flex-col items-center justify-center z-[15] pt-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center font-mono border-2 border-[#00FF66] p-6 bg-[#0A0E17] shadow-[0_0_20px_rgba(0,255,102,0.3)] w-4/5 max-w-md"
            >
              <h2 className="text-2xl font-bold text-[#00FF66] mb-6 flex items-center justify-center">
                <span className="animate-pulse mr-2">{'>'}</span>
                CYBER RUNNER v1.0
              </h2>
              
              <div className="mb-6 text-[#00FF66]/70 text-sm">
                <p>SYSTEM READY</p>
                <p>INITIALIZING RUNTIME ENVIRONMENT...</p>
                <p>CONTROLS ACTIVE</p>
              </div>
              
              <button 
                onClick={() => setIsPlaying(true)}
                className="px-8 py-3 bg-transparent border-2 border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10 rounded-none font-mono hover:shadow-[0_0_10px_rgba(0,255,102,0.5)] transition-all w-full"
              >
                {'>'}EXECUTE PROGRAM
              </button>
              
              <div className="mt-6 text-center text-[#00FF66]/60 text-xs">
                [SPACE] or [↑] to jump<br />
                [↓] to duck
              </div>
            </motion.div>
            
            {/* Animated binary code background */}
            <div className="absolute inset-0 -z-10 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute whitespace-nowrap animate-marquee font-mono text-[#00FF66]"
                  style={{ 
                    top: `${i * 10}%`, 
                    left: `${i % 2 === 0 ? '0' : '-100%'}`,
                    animationDuration: `${20 + i * 5}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                  }}
                >
                  {Array.from({ length: 50 }).map((_, j) => 
                    Math.random() > 0.5 ? '1' : '0'
                  ).join(' ')}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full mt-6"
        >
          Your browser does not support HTML5 canvas
        </canvas>
      </div>
    </div>
  );
}

export default DinoGame;

