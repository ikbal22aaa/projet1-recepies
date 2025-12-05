// Intelligent Recipe Chatbot
class RecipeChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.initializeElements();
        this.bindEvents();
        this.createChatbotHTML();
    }
    
    initializeElements() {
        // Elements will be created dynamically
    }
    
    createChatbotHTML() {
        console.log('Creating chatbot HTML...');
        
        // Create chatbot button
        this.button = document.createElement('button');
        this.button.className = 'chatbot-button';
        this.button.id = 'chatbotButton';
        this.button.innerHTML = '<i class="fas fa-robot"></i>';
        this.button.title = 'AI Recipe Assistant';
        document.body.appendChild(this.button);
        console.log('Chatbot button created and added to DOM');
        
        // Create chatbot container
        this.container = document.createElement('div');
        this.container.className = 'chatbot-container';
        this.container.id = 'chatbotContainer';
        this.container.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>AI Recipe Assistant</span>
                    <span class="api-status online" id="apiStatus">● Gemini</span>
                </div>
                <button class="chatbot-toggle" id="chatbotClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot">
                    <p>👋 Hello! I'm your AI Recipe Assistant powered by Gemini. I can help you with:</p>
                    <div class="quick-actions">
                        <span class="quick-action" onclick="sendQuickMessage('What recipes do you have?')">Browse Recipes</span>
                        <span class="quick-action" onclick="sendQuickMessage('I need cooking tips')">Cooking Tips</span>
                        <span class="quick-action" onclick="sendQuickMessage('Help me plan a meal')">Meal Planning</span>
                        <span class="quick-action" onclick="sendQuickMessage('What can I cook with chicken?')">Ingredient Ideas</span>
                        <span class="quick-action" onclick="sendQuickMessage('How do I make pasta?')">Cooking Techniques</span>
                        <span class="quick-action" onclick="sendQuickMessage('Healthy dinner ideas')">Healthy Recipes</span>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-input">
                <div class="input-container">
                    <input type="text" class="chatbot-input-field" id="chatbotInput" placeholder="Ask me anything about cooking...">
                    <button class="chatbot-send" id="chatbotSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        console.log('Chatbot container created and added to DOM');
        
        // Get references to elements
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendButton = document.getElementById('chatbotSend');
        this.closeButton = document.getElementById('chatbotClose');
        this.apiStatus = document.getElementById('apiStatus');
        
        // Initialize API status
        this.updateApiStatus('online');
    }
    
    bindEvents() {
        this.button.addEventListener('click', () => this.toggle());
        this.closeButton.addEventListener('click', () => this.close());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.button.classList.add('hidden');
        this.input.focus();
    }
    
    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
        this.button.classList.remove('hidden');
    }
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;
        
        this.addMessage(message, 'user');
        this.input.value = '';
        this.showTyping();
        
        try {
            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.generateResponse(message);
        } catch (error) {
            console.error('Error generating response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again!', 'bot');
        } finally {
            this.hideTyping();
        }
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = content;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTyping() {
        this.isTyping = true;
        this.sendButton.disabled = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        typingDiv.id = 'typing-indicator';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async generateResponse(userMessage) {
        try {
            // Try to get response from Gemini API first
            this.updateApiStatus('online');
            const apiResponse = await this.callGeminiAPI(userMessage);
            if (apiResponse) {
                this.addMessage(apiResponse, 'bot');
                return;
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            this.updateApiStatus('offline');
            // Fallback to local responses if API fails
        }
        
        // Fallback to local intelligent responses
        const response = this.getIntelligentResponse(userMessage);
        this.addMessage(response, 'bot');
    }
    
    getIntelligentResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Recipe browsing
        if (lowerMessage.includes('recipe') || lowerMessage.includes('what recipes') || lowerMessage.includes('browse')) {
            return this.getRecipeResponse();
        }
        
        // Cooking tips
        if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
            return this.getCookingTipsResponse();
        }
        
        // Meal planning
        if (lowerMessage.includes('meal') || lowerMessage.includes('plan') || lowerMessage.includes('menu')) {
            return this.getMealPlanningResponse();
        }
        
        // Ingredient-based queries
        if (lowerMessage.includes('chicken') || lowerMessage.includes('beef') || lowerMessage.includes('vegetable') || lowerMessage.includes('ingredient')) {
            return this.getIngredientResponse(message);
        }
        
        // Dietary restrictions
        if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan') || lowerMessage.includes('gluten') || lowerMessage.includes('diet')) {
            return this.getDietaryResponse(message);
        }
        
        // Cooking techniques
        if (lowerMessage.includes('how to') || lowerMessage.includes('cook') || lowerMessage.includes('bake') || lowerMessage.includes('fry')) {
            return this.getCookingTechniqueResponse(message);
        }
        
        // Time-based queries
        if (lowerMessage.includes('quick') || lowerMessage.includes('fast') || lowerMessage.includes('minute') || lowerMessage.includes('time')) {
            return this.getTimeBasedResponse();
        }
        
        // Difficulty queries
        if (lowerMessage.includes('easy') || lowerMessage.includes('simple') || lowerMessage.includes('beginner') || lowerMessage.includes('hard')) {
            return this.getDifficultyResponse(message);
        }
        
        // General cooking questions
        return this.getGeneralResponse(message);
    }
    
    getRecipeResponse() {
        const responses = [
            `🍽️ **Our Recipe Collection**\n\nWe have a wonderful variety of recipes across different categories:\n\n• **Breakfast**: Classic Pancakes, French Toast, Omelets\n• **Lunch**: Fresh Salads, Sandwiches, Soups\n• **Dinner**: Stir-fries, Pasta, Grilled Meats\n• **Desserts**: Cookies, Cakes, Ice Cream\n\nWhat type of meal are you planning? I can suggest specific recipes based on your preferences!`,
            
            `📚 **Recipe Categories Available**\n\n✨ **Breakfast**: Start your day right with fluffy pancakes, hearty omelets, and nutritious smoothie bowls\n\n🍽️ **Lunch**: Quick and satisfying meals like fresh salads, gourmet sandwiches, and comforting soups\n\n🌙 **Dinner**: Impressive main courses including stir-fries, pasta dishes, and perfectly grilled proteins\n\n🍰 **Desserts**: Sweet treats from simple cookies to elaborate cakes\n\nWould you like me to recommend something specific based on your mood or dietary preferences?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getCookingTipsResponse() {
        const tips = [
            `👨‍🍳 **Essential Cooking Tips**\n\n• **Mise en place**: Prepare all ingredients before you start cooking\n• **Taste as you go**: Season gradually and taste frequently\n• **Keep knives sharp**: A sharp knife is safer and more efficient\n• **Don't overcrowd the pan**: This prevents proper browning\n• **Let meat rest**: Allow cooked meat to rest before slicing\n\nWhat specific cooking technique would you like to learn more about?`,
            
            `🔥 **Pro Cooking Secrets**\n\n• **Salt your pasta water**: It should taste like seawater\n• **Preheat your pan**: Wait for the oil to shimmer before adding food\n• **Use the right heat**: High heat for searing, medium for sautéing\n• **Don't flip too early**: Let food develop a crust before moving it\n• **Fresh herbs at the end**: Add delicate herbs just before serving\n\nNeed advice on a particular cooking method or ingredient?`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    getMealPlanningResponse() {
        return `📅 **Smart Meal Planning**\n\n**Weekly Planning Strategy:**\n• Plan 3-4 main dishes for the week\n• Choose recipes with overlapping ingredients\n• Prep vegetables and proteins in advance\n• Cook grains and proteins in larger batches\n\n**Balanced Meal Structure:**\n• **Protein**: 25% of your plate\n• **Vegetables**: 50% of your plate\n• **Grains/Carbs**: 25% of your plate\n\n**Time-Saving Tips:**\n• Batch cook on weekends\n• Use slow cooker for hands-off meals\n• Prep smoothie ingredients in freezer bags\n\nWhat's your main goal - saving time, eating healthier, or trying new flavors?`;
    }
    
    getIngredientResponse(message) {
        if (message.toLowerCase().includes('chicken')) {
            return `🐔 **Chicken Recipe Ideas**\n\n**Quick & Easy:**\n• Chicken Stir-fry (25 min)\n• Grilled Chicken Breast (20 min)\n• Chicken Caesar Salad (15 min)\n\n**Comfort Food:**\n• Chicken and Rice Casserole (45 min)\n• Chicken Noodle Soup (30 min)\n• Buffalo Chicken Wings (40 min)\n\n**Healthy Options:**\n• Lemon Herb Chicken (30 min)\n• Chicken Quinoa Bowl (25 min)\n• Chicken Vegetable Skewers (35 min)\n\nWhat cooking method do you prefer - grilling, baking, or stovetop?`;
        }
        
        if (message.toLowerCase().includes('vegetable')) {
            return `🥬 **Vegetable Recipe Inspiration**\n\n**Quick Sides:**\n• Roasted Mixed Vegetables (25 min)\n• Sautéed Green Beans (10 min)\n• Grilled Asparagus (15 min)\n\n**Main Dishes:**\n• Vegetable Stir-fry (20 min)\n• Ratatouille (45 min)\n• Stuffed Bell Peppers (50 min)\n\n**Healthy Snacks:**\n• Vegetable Hummus Platter (10 min)\n• Kale Chips (20 min)\n• Cucumber Salad (15 min)\n\nAre you looking for vegetarian main dishes or vegetable side dishes?`;
        }
        
        return `🥘 **Ingredient-Based Cooking**\n\nI'd love to help you create something amazing! Here are some approaches:\n\n**Protein Focus:**\n• Choose your protein (chicken, beef, fish, tofu)\n• Pick a cooking method (grill, bake, sauté)\n• Add complementary vegetables and seasonings\n\n**Vegetable Forward:**\n• Select seasonal vegetables\n• Choose preparation method (roast, steam, raw)\n• Add protein and grains for balance\n\n**Grain-Based:**\n• Pick your grain (rice, quinoa, pasta)\n• Add vegetables and protein\n• Season with herbs and spices\n\nWhat ingredient are you most excited to work with today?`;
    }
    
    getDietaryResponse(message) {
        if (message.toLowerCase().includes('vegetarian')) {
            return `🌱 **Vegetarian Recipe Collection**\n\n**Protein-Rich Options:**\n• Quinoa Buddha Bowls\n• Lentil Curry\n• Chickpea Stir-fry\n• Black Bean Tacos\n\n**Comfort Foods:**\n• Mac and Cheese (vegan option available)\n• Vegetable Lasagna\n• Stuffed Portobello Mushrooms\n• Ratatouille\n\n**Quick & Easy:**\n• Caprese Salad\n• Vegetable Pasta\n• Hummus Wraps\n• Roasted Vegetable Medley\n\nWould you like recipes that are naturally vegetarian or vegetarian adaptations of classic dishes?`;
        }
        
        if (message.toLowerCase().includes('vegan')) {
            return `🌿 **Vegan Recipe Ideas**\n\n**Plant-Based Proteins:**\n• Tofu Scramble\n• Tempeh Stir-fry\n• Chickpea Curry\n• Black Bean Burgers\n\n**Dairy Alternatives:**\n• Cashew Cream Pasta\n• Coconut Milk Ice Cream\n• Almond Milk Smoothies\n• Nutritional Yeast "Cheese"\n\n**Whole Food Focus:**\n• Buddha Bowls\n• Raw Zucchini Noodles\n• Stuffed Sweet Potatoes\n• Green Smoothie Bowls\n\nAre you looking for beginner-friendly vegan recipes or more advanced plant-based cooking techniques?`;
        }
        
        return `🥗 **Dietary-Friendly Cooking**\n\nI can help you find recipes that fit your dietary needs:\n\n**Common Dietary Considerations:**\n• **Gluten-Free**: Rice, quinoa, corn-based dishes\n• **Low-Carb**: Focus on proteins and non-starchy vegetables\n• **Keto**: High-fat, low-carb combinations\n• **Paleo**: Whole foods, no processed ingredients\n• **Mediterranean**: Olive oil, fish, vegetables, whole grains\n\n**Allergy-Friendly Options:**\n• Nut-free alternatives\n• Dairy-free substitutions\n• Egg-free baking techniques\n\nWhat specific dietary requirements are you working with?`;
    }
    
    getCookingTechniqueResponse(message) {
        if (message.toLowerCase().includes('how to')) {
            return `👨‍🍳 **Cooking Technique Guide**\n\n**Basic Techniques:**\n• **Sautéing**: High heat, small amount of oil, constant movement\n• **Roasting**: Even heat, dry environment, caramelization\n• **Steaming**: Gentle heat, moisture retention\n• **Braising**: Low heat, liquid cooking, tender results\n\n**Advanced Methods:**\n• **Sous Vide**: Precise temperature control\n• **Smoking**: Low heat, wood smoke, long cooking\n• **Fermentation**: Time, salt, beneficial bacteria\n\n**Pro Tips:**\n• Always preheat your cooking surface\n• Use the right size pan for your food\n• Don't move food too early - let it develop flavor\n• Rest meat after cooking for better texture\n\nWhat specific technique would you like to master?`;
        }
        
        return `🔥 **Cooking Method Mastery**\n\n**Heat Control:**\n• **High Heat**: Searing, stir-frying, boiling water\n• **Medium Heat**: Sautéing, pan-frying, gentle simmering\n• **Low Heat**: Braising, slow cooking, melting\n\n**Moisture Management:**\n• **Dry Heat**: Roasting, grilling, baking\n• **Wet Heat**: Boiling, steaming, poaching\n• **Combination**: Braising, stewing\n\n**Timing Tips:**\n• Start with aromatics (onions, garlic)\n• Add ingredients by cooking time\n• Taste and adjust seasoning throughout\n• Let dishes rest before serving\n\nWhat cooking method are you most curious about?`;
    }
    
    getTimeBasedResponse() {
        return `⏰ **Quick & Easy Recipes**\n\n**15 Minutes or Less:**\n• Avocado Toast with Egg\n• Caprese Salad\n• Greek Yogurt Parfait\n• Hummus Wrap\n\n**30 Minutes or Less:**\n• One-Pan Chicken and Vegetables\n• Pasta Aglio e Olio\n• Fish Tacos\n• Quinoa Salad Bowl\n\n**Time-Saving Strategies:**\n• Prep ingredients in advance\n• Use pre-cut vegetables\n• Cook proteins in batches\n• Keep pantry staples ready\n• Use slow cooker for hands-off cooking\n\n**Quick Meal Ideas:**\n• Breakfast: Smoothie bowls, overnight oats\n• Lunch: Wraps, salads, leftovers\n• Dinner: Stir-fries, pasta, sheet pan meals\n\nWhat's your typical cooking time constraint?`;
    }
    
    getDifficultyResponse(message) {
        if (message.toLowerCase().includes('easy') || message.toLowerCase().includes('simple') || message.toLowerCase().includes('beginner')) {
            return `😊 **Beginner-Friendly Recipes**\n\n**Perfect for Starting Out:**\n• Scrambled Eggs\n• Grilled Cheese Sandwich\n• Simple Pasta with Butter\n• Roasted Vegetables\n• Basic Salad\n\n**Building Skills Gradually:**\n• Start with one-pot meals\n• Master basic knife skills\n• Learn proper seasoning\n• Practice timing\n\n**Beginner Tips:**\n• Read recipes completely before starting\n• Gather all ingredients first\n• Start with simple seasonings\n• Don't be afraid to make mistakes\n• Taste everything as you cook\n\n**Confidence Builders:**\n• Perfect scrambled eggs\n• Homemade salad dressing\n• Basic rice cooking\n• Simple stir-fry\n\nWhat's your comfort level with cooking? I can suggest recipes that match your experience!`;
        }
        
        return `🎯 **Recipe Difficulty Levels**\n\n**Easy (⭐):**\n• Few ingredients\n• Simple techniques\n• Minimal prep time\n• Forgiving recipes\n\n**Medium (⭐⭐):**\n• Multiple steps\n• Some technique required\n• Moderate prep time\n• Timing matters\n\n**Hard (⭐⭐⭐):**\n• Complex techniques\n• Multiple components\n• Precise timing\n• Advanced skills needed\n\n**Choosing the Right Level:**\n• Start with easy recipes to build confidence\n• Gradually increase complexity\n• Practice techniques separately\n• Don't rush the learning process\n\nWhat level of challenge are you looking for today?`;
    }
    
    getGeneralResponse(message) {
        const responses = [
            `🤔 **I'd love to help you with that!**\n\nWhile I'm specialized in cooking and recipes, I can assist with:\n\n• Recipe recommendations and modifications\n• Cooking techniques and tips\n• Meal planning and prep\n• Ingredient substitutions\n• Dietary adaptations\n• Kitchen equipment advice\n\nCould you tell me more about what you're trying to achieve in the kitchen? I'm here to help make your cooking experience more enjoyable and successful!`,
            
            `🍳 **Let's cook something amazing together!**\n\nI'm your personal cooking assistant, and I'm excited to help you with:\n\n• Finding the perfect recipe for any occasion\n• Troubleshooting cooking challenges\n• Suggesting ingredient alternatives\n• Planning balanced meals\n• Learning new cooking techniques\n\nWhat's on your mind? Are you planning a special meal, looking for quick dinner ideas, or wanting to try something new?`,
            
            `✨ **Cooking is an adventure!**\n\nI'm here to be your culinary companion. Whether you're:\n\n• A complete beginner just starting out\n• An experienced cook looking for inspiration\n• Someone with dietary restrictions\n• Planning meals for a family\n• Wanting to impress guests\n\nI can help you navigate the wonderful world of cooking. What culinary adventure would you like to embark on today?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async callGeminiAPI(userMessage) {
        const API_KEY = 'AIzaSyC03asfryOF1hUtRL6Y-uBAP6PscuMx8b8';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        // Build conversation context
        const recentMessages = this.messages.slice(-6); // Last 3 exchanges
        const context = recentMessages.map(msg => 
            `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        
        // Create enhanced context-aware prompt
        const prompt = `You are an expert cooking and recipe assistant for a recipe website. You help users with cooking, recipes, meal planning, nutrition, and food-related questions.

Recent conversation context:
${context}

Current user question: "${userMessage}"

Instructions:
- Provide helpful, accurate cooking advice and recipe suggestions
- Keep responses conversational and friendly (2-3 paragraphs max)
- Use appropriate cooking emojis (🍳🥘👨‍🍳 etc.) sparingly
- If asked about non-cooking topics, politely redirect to cooking/food
- Suggest specific recipes, techniques, or ingredients when relevant
- Be encouraging and supportive for beginners
- Include practical tips and tricks when appropriate

Respond as a knowledgeable cooking expert who loves helping people in the kitchen.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH", 
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                
                // Store the conversation for context
                this.messages.push({ sender: 'user', content: userMessage });
                this.messages.push({ sender: 'bot', content: responseText });
                
                // Keep only last 10 messages for context
                if (this.messages.length > 10) {
                    this.messages = this.messages.slice(-10);
                }
                
                return responseText;
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Gemini API call failed:', error);
            this.updateApiStatus('offline');
            throw error;
        }
    }

    updateApiStatus(status) {
        if (this.apiStatus) {
            this.apiStatus.className = `api-status ${status}`;
            this.apiStatus.textContent = status === 'online' ? '● Gemini' : '● Offline';
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// CSS for the chatbot
const chatbotCSS = `
    .chatbot-container {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 400px !important;
        height: 600px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        border-radius: 20px !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        display: flex !important;
        flex-direction: column !important;
        z-index: 10000 !important;
        transition: all 0.3s ease !important;
        transform: translateY(100%) !important;
    }
    
    .chatbot-container.open {
        transform: translateY(0);
    }
    
    .chatbot-header {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
        color: white !important;
        padding: 1rem !important;
        border-radius: 20px 20px 0 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
    }
    
    .chatbot-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
    }
    
    .api-status {
        font-size: 0.7rem;
        opacity: 0.8;
        margin-left: 0.5rem;
    }
    
    .api-status.online {
        color: #2ecc71;
    }
    
    .api-status.offline {
        color: #e74c3c;
    }
    
    .chatbot-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .chatbot-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .chatbot-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .message {
        max-width: 80%;
        padding: 0.8rem 1rem;
        border-radius: 18px;
        animation: messageSlide 0.3s ease-out;
    }
    
    @keyframes messageSlide {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .message.user {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        color: white;
        align-self: flex-end;
        margin-left: auto;
    }
    
    .message.bot {
        background: rgba(255, 255, 255, 0.8);
        color: var(--text-dark);
        align-self: flex-start;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .message.typing {
        background: rgba(255, 255, 255, 0.8);
        color: var(--text-light);
        align-self: flex-start;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-light);
        animation: typingDot 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    .typing-dot:nth-child(3) { animation-delay: 0s; }
    
    @keyframes typingDot {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
    
    .chatbot-input {
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .input-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    
    .chatbot-input-field {
        flex: 1;
        padding: 0.8rem 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        background: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .chatbot-input-field:focus {
        outline: none;
        border-color: var(--primary-color);
        background: rgba(255, 255, 255, 0.95);
    }
    
    .chatbot-send {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        padding: 0.8rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .chatbot-send:hover {
        transform: scale(1.1);
    }
    
    .chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
    
    .chatbot-button {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 1.5rem !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        transition: all 0.3s ease !important;
        z-index: 9999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .chatbot-button:hover {
        transform: scale(1.1);
    }
    
    .chatbot-button.hidden {
        display: none;
    }
    
    .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .quick-action {
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: var(--text-dark);
        padding: 0.4rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quick-action:hover {
        background: var(--primary-color);
        color: white;
    }
    
    @media (max-width: 480px) {
        .chatbot-container {
            width: calc(100vw - 40px);
            height: calc(100vh - 40px);
            bottom: 20px;
            right: 20px;
            left: 20px;
        }
    }
`;

// Add CSS to page
const style = document.createElement('style');
style.textContent = chatbotCSS;
document.head.appendChild(style);

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing chatbot...');
    try {
        window.recipeChatbot = new RecipeChatbot();
        console.log('Chatbot initialized successfully!');
    } catch (error) {
        console.error('Error initializing chatbot:', error);
    }
});

// Quick message function for buttons
function sendQuickMessage(message) {
    if (window.recipeChatbot) {
        window.recipeChatbot.input.value = message;
        window.recipeChatbot.sendMessage();
    }
}
