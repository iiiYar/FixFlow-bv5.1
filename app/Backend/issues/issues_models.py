from app import db
from datetime import datetime

class Issue(db.Model):
    __tablename__ = 'issues'
    __table_args__ = {'extend_existing': True, 'sqlite_autoincrement': True}
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Issue {self.title}>"
        
    repair_requests = db.relationship('RepairRequest', backref=db.backref('repair_issue', lazy=True), lazy='dynamic')