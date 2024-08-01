from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS  # Import CORS from flask_cors module
import os

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

# Path to the images directory
IMAGES_DIR = os.path.join(app.root_path, 'images')

@app.route('/data')
def get_data():
    images = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.avif'))]
    title = "MOVIES"
    return jsonify({'images': images, 'title': title})

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True,port=5000)
