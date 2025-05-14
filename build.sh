set -o errexit

echo "Installing GDAL and GeoDjango requirements..."
apt-get update
apt-get install -y binutils libproj-dev gdal-bin libgdal-dev python3-gdal

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Running Django collectstatic..."
python manage.py collectstatic --noinput