from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required
from app.models.booking import Booking
from app import db

bp = Blueprint('booking', __name__, url_prefix='/booking')

@bp.route('/')
@login_required
def index():
    bookings = Booking.query.all()
    return render_template('booking/index.html', bookings=bookings)

@bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    if request.method == 'POST':
        booking = Booking(
            start_date=request.form.get('start_date'),
            end_date=request.form.get('end_date'),
            base_price=request.form.get('base_price'),
            client_id=request.form.get('client_id'),
            material_id=request.form.get('material_id')
        )
        db.session.add(booking)
        db.session.commit()
        flash('Booking created successfully')
        return redirect(url_for('booking.index'))
    return render_template('booking/create.html')
