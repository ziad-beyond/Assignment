from flask import Flask, json, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt 

app = Flask(__name__)
CORS(app)  

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forms(
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             user_id INTEGER NOT NULL,
             title TEXT NOT NULL,
             description TEXT NOT NULL,
             fields TEXT NOT NULL,
             FOREIGN KEY (user_id) REFERENCES users(id)    
                         )                 
    ''' )

    cursor.execute(''' 
        CREATE TABLE IF NOT EXISTS form_submissions (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             form_id INTEGER NOT NULL,
             user_id INTEGER NOT NULL,
             submitted_data TEXT NOT NULL,
             FOREIGN KEY (form_id) REFERENCES forms(id)
             FOREIGN KEY (user_id) REFERENCES users(id)
             ) 
     ''')

    conn.commit()
    conn.close()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
     # Retrieve individual fields (name, email, password) from the JSON data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
     # connect the SQLite database
    conn = sqlite3.connect('database.db')
     # Create a cursor object to execute SQL queries
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
    # Retrieve the ID of the newly inserted user
    user_id = cursor.lastrowid
    # Save changes
    conn.commit()
    conn.close()
    
    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }), 201


@app.route('/signin', methods=['POST']) 
def signin():
     data = request.get_json()
     email = data.get('email')
     password = data.get('password')
     conn = sqlite3.connect('database.db') 
     cursor = conn.cursor()
     cursor.execute('SELECT id, name, password FROM users WHERE email = ?', (email,)) 
     user = cursor.fetchone() 
     conn.close()
     if user and user[2] == password: 
         return jsonify({ "message": "Sign-in successful", "user": { "id": user[0], "name": user[1], "email": email } }), 200 
     else: return jsonify({"message": "Invalid email or password"}), 401

@app.route('/forms',methods=["POST"])
def add_form():
    data = request.get_json()
    user_id=data.get('user_id')
    title=data.get('title')
    description=data.get('description')
    fields=data.get('fields')

    conn=sqlite3.connect('database.db')
    cursor=conn.cursor()
    cursor.execute('INSERT INTO forms (user_id, title, description, fields) VALUES (?, ?, ?, ?)',(user_id, title, description, fields))
    form_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({ "message": "Form created successfully",
                     "form": { "id": form_id, "user_id": user_id, "title": title, "description": description, "fields": fields } }),201

@app.route('/get_forms',methods=['GET'])
def get_forms():
    user_id=request.args.get('user_id')

    if not user_id:
        return jsonify({"massage":"User ID is required"}),400
    
    conn=sqlite3.connect('database.db')
    cursor=conn.cursor()
    cursor.execute('SELECT id,title,description,fields FROM forms WHERE user_id =?',(user_id))
    forms=cursor.fetchall()
    conn.close()
    forms_list=[{"id":form[0],'title':form[1],"description":form[2],"fields":form[3]}for form in forms]
    return jsonify(forms_list),200


@app.route('/get_form/<int:id>', methods=['GET'])
def get_form(id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, user_id, title, description, fields FROM forms WHERE id = ?', (id,))
    form = cursor.fetchone()
    conn.close()
    
    if form:
        form_details = {"id": form[0], "user_id": form[1], "title": form[2], "description": form[3], "fields": form[4]}
        return jsonify(form_details), 200
    else:
        return jsonify({"message": "Form not found"}), 404
    
@app.route('/submit_form/<int:id>', methods=['POST'])
def submit_form(id):
    data = request.get_json()
    print("Received data:", data)  
    formData = data.get('formData') 
    user_id = data.get('user_id') 
    if not formData or not user_id:
        return jsonify({"message": "Invalid data received"}), 400

    conn = sqlite3.connect('database.db') 
    cursor = conn.cursor() 
    try: 
        cursor.execute( 
            'INSERT INTO form_submissions (form_id, user_id, submitted_data) VALUES (?, ?, ?)',
            (id, user_id, json.dumps(formData))
        ) 
        conn.commit() 
        response = jsonify({"message": "Form submitted successfully"}) 
        response.status_code = 200 
    except sqlite3.Error as e: 
        conn.rollback()
        print(f"Database error: {e}")
        response = jsonify({"message": "Form submission failed"})
        response.status_code = 500 
    finally: 
        conn.close() 
    return response

@app.route('/get_replies/<int:form_id>', methods=['GET'])
def get_replies(form_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, form_id, user_id, submitted_data FROM form_submissions WHERE form_id = ?', (form_id,))
    
    replies = cursor.fetchall()
    conn.close()
    
    replies_data = []
    for reply in replies:
        replies_data.append({
            "id": reply[0],
            "form_id": reply[1],
            "user_id": reply[2],
            "submitted_data": json.loads(reply[3])  
        })
    
    return jsonify(replies_data)


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
