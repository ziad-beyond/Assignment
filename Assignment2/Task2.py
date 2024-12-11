# Create a BankAccount class
class BankAccount:
    # Initialize the attributes
    def __init__(self, account_number, balance, account_holder):
        self.account_number = account_number
        self.balance = balance
        self.account_holder = account_holder

    # Display account details
    def accountDetails(self):
        print(
            f"Account Number: {self.account_number}, "
            f"Account Holder: {self.account_holder}, "
            f"Balance: {self.balance}"
        )

    #1-Depositing money
    def addMoney(self, amount):
        if amount > 0:
            self.balance += amount
            print(f"Deposited {amount}. New balance is {self.balance}.")
        else:
            print("Deposit amount must be greater than zero.")

#2-Withdrawing money (ensure the account doesn’t go negative).      
    def withdrawMoney(self, amount):
        if amount > 0:
            if amount <= self.balance:
                self.balance -= amount
                print(f"Withdrew {amount}. New balance is {self.balance}.")
            else:
                print("Withdrawal denied Becuse you don't have enough money.")
        else:
            print("Withdrawal amount must be greater than zero.")
#3-Displaying the account balance.
    def displayBalance(self):
        print(f"Current balance: {self.balance}")


#Result
account = BankAccount(40023929, 500, "Ziad")
account.accountDetails() 

account.addMoney(200)  
account.accountDetails() 

account.withdrawMoney(300) 
account.accountDetails()  

account.withdrawMoney(500)  
account.accountDetails()  

account.displayBalance()
