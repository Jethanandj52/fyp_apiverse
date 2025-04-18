import {
    auth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "./script-config.js";

window.signin = function signin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "" || password === "") {
        alert("Please fill in the required fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;

            if (email === "admin@gmail.com") {
                // Redirect to admin dashboard
                window.location.href = "dashboard.html";
            } else {
                // Redirect to home page
                window.location.href = "home.html";
            }
        })
        .catch((error) => {
            alert("Login Failed: " + error.message);
            console.error(error);
        });
};

window.googleSignIn = function googleSignIn() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            if (user.email === "admin@gmail.com") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "home.html";
            }
        })
        .catch((error) => {
            alert("Google Sign in Failed: " + error.message);
        })
}

window.forget = function forget() {
    const email = document.getElementById("email").value; // Input field for email

    if (email === "") {
        alert("Please enter your email address.");

    } else {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Please check your inbox.");
                // Optionally, redirect to login page
                window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;


                alert(errorMessage);

            });

    }



}



let password = document.getElementById("password")
let passwordtogel = document.getElementById("togglePassword")

window.passwordShow = function passwordShow() {
    if (password.type === "password") {
        password.type = "text"
        passwordtogel.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password"
        passwordtogel.classList.replace("fa-eye-slash", "fa-eye");
    }

}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// User profile dropdown functionality
const userProfileBtn = document.getElementById('userProfileBtn');
const userDropdown = document.querySelector('.user-dropdown');
if (userProfileBtn && userDropdown) {
    userProfileBtn.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const suggestions = document.querySelector('.suggestions');
if (searchInput && suggestions) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
            // Here you would typically make an API call to get suggestions
            // For now, we'll just show a loading state
            suggestions.innerHTML = '<div>Loading suggestions...</div>';
            suggestions.classList.add('active');
        } else {
            suggestions.classList.remove('active');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('active');
        }
    });
}

// Make functions available globally
window.toggleTheme = toggleTheme;
window.toggleUserDropdown = toggleUserDropdown;
window.filterAPIs = filterAPIs;
window.showSection = showSection;
window.toggleDoc = toggleDoc;
window.showDocs = showDocs;
window.showIntegration = showIntegration;
window.closeModal = closeModal;
window.toggleSidebar = toggleSidebar;
window.showAllAPIs = showAllAPIs;

// Dummy API Data (22 APIs)
const apiData = [{
    name: "OpenWeatherMap",
    description: "Real-time weather data.",
    trustScore: 8.5,
    languages: ["JavaScript", "Python", "Java"],
    category: "Weather",
    rating: 4.2,
    securityAlert: "No known vulnerabilities",
    license: "MIT"
}, {
    name: "NewsAPI",
    description: "Live news articles.",
    trustScore: 7.8,
    languages: ["Python", "JavaScript"],
    category: "News",
    rating: 3.8,
    securityAlert: "Minor rate limit issues",
    license: "Apache 2.0"
}, {
    name: "Stripe",
    description: "Payment processing.",
    trustScore: 9.0,
    languages: ["JavaScript", "Java"],
    category: "Payment",
    rating: 4.5,
    securityAlert: "Requires PCI compliance",
    license: "Proprietary"
}, {
    name: "Twilio",
    description: "SMS and voice APIs.",
    trustScore: 8.2,
    languages: ["JavaScript", "Python"],
    category: "Communication",
    rating: 4.0,
    securityAlert: "Secure API key storage needed",
    license: "Proprietary"
}, {
    name: "Google Maps",
    description: "Mapping and geolocation.",
    trustScore: 8.8,
    languages: ["JavaScript", "Python"],
    category: "Geolocation",
    rating: 4.3,
    securityAlert: "API key restrictions advised",
    license: "Proprietary"
}, {
    name: "Spotify",
    description: "Music streaming APIs.",
    trustScore: 7.5,
    languages: ["JavaScript"],
    category: "Entertainment",
    rating: 3.9,
    securityAlert: "OAuth required",
    license: "Proprietary"
}, {
    name: "GitHub",
    description: "Access GitHub repos.",
    trustScore: 8.9,
    languages: ["JavaScript", "Python"],
    category: "Development",
    rating: 4.4,
    securityAlert: "Rate limits apply",
    license: "MIT"
}, {
    name: "SendGrid",
    description: "Email delivery.",
    trustScore: 8.0,
    languages: ["Python", "Java"],
    category: "Communication",
    rating: 4.1,
    securityAlert: "Secure key storage",
    license: "Proprietary"
}, {
    name: "Alpha Vantage",
    description: "Stock market data.",
    trustScore: 7.7,
    languages: ["JavaScript", "Python"],
    category: "Finance",
    rating: 3.7,
    securityAlert: "Free tier limits",
    license: "MIT"
}, {
    name: "Pexels",
    description: "Free stock photos.",
    trustScore: 7.9,
    languages: ["JavaScript"],
    category: "Media",
    rating: 3.8,
    securityAlert: "No major issues",
    license: "CC0"
}, {
    name: "Unsplash",
    description: "High-quality images.",
    trustScore: 8.1,
    languages: ["JavaScript", "Python"],
    category: "Media",
    rating: 4.0,
    securityAlert: "Rate limits",
    license: "Proprietary"
}, {
    name: "Trello",
    description: "Project management APIs.",
    trustScore: 7.6,
    languages: ["JavaScript"],
    category: "Productivity",
    rating: 3.9,
    securityAlert: "OAuth required",
    license: "Proprietary"
}, {
    name: "Discord",
    description: "Bot and community APIs.",
    trustScore: 8.3,
    languages: ["JavaScript", "Python"],
    category: "Communication",
    rating: 4.2,
    securityAlert: "Bot token security",
    license: "Proprietary"
}, {
    name: "NASA",
    description: "Space and astronomy data.",
    trustScore: 8.4,
    languages: ["Python", "JavaScript"],
    category: "Science",
    rating: 4.1,
    securityAlert: "No major issues",
    license: "Public Domain"
}, {
    name: "Reddit",
    description: "Social media APIs.",
    trustScore: 7.4,
    languages: ["Python"],
    category: "Social",
    rating: 3.6,
    securityAlert: "OAuth complexity",
    license: "Proprietary"
}, {
    name: "Twitter",
    description: "Tweet and user data.",
    trustScore: 7.3,
    languages: ["JavaScript", "Python"],
    category: "Social",
    rating: 3.5,
    securityAlert: "API restrictions",
    license: "Proprietary"
}, {
    name: "OMDb",
    description: "Movie and TV data.",
    trustScore: 7.5,
    languages: ["JavaScript"],
    category: "Entertainment",
    rating: 3.7,
    securityAlert: "Free tier limits",
    license: "MIT"
}, {
    name: "CoinGecko",
    description: "Cryptocurrency data.",
    trustScore: 8.0,
    languages: ["Python", "JavaScript"],
    category: "Finance",
    rating: 4.0,
    securityAlert: "No major issues",
    license: "MIT"
}, {
    name: "Firebase",
    description: "Backend-as-a-service.",
    trustScore: 8.7,
    languages: ["JavaScript"],
    category: "Development",
    rating: 4.3,
    securityAlert: "Secure rules needed",
    license: "Proprietary"
}, {
    name: "Algolia",
    description: "Search-as-a-service.",
    trustScore: 8.2,
    languages: ["JavaScript", "Python"],
    category: "Search",
    rating: 4.1,
    securityAlert: "API key security",
    license: "Proprietary"
}, {
    name: "Mapbox",
    description: "Custom maps and geodata.",
    trustScore: 8.1,
    languages: ["JavaScript"],
    category: "Geolocation",
    rating: 4.0,
    securityAlert: "Usage limits",
    license: "Proprietary"
}, {
    name: "Cloudinary",
    description: "Image and video management.",
    trustScore: 7.9,
    languages: ["JavaScript", "Python"],
    category: "Media",
    rating: 3.9,
    securityAlert: "Secure key storage",
    license: "Proprietary"
}];

// Dummy Integration Data for APIs
const integrationData = {
    "OpenWeatherMap": {
        instructions: "Sign up at https://openweathermap.org to get your API key. Use the key in the 'appid' parameter.",
        code: `fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY')
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Error:', err));`
    },
    "NewsAPI": {
        instructions: "Get your API key from https://newsapi.org. Include it in the 'apiKey' parameter.",
        code: `fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY')
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Error:', err));`
    },
    "Stripe": {
        instructions: "Create an account at https://stripe.com and get your secret key. Use it with Stripe's SDK or API.",
        code: `// Install Stripe SDK: npm install @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe('YOUR_PUBLISHABLE_KEY');
const paymentIntent = await fetch('https://your-backend/create-payment-intent', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ amount: 1000, currency: 'usd' })
}).then(res => res.json());`
    },
    // Default for others
    "default": {
        instructions: "Visit the API provider's website to get started. Follow their documentation for API key and setup.",
        code: `fetch('https://api.example.com/data?key=YOUR_API_KEY')
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('Error:', err));`
    }
};

// Dummy Logged-In User Data
let loggedInUser = {
    name: "Ali Khan",
    email: "ali@example.com"
}; // Replace with real user data from backend
// let loggedInUser = null; // Uncomment to test no user logged in

// Update User Dropdown with Firebase Auth data
function updateUserDropdown() {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAction = document.getElementById('userAction');
    const userSettings = document.getElementById('userSettings');
    const userHelp = document.getElementById('userHelp');

    // Get current user from Firebase Auth
    const user = auth.currentUser;

    if (user) {
        // User is signed in
        userName.textContent = `Name: ${user.displayName || 'User'}`;
        userEmail.textContent = `Email: ${user.email}`;
        userAction.textContent = 'Logout';
        userAction.onclick = () => {
            auth.signOut().then(() => {
                // Sign-out successful
                window.location.href = "index.html";
            }).catch((error) => {
                // An error happened
                console.error('Error signing out:', error);
            });
        };
        userSettings.onclick = () => {
            // Add settings functionality here
            alert('Settings page coming soon!');
        };
        userHelp.onclick = () => {
            // Add help functionality here
            alert('Help & Support page coming soon!');
        };
    } else {
        // No user is signed in
        userName.textContent = 'Not logged in';
        userEmail.textContent = 'Please login to view your profile';
        userAction.textContent = 'Login';
        userAction.onclick = () => {
            window.location.href = "index.html";
        };
        userSettings.style.display = 'none';
        userHelp.style.display = 'none';
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateUserDropdown();
    } else {
        // User is signed out
        updateUserDropdown();
    }
});

let displayedAPIs = apiData.slice(0, 12);

// Render API Cards
function renderAPICards(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.forEach(api => {
        const card = `
  <div class="api-card">
    <div style="display: flex; justify-content: space-between;">
      <h3>${api.name}</h3>
      <span class="trust-score">${api.trustScore}/10</span>
    </div>
    <p>${api.description}</p>
    <p>Languages: ${api.languages.join(', ')}</p>
    <p class="security-alert">Security: ${api.securityAlert}</p>
    <p>License: ${api.license}</p>
    <div class="buttons">
      <a href="#" onclick="showDocs('${api.name}')">View Docs</a>
      <button onclick="showIntegration('${api.name}')">Integrate</button>
    </div>
  </div>
`;
        container.innerHTML += card;
    });
}

// Initial Render
renderAPICards(displayedAPIs, 'apiGrid');
document.getElementById('seeMore').style.display = apiData.length > 12 ? 'block' : 'none';

// Show All APIs
function showAllAPIs() {
    displayedAPIs = apiData;
    renderAPICards(displayedAPIs, 'apiGrid');
    document.getElementById('seeMore').style.display = 'none';
}

// Filter APIs
function filterAPIs() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const language = document.getElementById('languageFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const rating = parseFloat(document.getElementById('ratingFilter').value);

    const filtered = apiData.filter(api => {
        const matchesSearch = api.name.toLowerCase().includes(search) || api.description.toLowerCase().includes(search);
        const matchesLanguage = language === 'all' || api.languages.includes(language);
        const matchesCategory = category === 'all' || api.category === category;
        const matchesRating = rating === 0 || api.rating >= rating;
        return matchesSearch && matchesLanguage && matchesCategory && matchesRating;
    });

    displayedAPIs = filtered.slice(0, 12);
    if (filtered.length <= 12) {
        displayedAPIs = filtered;
        document.getElementById('seeMore').style.display = 'none';
    } else {
        document.getElementById('seeMore').style.display = 'block';
    }

    // Update suggestions
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    if (search) {
        filtered.slice(0, 5).forEach(api => {
            const div = document.createElement('div');
            div.textContent = api.name;
            div.onclick = () => {
                document.getElementById('searchInput').value = api.name;
                suggestions.classList.remove('active');
                filterAPIs();
            };
            suggestions.appendChild(div);
        });
        suggestions.classList.add('active');
    } else {
        suggestions.classList.remove('active');
    }

    renderAPICards(displayedAPIs, 'apiGrid');
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    document.getElementById('sidebar').classList.remove('active');
}

// Toggle Documentation
function toggleDoc(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('active');
}

// Show Docs
function showDocs(apiName) {
    showSection('docs');
    // In real app, fetch docs for apiName from backend
}

// Show Integration Modal
function showIntegration(apiName) {
    const modal = document.getElementById('integrationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalInstructions = document.getElementById('modalInstructions');
    const codeArea = document.getElementById('codeArea');

    const integration = integrationData[apiName] || integrationData["default"];
    modalTitle.textContent = `Integrate ${apiName}`;
    modalInstructions.textContent = integration.instructions;
    codeArea.value = integration.code;

    modal.style.display = 'flex';
}

// Close Modal
function closeModal() {
    document.getElementById('integrationModal').style.display = 'none';
}

// Toggle Sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('light');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Toggle User Dropdown
function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// Close suggestions and dropdown on click outside
document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar')) {
        document.getElementById('suggestions').classList.remove('active');
    }
    if (!e.target.closest('.user-profile')) {
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initial render of API cards
    renderAPICards(displayedAPIs, 'apiGrid');
    document.getElementById('seeMore').style.display = apiData.length > 12 ? 'block' : 'none';

    // Update user dropdown
    updateUserDropdown();
});

// Make logout function globally accessible
window.logout = function() {
    auth.signOut()
        .then(() => {
            // Clear user data from local storage
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
}