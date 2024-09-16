import pandas as pd
import json
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.ensemble import GradientBoostingRegressor


def splitDfInEachMonth(df):
    # Ensure 'Data operazione' is in datetime format
    df['Data operazione'] = pd.to_datetime(df['Data operazione'], errors='coerce')

    # Initialize a dictionary to hold the split data
    split_data = {}

    # Group the DataFrame by year and month, then populate the dictionary
    for (year, month), group in df.groupby([df['Data operazione'].dt.year, df['Data operazione'].dt.month]):
        if year not in split_data:
            split_data[year] = {}
        month_name = group['Data operazione'].dt.month_name().str.lower().iloc[0]  # Get month name
        split_data[year][month_name] = group  # Assign the group to the corresponding month

    return split_data

def getDfExpenditureOrRevenue(df, expenditureOrRevenue):
    df = df[df["Importo"] < 0] if expenditureOrRevenue == "Expenditure" else df[df["Importo"] > 0]
    return df

def keepOrRemoveRisparmiFromDf(df, includeRisparmi):
    if isinstance(includeRisparmi, str):  # Check if includeRisparmi is a string
        includeRisparmi = includeRisparmi.lower() == "true"  # Set to True if it equals "true"

    if not includeRisparmi:
        df = df[df["Tipologia"] != "Risparmi"]
    
    return df  

def addCategoriaAndSuperCategoriaColsToDf (df, namesToCategories, categoriesToSuperCategories):
    df['Categoria'] = df['Nome'].apply(lambda x: namesToCategories.get(x, None))
    
    df['SuperCategoria'] = df['Categoria'].apply(lambda x: categoriesToSuperCategories.get(x, None))
    
    return df

def getDfWithDataOperazioneColInDatetimeFormat (df):
    df['Year-Month'] = pd.to_datetime(df['Data operazione'], format='%d/%m/%Y').dt.to_period('M')
    return df

def getTotalMonthlySpending(df) -> tuple[pd.Series, pd.DataFrame]:
    # Total monthly spending
    total_monthly_spending = df.groupby('Year-Month')['Importo'].sum()

    # Supercategory-wise monthly spending
    monthly_supercategory_spending = df.groupby(['Year-Month', 'SuperCategoria'])['Importo'].sum().unstack(fill_value=0)

    return total_monthly_spending, monthly_supercategory_spending

def matplotlibVisualizationsBad(df, total_monthly_spending, monthly_supercategory_spending):
    # Plot total spending
    total_monthly_spending.plot(kind='line')
    plt.title('Total Monthly Spending')
    plt.show()

    # Plot supercategory spending
    monthly_supercategory_spending.plot(kind='line', figsize=(10, 6))
    plt.title('Monthly Spending by Supercategory')
    plt.show()

#####################################
###############MODELS################
#####################################

def arima_monthly_prediction(weightedData):
    def tune_arima_parameters(data):
        """Tune ARIMA parameters using AIC/BIC criteria (placeholder for actual implementation)."""
        # This is a placeholder for a more complex implementation
        best_aic = float('inf')
        best_order = None
        for p in range(0, 3):
            for d in range(0, 2):
                for q in range(0, 3):
                    try:
                        model = ARIMA(data, order=(p, d, q))
                        model_fit = model.fit()
                        if model_fit.aic < best_aic:
                            best_aic = model_fit.aic
                            best_order = (p, d, q)
                    except:
                        continue
        return best_order

    """Fit an ARIMA model on the overall weighted monthly spending and forecast."""
    univariate_data = weightedData.groupby('Year-Month')['Weighted_Spending'].sum()
    
    # Tune ARIMA parameters
    best_order = tune_arima_parameters(univariate_data)
    model = ARIMA(univariate_data, order=best_order)
    
    model_fit = model.fit()
    forecast_weighted_overall = model_fit.forecast(steps=10)
    
    return forecast_weighted_overall

def linear_regression_monthly_prediction(weightedData):
    """Fit a Linear Regression model on overall weighted spending and predict next month's spending."""
    X = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().shift(1).dropna()
    y = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().loc[X.index]
    
    model = LinearRegression()
    model.fit(X.values.reshape(-1, 1), y)
    next_month_pred = model.predict([[X.iloc[-1]]])[0]  # Ensure it's a scalar
    
    return next_month_pred

def random_forest_monthly_prediction(weightedData):
    """Fit a Random Forest model on overall weighted spending and predict next month's spending."""
    X = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().shift(1).dropna()
    y = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().loc[X.index]
    
    model = RandomForestRegressor()
    model.fit(X.values.reshape(-1, 1), y)
    next_month_pred = model.predict([[X.iloc[-1]]])
    return next_month_pred

def ets_monthly_prediction(weightedData):
    """Fit an ETS model on overall weighted spending and predict next month's spending."""
    univariate_data = weightedData.groupby('Year-Month')['Weighted_Spending'].sum()
    
    # Fit the ETS model
    model = ExponentialSmoothing(univariate_data, trend='add', seasonal='add', seasonal_periods=12)
    model_fit = model.fit()
    
    # Forecast next month's spending
    next_month_pred = model_fit.forecast(steps=1)
    
    return next_month_pred

def gradient_boosting_monthly_prediction(weightedData):
    """Fit a Gradient Boosting model on overall weighted spending and predict next month's spending."""
    X = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().shift(1).dropna()
    y = weightedData.groupby('Year-Month')['Weighted_Spending'].sum().loc[X.index]
    
    model = GradientBoostingRegressor()
    model.fit(X.values.reshape(-1, 1), y)
    next_month_pred = model.predict([[X.iloc[-1]]])
    return next_month_pred

def arima_supercategory_prediction(weighted_monthly_spending, supercategory_to_forecast):
    """Fit an ARIMA model on a specific supercategory's weighted monthly spending."""
    univariate_data = weighted_monthly_spending[supercategory_to_forecast]
    model = ARIMA(univariate_data, order=(1, 1, 1))
    model_fit = model.fit()
    forecast_weighted = model_fit.forecast(steps=10)
    return forecast_weighted

def linear_regression_supercategory_prediction(weighted_monthly_spending):
    """Fit a Linear Regression model on supercategory spending and predict next month's spending."""
    X = weighted_monthly_spending.shift(1).dropna()
    y = weighted_monthly_spending.loc[X.index]
    model = LinearRegression()
    model.fit(X, y)
    next_month_pred = model.predict([X.iloc[-1]])
    return next_month_pred

def random_forest_supercategory_prediction(weighted_monthly_spending, supercategory_to_forecast):
    """Fit a Random Forest model on a specific supercategory's weighted monthly spending."""
    univariate_data = weighted_monthly_spending[supercategory_to_forecast].shift(1).dropna()
    y = weighted_monthly_spending[supercategory_to_forecast].loc[univariate_data.index]
    
    model = RandomForestRegressor()
    model.fit(univariate_data.values.reshape(-1, 1), y)
    next_month_pred = model.predict([[univariate_data.iloc[-1]]])
    return next_month_pred

def ets_supercategory_prediction(weighted_monthly_spending, supercategory_to_forecast):
    """Fit an ETS model on a specific supercategory's weighted monthly spending."""
    univariate_data = weighted_monthly_spending[supercategory_to_forecast]
    
    # Fit the ETS model
    model = ExponentialSmoothing(univariate_data, trend='add', seasonal='add', seasonal_periods=12)
    model_fit = model.fit()
    
    # Forecast next month's spending
    forecast_weighted = model_fit.forecast(steps=1)
    
    return forecast_weighted

def gradient_boosting_supercategory_prediction(weighted_monthly_spending, supercategory_to_forecast):
    """Fit a Gradient Boosting model on a specific supercategory's weighted monthly spending."""
    univariate_data = weighted_monthly_spending[supercategory_to_forecast].shift(1).dropna()
    y = weighted_monthly_spending[supercategory_to_forecast].loc[univariate_data.index]
    
    model = GradientBoostingRegressor()
    model.fit(univariate_data.values.reshape(-1, 1), y)
    next_month_pred = model.predict([[univariate_data.iloc[-1]]])
    return next_month_pred
