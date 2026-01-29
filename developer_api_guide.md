# Operon API Developer Guide

Welcome to the Operon API! This guide will help you integrate with Operon programmatically and build custom integrations using our REST API and webhooks.

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Webhooks](#webhooks)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)

## Authentication

### API Keys

All API requests must be authenticated using an API key. You can create and manage API keys from your [Settings page](https://yourapp.com/dashboard/settings).

#### Creating an API Key

1. Navigate to Settings → API Keys
2. Click "Create API Key"
3. Give your key a name and optional description
4. Save the key securely - it will only be shown once!

#### Using Your API Key

Include your API key in the `Authorization` header of all API requests:

```
Authorization: Bearer YOUR_API_KEY
```

Example:
```bash
curl -H "Authorization: Bearer operon_live_..." \
     https://yourapp.com/api/v1/user
```

## Rate Limiting

- **Limit**: 100 requests per minute per API key
- Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: ISO 8601 timestamp when the limit resets

If you exceed the rate limit, you'll receive a `429 Too Many Requests` response.

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

### User & Organization

#### GET /api/v1/user

Get information about the organization associated with your API key.

**Response:**
```json
{
  "organization": {
    "id": "org-uuid",
    "name": "Acme Corp",
    "createdAt": "2024-01-01T00:00:00Z",
    "userCount": 5
  }
}
```

### Automations

#### GET /api/v1/automations

List all automations for your organization.

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 50, max: 100): Results per page
- `is_active` (boolean): Filter by active status

**Response:**
```json
{
  "automations": [
    {
      "id": 123,
      "name": "Send welcome email",
      "description": "Send email to new users",
      "trigger_type": "email.received",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2,
    "hasMore": true
  }
}
```

### Integrations

#### GET /api/v1/integrations

List all integrations and their connection status.

**Response:**
```json
{
  "integrations": [
    {
      "id": "gmail",
      "name": "Gmail",
      "category": "email",
      "connected": true,
      "connectedAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "summary": {
    "total": 20,
    "connected": 5
  }
}
```

### Tasks

#### GET /api/v1/tasks

List tasks for your organization.

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Results per page
- `status` (string): Filter by status (pending, in_progress, completed)

**Response:**
```json
{
  "tasks": [
    {
      "id": 456,
      "title": "Review proposal",
      "description": "Review Q1 proposal",
      "status": "pending",
      "priority": "high",
      "due_date": "2024-01-15T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 25,
    "totalPages": 1,
    "hasMore": false
  }
}
```

### Emails

#### GET /api/v1/emails

List emails from connected mailboxes.

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Results per page
- `folder` (string, default: inbox): Email folder
- `mailbox_id` (integer): Filter by specific mailbox

**Response:**
```json
{
  "emails": [
    {
      "id": 789,
      "subject": "Welcome to Operon",
      "from_address": "hello@example.com",
      "to_address": "user@example.com",
      "date": "2024-01-01T00:00:00Z",
      "folder": "inbox",
      "is_read": false,
      "has_attachments": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3,
    "hasMore": true
  }
}
```

### Webhooks

#### GET /api/v1/webhooks

List all webhook subscriptions.

**Response:**
```json
{
  "webhooks": [
    {
      "id": 1,
      "url": "https://example.com/webhook",
      "events": ["automation.completed", "email.received"],
      "description": "Production webhook",
      "is_active": true,
      "last_triggered_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 3
}
```

#### POST /api/v1/webhooks

Create a new webhook subscription.

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["automation.completed"],
  "description": "Production webhook"
}
```

**Response:**
```json
{
  "webhook": {
    "id": 1,
    "url": "https://example.com/webhook",
    "events": ["automation.completed"],
    "secret": "whsec_your_secret_here",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Webhook created successfully. Save the secret - it will not be shown again."
}
```

**⚠️ Important:** Save the webhook secret! You'll need it to verify webhook signatures, and it won't be shown again.

#### PUT /api/v1/webhooks/:id

Update a webhook subscription.

**Request Body:**
```json
{
  "url": "https://example.com/new-webhook",
  "events": ["automation.completed", "automation.failed"],
  "is_active": true
}
```

#### DELETE /api/v1/webhooks/:id

Delete a webhook subscription.

**Response:**
```json
{
  "message": "Webhook deleted successfully",
  "id": 1
}
```

#### POST /api/v1/webhooks/:id/test

Send a test webhook event.

**Response:**
```json
{
  "message": "Test webhook sent successfully",
  "statusCode": 200,
  "responseBody": "OK"
}
```

#### GET /api/v1/webhooks/:id/deliveries

View webhook delivery logs.

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Results per page

**Response:**
```json
{
  "deliveries": [
    {
      "id": 123,
      "event_type": "automation.completed",
      "status": "success",
      "response_code": 200,
      "attempts": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "completed_at": "2024-01-01T00:00:01Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2,
    "hasMore": true
  }
}
```

## Webhooks

### Webhook Events

Subscribe to these events to receive real-time notifications:

| Event | Description |
|-------|-------------|
| `automation.created` | A new automation is created |
| `automation.completed` | An automation completes successfully |
| `automation.failed` | An automation fails |
| `email.received` | A new email is received |
| `email.sent` | An email is sent |
| `task.created` | A new task is created |
| `task.completed` | A task is marked as complete |
| `task.updated` | A task is updated |
| `integration.connected` | A new integration is connected |
| `integration.disconnected` | An integration is disconnected |

### Webhook Payload

All webhook events follow this format:

```json
{
  "event": "automation.completed",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    // Event-specific data
  }
}
```

### Webhook Signatures

Every webhook request includes a signature in the `X-Operon-Signature` header. Verify this signature to ensure the request came from Operon:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Webhook Headers

| Header | Description |
|--------|-------------|
| `X-Operon-Signature` | HMAC SHA-256 signature of the payload |
| `X-Operon-Event` | Event type (e.g., `automation.completed`) |
| `User-Agent` | `Operon-Webhooks/1.0` |
| `Content-Type` | `application/json` |

### Retry Logic

If your webhook endpoint fails (non-2xx response), Operon will retry with exponential backoff:

- **1st retry**: 1 minute later
- **2nd retry**: 5 minutes later
- **3rd retry**: 30 minutes later

After 3 failed attempts, the delivery is marked as failed.

## Error Codes

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": "error_code",
  "message": "Human-readable error message"
}
```

### Common Errors

| Error Code | Description |
|------------|-------------|
| `missing_authorization` | No Authorization header provided |
| `invalid_api_key` | API key is invalid or revoked |
| `rate_limit_exceeded` | Too many requests |
| `not_found` | Resource not found |
| `invalid_request` | Request body is malformed |

## Code Examples

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const API_KEY = 'operon_live_your_key_here';
const BASE_URL = 'https://yourapp.com/api/v1';

// Get automations
async function getAutomations() {
  const response = await fetch(`${BASE_URL}/automations`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  const data = await response.json();
  console.log(data);
}

// Create webhook
async function createWebhook() {
  const response = await fetch(`${BASE_URL}/webhooks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://example.com/webhook',
      events: ['automation.completed'],
      description: 'Production webhook'
    })
  });
  
  const data = await response.json();
  console.log('Webhook created:', data);
  console.log('Save this secret:', data.webhook.secret);
}
```

### Python

```python
import requests

API_KEY = 'operon_live_your_key_here'
BASE_URL = 'https://yourapp.com/api/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}'
}

# Get automations
response = requests.get(f'{BASE_URL}/automations', headers=headers)
automations = response.json()
print(automations)

# Create webhook
webhook_data = {
    'url': 'https://example.com/webhook',
    'events': ['automation.completed'],
    'description': 'Production webhook'
}

response = requests.post(
    f'{BASE_URL}/webhooks',
    headers={**headers, 'Content-Type': 'application/json'},
    json=webhook_data
)

webhook = response.json()
print(f'Webhook created: {webhook}')
print(f'Save this secret: {webhook["webhook"]["secret"]}')
```

### cURL

```bash
# Get automations
curl -H "Authorization: Bearer operon_live_your_key_here" \
     https://yourapp.com/api/v1/automations

# Create webhook
curl -X POST https://yourapp.com/api/v1/webhooks \
  -H "Authorization: Bearer operon_live_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhook",
    "events": ["automation.completed"],
    "description": "Production webhook"
  }'
```

### Webhook Server Example (Express.js)

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'your_webhook_secret_here';

function verifySignature(payload, signature) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-operon-signature'];
  const event = req.headers['x-operon-event'];
  
  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  console.log('Received event:', event);
  console.log('Payload:', req.body);
  
  // Process the webhook event
  switch (event) {
    case 'automation.completed':
      console.log('Automation completed:', req.body.data);
      break;
    case 'email.received':
      console.log('Email received:', req.body.data);
      break;
    default:
      console.log('Unknown event type');
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

## Support

If you need help or have questions about the Operon API:

- Email: support@operon.com
- Documentation: https://docs.operon.com
- Status Page: https://status.operon.com

## Changelog

### Version 1.0 (Current)

- Initial API release
- RESTful API endpoints for users, automations, integrations, tasks, and emails
- Webhook subscriptions and delivery
- API key authentication
- Rate limiting (100 req/min)
