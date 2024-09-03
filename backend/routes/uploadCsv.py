from flask import request, jsonify
import os
from werkzeug.utils import secure_filename

from routes.helpers.constants import ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(app):
    def configure():
        upload_folder = os.path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'])
        # Ensure the upload folder exists
        os.makedirs(upload_folder, exist_ok=True)
        return upload_folder
    
    def check_errors():
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400, {}
    
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400, file

        return None, 200, file
    
    def upload_file(file, upload_folder):
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(upload_folder, filename)
            
            # Check if file already exists
            if os.path.exists(filepath):
                return jsonify({"message": "File already exists", "filename": filename, "filepath": filepath}), 200            
            else:
                os.makedirs(os.path.dirname(filepath), exist_ok=True)

                file.save(filepath)
                return jsonify({"message": "File uploaded successfully", "filename": filename, "filepath": filepath}), 200
        else:
            return jsonify({"error": "File type not allowed"}), 400
    
    upload_folder = configure()
    
    error, status_code, file = check_errors()
    if status_code != 200: # there was an error
        return error, status_code
    
    return upload_file(file, upload_folder)
