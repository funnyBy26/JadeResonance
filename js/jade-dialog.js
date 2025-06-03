let systemPrompt = ""
document.addEventListener('DOMContentLoaded', function() {
    console.log('jade-dialog.js loaded'); // 检查 JavaScript 文件是否加载
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
    // 先尝试从 URL 获取 jadeId，如果没有则从 sessionStorage 获取
    return urlParams.get('jadeId') || sessionStorage.getItem('selectedJade') || 'hetian';
}

async function loadJadeData(jadeId) {
    showLoading();
    try {
        // Simulate loading resources
        const jade = await simulateLoad(jadeId);
        console.log("Jade data loaded:", jade); // 检查数据是否加载

        // 添加路径前缀
        const pathPrefix = 'https://jade-resonance.oss-cn-shanghai.aliyuncs.com/';

        // Set jade data
        const jadeImage = document.getElementById('jade-image');
        if (jadeImage) {
            jadeImage.src = pathPrefix + jade.imageSrc;
            jadeImage.onload = () => {
                console.log('Image loaded successfully');
            };
            jadeImage.onerror = () => {
                console.error('Error loading image');
            };
        } else {
            console.error("Error: jade-image element not found");
        }
        const jadeAvatar = document.getElementById('jade-avatar');
        if (jadeAvatar) {
            jadeAvatar.src = pathPrefix + jade.imageSrc;
        } else {
            console.error("Error: jade-avatar element not found");
        }
        const jadeName = document.getElementById('jade-name');
        if (jadeName) {
            jadeName.textContent = jade.name;
        } else {
            console.error("Error: jade-name element not found");
        }
        const jadeCharacter = document.getElementById('jade-character');
        if (jadeCharacter) {
            jadeCharacter.textContent = jade.character;
        } else {
            console.error("Error: jade-character element not found");
        }
        const jadeCharacterDescription = document.getElementById('jade-character-description');
        if (jadeCharacterDescription) {
            jadeCharacterDescription.textContent = jade.characteristics;
        } else {
            console.error("Error: jade-character-description element not found");
        }
        systemPrompt = jade.prompt

        // Load prompt hints
        loadPromptHints(jadeId);

        getAiResponse("你好，" + jade.name + "。请介绍一下你自己。");

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
    // Create loading message
    const loadingMessageElement = appendMessage('ai', '', true);
    const messageContentElement = loadingMessageElement.querySelector('.message-content');

    try {
        let aiResponse = '';
        aiResponse = await chat_with_gpt(message, (partialResponse) => {
            messageContentElement.textContent = partialResponse; // Update message content
        });
        // Update message content
        loadingMessageElement.classList.remove('loading'); // Remove loading class
    } catch (error) {
        loadingMessageElement.querySelector('.message-content').textContent = `Error: ${error.message}`;
        loadingMessageElement.classList.remove('loading'); // Remove loading class
    }
}

async function chat_with_gpt(message, updateCallback) {
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
        ],
        "stream": true // Enable streaming
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const reader = response.body.getReader();
            let decoder = new TextDecoder();
            let aiResponse = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        const message = line.replace(/^data: /, '');
                        if (message === '[DONE]') {
                            return aiResponse;
                        }

                        try {
                            const parsed = JSON.parse(message);
                            const content = parsed.choices[0].delta.content;
                            if (content) {
                                aiResponse += content;
                                updateCallback(aiResponse); // Call the update callback
                            }
                        } catch (e) {
                            console.error("Could not JSON parse stream message", message, e);
                        }
                    }
                }
            } catch (e) {
                console.error("Stream read error", e);
            }

            return aiResponse;
        } else {
            return `Error: ${response.status}, ${await response.text()}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

function appendMessage(sender, message, isLoading = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (sender === 'ai') {
        const jadeAvatar = document.getElementById('jade-avatar');
        let avatarSrc = '';
        if (jadeAvatar) {
            avatarSrc = jadeAvatar.src;
        } else {
            console.error("Error: jade-avatar element not found");
        }

        // Create avatar element
        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        avatarElement.style.backgroundImage = `url(${avatarSrc})`;

        // Create message content element
        const messageContentElement = document.createElement('div');
        messageContentElement.classList.add('message-content');
        if (isLoading) {
            messageContentElement.textContent = '玉石的简讯正在传来...'; // Show loading indicator
            messageElement.classList.add('loading'); // Add loading class
        } else {
            messageContentElement.textContent = message;
        }

        // Append avatar and message content to message element
        messageElement.appendChild(avatarElement);
        messageElement.appendChild(messageContentElement);
    } else {
        messageElement.textContent = message;
    }
    // Append the message to the chat
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

    return messageElement; // Return the message element
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        // If Enter is pressed without Shift, send the message
        event.preventDefault(); // Prevent newline in textarea
        sendMessage();
        return false; // Prevent default behavior
    }
}