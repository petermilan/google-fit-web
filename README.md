Google Fit UI

Unofficial Google Fit UI.
The project is just proof of concept. It was built for fun and lack of ability to display Google Fit weight data in a browser, as officially Google Fit has just android interface.
Just demonstrates how to do Google Auth and Google API to access weight data of authed user. The API is configurable, and contains example GQL queries which wrap Google REST API.
API connects the google library credentials from google devleoper console, and contains all needed functionality for auth, and load of Google Fit data.
Web APP was just quickly crafted to be able to auth the user, and display the user data in a graph.




<img width="1340" alt="image" src="https://github.com/user-attachments/assets/ea65eada-a14c-4388-8500-603aaacae5e9">


To setup the project you can follow steps in this nice tutorial https://www.ayoubkhial.com/blog/a-comprehensive-guide-to-connect-google-fit-api-with-expressjs

Project contains from these 2 subprojects:

- API
  for more info see [API README](./api/README.md)
- APP
  for more info see [APP README](./app/README.md)
