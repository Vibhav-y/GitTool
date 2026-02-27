import { supabase } from "../config/supabase.js";

// Get current user's token balance
export const getBalance = async (req, res, next) => {
  const userId = req.user.id;
  try {
    let { data, error } = await supabase
      .from('user_tokens')
      .select('balance')
      .eq('user_id', userId)
      .single();

    // If no row exists yet (edge case), create one with 20 tokens
    if (error && error.code === 'PGRST116') {
      const { data: newRow, error: insertErr } = await supabase
        .from('user_tokens')
        .insert({ user_id: userId, balance: 40 })
        .select('balance')
        .single();
      if (insertErr) throw insertErr;
      data = newRow;
    } else if (error) {
      throw error;
    }

    res.json({ balance: data.balance });
  } catch (error) {
    console.error("getBalance ERROR:", error.message);
    next(error);
  }
};

// Get transaction history
export const getTransactions = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json({ transactions: data });
  } catch (error) {
    next(error);
  }
};

// Deduct tokens (called internally, not as a route)
export async function deductToken(userId, amount, type, description) {
  // Check balance
  const { data: tokenRow, error: fetchErr } = await supabase
    .from('user_tokens')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (fetchErr) throw new Error('Could not fetch token balance');
  if (!tokenRow || tokenRow.balance < amount) {
    const err = new Error('Insufficient tokens');
    err.status = 403;
    throw err;
  }

  // Deduct
  const { error: updateErr } = await supabase
    .from('user_tokens')
    .update({ balance: tokenRow.balance - amount })
    .eq('user_id', userId);

  if (updateErr) throw updateErr;

  // Log transaction
  await supabase.from('token_transactions').insert({
    user_id: userId,
    amount: -amount,
    type,
    description,
  });

  return tokenRow.balance - amount;
}

// Add tokens (called after payment verification)
export async function addTokens(userId, amount, description) {
  const { data: tokenRow, error: fetchErr } = await supabase
    .from('user_tokens')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (fetchErr) {
    // Create row if it doesn't exist
    await supabase.from('user_tokens').insert({ user_id: userId, balance: amount });
  } else {
    await supabase
      .from('user_tokens')
      .update({ balance: tokenRow.balance + amount })
      .eq('user_id', userId);
  }

  await supabase.from('token_transactions').insert({
    user_id: userId,
    amount,
    type: 'purchase',
    description,
  });
}
