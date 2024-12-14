from flask import Flask, jsonify
import requests

app = Flask(__name__)

# URL for the JokeAPI
API_URL = "https://v2.jokeapi.dev/joke/Any?type=single"

# Function to get a random joke
def getJoke():
    # Send GET request to JokeAPI
    response = requests.get(API_URL)

    # Parse the JSON response
    data = response.json()

    if response.status_code == 200:
        if "joke" in data:
            return data["joke"]
        else:
            return "Sorry, no joke found."
    else:
        return "Failed to get joke. Please try again later."

# Route for the root URL
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Joke API Visit /joke to get a random joke."

# Define a route to show the joke
@app.route('/joke', methods=['GET'])
def joke():
    joke = getJoke()
    return jsonify({"joke": joke})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
