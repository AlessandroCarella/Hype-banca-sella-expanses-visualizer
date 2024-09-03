from flask import request, jsonify, send_file
import os

from routes.helpers.constants import ALLOWED_EXTENSIONS

def get_previous_files(app):
    upload_folder = os.path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'])
    
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    files = []
    for extension in ALLOWED_EXTENSIONS:
        for file in os.listdir(upload_folder):
            if file.endswith(extension):
                files.append(file)

    if len (files) == 0:
        return jsonify({"files": []}), 200
    else:
        return jsonify({"files": files}), 200

def get_file(app):
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"error": "No filename provided"}), 400
    
    upload_folder = os.path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'])
    filepath = os.path.join(upload_folder, filename)
    
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    
    return send_file(filepath)
