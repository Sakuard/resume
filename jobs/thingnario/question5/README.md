# Question 5 (30 mins)


## Answer

Provide your answer below:
answer5-MattHuang7451hqJcYXMqN3

## How do you get it

Describe how you approached the problem, the steps you took to solve it, and any relevant details about your process.

Initially, I focused on establishing the database connection for /question5 and forgot to refer to the README. So, I spent some time identifying the correct MySQL connection string. I used strings to inspect the binary and found the connection string: root:rootrootroot@mysql:3306.
After successfully connecting, I encountered an issue where the expected table could not be found. This made me realize I had missed the README when setting up MySQL. Using the mysql image from the README, I was able to connect to the correct database instance.
After successfully running /question5, the task shifted to handling database query performance. I first installed phpMyAdmin to inspect the tables through a UI, and then added indexes to improve the query performance.