from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app.models.course import Course
from app import db

bp = Blueprint('course', __name__, url_prefix='/course')

@bp.route('/')
@login_required
def index():
    courses = Course.query.all()
    return render_template('course/index.html', courses=courses)

@bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    if request.method == 'POST':
        course = Course(
            date=request.form.get('date'),
            start_time=request.form.get('start_time'),
            level=request.form.get('level'),
            instructor_id=current_user.id
        )
        db.session.add(course)
        db.session.commit()
        flash('Course created successfully')
        return redirect(url_for('course.index'))
    return render_template('course/create.html')

