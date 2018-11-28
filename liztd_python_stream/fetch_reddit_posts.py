# This file attempts to extract data from reddit database real time and load it into mongodb database

import praw
from pymongo import MongoClient
import os

# connection to mongodb
mongoClient = MongoClient(os.environ["DVA_FINAL_MONGODB_URL"])
db = mongoClient.liztd
submissions_collection = db.reddit_submissions
rsentiment_collection = db.sentiments
comments_collection = db.reddit_comments

reddit = praw.Reddit(client_id=os.environ["REDDIT_CLIENT_ID"],
                     client_secret=os.environ["REDDIT_CLIENT_SECRET"],
                     password=os.environ["REDDIT_PASSWORD"],
                     user_agent=os.environ["REDDIT_USER_AGENT"],
                     username=os.environ["REDDIT_USER_NAME"])

sub_reddit = ['wallstreetbets']
for s_r in sub_reddit:
    wsb_subreddit = reddit.subreddit(s_r)

    for submission in wsb_subreddit.stream.submissions():
        submissions_collection.update_one({"id": submission.id}, {
            "$set": {
                "created_utc" : submission.created_utc,
                "subreddit" : submission.subreddit.display_name,
                "author" : submission.author.name,
                "domain" : "self." + str(submission.subreddit.display_name),
                "url" : "https://www.reddit.com" + str(submission.permalink),
                "num_comments" : submission.num_comments,
                "score" : submission.score,
                "ups" : submission.ups,
                "downs" : submission.downs,
                "title" : submission.title,
                "selftext" : submission.selftext,
                "saved" : submission.saved,
                "id" : submission.id, # this field is unique
                "from_kind" : "",
                "gilded" : submission.gilded,
                "from" : "",
                "stickied" : submission.stickied,
                "retrieved_on" : "",
                "over_18" : submission.over_18,
                "thumbnail" : submission.thumbnail,
                "subreddit_id" : submission.subreddit_id,
                "hide_score" : submission.hide_score,
                "link_flair_css_class" : submission.link_flair_css_class,
                "author_flair_css_class" : submission.author_flair_css_class,
                "archived" : submission.archived,
                "is_self" : submission.is_self,
                "from_id" : "",
                "permalink" : submission.permalink,
                "name" : submission.name,
                "author_flair_text" : submission.author_flair_text,
                "quarantine" : submission.quarantine,
                "link_flair_text" : submission.link_flair_text,
                "distinguished" : submission.distinguished
            }
        }, upsert=True)
