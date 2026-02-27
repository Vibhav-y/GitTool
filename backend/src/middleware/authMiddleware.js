import { supabase } from '../config/supabase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header. User not authenticated." });
    }
    
    const jwt = authHeader.split(' ')[1];
    if (!jwt) {
      return res.status(401).json({ error: "Malformed authorization header." });
    }

    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired Supabase JWT." });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: "Authentication verification failed." });
  }
};
