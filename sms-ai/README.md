

# SMS Client

![SMS Client Logo](https://via.placeholder.com/150)

Welcome to the SMS Client project! This application is designed to manage SMS campaigns, chatbots, and lead interactions efficiently. It provides a user-friendly interface to create, manage, and track SMS campaigns.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Chatbot Management**: Easily manage chatbots and their associated lead lists.
- **Lead Interaction**: View and interact with leads through a comprehensive chat interface.
- **Campaign Tracking**: Monitor the success of your SMS campaigns with detailed analytics.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js (version 14.x or later) from [nodejs.org](https://nodejs.org/).
- **npm**: Node.js package manager, included with Node.js installation.
- **Git**: Version control system to clone the repository. Install from [git-scm.com](https://git-scm.com/).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Cr-ai-mer/sms-client.git
   cd sms-client
   ```
````

2. **Install Dependencies**

   Navigate to the project directory and install the required dependencies:

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory of the project:

   ```bash
   touch .env
   ```

   Add the following environment variables to your `.env` file:

   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

   > **Note**: Never commit your `.env` file to version control. The repository includes a `.env.example` file as a template.

   Environment Variables:

   - `VITE_API_BASE_URL`: Base URL for the API endpoints (default: http://127.0.0.1:8000/api/v1)

## Running the Project

To start the development server, run:

```bash
npm run dev
```

This will launch the application on `http://127.0.0.1:5173`. Open this URL in your browser to view the application.

## Project Structure

Here's a brief overview of the project's structure:

```
sms-client/
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── styles/          # CSS and styling files
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main application component
├── .env                # Environment variables (create this file)
├── .env.example        # Environment variables template
├── package.json        # Project metadata and dependencies
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---



```

