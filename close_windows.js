// Keep track of opened windows
let openedWindows = [];

// Function to register new window
function registerWindow(win) {
    if (win && !openedWindows.includes(win)) {
        openedWindows.push(win);
    }
}

// Register the current window when the script loads
if (window.opener) {
    registerWindow(window.opener);
}
registerWindow(window);

function closeAllWindows() {
    // 检测是否为移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // 尝试关闭所有已注册的窗口
    for (let win of openedWindows) {
        try {
            if (win && !win.closed) {
                win.close();
            }
        } catch (e) {
            console.log('Error closing window:', e);
        }
    }

    // 针对当前窗口的关闭尝试
    try {
        // 标准关闭方法
        window.close();
        
        // 如果有历史记录，尝试返回
        if (window.history.length > 1) {
            window.history.go(-1);
            return;
        }

        // 尝试重定向到空白页面
        window.location.href = 'about:blank';
        
        // 强制重载到空白状态
        setTimeout(() => {
            window.location.replace('about:blank');
        }, 100);
        
    } catch (e) {
        console.log('Error during close attempts:', e);
    }
    
    // 显示设备特定的提示信息
    setTimeout(() => {
        if (document.body) {
            if (isMobile) {
                document.body.innerHTML = `
                    <div style="text-align: center; padding: 20px; font-size: 18px;">
                        <p>请使用以下方法之一关闭页面：</p>
                        <p>1. 点击浏览器左上角的返回按钮 ←</p>
                        <p>2. 点击浏览器的标签页按钮，然后关闭当前标签</p>
                        <p>3. 使用系统返回手势</p>
                    </div>`;
            } else {
                document.body.innerHTML = '<div style="text-align: center; padding: 20px;"><p>请关闭此标签页</p></div>';
            }
        }
    }, 200);
}

// Add return button to the page
function addReturnButton() {
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
    button.style.fontSize = '16px'; // 增大字体使在手机上更容易点击
    button.style.minWidth = '120px'; // 确保按钮足够大，便于在手机上点击
    
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
