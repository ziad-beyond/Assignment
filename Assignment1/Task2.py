# Task 2 : Create a simple to-do list program that uses a list to store tasks.

# list to store tasks
completeTask=[]
pendingTask = []

#1- A Function to add a task
def add_task(task):
    pendingTask.append(task)
    print(f"Task {task} added.")

add_task("Buy a car")
add_task("Go to italy")
add_task("Deliver the assignment")

#2= A Function to remove a task
def remove_task(task):
    if task in pendingTask:
        pendingTask.remove(task)
        print(f"Task {task} removed.")
    else:
        print(f"Task {task} not found.")

remove_task("Buy a car")


#3- A Function to mark a task as complete
def complete_task(task):
    if task in pendingTask:
        pendingTask.remove(task)
        completeTask.append(task)
        print(f"Task {task} marked as complete.")
    else:
        print(f"Task {task} not found.")

complete_task("Deliver the assignment")


#4- A Function to display all tasks
def display_tasks():
    print("Pending Tasks:", pendingTask)
    print("Completed Tasks:", completeTask)

display_tasks()

