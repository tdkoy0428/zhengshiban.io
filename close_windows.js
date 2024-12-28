let openedWindows = [];

// Register the current window
function registerWindow(win) {
    if (win && !openedWindows.includes(win)) {
        openedWindows.push(win);
    }
}

// Register the current window and its opener if available
if (window.opener) {
    registerWindow(window.opener);
}
registerWindow(window);

function closeAllWindows() {
    // 检测浏览器环境
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Try to close all opened windows
    for (let win of openedWindows) {
        try {
            if (win && !win.closed) {
                win.close();
            }
        } catch (e) {
            console.log('Error closing window:', e);
        }
    }

    // Define a function to check if the page is visible
    const isPageVisible = () => document.visibilityState !== 'hidden';

    // Function to try all close methods
    const tryAllCloseMethods = async () => {
        // 1. Attempt direct close
        try {
            window.close();
            window.top.close();
        } catch (e) {
            console.log('Direct close failed:', e);
        }

        // 2. Try going back in history
        if (window.history && window.history.length > 1) {
            try {
                window.history.back();
                window.history.go(-1);
            } catch (e) {
                console.log('History back failed:', e);
            }
        }

        // 3. Try changing location to force reload or blank page
        try {
            if (isPageVisible()) {
                window.location.replace('about:blank');  // Redirect to a blank page
            }
        } catch (e) {
            console.log('Location replace failed:', e);
        }

        // 4. Special handling for WeChat
        if (isWechat) {
            try {
                WeixinJSBridge.call('closeWindow');
            } catch (e) {
                console.log('WeixinJSBridge close failed:', e);
            }
        }

        // 5. Clear history using pushState
        try {
            window.history.pushState(null, '', 'about:blank');
            window.history.replaceState(null, '', 'about:blank');
        } catch (e) {
            console.log('History state change failed:', e);
        }
    };

    // Execute all close methods
    tryAllCloseMethods();

    // If page is still open after 3 seconds, show a message
    setTimeout(() => {
        if (isPageVisible()) {
            const closeMessage = document.createElement('div');
            closeMessage.style.position = 'fixed';
            closeMessage.style.top = '0';
            closeMessage.style.left = '0';
            closeMessage.style.width = '100%';
            closeMessage.style.height = '100%';
            closeMessage.style.backgroundColor = 'white';
            closeMessage.style.zIndex = '999999';
            closeMessage.style.display = 'flex';
            closeMessage.style.flexDirection = 'column';
            closeMessage.style.justifyContent = 'center';
            closeMessage.style.alignItems = 'center';
            closeMessage.style.padding = '20px';
            closeMessage.style.boxSizing = 'border-box';

            if (isMobile) {
                const browserType = isIOS ? 'iOS' : isAndroid ? 'Android' : '移动';
                closeMessage.innerHTML = `
                    <div style="text-align: center; max-width: 600px;">
                        <h2 style="color: #333; margin-bottom: 20px;">请选择以下方式关闭页面</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 10px 0;">
                            <p style="color: #007bff; margin: 15px 0; font-size: 18px;">① ${browserType}返回手势</p>
                            <p style="color: #007bff; margin: 15px 0; font-size: 18px;">② 点击浏览器的返回按钮</p>
                            <p style="color: #007bff; margin: 15px 0; font-size: 18px;">③ 关闭当前标签页</p>
                        </div>
                        <button onclick="window.history.back()" style="margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; font-size: 16px;">点击返回</button>
                    </div>`;
            } else {
                closeMessage.innerHTML = `
                    <div style="text-align: center;">
                        <h2 style="color: #333; margin-bottom: 20px;">请手动关闭此标签页</h2>
                        <p style="color: #666;">您可以按下 Ctrl+W (Windows) 或 Command+W (Mac) 关闭此标签页</p>
                    </div>`;
            }

            document.body.appendChild(closeMessage);
        }
    }, 300);
}

// Add return button to the page
function addReturnButton() {
    // 检查当前页面URL是否包含"index"，如果是则不添加按钮
    if (window.location.pathname.toLowerCase().includes('index')) {
        return;
    }
    
    // Create the button element
    var button = document.createElement('button');
    button.innerHTML = '返回问卷';
    
    // Add click event with confirmation
    button.onclick = function() {
        closeAllWindows();
    };
    
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
    button.style.fontSize = '16px';
    button.style.minWidth = '120px';
    
    // Add hover effect
    button.onmouseover = function() {
        this.style.backgroundColor = '#0056b3';
    };
    button.onmouseout = function() {
        this.style.backgroundColor = '#007bff';
    };
    
    // Add touch effect for mobile
    button.addEventListener('touchstart', function() {
        this.style.backgroundColor = '#0056b3';
    });
    button.addEventListener('touchend', function() {
        this.style.backgroundColor = '#007bff';
    });
    
    // Add the button to the page
    document.body.appendChild(button);
}

// Add the return button when the page loads
window.onload = function() {
    addReturnButton();
};
