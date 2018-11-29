import os
from datetime import datetime, date, timedelta
import calendar
import praw
from praw.models import MoreComments
from pymongo import MongoClient
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

reddit = praw.Reddit(client_id=os.environ["REDDIT_CLIENT_ID"],
                     client_secret=os.environ["REDDIT_CLIENT_SECRET"],
                     password=os.environ["REDDIT_PASSWORD"],
                     user_agent=os.environ["REDDIT_USER_AGENT"],
                     username=os.environ["REDDIT_USER_NAME"])

mongoClient = MongoClient(os.environ["DVA_FINAL_MONGODB_URL"])
db = mongoClient.liztd
submissions_collection = db.reddit_submissions
rsentiment_collection = db.sentiments
comments_collection = db.reddit_comments

sentiment_analyzer = SentimentIntensityAnalyzer()

# get posts for today
end_dt = date.today()
start_dt = date.today() - timedelta(1)
'''submissions_today = submissions_collection.find({
                        "created_utc": {
                            "$gte": calendar.timegm(start_dt.timetuple()),
                            "$lt": calendar.timegm(end_dt.timetuple())
                        }
                    })'''

# fetch all the posts who do not have any sentiment values tagged
submissions_today = submissions_collection.find({"compound": None})

for s in submissions_today:
    s_id = s[u'id']
    s_title = s[u'title']
    s_selftext = s[u'selftext']
    vs_post = sentiment_analyzer.polarity_scores(s_title)
    
    negTotal = vs_post[u"neg"]
    posTotal = vs_post[u"pos"]
    neuTotal = vs_post[u"neu"]
    compoundTotal = vs_post[u"compound"]
    p = reddit.submission(id=s_id)
    for comment_id in p.comments.replace_more(limit=None):
        try:
            c = reddit.comment(comment_id)
        except praw.exceptions.PRAWException:
            break
        
        if isinstance(c, MoreComments):
            print('c is instance of more comments')
            break
        # get sentiment of the comment
        vs_comment = sentiment_analyzer.polarity_scores(c.body)

        displayName = None
        authorName = None
        if c.subreddit is not None:
            displayName = c.subreddit.display_name

        if c.author is not None:
            authorName = c.author.name

        # create or upsert the comment into the comments db
        comments_collection.update_one({"id": c.id}, {
            "$set": {
                "author_flair_css_class" : c.author_flair_css_class,
                "distinguished" : c.distinguished,
                "ups" : c.ups,
                "subreddit" : displayName,
                "body": c.body,
                "score_hidden": c.score_hidden,
                "archived" : c.archived,
                "name": c.name,
                "author_flair_text" : c.author_flair_text,
                "author" : authorName,
                "downs": c.downs,
                "created_utc" : c.created_utc,
                "subreddit_id" : c.subreddit_id,
                "link_id": c.link_id,
                "parent_id": c.parent_id,
                "score": c.score,
                "retrieved_on" : "",
                "controversiality": c.controversiality,
                "gilded" : c.gilded,
                "id": c.id,
                "neg": vs_comment[u'neg'],
                "pos": vs_comment[u'pos'],
                "neu": vs_comment[u'neu'],
                "compound": vs_comment[u'compound'],
            }
        }, upsert=True)

        # add the sentiments into the post
        negTotal += vs_comment[u'neg']
        posTotal += vs_comment[u'pos']
        neuTotal += vs_comment[u'neu']
        compoundTotal += vs_comment[u'compound']

    # upload the sentiment total into the post for mongodb
    submissions_collection.update_one({'id': s[u'id']},{
        "$set": {
            "neg": negTotal,
            "pos": posTotal,
            "neu": neuTotal,
            "compound": compoundTotal,
            "num_comments": p.num_comments
        }
    })
    print(s[u'id'], negTotal, posTotal, neuTotal, compoundTotal)



