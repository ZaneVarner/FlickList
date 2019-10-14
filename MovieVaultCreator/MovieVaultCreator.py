import requests
from pprint import pprint
import pymongo

# import dnspython

currentID = ''
movieCount = 0
movies = set()

myclient = pymongo.MongoClient("mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority")

# mydb = myclient["mydatabase"]
# mycol = mydb["customers"]

mydb = myclient["movies1"]
mycol = mydb["movies"]

# mydict = { "name": "John", "address": "Highway 37" }

# x = mycol.insert_one(mydict)

# print(x.inserted_id)

myquery = { 'ID': 'tt0111160'}
mydoc = mycol.find(myquery)

if not mydoc.count():
	print("Not found")
else:
	print("found")

for i in range(111161, 111191):
	currentID = 'tt' + str(i).zfill(7)
	request = requests.get('http://www.omdbapi.com/?apikey=44664e4&i=' + currentID)
	data = request.json()
	if data['Response'] == 'True':
		if data['Country'] == 'USA' and data['Type'] == 'movie' and data['Poster'] != 'N/A' and 'Adult' not in data['Genre'] and 'Short' not in data['Genre']:
			movieCount += 1
			movies.add(data['Title'])
			entry = { 'Title': data['Title'], 'Year': data['Year'], 'Genre': data['Genre'], 'ID': data['imdbID'], 'Rating': data['imdbRating'], 'Votes': data['imdbVotes'], 'Poster': data['Poster'] }
			if not mycol.find({ 'ID': entry['ID']}).count():
				mycol.insert_one(entry)
			print(str(i) + ' Valid Movie!')
		else:
			print(str(i) + ' Valid Response, Invalid Movie')
	else:
		print(str(i) + ' Error Response')

# for i in range(999, 1000):
# 	currentID = 'tt' + str(i).zfill(7)
# 	request = requests.get('http://www.omdbapi.com/?apikey=44664e4&i=' + currentID)
# 	data = request.json()
# 	if data['Response'] == 'True':
# 		if data['Country'] == 'USA' and data['Type'] == 'movie' and data['Poster'] != 'N/A' and 'Adult' not in data['Genre'] and 'Short' not in data['Genre']:
# 			movieCount += 1
# 			movies.add(data['Title'])
# 			print(str(i) + ' Valid Movie!')
# 		else:
# 			print(str(i) + ' Valid Response, Invalid Movie')
# 	else:
# 		print(str(i) + ' Error Response')

print(movieCount)
print(str(movies))