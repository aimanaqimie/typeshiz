# Setup Instructions

## ✅ Completed
- Supabase client library installed
- Database integration code created
- Components updated to use real database

## 🔧 Next Steps

### 1. Run the SQL Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/lkcbfoybirvsmbhjzxcz
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase-setup.sql`
5. Click "Run" or press Ctrl+Enter

This will create:
- `scores` table to store username, WPM, and accuracy
- Indexes for fast queries
- Security policies to allow public read/write

### 2. Test the Application

Once the table is created, your app will:
- ✅ Save scores automatically when a game ends
- ✅ Display real leaderboard data from the database
- ✅ Show each user's best score
- ✅ Update leaderboard in real-time

## How It Works

### When a game ends:
1. Score is saved to Supabase database
2. Username, WPM, and accuracy are stored

### On the finish page:
1. Leaderboard fetches top 10 scores
2. Groups by username (shows best score per user)
3. Sorts by WPM (highest first), then by accuracy
4. Highlights current user's entry

## Files Modified

- `src/app/page.tsx` - Added database save on game end
- `src/components/FinishPage.tsx` - Fetch real leaderboard data
- `src/lib/supabase.ts` - Database functions (saveScore, getLeaderboard)
- `.env.local` - Already has your Supabase credentials
