from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app.models.material import Material
from app import db

bp = Blueprint('material', __name__, url_prefix='/material')

@bp.route('/')
@login_required
def index():
    materials = Material.query.all()
    return render_template('material/index.html', materials=materials)

@bp.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    if request.method == 'POST':
        material = Material(
            type=request.form.get('type'),
            characteristics=request.form.get('characteristics'),
            serial_number=request.form.get('serial_number')
        )
        db.session.add(material)
        db.session.commit()
        flash('Material added successfully')
        return redirect(url_for('material.index'))
    return render_template('material/add.html')
