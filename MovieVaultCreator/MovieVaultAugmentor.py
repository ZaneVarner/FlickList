import requests
import pymongo
import pprint
from urllib.request import urlopen
from bs4 import BeautifulSoup
from multiprocessing import Pool

# CREATE A CAST LIST WEB SCRAPING FUNCTION

# Returns the full HTML of a given URL
def get_page_html(url):
	client = urlopen(url)
	page_html = client.read()
	client.close()
	return page_html

# Returns a Beautiful Soup object representation a webpage
def get_soup(url):
	page_html = get_page_html(url)
	soup = BeautifulSoup(page_html, 'html.parser')
	return soup

# Returns a Dictionary containing Actor:Character pairs (max 10)
def get_cast(imdbID):
	full_credits_url = 'https://www.imdb.com/title/' + imdbID + '/fullcredits?ref_=tt_cl_sm#cast'
	soup = get_soup(full_credits_url)

	# Find the cast list table on the HTML file, create array of table entries
	cast_table_container = soup.find('table', {'class':'cast_list'})
	cast_member_containers = cast_table_container.findAll('tr', {'class':['odd', 'even']})

	# Cast member list, dictionary, and size of dictionary
	cast_list = []
	cast_dict = {}
	cast_size = 0

	# For each entry in the cast list table
	for container in cast_member_containers:

		# Extract the name from the appropriate element
		name_container = container.find('td', {'class':'primary_photo'})
		name = name_container.img['title']

		# Extract the character from the appropriate element
		character_container = container.find('td', {'class':'character'})
		character_text = character_container.text
		character = ' '.join(character_text.split())

		# Add result to cast list and character dictionary
		cast_list.append(name)
		# Dictionaries cannot contain periods within keys
		cast_dict[name.replace('.', '%')] = character
		cast_size += 1

		# Only add up to 10 cast members
		if cast_size >= 10:
			break

	return cast_list, cast_dict


# CONNECT TO MONGODB
	
# Create MongoDB Client
myclient = pymongo.MongoClient("mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority")

# Create Database and Collection
mydb = myclient["movies1"]
mycol = mydb["movies"]
newcol = mydb["movies3"]


# CREATE A FUNCTION TO AUGMENT DOCUMENT AND ADD TO NEW COLLECTION

def augment_document(document):

	# If a completely unexpected error occurs, skip movie
	try:

		# Request data from OMDb API
		request = requests.get('http://www.omdbapi.com/?apikey=44664e4&i=' + document['imdbID'] + '&plot=full')
		data = request.json()

		# Add new IMDb-scraped cast, do nothing if error occurs
		try:
			new_cast = get_cast(document['imdbID'])
			document['Cast'] = new_cast[0]
			document['Characters'] = new_cast[1]
		except:
			print('An error occurred getting new cast.')


		# Add various new parameters
		# Leave null values if unavailable

		if (data['Plot'] != 'N/A'):
			document['Plot_Full'] = data['Plot']
		else:
			document['Plot_Full'] = None

		if (data['Rated'] != 'N/A'):
			document['Rated'] = data['Rated']
		else:
			document['Rated'] = None

		if (data['Released'] != 'N/A'):
			document['Released'] = data['Released']
		else:
			document['Released'] = None

		if (data['Runtime'] != 'N/A'):
			document['Runtime'] = int(data['Runtime'].split(' ')[0])
		else:
			document['Runtime'] = None

		if (data['Director'] != 'N/A'):
			document['Directors'] = data['Director'].split(', ')
		else:
			document['Directors'] = None

		if (data['Writer'] != 'N/A'):
			document['Writers'] = data['Writer'].split(', ')
		else:
			document['Writers'] = None

		if (data['Awards'] != 'N/A'):
			document['Awards'] = data['Awards']
		else:
			document['Awards'] = None

		if not newcol.find({ 'imdbID': document['imdbID']}).count():
			newcol.insert_one(document)
			print('Successfully augmented document.')

	except:
		print('An unexpected error occurred')


# MAIN METHOD CONNECTS TO MONGODB AND AUGMENTS DOCUMENTS

if __name__ == '__main__':

	# Create a multiprocessing pool
	pool = Pool()

	# Process all documents iterable with pool
	documents = mycol.find()
	result = pool.map(augment_document, documents)
	pool.close()
	pool.join()