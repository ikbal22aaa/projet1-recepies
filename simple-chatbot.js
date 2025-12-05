// Simple chatbot that will definitely appear
console.log('Simple chatbot script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, creating simple chatbot...');
    
    // Create button
    const button = document.createElement('button');
    button.innerHTML = '🤖';
    button.id = 'simpleChatbotBtn';
    button.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        background: #ff6b6b !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 24px !important;
        z-index: 99999 !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    
    // Create container
    const container = document.createElement('div');
    container.id = 'simpleChatbotContainer';
    container.style.cssText = `
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        width: 350px !important;
        height: 500px !important;
        background: white !important;
        border-radius: 15px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
        z-index: 99998 !important;
        display: none !important;
        flex-direction: column !important;
    `;
    
    container.innerHTML = `
        <div style="background: #ff6b6b; color: white; padding: 15px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold;">🤖 AI Assistant</span>
            <button id="closeChatbot" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
        </div>
        <div id="chatMessages" style="flex: 1; padding: 15px; overflow-y: auto; background: #f8f9fa;">
            <div style="background: #e9ecef; padding: 10px; border-radius: 10px; margin-bottom: 10px;">
                👋 Hello! I'm your AI Assistant powered by Gemini. I can help you with anything - cooking, general questions, advice, explanations, and more! What would you like to know?
            </div>
        </div>
        <div style="padding: 15px; border-top: 1px solid #dee2e6;">
            <div style="display: flex; gap: 10px;">
                <input type="text" id="chatInput" placeholder="Ask me anything..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; outline: none;">
                <button id="sendBtn" style="background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">📤</button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(button);
    document.body.appendChild(container);
    
    console.log('Simple chatbot elements added to DOM');
    
    // Event listeners
    button.addEventListener('click', function() {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    });
    
    document.getElementById('closeChatbot').addEventListener('click', function() {
        container.style.display = 'none';
    });
    
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    async function sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.style.cssText = `
            background: #e9ecef;
            color: #666;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            margin-right: 50px;
            font-style: italic;
        `;
        typingDiv.innerHTML = '🤖 AI is thinking...';
        document.getElementById('chatMessages').appendChild(typingDiv);
        
        try {
            // Call Gemini API
            console.log('Calling Gemini API for message:', message);
            const response = await callGeminiAPI(message);
            console.log('Gemini API response:', response);
            // Remove typing indicator
            typingDiv.remove();
            // Add AI response
            addMessage(response, 'bot');
        } catch (error) {
            console.error('Gemini API error:', error);
            // Remove typing indicator
            typingDiv.remove();
            
            // Provide a fallback response based on the message
            const fallbackResponse = getFallbackResponse(message);
            addMessage(fallbackResponse, 'bot');
        }
    }
    
    function addMessage(text, sender) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            background: ${sender === 'user' ? '#ff6b6b' : '#e9ecef'};
            color: ${sender === 'user' ? 'white' : 'black'};
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            margin-left: ${sender === 'user' ? '50px' : '0'};
            margin-right: ${sender === 'user' ? '0' : '50px'};
        `;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Fallback response function
    function getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            return "Hello! 👋 I'm your AI assistant. I'm currently having some technical difficulties with my AI service, but I'm still here to help! What would you like to know?";
        }
        
        if (lowerMessage.includes('food') || lowerMessage.includes('cook') || lowerMessage.includes('recipe')) {
            return "🍳 I'd love to help with cooking questions! While my AI service is temporarily unavailable, I can still provide basic cooking tips. What specific cooking question do you have?";
        }
        
        if (lowerMessage.includes('help')) {
            return "I'm here to help! 🤖 While my advanced AI features are temporarily offline, I can still assist with basic questions. What do you need help with?";
        }
        
        if (lowerMessage.includes('weather')) {
            return "🌤️ I'd normally help with weather information, but my AI service is currently unavailable. You might want to check a weather app or website for current conditions.";
        }
        
        if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
            return `🕐 The current time is ${new Date().toLocaleTimeString()} and today is ${new Date().toLocaleDateString()}. While my AI service is temporarily offline, I can still provide basic information like this!`;
        }
        
        // Default response
        return `I understand you're asking about "${message}". While my AI service is temporarily unavailable, I'm still here to help! Could you try rephrasing your question or ask something else?`;
    }

    // Gemini API function
    async function callGeminiAPI(userMessage) {
        const API_KEY = 'AIzaSyC03asfryOF1hUtRL6Y-uBAP6PscuMx8b8';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        console.log('API URL:', API_URL);
        console.log('User message:', userMessage);
        
        // Create a general-purpose prompt (not just food-focused)
        const prompt = `You are a helpful AI assistant. The user is asking: "${userMessage}"

Please provide a helpful, informative, and friendly response. Be conversational and engaging. If the question is about cooking or recipes, provide detailed cooking advice. For other topics, provide accurate and helpful information.

Keep responses concise but informative (2-3 paragraphs max). Use appropriate emojis sparingly. Be encouraging and supportive.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
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

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        try {
            console.log('Making fetch request...');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response data:', errorData);
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                console.log('Extracted response text:', responseText);
                return responseText;
            } else {
                console.error('Invalid response structure:', data);
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }

    console.log('Simple chatbot fully initialized!');
});
