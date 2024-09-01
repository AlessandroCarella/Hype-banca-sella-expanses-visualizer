import pandas as pd
import csv
import os
import json
from typing import List
from utils import current_dir, load_config

# Load configuration settings from an external file
config = load_config()

def change_file_extension(df: pd.DataFrame, filename: str) -> (pd.DataFrame, str):
    """
    Changes the file extension and saves the DataFrame as a CSV with escaped characters. 
    Cleans the file by removing unnecessary escape characters.

    Args:
        df (pd.DataFrame): DataFrame to be saved.
        filename (str): Name of the file to be saved.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
        str: Path to the saved CSV file.
    """
    # Define the directory to save previously uploaded user files
    previousUserFilesFolder = os.path.join(
        current_dir, 
        "..", 
        config['user_files_folder_name'], 
        config['user_files_previously_uploaded_files_folder_name']
    )
    # Ensure the directory exists
    os.makedirs(previousUserFilesFolder, exist_ok=True)

    # Set the file path for the CSV
    filePath = os.path.join(previousUserFilesFolder, filename)
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

def clean_csv(df: pd.DataFrame, output_file: str, newFilePath: str) -> pd.DataFrame:
    """
    Cleans the CSV data by adjusting column names and writing the cleaned data 
    to the specified output files.

    Args:
        df (pd.DataFrame): The DataFrame to be cleaned.
        output_file (str): Path to save the cleaned output file.
        newFilePath (str): Path to save the updated DataFrame.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
    def cleanImportoColumnName(df: pd.DataFrame) -> pd.DataFrame:
        """
        Renames the last column of the DataFrame to 'Importo' and removes the old column.

        Args:
            df (pd.DataFrame): The DataFrame with the column to rename.

        Returns:
            pd.DataFrame: Updated DataFrame with the renamed 'Importo' column.
        """
        # Get the name of the last column and rename it to 'Importo'
        previousImportoColumnName = list(df.columns)[-1]
        df["Importo"] = df[previousImportoColumnName]
        del df[previousImportoColumnName]  # Remove the old column
        return df

    # Clean the 'Importo' column
    df = cleanImportoColumnName(df)
    
    # Ensure the output folder exists
    os.makedirs(os.path.join(current_dir, config['output_folder']), exist_ok=True)

    # Save the cleaned DataFrame to the specified output paths
    df.to_csv(output_file, index=False)
    df.to_csv(newFilePath, index=False)
    
    return df

def splitCsvByMonth(df: pd.DataFrame) -> None:
    """
    Splits the DataFrame into separate CSV files by month and year, saving each file 
    in the appropriate folder.

    Args:
        df (pd.DataFrame): DataFrame containing a 'Data operazione' column with dates.
    """
    # Convert the 'Data operazione' column to datetime format
    df['Data operazione'] = pd.to_datetime(df['Data operazione'], format='%d/%m/%Y')

    def save_to_csv(group: pd.DataFrame, year: int, month: int) -> None:
        """
        Saves a grouped DataFrame to a CSV file based on the specified year and month.

        Args:
            group (pd.DataFrame): The group of data to be saved.
            year (int): Year of the data.
            month (int): Month of the data.
        """
        # Create the folder path for the year and ensure it exists
        folder = f"{os.path.join(current_dir, config['output_folder'])}/{year}"
        os.makedirs(folder, exist_ok=True)
        
        # Define the file path and format 'Data operazione' column back to original format
        file_path = f"{folder}/{month:02d}.csv"
        group['Data operazione'] = group['Data operazione'].dt.strftime('%d/%m/%Y')
        
        # Save the group to CSV
        group.to_csv(file_path, index=False)

    # Group the DataFrame by year and month, then save each group as a CSV
    df.groupby([df['Data operazione'].dt.year, df['Data operazione'].dt.month]).apply(
        lambda x: save_to_csv(x, x.name[0], x.name[1])
    )

def save_expanses_names_and_descriptions_to_file(df: pd.DataFrame) -> None:
    """
    Saves unique names and descriptions of expenses from the DataFrame into separate files.

    Args:
        df (pd.DataFrame): DataFrame containing 'Nome' and 'Descrizione' columns.
    """
    def getDfColumnUniqueValues(df: pd.DataFrame, columnName: str) -> List[str]:
        """
        Retrieves unique values from a specified column in the DataFrame.

        Args:
            df (pd.DataFrame): The DataFrame to retrieve values from.
            columnName (str): The column name to extract unique values.

        Returns:
            List[str]: List of unique values from the column.
        """
        return list(df[columnName].unique())
    
    # Save unique expense names to a file
    with open(f"{os.path.join(current_dir, config['output_folder'])}/{config['names_file']}", 'w') as file:
        for item in getDfColumnUniqueValues(df, "Nome"):
            file.write(str(item) + '\n')

    # Save unique expense descriptions to a file
    with open(f"{os.path.join(current_dir, config['output_folder'])}/{config['descriptions_file']}", 'w') as file:
        for item in getDfColumnUniqueValues(df, "Descrizione"):
            file.write(str(item) + '\n')

def preProcessData(df: pd.DataFrame, fileName: str) -> None:
    """
    Orchestrates the preprocessing of data by changing file extension, cleaning the CSV, 
    splitting data by month, and saving expense names and descriptions.

    Args:
        df (pd.DataFrame): DataFrame to be processed.
        fileName (str): Name of the input file.
    """
    # Step 1: Change file extension and save the cleaned DataFrame
    df, newFilePath = change_file_extension(df, fileName)

    # Step 2: Clean the CSV and save it to the specified paths
    output_file = f"{os.path.join(current_dir, config['output_folder'])}/{config['cleaned_csv_file']}"
    df = clean_csv(df, output_file, newFilePath)

    # Step 3: Split the DataFrame into separate CSV files by month
    splitCsvByMonth(df)
 
    # Step 4: Save unique expense names and descriptions to files
    save_expanses_names_and_descriptions_to_file(df)
