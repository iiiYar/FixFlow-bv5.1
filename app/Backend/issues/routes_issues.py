from flask import Blueprint, render_template, request, jsonify, current_app
from app import db
from .issues_models import Issue
from datetime import datetime

issue_bp = Blueprint('issues', __name__)

@issue_bp.route('/issues')
def list_issues():
    page = request.args.get('page', 1, type=int)
    per_page = 19
    issues = Issue.query.paginate(page=page, per_page=per_page)
    return render_template('issues.html', 
                         issues=issues.items,
                         pagination=issues,
                         page=page,
                         total_pages=issues.pages,
                         total_issues=issues.total)

@issue_bp.route('/add_issue', methods=['POST'])
def add_issue():
    try:
        title = request.form.get('title')
        description = request.form.get('description')
        status = request.form.get('status')

        if Issue.query.filter_by(title=title).first():
            return jsonify({
                'success': False,
                'message': 'عنوان المشكلة موجود مسبقاً'
            }), 400

        issue = Issue(
            title=title,
            description=description,
            status=status
        )

        db.session.add(issue)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'تم إضافة المشكلة بنجاح'
        })

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error adding issue: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء إضافة المشكلة'
        }), 500

@issue_bp.route('/update_issue', methods=['POST'])
def update_issue():
    try:
        issue_id = request.form.get('issue_id')
        issue = Issue.query.get_or_404(int(issue_id))
        
        title = request.form.get('title')
        description = request.form.get('description')
        status = request.form.get('status')

        if title != issue.title and Issue.query.filter_by(title=title).first():
            return jsonify({
                'success': False,
                'message': 'عنوان المشكلة موجود مسبقاً'
            }), 400

        issue.title = title
        issue.description = description
        issue.status = status

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'تم تحديث المشكلة بنجاح'
        })

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating issue: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء تحديث المشكلة'
        }), 500

@issue_bp.route('/delete_issue/<int:issue_id>', methods=['POST'])
def delete_issue(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        db.session.delete(issue)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'تم حذف المشكلة بنجاح'
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting issue: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء حذف المشكلة'
        }), 500

@issue_bp.route('/get_issue_details/<int:issue_id>', methods=['GET'])
def get_issue_details(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        return jsonify({
            'success': True,
            'issue': {
                'title': issue.title,
                'description': issue.description,
                'status': issue.status,
                'created_at': issue.created_at.strftime('%Y-%m-%d') if issue.created_at else None
            }
        })
    except Exception as e:
        current_app.logger.error(f'Error getting issue details: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'حدث خطأ أثناء جلب تفاصيل المشكلة'
        }), 500