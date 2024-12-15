import requests
import json

File="pokemon_data.json"

def fetchAndSave():
    # URL the Pokemon
    API_URL = "https://pokeapi.co/api/v2/pokemon?limit=10"
    # Send GET request to Pokemon API
    response=requests.get(API_URL)
    # Parse the JSON response
    data=response.json()
    with open(File,"w")as file:
        json.dump(data,file,indent=4)
    print("Data saved to file.")

def loadAndDisplay():
   #Load data from the file and display it.
    with open(File,"r")as file:
        data=json.load(file)
        for Pokemon in data["results"]:
            print(Pokemon["name"])

fetchAndSave()
loadAndDisplay()




    
