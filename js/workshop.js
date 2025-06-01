let OPENAI_ENGINE_VERSION;
let OPENAI_API_KEY;
let BASE_URL;
let SYSTEM_PROMPT;
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAPIConfig();
    } catch (error) {
        console.error("初始化失败:", error);
        alert("无法加载API配置，请刷新页面或检查网络");
    }
});

async function generateImage() {
    const inputText = document.querySelector('.input-area').value;
    if (!inputText.trim()) {
        alert('请输入设计创意描述');
        return;
    }

    // // 保存文本到后端
    // try {
    //     const textResponse = await fetch('/api/save-text', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ text: inputText })
    //     });
    //     if (!textResponse.ok) throw new Error('文字保存失败');
    // } catch (err) {
    //     alert('文字保存失败，请稍后重试');
    //     return;
    // }

    // 显示加载状态
    document.getElementById('loading-container').style.display = 'flex';

    try {
        const imageUrl = await getAPIImage(inputText);

        // 创建新的图片卡片
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.innerHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="生成的设计图">
            </div>
            <div class="image-actions">
                <button class="save-btn" onclick="saveImage('${imageUrl}')">保存图片</button>
            </div>
        `;

        // 使用 prepend（insertBefore）
        const gallery = document.getElementById('imageGallery');
        gallery.insertBefore(imageCard, gallery.firstChild);

        // 自动滚动到新添加的图片
        imageCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } catch (error) {
        console.error('生成图片时出错:', error);
        alert('生成图片时出现错误，请稍后重试');
    } finally {
        // 隐藏加载状态
        document.getElementById('loading-container').style.display = 'none';
    }
}

async function loadAPIConfig() {
    try {
        const response = await fetch('../../assets/APIData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiConfig = await response.json();

        OPENAI_ENGINE_VERSION = apiConfig.OPENAI_IMAGE_ENGINE_VERSION;
        OPENAI_API_KEY = apiConfig.OPENAI_IMAGE_API_KEY;
        BASE_URL = apiConfig.BASE_IMAGE_URL;
        SYSTEM_PROMPT = apiConfig.SYSTEM_IMAGE_PROMPT;

        console.log("API configuration loaded successfully");
    } catch (error) {
        console.error("Error loading API config:", error);
        throw error;
    }
}

async function getAPIImage(prompt) {
    const url = BASE_URL; 
    const headers = {
        "Authorization": `Bearer ${OPENAI_API_KEY}`, 
        "Content-Type": "application/json"
    };
    const data = {
        model: OPENAI_ENGINE_VERSION,     
        prompt: SYSTEM_PROMPT+prompt,      
        n: 4,                   
        size: "1024x1024",        
        response_format: "url"  
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        
        if (result?.data?.[0]?.url) {
            return result.data[0].url; 
        } else {
            throw new Error("API 返回的数据格式不符合预期");
        }
    } catch (error) {
        console.error("生成图片时出错:", error);
        throw error; 
    }
}

async function saveImage(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `设计图_${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('保存图片时出错:', error);
        alert('保存图片时出现错误，请稍后重试');
    }
}
