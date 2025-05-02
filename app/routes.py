from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from app.Backend.customers.model_customers import Customer, CustomerStatus
from . import db
from flask import jsonify


# تعريف البلوبرنت باسم main
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')



@main.route('/second-hand-phones')
def second_hand_phones():
    return render_template('second_hand_phones.html')


