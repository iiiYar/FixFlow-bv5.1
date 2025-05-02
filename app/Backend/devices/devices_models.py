from app import db
from sqlalchemy import UniqueConstraint, CheckConstraint

class Devices(db.Model):
    # هذا النموذج سينشأ جدول "device" (أو "devices" حسب إعدادات قاعدة البيانات) في قاعدة fixflow.db
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(200), nullable=True)

    # إضافة قيود للتحقق من صحة البيانات
    __table_args__ = (
        # منع تكرار اسم الجهاز
        UniqueConstraint('name', name='unique_device_name'),
        # التحقق من طول اسم الجهاز (3-100 حرف)
        CheckConstraint('LENGTH(name) >= 3', name='check_name_min_length'),
    )

    def __repr__(self):
        return f'<Device {self.name}>'