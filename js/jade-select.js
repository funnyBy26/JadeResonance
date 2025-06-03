/**
 * 玉石选择页面JavaScript
 */

const PATH_PREFIX = 'https://jade-resonance.oss-cn-shanghai.aliyuncs.com/';
// 页面标题文本
const titleText = "欢迎选择你想要对话的玉石，开始神奇的旅程";

// 轮播配置
const carouselConfig = {
    currentSlide: 0,
    totalSlides: 2,
    autoSlideInterval: 8000, // 自动轮播间隔，8秒
    autoSlideTimer: null,
    categories: ["四大名玉", "四大名石"],
    isTransitioning: false // 添加过渡状态标记
};

let jadeData = {}; // Store jade data here

// 当文档加载完成后执行初始化
onDocumentReady(() => {
    loadJadeData().then(() => {
        preloadImages(); // Preload images after loading jade data
        initJadeSelectPage();
    });
});

// Load jade data from JSON file
async function loadJadeData() {
    try {
        const response = await fetch('../../assets/jadeData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        jadeData = await response.json();
    } catch (error) {
        console.error("Error loading jade data:", error);
    }
}

// Preload images
function preloadImages() {
    for (const key in jadeData) {
        if (jadeData.hasOwnProperty(key)) {
            const jade = jadeData[key];
            const defaultImage = new Image();
            defaultImage.src = PATH_PREFIX + jade.defaultImageSrc;
            const hoverImage = new Image();
            hoverImage.src = PATH_PREFIX + jade.imageSrc;
        }
    }
}

// 初始化玉石选择页面
function initJadeSelectPage() {
    // 获取标题元素
    const typingTitle = document.getElementById("typing-title");
    const titleContainer = document.getElementById("titleContainer");

    // 确保标题初始状态为居中
    titleContainer.classList.add('centered');

    // 开始标题动画
    setTimeout(() => {
        typingTitle.style.opacity = "1";
        typeWriterWithCursor(typingTitle, titleText, 100, () => {
            // 打字完成后，延迟一段时间再开始平移
            setTimeout(moveTitleToTop, 1200);
        });
    }, 800);

    // 初始化轮播导航
    initCarouselNavigation();

    // 更新导航提示
    updateNavigationHints();

    // 为所有玉石卡片添加点击事件
    setupCardClickEvents();

    // Populate jade card images and names
    populateJadeCards();
}

// Populate jade card images and names
function populateJadeCards() {
    const cards = document.querySelectorAll('.jade-card');

    cards.forEach(card => {
        const jadeType = card.dataset.jade;
        const jade = jadeData[jadeType];

        if (jade) {
            const defaultImage = card.querySelector('.jade-image.default');
            const hoverImage = card.querySelector('.jade-image.hover');
            const jadeName = card.querySelector('.jade-name');

            // 使用路径前缀
            defaultImage.src = PATH_PREFIX + jade.defaultImageSrc;
            hoverImage.src = PATH_PREFIX + jade.imageSrc;
            jadeName.textContent = jade.name;
        }
    });
}


// 带光标的打字机效果
function typeWriterWithCursor(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = '<span></span><span class="cursor">_</span>';
    const textElement = element.querySelector('span:first-child');
    const cursorElement = element.querySelector('.cursor');

    function type() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // 打字效果完成后，开始闪烁光标
            cursorElement.classList.add('blink');

            // 如果有回调函数，执行
            if (callback) {
                callback();
            }
        }
    }

    type();
}

// 将标题平移到顶部
function moveTitleToTop() {
    const titleContainer = document.getElementById("titleContainer");

    // 移除居中类并添加顶部对齐类
    titleContainer.classList.remove('centered');
    titleContainer.classList.add('top-aligned');

    // 等待标题平移完成后，显示轮播内容
    setTimeout(showCarouselContent, 1300);
}

// 显示轮播内容
function showCarouselContent() {
    const carouselContainer = document.getElementById('carouselContainer');

    // 显示轮播容器
    carouselContainer.style.visibility = 'visible';
    carouselContainer.style.opacity = '1';

    // 轮播容器显示后开始卡片动画
    setTimeout(() => {
        // 开始显示第一屏的卡片
        animateCardsInCurrentSlide();

        // 启动自动轮播
        startAutoSlide();
    }, 600); // 给轮播容器淡入效果留出时间
}

// 初始化轮播导航
function initCarouselNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');

    // 上一张按钮
    prevBtn.addEventListener('click', () => {
        if (!carouselConfig.isTransitioning) {
            navigateSlide(-1);
            resetAutoSlideTimer();
        }
    });

    // 下一张按钮
    nextBtn.addEventListener('click', () => {
        if (!carouselConfig.isTransitioning) {
            navigateSlide(1);
            resetAutoSlideTimer();
        }
    });

    // 指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (!carouselConfig.isTransitioning && index !== carouselConfig.currentSlide) {
                goToSlide(index);
                resetAutoSlideTimer();
            }
        });
    });
}

// 导航到上一张/下一张
function navigateSlide(direction) {
    if (carouselConfig.isTransitioning) return;

    let newIndex = carouselConfig.currentSlide + direction;

    if (newIndex < 0) {
        newIndex = carouselConfig.totalSlides - 1;
    } else if (newIndex >= carouselConfig.totalSlides) {
        newIndex = 0;
    }

    goToSlide(newIndex);
}

// 跳转到指定幻灯片
function goToSlide(index) {
    if (carouselConfig.isTransitioning || index === carouselConfig.currentSlide) return;

    // 设置过渡状态为true
    carouselConfig.isTransitioning = true;

    // 获取当前和目标幻灯片
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');

    // 移除当前活动状态
    slides[carouselConfig.currentSlide].classList.remove('active');
    indicators[carouselConfig.currentSlide].classList.remove('active');

    // 设置新的当前幻灯片
    const previousSlide = carouselConfig.currentSlide;
    carouselConfig.currentSlide = index;

    // 添加活动状态到新幻灯片
    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    // 更新导航提示
    updateNavigationHints();

    // 如果是新一页的卡片，触发动画
    animateCardsInCurrentSlide();

    // 设置一个延迟，等待过渡完成后再将过渡状态设为false
    setTimeout(() => {
        carouselConfig.isTransitioning = false;
    }, 1000); // 与CSS过渡时间匹配
}

// 更新导航提示文字
function updateNavigationHints() {
    const prevHint = document.getElementById('prevHint');
    const nextHint = document.getElementById('nextHint');

    const prevIndex = (carouselConfig.currentSlide - 1 + carouselConfig.totalSlides) % carouselConfig.totalSlides;
    const nextIndex = (carouselConfig.currentSlide + 1) % carouselConfig.totalSlides;

    prevHint.textContent = `查看${carouselConfig.categories[prevIndex]}`;
    nextHint.textContent = `查看${carouselConfig.categories[nextIndex]}`;
}

// 自动轮播
function startAutoSlide() {
    // 清除可能存在的旧定时器
    if (carouselConfig.autoSlideTimer) {
        clearInterval(carouselConfig.autoSlideTimer);
    }

    carouselConfig.autoSlideTimer = setInterval(() => {
        if (!carouselConfig.isTransitioning) {
            navigateSlide(1);
        }
    }, carouselConfig.autoSlideInterval);
}

// 重置自动轮播计时器
function resetAutoSlideTimer() {
    clearInterval(carouselConfig.autoSlideTimer);
    startAutoSlide();
}

// 为当前幻灯片中的卡片添加动画
function animateCardsInCurrentSlide() {
    const activeSlide = document.querySelector('.carousel-item.active');
    if (!activeSlide) return;

    const cards = activeSlide.querySelectorAll('.jade-card');

    cards.forEach((card, index) => {
        // 重置卡片样式，以便再次触发动画
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        // 延迟添加动画
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 200 * index); // 每张卡片间隔200ms出现
    });
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
    // 将选择的玉石类型存储到 sessionStorage
    sessionStorage.setItem('selectedJade', jadeType);

    // 跳转到对话页面，并在 URL 中添加 jadeId 参数
    window.location.href = `../jade-dialog/index.html?jadeId=${jadeType}`;
}
