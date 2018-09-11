
docker build -t hackCent/20180908/search/jobBot .
docker run --name jobBotContainer --env-file ./secret.env hackCent/20180908/search/jobBot