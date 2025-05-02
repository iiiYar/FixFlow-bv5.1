// Initialize the notes modal using Flowbite
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the notes modal
    const notesModalElement = document.getElementById('notes-modal');
    if (notesModalElement && typeof Modal !== 'undefined') {
        // Initialize the modal using Flowbite's Modal constructor
        const modal = new Modal(notesModalElement, {
            placement: 'center',
            backdrop: 'dynamic',
            closable: true
        });
        console.log('Notes modal initialized successfully');
    } else {
        console.error('Could not initialize notes-modal - element not found or Modal not defined');
    }
});
// دوال JavaScript
function openNotesModal(customerId, currentNotes) {
    const notesModal = document.getElementById('notes-modal');
    const notesTextarea = document.querySelector('#notes-modal textarea');
    
    // Set customer ID
    notesModal.setAttribute('data-customer-id', customerId);
    
    // Set current notes
    notesTextarea.value = currentNotes || '';
}

function saveCustomerNotes() {
    const notesModal = document.getElementById('notes-modal');
    const customerId = notesModal.getAttribute('data-customer-id');
    const notesTextarea = document.querySelector('#notes-modal textarea');
    const newNotes = notesTextarea.value;

    console.log('Saving notes:', {
        customerId: customerId,
        notes: newNotes
    });

    if (!customerId) {
        alert('Customer ID is missing');
        return;
    }

    fetch(`/update_customer_notes/${customerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ notes: newNotes })
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        
        
        
        if (data.success) {
            const notesCell = document.getElementById(`customer-notes-${customerId}`);
            if (notesCell) {
                notesCell.textContent = newNotes;
            }
            // Close the modal
            const modalCloseButton = document.querySelector('[data-modal-hide="notes-modal"]');
            if (modalCloseButton) {
                modalCloseButton.click();
            }
        }
    })
    .catch(error => {
        console.error('Error details:', error);
        
        
    });
}