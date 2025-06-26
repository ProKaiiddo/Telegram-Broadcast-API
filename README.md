# Telegram Broadcast API

A powerful API service that enables broadcasting messages to Telegram bot users and checking user membership in groups/channels.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- 📨 Broadcast messages to all bot users
- 🔍 User membership verification
- ⚡ Fast batch processing
- 🔒 Secure token-based authentication
- 📝 Support for HTML formatting
- ⏱️ Rate limiting for stability
- 🔄 Automatic user database management

## 📋 Prerequisites

- Node.js >= 16.x
- A Telegram Bot Token (Get it from [@BotFather](https://t.me/BotFather))
- Users must start/interact with your bot before receiving broadcasts

## 🚀 API Endpoints

### Base URL
```
https://telegram-broadcast-api.vercel.app
```

### 1. Root Endpoint (GET /)
Returns API information and available endpoints.

**Response Example:**
```json
{
  "status": "success",
  "message": "Telegram Broadcast API",
  "endpoints": {
    "broadcast": "/api/broadcast",
    "membership_check": "/api/check"
  },
  "usage": {
    "broadcast": "Send a message to all bot users",
    "membership_check": "Check user membership in groups/channels"
  },
  "meta": {
    "developer": "@Kaiiddo on Telegram",
    "youtube": "@Kaiiddo",
    "twitter": "@HelloKaiiddo",
    "github": "@ProKaiiddo",
    "version": "v1.0.0",
    "timestamp": "2023-12-20T12:00:00.000Z"
  }
}
```

### 2. Broadcast Message (POST /api/broadcast)

Send a message to all users who have interacted with your bot.

**Parameters:**
- `token` (required): Your Telegram bot token
- `message` (required): The message to broadcast
- `parse_mode` (optional): Message parsing mode (default: HTML)

**Example Request:**
```bash
curl -X POST "https://telegram-broadcast-api.vercel.app/api/broadcast" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_BOT_TOKEN",
    "message": "Hello everyone! 👋\n\nThis is a test broadcast message.",
    "parse_mode": "HTML"
  }'
```

**Successful Response:**
```json
{
  "status": "success",
  "data": {
    "total_users": 100,
    "successful": 98,
    "failed": 2,
    "parse_mode": "HTML",
    "duration_seconds": "5.23",
    "failed_users": [
      {
        "userId": 123456789,
        "error": "Forbidden: bot was blocked by the user"
      }
    ],
    "suggestion": "Store user IDs in database for better results"
  },
  "meta": {
    "developer": "@Kaiiddo on Telegram",
    "youtube": "@Kaiiddo",
    "twitter": "@HelloKaiiddo",
    "github": "@ProKaiiddo",
    "version": "v1.0.0",
    "timestamp": "2023-12-20T12:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Missing required parameters: token or message",
  "meta": {
    "developer": "@Kaiiddo on Telegram",
    "youtube": "@Kaiiddo",
    "twitter": "@HelloKaiiddo",
    "github": "@ProKaiiddo",
    "version": "v1.0.0",
    "timestamp": "2023-12-20T12:00:00.000Z"
  }
}
```

## ⚠️ Important Notes

1. **Bot Interaction Required**: Users MUST interact with your bot (by starting it) before they can receive broadcasts. This is a Telegram limitation and ensures user privacy.

2. **Rate Limiting**: The API implements rate limiting to prevent abuse and ensure stable operation:
   - Messages are sent in batches of 20
   - 1-second delay between batches
   - Automatic retry mechanism for failed messages

3. **Message Formatting**: HTML parsing mode is supported by default. Example formatting:
   ```html
   <b>Bold text</b>
   <i>Italic text</i>
   <u>Underlined text</u>
   <a href="URL">Link text</a>
   ```

## 🔒 Privacy Policy

1. **Data Collection**
   - We only store Telegram user IDs for broadcasting purposes
   - No personal information is collected or stored
   - User IDs are stored in temporary memory and not persisted

2. **Data Usage**
   - User IDs are used solely for message broadcasting
   - We do not sell or share user data with third parties
   - No tracking or analytics are performed on user data

3. **User Control**
   - Users can block the bot at any time to stop receiving broadcasts
   - Blocking the bot automatically removes user from future broadcasts

## 👨‍💻 Developer Information

- **Developer**: [@Kaiiddo](https://telegram.me/Kaiiddo)
- **YouTube**: [@Kaiiddo](https://youtube.com/@Kaiiddo)
- **Twitter**: [@HelloKaiiddo](https://twitter.com/HelloKaiiddo)
- **GitHub**: [@ProKaiiddo](https://github.com/ProKaiiddo)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📅 Last Update

- Version: 1.0.0
- Last Updated: December 2023
- Status: Active Development

---
Made with ❤️ by [@Kaiiddo](https://telegram.me/Kaiiddo)

