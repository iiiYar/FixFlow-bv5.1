// وظيفة لتصفية العملاء بناءً على المعايير المحددة
function filterCustomers() {
    const table = document.querySelector('table tbody');
    const rows = table.getElementsByTagName('tr');

    // الحصول على قيم التصفية المحددة
    const visitsFilter = document.querySelector('input[name="visits-filter"]:checked')?.value;
    const statusFilter = document.getElementById('status-suspended').checked;
    const debtFilter = document.querySelector('input[name="debt-filter"]:checked')?.value;
    const dateFilter = document.querySelector('input[name="date-filter"]:checked')?.value;

    // تحويل الصفوف إلى مصفوفة للفرز
    const rowsArray = Array.from(rows);

    rowsArray.forEach(row => {
        let showRow = true;

        // تصفية حسب عدد الزيارات
        if (visitsFilter === 'low') {
            const visits = parseInt(row.querySelector('td:nth-child(4)').textContent.match(/\d+/)[0]);
            showRow = showRow && visits < 5;
        }

        // تصفية حسب الحالة
        if (statusFilter) {
            const status = row.querySelector('td:nth-child(7) button').textContent.trim();
            showRow = showRow && status === 'SUSPENDED';
        }

        // تصفية حسب الديون
        if (debtFilter === 'has-debt') {
            const debt = parseFloat(row.querySelector('td:nth-child(10)').textContent.trim());
            showRow = showRow && debt > 0;
        }

        // تصفية حسب تاريخ الانضمام
        if (dateFilter) {
            // سيتم تنفيذ الفرز حسب التاريخ لاحقاً
        }

        // إظهار أو إخفاء الصف
        row.style.display = showRow ? '' : 'none';
    });

    // فرز حسب التاريخ إذا تم تحديده
    if (dateFilter) {
        rowsArray.sort((a, b) => {
            const dateA = new Date(a.querySelector('td:nth-child(8)').textContent.trim());
            const dateB = new Date(b.querySelector('td:nth-child(8)').textContent.trim());
            return dateFilter === 'newest' ? dateB - dateA : dateA - dateB;
        });

        // إعادة ترتيب الصفوف في الجدول
        rowsArray.forEach(row => table.appendChild(row));
    }
}

// إضافة مستمعي الأحداث لعناصر التصفية
document.addEventListener('DOMContentLoaded', function() {
    const filterInputs = document.querySelectorAll('#filterDropdown input');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterCustomers);
    });
});