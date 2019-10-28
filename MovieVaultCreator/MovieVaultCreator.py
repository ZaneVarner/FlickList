import requests
import pymongo

# Create MongoDB Client
myclient = pymongo.MongoClient("mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority")
# Create Database and Collection
mydb = myclient["movies1"]
mycol = mydb["movies"]

# Current movie number being processed
currentID = ''
# Count of valid movies added to database
movieCount = 0

for i in range(7286450, 7286460):

	# Create proper IMDb ID from number
	currentID = 'tt' + str(i).zfill(7)

	# NOTE: All predictable errors are accounted for below.
	# If a completely unexpected error occurs, skip movie.
	try:
		# Request data from OMDb API
		request = requests.get('http://www.omdbapi.com/?apikey=44664e4&i=' + currentID)
		data = request.json()

		# API Request Must Produce Valid Response
		if data['Response'] == 'True':
			# Data MUST have:
			#	Valid Title and Year
			#	Year of 1930 or later
			#	Country of USA
			#	Type 'movie'
			#	Available Poster
			#	Available Genre
			#	Available Cast
			#	Available Plot
			#	No Adult Content
			#	No Short Films
			if 'USA' in data['Country'] and data['Type'] == 'movie' and data['Title'] != 'N/A' and data['Year'] != 'N/A' and int(data['Year']) > 1929 and data['Poster'] != 'N/A' and data['Plot'] != 'N/A' and data['Genre'] != 'N/A' and data['Actors'] != 'N/A' and data['imdbVotes'] != 'N/A' and data['imdbRating'] != 'N/A' and 'Adult' not in data['Genre'] and 'Short' not in data['Genre']:
				# Increment Count of Valid Movies
				movieCount += 1

				# Create a new database entry
				entry = {}

				# Add Title, Year, Poster, Plot
				entry['Title'] = data['Title']
				entry['Year'] = int(data['Year'])
				entry['Poster'] = data['Poster']
				entry['Plot'] = data['Plot']

				# Create Arrays for Genres and Cast
				entry['Genre'] = data['Genre'].split(', ')
				entry['Cast'] = data['Actors'].split(', ')

				# Add IMDb info
				# IMDb Votes represented as int
				# IMDb Rating represented as float
				entry['imdbID'] = data['imdbID']
				entry['imdbVotes'] = int(data['imdbVotes'].replace(',',''))
				entry['imdbRating'] = float(data['imdbRating'])

				# Initialize so these keys exist.  Will be replaced below if possible.
				entry['rottenTomatoesRating'] = None
				entry['metacriticRating'] = None

				# Get ratings from 'Ratings' array returned by OMDb API
				for rating in data['Ratings']:
					if rating['Source'] == 'Rotten Tomatoes':
						entry['rottenTomatoesRating'] = int(rating['Value'].split('%')[0])
					elif rating['Source'] == 'Metacritic':
						entry['metacriticRating'] = int(rating['Value'].split('/')[0])

				# Only add to database if movie does not yet exist
				if not mycol.find({ 'imdbID': entry['imdbID']}).count():
					mycol.insert_one(entry)
				
				print(str(i) + ' Valid Movie!')
			else:
				print(str(i) + ' Valid Response, Invalid Movie')
		else:
			print(str(i) + ' Error Response')
	except:
		pass

print("Total Movies Added: " + str(movieCount))