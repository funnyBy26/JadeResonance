// 博物馆页面交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 为时间轴项目添加渐入动画
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);

        // 为整个timeline-item添加点击事件
        item.addEventListener('click', () => {
            const content = item.querySelector('.timeline-content');
            content.style.transform = 'scale(1.05)';
            setTimeout(() => {
                content.style.transform = 'scale(1)';
            }, 200);

            // 获取朝代ID并跳转
            const dynastyId = item.dataset.id;
            window.location.href = `dynasty.html?id=${dynastyId}`;
        });

        // 添加鼠标样式
        item.style.cursor = 'pointer';
    });
}); 