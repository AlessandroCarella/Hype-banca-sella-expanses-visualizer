from os import path
import json
from flask import jsonify

def getUserExpenseDictionary(app):
    userExpenseDictionaryPath = path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'], app.config['USER_CATEGORIES_FILE_NAME'])
    with open (userExpenseDictionaryPath, 'r') as file:
        return jsonify(json.load(file))

def getNamesList(app):
    namesListPath = path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], app.config['NAME_LIST_FILE_NAME'])
    with open (namesListPath, 'r') as file:
        return jsonify(file.readlines())
