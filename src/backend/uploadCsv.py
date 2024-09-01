from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import logging

from constants import *  # Import constants used in the application
from utils import load_config  # Import utility functions for configuration loading
from preProcessData import preProcessData, preProcessDataPreviouslyUploadedFile  # Import the preprocessing function

# Load configuration settings from an external file
config = load_config()

# Initialize Flask application
app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:9000"}})

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def home():
    """
    Render the home page with a form to upload files.

    Returns:
        The rendered HTML template for the home page.
    """
    return render_template('uploadCsv.html')

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    """
    Handle file upload via POST request, validate the file, and process it.
    Supports CORS preflight requests via OPTIONS method.

    Returns:
        JSON response indicating success or error.
    """
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify({'success': True}), 200

    file = request.files['file']
    return process_file(file)

def process_file(file):
    """
    Processes the uploaded file by reading its content and performing data preprocessing.

    Args:
        file: The uploaded file to be processed.

    Returns:
        JSON response indicating successful processing.
    """
    # Read the uploaded Excel file into a DataFrame
    df = pd.read_excel(file)
    # Preprocess the DataFrame and handle the file according to its filename
    preProcessData(df, file.filename)
    # Return a success response after processing
    return jsonify({'success': True}), 200

@app.route('/get_previous_files', methods=['GET'])
def get_previous_files():
    """
    Retrieve the list of previously uploaded files.

    Returns:
        JSON response containing the list of filenames.
    """
    previous_files_folder = os.path.join('..', config['user_files_folder_name'], config['user_files_previously_uploaded_files_folder_name'])
    files = [f for f in os.listdir(previous_files_folder) if f.endswith('.csv')]
    return jsonify(files)

@app.route('/process_previous_file', methods=['POST'])
def process_previous_file():
    """
    Process a previously uploaded file.

    Returns:
        JSON response indicating success or error.
    """
    data = request.json
    filename = data.get('filename')
    file_path = os.path.join('..', config['user_files_folder_name'], config['user_files_previously_uploaded_files_folder_name'], filename)

    try:
        df = pd.read_csv(file_path, on_bad_lines='warn')
        preProcessDataPreviouslyUploadedFile(df, file_path)
        return jsonify({'success': True}), 200
    except Exception as e:
        app.logger.error(f"Error processing file {filename}: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask application in debug mode for development
    app.run(debug=True)
