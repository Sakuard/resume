# Question 3 (20 mins)


## Answer

Provide your answer below:
answer3-MattHuang7451BRgN1Jkena

## How do you get it

Describe how you approached the problem, the steps you took to solve it, and any relevant details about your process.

At first, I noticed that the connection to Redis was failing.
My initial approach was to start a Redis container and attach it to the same Docker network to enable communication.
After establishing the connection, I used redis-cli to retrieve the answer.

root@thingnario-sre-test:/home/matt_web_tw# docker exec -it redis redis-cli KEYS '*'
1) "answer3"
root@thingnario-sre-test:/home/matt_web_tw# docker exec -it redis redis-cli get answer3
"answer3-MattHuang7451BRgN1Jkena"
root@thingnario-sre-test:/home/matt_web_tw# 
