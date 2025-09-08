// Viane's Love Adventure - Enhanced Game Logic

class LoveGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.highScore = getStoredHighScore();

        // Sound settings
        this.soundVolume = 0.5;
        this.muted = false;
        
        // Love statistics
        this.heartsCollected = 0;
        this.loveLevel = 1;
        this.perfectDays = 0;
        this.vianeHappiness = 100;
        
        // Character system
        this.availableCharacters = [
            {
                id: 'viane',
                name: 'Viane',
                unlocked: true,
                requiredScore: 0,
                description: 'The original Viane character'
            },
            {
                id: 'princess',
                name: 'Princess Viane',
                unlocked: false,
                requiredScore: 500,
                description: 'Unlock at 500 points'
            },
            {
                id: 'angel',
                name: 'Angel Viane',
                unlocked: false,
                requiredScore: 1000,
                description: 'Unlock at 1000 points'
            },
            {
                id: 'magical',
                name: 'Magical Viane',
                unlocked: false,
                requiredScore: 2000,
                description: 'Unlock at 2000 points'
            },
            {
                id: 'queen',
                name: 'Queen Viane',
                unlocked: false,
                requiredScore: 5000,
                description: 'Unlock at 5000 points'
            },
            {
                id: 'goddess',
                name: 'Goddess Viane',
                unlocked: false,
                requiredScore: 10000,
                description: 'Unlock at 10000 points'
            }
        ];
        
        this.selectedCharacter = 'viane';
        
        // Player (Pixel Art Girl)
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            width: 40,
            height: 40,
            speed: 5,
            hairColor: '#8B4513',
            dressColor: '#FF69B4',
            accessory: 'none',
            isInvincible: false,
            hasMultiplier: false,
            multiplierTimer: 0,
            invincibleTimer: 0
        };
        
        // Game objects
        this.hearts = [];
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.sparkles = [];
        this.rainbowTrail = [];
        this.screenShake = 0;
        this.specialEffects = [];
        
        // Game settings
        this.heartSpawnRate = 60;
        this.obstacleSpawnRate = 120;
        this.powerUpSpawnRate = 300;
        this.heartSpawnTimer = 0;
        this.obstacleSpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.difficulty = 1;
        
        // Input handling
        this.keys = {};
        
        // Character patterns
        this.characterPatterns = {};
        
        // Sound effects
        this.sounds = {
            heartCollect: this.createSound(800, 0.1, 'sine'),
            powerUp: this.createSound(1200, 0.2, 'sine'),
            levelUp: this.createSound(600, 0.3, 'triangle'),
            gameOver: this.createSound(200, 0.5, 'sawtooth')
        };

        this.init();
    }

    createSound(frequency, duration, type = 'sine') {
        return () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = type;
            
            const volume = this.muted ? 0 : this.soundVolume;
            gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01 * volume, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }
    
    init() {
        this.setupEventListeners();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.loadPixelArt();
        this.createPixelPatterns();
        this.checkCharacterUnlocks();
        this.updateUI();
        this.draw();
        this.gameLoop();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Game controls
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => {
            this.startGame();
        });

        pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });

        resetBtn.addEventListener('click', () => {
            this.resetGame();
        });

        pauseBtn.disabled = true;
        resetBtn.disabled = true;

        // Sound controls
        const soundSlider = document.getElementById('soundSlider');
        const muteBtn = document.getElementById('muteSoundBtn');

        soundSlider?.addEventListener('input', (e) => {
            this.soundVolume = e.target.value / 100;
            if (this.soundVolume > 0) {
                this.muted = false;
                muteBtn.textContent = 'Mute';
            } else {
                this.muted = true;
                muteBtn.textContent = 'Unmute';
            }
        });

        muteBtn?.addEventListener('click', () => {
            this.muted = !this.muted;
            muteBtn.textContent = this.muted ? 'Unmute' : 'Mute';
        });
        
        // Love message controls
        document.getElementById('loveMessageBtn').addEventListener('click', () => {
            this.generateLoveMessage();
        });
        
        document.getElementById('generateMessageBtn').addEventListener('click', () => {
            this.generateLoveMessage();
        });
        
        document.getElementById('copyMessageBtn').addEventListener('click', () => {
            this.copyLoveMessage();
        });
        
        // Character customization
        document.getElementById('hairColor').addEventListener('change', (e) => {
            this.player.hairColor = e.target.value;
        });
        
        document.getElementById('dressColor').addEventListener('change', (e) => {
            this.player.dressColor = e.target.value;
        });
        
        document.getElementById('accessory').addEventListener('change', (e) => {
            this.player.accessory = e.target.value;
        });
        
        // Character selection
        document.getElementById('characterSelect').addEventListener('change', (e) => {
            this.selectedCharacter = e.target.value;
            this.playerPattern = this.characterPatterns[this.selectedCharacter];
        });
    }
    
    loadPixelArt() {
        // Load character patterns
        this.characterPatterns = {
            viane: this.createVianeSprite(),
            princess: this.createPrincessSprite(),
            angel: this.createAngelSprite(),
            magical: this.createMagicalSprite(),
            queen: this.createQueenSprite(),
            goddess: this.createGoddessSprite()
        };
    }
    
    createPixelPatterns() {
        this.playerPattern = this.characterPatterns[this.selectedCharacter];
        this.heartPattern = this.createHeartSprite();
        this.obstaclePattern = this.createObstacleSprite();
        this.powerUpPatterns = {
            star: this.createStarSprite(),
            diamond: this.createDiamondSprite(),
            rainbow: this.createRainbowSprite(),
            sparkle: this.createSparkleSprite()
        };
    }
    
    // Enhanced character sprites with better pixel art
    createVianeSprite() {
        // Cute 16x16 Viane character - Simple and adorable
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Hair
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createPrincessSprite() {
        // Princess Viane with fancy hair and elegant dress - Twin tails
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Hair with twin tails
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createAngelSprite() {
        // Angel Viane with flowing hair and ethereal design - Long flowing hair
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Flowing hair
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createMagicalSprite() {
        // Magical Viane with star-shaped hair and mystical design - Spiky hair
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Star-shaped hair
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createQueenSprite() {
        // Queen Viane with regal hair and majestic design - Elegant updo
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Regal hair
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createGoddessSprite() {
        // Goddess Viane with divine hair and celestial design - Radiant hair
        return [
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0], // Divine hair
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
    }
    
    createHeartSprite() {
        const pattern = [
            [0,1,1,0,0,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
        return pattern;
    }
    
    createObstacleSprite() {
        const pattern = [
            [1,1,1,1,1,1,1,1],
            [1,0,0,1,1,0,0,1],
            [1,0,0,1,1,0,0,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,0,0,1,1,0,0,1],
            [1,0,0,1,1,0,0,1],
            [1,1,1,1,1,1,1,1]
        ];
        return pattern;
    }
    
    createStarSprite() {
        const pattern = [
            [0,0,0,0,1,0,0,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0]
        ];
        return pattern;
    }
    
    createDiamondSprite() {
        const pattern = [
            [0,0,0,0,1,0,0,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0]
        ];
        return pattern;
    }
    
    createRainbowSprite() {
        const pattern = [
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,0,0,0]
        ];
        return pattern;
    }
    
    createSparkleSprite() {
        const pattern = [
            [0,0,0,1,0,0,0],
            [0,0,1,1,1,0,0],
            [0,1,1,1,1,1,0],
            [1,1,1,1,1,1,1],
            [0,1,1,1,1,1,0],
            [0,0,1,1,1,0,0],
            [0,0,0,1,0,0,0]
        ];
        return pattern;
    }
    
    drawPixelSprite(pattern, x, y, size, color) {
        this.ctx.fillStyle = color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col]) {
                    this.ctx.fillRect(
                        x + col * size,
                        y + row * size,
                        size,
                        size
                    );
                }
            }
        }
    }
    
    drawGirlCharacter(x, y) {
        const size = 2.5;
        
        // Get the current character pattern
        const characterPattern = this.characterPatterns[this.selectedCharacter];
        
        // Draw dress (body)
        this.drawPixelSprite(characterPattern, x, y, size, this.player.dressColor);
        
        // Draw hair
        this.drawHair(x, y, size, characterPattern);
        
        // Draw face
        this.drawFace(x, y, size);
        
        // Draw accessory
        this.drawAccessory(x, y, size);
        
        // Draw character-specific effects
        this.drawCharacterEffects(x, y, size);
        
        // Draw effects
        if (this.player.isInvincible) {
            this.drawInvincibilityEffect(x, y);
        }
        
        if (this.player.hasMultiplier) {
            this.drawMultiplierEffect(x, y);
        }
    }
    
    drawHair(x, y, size, pattern) {
        // Hair pattern (top 10 rows of character pattern)
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col]) {
                    this.ctx.fillStyle = this.player.hairColor;
                    this.ctx.fillRect(
                        x + col * size,
                        y + row * size,
                        size,
                        size
                    );
                }
            }
        }
    }
    
    drawFace(x, y, size) {
        // Simple face features
        this.ctx.fillStyle = '#FFE4E1'; // Skin color
        this.ctx.fillRect(x + 6 * size, y + 8 * size, 4 * size, 3 * size); // Face
        
        this.ctx.fillStyle = '#000000'; // Eyes
        this.ctx.fillRect(x + 7 * size, y + 9 * size, size, size);
        this.ctx.fillRect(x + 10 * size, y + 9 * size, size, size);
        
        this.ctx.fillStyle = '#FF69B4'; // Blush
        this.ctx.fillRect(x + 6 * size, y + 10 * size, size, size);
        this.ctx.fillRect(x + 11 * size, y + 10 * size, size, size);
    }
    
    drawAccessory(x, y, size) {
        switch (this.player.accessory) {
            case 'bow':
                this.drawBow(x, y, size);
                break;
            case 'crown':
                this.drawCrown(x, y, size);
                break;
            case 'wings':
                this.drawWings(x, y, size);
                break;
            case 'sparkles':
                this.drawSparkles(x, y, size);
                break;
        }
    }
    
    drawCharacterEffects(x, y, size) {
        // Character-specific visual effects
        switch (this.selectedCharacter) {
            case 'princess':
                this.drawPrincessEffects(x, y, size);
                break;
            case 'angel':
                this.drawAngelEffects(x, y, size);
                break;
            case 'magical':
                this.drawMagicalEffects(x, y, size);
                break;
            case 'queen':
                this.drawQueenEffects(x, y, size);
                break;
            case 'goddess':
                this.drawGoddessEffects(x, y, size);
                break;
        }
    }
    
    drawPrincessEffects(x, y, size) {
        // Princess crown effect
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + 4 * size, y + 1 * size, 8 * size, 2 * size);
        this.ctx.fillRect(x + 5 * size, y + 0 * size, 2 * size, 3 * size);
        this.ctx.fillRect(x + 9 * size, y + 0 * size, 2 * size, 3 * size);
        
        // Sparkle effect
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 2 * size, y + 3 * size, size, size);
        this.ctx.fillRect(x + 13 * size, y + 3 * size, size, size);
    }
    
    drawAngelEffects(x, y, size) {
        // Angel halo
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x + 8 * size, y + 2 * size, 6 * size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Angel wings
        this.ctx.fillStyle = '#FFB6C1';
        this.ctx.fillRect(x - 4 * size, y + 8 * size, 3 * size, 6 * size);
        this.ctx.fillRect(x + 17 * size, y + 8 * size, 3 * size, 6 * size);
    }
    
    drawMagicalEffects(x, y, size) {
        // Magical sparkles
        this.ctx.fillStyle = '#FF69B4';
        this.ctx.fillRect(x - 2 * size, y + 2 * size, size, size);
        this.ctx.fillRect(x + 17 * size, y + 2 * size, size, size);
        this.ctx.fillRect(x + 2 * size, y + 14 * size, size, size);
        this.ctx.fillRect(x + 13 * size, y + 14 * size, size, size);
        
        // Magic aura
        this.ctx.strokeStyle = '#FF1493';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x + 8 * size, y + 8 * size, 12 * size, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawQueenEffects(x, y, size) {
        // Royal crown
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + 3 * size, y + 0 * size, 10 * size, 3 * size);
        this.ctx.fillRect(x + 4 * size, y + 0 * size, 2 * size, 4 * size);
        this.ctx.fillRect(x + 10 * size, y + 0 * size, 2 * size, 4 * size);
        this.ctx.fillRect(x + 7 * size, y + 0 * size, 2 * size, 4 * size);
        
        // Royal aura
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x + 8 * size, y + 8 * size, 15 * size, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawGoddessEffects(x, y, size) {
        // Divine halo
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(x + 8 * size, y + 1 * size, 8 * size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Divine aura
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(x + 8 * size, y + 8 * size, 18 * size, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Divine sparkles
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sparkleX = x + 8 * size + Math.cos(angle) * 20 * size;
            const sparkleY = y + 8 * size + Math.sin(angle) * 20 * size;
            this.ctx.fillRect(sparkleX, sparkleY, size, size);
        }
    }
    
    drawBow(x, y, size) {
        this.ctx.fillStyle = '#FF1493';
        // Bow on top of head
        this.ctx.fillRect(x + 5 * size, y + 2 * size, 6 * size, 3 * size);
        this.ctx.fillRect(x + 7 * size, y + 1 * size, 2 * size, 4 * size);
    }
    
    drawCrown(x, y, size) {
        this.ctx.fillStyle = '#FFD700';
        // Simple crown
        this.ctx.fillRect(x + 4 * size, y + 1 * size, 8 * size, 2 * size);
        this.ctx.fillRect(x + 5 * size, y + 0 * size, 2 * size, 3 * size);
        this.ctx.fillRect(x + 9 * size, y + 0 * size, 2 * size, 3 * size);
    }
    
    drawWings(x, y, size) {
        this.ctx.fillStyle = '#FFB6C1';
        // Wings on sides
        this.ctx.fillRect(x - 4 * size, y + 8 * size, 3 * size, 6 * size);
        this.ctx.fillRect(x + 17 * size, y + 8 * size, 3 * size, 6 * size);
    }
    
    drawSparkles(x, y) {
        this.ctx.fillStyle = '#FFFFFF';
        // Sparkles around character
        this.ctx.fillRect(x - 2 * size, y + 2 * size, size, size);
        this.ctx.fillRect(x + 17 * size, y + 2 * size, size, size);
        this.ctx.fillRect(x + 8 * size, y - 2 * size, size, size);
        this.ctx.fillRect(x + 8 * size, y + 18 * size, size, size);
    }
    
    drawInvincibilityEffect(x, y) {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.arc(x + 20, y + 20, 25, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawMultiplierEffect(x, y) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('2x', x + 15, y - 5);
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.hearts = [];
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.sparkles = [];
        this.rainbowTrail = [];
        this.difficulty = 1;
        this.updateUI();
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'PAUSE';
    }

    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            const pauseBtn = document.getElementById('pauseBtn');
            pauseBtn.textContent = this.gamePaused ? 'RESUME' : 'PAUSE';
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.hearts = [];
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.sparkles = [];
        this.rainbowTrail = [];
        this.difficulty = 1;
        this.updateUI();
        this.draw();
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'PAUSE';
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePlayer();
        this.updateHearts();
        this.updateObstacles();
        this.updatePowerUps();
        this.updateParticles();
        this.updateSparkles();
        this.updateRainbowTrail();
        this.updateSpecialEffects();
        this.updateEffects();
        this.checkCollisions();
        this.spawnObjects();
        this.updateDifficulty();
    }
    
    updatePlayer() {
        // Player movement
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.player.x += this.player.speed;
        }
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.player.y += this.player.speed;
        }
        
        // Keep player in bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
    }
    
    updateHearts() {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            heart.y += heart.speed;
            heart.rotation += 0.1;
            
            if (heart.y > this.canvas.height + 50) {
                this.hearts.splice(i, 1);
            }
        }
    }
    
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.y += obstacle.speed;
            
            if (obstacle.y > this.canvas.height + 50) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.05;
            
            if (powerUp.y > this.canvas.height + 50) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateSparkles() {
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            sparkle.life--;
            
            if (sparkle.life <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
    }
    
    updateRainbowTrail() {
        for (let i = this.rainbowTrail.length - 1; i >= 0; i--) {
            const trail = this.rainbowTrail[i];
            trail.life--;
            
            if (trail.life <= 0) {
                this.rainbowTrail.splice(i, 1);
            }
        }
    }
    
    updateSpecialEffects() {
        this.specialEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // Gravity
                particle.life--;
            });
        });
    }
    
    updateEffects() {
        // Update power-up timers
        if (this.player.isInvincible) {
            this.player.invincibleTimer--;
            if (this.player.invincibleTimer <= 0) {
                this.player.isInvincible = false;
            }
        }
        
        if (this.player.hasMultiplier) {
            this.player.multiplierTimer--;
            if (this.player.multiplierTimer <= 0) {
                this.player.hasMultiplier = false;
            }
        }
        
        // Update screen shake
        if (this.screenShake > 0) {
            this.screenShake--;
        }
        
        // Update special effects
        this.specialEffects = this.specialEffects.filter(effect => {
            effect.timer--;
            return effect.timer > 0;
        });
    }
    
    addScreenShake(intensity = 5) {
        this.screenShake = Math.max(this.screenShake, intensity);
    }
    
    createSpecialEffect(type, x, y) {
        const effect = {
            type: type,
            x: x,
            y: y,
            timer: 60,
            particles: []
        };
        
        switch (type) {
            case 'heartBurst':
                for (let i = 0; i < 20; i++) {
                    effect.particles.push({
                        x: x + Math.random() * 40 - 20,
                        y: y + Math.random() * 40 - 20,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 60,
                        color: '#FF69B4'
                    });
                }
                break;
            case 'powerUpBurst':
                for (let i = 0; i < 15; i++) {
                    effect.particles.push({
                        x: x + Math.random() * 30 - 15,
                        y: y + Math.random() * 30 - 15,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8,
                        life: 45,
                        color: '#FFD700'
                    });
                }
                break;
            case 'characterUnlock':
                for (let i = 0; i < 30; i++) {
                    effect.particles.push({
                        x: x + Math.random() * 60 - 30,
                        y: y + Math.random() * 60 - 30,
                        vx: (Math.random() - 0.5) * 12,
                        vy: (Math.random() - 0.5) * 12,
                        life: 90,
                        color: ['#FF69B4', '#FFD700', '#FFFFFF'][Math.floor(Math.random() * 3)]
                    });
                }
                break;
        }
        
        this.specialEffects.push(effect);
    }
    
    updateSpecialEffects() {
        this.specialEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // Gravity
                particle.life--;
            });
        });
    }
    
    drawSpecialEffects() {
        this.specialEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                if (particle.life > 0) {
                    const alpha = particle.life / 60;
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(particle.x, particle.y, 3, 3);
                    this.ctx.restore();
                }
            });
        });
    }
    
    checkCollisions() {
        // Check heart collisions
        this.hearts = this.hearts.filter(heart => {
            if (this.checkCollision(this.player, heart)) {
                // Add score
                const points = this.player.hasMultiplier ? 20 : 10;
                this.score += points;
                
                // Update love statistics
                this.heartsCollected++;
                this.vianeHappiness = Math.min(100, this.vianeHappiness + 2);
                this.updateLoveLevel();
                
                // Play sound effect
                this.sounds.heartCollect();
                
                // Create heart burst effect
                this.createSpecialEffect('heartBurst', heart.x, heart.y);
                this.addScreenShake(2);
                
                // Create heart particles
                this.createHeartParticles(heart.x, heart.y);
                
                // Update UI
                this.updateUI();
                return false;
            }
            return true;
        });
        
        // Check power-up collisions
        this.powerUps = this.powerUps.filter(powerUp => {
            if (this.checkCollision(this.player, powerUp)) {
                // Activate power-up
                this.activatePowerUp(powerUp.type);
                
                // Play sound effect
                this.sounds.powerUp();
                
                // Create power-up burst effect
                this.createSpecialEffect('powerUpBurst', powerUp.x, powerUp.y);
                this.addScreenShake(3);
                
                // Create power-up particles
                this.createPowerUpParticles(powerUp.x, powerUp.y, powerUp.color);
                
                return false;
            }
            return true;
        });
        
        // Check obstacle collisions
        this.obstacles = this.obstacles.filter(obstacle => {
            if (this.checkCollision(this.player, obstacle) && !this.player.isInvincible) {
                // Lose a life
                this.lives--;
                this.addScreenShake(8);
                
                // Create obstacle particles
                this.createObstacleParticles(obstacle.x, obstacle.y);
                
                // Update UI
                this.updateUI();
                
                // Check for game over
                if (this.lives <= 0) {
                    this.gameOver();
                }
                
                return false;
            }
            return true;
        });
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    activatePowerUp(type) {
        switch (type) {
            case 'star':
                this.player.isInvincible = true;
                this.player.invincibleTimer = 300; // 5 seconds
                break;
            case 'diamond':
                this.player.hasMultiplier = true;
                this.player.multiplierTimer = 600; // 10 seconds
                break;
            case 'rainbow':
                this.activateRainbowTrail();
                break;
            case 'sparkle':
                this.activateSparkleBurst();
                break;
        }
    }
    
    activateRainbowTrail() {
        // Collect all hearts in range
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            const distance = Math.sqrt(
                Math.pow(this.player.x - heart.x, 2) + 
                Math.pow(this.player.y - heart.y, 2)
            );
            
            if (distance < 100) {
                const points = this.player.hasMultiplier ? 20 : 10;
                this.score += points;
                this.createHeartParticles(heart.x, heart.y);
                this.hearts.splice(i, 1);
            }
        }
    }
    
    activateSparkleBurst() {
        // Clear all obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            this.createObstacleParticles(obstacle.x, obstacle.y);
            this.obstacles.splice(i, 1);
        }
    }
    
    spawnObjects() {
        // Spawn hearts
        this.heartSpawnTimer++;
        if (this.heartSpawnTimer >= this.heartSpawnRate) {
            this.spawnHeart();
            this.heartSpawnTimer = 0;
        }
        
        // Spawn obstacles
        this.obstacleSpawnTimer++;
        if (this.obstacleSpawnTimer >= this.obstacleSpawnRate) {
            this.spawnObstacle();
            this.obstacleSpawnTimer = 0;
        }
        
        // Spawn power-ups
        this.powerUpSpawnTimer++;
        if (this.powerUpSpawnTimer >= this.powerUpSpawnRate) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 0;
        }
    }
    
    spawnHeart() {
        const heart = {
            x: Math.random() * (this.canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 2,
            rotation: 0,
            color: ['#ff69b4', '#ff1493', '#ffb6c1'][Math.floor(Math.random() * 3)]
        };
        this.hearts.push(heart);
    }
    
    spawnObstacle() {
        const obstacle = {
            x: Math.random() * (this.canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 3 + Math.random() * 2,
            color: '#8b0000'
        };
        this.obstacles.push(obstacle);
    }
    
    spawnPowerUp() {
        const types = ['star', 'diamond', 'rainbow', 'sparkle'];
        const type = types[Math.floor(Math.random() * types.length)];
        const colors = {
            star: '#FFD700',
            diamond: '#00CED1',
            rainbow: '#FF69B4',
            sparkle: '#FFFFFF'
        };
        
        const powerUp = {
            x: Math.random() * (this.canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 2,
            rotation: 0,
            type: type,
            color: colors[type]
        };
        this.powerUps.push(powerUp);
    }
    
    updateDifficulty() {
        // Increase difficulty over time
        if (this.score > 0 && this.score % 100 === 0) {
            this.difficulty += 0.1;
            this.level = Math.floor(this.difficulty) + 1;
            this.heartSpawnRate = Math.max(30, 60 - this.difficulty * 10);
            this.obstacleSpawnRate = Math.max(60, 120 - this.difficulty * 15);
            this.updateUI();
        }
    }
    
    createHeartParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = {
                x: x + 15,
                y: y + 15,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                color: '#ff69b4'
            };
            this.particles.push(particle);
        }
    }
    
    createObstacleParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = {
                x: x + 20,
                y: y + 20,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: '#8b0000'
            };
            this.particles.push(particle);
        }
    }
    
    createPowerUpParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: x + 20,
                y: y + 20,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 40,
                color: color
            };
            this.particles.push(particle);
        }
    }
    
    createSparkles(x, y) {
        for (let i = 0; i < 5; i++) {
            const sparkle = {
                x: x + Math.random() * 30,
                y: y + Math.random() * 30,
                life: 20,
                size: Math.random() * 3 + 1
            };
            this.sparkles.push(sparkle);
        }
    }
    
    async generateLoveMessage() {
        const messageElement = document.getElementById('loveMessage');
        messageElement.textContent = 'Generating a special love message for Viane... 💕';
        
        try {
            // Using Hugging Face's free inference API for AI-generated love messages
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer hf_your_token_here', // This would need a real token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: "Write a romantic love message for someone named Viane:",
                    parameters: {
                        max_length: 100,
                        temperature: 0.8,
                        do_sample: true
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data[0] && data[0].generated_text) {
                    messageElement.textContent = `Viane, ${data[0].generated_text} 💖`;
                    return;
                }
            }
        } catch (error) {
            console.log('AI API failed, using fallback messages');
        }
        
        // Enhanced fallback messages with more variety and love
        const loveMessages = [
            `Viane, you are the most beautiful person I've ever known. Every moment with you feels like a dream come true! 💖`,
            `My dearest Viane, your smile lights up my world like nothing else. You are my everything! 💕`,
            `Viane, you are the missing piece to my puzzle. Life is so much better with you in it! 💗`,
            `To my amazing Viane: You make every day feel like Valentine's Day. I love you more than words can express! 💓`,
            `Viane, you are my sunshine on cloudy days, my comfort in difficult times, and my joy in happy moments! 💝`,
            `My sweet Viane, you are the reason I believe in love. You are perfect in every way! 💖`,
            `Viane, every pixel of my heart belongs to you. You are my favorite person in the whole world! 💕`,
            `To the most wonderful Viane: You are not just my love, you are my best friend, my soulmate, my everything! 💗`,
            `Viane, your laugh is the most beautiful melody I've ever heard. It makes my heart skip a beat! 💖`,
            `My precious Viane, you are like a shooting star - rare, beautiful, and magical. I'm so lucky to have you! ✨`,
            `Viane, you are the reason I wake up with a smile every morning. You make everything better! 🌅`,
            `To my incredible Viane: You are not just my girlfriend, you are my inspiration, my motivation, my everything! 💕`,
            `Viane, every day with you is an adventure filled with love, laughter, and pure happiness! 🎈`,
            `My darling Viane, you are the most precious gift life has given me. I cherish every moment with you! 🎁`,
            `Viane, you are my safe haven, my happy place, and my greatest love story! 💝`,
            `To the amazing Viane: You make ordinary moments extraordinary just by being in them! ✨`,
            `Viane, you are the light that guides me through darkness and the warmth that fills my heart! 🔥`,
            `My beautiful Viane, you are proof that fairy tales are real and dreams do come true! 🧚‍♀️`,
            `Viane, every time I see you, my heart does a little dance of joy! You are absolutely perfect! 💃`,
            `To my sweet Viane: You are the reason I believe in forever. I want to spend eternity with you! ♾️`
        ];
        
        const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        messageElement.textContent = randomMessage;
    }
    
    copyLoveMessage() {
        const messageElement = document.getElementById('loveMessage');
        const text = messageElement.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Show a temporary success message
            const originalText = messageElement.textContent;
            messageElement.textContent = 'Message copied to clipboard! 💕';
            setTimeout(() => {
                messageElement.textContent = originalText;
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = messageElement.textContent;
            messageElement.textContent = 'Message copied to clipboard! 💕';
            setTimeout(() => {
                messageElement.textContent = originalText;
            }, 2000);
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#ffb6c1');
        gradient.addColorStop(0.5, '#ff69b4');
        gradient.addColorStop(1, '#ff1493');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
        
        // Draw background elements
        this.drawRainbowTrail();
        this.drawHearts();
        this.drawObstacles();
        this.drawPowerUps();
        this.drawParticles();
        this.drawSparkles();
        this.drawSpecialEffects();
        
        // Draw player
        this.drawGirlCharacter(this.player.x, this.player.y);
        
        // Restore canvas if screen shake was applied
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
        
        // Draw UI overlays
        if (!this.gameRunning) {
            this.drawGameOver();
        } else if (this.gamePaused) {
            this.drawPauseScreen();
        }
    }
    
    drawRainbowTrail() {
        this.rainbowTrail.forEach((trail, index) => {
            const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.globalAlpha = trail.life / 50;
            this.ctx.fillRect(trail.x, trail.y, 4, 4);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawHearts() {
        this.hearts.forEach(heart => {
            this.ctx.save();
            this.ctx.translate(heart.x + heart.width/2, heart.y + heart.height/2);
            this.ctx.rotate(heart.rotation);
            this.drawPixelSprite(
                this.heartPattern,
                -heart.width/2,
                -heart.height/2,
                4,
                heart.color
            );
            this.ctx.restore();
        });
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.drawPixelSprite(
                this.obstaclePattern,
                obstacle.x,
                obstacle.y,
                5,
                obstacle.color
            );
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2);
            this.ctx.rotate(powerUp.rotation);
            
            let pattern;
            switch (powerUp.type) {
                case 'star':
                    pattern = this.powerUpPatterns.star;
                    break;
                case 'diamond':
                    pattern = this.powerUpPatterns.diamond;
                    break;
                case 'rainbow':
                    pattern = this.powerUpPatterns.rainbow;
                    break;
                case 'sparkle':
                    pattern = this.powerUpPatterns.sparkle;
                    break;
            }
            
            this.drawPixelSprite(
                pattern,
                -powerUp.width/2,
                -powerUp.height/2,
                4,
                powerUp.color
            );
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawSparkles() {
        this.sparkles.forEach(sparkle => {
            this.ctx.fillStyle = 'white';
            this.ctx.globalAlpha = sparkle.life / 20;
            this.ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2 - 50);
        
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width/2, this.canvas.height/2);
        this.ctx.fillText(`LEVEL REACHED: ${this.level}`, this.canvas.width/2, this.canvas.height/2 + 30);
        this.ctx.fillText('PRESS START TO PLAY AGAIN', this.canvas.width/2, this.canvas.height/2 + 70);
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
    }
    
    updateUI() {
        // Update score
        document.getElementById('score').textContent = this.score;
        
        // Update level
        document.getElementById('level').textContent = this.level;
        
        // Update high score
        document.getElementById('highScore').textContent = this.highScore;
        
        // Update lives
        const livesContainer = document.getElementById('lives-container');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const heart = document.createElement('div');
            heart.className = 'life-heart';
            heart.textContent = '❤️';
            livesContainer.appendChild(heart);
        }

        // Update love statistics
        document.getElementById('heartsCollected').textContent = this.heartsCollected;
        document.getElementById('loveLevel').textContent = this.loveLevel;
        document.getElementById('perfectDays').textContent = this.perfectDays;
        document.getElementById('vianeHappiness').textContent = this.vianeHappiness + '%';

        // Update character selection dropdown
        this.updateCharacterSelection();
        
        // Check for character unlocks
        this.checkCharacterUnlocks();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('vianeHighScore', this.highScore);
        }
    }
    
    updateLoveLevel() {
        const newLoveLevel = Math.floor(this.heartsCollected / 50) + 1;
        if (newLoveLevel > this.loveLevel) {
            this.loveLevel = newLoveLevel;
            this.perfectDays++;
            this.sounds.levelUp();
            this.createSpecialEffect('characterUnlock', this.player.x, this.player.y);
            this.addScreenShake(5);
        }
    }

    checkCharacterUnlocks() {
        let newUnlocks = false;
        this.availableCharacters.forEach(char => {
            if (!char.unlocked && this.score >= char.requiredScore) {
                char.unlocked = true;
                newUnlocks = true;
            }
        });
        
        if (newUnlocks) {
            this.updateCharacterSelection();
            this.showUnlockMessage();
        }
    }
    
    updateCharacterSelection() {
        const characterSelect = document.getElementById('characterSelect');
        characterSelect.innerHTML = ''; // Clear existing options
        
        this.availableCharacters.forEach(char => {
            const option = document.createElement('option');
            option.value = char.id;
            if (char.unlocked) {
                option.textContent = `${char.name} ✅`;
                option.disabled = false;
            } else {
                option.textContent = `${char.name} 🔒 (${char.requiredScore} points)`;
                option.disabled = true;
            }
            characterSelect.appendChild(option);
        });
        
        characterSelect.value = this.selectedCharacter;
    }
    
    showUnlockMessage() {
        const unlockedChars = this.availableCharacters.filter(char => 
            char.unlocked && char.id !== 'viane'
        );
        
        if (unlockedChars.length > 0) {
            const latestUnlock = unlockedChars[unlockedChars.length - 1];
            const message = `🎉 New character unlocked: ${latestUnlock.name}! 🎉`;
            
            // Create special effect at player position
            this.createSpecialEffect('characterUnlock', this.player.x, this.player.y);
            this.addScreenShake(5);
            
            // Create a temporary notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #ff69b4, #ff1493);
                color: white;
                padding: 20px;
                border-radius: 10px;
                border: 4px solid #c71585;
                box-shadow: 0 8px 0 #c71585;
                font-family: 'Press Start 2P', cursive;
                font-size: 0.8em;
                text-align: center;
                z-index: 1000;
                animation: unlockPulse 2s ease-in-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showGameOverMessage();
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'PAUSE';
    }
    
    showGameOverMessage() {
        // Create sparkle effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createSparkles(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                );
            }, i * 100);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    resizeCanvas() {
        const prevWidth = this.canvas.width;
        const prevHeight = this.canvas.height;
        const width = Math.min(800, window.innerWidth - 40);
        const height = width * 0.75;
        this.canvas.width = width;
        this.canvas.height = height;
        if (prevWidth && prevHeight) {
            this.player.x = this.player.x * (width / prevWidth);
            this.player.y = this.player.y * (height / prevHeight);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LoveGame();
});

// Add some extra love effects
setInterval(() => {
    if (Math.random() < 0.3) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['💖', '💕', '💗', '💓', '💝'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }
}, 2000);

let ytPlayer;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('musicPlayerContainer', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: { autoplay: 1, controls: 0 },
        events: {
            onReady: (event) => event.target.setVolume(50)
        }
    });
}

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\n\/]+\/\S\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playMusicBtn');
    const stopBtn = document.getElementById('stopMusicBtn');
    const urlInput = document.getElementById('musicUrl');
    const volumeSlider = document.getElementById('volumeSlider');

    playBtn?.addEventListener('click', () => {
        const id = extractYouTubeId(urlInput.value.trim());
        if (id && ytPlayer) {
            ytPlayer.loadVideoById(id);
        }
    });

    stopBtn?.addEventListener('click', () => {
        ytPlayer?.stopVideo();
    });

    volumeSlider?.addEventListener('input', () => {
        ytPlayer?.setVolume(volumeSlider.value);
    });
});
