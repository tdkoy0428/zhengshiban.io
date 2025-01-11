// 生成唯一访客ID
function generateVisitorId() {
    // 检查localStorage中是否已存在访客ID
    let storedId = localStorage.getItem('visitorId');
    if (storedId) {
        return storedId;
    }
    
    // 如果不存在，则生成新的ID并存储
    const newId = 'visitor_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', newId);
    return newId;
}

// 商品数据
const products = {
    functional: [
        {
            id: 'f1',
            name: '云购充电宝 10000mAh',
            image: 'https://via.placeholder.com/300x300?text=充电宝',
            aiReviewLink: '../0/充电宝(搜索型-AI评论).html',
            noReviewLink: '../0/充电宝(搜索型-原始评论).html'
        }
    ],
    emotional: [
        {
            id: 'e1',
            name: '云购记忆棉枕头',
            image: 'https://via.placeholder.com/300x300?text=枕头',
            aiReviewLink: '../0/枕头(体验型-AI评论).html',
            noReviewLink: '../0/枕头(体验型-原始评论).html'
        }
    ]
};

// 访客时间记录
const visitHistory = {
    currentSession: {
        startTime: new Date().toISOString(),
        visitTimes: {}
    }
};

// 添加新的全局变量来跟踪时间
const startTimes = {};
let activeProductId = null;

// 添加随机分配商品的函数
function getRandomProduct() {
    // 合并所有商品
    const allProducts = [...products.functional, ...products.emotional];
    // 随机选择一个商品
    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
    // 随机决定是否显示AI评论版本
    const showAiVersion = Math.random() < 0.5;
    
    return {
        product: randomProduct,
        version: showAiVersion ? 'ai' : 'no'
    };
}

// 修改渲染商品的函数
function renderProducts() {
    const functionalContainer = document.getElementById('functional-products');
    const emotionalContainer = document.getElementById('emotional-products');

    functionalContainer.innerHTML = '';
    emotionalContainer.innerHTML = '';

    // 获取随机分配的商品
    const { product, version } = getRandomProduct();
    
    // 创建商品卡片
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="version-links">
            <a href="${version === 'ai' ? product.aiReviewLink : product.noReviewLink}" 
               target="_blank"
               onclick="return handleLinkClick('${product.id}_${version}', '${version === 'ai' ? product.aiReviewLink : product.noReviewLink}')">
               ${version === 'ai' ? 'AI评论版本' : '无评论版本'}
            </a>
        </div>
    `;

    // 根据商品类型放入对应容器
    if (products.functional.includes(product)) {
        functionalContainer.appendChild(card);
    } else {
        emotionalContainer.appendChild(card);
    }
}

// 添加设备检测函数
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 修改关闭窗口的函数
function closeAllWindows() {
    if (isMobileDevice()) {
        // 移动端关闭处理
        try {
            // 尝试关闭当前窗口
            window.close();
            
            // 如果window.close()不起作用，尝试返回上一页
            if (!window.closed) {
                window.history.back();
            }
            
            // 如果还是不行，尝试重定向到空白页
            if (!window.closed) {
                window.location.href = "about:blank";
            }
        } catch (e) {
            console.log("Fallback to alternative closing method", e);
            // 最后的备选方案：显示提示信息
            alert("请点击浏览器的返回按钮或关闭标签页来返回问卷");
        }
    } else {
        // 保持原有的电脑端关闭逻辑
        if (window.opener && !window.opener.closed) {
            window.opener.close();
        }
        window.close();
    }
}

// 修改handleLinkClick函数
function handleLinkClick(productId, url) {
    if (!visitHistory.currentSession.visitTimes[productId]) {
        visitHistory.currentSession.visitTimes[productId] = 0;
    }

    activeProductId = productId;
    startTimes[productId] = Date.now();

    // 添加商品ID参数到URL
    const urlWithParams = url + '?productId=' + encodeURIComponent(productId);
    
    if (isMobileDevice()) {
        // 移动端直接在当前窗口打开
        window.location.href = urlWithParams;
    } else {
        // 电脑端保持原有的新窗口打开方式
        window.open(urlWithParams, '_blank');
    }
    return false;
}

// 修改复制当前商品时间的函数
function copyCurrentProductTime(productId) {
    const [baseId, version] = productId.split('_');
    const product = [...products.functional, ...products.emotional]
        .find(p => p.id === baseId);
    
    if (product) {
        // 确保当前时间被记录
        if (activeProductId && startTimes[activeProductId]) {
            const duration = (Date.now() - startTimes[activeProductId]) / 1000;
            visitHistory.currentSession.visitTimes[activeProductId] = (visitHistory.currentSession.visitTimes[activeProductId] || 0) + duration;
            delete startTimes[activeProductId];
            activeProductId = null;
        }

        const data = [];
        data.push(`访客ID: ${visitorId}`);
        data.push(`访问时间: ${new Date().toLocaleString()}`);
        data.push('');
        data.push(`商品: ${product.name}`);
        data.push(`版本: ${version === 'ai' ? 'AI评论版本' : '无评论版本'}`);
        data.push(`访问时间: ${formatTime(visitHistory.currentSession.visitTimes[productId] || 0)}`);
        
        // 使用同步的方式复制数据
        const textArea = document.createElement('textarea');
        textArea.value = data.join('\n');
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            // 关闭当前商品页面
            window.close();
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// 格式化时间
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}分${remainingSeconds}秒`;
}

// 初始化访客ID和渲染商品
const visitorId = generateVisitorId();
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    const visitorIdElement = document.getElementById('visitor-id');
    visitorIdElement.innerHTML = `
        <div class="visitor-info">
            <span>访客ID: ${visitorId}</span>
        </div>
    `;
});

// 添加移动端优化相关的函数
function initMobileOptimizations() {
    // 添加返回顶部按钮
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.style.display = 'none';
    document.body.appendChild(backToTopButton);

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // 返回顶部点击事件
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 优化图片加载
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy'; // 启用懒加载
        
        // 添加加载失败处理
        img.onerror = function() {
            this.src = 'placeholder.jpg'; // 设置默认图片
        };
    });

    // 添加触摸反馈
    document.querySelectorAll('button, .review-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// 在页面加载完成后初始化移动端优化
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations();
});

// 统一评论区布局
function unifyReviewLayout() {
  // 获取所有评论
  const reviews = document.querySelectorAll('.review');
  
  reviews.forEach(review => {
    // 创建统一的评论结构
    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'review-container';
    
    // 提取评论数据
    const avatar = review.querySelector('.a-profile-avatar img')?.src || '';
    const name = review.querySelector('.a-profile-name')?.textContent || '';
    const rating = review.querySelector('.review-rating')?.innerHTML || '';
    const title = review.querySelector('.review-title')?.textContent || '';
    const date = review.querySelector('.review-date')?.textContent || '';
    const text = review.querySelector('.review-text')?.textContent || '';
    
    // 创建统一的HTML结构
    reviewContainer.innerHTML = `
      <div class="review-header">
        <div class="review-profile">
          <div class="review-profile-avatar">
            <img src="${avatar}" alt="${name}" />
          </div>
          <div class="review-profile-info">
            <div class="review-profile-name">${name}</div>
            <div class="review-rating">${rating}</div>
          </div>
        </div>
      </div>
      <div class="review-content">
        <h3 class="review-title">${title}</h3>
        <div class="review-date">${date}</div>
        <div class="review-text">${text}</div>
      </div>
    `;
    
    // 替换原有的评论结构
    review.innerHTML = '';
    review.appendChild(reviewContainer);
  });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  unifyReviewLayout();
});
