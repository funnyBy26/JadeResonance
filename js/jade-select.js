/**
 * 玉石选择页面JavaScript
 */

// 页面标题文本
const titleText = "欢迎来到这里，选择你想要对话的玉石，开始神奇的旅程";

// 当文档加载完成后执行初始化
onDocumentReady(() => {
    initJadeSelectPage();
});

// 初始化玉石选择页面
function initJadeSelectPage() {
    // 获取标题元素
    const typingTitle = document.getElementById("typing-title");
    
    // 开始标题动画
    setTimeout(() => {
        typingTitle.style.opacity = "1";
        typeWriter(typingTitle, titleText, 100, startCardAnimation);
    }, 800);
    
    // 为所有玉石卡片添加点击事件
    setupCardClickEvents();
}

// 卡片动画
function startCardAnimation() {
    // 等待短暂延迟后开始显示卡片
    setTimeout(() => {
        const cards = document.querySelectorAll('.jade-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 200 * index); // 每张卡片间隔200ms出现
        });
    }, 500);
}

// 为卡片设置点击事件
function setupCardClickEvents() {
    const cards = document.querySelectorAll('.jade-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const jadeType = this.getAttribute('data-jade');
            navigateToDialogPage(jadeType);
        });
    });
}

// 导航到对话页面
function navigateToDialogPage(jadeType) {
    // 将选择的玉石类型存储到sessionStorage
    sessionStorage.setItem('selectedJade', jadeType);
    
    // 跳转到对话页面
    navigateTo('../jade-dialog/index.html');
}
