class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    characteristics = db.Column(db.String(200))
    status = db.Column(db.String(20), default='functional')
    acquisition_date = db.Column(db.Date, nullable=False)
    serial_number = db.Column(db.String(50), unique=True)

    def __repr__(self):
        return f'<Material {self.type} - {self.serial_number}>'
