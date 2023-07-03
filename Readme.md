# Roaming Kitchen Application

Roaming Kitchen is a cutting-edge **food truck management solution** that revolutionizes the way food trucks operate and delight their customers. By harnessing the **power of AI**, **geolocation**, and seamless integration with **Square APIs**, Roaming Kitchen offers a comprehensive set of features designed to streamline operations, enhance customer experience, and drive business growth.

## Environment Overview

The environment consists of the following components:

- **Frontend**: The frontend of the application is built with React and runs on Node.js. It provides the user interface for interacting with the roaming kitchen service. The frontend communicates with the backend service to fetch data and perform actions.
- **Backend**: The backend of the application is built with Java and utilizes Maven for dependency management. It exposes a RESTful API that handles requests from the frontend and interacts with a PostgreSQL database. It also integrates with external services such as OpenAI, AWS, and Square for additional functionality. The backend uses a lightweight and secure approach by utilizing a Distroless image, reducing the attack surface and minimizing the risk of vulnerabilities.
- **MySQL Database**: The backend service uses a MySQL database to store and retrieve data related to the roaming kitchen service.

## How to Use

To deploy the Roaming Kitchen application using Bunnyshell, follow these steps:

1.  Clone this repository to your local machine.
2.  Replace the placeholder values in the `docker-compose.yml` file with your actual configuration values. Update the following variables:

    - `{google maps api key}`: Replace with your Google Maps API key.
    - `{mysqlhost}`: Replace with the hostname or IP address of your PostgreSQL database.
    - `{mysqldb}`: Replace with the name of your MySQL database.
    - `{mysqluser}`: Replace with the username for accessing the MySQL database.
    - `{mysqlpassword}`: Replace with the password for accessing the MySQL database.
    - `{openaikey}`: Replace with your OpenAI API key.
    - `{awsaccesskey}`: Replace with your AWS access key.
    - `{awssecretkey}`: Replace with your AWS secret key.
    - `{squareaccesstoken}`: Replace with your Square access token.

3.  Build and deploy the application using Bunnyshell. Refer to the Bunnyshell documentation for detailed instructions on deploying Docker Compose applications.
4.  Once the deployment is complete, access the Roaming Kitchen application by navigating to the provided URL or IP address in your web browser.
5.  Interact with the application's frontend to explore the roaming kitchen service. The frontend interface should be accessible on port 3000 of the deployed environment.

## Additional Information

- The frontend application is built using Node.js and React. It is served by the Node.js server and accessible through the exposed port 3000.
- The backend application is built using Java and Maven. It exposes a RESTful API on port 8080 and interacts with a PostgreSQL database. The backend utilizes a Distroless image, which is a minimalistic and secure container image. This approach reduces the attack surface and minimizes the risk of vulnerabilities.
- The PostgreSQL database is required for the backend service to store and retrieve data. Ensure that you have a working PostgreSQL instance with the access credentials.
- The application integrates with external services such as Google Maps, OpenAI, AWS, and Square. Make sure you provide valid API keys and access tokens for these services during the deployment.
- The Roaming Kitchen application is scalable and fault-tolerant. The backend service is scaled to have three replicas to handle increased traffic and provide redundancy.
- Refer to the Dockerfiles provided in this repository for more information on how the frontend and backend services are built and configured within their respective Docker containers.
