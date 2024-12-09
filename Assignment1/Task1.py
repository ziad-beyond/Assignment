# Task 1 : Create a program that tracks inventory for a small store. Use a dictionary where each key is an item name and the value is the quantity in stock. 

# dictionary to store items
inventory = {}
#1- A function to add items to the inventory.
def add_item(inventory,item,quantity):
    if item in inventory :
        inventory[item]+=quantity
    else :
         inventory[item] = quantity
    return inventory

# use funcation to add items 
add_item(inventory, 'orange', 7)
add_item(inventory, 'apple', 3)
add_item(inventory, 'banana', 2)

print("inventory:",inventory)

#2- A function to remove items from the inventory.
def remove_items(inventory,item):
    if item in inventory:
        del inventory[item]
        print(f"{item} has been removed from the inventory.")
    else: print(f"{item} not found.")

# use funcation to remove items
remove_items(inventory,'banana')
print("inventory:",inventory)

#3- A function to update items from the inventory.

def update_item (inventory,item,quantity):
 if item in inventory :
        inventory[item]+=quantity 
        print(f"{item} is updated and its quantity is now is {inventory[item]}")
 else:
        print(f"{item} does not exist in the inventory.")
# use funcation to update items
update_item(inventory,"apple",2)

#4- A function to display all items in the inventory, sorted by item name.
def sorted_inventory (inventory):
    if not inventory:
        print("The inventory is empty.")
    else:
        print("Inventory (sorted by item name):")
        for item, quantity in sorted(inventory.items()):
            print(f"{item}: {quantity}")

# use funcation to sorted the inventory
sorted_inventory(inventory)



 

