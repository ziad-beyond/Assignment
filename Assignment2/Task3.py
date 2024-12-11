# # Create a BankAccount class
class Animal :
    # Create Method eating
    def eat(self):
        print("eating")
    
    # Create Method sleeping
    def sleep(self):
        print("sleeping")

 # Create a Subclass Dog, inheriting from Animal
class Dog(Animal):
    # Create Method barking
    def bark(self):
        print("barking")

# Create Subclass Bird, inheriting from Animal
class Bird(Animal):
    # Create Method flying
    def fly(self):
        print("flying")

# Result

print("the dog is : ")
# Create Dog object
dog = Dog()
dog.eat()  
dog.sleep()  
dog.bark() 

print("the Bird is : ")
# Create Bird object
bird = Bird()
bird.eat()  
bird.sleep()  
bird.fly() 
