import pandas as pd
from os import path
import os
import json
from flask import jsonify
import math
import shutil

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
def numberToMonth(number):
    return months[number-1]

def monthToNumber(month):
    return months.index(month) + 1

def get_months(app, year):
    months = []
    for monthFileName in os.listdir(
        path.join(
            app.config['GENERATED_FILES_OUTPUT_FOLDER'], 
            year
        )):
        months.append(
            numberToMonth(int(monthFileName.replace(".csv", "")))
            # + 
            # " " 
            # + 
            # str(year)
        )

    return jsonify(months)

def get_years(app):
    years = [folder for folder in os.listdir(app.config['GENERATED_FILES_OUTPUT_FOLDER']) 
                   if os.path.isdir(os.path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], folder))]
    return jsonify(years)

def getSupercategoryColors(app):
    supercategoryColorsFilePath = path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'], app.config['USER_CATEGORIES_COLORS_FILE_NAME'])
    if not path.exists(supercategoryColorsFilePath):
        shutil.copy(
            path.join(app.config['DEFAULT_FILES_FOLDER_NAME'], app.config['DEFAULT_USER_CATEGORIES_COLORS_FILE_NAME']), 
            supercategoryColorsFilePath
        )
    
    with open(supercategoryColorsFilePath, 'r') as file:
        supercategoryColors = json.load(file)

    return jsonify(supercategoryColors)

#data fetching
def getUserCategoriesStuff(app):
    userCategoriesFilePath = path.join(app.config['ROOT_FROM_BACKEND'], app.config['USER_FILES_FOLDER_NAME'], app.config['USER_CATEGORIES_FILE_NAME'])
    with open (userCategoriesFilePath, 'r') as file:
        userCategories = json.load(file)

    outSuperCategories = []
    outCategories = []
    categoriesNamesDict = {}
    superCategoriesToCategories = {}
    categoriesToSuperCategories = {}
    namesToCategories = {}
        
    for supercategory, categories in userCategories.items():
        outSuperCategories.append(supercategory)
        
        outCategories.extend(categories)
        
        for category in categories:
            categoriesNamesDict[category] = userCategories[supercategory][category] 
        
        superCategoriesToCategories[supercategory] = categories

        for category in categories:
            categoriesToSuperCategories[category] = supercategory

    #inverse the categoriesNamesDict
    for category, names in categoriesNamesDict.items():
        for name in names:
            namesToCategories[name] = category

    return outSuperCategories, outCategories, categoriesNamesDict, superCategoriesToCategories, categoriesToSuperCategories, namesToCategories

def getCleanedDf(app, year, month, expenditureOrRevenue, includeRisparmi):
    dfPath = path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], str(year), f"{monthToNumber(month):02d}.csv")
    df = pd.read_csv(dfPath)

    #filter the dataset based on if the "Importo" column is negative or positive
    df = df[df["Importo"] < 0] if expenditureOrRevenue == "Expenditure" else df[df["Importo"] > 0]

    if isinstance(includeRisparmi, str):  # Check if includeRisparmi is a string
        includeRisparmi = includeRisparmi.lower() == "true"  # Set to True if it equals "true"
    
    if not includeRisparmi:
        df = df[df["Tipologia"] != "Risparmi"]
    
    return df

def getMonthData(app, month, year, expenditureOrRevenue, includeRisparmi = False):
    """
    expenditureOrRevenue is to tell if to select the in flows of money or the out flows of money
    output structure:
    [
        {
            "supercategory": "",
            "category": "",
            "amount": int
        }
    ]
    """
    df = getCleanedDf(app, year, month, expenditureOrRevenue, includeRisparmi)
    _, _, _, _, categoriesToSuperCategories, namesToCategories = getUserCategoriesStuff(app)

    out = []
    for name in df["Nome"].unique():
        category = namesToCategories[name]
        supercategory = categoriesToSuperCategories[category]
        total_amount = df[df["Nome"] == name]["Importo"].sum()
        out.append({
            "supercategory": supercategory,
            "category": category,
            "amount": math.fabs(float(total_amount))
        })

    # return jsonify(out)
    return out

def getYearData(app, year, expenditureOrRevenue, includeRisparmi):
    """    
    expenditureOrRevenue is to tell if to select the in flows of money or the out flows of money
    output structure:
    {
        January: [
            {
                supercategory: "Living Expenses",
                category: "Food",
                amount: 300,
            },
            ...
        ]
        February: [
            {
                supercategory: "Living Expenses",
                category: "Food",
                amount: 300,
            },
            ...
        ]
        ...
    }
    """    
    out = {}
    for month in months:
        if path.exists(path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], str(year), f"{monthToNumber(month):02d}.csv")):
            out[month] = getMonthData(app, month, year, expenditureOrRevenue, includeRisparmi)
        
    return jsonify(out)

def getExpansesListForMonthYearAndCategory(app, month, year, category, expenditureOrRevenue, includeRisparmi):
    df = getCleanedDf(app, year, month, expenditureOrRevenue, includeRisparmi)
    _, _, _, _, _, namesToCategories = getUserCategoriesStuff(app)

    out = []
    for index, row in df.iterrows():
        print ("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", row)
        rowCategory = namesToCategories[row["Nome"]]
        if rowCategory == category:
            out.append({
                "descrizione":row["Descrizione"],
                "importo":row["Importo"],
                "nome":row["Nome"],
                "dataOperazione":row["Data operazione"]
            })
            
    return jsonify(out)