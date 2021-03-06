# OTP Application

## A Little Background
As the economy of the world has grown up, new products and services have become rapidly available to more and more consumers around the globe. With the advent of modern Technology and the Internet, companies have also been able to reach more and more parts of the world which were previously inaccesible or rather difficult to have operations in, which has resulted in a large increase in the number of customers. This has also increased the amount of purchases being processed in the last few years, and as a result an increase in the amount of transactions and cash flow.

--- 
A large part of this next-gen economy has been digital transactions - E-banking, Mobile Banking and Retail, UPI - which are accesible much more easily and widely than the traditional way. The lower costs of Mobile Phones and Personal Computers along with Internet facilities has helped facilitate the far and wide reaching nature of these technologies. So, how do we perform a transaction (say, while performing E-banking)? The general way is that a person logs in into his account, enters the details of the transaction (Account Numbers, IFSC Codes, etc) and then enters their transaction password. They recieve a One Time Password(OTP) on their Mobile Phones through SMS which is to be entered while performing the transaction to complete the transaction with security. But what if a person does not recieve an OTP from the bank? What if the person reaches a remote location where they don't get a mobile signal, but still want to perform a transaction on some other device? 

## The Solution
For the solution of this problem, we went back to the board and designed something up, by taking an idea from a device which has long been used for similar purposes. Bank Tokens, or Synchronous Dynamic Password Tokens to be specific, came to our rescue. Used in the old days by banks for passsword protection for its users, these work in a way that can be replicated on our modern day mobile devices. They generally run a cryptographic algorithm on various combinations of the passwords, which is replicated to be exactly same as what is being run on the server to generate passwords for the user. The clocks of both the server and the device are synced at first, and then the device can be used by the user for password generation(or rather storage). 

For detail working of Synchronous Dynamic Password Tokens, click [here](https://www.techopedia.com/definition/23940/time-synchronous-authentication)

## Tech Stack 
### 1. Application (Client side)
* Flutter
* Dart
* FireBase (Backend)
### 2. Web (Server side) 
* Express
* Node
* HTML, CSS, Pug, BootStrap
### 3. File Storage 
* MongoDB, Mongo Atlas
### 4. Version Control 
* Git
* GitHub
### 5. Cloud Deployment 
* Amazon Web Services
---
## Working
Our Prototype is an application that can present the user with an OTP anywhere, regardless of the quality of the mobile signals on their phone (apart from the first signup and login stage). Whenever a user signs up into the application, an OTP is created for them by the Backend service which stores this OTP in a database. All the OTPs in the database are then updated in regular time intervals, so as to mitigate any sort of Security Issues. Whenever the user performs a login request in the application, this OTP is then shared with the client application, where the OTP is stored locally on their Smartphones. Once this step is performed, the user doesn't need any sort of mobile signals. The OTP stored in the client application is then updated on regular intervals, which is run in time sync with the server. But signing up and logging in creates a request-response cycle to a server, which introduces network delays into the system causing it to run out of sync in respect to the server.

### How to sync the times of the devices?

[![alt text](https://user-images.githubusercontent.com/75308834/160415031-734e75b8-0499-40e9-b0fd-c998fbcb4b86.png "Click to see detailed workflow")](https://whimsical.com/XMPM6Y2JDuEznqcntQ3JrN)

We designed a state-of-the-art system for correcting these network delays, by using internet times and system times alike. The Network Time Protocol provides us with the the internet times for the device and the server(though these too are not the correct times because they have a network delay while being fetched from the internet. So we correct this too). Now while exchanging the request, the client also shares it's corrected Internet time with the server so that we get our delays for the request and response respectively. We then subtract the response timing from the total time taken in the cycle to get the client and server in sync with each other. When the User is performing a Login, we can reduce any network delays during the setup stage to the order of milliseconds. This keeps the Server and Application in sync even when the Application is not connected to the backend. This creates a secure way for OTPs to be provided to users without any mobile signals.

### The Connected Application (Client Side) which is to be used for the OTPs can be found [here](https://github.com/NaK915/OTP_Application)
