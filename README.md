# Synapse AI — React Frontend Project

A dark futuristic AI Productivity SaaS landing page built with React + Vite.

## Features
- Animated hero with typewriter effect
- Features, How It Works, Stats (animated counters), Testimonials, Pricing, Team, Contact sections
- Live AI Summarizer powered by Claude API
- Login & Register pages with form validation and password strength indicator
- Google OAuth button (UI ready — wire up Firebase)
- Fully responsive dark/futuristic design

## Tech Stack
- React 18 + Vite
- React Router DOM v6
- Recharts (for any chart extensions)
- EmailJS (for contact form emails)
- Google Fonts: Syne + DM Sans + JetBrains Mono

---

## Prerequisites — Install These First

Before doing anything, make sure you have the following installed on your computer.

### Bun
Bun is the JavaScript runtime and package manager this project uses (instead of Node/npm).

- Go to https://bun.sh and follow the install instructions for your OS.
- On Mac/Linux, run this in your terminal:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- On Windows, use the Windows Subsystem for Linux (WSL) or follow the instructions on the Bun website.
- After installing, confirm it works by running:
  ```bash
  bun --version
  ```
  You should see a version number printed (e.g. `1.1.0`).

### A code editor
If you don't have one, download **Visual Studio Code** from https://code.visualstudio.com — it's free and works on all platforms.

---

## Step 1 — Open the Project

1. Unzip the `synapse-ai.zip` file you downloaded.
2. You'll get a folder called `synapse-ai`. Move it wherever you keep your projects.
3. Open **VS Code**, go to **File → Open Folder**, and select the `synapse-ai` folder.
4. Open the integrated terminal in VS Code: go to **Terminal → New Terminal** from the top menu bar.
   All commands from here on are typed into this terminal.

---

## Step 2 — Install Dependencies

In the terminal, run:
```bash
bun install
```

This reads the `package.json` file and downloads all the libraries the project needs into a folder called `node_modules`. It only takes a few seconds with Bun. You'll see a list of packages being installed — that's normal.

---

## Step 3 — Create Your Environment File

Environment variables are a way to store secret keys (like API keys) outside of your code files, so you don't accidentally share them.

1. In VS Code's file explorer (the left sidebar showing your files), right-click the root `synapse-ai` folder and select **New File**.
2. Name it exactly: `.env`
   > ⚠️ The dot at the start is important. This may appear as a hidden file on Mac/Linux — that's completely normal.
3. Open the `.env` file and paste this inside:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   Leave it as-is for now — you'll replace `your_groq_api_key_here` in the next step.

---

## Step 4 — Set Up the Gemini API Key (AI Summarizer)

This gives the AI Summarizer section on the landing page its intelligence. Without this, the Summarizer button will show an error — that's expected until you complete this step.

### 4a. Get your Gemini API key
1. Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API key and copy the full secret string.

### 4b. Add the key to your .env file
1. Open your `.env` file in VS Code.
2. Add or update the key. It should look like:
   ```
   VITE_GEMINI_API_KEY=AIzaSy...
   ```
   Important: no quotes around the key, no spaces around the `=` sign.
3. Save the file.

### 4c. Verify the integration
The application is pre-configured to use the stable Gemini 1.5 Flash model. No additional code changes are required if you have set the environment variable correctly.

> ⚠️ This app is calling the Gemini API directly from the browser. That is fine for a local project, but for production you should proxy requests through a backend so the key is not exposed in client-side code.

---

## Step 5 — Set Up EmailJS (Contact Form)

EmailJS lets your Contact form actually send emails straight to your inbox — no backend server needed.

### 5a. Create an EmailJS account
1. Go to https://www.emailjs.com and click **Sign Up Free**.
2. Sign up using your email address and verify your account.

### 5b. Create an Email Service (connects EmailJS to your Gmail)
1. After logging in, look at the left sidebar and click **Email Services**.
2. Click **Add New Service**.
3. Choose **Gmail** from the list of providers.
4. Click **Connect Account** and a Google login popup will appear. Sign in with the Gmail account where you want to receive contact form messages.
5. Give the service a name — for example: `synapse_contact`. This is just a label for your own reference.
6. Click **Create Service**.
7. You'll now see your service listed with a **Service ID** that looks like `service_abc1234`. **Copy this and save it** in a notepad or document — you'll need it shortly.

### 5c. Create an Email Template (defines what the email looks like)
1. Click **Email Templates** in the left sidebar.
2. Click **Create New Template**.
3. Fill in the template:
   - In the **Subject** field, type:
     ```
     New message from {{name}}
     ```
   - In the **Body / Content** area, type:
     ```
     You received a new message from the Synapse contact form.

     Name: {{name}}
     Email: {{email}}

     Message:
     {{message}}
     ```
   The `{{name}}`, `{{email}}`, and `{{message}}` parts are placeholders — EmailJS will automatically replace them with the real values from the form when someone submits it.
4. Click **Save** at the top right.
5. You'll see your template listed with a **Template ID** that looks like `template_xyz7890`. **Copy this and save it**.

### 5d. Get your Public Key
1. Click your profile icon or username in the top-right corner of the EmailJS dashboard.
2. Select **Account** from the dropdown.
3. Scroll down to the **API Keys** section. You'll see a **Public Key** (a string like `abc123XYZxxxxxxx`).
4. **Copy it and save it**.

### 5e. Install EmailJS in the project
In your VS Code terminal, run:
```bash
bun add emailjs-com
```
Wait for it to finish — you'll see it added to your `package.json`.

### 5f. Wire EmailJS into the Contact form
1. Open `src/components/Contact.jsx` in VS Code.
2. At the very top of the file (line 1, before anything else), add this import:
   ```js
   import emailjs from 'emailjs-com'
   ```
3. Scroll down to find the `handleSubmit` function. Inside it, look for these lines:
   ```js
   // Simulated send for demo purposes:
   await new Promise(r => setTimeout(r, 1200))
   setStatus('sent')
   ```
4. Replace those three lines with:
   ```js
   await emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     form,
     'YOUR_PUBLIC_KEY'
   )
   setStatus('sent')
   ```
5. Now replace the placeholder strings with the real values you saved earlier. For example:
   ```js
   await emailjs.send(
     'service_abc1234',
     'template_xyz7890',
     form,
     'abc123XYZxxxxxxx'
   )
   setStatus('sent')
   ```
6. Save the file.

Now when someone fills in the contact form and clicks Send, you'll receive the message in your Gmail inbox.

---

## Step 6 — Set Up Firebase Auth (Login & Register)

Firebase is a platform by Google that provides ready-made authentication (login/signup) so you don't have to build it from scratch.

### 6a. Create a Firebase project
1. Go to https://firebase.google.com and click **Get Started**.
2. Sign in with your Google account.
3. Click **Add project** (or **Create a project**).
4. Enter a project name, for example: `synapse-ai`. Click **Continue**.
5. On the next screen, you'll be asked about Google Analytics — toggle it **off** (you don't need it) and click **Create project**.
6. Wait about 10 seconds for the project to be created. Once it says "Your new project is ready", click **Continue**.

### 6b. Register your web app with Firebase
You're now inside the Firebase project dashboard.

1. Near the top of the page you'll see icons for different platforms. Click the **</>** icon (it represents a Web app).
2. In the "App nickname" field, type anything — for example: `synapse-web`.
3. Leave the "Firebase Hosting" checkbox **unchecked**.
4. Click **Register app**.
5. Firebase will display a code block containing your `firebaseConfig` object. It looks like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "synapse-ai-12345.firebaseapp.com",
     projectId: "synapse-ai-12345",
     storageBucket: "synapse-ai-12345.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```
6. **Copy the entire `firebaseConfig` object** — all the lines from the opening `{` to the closing `}`. You'll paste this into your project shortly.
7. Click **Continue to console**.

### 6c. Enable Email/Password sign-in
1. In the left sidebar of the Firebase console, click **Build** to expand it, then click **Authentication**.
2. Click **Get started**.
3. You'll see a list of sign-in providers. Click **Email/Password**.
4. Toggle the first switch to **Enable** (it should turn blue).
5. Leave the second option (Email link / passwordless) disabled.
6. Click **Save**.

### 6d. Enable Google sign-in (for the "Continue with Google" button)
1. Still on the Authentication → Sign-in method page, scroll down and click **Google**.
2. Toggle **Enable** to ON (it turns blue).
3. In the **Project support email** dropdown, select your email address.
4. Click **Save**.

### 6e. Install Firebase in the project
In your VS Code terminal, run:
```bash
bun add firebase
```
Wait for it to finish.

### 6f. Create the Firebase config file in your project
1. In VS Code, click on the `src` folder in the left sidebar to expand it.
2. Right-click the `src` folder and select **New File**.
3. Name it `firebase.js`.
4. Open it and paste in the following — replacing the placeholder `firebaseConfig` values with the real ones you copied from Firebase in Step 6b:
   ```js
   import { initializeApp } from 'firebase/app'
   import { getAuth, GoogleAuthProvider } from 'firebase/auth'

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   }

   const app = initializeApp(firebaseConfig)
   export const auth = getAuth(app)
   export const googleProvider = new GoogleAuthProvider()
   ```
5. Save the file.

### 6g. Wire up the Login page
1. Open `src/pages/LoginPage.jsx`.
2. At the top of the file, after the last existing `import` line, add these two new import lines:
   ```js
   import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
   import { auth, googleProvider } from '../firebase'
   ```
3. Find the `handleSubmit` function. Inside it, look for this block of code:
   ```js
   // Replace with Firebase Auth: signInWithEmailAndPassword(auth, form.email, form.password)
   await new Promise(r => setTimeout(r, 1000))
   if (form.email && form.password.length >= 6) {
     navigate('/')
   } else {
     setError('Invalid credentials. Please check your email and password.')
   }
   ```
4. Delete all of those lines and replace with:
   ```js
   try {
     await signInWithEmailAndPassword(auth, form.email, form.password)
     navigate('/')
   } catch (e) {
     setError('Invalid email or password. Please try again.')
   }
   ```
5. Now find the Google button — it's the button that contains the text `Continue with Google`. Add an `onClick` prop to it:
   ```js
   onClick={async () => {
     try {
       await signInWithPopup(auth, googleProvider)
       navigate('/')
     } catch (e) {
       setError('Google sign-in failed. Please try again.')
     }
   }}
   ```
6. Save the file.

### 6h. Wire up the Register page
1. Open `src/pages/RegisterPage.jsx`.
2. After the last existing import line at the top, add:
   ```js
   import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
   import { auth, googleProvider } from '../firebase'
   ```
3. Find the `handleSubmit` function and look for these lines:
   ```js
   // Replace with Firebase Auth: createUserWithEmailAndPassword(auth, form.email, form.password)
   await new Promise(r => setTimeout(r, 1200))
   navigate('/')
   ```
4. Delete those lines and replace with:
   ```js
   try {
     await createUserWithEmailAndPassword(auth, form.email, form.password)
     navigate('/')
   } catch (e) {
     setError('Registration failed. This email may already be in use.')
   }
   ```
5. Find the **Sign up with Google** button and add the same `onClick` handler:
   ```js
   onClick={async () => {
     try {
       await signInWithPopup(auth, googleProvider)
       navigate('/')
     } catch (e) {
       setError('Google sign-up failed. Please try again.')
     }
   }}
   ```
6. Save the file.

---

## Step 7 — Run the Project

You're all set! Start the development server with:
```bash
bun dev
```

Open your browser and go to: **http://localhost:5173**

You should see the full Synapse AI landing page. Try:
- Scrolling through all the sections
- Pasting some text into the AI Summarizer and clicking the button
- Clicking **Get started** to go to the Register page
- Clicking **Log in** to go to the Login page

To stop the server at any time, press **Ctrl+C** in the terminal.

---

## Common Issues & Fixes

**"bun: command not found"**
→ Bun isn't installed, or your terminal needs to be restarted after installing. Close VS Code completely, reopen it, and try again.

**AI Summarizer shows an error**
→ Check three things: (1) your `.env` file exists in the root `synapse-ai` folder, not inside `src`; (2) the key in `.env` starts with `sk-ant-`; (3) you saved `AIDemo.jsx` after adding the new headers block.

**Firebase login gives an error saying "auth/operation-not-allowed"**
→ You haven't enabled Email/Password sign-in in the Firebase Console. Go back to Step 6c and make sure the toggle is ON and saved.

**Firebase login gives "auth/invalid-api-key"**
→ The `firebaseConfig` values in `src/firebase.js` don't match your Firebase project. Go back to the Firebase Console → Project Settings and copy them again carefully.

**Contact form doesn't send / gives an error**
→ Double-check your EmailJS Service ID, Template ID, and Public Key. Make sure the template variables in EmailJS (`{{name}}`, `{{email}}`, `{{message}}`) exactly match the field names in the code.

**Page is blank or shows a white screen**
→ Open your browser's developer tools (press **F12**), click the **Console** tab, and look for red error messages. These will tell you exactly what went wrong. Copy the error message and search it online, or ask for help.

**"Module not found" error after adding Firebase or EmailJS**
→ You may have forgotten to run `bun add firebase` or `bun add emailjs-com`. Run the install command in the terminal and restart the dev server.

---

## Project Structure

Here's what every file and folder does:

```
synapse-ai/
├── .env                      ← your secret API keys — NEVER share or commit this file
├── index.html                ← the single HTML page the app loads into
├── vite.config.js            ← Vite build tool configuration
├── package.json              ← lists all project dependencies
└── src/
    ├── firebase.js           ← Firebase config file (you create this in Step 6f)
    ├── App.jsx               ← sets up page routing (which URL shows which page)
    ├── main.jsx              ← app entry point, mounts React into index.html
    ├── index.css             ← global styles and the entire design system
    ├── components/           ← reusable sections used in the landing page
    │   ├── Navbar.jsx        ← top navigation bar
    │   ├── Hero.jsx          ← the big animated top section
    │   ├── Features.jsx      ← the four feature cards
    │   ├── HowItWorks.jsx    ← the 3-step explainer section
    │   ├── AIDemo.jsx        ← the live Claude API summarizer
    │   ├── Stats.jsx         ← animated number counters
    │   ├── Testimonials.jsx  ← customer review cards
    │   ├── Pricing.jsx       ← the three pricing plan cards
    │   ├── Team.jsx          ← team member cards
    │   ├── Contact.jsx       ← the EmailJS contact form
    │   └── Footer.jsx        ← bottom footer with links
    └── pages/                ← full pages, each mapped to a URL route
        ├── LandingPage.jsx   ← the main landing page at "/"
        ├── LoginPage.jsx     ← the login page at "/login"
        └── RegisterPage.jsx  ← the register page at "/register"
```

---

## Build for Production

When you're ready to submit or deploy the project:
```bash
bun run build
```
This creates an optimized `dist/` folder with your final app. To preview it locally before submitting:
```bash
bun run preview
```
