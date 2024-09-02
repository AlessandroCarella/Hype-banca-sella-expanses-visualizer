from flask import Flask, request, jsonify, send_file
import os
import json
from werkzeug.utils import secure_filename

from constants import ALLOWED_EXTENSIONS
from utils import get_config
from uploadCsvModules.preProcessData import preProcessData

app = Flask(__name__)

app.config.update(get_config())

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
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

@app.route('/api/process', methods=['POST'])
def process_file():
    data = request.json
    filepath = data.get('filepath')
    if not filepath:
        return jsonify({"error": "No filepath provided"}), 400
    
    try:
        result = preProcessData(filepath)
        return jsonify({"message": "File processed successfully", "result": result}), 200
    except KeyError as e:
        return jsonify({"error": f"Error processing file: the key {str(e)} is not in the uploaded file. Please check the file and upload one from the bank."}), 500
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}; {str(e.__class__)}"}), 500

@app.route('/api/getPreviousFilesNames', methods=['GET'])
def get_previous_files():
    upload_folder = os.path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'])
    files = os.listdir(upload_folder)
    return jsonify({"files": files}), 200

@app.route('/api/getFile', methods=['GET'])
def get_file():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"error": "No filename provided"}), 400
    
    upload_folder = os.path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'])
    filepath = os.path.join(upload_folder, filename)
    
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    
    return send_file(filepath)

if __name__ == '__main__':
    app.run(debug=app.config['FLASK_DEBUG'])