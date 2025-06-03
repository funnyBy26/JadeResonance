 // 朝代陈列室页面逻辑
document.addEventListener('DOMContentLoaded', async () => {
    // 获取URL参数中的朝代ID
    const urlParams = new URLSearchParams(window.location.search);
    const dynastyId = urlParams.get('id');

    if (!dynastyId) {
        window.location.href = 'museum.html';
        return;
    }

    try {
        // 获取博物馆数据
        const response = await fetch('../../assets/museum.json');
        const data = await response.json();
        
        // 查找对应的朝代数据
        const dynasty = data.dynasties.find(d => d.id === parseInt(dynastyId));
        
        if (!dynasty) {
            throw new Error('朝代不存在');
        }

        // 更新页面标题
        document.title = `${dynasty.name} - 玉石博物馆`;
        
        // 更新页面内容
        document.getElementById('dynasty-title').textContent = dynasty.name;
        document.getElementById('dynasty-period').textContent = dynasty.period;
        document.getElementById('dynasty-intro-text').textContent = dynasty.intro;

        // 生成文物卡片
        const artifactsContainer = document.getElementById('artifacts-container');
        dynasty.artifacts.forEach(artifact => {
            const card = createArtifactCard(artifact);
            artifactsContainer.appendChild(card);
        });

        // 添加渐入动画
        const cards = document.querySelectorAll('.artifact-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

    } catch (error) {
        console.error('加载数据失败:', error);
        alert('加载数据失败，请稍后重试');
    }
});

// 创建文物卡片
function createArtifactCard(artifact) {
    const card = document.createElement('div');
    card.className = 'artifact-card';
    card.innerHTML = `
        <img src="https://jade-resonance.oss-cn-shanghai.aliyuncs.com/assets/jades/${artifact.image}" alt="${artifact.name}" class="artifact-image">
        <div class="artifact-info">
            <h3>${artifact.name}</h3>
            <div class="artifact-details">
                <p><strong>材质：</strong>${artifact.material}</p>
                <p><strong>年代：</strong>${artifact.date}</p>
                <p><strong>尺寸：</strong>${artifact.dimension}</p>
                <p><strong>出土地：</strong>${artifact.origin}</p>
                <p><strong>收藏地：</strong>${artifact.collection}</p>
                <p><strong>特征：</strong>${artifact.features}</p>
                <p><strong>工艺：</strong>${artifact.craft}</p>
                <p><strong>意义：</strong>${artifact.significance}</p>
            </div>
        </div>
    `;
    return card;
}