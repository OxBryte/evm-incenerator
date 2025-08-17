#!/bin/bash

echo "🚀 EVM Incenerator Development Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

echo "🔧 Starting development server with turbo mode..."
echo "📱 Local: http://localhost:3000"
echo "🌐 Network: http://192.168.0.3:3000"
echo ""
echo "💡 Tips:"
echo "   - Use Ctrl+C to stop the server"
echo "   - The server will automatically reload on file changes"
echo "   - Check the terminal for any build errors"
echo ""

# Start the development server
npx next dev --turbo
