from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import re

from constants import *  # Import constants used in the application
from utils import load_config  # Import utility functions for configuration loading
from preProcessData import preProcessData  # Import the preprocessing function

# Load configuration settings from an external file
config = load_config()

# Initialize Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for the /upload endpoint
CORS(app, resources={r"/upload": {"origins": "http://localhost:9000"}})

@app.route('/')
def home():
    """
    Render the home page with a form to upload files.

    Returns:
        The rendered HTML template for the home page.
    """
    # Render an HTML template for the home page; ensure 'index.html' is in the templates folder
    return render_template('index.html')

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

    # Check if the file is included in the request
    if 'file' not in request.files:
        return jsonify({'error': ERROR_MESSAGE_NO_FILE_PART}), 400
    
    file = request.files['file']
    
    # Check if the uploaded file has a filename
    if file.filename == '':
        return jsonify({'error': ERROR_MESSAGE_NO_FILE_SELECTED}), 400

    # Validate the filename against a predefined pattern
    if not re.match(BANK_FILE_PATTERN, file.filename):
        # Send an error response if the filename does not match the expected pattern
        return jsonify({'error': ERROR_MESSAGE_FILE_PATTERN}), 400
    else:
        # Process the file if it passes validation
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

if __name__ == '__main__':
    # Run the Flask application in debug mode for development
    app.run(debug=True)
