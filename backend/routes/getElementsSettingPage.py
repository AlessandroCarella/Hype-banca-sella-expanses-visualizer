from os import path
import json
from flask import jsonify

def get_user_expense_dictionary(app):
    userExpenseDictionaryPath = path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'], app.config['USER_CATEGORIES_FILE_NAME'])
    with open (userExpenseDictionaryPath, 'r') as file:
        return jsonify(json.load(file))

def get_expanses_names_list(app):
    namesListPath = path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], app.config['NAME_LIST_FILE_NAME'])
    with open (namesListPath, 'r') as file:
        #remove the \n char from each line
        lines = [line.strip() for line in file.readlines()]
        return jsonify(lines)
