import pandas as pd
from os import path
import os
import json
from flask import jsonify

def numberToMonth(number):
    #change the months to be in english
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[number-1]

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

