async function generateImage() {
    const inputText = document.querySelector('.input-area').value;
    if (!inputText.trim()) {
        alert('请输入设计创意描述');
        return;
    }

    // 通过接口将输入的文字传递到后端
    try {
        const textResponse = await fetch('/api/save-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: inputText })
        });
        if (!textResponse.ok) {
            throw new Error('文字保存接口请求失败');
        }
    } catch (err) {
        alert('文字保存失败，请稍后重试');
        return;
    }

    // 显示加载状态
    document.getElementById('loading-container').style.display = 'flex';

    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: inputText })
        });

        if (!response.ok) {
            throw new Error('图片生成API请求失败');
        }

        const data = await response.json();
        // 假设API返回格式为 { imageUrl: 'xxx' }
        const imageUrl = data.imageUrl;
        if (!imageUrl) {
            throw new Error('API未返回图片地址');
        }

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
