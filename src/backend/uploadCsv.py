from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import re

from constants import *
from utils import load_config
config = load_config()

from preProcessData import preProcessData

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:9000"}})


@app.route('/')
def home():
    # Render an HTML template with a form to upload files
    return render_template('index.html')  # Make sure you have an index.html file in the templates folder

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return jsonify({'success': True}), 200

    if 'file' not in request.files:
        return jsonify({'error': ERROR_MESSAGE_NO_FILE_PART}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': ERROR_MESSAGE_NO_FILE_SELECTED}), 400
        
    if not re.match(BANK_FILE_PATTERN, file.filename):
        # Send a response indicating that an alert should be shown
        return jsonify({
            'error': ERROR_MESSAGE_FILE_PATTERN
        }), 400
    else:
        return process_file(file)

def process_file(file):
    df = pd.read_csv(file, encoding=config['csv_encoding'])
    preProcessData(df)
    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(debug=True)
