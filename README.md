# Socket.IO Chat Example

This repository contains a scalable full-stack chat application powered by Socket.IO, designed as a foundation for building and deploying real-time applications on Genezio.

The application integrates MongoDB to ensure seamless message broadcasting to all connected clients, even when the server scales dynamically. 

## Features

- **Real-time Communication**: Utilizes Socket.IO for instant messaging between clients.
- **Serverless Deployment**: Configured for deployment on Genezio, enabling automatic scaling and reduced infrastructure management.

## Getting Started

### Prerequisites

The MongoDB will be provisioned by the genezio platform.

- Node.js installed on your local machine.
- `npm install genezio -g`
- A Genezio account.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Genez-io/socket-io-getting-started.git
   cd socket-io-getting-started

2. Log In to Genezio:

    ```bash
    genezio login

2. **To run the application locally**: 

    ```bash
    genezio local

3. **Deploy the Application**:
   ```bash
   genezio deploy

