function isWeixinBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

function closeAllWindows() {
    if (isWeixinBrowser()) {
        // 在微信浏览器中，尝试多种方式关闭页面
        try {
            WeixinJSBridge.call('closeWindow'); // 尝试使用微信 JS Bridge 关闭
        } catch (e) {
            try {
                window.opener = null;
                window.open('', '_self');
                window.close();
            } catch (e2) {
                window.history.back(-1);
            }
        }
    } else {
        // 在其他浏览器中保持原有行为
        if (window.opener && !window.opener.closed) {
            window.opener.close();
        }
        window.close();
    }
}

// Add return button to the page
function addReturnButton() {
    // Create the button element
    var button = document.createElement('button');
    button.innerHTML = '返回问卷';
    button.onclick = closeAllWindows;
    
    // Style the button
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    
    // Add hover effect
    button.onmouseover = function() {
        this.style.backgroundColor = '#0056b3';
    };
    button.onmouseout = function() {
        this.style.backgroundColor = '#007bff';
    };
    
    // Add the button to the page
    document.body.appendChild(button);
}

// Add the return button when the page loads
window.onload = function() {
    addReturnButton();
    
    // 在微信浏览器中添加额外的关闭处理
    if (isWeixinBrowser()) {
        // 如果是微信浏览器，确保 WeixinJSBridge 准备就绪
        if (typeof WeixinJSBridge == "undefined") {
            document.addEventListener("WeixinJSBridgeReady", function() {
                // WeixinJSBridge 初始化成功
            }, false);
        }
    }
}; 
