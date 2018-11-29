from pymongo import MongoClient
from datetime import datetime, date, timedelta
import calendar
import pandas as pd
import numpy as np
from alpha_vantage.timeseries import TimeSeries
import pandas_datareader.data as web
import os
import time

# Since this works for the stock market, this can be set to run every weekday night (Monday night to friday night)
# 1. First fetch all the reddit posts along with comments for today
# 2. To achieve this, we have to extract all the posts and comments made today from mongodb
# 3. Run sentiment analysis on the post and comments
# 4. Aggregate the sentiment score all the way up to the post
# 5. Fetch stock information for today
# 6. Generate the neccessary sentiment and price/volume features to run the ML model
# 7. Upload the value into the rsentiment collection

alphavantage_api_key = os.environ["ALPHA_VANTAGE_API_KEY"]
ts = TimeSeries(key=alphavantage_api_key, output_format='pandas')

mongoClient = MongoClient(os.environ["DVA_FINAL_MONGODB_URL"])
db = mongoClient.liztd
submissions_collection = db.reddit_submissions
sentiments_collection = db.sentiments
comments_collection = db.reddit_comments


list_of_stocks = ['AAPL', 'AMD', 'AMZN', 'BABA', 'FB', 'GE', 'MSFT', 'MU', 'NFLX', 'NVDA', 'SNAP', 'TSLA']
#list_of_stocks = ['amd', 'amzn']
intercept = 0.002021405
sumCompoundCoef = 0.000597014
postCountCoef = 0.000004981
coef_values = [0.028481821, 0.002558829, -0.000212768, -0.026486343, -0.004830933, -0.000762938, -0.004225594, 0.000682018, 0.004120807, 0.024490887, 0.005592580]

end_date = date.today()
for stockIdx, stock in enumerate(list_of_stocks):
    start_date = end_date - timedelta(7)
    #f = web.DataReader(stock, "av-daily", start=start_date, end=end_date, access_key=os.environ["ALPHA_VANTAGE_API_KEY"])
    df = pd.DataFrame()
    df['close'] = ts.get_daily(symbol=stock, outputsize='full')[0].loc[str(start_date):str(end_date)]['4. close']
    df['pct2'] = df['close'].pct_change(periods=2).shift(-2)
    df['ticker'] = stock
    df = df.fillna(0.)

    for dte in df.index.values:
        dt = pd.to_datetime(dte)
        end_dt = date(dt.year, dt.month, dt.day)
        start_dt = end_dt - timedelta(1)
        count = submissions_collection.find({
            "$text": {
                "$search": stock
            },
                "created_utc": {
                    "$gte": calendar.timegm(start_dt.timetuple()),
                    "$lt": calendar.timegm(end_dt.timetuple())
            }
        }).count()

        aggValues = submissions_collection.aggregate([
            {
                "$match": {
                    "$text": {
                        "$search": stock
                    },
                    "created_utc": {
                        "$gte": calendar.timegm(start_dt.timetuple()),
                        "$lt": calendar.timegm(end_dt.timetuple())
                    }
                }
            },
            {
                "$group": {
                    "_id": '',
                    "totalCompound": {
                        "$sum": "$compound"
                    }
                }
            }
        ])
        sumCompound = 0. 
        aggregation_value = [aggval[u"totalCompound"] for aggval in aggValues]
        if len(aggregation_value) > 0:
            sumCompound = aggregation_value[0]

        pred = intercept + (sumCompoundCoef * sumCompound) + (postCountCoef * count) + coef_values[stockIdx]
        dte_str = str(end_dt.month) + '/' + str(end_dt.day) + '/' + str(end_dt.year)
        
        print(dte_str, stock, sumCompound, count, df['close'].loc[dte], df['pct2'].loc[dte], pred)

        sentiments_collection.update_one({
            "date": dte_str,
            "ticker": stock
        }, {
            "$set": {
                "date": dte_str,
                "ticker": stock,
                "sumCompound": sumCompound,
                "count": count,
                "close": df['close'].loc[dte],
                "pct2": df['pct2'].loc[dte],
                "pred": pred
            }
        }, upsert=True)
        
    print('sleeping for 20 seconds to avoid hitting rate limit')
    time.sleep(21)
    print('waking up')



            