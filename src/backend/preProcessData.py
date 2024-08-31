import pandas as pd
import os
import json
from typing import Dict, List

current_dir = os.path.dirname(os.path.abspath(__file__))

def load_config() -> Dict:
    """Load and return the configuration from config.json file."""
    
    with open(os.path.join(current_dir, 'config.json'), 'r') as config_file:
        return json.load(config_file)
    
#jupyter file 1
def clean_csv(df: pd.DataFrame, output_file: str) -> None:
    """Clean and process the CSV data, then write it to the output file."""
    
    def cleanImportoColumnName(df: pd.DataFrame) -> pd.DataFrame:
        """Clean the 'Importo' column name and remove the redundant column."""
        
        df["Importo"] = df[list(df.columns)[-1]]
        del df[list(df.columns)[-2]]
        return df

    def write_header(outfile: 'TextIO', columns: List[str]) -> None:
        """Write the header row to the output file."""
        
        header = ",".join(columns) + "\n"
        outfile.write(header)

    def process_row(row: pd.Series) -> str:
        """Process and clean individual rows of the DataFrame."""
        
        def clean_splitted_row(row_string: str) -> str:
            """Clean and format a row that has been split into multiple columns."""
            
            splitted_row = row_string.split(",")
            if len(splitted_row) <= 6:
                return row_string.replace('"', '')

            splitted_row = [s.replace('"', '') for s in splitted_row]
            data_operazione, data_contabile, tipologia = splitted_row[:3]
            importo = splitted_row[-1]
            
            if len(splitted_row) == 7:
                nome = splitted_row[3] + splitted_row[4]
                descrizione = splitted_row[5]
            else:
                nome = splitted_row[3] + splitted_row[4]
                descrizione = splitted_row[5] + splitted_row[6]
            
            cleaned_row = [data_operazione, data_contabile, tipologia, nome, descrizione, importo]
            return ",".join(cleaned_row).replace('"', '')

        row_list = [str(col) for col in row]
        if all(value == "nan" for value in row_list[1:6]):
            return clean_splitted_row(row_list[0])
        return ",".join(row_list).replace('"', '')

    df = cleanImportoColumnName(df)
    
    os.makedirs(os.path.join(current_dir, config['output_folder']), exist_ok=True)

    with open(output_file, 'w', newline='\n') as outfile:
        write_header(outfile, df.columns)
        for row in df.iterrows():
            row_data = process_row(row[1])
            outfile.write(row_data + "\n")

#jupyter file 2
def splitCsvByMonth(df: pd.DataFrame) -> None:
    """Split the CSV data by month and save each month's data to a separate file."""
    
    # Convert 'Data operazione' to datetime
    df['Data operazione'] = pd.to_datetime(df['Data operazione'], format='%d/%m/%Y')

    # Create a function to save dataframe to CSV
    def save_to_csv(group: pd.DataFrame, year: int, month: int) -> None:
        """Save a group of data to a CSV file for a specific year and month."""
        folder = f"{os.path.join(current_dir, config['output_folder'])}/{year}"
        os.makedirs(folder, exist_ok=True)
        file_path = f"{folder}/{month:02d}.csv"
        
        # Convert 'Data operazione' back to original format
        group['Data operazione'] = group['Data operazione'].dt.strftime('%d/%m/%Y')
        
        group.to_csv(file_path, index=False)

    # Group by year and month, then apply the save function
    df.groupby([df['Data operazione'].dt.year, df['Data operazione'].dt.month]).apply(
        lambda x: save_to_csv(x, x.name[0], x.name[1])
    )

#jupyter file 3
def save_expanses_names_and_descriptions_to_file(df: pd.DataFrame) -> None:
    """Save unique expense names and descriptions to separate files."""
    
    def getDfColumnUniqueValues(df: pd.DataFrame, columnName: str) -> List[str]:
        """Get unique values from a specified column of the DataFrame."""
        
        return list(df[columnName].unique())
    
    # Save unique names
    with open(f"{os.path.join(current_dir, config['output_folder'])}/{config['names_file']}", 'w') as file:
        for item in getDfColumnUniqueValues(df, "Nome"):
            file.write(str(item) + '\n')

    # Save unique descriptions
    with open(f"{os.path.join(current_dir, config['output_folder'])}/{config['descriptions_file']}", 'w') as file:
        for item in getDfColumnUniqueValues(df, "Descrizione"):
            file.write(str(item) + '\n')

def preProcessData():
    config = load_config()

    csv_file = find_csv_file_in_directory(current)
    df = pd.read_csv(csv_file, encoding=config['csv_encoding'])

    #jupyter file 1
    output_file = f"{os.path.join(current_dir, config['output_folder'])}/{config['cleaned_csv_file']}"
    clean_csv(df, output_file)

    #jupyter file 2
    df = pd.read_csv(output_file, encoding=config['csv_encoding'])
    splitCsvByMonth(df)
 
    save_expanses_names_and_descriptions_to_file(df)
