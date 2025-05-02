// Import Flowbite Modal if needed (comment out if already imported in your main JS)
// import { Modal } from 'flowbite';

// Add at the top of the file
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let currentCustomerId = null;

// تهيئة نافذة حذف العميل باستخدام Flowbite
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تحميل Flowbite بشكل صحيح
    if (typeof Modal === 'undefined') {
        console.error('Flowbite Modal is not loaded properly');
        return;
    }

    // تهيئة نافذة الحذف
    const deleteModalElement = document.getElementById('deleteCustomerModal');
    if (deleteModalElement) {
        // إنشاء كائن Modal من Flowbite
        const deleteModal = new Modal(deleteModalElement, {
            placement: 'center',
            backdrop: 'dynamic',
            closable: true
        });
        
        // تخزين كائن Modal في نطاق عام للوصول إليه لاحقًا
        window.deleteCustomerModal = deleteModal;
        console.log('Delete customer modal initialized successfully');
    } else {
        console.error('Delete customer modal element not found in the DOM');
    }
});

function confirmDelete(id, name) {
    currentCustomerId = id;
    const customerNameElement = document.getElementById('review-name');
    
    if (customerNameElement) customerNameElement.textContent = name;
    
    // استخدام نافذة Flowbite المهيأة
    if (window.deleteCustomerModal) {
        window.deleteCustomerModal.show();
    } else {
        console.error('Delete modal not initialized properly');
    }
    
    // جلب بيانات العميل لعرضها في نافذة التأكيد
    fetch(`/get_customer_details/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('review-name').textContent = data.customer.name;
            document.getElementById('review-phone').textContent = data.customer.phone;
            document.getElementById('review-email').textContent = data.customer.email || 'غير متوفر';
            document.getElementById('review-status').textContent = data.customer.status;
            document.getElementById('review-debt').textContent = 
                data.customer.debt_amount ? `${data.customer.debt_amount} SAR` : 'لا يوجد';
        })
        .catch(error => console.error('Error fetching customer details:', error));
}

function hideDeleteModal() {
    // استخدام واجهة برمجة تطبيقات Flowbite للنوافذ المنبثقة
    if (window.deleteCustomerModal) {
        window.deleteCustomerModal.hide();
    }
}

function performDelete() {
    if (!currentCustomerId) return;

    fetch(`/delete_customer/${currentCustomerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // إضافة CSRF token للتحقق من الأمان
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            alert('فشل الحذف: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء عملية الحذف: ' + error.message);
    })
    .finally(() => {
        // إخفاء النافذة المنبثقة باستخدام واجهة برمجة تطبيقات Flowbite
        hideDeleteModal();
    });
}

// معالجة أحداث النوافذ - تحسين الكود لتجنب تكرار مستمعي الأحداث
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمع حدث واحد لجميع أزرار الحذف
    document.querySelectorAll('[data-modal-toggle="deleteCustomerModal"]').forEach(button => {
        // إزالة مستمعي الأحداث القديمة لتجنب التكرار
        button.removeEventListener('click', handleDeleteButtonClick);
        // إضافة مستمع حدث جديد
        button.addEventListener('click', handleDeleteButtonClick);
    });
    
    // دالة معالجة النقر على زر الحذف
    function handleDeleteButtonClick(event) {
        const button = event.currentTarget;
        const customerId = button.dataset.customerId;
        if (!customerId) return;
        
        // استدعاء دالة confirmDelete التي تم تحديثها لاستخدام Flowbite
        confirmDelete(customerId, 'جاري تحميل البيانات...');
    }
});


// تأكيد الحذف - تم استبداله بدالة performDelete

// ربط زر التأكيد بدالة الحذف
document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteBtn = document.getElementById('confirmCustomerDelete');
    if (confirmDeleteBtn) {
        // إزالة مستمعي الأحداث القديمة لتجنب التكرار
        confirmDeleteBtn.removeEventListener('click', performDelete);
        // إضافة مستمع حدث جديد
        confirmDeleteBtn.addEventListener('click', performDelete);
        console.log('Delete confirmation button initialized');
    } else {
        console.error('Delete confirmation button not found');
    }
    
    // إضافة مستمعي أحداث لأزرار الإلغاء
    document.querySelectorAll('[data-modal-toggle="deleteCustomerModal"]').forEach(button => {
        if (button.textContent.trim() === 'Cancel') {
            button.addEventListener('click', hideDeleteModal);
        }
    });
});