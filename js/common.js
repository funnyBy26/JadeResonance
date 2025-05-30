/**
 * 公共功能JavaScript文件
 */

// 页面加载后执行的函数
function onDocumentReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
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

// 页面跳转函数
function navigateTo(url) {
    window.location.href = url;
}
