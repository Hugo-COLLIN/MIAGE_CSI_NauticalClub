class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    level = db.Column(db.String(20), nullable=False)
    enrolled_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='scheduled')
    max_capacity = db.Column(db.Integer, default=10)
    instructor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    instructor = db.relationship('User', backref='courses')
