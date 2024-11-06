from flask import Flask, send_from_directory, jsonify, request, render_template, redirect, url_for
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/scores": {"origins": "https://mytierlist.netlify.app/"}})

# Path to the images directory
IMAGES_DIR = os.path.join(app.root_path, 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)  # Ensure the images directory exists

# Variable to store the title
title = ""

@app.route('/')
def index():
    return render_template('server.html')  # Serve the HTML page

@app.route('/data')
def get_data():
    images = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.avif'))]
    return jsonify({'images': images, 'title': title})

@app.route('/upload', methods=['POST'])
def upload_image():
    global title
    title = request.form.get('title', title)  # Get the title from the form or keep the current title
    
    # Check if an image file is in the request
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image']
    
    # Validate and save the file if it is an image
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.avif')):
        file.save(os.path.join(IMAGES_DIR, file.filename))
        return redirect(url_for('index'))
    else:
        return jsonify({"error": "Unsupported file type"}), 400

@app.route('/delete_all', methods=['POST'])
def delete_all_images():
    global title
    # Clear all files in the images directory
    for file in os.listdir(IMAGES_DIR):
        file_path = os.path.join(IMAGES_DIR, file)
        if os.path.isfile(file_path):
            os.remove(file_path)
    title = ""  # Reset the title after deleting all images
    return redirect(url_for('index'))

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)