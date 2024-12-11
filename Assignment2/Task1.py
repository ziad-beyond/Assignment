# Create a car class
class Car:
    # Initialize the attributes
    def __init__(self, make, year, model, mileage):
        self.make = make
        self.year = year
        self.model = model
        self.mileage = mileage

    # 1- Display the car details
    def display_cars(self):
        print(
            f"Car is {self.model}, its brand is {self.make}, model year is {self.year}, and mileage is {self.mileage} km."
        )

    # 2- Update the mileage
    def updateMileage(self, newMileage):
        if newMileage >= self.mileage:
            self.mileage = newMileage
            print(f"The new mileage is {newMileage} km.")
        else:
            print("New mileage cannot be less than the current mileage.")
#Check if the car is considered "old" (more than 10 years old).
    def isCarOld(self):
        thisYear=2025
        carAge = thisYear - self.year
        if carAge > 10:
            print(f"The car is considered old (age: {carAge} years).")
        else:
            print(f"The car is not considered old (age: {carAge} years).")


# Create a car object
car1 = Car("TOYOTA", 2000, "CAMRY", 0)
car1.display_cars()

# Update mileage
car1.updateMileage(1000)
car1.display_cars()
car1.isCarOld()

