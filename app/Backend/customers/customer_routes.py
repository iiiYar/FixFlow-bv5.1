from flask import Blueprint, render_template, request, current_app, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from app.Backend.customers.model_customers import Customer, CustomerStatus
from app import db

# تعريف البلوبرنت باسم main
customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/customers')  # Changed from @main.route
def customers():
    all_customers = Customer.query.all()
    return render_template('customers.html', customers=all_customers)

@customer_bp.route('/add_customer', methods=['POST'])
def add_customer():
    try:
        # طباعة البيانات الواردة للتتبع
        print("بيانات الطلب الواردة:", request.form)
        
        # التحقق من وجود البيانات المطلوبة
        required_fields = ['name', 'phone']
        for field in required_fields:
            if not request.form.get(field):
                print(f"حقل {field} مفقود")
                return {
                    'success': False,
                    'message': f'حقل {field} مطلوب'
                }, 400

        # التحقق من وجود عميل بنفس رقم الهاتف
        existing_customer = Customer.query.filter_by(phone=request.form.get('phone').strip()).first()
        if existing_customer:
            return {
                'success': False,
                'message': 'رقم الهاتف مستخدم بالفعل'
            }, 400

        # الحصول على البيانات من النموذج
        name = request.form.get('name').strip()
        workplace = request.form.get('workplace', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone').strip()
        status = request.form.get('status', CustomerStatus.ACTIVE.value)
        rating_str = request.form.get('rating')
        rating = int(rating_str) if rating_str and rating_str.strip() else None
        
        # استخدام التاريخ الحالي إذا لم يتم توفير join_date
        join_date_str = request.form.get('join_date')
        if join_date_str:
            try:
                join_date = datetime.strptime(join_date_str, '%d-%m-%Y')
            except ValueError:
                return {
                    'success': False,
                    'message': 'صيغة التاريخ غير صحيحة. يجب أن تكون بالصيغة dd-mm-yyyy'
                }, 400
        else:
            join_date = datetime.now()
            
        # معالجة قيمة الدين
        debt_amount_str = request.form.get('debt_amount', '0').strip()
        try:
            debt_amount = float(debt_amount_str) if debt_amount_str else 0.0
            print(f"قيمة الدين المعالجة: {debt_amount}")
        except ValueError:
            print(f"قيمة الدين غير صالحة: {debt_amount_str}")
            return {
                'success': False,
                'message': 'قيمة الدين يجب أن تكون رقمية'
            }, 400
            
        notes = request.form.get('notes', '').strip()
        
        # التحقق من وجود مجلد التحميلات وإنشائه إذا لم يكن موجودًا
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'customers')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # التعامل مع صورة العميل - التحقف من النوع والحجم
        image = request.files.get('customer-image')
        if image and image.filename:
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
            if '.' not in image.filename or image.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                return {
                    'success': False,
                    'message': 'نوع الملف غير مدعوم. يرجى تحميل صورة بصيغة PNG, JPG, JPEG أو GIF'
                }, 400
            if image.content_length > 5 * 1024 * 1024:  # 5MB حد أقصى
                return {
                    'success': False,
                    'message': 'حجم الملف كبير جدًا. الحد الأقصى هو 5MB'
                }, 400
        image_filename = None
        if image and image.filename:
            try:
                filename = secure_filename(image.filename)
                image_path = os.path.join(upload_folder, filename)
                image.save(image_path)
                image_filename = filename
            except Exception as e:
                return {
                    'success': False,
                    'message': f'حدث خطأ أثناء حفظ الصورة: {str(e)}'
                }, 500

        # التحقق من صحة البيانات قبل إنشاء العميل
        if len(phone) < 10:
            return {
                'success': False,
                'message': 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'
            }, 400

        # إنشاء عميل جديد مع تعيين formatted_id
        last_customer = Customer.query.order_by(Customer.id.desc()).first()
        last_id = last_customer.id if last_customer else 0
        formatted_id = f"#{last_id + 1:04d}"

        try:
            new_customer = Customer(
                formatted_id=formatted_id,
                name=name,
                workplace=workplace,
                email=email,
                phone=phone,
                status=status,
                rating=rating,
                join_date=join_date,
                debt_amount=debt_amount,
                notes=notes,
                image=image_filename or 'default_profile.png'
            )
        except ValueError as e:
            return {
                'success': False,
                'message': f'خطأ في البيانات المدخلة: {str(e)}'
            }, 400

        # إضافة العميل إلى قاعدة البيانات
        db.session.add(new_customer)
        db.session.commit()
        
        return {
            'success': True,
            'message': 'تمت إضافة العميل بنجاح'
        }
    except Exception as e:
        db.session.rollback()
        # تسجيل الخطأ مع التفاصيل الكاملة
        current_app.logger.error(f'خطأ في إضافة العميل: {str(e)}', exc_info=True)
        # طباعة البيانات المستلمة للتتبع
        current_app.logger.error(f'البيانات المستلمة: {request.form}')
        return {
            'success': False,
            'message': f'حدث خطأ أثناء إضافة العميل: {str(e)}'
        }, 500


@customer_bp.route('/update_customer_notes/<int:customer_id>', methods=['POST'])
def update_customer_notes(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        data = request.get_json()
        
        # تحديث الملاحظات
        customer.notes = data.get('notes', '')
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم حفظ الملاحظات بنجاح'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'خطأ في تحديث ملاحظات العميل: {str(e)}')
        
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء حفظ الملاحظات'
        }), 500


@customer_bp.route('/api/customers/<int:customer_id>/status', methods=['PUT'])
def update_customer_status(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status or new_status not in [status.value for status in CustomerStatus]:
            return jsonify({
                'success': False,
                'message': 'حالة غير صالحة'
            }), 400
            
        customer.status = new_status
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم تحديث حالة العميل بنجاح'
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'خطأ في تحديث حالة العميل: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء تحديث حالة العميل'
        }), 500

@customer_bp.route('/get_customer_details/<int:customer_id>', methods=['GET'])
def get_customer_details(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        
        return jsonify({
            'success': True,
            'customer': {
                'name': customer.name,
                'phone': customer.phone,
                'email': customer.email,
                'status': customer.status.value,
                'debt_amount': str(customer.debt_amount) if customer.debt_amount else '0.00'
            }
        })
    except Exception as e:
        current_app.logger.error(f'خطأ في جلب تفاصيل العميل: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء استرجاع بيانات العميل'
        }), 500


@customer_bp.route('/delete_customer/<int:customer_id>', methods=['POST'])
def delete_customer(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        
        # حذف الصورة إذا لم تكن افتراضية
        if customer.image and customer.image != 'default_profile.png':

            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'customers')
            image_path = os.path.join(upload_folder, customer.image)
            
            try:
                if os.path.exists(image_path):
                    os.remove(image_path)
            except Exception as file_error:
                current_app.logger.error(f'خطأ في حذف صورة العميل: {str(file_error)}')
        
        # حذف سجل العميل من قاعدة البيانات
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم حذف العميل بنجاح'
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'خطأ في حذف العميل: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء حذف العميل'
        }), 500