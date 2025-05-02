// JavaScript for handling repair request modals
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const addModalElement = document.getElementById('add-repair-modal');
    const editModalElement = document.getElementById('edit-repair-modal');
    const deleteModalElement = document.getElementById('deleteModal');
    
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
    
    // Initialize delete modal
    const deleteModalInstance = new Modal(deleteModalElement, {
        backdrop: 'static'
    });
    
    // Store modal instances in window for access from other functions
    window.addRepairModal = addModalInstance;
    window.editRepairModal = editModalInstance;
    window.deleteRepairModal = deleteModalInstance;
    
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
            if (!deleteModalElement.classList.contains('hidden')) {
                deleteModalInstance.hide();
            }
        }
    });
    
    // Add event listeners for delete modal
    document.querySelectorAll('[data-modal-toggle="deleteModal"]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            deleteModalInstance.hide();
        });
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
                showToast('Repair request added successfully');
                setTimeout(() => window.location.reload(), 1000); // Delay reload to show toast
            })
            .catch(error => {
                console.error('Error during form submission:', error);
                addModalInstance.hide();
                showToast('Error adding repair request', false);
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
                    showToast(data.message || 'Repair request updated successfully');
                    setTimeout(() => window.location.reload(), 1000); // Delay reload to show toast
                }
            })
            .catch(error => {
                console.error('Error during form submission:', error);
                editModalInstance.hide();
                showToast('Error updating repair request', false);
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

// Function to delete repair request
function deleteRepair(repairId) {
    const deleteModal = document.getElementById('deleteModal');
    const modalInstance = window.deleteRepairModal;
    
    // Fetch repair details before showing the modal
    fetch(`/get_repair_details/${repairId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate the review section with repair details
                document.getElementById('review-customer').textContent = data.repair.customer_name;
                document.getElementById('review-device').textContent = `${data.repair.device_name} (${data.repair.device_category})`;
                document.getElementById('review-issue').textContent = data.repair.issue_type;
                document.getElementById('review-price').textContent = `${data.repair.repair_price} SAR`;
                document.getElementById('review-status').textContent = data.repair.status;
                
                // Show the modal after populating the data
                modalInstance.show();
            } else {
                console.error('Error fetching repair details:', data.message);
                showToast('Error fetching repair details', false);
            }
        })
        .catch(error => {
            console.error('Error fetching repair details:', error);
            showToast('Error fetching repair details', false);
        });

    const confirmBtn = deleteModal.querySelector('#confirmDeleteBtn');

    const handleDelete = () => {
        fetch(`/delete_repair/${repairId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const row = document.querySelector(`tr[data-repair-id="${repairId}"]`);
                if (row) {
                    row.remove();
                    console.log(`Row with repairId ${repairId} removed successfully`);
                } else {
                    console.error(`Row with repairId ${repairId} not found`);
                }
                modalInstance.hide();
                showToast(data.message || 'Repair request deleted successfully');
            } else {
                console.error('Delete operation failed:', data.message);
                modalInstance.hide();
                showToast('Error deleting repair request', false);
            }
        })
        .catch(error => {
            console.error('Error during delete:', error);
            modalInstance.hide();
            showToast('Error deleting repair request', false);
        })
        .finally(() => {
            confirmBtn.removeEventListener('click', handleDelete);
        });
    };

    confirmBtn.addEventListener('click', handleDelete);

    const cancelBtns = deleteModal.querySelectorAll('[data-modal-toggle="deleteModal"]');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalInstance.hide();
            confirmBtn.removeEventListener('click', handleDelete);
        });
    });
}

// Helper function to show toast notifications
function showToast(message, isSuccess = true) {
    // Ensure toast container exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        // تعديل الموقع إلى يمين أسفل
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-4';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transform transition-all duration-300 ease-in-out`;
    toast.innerHTML = `
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${isSuccess ? 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200' : 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'} rounded-lg">
            ${isSuccess ? 
                '<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>' : 
                '<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>'}
        </div>
        <div class="ms-3 text-sm font-normal">${message}</div>
        <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    `;

    // Add animation classes
    toast.classList.add('animate-fadeIn');
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto hide after 7 seconds
    setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => {
            toast.remove();
        }, 300); // مدة الاختفاء بعد الـ Fade Out
    }, 7000); // تغيير المدة إلى 7 ثوانٍ
    
    // Add click event to close button
    const closeButton = toast.querySelector('[data-dismiss-target]');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            toast.classList.add('animate-fadeOut');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
}