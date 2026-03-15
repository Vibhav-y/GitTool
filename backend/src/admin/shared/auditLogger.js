import { supabase } from "../../shared/supabase.js";

/**
 * Logs every admin action to the audit_logs table.
 * Call this in every mutating admin controller.
 */
export async function auditLog(req, action, targetType, targetId, details = {}) {
  try {
    await supabase.from("audit_logs").insert({
      admin_email: req.admin?.adminEmail || "unknown",
      admin_role:  req.admin?.role || "unknown",
      action,
      target_type: targetType,
      target_id:   String(targetId || ""),
      details,
      ip_address:  req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
    });
  } catch (err) {
    console.error("auditLog ERROR (non-fatal):", err.message);
  }
}
