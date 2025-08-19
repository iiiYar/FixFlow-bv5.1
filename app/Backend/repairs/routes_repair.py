from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from app import db
from .repair_models import RepairRequest, RepairStatus
from app.Backend.customers.model_customers import Customer
from app.Backend.devices.devices_models import Devices
from app.Backend.issues.issues_models import Issue
from datetime import datetime

repair = Blueprint('repair', __name__)

@repair.route('/smartphone-repair')
def smartphone_repair():
    repairs = RepairRequest.query.all()
    customers = Customer.query.all()
    devices = Devices.query.all()
    issues = Issue.query.all()
    return render_template('smartphone_repair.html', repairs=repairs, customers=customers, devices=devices, issues=issues)


@repair.route('/repairs')
def list_repairs():
    repairs = RepairRequest.query.all()
    return render_template('repairs.html', repairs=repairs)

@repair.route('/add_repair', methods=['GET', 'POST'])
def add_repair():
    if request.method == 'POST':
        try:
            # Get form data
            device_id = request.form.get('device_id')
            customer_id = request.form.get('customer_id')
            issue_id = request.form.get('issue_id')
            repair_price = request.form.get('repair_price')
            notes = request.form.get('notes')

            # Create new repair request
            repair_request = RepairRequest(
                device_id=device_id,
                customer_id=customer_id,
                issue_id=issue_id,
                repair_price=repair_price,
                notes=notes,
                status=RepairStatus.PENDING
            )

            # Add and commit to database
            db.session.add(repair_request)
            
            # Update customer visits count
            customer = Customer.query.get(customer_id)
            if customer:
                customer.visits += 1
                customer.last_visit = datetime.utcnow()
            
            db.session.commit()

            flash('Repair request added successfully', 'success')
            return redirect(url_for('repair.smartphone_repair'))

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Error adding repair request: {str(e)}')
            flash('Error occurred while adding repair request', 'danger')

    # Get all devices and customers for the form
    devices = Devices.query.all()
    customers = Customer.query.all()
    return render_template('add_repair.html', devices=devices, customers=customers, issue_types=IssueType)

@repair.route('/edit_repair/<int:repair_id>', methods=['GET', 'POST'])
def edit_repair(repair_id):
    try:
        repair_request = RepairRequest.query.get_or_404(repair_id)

        if request.method == 'GET':
            return jsonify({
                'success': True,
                'repair': {
                    'customer_id': repair_request.customer_id,
                    'device_id': repair_request.device_id,
                    'issue': {'id': repair_request.issue.id, 'title': repair_request.issue.title},
                    'repair_price': str(repair_request.repair_price),
                    'notes': repair_request.notes or '',
                    'status': repair_request.status.value
                }
            })

        if request.method == 'POST':
            # Update repair request details
            repair_request.device_id = request.form.get('device_id')
            repair_request.customer_id = request.form.get('customer_id')
            repair_request.issue_id = request.form.get('issue_id')
            repair_request.repair_price = request.form.get('repair_price')
            repair_request.notes = request.form.get('notes')
            repair_request.status = RepairStatus(request.form.get('status'))

            # Update completed_at if status is COMPLETED
            if repair_request.status == RepairStatus.COMPLETED and not repair_request.completed_at:
                repair_request.completed_at = datetime.utcnow()

            db.session.commit()
            return jsonify({
                'success': True,
                'message': 'Repair request updated successfully'
            })

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating repair request: {str(e)}')
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

    return jsonify({
        'success': False,
        'message': 'Invalid request method'
    }), 405

@repair.route('/get_repair_details/<int:repair_id>', methods=['GET'])
def get_repair_details(repair_id):
    try:
        repair_request = RepairRequest.query.get_or_404(repair_id)
        
        # Get related customer and device information
        customer = Customer.query.get(repair_request.customer_id)
        device = Devices.query.get(repair_request.device_id)
        
        return jsonify({
            'success': True,
            'repair': {
                'id': repair_request.id,
                'customer_name': customer.name if customer else 'Unknown',
                'device_name': device.name if device else 'Unknown',
                'device_category': device.category if device else 'Unknown',
                'issue': {'id': repair_request.issue.id, 'title': repair_request.issue.title},
                'repair_price': str(repair_request.repair_price),
                'status': repair_request.status.value,
                'created_at': repair_request.created_at.strftime('%Y-%m-%d') if repair_request.created_at else 'Unknown'
            }
        })
    except Exception as e:
        current_app.logger.error(f'Error getting repair details: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Error occurred while getting repair details'
        }), 500

@repair.route('/delete_repair/<int:repair_id>', methods=['POST'])
def delete_repair(repair_id):
    try:
        repair_request = RepairRequest.query.get_or_404(repair_id)
        db.session.delete(repair_request)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Repair request deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting repair request: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Error occurred while deleting repair request'
        }), 500

@repair.route('/update_repair_status/<int:repair_id>', methods=['POST'])
def update_repair_status(repair_id):
    try:
        repair_request = RepairRequest.query.get_or_404(repair_id)
        new_status = request.form.get('status')
        
        repair_request.status = RepairStatus(new_status)
        if repair_request.status == RepairStatus.COMPLETED and not repair_request.completed_at:
            repair_request.completed_at = datetime.utcnow()

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Repair status updated successfully',
            'status': new_status
        })

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating repair status: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Error occurred while updating repair status'
        }), 500