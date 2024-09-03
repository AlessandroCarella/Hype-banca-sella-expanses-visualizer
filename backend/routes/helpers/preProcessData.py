import pandas as pd
import csv
import os
from typing import List, Tuple

def change_file_extension(df: pd.DataFrame, filePath: str) -> (pd.DataFrame, str):
    def strip_extension_and_apply_csv(filePath: str) -> str:
        return os.path.splitext(filePath)[0] + '.csv'
    
    filePath = strip_extension_and_apply_csv(filePath)

    # Save DataFrame as CSV with specified escape character settings
    df.to_csv(filePath, index=False, quoting=csv.QUOTE_NONE, escapechar='\\')

    # Read and clean the CSV by removing extra escape characters
    with open(filePath, 'r') as file:
        lines = file.readlines()
    
    with open(filePath, 'w') as file:
        for line in lines:
            file.write(line.replace('\,', ','))  # Remove the escape character before commas
    
    # Return the cleaned DataFrame and the file path
    return pd.read_csv(filePath), filePath

def clean_csv(df: pd.DataFrame, filePathsToSaveAt: List[str]) -> pd.DataFrame:
    def cleanImportoColumnName(df: pd.DataFrame) -> pd.DataFrame:
        # Get the name of the last column and rename it to 'Importo'
        previousImportoColumnName = list(df.columns)[-1]
        df["Importo"] = df[previousImportoColumnName]
        del df[previousImportoColumnName]  # Remove the old column
        return df

    # Clean the 'Importo' column
    df = cleanImportoColumnName(df)

    # Save the cleaned DataFrame to the specified output paths
    for filePath in filePathsToSaveAt:
        print ("saved at", filePath)
        df.to_csv(filePath, index=False)
    
    return df

def splitCsvByMonth(df: pd.DataFrame, output_folder: str) -> None:
    def save_to_csv(group: pd.DataFrame, year: int, month: int) -> None:
        # Create the folder path for the year and ensure it exists
        folder = os.path.join(output_folder, str(year))
        os.makedirs(folder, exist_ok=True)
        
        # Define the file path and format 'Data operazione' column back to original format
        file_path = f"{folder}/{month:02d}.csv"
        group['Data operazione'] = group['Data operazione'].dt.strftime('%d/%m/%Y')
        
        # Save the group to CSV
        group.to_csv(file_path, index=False)

    # Convert the 'Data operazione' column to datetime format
    df['Data operazione'] = pd.to_datetime(df['Data operazione'], format='%d/%m/%Y')

    # Group the DataFrame by year and month, then save each group as a CSV
    df.groupby([df['Data operazione'].dt.year, df['Data operazione'].dt.month]).apply(
        lambda x: save_to_csv(x, x.name[0], x.name[1])
    )

def save_expanses_names_and_descriptions_to_file(df: pd.DataFrame, output_folder: str, app) -> None:
    # Save unique expense names to a file
    with open(os.path.join(output_folder, app.config['NAME_LIST_FILE_NAME']), 'w') as file:
        for item in list(df["Nome"].unique()):
            file.write(str(item) + '\n')


def preProcessData(filePath, app) -> None:
    try:
        df = pd.read_excel(filePath, engine="openpyxl")
    except Exception as e:
        df = pd.read_csv(filePath)
        # possible exception not handled since the allowed extensions are already checked in the frontend
    
    os.makedirs(app.config['GENERATED_FILES_OUTPUT_FOLDER'], exist_ok=True)
    output_file = os.path.join(app.config['GENERATED_FILES_OUTPUT_FOLDER'], app.config['CLEANED_CSV_FILE_NAME'])
    
    # Step 1: Change file extension and save the cleaned DataFrame
    df, newFilePath = change_file_extension (df, output_file)

    # Step 2: Clean the CSV and save it to the specified paths
    df = clean_csv(df, filePathsToSaveAt=[output_file])

    # Step 3: Split the DataFrame into separate CSV files by month
    splitCsvByMonth(df, app.config['GENERATED_FILES_OUTPUT_FOLDER'])
 
    # Step 4: Save unique expense names and descriptions to files
    save_expanses_names_and_descriptions_to_file(df, app.config['GENERATED_FILES_OUTPUT_FOLDER'], app)
    