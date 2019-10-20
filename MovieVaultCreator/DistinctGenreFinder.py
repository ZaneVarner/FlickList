import requests
import pymongo

# Create MongoDB Client
myclient = pymongo.MongoClient("mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority")
# Create Database and Collection
mydb = myclient["movies1"]
mycol = mydb["movies"]

# Find all distinct genres in database, sort alphabetically
genres = sorted(mycol.distinct('Genre'))

# Print list of genres
for genre in genres:
	print(genre)