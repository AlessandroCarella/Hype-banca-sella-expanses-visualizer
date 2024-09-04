from flask import jsonify
from os import path
import json
import shutil

def getCategoriesFilePath(app):
    return path.join (app.config["ROOT_FROM_BACKEND"], app.config["USER_FILES_FOLDER_NAME"], app.config["USER_CATEGORIES_FILE_NAME"])

def getNamesFilePath(app):
    return path.join (app.config["GENERATED_FILES_OUTPUT_FOLDER"], app.config["NAME_LIST_FILE_NAME"])

def userCategoriesFileAndNamesAndDescriptionsFiles(app):
    def checkForCategoriesFile(categoriesFile, app):
        if not path.exists(categoriesFile):
            defaultCategoriesFile = path.join (app.config["DEFAULT_FILES_FOLDER_NAME"], app.config["DEFAULT_USER_CATEGORIES_FILE_NAME"])
            shutil.copy(defaultCategoriesFile, categoriesFile)

    categoriesFile = getCategoriesFilePath(app)
    namesFile = getNamesFilePath(app)

    checkForCategoriesFile(categoriesFile, app)
    
    with open (categoriesFile, "r") as file:
        categories = json.load(file)
    with open (namesFile, "r") as file:
        names = file.readlines()

    return categories, names

def getAllNamesInCategories(categories):
    categoriesNames = []
    
    def traverse(item):
        if isinstance(item, str):
            categoriesNames.append(item)
        elif isinstance(item, dict):
            for value in item.values():
                traverse(value)
        elif isinstance(item, list):
            for element in item:
                traverse(element)
    
    traverse(categories)

    return categoriesNames

def userCategoriesFileFilled(categories, names):
    return all(name in getAllNamesInCategories(categories) for name in names)

def is_user_categories_setted(app):
    categories, names = userCategoriesFileAndNamesAndDescriptionsFiles(app)
    if not userCategoriesFileFilled(categories, names):
        return jsonify(False)
    return jsonify(True)

def get_user_pre_selected_options(app):
    categoriesFilePath = getCategoriesFilePath(app)
    
    with open(categoriesFilePath, "r") as file:
        categories = json.load(file)

    return jsonify(getAllNamesInCategories(categories))

def save_user_categories(app, categories):
    try:
        print (categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": "Categories saved successfully"}), 200

