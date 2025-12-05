// Simple chatbot test to debug visibility issues
console.log('Chatbot test script loaded');

// Wait for DOM to be ready
function initChatbotTest() {
    console.log('DOM ready, creating test chatbot...');
    
    // Create a simple visible button
    const testButton = document.createElement('button');
    testButton.innerHTML = '🤖 TEST CHATBOT';
    testButton.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 120px !important;
        height: 50px !important;
        background: #ff6b6b !important;
        color: white !important;
        border: none !important;
        border-radius: 25px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
    `;
    
    testButton.addEventListener('click', function() {
        alert('Chatbot test button clicked! The chatbot system is working.');
    });
    
    document.body.appendChild(testButton);
    console.log('Test chatbot button added to DOM');
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotTest);
} else {
    initChatbotTest();
}

// Also try with a delay
setTimeout(() => {
    if (!document.querySelector('[style*="position: fixed"][style*="bottom: 20px"]')) {
        console.log('No chatbot found, creating backup...');
        initChatbotTest();
    }
}, 1000);
