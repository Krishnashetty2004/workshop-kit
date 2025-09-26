#!/bin/bash
# Next.js Clean Rebuild Script
# Fixes build cache corruption issues

echo "🧹 Cleaning Next.js build cache..."
rm -rf .next node_modules package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting development server..."
npm run dev
