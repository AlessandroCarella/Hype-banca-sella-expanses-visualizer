from flask import Flask

from utils import get_config

from routes.uploadCsv import upload_file
from routes.processCsv import process_file
from routes.selectPreviousCsv import get_previous_files, get_file

app = Flask(__name__)

app.config.update(get_config())

########################################################
# Upload csv page
@app.route('/api/upload', methods=['POST'])
def upload():
    return upload_file(app)

@app.route('/api/process', methods=['POST'])
def process():
    return process_file(app)

@app.route('/api/getPreviousFilesNames', methods=['GET'])
def getPreviousFilesNames():
    return get_previous_files(app)

@app.route('/api/getFile', methods=['GET'])
def getFile():
    return get_file(app)
########################################################
########################################################
#

########################################################

if __name__ == '__main__':
    app.run(debug=app.config['FLASK_DEBUG'])