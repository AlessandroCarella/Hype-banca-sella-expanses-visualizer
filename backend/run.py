from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from utils import get_config

# Upload csv page
from routes.uploadCsv import upload_file
from routes.processCsv import process_file
from routes.selectPreviousCsv import get_previous_files, get_file

# User categories setted
from routes.userCategoriesSetted import is_user_categories_setted, get_user_pre_selected_options, save_user_categories, reset_user_options_to_default
from routes.getElementsSettingPage import get_user_expense_dictionary, get_expanses_names_list

# Loading page
from routes.loadingPage import get_loading_gif

# Graphs page
from routes.graphs import get_years, get_months, getSupercategoryColors, getMonthData, getYearData, getExpansesListForMonthYearAndCategory

########################################################
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
########################################################
# Loading page
@app.route('/api/loading-gif', methods=['GET'])
def getLoadingGifs():
    return get_loading_gif(app)
########################################################
########################################################
# Graphs page
@app.route('/api/get-years', methods=['GET'])
def getMonthYear():
    return get_years(app)

@app.route('/api/get-months', methods=['GET'])
def getMonths():
    year = request.args.get('year')
    return get_months(app, year)

@app.route('/api/get-supercategory-colors', methods=['GET'])
def get_supercategory_colors():
    return getSupercategoryColors(app)

@app.route('/api/get-month-data', methods=['GET'])
def get_month_data():
    month = request.args.get('month')
    year = request.args.get('year')
    expenditureOrRevenue = request.args.get('expenditure-or-revenue')
    includeRisparmi = request.args.get('include-risparmi')
    return getMonthData(app, month, year, expenditureOrRevenue, includeRisparmi)

@app.route('/api/get-year-data', methods=['GET'])
def get_year_data():
    year = request.args.get('year')
    expenditureOrRevenue = request.args.get('expenditure-or-revenue')
    includeRisparmi = request.args.get('include-risparmi')
    return getYearData(app, year, expenditureOrRevenue, includeRisparmi)

@app.route('/api/getExpansesListForMonthYearAndCategory', methods=['GET'])
def get_expanses_list_for_month_year_and_category():
    month = request.args.get('month')
    year = request.args.get('year')
    category = request.args.get('category')
    expenditureOrRevenue = request.args.get('expenditure-or-revenue')
    includeRisparmi = request.args.get('include-risparmi')
    return getExpansesListForMonthYearAndCategory(app, month, year, category, expenditureOrRevenue, includeRisparmi)
########################################################

if __name__ == '__main__':
    app.run(debug=app.config['FLASK_DEBUG'])