import pandas as pd

def process_df(filepath):
    # Read the CSV file
    try:
        df = pd.read_excel(filepath)
    except Exception as e:
        try:
            df = pd.read_csv(filepath)
        except Exception as e:
            return f"Error reading file: {e}"
        
    # Perform your data processing here
    # For example, let's just return the shape of the dataframe
    rows, cols = df.shape
    
    return f"Processed file with {rows} rows and {cols} columns"