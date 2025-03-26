document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const urlInput = document.getElementById('urlInput');
    const shortenBtn = document.getElementById('shortenBtn');
    const result = document.getElementById('result');
    const shortUrl = document.getElementById('shortUrl');
    const copyBtn = document.getElementById('copyBtn');

    // Add error message display element
    const errorDisplay = document.createElement('div');
    errorDisplay.className = 'error-message';
    errorDisplay.style.display = 'none';
    errorDisplay.style.color = '#e53e3e';
    errorDisplay.style.marginTop = '1rem';
    errorDisplay.style.padding = '0.5rem';
    errorDisplay.style.borderRadius = '4px';
    errorDisplay.style.backgroundColor = '#fff5f5';
    
    // Insert error display after the URL form
    const urlForm = document.querySelector('.url-form');
    urlForm.parentNode.insertBefore(errorDisplay, urlForm.nextSibling);

    function showError(message) {
        console.error('Error:', message);
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        setTimeout(() => {
            errorDisplay.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        errorDisplay.style.color = '#48bb78';
        errorDisplay.style.backgroundColor = '#f0fff4';
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        setTimeout(() => {
            errorDisplay.style.display = 'none';
        }, 5000);
    }

    shortenBtn.addEventListener('click', async () => {
        console.log('Shorten button clicked');
        const url = urlInput.value.trim();
        console.log('URL entered:', url);
        
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            showError('Please enter a valid URL (e.g., https://www.example.com)');
            return;
        }

        try {
            console.log('Sending request to server...');
            const response = await fetch('http://localhost:3000/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            console.log('Response received:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                const fullShortUrl = `http://localhost:3000/${data.shortUrl}`;
                shortUrl.value = fullShortUrl;
                result.classList.add('show');
                errorDisplay.style.display = 'none';
                showSuccess('URL shortened successfully!');
                console.log('URL shortened successfully:', fullShortUrl);
            } else {
                showError(data.error || data.details || 'Error shortening URL');
            }
        } catch (error) {
            console.error('Network error:', error);
            showError('Network error. Please check your connection and try again.');
        }
    });

    copyBtn.addEventListener('click', () => {
        console.log('Copy button clicked');
        shortUrl.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}); 