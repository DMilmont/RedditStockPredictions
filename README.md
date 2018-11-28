# 6242Project
Denver project for cse 6242

MongoDB Cluster:

Scripts:
1) Export comments collection (before sentiment was calcuated)
	mongoexport --db liztd -c comments --out comments.csv --type csv --fields "author_flair_css_class,distinguished,ups,subreddit,body,score_hidden,archived,name,author,author_flair_text,downs,created_utc,subreddit_id,link_id,parent_id,score,retrieved_on,controversiality,gilded,id"

2) Export the submissions collection (before sentiment was calculated)
	mongoexport --db liztd -c submissions --out submissions.csv --type csv --fields "created_utc,subreddit,author,domain,url,num_comments,score,ups,downs,title,selftext,saved,id,from_kind,gilded,from,stickied,retrieved_on,over_18,thumbnail,subreddit_id,hide_score,link_flair_css_class,author_flair_css_class,archived,is_self,from_id,permalink,name,author_flair_text,quarantine,link_flair_text,distinguished"

3) Export the aggregated sentiments collection
mongoexport --db liztd -c reddit_sentiments --out sentiments.csv --type csv --fields "date,ticker,sumCompound,count,close,pct2,pred"

4) Importing it into local:
	mongoimport --host mongodb://://dvafinalproject-anotq.mongodb.net/liztd -c reddit_submissions --type csv --headerline --file submissions_with_sentiments.csv
	mongoimport --db liztd -c reddit_comments --type csv --headerline --file comments_with_sentiments.csv

5) Import to the cloud.mongodb.com shard
	mongoimport --host dvafinalproject-shard-0/dvafinalproject-shard-00-00-anotq.mongodb.net:27017,dvafinalproject-shard-00-01-anotq.mongodb.net:27017,dvafinalproject-shard-00-02-anotq.mongodb.net:27017 --ssl --username arvnan52 --password <PASSWORD> --authenticationDatabase admin --db liztd --collection reddit_submissions --type csv --file submissions_with_sentiments.csv --headerline
	mongoimport --host dvafinalproject-shard-0/dvafinalproject-shard-00-00-anotq.mongodb.net:27017,dvafinalproject-shard-00-01-anotq.mongodb.net:27017,dvafinalproject-shard-00-02-anotq.mongodb.net:27017 --ssl --username arvnan52 --password <PASSWORD> --authenticationDatabase admin --db liztd --collection reddit_comments --type csv --file comments_with_sentiments.csv --headerline
	mongoimport --host dvafinalproject-shard-0/dvafinalproject-shard-00-00-anotq.mongodb.net:27017,dvafinalproject-shard-00-01-anotq.mongodb.net:27017,dvafinalproject-shard-00-02-anotq.mongodb.net:27017 --ssl --username arvnan52 --password <PASSWORD> --authenticationDatabase admin --db liztd --collection sentiments --type csv --file sentiments.csv --headerline

Database connection and details
1. Connect to the cloud.mongodb.com (arvnan52/hp..)
2. The connection is enabled only from 2 IP's.
    a. My laptop
    b. The digitalocean server

mongo "mongodb+srv://dvafinalproject-anotq.mongodb.net/liztd" --username <username> --password <password>

3. Collections:
    a. reddit_submissions
        db.reddit_submissions.createIndex({title: "text", selftext: "text", id: 1, created_utc: 1})
    b. reddit_comments
        Indexes: db.reddit_comments.createIndex({parent_id: 'text', body: 'text', created_utc: 1, id: 1})
    c. sentiments
	This collection aggregates stock price with reddit sentiment analysis and final prediction
  

Digital Ocean droplet:
hostname: ubuntu-s-1vcpu-1gb-nyc1-01: 159.89.232.113

Domain:
liztd.com

The following fuctionalities were hosted on one ubuntu server hosted by digitalocean.

Daily Load:
The python script under CODE/liztd_python_load is setup as a cronjob to be executed every night.

Reddit Stream:
This is handled by the python script inside CODE/liztd_python_stream folder. This script has an open connection to monitor reddit 'wallstreetbets' stream and upload them into the mongodb database.

Tools:
PM2 - PM2 is a process mangement tool which is setup to keep the jobs running the scheduled time for data collection.

Web Application:
    API:
        The python bottlepy based web server is hosted as an api to the database and the frontend. The project is present in CODE/liztd_python_api
  
    UI: 
        The UI is created using ReactjS, evergreen library for UI components and Recharts for charting components. The scripts neccessary to run the web ui are 
        present at CODE/liztd_ui/readme.md file. 
  
