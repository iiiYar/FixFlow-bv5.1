from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from app import db
from app.Backend.devices.devices_models import Devices
import os
from werkzeug.utils import secure_filename
import uuid
from sqlalchemy.exc import IntegrityError

# إنشاء blueprint للأجهزة
devices = Blueprint('devices', __name__)

# تعريف مسار للصفحة الرئيسية
@devices.route('/devices')
def list_devices():
    # Get page number from query parameters, default to 1
    page = request.args.get('page', 1, type=int)
    per_page = 14  # Number of items per page
    
    # Get paginated devices
    pagination = Devices.query.paginate(page=page, per_page=per_page, error_out=False)
    devices = pagination.items
    total_devices = Devices.query.count()
    total_pages = (total_devices + per_page - 1) // per_page
    
    return render_template('devices.html', 
                          devices=devices,
                          page=page,
                          per_page=per_page,
                          total_devices=total_devices,
                          total_pages=total_pages,
                          min=min,  # Add min function to template context
                          max=max)  # Add max function to template context

@devices.route('/add_device', methods=['GET', 'POST'])
def add_device():
    if request.method == 'POST':
        try:
            # Extract form data
            name = request.form.get('name')
            company = request.form.get('company')
            category = request.form.get('category')
            model = request.form.get('model')
            
            # Handle file upload
            image_file = request.files.get('image')
            image_filename = 'default_device.png'
            
            if image_file and image_file.filename != '':
                # Generate a unique filename
                filename = secure_filename(f"{name}_{model}_{uuid.uuid4().hex[:8]}{os.path.splitext(image_file.filename)[1]}")
                
                # Ensure upload directory exists
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'devices')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file
                file_path = os.path.join(upload_dir, filename)
                image_file.save(file_path)
                
                # Update image filename
                image_filename = f'uploads/devices/{filename}'
            
            # Create new device
            new_device = Devices(
                name=name,
                company=company,
                category=category,
                model=model,
                image=image_filename
            )
            
            # Add to database
            db.session.add(new_device)
            db.session.commit()
            
            return jsonify({'success': True, 'message': 'تمت إضافة الجهاز بنجاح'})
        
        except IntegrityError as e:
            # Rollback database transaction
            db.session.rollback()
            
            # Log the error
            current_app.logger.error(f'خطأ في إضافة الجهاز: {str(e)}')
            return jsonify({'error': 'هذا الاسم موجود بالفعل، الرجاء اختيار اسم آخر'}), 400
            
        except Exception as e:
            # Rollback database transaction
            db.session.rollback()
            
            # Log the error
            current_app.logger.error(f'خطأ في إضافة الجهاز: {str(e)}')
            return jsonify({'error': f'خطأ في إضافة الجهاز: {str(e)}'}), 500
    
    # GET request: render the devices page
    return redirect(url_for('devices.list_devices'))

@devices.route('/edit_device/<int:device_id>', methods=['GET', 'POST'])
def edit_device(device_id):
    device = Devices.query.get_or_404(device_id)
    
    if request.method == 'POST':
        try:
            device.name = request.form.get('name')
            device.company = request.form.get('company')
            device.category = request.form.get('category')
            device.model = request.form.get('model')
            
            image_file = request.files.get('image')
            if image_file and image_file.filename != '':
                filename = secure_filename(f"{device.name}_{device.model}_{uuid.uuid4().hex[:8]}{os.path.splitext(image_file.filename)[1]}")
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'devices')
                os.makedirs(upload_dir, exist_ok=True)
                file_path = os.path.join(upload_dir, filename)
                image_file.save(file_path)
                device.image = f'uploads/devices/{filename}'
            
            db.session.commit()
            return jsonify({'success': True, 'message': 'تم تعديل الجهاز بنجاح'})
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'خطأ في تعديل الجهاز: {str(e)}')
            return jsonify({'error': f'خطأ في تعديل الجهاز: {str(e)}'}), 500
    
    return render_template('edit_device.html', device=device)

@devices.route('/delete_device/<int:device_id>', methods=['POST'])
def delete_device(device_id):
    # جلب الجهاز المراد حذفه
    device = Devices.query.get_or_404(device_id)
    
    try:
        # حذف الجهاز من قاعدة البيانات
        db.session.delete(device)
        db.session.commit()
        flash('Device deleted successfully', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting device: {str(e)}', 'danger')
    
    return redirect(url_for('devices.list_devices'))

@devices.route('/get_devices')
def get_devices():
    try:
        devices = Devices.query.all()
        devices_list = [{
            'id': device.id,
            'name': device.name,
            'company': device.company,
            'category': device.category,
            'model': device.model,
            'image': device.image or 'default_image.png'
        } for device in devices]
        return jsonify(devices_list), 200
    except Exception as e:
        current_app.logger.error(f'خطأ في جلب الأجهزة: {str(e)}')
        return jsonify({'error': 'حدث خطأ في جلب الأجهزة'}), 500