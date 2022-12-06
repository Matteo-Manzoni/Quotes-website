"""
 Application of Programming Principles
 Assignment Template 2021-22 - Flask & Python
 
"""
from flask import Flask, render_template, jsonify, request, make_response
import sys, json, os, random

app = Flask(__name__)



file = open ("quote.json")
quotes = json.load(file)['quotes']


@app.route('/')
def home():
    return render_template('index.html')



# Journal functions

@app.route("/generate", methods=["GET"])
def generate():
  return random.choice(quotes)


@app.route("/api/quote", methods=['GET'])
def quote():
    """
    Write a function to
        read the entries in the file containing the journal entries in the data folder
        format the result into JSON response object
        return the JSON response object
    """
    # file_name = "data/journal_test.json"
    site_root = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(site_root, "quote.json")

    # with keyword deals with closing file etc.
    with open(json_url, 'r') as openfile:
        # Reading from json file
        json_object = json.load(openfile)
    return json_object


@app.route("/api/quote", methods=['PUT'])
def upload():
    print('saving Quote')
    messageOK = jsonify(message="Journals uploaded!")
    messageFail = jsonify(message="Uploading Journals failed as dats not in JSON format!")
    if request.is_json:
        # Parse the JSON into a Python dictionary
        req = request.get_json()
        # Print the dictionary
        print(req)
        #save json to file
        # file_name = "data/journal_test.json"
        site_root = os.path.realpath(os.path.dirname(__file__))
        json_url = os.path.join(site_root, "quote.json")

        # with keyword deals with closing file etc.
        with open(json_url, 'w') as openfile:
          json.dump(req, openfile)
          

        # Return a string along with an HTTP status code
        return messageOK, 200

    else:

        # The request body wasn't JSON so return a 400 HTTP status code
        return messageFail, 400


# run app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)