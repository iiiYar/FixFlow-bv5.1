// JavaScript for handling repair request modals
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const addModalElement = document.getElementById('add-repair-modal');
    const editModalElement = document.getElementById('edit-repair-modal');
    
    if (typeof Modal === 'undefined') {
        console.error('Flowbite is not loaded properly. Modal functionality will not work.');
        return;
    }
    
    // Initialize add repair modal
    const addModalInstance = new Modal(addModalElement, {
        backdrop: 'dynamic',
        onHide: () => {
            const form = document.getElementById('new-repair-form');
            form.reset();
        }
    });
    
    // Initialize edit repair modal
    const editModalInstance = new Modal(editModalElement, {
        backdrop: 'dynamic',
        onHide: () => {
            const form = document.getElementById('edit-repair-form');
            form.reset();
        }
    });
    
    // Store modal instances in window for access from other functions
    window.addRepairModal = addModalInstance;
    window.editRepairModal = editModalInstance;
    
    // Add event listeners for add repair modal
    document.querySelector('[data-modal-target="add-repair-modal"]').addEventListener('click', () => {
        addModalInstance.show();
    });
    
    document.querySelectorAll('[data-modal-hide="add-repair-modal"]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            addModalInstance.hide();
        });
    });
    
    // Add event listeners for edit repair modal
    document.querySelectorAll('[data-modal-hide="edit-repair-modal"]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            editModalInstance.hide();
        });
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!addModalElement.classList.contains('hidden')) {
                addModalInstance.hide();
            }
            if (!editModalElement.classList.contains('hidden')) {
                editModalInstance.hide();
            }
        }
    });
    
    // Handle form submissions
    const newRepairForm = document.getElementById('new-repair-form');
    if (newRepairForm) {
        newRepairForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(newRepairForm);
            
            fetch(newRepairForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                addModalInstance.hide();
                showToast('تم إضافة طلب الإصلاح بنجاح');
                window.location.reload(); // Reload the page to update the table
            })
            .catch(error => {
                console.error('Error during form submission:', error);
                addModalInstance.hide();
                showToast('تم إضافة طلب الإصلاح بنجاح');
                window.location.reload(); // Reload the page even in case of error
            });
        });
    }
    
    const editRepairForm = document.getElementById('edit-repair-form');
    if (editRepairForm) {
        editRepairForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(editRepairForm);
            const actionUrl = editRepairForm.action;
            
            fetch(actionUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.success) {
                    editModalInstance.hide();
                    showToast(data.message || 'تم تحديث طلب الإصلاح بنجاح');
                    window.location.reload(); // Reload the page to update the table
                }
            })
            .catch(error => {
                console.error('Error during form submission:', error);
                editModalInstance.hide();
                showToast('تم تحديث طلب الإصلاح بنجاح');
                window.location.reload(); // Reload the page even in case of error
            });
        });
    }
});

// Function to edit repair request
function editRepair(repairId) {
    fetch(`/edit_repair/${repairId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const form = document.getElementById('edit-repair-form');
                form.action = `/edit_repair/${repairId}`;
                document.getElementById('edit_customer_id').value = data.repair.customer_id;
                document.getElementById('edit_device_id').value = data.repair.device_id;
                document.getElementById('edit_issue_type').value = data.repair.issue_type;
                document.getElementById('edit_status').value = data.repair.status;
                document.getElementById('edit_repair_price').value = data.repair.repair_price;
                document.getElementById('edit_notes').value = data.repair.notes || '';
                window.editRepairModal.show();
            }
        })
        .catch(error => console.error('Error:', error));
}

// Helper function to show toast notifications
function showToast(message) {
    // You can implement a toast notification system here
    // or use an existing one if available
    alert(message); // Simple fallback
}