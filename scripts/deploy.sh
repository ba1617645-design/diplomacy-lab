#!/bin/bash
# ============================================
#  Script لإنشاء مجلد النشر على Netlify
#  استخدم هذا السكريبت لتجهيز ملفات النشر
# ============================================

echo "🛠️  تجهيز ملفات النشر لـ Netlify..."

# أنشئ مجلد deploy
mkdir -p deploy/netlify/functions

# 1. انسخ الملف الأساسي للمنصة
cp dist/index.html deploy/index.html
echo "✅ index.html"

# 2. انسخ ملف إعادة التوجيه (للـ SPA)
cp dist/_redirects deploy/_redirects
echo "✅ _redirects"

# 3. انسخ ملف إعدادات Netlify
cp netlify.toml deploy/netlify.toml
echo "✅ netlify.toml"

# 4. انسخ دالة المزامنة السحابية
cp netlify/functions/sync.mjs deploy/netlify/functions/sync.mjs
echo "✅ netlify/functions/sync.mjs"

# 5. انسخ صورة المدرب
mkdir -p deploy/images
cp dist/images/trainer.jpg deploy/images/trainer.jpg 2>/dev/null
echo "✅ images/trainer.jpg"

echo ""
echo "============================================"
echo "📁 مجلد deploy/ جاهز!"
echo "============================================"
echo ""
echo "الآن اسحب مجلد deploy/ على:"
echo "   https://app.netlify.com/drop"
echo ""
echo "أو ارفع الملفات عبر Git إلى Netlify"
echo "============================================"
