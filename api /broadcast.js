const { Telegraf } = require('telegraf');

const SOCIAL_INFO = {
  developer: "@Kaiiddo on Telegram",
  youtube: "@Kaiiddo",
  twitter: "@HelloKaiiddo",
  github: "@ProKaiiddo",
  version: "v1.0.0"
};

const createResponse = (status, data = {}) => ({
  status,
  ...data,
  meta: {
    ...SOCIAL_INFO,
    timestamp: new Date().toISOString()
  }
});

// In-memory storage (for demo purposes - replace with DB in production)
let userDatabase = [];

module.exports = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    // Handle root endpoint
    if (req.url === '/' || req.url === '') {
      return res.status(200).json(createResponse('success', {
        message: 'Telegram Broadcast API',
        endpoints: {
          broadcast: '/api/broadcast',
          membership_check: '/api/check'
        },
        usage: {
          broadcast: 'Send a message to all bot users',
          membership_check: 'Check user membership in groups/channels'
        }
      }));
    }

    // Parse input
    const params = req.method === 'POST' ? req.body : req.query;
    const { token, message, parse_mode = 'HTML' } = params;

    if (!token || !message) {
      return res.status(400).json(createResponse('error', {
        message: 'Missing required parameters: token or message'
      }));
    }

    const bot = new Telegraf(token);
    
    try {
      // Verify bot token
      await bot.telegram.getMe();

      // Get current webhook info
      const webhookInfo = await bot.telegram.getWebhookInfo();
      
      // If webhook is active, get updates through alternative method
      let userIds = [];
      
      if (webhookInfo.url) {
        // Method 1: Get chat members from groups where bot is admin
        try {
          const chats = await bot.telegram.getUpdates();
          userIds = [...new Set(
            chats
              .filter(chat => chat.message?.from?.id)
              .map(chat => chat.message.from.id)
          )];
        } catch (e) {
          console.log("Couldn't get updates:", e.message);
        }
        
        // Method 2: Use getChatAdministrators if bot is admin in any group
        try {
          // You would need to specify group IDs here
          // const groupId = "-1001234567890";
          // const admins = await bot.telegram.getChatAdministrators(groupId);
          // userIds = [...userIds, ...admins.map(a => a.user.id)];
        } catch (e) {
          console.log("Couldn't get admins:", e.message);
        }
      } else {
        // If no webhook, use regular getUpdates
        const updates = await bot.telegram.getUpdates({ limit: 100 });
        userIds = [...new Set(
          updates
            .filter(update => update.message?.from?.id)
            .map(update => update.message.from.id)
        )];
      }

      // Combine with any previously stored users
      userIds = [...new Set([...userIds, ...userDatabase])];
      
      if (userIds.length === 0) {
        return res.status(200).json(createResponse('success', {
          data: {
            total_users: 0,
            successful: 0,
            failed: 0,
            parse_mode,
            warning: "No users found. Users must interact with bot first."
          }
        }));
      }

      // Store users for future broadcasts
      userDatabase = [...new Set([...userDatabase, ...userIds])];

      // Prepare message
      const fullMessage = `${message}\n\n` +
        `<b><i><u>✨ This broadcast sent via Broadcast API ${SOCIAL_INFO.version} ` +
        `Made With ❤️ By ${SOCIAL_INFO.developer} ✨</u></i></b>`;

      // Send messages in batches
      const batchSize = 20;
      let successful = 0;
      let failed = 0;
      const failedUsers = [];
      const startTime = Date.now();

      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const batchPromises = batch.map(userId => 
          bot.telegram.sendMessage(userId, fullMessage, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }).catch(e => {
            failed++;
            failedUsers.push({ userId, error: e.message });
            return null;
          })
        );

        const batchResults = await Promise.all(batchPromises);
        successful += batchResults.filter(r => r !== null).length;

        // Rate limiting
        if (i + batchSize < userIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const duration = (Date.now() - startTime) / 1000;

      return res.status(200).json(createResponse('success', {
        data: {
          total_users: userIds.length,
          successful,
          failed,
          parse_mode,
          duration_seconds: duration.toFixed(2),
          failed_users: failed > 0 ? failedUsers.slice(0, 5) : undefined,
          suggestion: "Store user IDs in database for better results"
        }
      }));

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(createResponse('error', {
        message: 'Broadcast failed',
        error: error.message
      }));
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json(createResponse('error', {
      message: 'Internal server error',
      error: error.message
    }));
  }
};
