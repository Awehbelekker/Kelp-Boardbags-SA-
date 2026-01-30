# Kelp Board Bags - Complete Setup and Deployment Script
# Run this script to set up database, seed products, and deploy to Vercel

Write-Host "🌊 Kelp Board Bags - Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "kelp-board-bags"
Write-Host "📁 Working directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "⚙️  Step 1/6: Generating Prisma Client..." -ForegroundColor Green
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Push Database Schema
Write-Host "⚙️  Step 2/6: Pushing database schema to Supabase..." -ForegroundColor Green
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database schema pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Seed Database
Write-Host "⚙️  Step 3/6: Seeding database with products and images..." -ForegroundColor Green
npx tsx prisma/seed-real-products.ts
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Test Local Server
Write-Host "⚙️  Step 4/6: Starting development server..." -ForegroundColor Green
Write-Host "   Opening http://localhost:3000/shop in 10 seconds..." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop the server when ready to deploy" -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:3000/shop"
npm run dev

# After user stops the server with Ctrl+C, continue with deployment
Write-Host ""
Write-Host "⚙️  Step 5/6: Preparing for deployment..." -ForegroundColor Green

# Go back to root directory
Set-Location ".."

# Step 5: Git Commit
Write-Host "   Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host "   Creating commit..." -ForegroundColor Yellow
git commit -m "Add Supabase database and product images for client presentation

- Connected to Supabase PostgreSQL database
- Seeded 13 products with real data from old website
- Added 8 product images from old site
- Mobile-optimized image gallery with swipe gestures
- Ready for client review"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git commit created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git commit failed or no changes to commit" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Push to GitHub (triggers Vercel deployment)
Write-Host "⚙️  Step 6/6: Pushing to GitHub (triggers Vercel deployment)..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to GitHub successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Deployment started on Vercel!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   2. Watch deployment progress" -ForegroundColor White
    Write-Host "   3. Once deployed, add environment variables:" -ForegroundColor White
    Write-Host "      - DATABASE_URL (from .env file)" -ForegroundColor White
    Write-Host "      - NEXTAUTH_URL (your Vercel URL)" -ForegroundColor White
    Write-Host "      - NEXTAUTH_SECRET (from .env file)" -ForegroundColor White
    Write-Host "      - ADMIN_EMAIL (from .env file)" -ForegroundColor White
    Write-Host "      - ADMIN_PASSWORD (from .env file)" -ForegroundColor White
    Write-Host "   4. Redeploy on Vercel" -ForegroundColor White
    Write-Host "   5. Run this script again to seed production database" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Setup complete! Your site is deploying to Vercel!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "   Check your git remote configuration" -ForegroundColor Yellow
    exit 1
}

