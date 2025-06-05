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

    // 显示加载状态
    const loadingContainer = document.getElementById('loading-container');
    const imageDisplay = document.getElementById('image-display');
    const titleForGallery = document.getElementById('title-for-gallery');
    loadingContainer.style.display = 'flex';
    imageDisplay.style.display = 'none';
    titleForGallery.style.display = 'none';

    try {
        const imageUrl = await getAPIImage(inputText);
        
        // 更新图片显示
        const generatedImage = document.getElementById('generated-image');
        generatedImage.src = imageUrl;
        
        // 隐藏加载状态，显示生成的图片
        loadingContainer.style.display = 'none';
        titleForGallery.style.display = 'none';
        imageDisplay.style.display = 'block';

    } catch (error) {
        console.error('生成图片时出错:', error);
        alert('生成图片时出现错误，请稍后重试');
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

async function saveImage() {
    const generatedImage = document.getElementById('generated-image');
    if (!generatedImage.src) {
        alert('没有可保存的图片');
        return;
    }

    try {
        // 直接使用图片的 URL 创建下载链接
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = `玉器设计图_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('保存失败:', error);
        alert('自动保存失败，请右键点击图片选择"另存为"进行手动保存');
    }
}
