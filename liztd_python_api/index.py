from bottle import route, run, template, request, response
from pymongo import MongoClient
import pandas as pd
import json

# connection to mongodb
mongoClient = MongoClient('localhost', 27017)
db = mongoClient.liztd
c_submissions = db.reddit_submissions
c_comments = db.reddit_comments
c_reddit_sentiments = db.reddit_sentiments


# the decorator
def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        # set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if request.method != 'OPTIONS':
            # actual request; reply with the actual response
            return fn(*args, **kwargs)

    return _enable_cors

@route('/info/<ticker>')
@enable_cors
def index(ticker):
    resp = []
    for info in c_reddit_sentiments.find({"ticker": ticker}, {"_id": 0}):
        resp.append(info)
    return json.dumps(resp)

@route('/posts/<ticker>')
@enable_cors
def returnPosts(ticker):
    '''resp = []
    for posts in c_submissions.find({
        "$text": {
            "$search": ticker
        },
    }, {"_id": 0, "id": 1, "title": 1, "selftext": 1, "compound": 1}):
        resp.append(posts)
    return json.dumps(resp)'''
    return json.dumps(list(
         c_submissions.find({
            "$text": {
                "$search": ticker
            },
        }, {"_id": 0, "id": 1, "title": 1, "selftext": 1, "compound": 1})
    ))

run(host='localhost', port=8080)