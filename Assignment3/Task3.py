from flask import Flask, jsonify, request

app = Flask(__name__)
# Task 3: Implement error handling for the API requests to manage scenarios where the API returns an error code or is unavailable.

tasks = [
    {"id": 1, "title": "Learn Flask", "completed": False},
    {"id": 2, "title": "Write REST API", "completed": False},
]

# Get all tasks (GET)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        return jsonify(tasks), 200  
    except Exception as e:
        return jsonify({"error": "Failed to fetch tasks", "message": str(e)}), 500

# Get a single task (GET)
@app.route('/tasks/<int:taskID>', methods=['GET'])
def get_task(taskID):
    try:
        for task in tasks:
         if task["id"] == taskID:
            return jsonify(task), 200 
         else:
            return jsonify({"error": "Task not found"}), 404  
    except Exception as e:
        return jsonify({"error": "Failed to fetch task", "message": str(e)}), 500

# Add a new task (POST)
@app.route('/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()  #
        if not data or "title" not in data:
            return jsonify({"error": "Missing 'title' in request body"}), 400  

        new_task = {
            "id": len(tasks) + 1,
            "title": data["title"],
            "completed": False
        }
        tasks.append(new_task)
        return jsonify(new_task), 201  
    except Exception as e:
        return jsonify({"error": "Failed to add task", "message": str(e)}), 500

# Update an existing task (PUT)
@app.route('/tasks/<int:taskID>', methods=['PUT'])
def update_task(taskID):
    try:
        data = request.json
        
        for task in tasks:
            if task["id"] == taskID:
                task["title"] = data.get("title", task["title"])
                task["completed"] = data.get("completed", task["completed"])
                return jsonify(task), 200  
        
        return jsonify({"error": "Task not found"}), 404

    except Exception as e:
        return jsonify({"error": "Failed to update task", "message": str(e)}), 500

# Delete a task (DELETE)
@app.route('/tasks/<int:taskID>', methods=['DELETE'])
def delete_task(taskID):
    try:
        global tasks
        
        for task in tasks:
            if task["id"] == taskID:
                tasks.remove(task)
                return jsonify({"message": f"Task with ID {taskID} deleted successfully"}), 200  # Success message
        
        return jsonify({"error": "Task not found"}), 404

    except Exception as e:
        return jsonify({"error": "Failed to delete task", "message": str(e)}), 500

# Start the Flask App
def startApp():
    app.run(debug=True)
startApp()
