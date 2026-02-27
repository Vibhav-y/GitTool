import { supabase } from "../config/supabase.js";

export const getTemplates = async (req, res, next) => {
  try {
    res.json({ success: true, message: "Get all templates endpoint" });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    res.json({ success: true, message: `Get template ${req.params.id} endpoint` });
  } catch (error) {
    next(error);
  }
};
