// Booking form functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const roomTypeSelect = document.getElementById('roomType');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const totalCostSpan = document.getElementById('totalCost');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const bookingIdSpan = document.getElementById('bookingId');

    // Room prices
    const roomPrices = {
        'standard': 89,
        'deluxe': 129,
        'suite': 199
    };

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;

    // Calculate total cost
    function calculateTotal() {
        const roomType = roomTypeSelect.value;
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        if (roomType && checkInInput.value && checkOutInput.value) {
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (dayDiff > 0) {
                const total = roomPrices[roomType] * dayDiff;
                totalCostSpan.textContent = total;
            } else {
                totalCostSpan.textContent = '0';
            }
        } else {
            totalCostSpan.textContent = '0';
        }
    }

    // Update checkout minimum date when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOutInput.min = checkInDate.toISOString().split('T')[0];
        calculateTotal();
    });

    // Recalculate when any field changes
    roomTypeSelect.addEventListener('change', calculateTotal);
    checkOutInput.addEventListener('change', calculateTotal);

    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            id: Date.now(), // Simple ID generation
            roomType: formData.get('roomType'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            adults: formData.get('adults'),
            children: formData.get('children'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            specialRequests: formData.get('specialRequests'),
            totalCost: totalCostSpan.textContent,
            bookingDate: new Date().toISOString()
        };

        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));

        // Save to text file
        const bookingText = `
BOOKING CONFIRMATION
====================
Booking ID: ${bookingData.id}
Date: ${new Date(bookingData.bookingDate).toLocaleDateString()}

Guest Information:
- Name: ${bookingData.firstName} ${bookingData.lastName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

Booking Details:
- Room Type: ${bookingData.roomType}
- Check-in: ${bookingData.checkIn}
- Check-out: ${bookingData.checkOut}
- Adults: ${bookingData.adults}
- Children: ${bookingData.children}
- Total Cost: $${bookingData.totalCost}

Special Requests: ${bookingData.specialRequests || 'None'}

----------------------------------------

`;

        // Download booking data as text file
        const blob = new Blob([bookingText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-${bookingData.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show confirmation
        bookingForm.style.display = 'none';
        confirmationMessage.style.display = 'block';
        bookingIdSpan.textContent = bookingData.id;
    });

    // Pre-select room type from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam && roomTypeSelect.querySelector(`option[value="${roomParam}"]`)) {
        roomTypeSelect.value = roomParam;
        calculateTotal();
    }
});