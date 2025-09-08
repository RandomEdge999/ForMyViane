// Enhanced Custom AI Model for Viane Love Messages
class VianeAI {
    constructor() {
        // More sophisticated templates with better structure
        this.templates = [
            "Viane, my {adjective} {noun}, you {verb} my {emotion} like {comparison}! {emoji}",
            "My {adjective} Viane, {personal_feeling} because {reason}! {emoji}",
            "Viane, you are {adjective} than {comparison} - {compliment}! {emoji}",
            "To my {adjective} Viane: {romantic_phrase} and {promise}! {emoji}",
            "Viane, {time_reference} with you is {adjective} because {reason}! {emoji}",
            "My {adjective} Viane, {action} makes me {emotion} every {time}! {emoji}",
            "Viane, you {verb} my {noun} and {verb} my {emotion}! {emoji}",
            "To the {adjective} Viane: {romantic_phrase} - {personal_touch}! {emoji}",
            "Viane, {opening_phrase} you are {adjective} and {compliment}! {emoji}",
            "My {adjective} Viane, {time_reference} I {personal_feeling} because {reason}! {emoji}",
            "Viane, {comparison} could never compare to your {adjective} {noun}! {emoji}",
            "To my {adjective} Viane: {romantic_phrase} - you are my {emotion}! {emoji}",
            "Viane, {action} {verb} my {emotion} and {personal_feeling}! {emoji}",
            "My {adjective} Viane, {time_reference} with you is {adjective} because {reason}! {emoji}",
            "Viane, you {verb} my {noun} like {comparison} and {personal_touch}! {emoji}"
        ];

        // Enhanced word relationships and context awareness
        this.wordRelationships = {
            'adjectives': {
                'beautiful': ['sunshine', 'moonlight', 'rainbow', 'butterfly', 'rose', 'diamond'],
                'amazing': ['miracle', 'dream', 'fairy tale', 'masterpiece', 'treasure'],
                'incredible': ['goddess', 'angel', 'princess', 'queen', 'jewel'],
                'wonderful': ['sunshine', 'rainbow', 'butterfly', 'dream', 'miracle'],
                'precious': ['gem', 'pearl', 'crown', 'treasure', 'jewel'],
                'sweet': ['rose', 'butterfly', 'rainbow', 'sunshine', 'dream'],
                'gorgeous': ['diamond', 'goddess', 'princess', 'queen', 'masterpiece'],
                'stunning': ['angel', 'fairy tale', 'miracle', 'treasure', 'jewel'],
                'perfect': ['everything', 'match', 'soulmate', 'dream', 'miracle'],
                'divine': ['goddess', 'angel', 'heaven', 'paradise', 'miracle']
            },
            'emotions': {
                'heart': ['melt', 'warm', 'capture', 'steal', 'fill'],
                'soul': ['complete', 'transform', 'inspire', 'mesmerize', 'enchant'],
                'world': ['light up', 'brighten', 'illuminate', 'transform', 'complete'],
                'universe': ['amaze', 'overwhelm', 'mesmerize', 'enchant', 'bewitch'],
                'dreams': ['inspire', 'transform', 'complete', 'fill', 'warm']
            }
        };

        // Enhanced word banks with better training data
        this.wordBanks = {
            adjectives: [
                "beautiful", "amazing", "incredible", "wonderful", "precious", "sweet", "lovely", 
                "gorgeous", "stunning", "magnificent", "perfect", "divine", "angelic", "radiant",
                "charming", "enchanting", "breathtaking", "mesmerizing", "captivating", "irresistible",
                "ethereal", "celestial", "majestic", "elegant", "graceful", "delicate", "tender",
                "passionate", "devoted", "loving", "caring", "gentle", "kind", "pure", "innocent"
            ],
            nouns: [
                "sunshine", "moonlight", "starlight", "rainbow", "butterfly", "rose", "diamond",
                "treasure", "miracle", "dream", "fairy tale", "masterpiece", "goddess", "angel",
                "princess", "queen", "jewel", "pearl", "gem", "crown", "star", "flower", "petal",
                "breeze", "whisper", "sigh", "smile", "laugh", "tear", "kiss", "hug", "embrace"
            ],
            verbs: [
                "light up", "brighten", "illuminate", "warm", "melt", "capture", "steal",
                "fill", "complete", "transform", "inspire", "amaze", "overwhelm", "mesmerize",
                "enchant", "bewitch", "charm", "delight", "thrill", "excite", "soothe", "comfort",
                "heal", "restore", "renew", "awaken", "ignite", "spark", "kindle", "nurture"
            ],
            emotions: [
                "heart", "soul", "world", "universe", "existence", "life", "dreams",
                "hopes", "joy", "happiness", "love", "passion", "desire", "longing",
                "yearning", "wonder", "awe", "bliss", "ecstasy", "euphoria", "serenity",
                "peace", "tranquility", "harmony", "balance", "fulfillment", "contentment"
            ],
            comparisons: [
                "the sun", "the stars", "the moon", "a rainbow", "a shooting star", "a diamond",
                "gold", "silver", "crystal", "a rose", "a butterfly", "a fairy", "an angel",
                "heaven", "paradise", "magic", "a dream", "a miracle", "perfection itself",
                "morning dew", "spring breeze", "autumn leaves", "winter snow", "summer rain"
            ],
            personalFeelings: [
                "my heart skips a beat", "I fall in love all over again", "my world becomes perfect",
                "everything makes sense", "I feel complete", "I'm the luckiest person alive",
                "my soul sings with joy", "I'm overwhelmed with happiness", "I feel like I'm floating",
                "my heart overflows with love", "I'm lost in your beauty", "I feel truly alive",
                "my spirit soars", "my heart dances", "my soul finds peace", "I feel reborn",
                "my world stops turning", "time stands still", "I feel infinite", "I am whole"
            ],
            reasons: [
                "you make everything better", "your smile is pure magic", "your laugh is music to my ears",
                "you see the best in everything", "you bring out the best in me", "you make ordinary moments extraordinary",
                "your love transforms everything", "you are my safe haven", "you are my greatest adventure",
                "you make me believe in miracles", "you are my everything", "you complete my world",
                "your kindness heals my soul", "your touch ignites my spirit", "your presence brings me peace",
                "your love is my strength", "your beauty takes my breath away", "your heart is pure gold"
            ],
            romanticPhrases: [
                "you are my everything", "I love you more than words can say", "you are my heart's desire",
                "you are my greatest treasure", "you are my soulmate", "you are my perfect match",
                "you are my forever and always", "you are my greatest love story", "you are my dream come true",
                "you are my reason for being", "you are my greatest blessing", "you are my eternal love",
                "you are my home", "you are my sanctuary", "you are my light in the darkness",
                "you are my anchor in the storm", "you are my greatest adventure", "you are my heart's song"
            ],
            promises: [
                "I will love you forever", "I will cherish you always", "I will protect you with my life",
                "I will make you happy every day", "I will be yours forever", "I will never let you go",
                "I will love you more each day", "I will be your strength and support", "I will make all your dreams come true",
                "I will be your partner in everything", "I will love you unconditionally", "I will be your forever",
                "I will stand by your side", "I will be your safe harbor", "I will love you through all seasons",
                "I will be your constant", "I will love you beyond time", "I will be your greatest champion"
            ],
            timeReferences: [
                "every moment", "every day", "every morning", "every evening", "every second",
                "every heartbeat", "every breath", "every thought", "every dream", "every memory",
                "every sunrise", "every sunset", "every season", "every year", "every lifetime"
            ],
            actions: [
                "your smile", "your laugh", "your touch", "your voice", "your presence",
                "your kindness", "your love", "your care", "your understanding", "your support",
                "your gentle words", "your warm embrace", "your tender kiss", "your loving gaze",
                "your sweet whisper", "your soft sigh", "your caring heart", "your beautiful soul"
            ],
            times: [
                "day", "moment", "second", "heartbeat", "breath", "thought", "dream", "memory",
                "sunrise", "sunset", "season", "year", "lifetime", "eternity", "forever"
            ],
            personalTouches: [
                "you are my everything", "I love you beyond measure", "you complete my soul",
                "you are my greatest joy", "you are my heart's home", "you are my eternal love",
                "you are my perfect match", "you are my greatest blessing", "you are my forever",
                "you are my reason for being", "you are my greatest treasure", "you are my soulmate",
                "you are my light", "you are my peace", "you are my sanctuary", "you are my heart's song"
            ],
            openingPhrases: [
                "in this moment", "from the depths of my heart", "with all my love", "beyond words",
                "from my soul", "with every fiber of my being", "in this lifetime and the next",
                "from the stars above", "with infinite love", "from the bottom of my heart"
            ],
            compliments: [
                "you are perfect", "you are flawless", "you are divine", "you are extraordinary",
                "you are magnificent", "you are breathtaking", "you are incomparable", "you are unique",
                "you are irreplaceable", "you are priceless", "you are precious", "you are rare",
                "you are one of a kind", "you are special", "you are wonderful", "you are amazing"
            ],
            emojis: [
                "💖", "💕", "💗", "💓", "💝", "💘", "💞", "💟", "💌", "💋",
                "🌹", "🌺", "🌸", "🌻", "🌷", "💐", "🏵️", "🌼", "🌿", "🍀",
                "✨", "⭐", "🌟", "💫", "🌙", "☀️", "🌈", "🦋", "🕊️", "💎",
                "🌺", "🌻", "🌷", "🌼", "🌿", "🍀", "🌱", "🌾", "🌿", "🌺"
            ]
        };

        // Enhanced training data for better context awareness
        this.trainingData = {
            'romantic_intensity': {
                'high': ['passionate', 'devoted', 'ethereal', 'celestial', 'majestic', 'divine', 'angelic', 'radiant', 'breathtaking', 'mesmerizing'],
                'medium': ['beautiful', 'amazing', 'wonderful', 'precious', 'sweet', 'gorgeous', 'stunning', 'magnificent', 'captivating', 'irresistible'],
                'low': ['lovely', 'charming', 'gentle', 'tender', 'kind', 'elegant', 'graceful', 'delicate', 'caring', 'loving']
            },
            'time_context': {
                'eternal': ['forever', 'eternity', 'lifetime', 'always', 'never ending', 'beyond time', 'infinite', 'perpetual'],
                'present': ['now', 'today', 'this moment', 'right now', 'currently', 'at this instant', 'in this second'],
                'future': ['tomorrow', 'always', 'forever more', 'from now on', 'henceforth', 'in the days to come', 'for all time']
            },
            'emotional_tone': {
                'joyful': ['joy', 'happiness', 'bliss', 'ecstasy', 'euphoria', 'delight', 'thrill', 'excitement'],
                'peaceful': ['serenity', 'peace', 'tranquility', 'harmony', 'balance', 'calm', 'soothe', 'comfort'],
                'passionate': ['passion', 'desire', 'longing', 'yearning', 'love', 'devotion', 'adoration', 'worship']
            }
        };

        // Message quality scoring system
        this.qualityMetrics = {
            'length_optimal': { min: 50, max: 150 },
            'emoji_balance': { min: 1, max: 3 },
            'repetition_penalty': 0.3,
            'coherence_bonus': 0.2
        };

        // Learning from user preferences (simulated)
        this.userPreferences = {
            'favorite_words': [],
            'avoided_words': [],
            'preferred_intensity': 'medium',
            'message_length_preference': 'medium'
        };
    }

    // Enhanced word selection with context awareness
    getRandomWord(category, context = {}) {
        const words = this.wordBanks[category];
        
        // Apply context-based filtering
        if (context.romanticIntensity && this.trainingData.romantic_intensity[context.romanticIntensity]) {
            const intensityWords = this.trainingData.romantic_intensity[context.romanticIntensity];
            const filteredWords = words.filter(word => intensityWords.includes(word));
            if (filteredWords.length > 0) {
                return filteredWords[Math.floor(Math.random() * filteredWords.length)];
            }
        }
        
        // Apply word relationship filtering
        if (context.previousWord && this.wordRelationships[category] && this.wordRelationships[category][context.previousWord]) {
            const relatedWords = this.wordRelationships[category][context.previousWord];
            const filteredWords = words.filter(word => relatedWords.includes(word));
            if (filteredWords.length > 0) {
                return filteredWords[Math.floor(Math.random() * filteredWords.length)];
            }
        }
        
        return words[Math.floor(Math.random() * words.length)];
    }

    // Enhanced message generation with better intelligence
    generateMessage() {
        // Determine romantic intensity based on random factors
        const intensityLevels = ['low', 'medium', 'high'];
        const romanticIntensity = intensityLevels[Math.floor(Math.random() * intensityLevels.length)];
        
        // Select a random template
        const template = this.templates[Math.floor(Math.random() * this.templates.length)];
        
        // Generate words with context awareness
        const context = { romanticIntensity };
        
        // First pass - generate words with basic context
        let adjective = this.getRandomWord('adjectives', context);
        let noun = this.getRandomWord('nouns', { ...context, previousWord: adjective });
        let verb = this.getRandomWord('verbs', { ...context, previousWord: noun });
        let emotion = this.getRandomWord('emotions', { ...context, previousWord: verb });
        let comparison = this.getRandomWord('comparisons', context);
        let personalFeeling = this.getRandomWord('personalFeelings', context);
        let reason = this.getRandomWord('reasons', context);
        let romanticPhrase = this.getRandomWord('romanticPhrases', context);
        let promise = this.getRandomWord('promises', context);
        let timeReference = this.getRandomWord('timeReferences', context);
        let action = this.getRandomWord('actions', context);
        let time = this.getRandomWord('times', context);
        let personalTouch = this.getRandomWord('personalTouches', context);
        let openingPhrase = this.getRandomWord('openingPhrases', context);
        let compliment = this.getRandomWord('compliments', context);
        let emoji = this.getRandomWord('emojis', context);
        
        // Replace placeholders with context-aware selections
        let message = template
            .replace('{adjective}', adjective)
            .replace('{noun}', noun)
            .replace('{verb}', verb)
            .replace('{emotion}', emotion)
            .replace('{comparison}', comparison)
            .replace('{personal_feeling}', personalFeeling)
            .replace('{reason}', reason)
            .replace('{romantic_phrase}', romanticPhrase)
            .replace('{promise}', promise)
            .replace('{time_reference}', timeReference)
            .replace('{action}', action)
            .replace('{time}', time)
            .replace('{personal_touch}', personalTouch)
            .replace('{opening_phrase}', openingPhrase)
            .replace('{compliment}', compliment)
            .replace('{emoji}', emoji);

        // Enhanced variety with intelligent second sentence selection
        const secondSentenceChance = romanticIntensity === 'high' ? 0.5 : romanticIntensity === 'medium' ? 0.3 : 0.2;
        
        if (Math.random() < secondSentenceChance) {
            const secondPhrases = [
                " You are my everything!",
                " I love you more than life itself!",
                " You make my world complete!",
                " You are my greatest treasure!",
                " I am so lucky to have you!",
                " You are my perfect match!",
                " You are my heart's desire!",
                " You are my eternal love!",
                " You are my dream come true!",
                " You are my greatest blessing!",
                " You are my light in the darkness!",
                " You are my peace in the storm!",
                " You are my home wherever I go!",
                " You are my heart's true north!",
                " You are my forever and always!"
            ];
            
            const selectedPhrase = secondPhrases[Math.floor(Math.random() * secondPhrases.length)];
            message += selectedPhrase;
            
            // Sometimes add a third element for high intensity
            if (romanticIntensity === 'high' && Math.random() < 0.3) {
                const thirdElements = [
                    " 💖",
                    " ✨",
                    " 🌟",
                    " 💕",
                    " 💗"
                ];
                message += thirdElements[Math.floor(Math.random() * thirdElements.length)];
            }
        }

        // Post-processing: Fix common grammar issues
        message = this.postProcessMessage(message);
        
        return message;
    }

    // Post-processing to fix common issues
    postProcessMessage(message) {
        // Fix double spaces
        message = message.replace(/\s+/g, ' ');
        
        // Fix punctuation issues
        message = message.replace(/\s+([.!?])/g, '$1');
        
        // Ensure proper capitalization
        message = message.replace(/^([a-z])/, (match, p1) => p1.toUpperCase());
        
        // Fix common grammar issues
        message = message.replace(/\s+and\s+and\s+/g, ' and ');
        message = message.replace(/\s+the\s+the\s+/g, ' the ');
        message = message.replace(/\s+you\s+you\s+/g, ' you ');
        
        return message.trim();
    }

    // Generate multiple message options for variety
    generateMultipleMessages(count = 3) {
        const messages = [];
        for (let i = 0; i < count; i++) {
            messages.push(this.generateMessage());
        }
        return messages;
    }

    // Get a message with specific characteristics
    generateMessageWithStyle(style = 'romantic') {
        const styleContexts = {
            'romantic': { romanticIntensity: 'high' },
            'sweet': { romanticIntensity: 'medium' },
            'gentle': { romanticIntensity: 'low' },
            'passionate': { romanticIntensity: 'high' },
            'tender': { romanticIntensity: 'low' }
        };
        
        const context = styleContexts[style] || { romanticIntensity: 'medium' };
        return this.generateMessage();
    }

    // Quality scoring system
    scoreMessage(message) {
        let score = 0;
        
        // Length scoring
        const length = message.length;
        if (length >= this.qualityMetrics.length_optimal.min && length <= this.qualityMetrics.length_optimal.max) {
            score += 0.3;
        }
        
        // Emoji balance scoring
        const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
        if (emojiCount >= this.qualityMetrics.emoji_balance.min && emojiCount <= this.qualityMetrics.emoji_balance.max) {
            score += 0.2;
        }
        
        // Repetition penalty
        const words = message.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        const repetitionRatio = uniqueWords.size / words.length;
        score += repetitionRatio * this.qualityMetrics.repetition_penalty;
        
        // Coherence bonus (check for romantic keywords)
        const romanticKeywords = ['love', 'heart', 'soul', 'beautiful', 'amazing', 'precious', 'treasure', 'miracle', 'dream'];
        const keywordCount = romanticKeywords.filter(keyword => message.toLowerCase().includes(keyword)).length;
        score += (keywordCount / romanticKeywords.length) * this.qualityMetrics.coherence_bonus;
        
        return Math.min(1, Math.max(0, score));
    }

    // Generate multiple messages and return the best one
    generateBestMessage(attempts = 5) {
        let bestMessage = '';
        let bestScore = 0;
        
        for (let i = 0; i < attempts; i++) {
            const message = this.generateMessage();
            const score = this.scoreMessage(message);
            
            if (score > bestScore) {
                bestScore = score;
                bestMessage = message;
            }
        }
        
        return bestMessage;
    }

    // Learning system (simulated)
    learnFromMessage(message, rating = 5) {
        // Extract words from the message
        const words = message.toLowerCase().match(/\b\w+\b/g) || [];
        
        if (rating >= 4) {
            // Positive learning
            words.forEach(word => {
                if (!this.userPreferences.favorite_words.includes(word)) {
                    this.userPreferences.favorite_words.push(word);
                }
            });
        } else if (rating <= 2) {
            // Negative learning
            words.forEach(word => {
                if (!this.userPreferences.avoided_words.includes(word)) {
                    this.userPreferences.avoided_words.push(word);
                }
            });
        }
        
        // Update preferences based on message characteristics
        if (message.length > 100) {
            this.userPreferences.message_length_preference = 'long';
        } else if (message.length < 60) {
            this.userPreferences.message_length_preference = 'short';
        } else {
            this.userPreferences.message_length_preference = 'medium';
        }
    }

    // Enhanced generation with learning
    generateLearnedMessage() {
        // Apply learned preferences
        const context = {
            romanticIntensity: this.userPreferences.preferred_intensity,
            avoidWords: this.userPreferences.avoided_words,
            preferWords: this.userPreferences.favorite_words
        };
        
        return this.generateMessageWithContext(context);
    }

    // Generate message with specific context
    generateMessageWithContext(context = {}) {
        // Use context to influence word selection
        const template = this.templates[Math.floor(Math.random() * this.templates.length)];
        
        // Apply context filtering
        let words = { ...this.wordBanks };
        
        if (context.avoidWords && context.avoidWords.length > 0) {
            Object.keys(words).forEach(category => {
                words[category] = words[category].filter(word => !context.avoidWords.includes(word.toLowerCase()));
            });
        }
        
        if (context.preferWords && context.preferWords.length > 0) {
            Object.keys(words).forEach(category => {
                const preferred = words[category].filter(word => context.preferWords.includes(word.toLowerCase()));
                if (preferred.length > 0) {
                    words[category] = [...preferred, ...words[category]];
                }
            });
        }
        
        // Generate message with filtered words
        let message = template
            .replace('{adjective}', this.getRandomWordFromArray(words.adjectives))
            .replace('{noun}', this.getRandomWordFromArray(words.nouns))
            .replace('{verb}', this.getRandomWordFromArray(words.verbs))
            .replace('{emotion}', this.getRandomWordFromArray(words.emotions))
            .replace('{comparison}', this.getRandomWordFromArray(words.comparisons))
            .replace('{personal_feeling}', this.getRandomWordFromArray(words.personalFeelings))
            .replace('{reason}', this.getRandomWordFromArray(words.reasons))
            .replace('{romantic_phrase}', this.getRandomWordFromArray(words.romanticPhrases))
            .replace('{promise}', this.getRandomWordFromArray(words.promises))
            .replace('{time_reference}', this.getRandomWordFromArray(words.timeReferences))
            .replace('{action}', this.getRandomWordFromArray(words.actions))
            .replace('{time}', this.getRandomWordFromArray(words.times))
            .replace('{personal_touch}', this.getRandomWordFromArray(words.personalTouches))
            .replace('{opening_phrase}', this.getRandomWordFromArray(words.openingPhrases))
            .replace('{compliment}', this.getRandomWordFromArray(words.compliments))
            .replace('{emoji}', this.getRandomWordFromArray(words.emojis));
        
        return this.postProcessMessage(message);
    }

    // Helper method for getting random word from array
    getRandomWordFromArray(wordArray) {
        return wordArray[Math.floor(Math.random() * wordArray.length)];
    }

    // Get AI statistics
    getAIStats() {
        return {
            totalWords: Object.values(this.wordBanks).reduce((sum, words) => sum + words.length, 0),
            templates: this.templates.length,
            userPreferences: this.userPreferences,
            qualityMetrics: this.qualityMetrics
        };
    }
}

// Create global instance
window.vianeAI = new VianeAI();
