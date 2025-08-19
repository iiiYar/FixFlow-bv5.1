#coding: utf-8
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from .Backend.customers.model_customers import Customer, CustomerStatus
from . import db
from flask import jsonify


# تعريف البلوبرنت باسم main
main = Blueprint('main', __name__)

# Sales Blueprint
sales = Blueprint('sales', __name__)

@sales.route('/sales/new-invoice')
def new_invoice():
    # Fetch all customers to populate the dropdown in the template
    customers = Customer.query.order_by(Customer.name.asc()).all()
    return render_template('sales/new_invoice.html', customers=customers)

@main.route('/')
def index():
    return render_template('index.html')
    return render_template('.html')



@main.route('/second-hand-phones')
def second_hand_phones():
    return render_template('second_hand_phones.html')



