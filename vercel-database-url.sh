#!/bin/bash
# This script contains the DATABASE_URL to be added to Vercel
# Copy this value and add it to Vercel Dashboard → Settings → Environment Variables → Production

echo "DATABASE_URL for Vercel Production:"
echo ""
echo "postgresql://postgres.ywcqavarzxcgcoptwfkv:Dcdefe367e4e4%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
echo ""
echo "Instructions:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project (operon-app-v2)"
echo "3. Go to Settings → Environment Variables"
echo "4. Find DATABASE_URL"
echo "5. Edit it and replace with the value above"
echo "6. Save and redeploy"
