Readme
Server Name : prabodham36369
Pass : Prabodham36

DB name : SSL_2022_PROD
mongodb+srv://prabodham36369:Prabodham36@prabodham.owbqxe4.mongodb.net/?retryWrites=true&w=majority

docker build -t yashsoni2737/ssl_service:latest .
docker push yashsoni2737/ssl_service:latest
docker rm -f ssl_service
docker pull yashsoni2737/ssl_service:latest
docker run -itd -p 3000:3000 --restart=always --name=ssl_service yashsoni2737/ssl_service:latest

docker build -t yashsoni2737/ssl_website:latest .
docker push yashsoni2737/ssl_website:latest
docker rm -f ssl_website
docker pull yashsoni2737/ssl_website:latest
docker run -itd -p 80:80 --restart=always --name=ssl_website yashsoni2737/ssl_website:latest


for new yuvaks for registeration
pick sabha area from reference name

Extra fields for Mohatsav

registered : Yes / No

Transport : Bus / Self

Seva (if bus) : 1000 (amount)
0 if not paid
is new

If New 
First
Middle
Last
MobileNo
Gender
Reference**
Sabha
Transport
In Groups -> NEW
-> Registeration Successful! Please contact your Reference : Dipesh Bhai : 9212323333 -> Click to whatsapp

If Existing pull from Sampark
First
Middle
Last
MobileNo
Gender
Sabha
Transport
