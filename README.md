# PulstriX: Smart Emergency Response Platform

**Live Website**: [https://pulstrix.vercel.app](https://pulstrix.vercel.app)

## 🚨 What is PulstriX?

PulstriX is a modern **incident management website** that connects citizens reporting emergencies with response teams. Think of it as a smarter, more efficient way to handle emergency reports - like 911 meets modern technology with AI assistance.

## 🎯 What Problem Does It Solve?

When emergencies happen, people often:
1. Report the same incident multiple times (creating confusion)
2. Don't know if their report was received
3. Can't track what's happening with their report

Response teams struggle with:
1. Too many duplicate reports for the same incident
2. Difficulty prioritizing which emergencies need attention first
3. No central system to manage everything

## ✨ Key Features Explained Simply

### 1. **For Regular People (Citizens)**
- **Easy Reporting**: Simple form to report emergencies with photos
- **Track Your Report**: See the status of your emergency report
- **Anonymous Option**: Report without giving your name if needed

### 2. **For Emergency Responders**
- **Smart Dashboard**: Shows all incidents with AI-powered priority tags
- **No Duplicates**: System automatically groups similar reports together
- **Map View**: See exactly where emergencies are happening

### 3. **For City Employees/Admins**
- **Analytics Dashboard**: See patterns and trends in emergency reports
- **Manage Resources**: Assign teams based on real needs
- **Generate Reports**: Create official reports automatically

## 🤖 The "Smart" Part - How AI Helps

### **Duplicate Detection**
- **Text Matching**: If 5 people report "car accident on Main Street," the system recognizes they're talking about the same thing
- **Photo Matching**: If people upload similar photos of the same fire, the system groups them together

### **Priority Tagging**
The AI reads emergency descriptions and automatically tags them:
- 🔴 **CRITICAL** - "Fire with people trapped"
- 🟡 **HIGH** - "Major car accident, injuries"
- 🟢 **MEDIUM** - "Fallen tree blocking road"
- 🔵 **LOW** - "Graffiti complaint"

## 👥 Who Uses This Website?

### **Three Main Users:**
1. **Citizen** → Reports emergencies, tracks their reports
2. **Responder** → Views incidents, navigates to location, resolves issues  
3. **Employee/Admin** → Manages the system, analyzes data, allocates resources

## 🏗️ Technology Made Simple

**Frontend**: Built with Next.js (modern React framework) - makes the website fast and smooth
**AI Parts**: Python services that handle the smart detection and classification
**Deployment**: Hosted on Vercel for reliability and speed

## 💡 Real-World Example

**What happens when someone reports a car accident?**

1. **Person A** reports: "Car crash at 5th and Main, two cars, injuries"
2. **Person B** reports: "Accident at 5th/Main intersection, people hurt"
3. **System detects** these are the same incident → creates ONE case
4. **AI classifies** as HIGH priority (because of injuries)
5. **Responders see** one clean alert on their dashboard with all details
6. **Admin can see** response times and allocate more ambulances if needed
7. **Citizens get updates** about when help arrives

## 🚀 Getting Started for Users

1. **Visit**: [pulstrix.vercel.app](https://pulstrix.vercel.app)
2. **Choose your role**: Citizen, Responder, or Employee
3. **Login/Sign up** (different interfaces for each role)
4. **Start using** the simple, role-appropriate dashboard

## 🏆 Why It's Better Than Old Systems

| Traditional Systems | PulstriX |
|-------------------|----------|
| Multiple calls for same incident | Groups duplicates automatically |
| Manual priority assessment | AI suggests priorities instantly |
| Paper-based tracking | Digital tracking with real-time updates |
| No feedback for reporters | Citizens can track their reports |

## 👨‍💻 For Developers (Simple Version)

If you want to run this yourself:
```bash
git clone https://github.com/apurbahalderr/PulstriX.git
cd PulstriX
npm install
npm run dev
```
Then open `http://localhost:3000` in your browser.

## 🤝 Who Built This?

Built by team HackerEyes of 5 developers during a hackathon:
- **Apurba Halder** 
- **Anshu Kumar** 
- **Rashika Shah**   
- **Ayush Kumar Anand** 
- **Dristi Singh** 

## 📞 Need Help or Have Questions?

- **Website Issues**: Open an issue on our GitHub
- **Emergency**: Please call local emergency services directly
- **Feedback**: We'd love to hear how we can improve!

---

**In short**: PulstriX is a website that makes emergency reporting and response smarter, faster, and more organized for everyone involved.

*"Better reporting, faster response, safer communities."*
