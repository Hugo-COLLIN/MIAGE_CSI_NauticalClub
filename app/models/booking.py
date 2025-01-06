class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime)
    base_price = db.Column(db.Float, nullable=False)
    additional_fees = db.Column(db.Float, default=0.0)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'), nullable=False)

    client = db.relationship('Client', backref='bookings')
    material = db.relationship('Material', backref='bookings')
