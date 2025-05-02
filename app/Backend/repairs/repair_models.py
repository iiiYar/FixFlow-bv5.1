from datetime import datetime
from app import db
from enum import Enum
from app.Backend.customers.model_customers import Customer

class RepairStatus(Enum):
    IN_PROGRESS = "In Progress"
    PENDING = "Pending"
    COMPLETED = "Completed"

class DeviceType(Enum):
    SMARTPHONE = "smartphone"
    TABLET = "tablet"
    LAPTOP = "laptop"
    DESKTOP = "desktop"
    OTHER = "other"

class IssueType(Enum):
    SCREEN_REPLACEMENT = "screen_replacement"
    BATTERY_REPAIR = "battery_repair"
    SOFTWARE_ISSUE = "software_issue"
    WATER_DAMAGE = "water_damage"
    CHARGING_PORT = "charging_port"
    OTHER = "other"

class RepairRequest(db.Model):
    __tablename__ = 'repair_requests'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Device Information (Relationship with Devices table)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)
    device = db.relationship('Devices', backref=db.backref('repair_requests', lazy=True))
    device_category = db.Column(db.String(100))  # Will be populated from device relationship
    
    # Customer Information (Relationship with Customer table)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    customer = db.relationship('Customer', backref=db.backref('repair_requests', lazy=True))
    customer_mobile = db.Column(db.String(20))  # Will be populated from customer relationship
    
    # Repair Details
    issue_type = db.Column(db.Enum(IssueType), nullable=False)
    repair_price = db.Column(db.Numeric(10, 2), nullable=False)  # Price in SAR with 2 decimal places
    notes = db.Column(db.Text, nullable=True)  # Optional repair notes
    status = db.Column(db.Enum(RepairStatus), default=RepairStatus.PENDING)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.customer:
            self.customer_mobile = self.customer.mobile
            self.customer.visits += 1
            self.customer.last_visit = datetime.utcnow()

    def __repr__(self):
        return f'<RepairRequest {self.id} - {self.customer_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_mobile': self.customer_mobile,
            'device_type': self.device_type.value,
            'device_name': self.device_name,
            'issue_type': self.issue_type.value,
            'status': self.status.value,
            'estimated_price': self.estimated_price,
            'final_price': self.final_price,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }