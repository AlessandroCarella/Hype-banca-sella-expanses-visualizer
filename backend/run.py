from flask import Flask, request, jsonify

from utils import get_config

# Upload csv page
from routes.uploadCsv import upload_file
from routes.processCsv import process_file
from routes.selectPreviousCsv import get_previous_files, get_file

# User categories setted
from routes.userCategoriesSetted import is_user_categories_setted, get_user_pre_selected_options, save_user_categories, reset_user_options_to_default
from routes.getElementsSettingPage import get_user_expense_dictionary, get_expanses_names_list

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
# User categories
@app.route('/api/userCategoriesSetted', methods=['GET'])
def isUserCategoriesSetted():
    return is_user_categories_setted(app)

@app.route('/api/getUserExpenseDictionary', methods=['GET'])
def getUserExpenseDictionary():
    return get_user_expense_dictionary(app)

@app.route('/api/getExpansesNamesList', methods=['GET'])
def getExpansesNamesList():
    return get_expanses_names_list(app)

@app.route('/api/getUserPreSelectedOptions', methods=['GET'])
def getUserPreSelectedOptions():
    return get_user_pre_selected_options(app)

@app.route('/api/saveUserCategories', methods=['POST'])
def saveUserCategories():
    data = request.json.get('data')
    return save_user_categories(app, data)

@app.route('/api/reset-user-options-to-default', methods=['GET'])
def resetUserOptionsToDefault():
    return reset_user_options_to_default(app)

########################################################

if __name__ == '__main__':
    app.run(debug=app.config['FLASK_DEBUG'])