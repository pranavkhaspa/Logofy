document.addEventListener('DOMContentLoaded', () => {
    const logoForm = document.getElementById('logo-form');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const logoImage = document.getElementById('logo-image');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultMessage = document.getElementById('result-message');

    const API_URL = '/generate-logo';

    logoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const businessName = document.getElementById('business_name').value;
        const style = document.getElementById('style').value;
        const colors = document.getElementById('colors').value.split(',').map(s => s.trim());
        const symbols = document.getElementById('symbols').value.split(',').map(s => s.trim());

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
        loadingSpinner.style.display = 'block';
        logoImage.style.display = 'none';
        resultMessage.textContent = 'The AI is thinking... this can take up to a minute.';

        const modelInputs = {
            business_name: businessName,
            style: style,
            colors: colors,
            symbols: symbols
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modelInputs)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            
            logoImage.src = imageUrl;
            resultMessage.textContent = 'Here is your generated logo!';

        } catch (error) {
            console.error('Error generating logo:', error);
            resultMessage.textContent = `An error occurred: ${error.message}`;
            logoImage.src = 'https://via.placeholder.com/512x512.png?text=Generation+Failed';
        } finally {
            // Restore button and hide spinner
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Logo';
            loadingSpinner.style.display = 'none';
            logoImage.style.display = 'block';
        }
    });
});
