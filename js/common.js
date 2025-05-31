/**
 * 公共功能JavaScript文件
 */

// 页面加载后执行的函数
function onDocumentReady(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

// 通用动画函数 - 元素渐入
function fadeIn(element, duration = 500, delay = 0) {
    setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '1';
    }, delay);
}

// 通用动画函数 - 元素从下方渐入
function fadeInUp(element, duration = 500, delay = 0) {
    setTimeout(() => {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// 打字机效果
function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}
// 增加新函数（带光标打打字机样式）
function typeWriterWithCursor(element, text, speed = 100, callback) {
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
            cursorElement.classList.add('blink');
            if (callback) {
                setTimeout(callback, 500);
            }
        }
    }
    
    type();
}
// 页面跳转函数
function navigateTo(url) {
    window.location.href = url;
}
