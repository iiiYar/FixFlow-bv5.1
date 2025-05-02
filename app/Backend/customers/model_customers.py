from datetime import datetime
from enum import Enum
from sqlalchemy.schema import CheckConstraint, UniqueConstraint
from app import db

class CustomerStatus(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'
    SUSPENDED = 'SUSPENDED'

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    formatted_id = db.Column(db.String(10), unique=True)  # معرف منسق للعميل
    image = db.Column(db.String(255), nullable=True )  # صورة اختيارية مع صورة افتراضية
    name = db.Column(db.String(100), nullable=False)  # اسم العميل (إجباري)
    workplace = db.Column(db.String(100), nullable=True)  # مكان العمل (اختياري)
    phone = db.Column(db.String(20), nullable=False)  # رقم الهاتف (إجباري)
    email = db.Column(db.String(120), nullable=True)  # البريد الإلكتروني (اختياري)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum(CustomerStatus), default=CustomerStatus.ACTIVE)  # حالة العميل مع القيمة الافتراضية Active
    rating = db.Column(db.Integer, nullable=True)  # تقييم العميل اختياري
    join_date = db.Column(db.DateTime, default=datetime.utcnow)  # تاريخ انضمام العميل
    debt_amount = db.Column(db.Float, nullable=True, default=None)
    notes = db.Column(db.Text, nullable=True)  # ملاحظات اختيارية للعميل
    visits = db.Column(db.Integer, default=0)
    last_visit = db.Column(db.DateTime, nullable=True)

    # قيود للتأكد من صحة البيانات
    __table_args__ = (
        # التأكد من عدم تكرار رقم الهاتف
        UniqueConstraint('phone', name='unique_phone'),
        # قيود أخرى للتحقق من صحة البيانات
        CheckConstraint('rating IS NULL OR (rating >= 1 AND rating <= 5)', name='check_rating_range'),
        CheckConstraint('debt_amount IS NULL OR debt_amount >= 0', name='check_debt_amount')
    )
    
    def __repr__(self):
        return f'<Customer {self.name}>'

