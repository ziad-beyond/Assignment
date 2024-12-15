import json

# Example dictionary
dictionary = {
    "name": "ZIAD",
    "age": 24,
    "city": "Riyadh"
}

# Function to convert Python dictionary to JSON string
def dictToJson(dictionary):
    # json.dumps used to convert Python dictionary to JSON string
    jsonString = json.dumps(dictionary)
    return jsonString

# Function to convert JSON string back to Python dictionary
def jsonToDict(jsonString):
    #json.loads used to convert JSON string to Python dictionary
    dictionary = json.loads(jsonString)
    return dictionary

# Convert dictionary to JSON string
jsonString = dictToJson(dictionary)
print("JSON string:", jsonString)

# Convert JSON string back to dictionary
convertedDict = jsonToDict(jsonString)
print("Converted dictionary:", convertedDict)
