function closeAllWindows() {
    // Try to close any opener windows
    if (window.opener && !window.opener.closed) {
        window.opener.close();
    }
    
    // Close the current window
    window.close();
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
}; 