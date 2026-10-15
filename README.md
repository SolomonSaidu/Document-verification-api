# Document Verification API (DVA)

An API-first document verification system that helps businesses verify customer documents using AI-powered data extraction and application-level validation rules.

## About the Project

The **Document Verification API (DVA)** is an API-first application designed to help businesses automate parts of their document verification workflow. It supports documents such as bank statements, electricity bills, water bills, and other utility documents.

The system uses AI to read uploaded documents and extract relevant information into structured JSON. The extracted data is then evaluated using application-level validation rules to determine the verification outcome.

The current implementation supports a limited number of document types, but its architecture is designed to make extending document support and verification rules straightforward.

One of the key features is **asynchronous document processing**. Clients can submit verification requests without waiting for the entire verification process to finish. Requests are queued and processed in the background, allowing clients to check their verification status separately.

## Why I Built DVA

I came up with the idea for DVA while working at a fintech company.

During my time there, I observed how long customer KYC document verification could take. Sometimes, customers had to wait days or even weeks to receive a result. When a document failed verification, the process could become even more frustrating because the customer might have to start again and wait for another review.

One Friday, I submitted a verification request for a client, and it was approved almost immediately. I was surprised by how much the experience had improved. The client was happy, and I was impressed by the difference a better verification workflow could make.

That experience inspired me to build DVA: a project exploring how document processing, background jobs, and automated validation can make verification workflows more efficient.

DVA is currently API-first, with plans to expand its functionality and introduce a dashboard in the future.

## Features

- **User authentication:** Register and log in to access protected endpoints.
- **API key management:** Create API keys for authenticating verification requests.
- **AI-powered data extraction:** Extract structured information from uploaded documents.
- **Document validation:** Evaluate document types and issue dates using application-level rules.
- **Asynchronous processing:** Queue verification requests and process them in the background.
- **Verification status tracking:** Check the status and outcome of submitted requests.
- **Automated tests:** Test API endpoints and verification logic.

## Tech Stack

The project uses the following technologies:

- **Node.js** — JavaScript runtime
- **Express.js** — API framework
- **PostgreSQL** — Relational database
- **Prisma ORM** — Database access and schema management
- **JWT** — User authentication
- **Redis and BullMQ** — Background job processing
- **Google Gemini API** — AI-powered document analysis
- **Supabase Storage** — Document storage
- **Vitest** — Automated testing
- **Supertest** — HTTP endpoint testing

## How It Works

The general verification workflow is:

1. A business or client submits a document using the verification API and a valid API key.
2. The API validates the request and stores the document.
3. A verification request is created and queued for background processing.
4. A worker retrieves the document and sends it to the AI service for analysis.
5. The extracted data is evaluated against the application's verification rules.
6. The verification record is updated with the appropriate status and result.
7. The client checks the status through the API.

The exact verification outcome depends on the implemented validation rules. AI extraction and rule-based validation do not, by themselves, guarantee that a document is authentic or free from fraud.

## Getting Started

### Prerequisites

Before running DVA locally, make sure you have:

- Node.js installed
- PostgreSQL available
- Redis available
- The required credentials for the external services used by the application

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/SolomonSaidu/Document-verification-api.git
```

**2. Enter the project directory**

```bash
cd Document-verification-api
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create your local `.env` file and configure the variables required by your application, including the database connection and credentials for the services your code uses.

Do not commit your `.env` file or expose API keys, database credentials, JWT secrets, or other sensitive values.

**5. Apply database migrations**

If the project has existing Prisma migrations, apply them to your configured database:

```bash
npx prisma migrate deploy
```

Make sure your database connection points to the intended database before running migrations.

**6. Start the development server**

```bash
npm run dev
```

The API should now be running locally at the address configured by your application.

## API Endpoints

The following examples use the deployed API.

**Base URL**

```text
https://document-verification-api-2j83.onrender.com/api/v1
```

### 1. Register a User

Creates a user account.

- **Method:** `POST`
- **Endpoint:** `/user/register`
- **Authentication:** Not required for registration

```text
POST /user/register
```

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/user/register](https://document-verification-api-2j83.onrender.com/api/v1/user/register)

### 2. Log In

Authenticates an existing user.

- **Method:** `POST`
- **Endpoint:** `/user/login`
- **Authentication:** Not required for login

```text
POST /user/login
```

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/user/login](https://document-verification-api-2j83.onrender.com/api/v1/user/login)

Use the authentication token returned by the login endpoint when accessing protected user endpoints.

### 3. Create an API Key

Creates an API key for submitting document verification requests.

- **Method:** `POST`
- **Endpoint:** `/api-key`
- **Authentication:** JWT bearer token required

```text
POST /api-key
Authorization: Bearer <your_access_token>
```

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/api-key](https://document-verification-api-2j83.onrender.com/api/v1/api-key)

Replace `<your_access_token>` with the token obtained after logging in.

### 4. Submit a Verification Request

Submits a document for verification.

- **Method:** `POST`
- **Endpoint:** `/verification`
- **Authentication:** API key required

```text
POST /verification
x-api-key: <your_api_key>
```

Send the document using the multipart form-data fields expected by the API. Check the implementation for the required field names and supported document types.

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/verification](https://document-verification-api-2j83.onrender.com/api/v1/verification)

The response indicates that the request has been submitted. The actual verification may still be processing in the background.

The following screenshot shows example server logs from a verification request.

### 5. Retrieve Verification Requests

Retrieves verification requests associated with the authenticated API client.

- **Method:** `GET`
- **Endpoint:** `/verification`

```text
GET /verification
x-api-key: <your_api_key>
```

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/verification](https://document-verification-api-2j83.onrender.com/api/v1/verification)

### 6. Check Verification Status

Checks the status of a submitted verification request.

- **Method:** `POST`
- **Endpoint:** `/verification/status`
- **Authentication:** API key required

```text
POST /verification/status
x-api-key: <your_api_key>
```

Provide the request information required by the endpoint to check its status. Refer to the route implementation for the exact request body.

**Deployed endpoint:**

[https://document-verification-api-2j83.onrender.com/api/v1/verification/status](https://document-verification-api-2j83.onrender.com/api/v1/verification/status)

> **Note:** The examples above use the deployed API. When running the project locally, use your local server URL instead. Protect your API keys and authentication tokens.

## Testing

Automated tests were written using Vitest and Supertest.

The project currently has **34 tests across 6 test files**, covering implemented application functionality.

Run the test suite with:

```bash
npx vitest run
```

## Screenshots

The following screenshot illustrates the local development setup.

- `fig-1.png` — Development server
- `fig-2.png` — User registration
- `fig-3.png` — User login
- `fig-4.png` — API key creation
- `fig-5.png` — Verification submission
- `fig-6.png` — Server processing logs
- `fig-7.png` — Retrieve verification requests
- `fig-8.png` — Verification status
- `fig-9.png` — Automated test results

## Future Improvements

DVA is an ongoing learning and development project. Planned improvements include:

- Supporting additional document types and more comprehensive validation rules.
- Improving document verification and error handling.
- Expanding the API to support a more user-friendly dashboard.
- Improving API key management and related security features.
- Building a frontend dashboard with verification history, API key management, and other useful tools.

## Contributing and Feedback

If you have questions about the codebase, architecture, implementation, or business use cases, feel free to reach out.

I'm open to feedback, suggestions, and ideas that could improve DVA.

**Author:** Solomon Saidu

**Email:** [solomonseidu50@gmail.com](mailto:solomonseidu50@gmail.com)

**GitHub:** [SolomonSaidu](https://github.com/SolomonSaidu)

## License
