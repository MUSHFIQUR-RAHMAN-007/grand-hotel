// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const confirmationMessage = document.getElementById('contactConfirmation');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const messageData = {
            id: Date.now(), // Simple ID generation
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        // Save to localStorage
        let messages = JSON.parse(localStorage.getItem('hotelMessages') || '[]');
        messages.push(messageData);
        localStorage.setItem('hotelMessages', JSON.stringify(messages));

        // Show confirmation
        contactForm.style.display = 'none';
        confirmationMessage.style.display = 'block';

        // Reset form after 3 seconds
        setTimeout(() => {
            contactForm.style.display = 'block';
            confirmationMessage.style.display = 'none';
            contactForm.reset();
        }, 3000);
    });
});