docker run -d --hostname rabbit --name rabbit-mgt -p 8090:15672 -p 5672:5672 -e RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbit heartbeat 0" rabbitmq:3-management