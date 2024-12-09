# Task 3: Implement a program that manages a collection of unique student IDs using a set. 


# create an empty set to store student IDs 
studentIDs=set()

#1- A funcation to Adding new student IDs.
def add_studentID(ID):
    if ID in studentIDs:
        print(f"student ID {ID} is already exists.")
    else:
        studentIDs.add(ID)
        print(f"added student ID {ID}")

add_studentID(400214)
add_studentID(400316)
add_studentID(400846)


#2- A funcation to remove new student IDs.
def remove_studentID(ID):
    if ID in studentIDs:
        studentIDs.remove(ID)
        print(f"remove student ID {ID}")
    else:
        print(f"student ID not found")

remove_studentID(400214)

#3- Checking if a specific student ID is in the set.

def searching_studentID(ID):
     if ID in studentIDs:
        print(f"Student ID {ID} exists.")
     else:
        print(f"Student ID {ID} does not exist.")
searching_studentID(400316)

#4- Displaying all student IDs in the set.
def display_studentID():
    print("All Student ID :", studentIDs)

display_studentID()