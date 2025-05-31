let systemPrompt = ""
document.addEventListener('DOMContentLoaded', function() {
    // Load API configuration first
    loadAPIConfig().then(() => {
        const jadeId = getJadeIdFromUrl();
        loadJadeData(jadeId);

        const sendButton = document.getElementById('send-button');
        const messageInput = document.getElementById('message-input');

        sendButton.addEventListener('click', sendMessage);
    }).catch(error => {
        console.error("Failed to load API config:", error);
        // Show error to user
        alert("Failed to load API configuration. Please try again later.");
    });
});

function getJadeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('jadeId');
}

async function loadJadeData(jadeId) {
    showLoading();

    try {
        // Simulate loading resources
        const jade = await simulateLoad(jadeId);
        console.log("Jade data loaded:", jade); // Debugging statement

        // Set jade data
        document.getElementById('jade-video').querySelector('source').src = jade.videoSrc;
        document.getElementById('jade-video').load(); // Important to load the new source
        document.getElementById('jade-image').src = jade.imageSrc;
        document.getElementById('jade-name').textContent = jade.name;
        document.getElementById('jade-character').textContent = jade.character;
        document.getElementById('jade-character-description').textContent = jade.characteristics;
        systemPrompt = jade.prompt

        // Load prompt hints
        loadPromptHints(jadeId);

    } catch (error) {
        console.error("Error loading jade data:", error);
    } finally {
        hideLoading();
    }
}

async function loadAPIConfig() {
    try {
        const response = await fetch('../../assets/APIData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiConfig = await response.json();

        // Set the global variables
        OPENAI_ENGINE_VERSION = apiConfig.OPENAI_ENGINE_VERSION;
        OPENAI_API_KEY = apiConfig.OPENAI_API_KEY;
        BASE_URL = apiConfig.BASE_URL;

        console.log("API configuration loaded successfully");
    } catch (error) {
        console.error("Error loading API config:", error);
        throw error; // Re-throw to be caught by the caller
    }
}

// Simulate loading data
// filepath: /Users/fubaoying/Documents/JadeResonance/js/jade-dialog.js
async function simulateLoad(jadeId) {
  try {
    const response = await fetch('../../assets/jadeData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jadeData = await response.json();
    return jadeData[jadeId] || jadeData["hetian"];
  } catch (error) {
    console.error("Error loading jade data:", error);
    // 可以考虑显示错误信息给用户
    throw error; // 重新抛出错误，让 loadJadeData 函数处理
  }
}

async function loadCharacterIntro(jadeId) {
    try {
        const jade = await simulateLoad(jadeId);
        document.getElementById('jade-character-description').textContent = jade.character;
    } catch (error) {
        console.error("Error loading character intro:", error);
    }
}

function loadPromptHints(jadeId) {
    const hints = getPromptHints(jadeId);
    const chatHintsContainer = document.getElementById('chat-hints');
    chatHintsContainer.innerHTML = ''; // Clear existing hints

    hints.forEach(hint => {
        const button = document.createElement('button');
        button.textContent = hint;
        button.addEventListener('click', () => {
            document.getElementById('message-input').value = hint;
        });
        chatHintsContainer.appendChild(button);
    });
}

function getPromptHints(jadeId) {
    // Replace with your logic to fetch prompts based on jadeId
    const prompts = {
        hetian: ["你是谁？", "你有什么特点？", "可以介绍一下你的历史吗？"],
        lantian: ["你来自哪里？", "你有什么用途？", "你有什么传说故事？"],
        dushan: ["你有什么颜色？", "你有什么纹理？", "你有什么象征意义？"],
        xiuyu: ["你有什么质地？", "你有什么光泽？", "你有什么保养方法？"],
        shoushan: ["你有什么品种？", "你有什么雕刻技巧？", "你有什么收藏价值？"],
        qingtian: ["你有什么产地？", "你有什么用途？", "你有什么传说故事？"],
        changhua: ["你有什么颜色？", "你有什么纹理？", "你有什么象征意义？"],
        balin: ["你有什么质地？", "你有什么光泽？", "你有什么保养方法？"]
    };
    return prompts[jadeId] || ["你是谁？", "你有什么特点？"];
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        appendMessage('user', message);
        messageInput.value = '';
        getAiResponse(message);
    }
}

async function getAiResponse(message) {
    const aiResponse = await chat_with_gpt(message);
    appendMessage('ai', aiResponse);
}

async function chat_with_gpt(message) {
    const url = BASE_URL;
    const headers = {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
    };
    const data = {
        "model": OPENAI_ENGINE_VERSION,
        "messages": [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": message
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData.choices[0].message.content;
        } else {
            return `Error: ${response.status}, ${await response.text()}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent newline in textarea
        sendMessage();
    }
}