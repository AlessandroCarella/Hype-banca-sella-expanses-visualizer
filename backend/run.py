from flask import Flask

from utils import get_config

# Upload csv page
from routes.uploadCsv import upload_file
from routes.processCsv import process_file
from routes.selectPreviousCsv import get_previous_files, get_file

# User categories setted
from routes.userCategoriesSetted import user_categories_setted

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
# User categories setted
@app.route('/api/userCategoriesSetted', methods=['GET'])
def check_user_categories_setted():
    return user_categories_setted(app)

########################################################

if __name__ == '__main__':
    app.run(debug=app.config['FLASK_DEBUG'])