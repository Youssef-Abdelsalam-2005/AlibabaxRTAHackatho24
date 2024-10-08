import pandas as pd
import ast

# Read the CSV file
df = pd.read_csv('taxidemand2.csv')

# Convert the 'Dist' column

# Now 'Dist' column contains lists of tuples with float values
print(df['Dist'].head())

