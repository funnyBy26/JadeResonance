async function generateImage() {
    const inputText = document.querySelector('.input-area').value;
    if (!inputText.trim()) {
        alert('请输入设计创意描述');
        return;
    }

    // 显示加载状态
    document.getElementById('loading-container').style.display = 'flex';

    try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 创建新的图片卡片
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.innerHTML = `
            <div class="image-container">
                <img src="../../assets/images/example-design.jpg" alt="生成的设计图">
            </div>
            <div class="image-actions">
                <button class="save-btn" onclick="saveImage('../../assets/images/example-design.jpg')">保存图片</button>
            </div>
        `;

        // 修改这里：使用 prepend 而不是 appendChild
        const gallery = document.getElementById('imageGallery');
        gallery.insertBefore(imageCard, gallery.firstChild);

        // 可选：自动滚动到新添加的图片
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