import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Score {
  id: number;
  username: string;
  wpm: number;
  accuracy: number;
  created_at: string;
}

// Save a new score (only if it's better than existing)
export async function saveScore(username: string, wpm: number, accuracy: number) {
  // First, check if user already has a score
  const { data: existingScore, error: fetchError } = await supabase
    .from('scores')
    .select('*')
    .eq('username', username)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is fine
    console.error('Error fetching existing score:', fetchError);
  }

  // Check if new score is better
  const isBetterScore = !existingScore || 
    wpm > existingScore.wpm || 
    (wpm === existingScore.wpm && accuracy > existingScore.accuracy);

  if (isBetterScore) {
    // Use upsert to insert or update
    const { data, error } = await supabase
      .from('scores')
      .upsert([{ username, wpm, accuracy }], { 
        onConflict: 'username',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving score:', error);
      return { saved: false, isNewBest: false, data: null };
    }

    return { saved: true, isNewBest: true, data };
  }

  return { saved: false, isNewBest: false, data: existingScore };
}

// Get top scores for leaderboard (now only one score per user in DB)
export async function getLeaderboard(limit: number = 10) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('wpm', { ascending: false })
    .order('accuracy', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  // Map to leaderboard format with ranks
  return (data || []).map((score, index) => ({
    rank: index + 1,
    username: score.username,
    wpm: score.wpm,
    accuracy: score.accuracy,
  }));
}
