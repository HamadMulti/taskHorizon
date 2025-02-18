# Use an official lightweight Python image
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0

# Create the database
# RUN flask db migrate -m "Initial Deployment migration one"
# RUN flask db upgrade

# Run the web service on container startup
CMD ["flask", "run"]
