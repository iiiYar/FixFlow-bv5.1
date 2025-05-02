async function updateStatus(customerId, newStatus) {
    try {
        const response = await fetch(`/api/customers/${customerId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('فشل تحديث حالة العميل');
        }

        const data = await response.json();

        // تحديث واجهة المستخدم
        const statusButton = document.getElementById(`status-button-${customerId}`);
        const oldClasses = statusButton.className;
        let newClasses = oldClasses;
        
        // إزالة الألوان القديمة
        newClasses = newClasses.replace(/bg-(green|yellow|red)-100/g, '');
        newClasses = newClasses.replace(/text-(green|yellow|red)-800/g, '');
        newClasses = newClasses.replace(/dark:bg-(green|yellow|red)-900/g, '');
        newClasses = newClasses.replace(/dark:text-(green|yellow|red)-300/g, '');
        
        // إضافة الألوان الجديدة
        const colorMap = {
            'ACTIVE': 'green',
            'INACTIVE': 'yellow',
            'SUSPENDED': 'red'
        };
        
        const color = colorMap[newStatus];
        newClasses += ` bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;
        
        // تحديث النص والألوان
        statusButton.className = newClasses.replace(/\s+/g, ' ').trim();
        statusButton.firstChild.textContent = newStatus;
        
        // تحديث حالة القائمة المنسدلة
        const dropdownItems = document.querySelectorAll(`#status-dropdown-${customerId} a`);
        dropdownItems.forEach(item => {
            item.classList.remove('bg-gray-100', 'dark:bg-gray-600');
            if (item.textContent.trim() === newStatus) {
                item.classList.add('bg-gray-100', 'dark:bg-gray-600');
            }
        });
    } catch (error) {
        console.error('خطأ:', error);
    }
}
