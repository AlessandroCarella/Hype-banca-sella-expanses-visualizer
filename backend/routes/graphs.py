import pandas as pd
from os import path
import os
import json
from flask import jsonify

def numberToMonth(number):
    #change the months to be in english
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[number-1]

def get_month_year_dates(app):
    monthYearDates = []
    folderNames = [folder for folder in os.listdir(app.config['GENERATED_FILES_OUTPUT_FOLDER']) 
                   if os.path.isdir(os.path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], folder))]
    for year in folderNames:#year is the name of the year folder
        yearFolderPath = path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], year)
        for monthFileName in os.listdir(yearFolderPath):
            monthYearDates.append(
                numberToMonth(int(monthFileName.replace(".csv", "")))
                + 
                " " 
                + 
                str(year)
            )

    return jsonify(monthYearDates)