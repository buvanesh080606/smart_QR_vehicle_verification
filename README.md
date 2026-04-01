🚗 Smart QR Vehicle Verification System

A modern, full-stack vehicle verification platform designed to streamline and digitize vehicle authentication for law enforcement agencies and vehicle owners.

This system enables secure document management, AI-powered verification, and instant QR-based validation, significantly reducing manual effort and verification time.


✨ Key Features
🔐 Secure Authentication System
Role-based access for Vehicle Owners and Police Officers using JWT authentication.
🤖 AI-Powered Document Verification
Automatically extracts and validates data from:
RC (Registration Certificate)
Insurance
PUC Certificate
using Groq AI Vision.
📱 Instant QR Code Verification
Unique QR code for each vehicle
Scan via mobile browser
Displays real-time status (Active / Expired)
📂 Centralized Document Management
Secure storage and automatic tracking of document validity.
🎨 Modern User Interface
Responsive UI with smooth animations built using:
React
Tailwind CSS
Framer Motion
🛠️ Tech Stack
🔹 Frontend
Framework: React (Vite)
Styling: Tailwind CSS
UI Icons: Heroicons, Lucide React
Animations: Framer Motion
QR Integration:
@yudiel/react-qr-scanner
qrcode.react
API Handling: Axios

🔹 Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB (Mongoose)
AI Integration: Groq AI Vision (LLaMA Vision Model)
Authentication: JWT + Bcrypt
File Uploads: Multer
⚙️ Installation & Setup
📌 Prerequisites
Node.js installed
MongoDB running locally or remotely
Groq API Key

1️⃣ Clone Repository
git clone <repository-url>
cd smart-qr-vehicle-system
2️⃣ Backend Setup
cd smartscanner/backend
npm install

Create .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-qr-vehicle
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

Run backend:

npm run dev
3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev
📱 Deployment & Access
The backend is configured to run on 0.0.0.0
Accessible via:
Local network (same WiFi)
Public deployment (recommended for real-world use)
🌍 Real-World Integration (Future Scope)

This system can be integrated with:

Ministry of Road Transport and Highways (MoRTH)
DigiLocker
mParivahan