const { createClient } = require('@supabase/supabase-js');
const Problem = require('../models/Problem');

// Initialize Supabase admin/auth client if credentials exist
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-ref') && !supabaseKey.includes('your-supabase-service-role-key')) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * Middleware to require and verify Supabase Bearer tokens.
 * Attaches verified user ID to req.userId.
 * Automatically claims unassigned or demo records to the authenticated user on access.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Missing or malformed Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Bearer token missing.'
      });
    }

    let resolvedUserId = null;

    // If Supabase client is configured, verify with Supabase Auth
    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized. Invalid or expired token.',
          error: error ? error.message : undefined
        });
      }

      req.user = user;
      resolvedUserId = user.id;
    } else {
      // Development/Demo mode fallback
      resolvedUserId = token.startsWith('demo-user-') ? token.replace('demo-user-', '') : 'demo-local-user-id';
    }

    req.userId = resolvedUserId;

    // Auto-map any unassigned/demo records to the authenticated user ID
    if (resolvedUserId) {
      Problem.updateMany(
        {
          $or: [
            { userId: { $exists: false } },
            { userId: null },
            { userId: '' },
            { userId: 'undefined' },
            { userId: 'demo-local-user-id' },
            { userId: { $regex: /^demo-/ } }
          ]
        },
        { $set: { userId: resolvedUserId } }
      ).catch(err => console.error('[requireAuth] Error auto-claiming demo records:', err.message));
    }

    return next();
  } catch (error) {
    console.error('[requireAuth Middleware Error]:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = requireAuth;
