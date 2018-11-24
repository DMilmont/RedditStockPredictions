import pandas as pd 
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

data = pd.read_csv("/redditComments/FinalData.csv",dtype=object) 

data = data[data['body'].notnull()]

analyzer = SentimentIntensityAnalyzer()
sentiment = data['body'].apply(lambda body: pd.Series(analyzer.polarity_scores(body)))

FinalDataVaderSentiment = data.join(sentiment)

FinalDataVaderSentiment.to_csv('FinalDataVaderSentiment.csv')

