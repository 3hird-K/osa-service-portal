import psycopg2
import os

# Updated with correct credentials from backend .env
DATABASE_URL = "postgresql://neondb_owner:npg_HS5vojrclN2E@ep-polished-band-an9h7671-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"

def reset_online_status():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("Resetting all users to offline...")
        cur.execute("UPDATE users SET is_online = FALSE;")
        conn.commit()
        
        print("Success! All users are now offline.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_online_status()
