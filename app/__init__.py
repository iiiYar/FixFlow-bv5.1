from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
import logging

# إنشاء كائن SQLAlchemy خارج دالة create_app
db = SQLAlchemy()

def create_app():
    try:
        app = Flask(__name__)
        app.config.from_object(Config)

        # تسجيل التطبيق مع SQLAlchemy
        db.init_app(app)

        # إنشاء سياق التطبيق
        with app.app_context():
            # إنشاء الجداول
            from .Backend.customers.model_customers import Customer
            from .Backend.devices.devices_models import Devices
            from .Backend.repairs.repair_models import RepairRequest
            from .Backend.issues.issues_models import Issue
            db.create_all()
            print("تم إنشاء الجداول بنجاح")

        # استيراد blueprints
        from .routes import main as main_blueprint, sales as sales_blueprint
        from .Backend.customers.customer_routes import customer_bp
        from .Backend.devices.routes_devices import devices as devices_blueprint
        from .Backend.repairs.routes_repair import repair as repair_blueprint
        from .Backend.issues.routes_issues import issue_bp

        # تسجيل blueprints
        app.register_blueprint(main_blueprint)
        app.register_blueprint(sales_blueprint, url_prefix='/')
        app.register_blueprint(devices_blueprint, url_prefix='/')
        app.register_blueprint(repair_blueprint, url_prefix='/')
        app.register_blueprint(customer_bp, url_prefix='/')
        app.register_blueprint(issue_bp, url_prefix='/')  # تسجيل blueprint المشكلات

        # تكوين التسجيل
        logging.basicConfig(level=logging.DEBUG)
        app.logger.setLevel(logging.DEBUG)
        
        return app
    except Exception as e:
        logging.error(f"خطأ في إنشاء التطبيق: {e}", exc_info=True)
        raise