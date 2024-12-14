import uuid
from flask import Flask, jsonify, request

# initializing the Flask application
app = Flask(__name__)

# to-do list
tasks = []
nextID = 1

# 1-GET: Retrieve a list of all tasks in a to-do list.
@app.route('/tasks', methods=['GET'])
def getTasks():
    #Conversion objects to JSON format.
    return jsonify(tasks)
# GET: Retrieve a specific task by ID.
@app.route('/tasks/<int:taskID>', methods=['GET'])
def getTaskByID(taskID):
    # Find the task with the his ID
    for task in tasks:
        if task["id"] == taskID:
            return jsonify(task)
    

#2- POST: Add a new task to the to-do list.
@app.route("/tasks", methods=["POST"])
def addTasks():
     global nextID  
     data = request.json
 # Create a new task with a UUID as the ID
     newTask = {
            "id":nextID ,
            "title": data["title"],
            "completed": False
        }
     tasks.append(newTask)
     nextID += 1
     return jsonify(newTask)


#3-PUT: Update a task’s details.
@app.route('/tasks/<int:taskID>', methods=['PUT'])
def updateTask(taskID):
    data = request.json
    for task in tasks:
        if task["id"] == taskID:
            task["title"] = data.get("title", task["title"])
            task["completed"] = data.get("completed", task["completed"])
            return jsonify(task)
    return {"error": "Task not found"}
#4-DELETE: Remove a task from the list.
@app.route('/tasks/<int:taskID>', methods=['DELETE'])
def deleteTask(taskID):
    global tasks
    tasks = [task for task in tasks if task["id"] != taskID]
    return jsonify({"message": f"Task with ID {taskID} deleted successfully"}), 200


   
# Run the Flask App
def startApp():
    app.run(debug=True)

startApp()