from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
from flask import Flask, send_from_directory

# Tweepy
from tweepy import OAuthHandler
from tweepy import API
from tweepy import Cursor

# Reddit API
import praw

# Other Modules
import os
import json
import re
import csv
import pickle
import gzip
import requests
from os.path import join, dirname

# watson
from ibm_watson import PersonalityInsightsV3
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions,SentimentOptions

# Scikit leanr
from sklearn.metrics.pairwise import cosine_similarity

app=Flask(__name__,static_folder='./client/build/')

# Twitter Api Credentials
consumer_key="29t0d6bCnEPbWynevgwubCWAZ"
consumer_secret="mMCuy5v8AkkeqIuePQrHShd8GNrHF1BauHgiqq1devTkTIPeVo"
access_token="1147464618618437632-x4oiaSK6ORIySsJML05KYIKMTpyn4H"
access_token_secret="iASo6JMo7lyE4ZGAQWQhUD2ztdpmcQJCSPjijuAIiV5Cg"

# CORS
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


# Authentication
auth=OAuthHandler(consumer_key,consumer_secret)
auth.set_access_token(access_token,access_token_secret)
auth_api=API(auth)

# Load model for prediction
with open('cluster_model.pkl', 'rb') as f:
    u = pickle._Unpickler(f)
    u.encoding = 'latin1'
    kmeans = u.load()

#Routes
@app.route('/api/getUserDetails',methods=['GET'])
#get user details from twitter api
def getUserDetails():
    # Get twitter data
    twitter_name=request.args.get('twitter_name')
    item=auth_api.get_user(twitter_name)
    tweets=item.statuses_count
    friends=[]
    subreddits_data=[]
    stackoverflow_data=[]
    # get friends name and append it to the list
    for friend in item.friends():
        friends.append(friend.screen_name)
    
    # get reddit details
    reddit_name=request.args.get('reddit_name')
    reddit_password=request.args.get('reddit_password')
    print("name=>",reddit_name)
    print("pass=>",reddit_password)


    if(reddit_name!="" and reddit_password!=""):
        reddit = praw.Reddit(client_id='HGC7TexWpFF0jA', \
                        client_secret='9YLf_ggPESEVr2dtrlU_7p_bNeE', \
                        user_agent='IBMHack', \
                        username=reddit_name, \
                        password=reddit_password)

        # Get subreddits
        subreddits=reddit.user.subreddits(limit=100)
        for reddit_item in subreddits:
            subreddits_data.append(reddit_item.display_name)
    
    # Get Stack OverFlow Tags
    stackoverflow_id=request.args.get("stackOverflowID")

    if(stackoverflow_id!=""):
        stackapi_url="https://api.stackexchange.com/2.2/users/"+stackoverflow_id+"/tags?order=desc&sort=popular&site=stackoverflow"
        r=requests.get(url=stackapi_url)
        stack_data=r.json()
        stackoverflow_data.append(stack_data)   

    data={
        "name":item.name,
        "screen_name":item.screen_name,
        "friends":friends,
        "tweets_count":tweets,
        "friends_count":len(friends),
        "profile_pic_url":item.profile_image_url,
        "subreddits":subreddits_data,
        "stackoverflow_data":stackoverflow_data
    }

    return jsonify(data)

# Get User Tweets and Calculate Personality Insights
@app.route('/api/getUserTweetsAndCalcInsights/<username>',methods=['GET'])
def getUserTweetsAndCalcInsights(username):
    item=auth_api.get_user(username)
    tweets=[]
    tweet_count=0

    # dict for writing data in json file
    jsonData={'contentItems':[]}
    for status in Cursor(auth_api.user_timeline,id=username).items():
        tweet_count+=1
        # remove mentions and hashtags
        modifiedtext = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",status.text).split())
        data={'content':modifiedtext,'contenttype':'text/html','language':'en'}
        jsonData['contentItems'].append(data)
        
        # Write data to file
        with open('userTweets.json', 'w') as json_file:  
            json.dump(jsonData, json_file, sort_keys=True, indent=4)

        # append the cleaned text too tweets array
        tweets.append(modifiedtext)

        if tweet_count==200:
            break
    
    # Store the tweets for later use
    data={
        'tweets':tweets
    }
    
    
    
    # Calculate Personality Insights

    # watson credentials
    personality_insights = PersonalityInsightsV3(
    version='2017-10-13',
    iam_apikey='-IFM85VuJKlrRBmOmDkQmBCfTCFk-x58w-YSmXyCjrEV',
    url='https://gateway-lon.watsonplatform.net/personality-insights/api'
	)

    # open the file which contains the tweets for the username
    with open(join(dirname(__file__), './userTweets.json')) as profile_json:
        profile = personality_insights.profile(profile_json.read(),'application/json',content_type='application/json',consumption_preferences=True,raw_scores=True).get_result()	
       

        # Getting Specific data for predicting the cluster
        openess=json.dumps(profile['personality'][0]["percentile"])
        conscientiousness=json.dumps(profile['personality'][1]["percentile"])
        extraversion=json.dumps(profile['personality'][2]["percentile"])
        agreeableness=json.dumps(profile['personality'][3]["percentile"])
        emotional_range=json.dumps(profile['personality'][4]["percentile"])
        fields=[openess,conscientiousness,extraversion,agreeableness,emotional_range]

        # Prediction 
        cluster=kmeans.predict([fields])
        if(int(cluster[0])==0):
            cluster_text="Moderate Positivity"
        elif int(cluster[0])==1:
            cluster_text="High Positivity"
        else:
            cluster_text="Low Positivity"

        profile['cluster']=cluster_text
        profile['cluster_type']=int(cluster[0])
        result=json.dumps(profile, indent=2)

    return result

# Get Sentiment Analysis
@app.route('/api/getSentimentAnalysis/',methods=['GET'])
def getData():
    # Open the tweets file and grab the content only
    sentimentAnalysisString=""
    with open('userTweets.json','r') as f:
        tweets=json.load(f)
    for i in range(len(tweets['contentItems'])):
        sentimentAnalysisString+=(tweets['contentItems'][i]['content'])+"\n"
    
    # Sentiment Analysis
    natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2018-11-16',
    iam_apikey='e4FDmd_cn5Qd_qUq932QPpZQmlUSYEcJ9gfEUeeLCuJI',
    url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api')

    response = natural_language_understanding.analyze(
	    text=sentimentAnalysisString,
	    features=Features(sentiment=SentimentOptions())).get_result()
    return(json.dumps(response, indent=2))


############################# FRIENDS ANALYSIS #############################################

# Get Friends Tweets And Calculate Personality Insights
@app.route('/api/getFriendsData/',methods=['GET','POST'])
def getFriendsTweetsAndCalcPersonalityInsights():
    
    username=request.args.get('username')
    reddit_name=request.args.get('redditName')
    stackoverflowid=request.args.get('stackOverflowID')

    item=auth_api.get_user(username)
    tweets=[]
    tweet_count=0

    # dict for writing data in json file
    jsonData={'contentItems':[]}
    for status in Cursor(auth_api.user_timeline,id=username).items():
        tweet_count+=1
        # remove mentions and hashtags
        modifiedtext = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",status.text).split())
        data={'content':modifiedtext,'contenttype':'text/html','language':'en'}
        jsonData['contentItems'].append(data)
        
        # Write data to file
        with open('friendsTweets.json', 'w') as json_file:  
            json.dump(jsonData, json_file, sort_keys=True, indent=4)

        # append the cleaned text too tweets array
        tweets.append(modifiedtext)

        if tweet_count==200:
            break
    
    
        

    #Store the tweets for later use
    data={
        'tweets':tweets
    }

    # Calculate Personality Insights

    # watson credentials
    personality_insights = PersonalityInsightsV3(
    version='2017-10-13',
    iam_apikey='-IFM85VuJKlrRBmOmDkQmBCfTCFk-x58w-YSmXyCjrEV',
    url='https://gateway-lon.watsonplatform.net/personality-insights/api'
	)

    # open the file which contains the tweets for the username
    with open(join(dirname(__file__), './friendsTweets.json')) as profile_json:
        profile = personality_insights.profile(profile_json.read(),'application/json',content_type='application/json',consumption_preferences=True,raw_scores=True).get_result()	
        profile['name']=item.name
        profile['screen_name']=item.screen_name
        profile['profile_pic_url']=item.profile_image_url

        # Get Stack OverFlow Tags
        
        if(stackoverflowid!=None or stackoverflowid!=""):
            stackapi_url="https://api.stackexchange.com/2.2/users/"+stackoverflowid+"/tags?order=desc&sort=popular&site=stackoverflow"
            r=requests.get(url=stackapi_url)
            friends_stack_data=r.json()
            profile['stackoverflow_data']=friends_stack_data

        # Getting Specific data for predicting the cluster
        openess=json.dumps(profile['personality'][0]["percentile"])
        conscientiousness=json.dumps(profile['personality'][1]["percentile"])
        extraversion=json.dumps(profile['personality'][2]["percentile"])
        agreeableness=json.dumps(profile['personality'][3]["percentile"])
        emotional_range=json.dumps(profile['personality'][4]["percentile"])
        fields=[openess,conscientiousness,extraversion,agreeableness,emotional_range]

         # Prediction 
        cluster=kmeans.predict([fields])
        if(int(cluster[0])==0):
            cluster_text="Moderate Positivity"
        elif int(cluster[0])==1:
            cluster_text="High Positivity"
        else:
            cluster_text="Low Positivity"

        profile['cluster']=cluster_text
        profile['cluster_type']=int(cluster[0])
        

        # Calculate Similarity
        userList=request.args.get('userList')
        userList=userList.split(',')
        matchPercent = cosine_similarity([userList], [fields])
        profile['match_percent']=str(matchPercent[0][0])

        result=json.dumps(profile, indent=2)
    print("got result for =>",username)
    return result    

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)