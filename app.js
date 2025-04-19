import {
    auth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,

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
window.toggleLike = toggleLike;
window.showLikedCards = showLikedCards;
window.showAllCards = showAllCards;
window.toggleNotifications = toggleNotifications;
window.clearNotifications = clearNotifications;

// Notification System
function addNotification(message, type) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    };
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationUI();
}

function updateNotificationUI() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationCount = document.querySelector('.notification-count');
    const notificationList = document.getElementById('notificationList');

    if (notificationCount) {
        notificationCount.textContent = unreadCount;
    }

    if (notificationList) {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="markAsRead(${notification.id})">
                <div>${notification.message}</div>
                <div class="time">${formatTime(notification.timestamp)}</div>
            </div>
        `).join('');
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
}

function clearNotifications() {
    localStorage.removeItem('notifications');
    updateNotificationUI();
}

function markAsRead(id) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateNotificationUI();
    }
}

// Function to simulate admin actions
function simulateAdminAction(action, apiName) {
    let message = '';
    switch (action) {
        case 'add':
            message = `New API "${apiName}" has been added`;
            break;
        case 'update':
            message = `API "${apiName}" has been updated`;
            break;
        case 'delete':
            message = `API "${apiName}" has been removed`;
            break;
    }
    addNotification(message, action);
}

// Initialize notifications on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNotificationUI();
});

// Update the initial load to initialize documentation
document.addEventListener('DOMContentLoaded', async() => {
    await initializeAPIDocumentation();
    const apiData = await loadAPIData();
    displayedAPIs = apiData.slice(0, 12);
    renderAPICards(displayedAPIs, 'apiGrid');
    document.getElementById('seeMore').style.display = apiData.length > 12 ? 'block' : 'none';

    // Update user dropdown
    updateUserDropdown();

    // Initialize like count
    updateLikeCount();
});

// Initialize API cards when the page loads
document.addEventListener('DOMContentLoaded', async() => {
    try {
        // Load API data from Firestore
        const apiData = await loadAPIData();

        // Get the container element
        const apiGrid = document.getElementById('apiGrid');

        if (apiGrid && apiData.length > 0) {
            // Clear existing content
            apiGrid.innerHTML = '';

            // Render each API card
            apiData.forEach(api => {
                const card = document.createElement('div');
                card.className = 'api-card';
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${api.name}</h3>
                        <span class="trust-score">${api.trustScore || 'N/A'}</span>
                    </div>
                    <div class="card-body">
                        <p>${api.description || 'No description available'}</p>
                        <div class="api-meta">
                            <span class="category">${api.category || 'General'}</span>
                            <span class="rating">${api.rating || 'N/A'}★</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button onclick="showDocs('${api.name}')" class="view-doc">View Doc</button>
                        <button onclick="showIntegration('${api.name}')" class="integrate">Integrate</button>
                    </div>
                `;
                apiGrid.appendChild(card);
            });
        } else {
            console.error('API grid container not found or no API data available');
        }
    } catch (error) {
        console.error('Error loading API cards:', error);
    }
});

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

// Integration Data for APIs
const integrationData = {
    "OpenWeatherMap": {
        title: "OpenWeatherMap Integration",
        description: "Integrate real-time weather data into your application. Get current weather, forecasts, and historical data.",
        steps: [
            "Sign up at openweathermap.org to get your API key",
            "Choose your preferred programming language",
            "Install required dependencies",
            "Use the example code below to get started"
        ],
        examples: {
            "JavaScript": {
                setup: "npm install axios",
                code: `const axios = require('axios');

async function getWeather(city) {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: 'YOUR_API_KEY',
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Usage
getWeather('London')
    .then(weather => console.log(weather))
    .catch(error => console.error(error));`
            },
            "Python": {
                setup: "pip install requests",
                code: `import requests

def get_weather(city):
    try:
        response = requests.get('https://api.openweathermap.org/data/2.5/weather', 
            params={
                'q': city,
                'appid': 'YOUR_API_KEY',
                'units': 'metric'
            })
        return response.json()
    except Exception as e:
        print(f'Error fetching weather: {e}')
        raise

# Usage
weather = get_weather('London')
print(weather)`
            }
        }
    },
    "NewsAPI": {
        title: "NewsAPI Integration",
        description: "Integrate news articles and headlines into your application. Get breaking news and top headlines from various sources.",
        steps: [
            "Sign up at newsapi.org to get your API key",
            "Choose your preferred programming language",
            "Install required dependencies",
            "Use the example code below to get started"
        ],
        examples: {
            "JavaScript": {
                setup: "npm install axios",
                code: `const axios = require('axios');

async function getNews(country = 'us') {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: country,
                apiKey: 'YOUR_API_KEY'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

// Usage
getNews()
    .then(news => console.log(news))
    .catch(error => console.error(error));`
            },
            "Python": {
                setup: "pip install requests",
                code: `import requests

def get_news(country='us'):
    try:
        response = requests.get('https://newsapi.org/v2/top-headlines',
            params={
                'country': country,
                'apiKey': 'YOUR_API_KEY'
            })
        return response.json()
    except Exception as e:
        print(f'Error fetching news: {e}')
        raise

# Usage
news = get_news()
print(news)`
            }
        }
    },
    "Stripe": {
        title: "Stripe Integration",
        description: "Integrate payment processing into your application. Accept payments, handle subscriptions, and manage customers.",
        steps: [
            "Sign up at stripe.com to get your API keys",
            "Choose your preferred programming language",
            "Install the Stripe SDK",
            "Use the example code below to get started"
        ],
        examples: {
            "JavaScript": {
                setup: "npm install stripe",
                code: `const stripe = require('stripe')('YOUR_SECRET_KEY');

async function createPaymentIntent(amount, currency = 'usd') {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card']
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
}

// Usage
createPaymentIntent(1000)
    .then(intent => console.log(intent))
    .catch(error => console.error(error));`
            },
            "Python": {
                setup: "pip install stripe",
                code: `import stripe
stripe.api_key = "YOUR_SECRET_KEY"

def create_payment_intent(amount, currency='usd'):
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            payment_method_types=['card']
        )
        return payment_intent
    except Exception as e:
        print(f'Error creating payment intent: {e}')
        raise

# Usage
intent = create_payment_intent(1000)
print(intent)`
            }
        }
    },
    "Twilio": {
        title: "Twilio Integration",
        description: "Integrate SMS and voice capabilities into your application. Send messages and make phone calls programmatically.",
        steps: [
            "Sign up at twilio.com to get your account credentials",
            "Choose your preferred programming language",
            "Install the Twilio SDK",
            "Use the example code below to get started"
        ],
        examples: {
            "JavaScript": {
                setup: "npm install twilio",
                code: `const accountSid = 'YOUR_ACCOUNT_SID';
const authToken = 'YOUR_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

async function sendSMS(to, from, body) {
    try {
        const message = await client.messages.create({
            body: body,
            from: from,
            to: to
        });
        return message;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// Usage
sendSMS('+1234567890', '+0987654321', 'Hello from Twilio!')
    .then(message => console.log(message))
    .catch(error => console.error(error));`
            },
            "Python": {
                setup: "pip install twilio",
                code: `from twilio.rest import Client

account_sid = 'YOUR_ACCOUNT_SID'
auth_token = 'YOUR_AUTH_TOKEN'
client = Client(account_sid, auth_token)

def send_sms(to, from_, body):
    try:
        message = client.messages.create(
            body=body,
            from_=from_,
            to=to
        )
        return message
    except Exception as e:
        print(f'Error sending SMS: {e}')
        raise

# Usage
message = send_sms('+1234567890', '+0987654321', 'Hello from Twilio!')
print(message)`
            }
        }
    },
    "Google Maps": {
        title: "Google Maps Integration",
        description: "Integrate maps and location services into your application. Get geocoding, directions, and place information.",
        steps: [
            "Sign up at Google Cloud Console to get your API key",
            "Choose your preferred programming language",
            "Install required dependencies",
            "Use the example code below to get started"
        ],
        examples: {
            "JavaScript": {
                setup: "npm install @googlemaps/google-maps-services-js",
                code: `const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

async function getGeocode(address) {
    try {
        const response = await client.geocode({
            params: {
                address: address,
                key: 'YOUR_API_KEY'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting geocode:', error);
        throw error;
    }
}

// Usage
getGeocode('1600 Amphitheatre Parkway, Mountain View, CA')
    .then(data => console.log(data))
    .catch(error => console.error(error));`
            },
            "Python": {
                setup: "pip install googlemaps",
                code: `import googlemaps

gmaps = googlemaps.Client(key='YOUR_API_KEY')

def get_geocode(address):
    try:
        geocode_result = gmaps.geocode(address)
        return geocode_result
    except Exception as e:
        print(f'Error getting geocode: {e}')
        raise

# Usage
result = get_geocode('1600 Amphitheatre Parkway, Mountain View, CA')
print(result)`
            }
        }
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

// Sort APIs by rating and get top 12
let displayedAPIs = [...apiData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

// Function to update like count in notification
function updateLikeCount() {
    const likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
    const likeCount = document.querySelector('.like-count');
    if (likeCount) {
        likeCount.textContent = likedCards.length;
        // Show/hide the count based on whether there are liked cards
        likeCount.style.display = likedCards.length > 0 ? 'block' : 'none';
    }
}

// Function to toggle like status of a card
function toggleLike(apiName) {
    let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
    const index = likedCards.indexOf(apiName);

    if (index === -1) {
        likedCards.push(apiName);
    } else {
        likedCards.splice(index, 1);
    }

    localStorage.setItem('likedCards', JSON.stringify(likedCards));
    updateLikeCount();
    updateLikeButton(apiName);
}

// Function to update like button appearance
function updateLikeButton(apiName) {
    const likeButton = document.querySelector(`[data-api="${apiName}"] .like-button`);
    if (likeButton) {
        const likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
        if (likedCards.includes(apiName)) {
            likeButton.innerHTML = '<i class="fas fa-heart"></i>';
            likeButton.classList.add('liked');
        } else {
            likeButton.innerHTML = '<i class="far fa-heart"></i>';
            likeButton.classList.remove('liked');
        }
    }
}

// Modified renderAPICards function to include like button
function renderAPICards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');

    data.forEach(api => {
        const isLiked = likedCards.includes(api.name);
        const card = document.createElement('div');
        card.className = 'api-card';
        card.setAttribute('data-api', api.name);
        card.innerHTML = `
            <div class="rating-heart-container">
                <span class="trust-score">${api.trustScore}/10</span>
                <button class="like-button ${isLiked ? 'liked' : ''}" onclick="toggleLike('${api.name}')">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <h3>${api.name}</h3>
            <p>${api.description}</p>
            <p>Languages: ${api.languages.join(', ')}</p>
            <p class="security-alert">Security: ${api.securityAlert}</p>
            <p>License: ${api.license}</p>
            <div class="buttons">
                <button onclick="showDocs('${api.name}')" class="view-doc">View Doc</button>
                <button onclick="showIntegration('${api.name}')" class="integrate">Integrate</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to show all APIs
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

// API Documentation Data
const apiDocumentation = {
    "OpenWeatherMap": {
        title: "OpenWeatherMap API Documentation",
        description: "Access current weather data for any location including over 200,000 cities. Get real-time weather information, forecasts, and historical data.",
        endpoints: [{
                name: "Current Weather",
                url: "https://api.openweathermap.org/data/2.5/weather",
                method: "GET",
                parameters: [
                    { name: "q", type: "string", required: true, description: "City name" },
                    { name: "appid", type: "string", required: true, description: "Your API key" },
                    { name: "units", type: "string", required: false, description: "Units of measurement (metric/imperial)" }
                ]
            },
            {
                name: "5 Day Forecast",
                url: "https://api.openweathermap.org/data/2.5/forecast",
                method: "GET",
                parameters: [
                    { name: "q", type: "string", required: true, description: "City name" },
                    { name: "appid", type: "string", required: true, description: "Your API key" }
                ]
            }
        ],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://api.openweathermap.org/data/2.5/weather',
    params={'q': 'London', 'appid': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "NewsAPI": {
        title: "NewsAPI Documentation",
        description: "Search worldwide news articles and headlines from all over the web in real-time. Access breaking news, top headlines, and news sources.",
        endpoints: [{
                name: "Top Headlines",
                url: "https://newsapi.org/v2/top-headlines",
                method: "GET",
                parameters: [
                    { name: "country", type: "string", required: false, description: "2-letter ISO 3166-1 code of the country" },
                    { name: "apiKey", type: "string", required: true, description: "Your API key" },
                    { name: "category", type: "string", required: false, description: "News category (business, entertainment, general, health, science, sports, technology)" }
                ]
            },
            {
                name: "Everything",
                url: "https://newsapi.org/v2/everything",
                method: "GET",
                parameters: [
                    { name: "q", type: "string", required: true, description: "Keywords or phrases to search for" },
                    { name: "apiKey", type: "string", required: true, description: "Your API key" }
                ]
            }
        ],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://newsapi.org/v2/top-headlines',
    params={'country': 'us', 'apiKey': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "Stripe": {
        title: "Stripe API Documentation",
        description: "Accept payments, send payouts, and manage your business online. Process credit cards, handle subscriptions, and manage your customers.",
        endpoints: [{
                name: "Create Payment Intent",
                url: "https://api.stripe.com/v1/payment_intents",
                method: "POST",
                parameters: [
                    { name: "amount", type: "integer", required: true, description: "Amount in smallest currency unit" },
                    { name: "currency", type: "string", required: true, description: "Three-letter ISO currency code" },
                    { name: "payment_method_types[]", type: "array", required: false, description: "List of payment method types" }
                ]
            },
            {
                name: "Create Customer",
                url: "https://api.stripe.com/v1/customers",
                method: "POST",
                parameters: [
                    { name: "email", type: "string", required: false, description: "Customer's email address" },
                    { name: "name", type: "string", required: false, description: "Customer's full name" }
                ]
            }
        ],
        examples: [{
                language: "JavaScript",
                code: `const stripe = require('stripe')('YOUR_SECRET_KEY');

const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd'
});`
            },
            {
                language: "Python",
                code: `import stripe
stripe.api_key = "YOUR_SECRET_KEY"

payment_intent = stripe.PaymentIntent.create(
    amount=1000,
    currency='usd'
)`
            }
        ]
    },
    "Twilio": {
        title: "Twilio API Documentation",
        description: "Send SMS messages, make phone calls, and handle voice interactions. Build communication features into your applications.",
        endpoints: [{
            name: "Send SMS",
            url: "https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json",
            method: "POST",
            parameters: [
                { name: "To", type: "string", required: true, description: "Destination phone number" },
                { name: "From", type: "string", required: true, description: "Twilio phone number" },
                { name: "Body", type: "string", required: true, description: "Message content" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const accountSid = 'YOUR_ACCOUNT_SID';
const authToken = 'YOUR_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hello from Twilio!',
        from: '+1234567890',
        to: '+0987654321'
    })`
            },
            {
                language: "Python",
                code: `from twilio.rest import Client

account_sid = 'YOUR_ACCOUNT_SID'
auth_token = 'YOUR_AUTH_TOKEN'
client = Client(account_sid, auth_token)

message = client.messages.create(
    body='Hello from Twilio!',
    from_='+1234567890',
    to='+0987654321'
)`
            }
        ]
    },
    "Google Maps": {
        title: "Google Maps API Documentation",
        description: "Add maps, geocoding, and location services to your applications. Get directions, place information, and location data.",
        endpoints: [{
                name: "Geocoding",
                url: "https://maps.googleapis.com/maps/api/geocode/json",
                method: "GET",
                parameters: [
                    { name: "address", type: "string", required: true, description: "Address to geocode" },
                    { name: "key", type: "string", required: true, description: "Your API key" }
                ]
            },
            {
                name: "Directions",
                url: "https://maps.googleapis.com/maps/api/directions/json",
                method: "GET",
                parameters: [
                    { name: "origin", type: "string", required: true, description: "Starting location" },
                    { name: "destination", type: "string", required: true, description: "Ending location" },
                    { name: "key", type: "string", required: true, description: "Your API key" }
                ]
            }
        ],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://maps.googleapis.com/maps/api/geocode/json',
    params={'address': '1600 Amphitheatre Parkway, Mountain View, CA',
            'key': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "Spotify": {
        title: "Spotify API Documentation",
        description: "Access Spotify's music catalog and user data. Search for tracks, albums, and artists, and manage user playlists.",
        endpoints: [{
            name: "Search",
            url: "https://api.spotify.com/v1/search",
            method: "GET",
            parameters: [
                { name: "q", type: "string", required: true, description: "Search query" },
                { name: "type", type: "string", required: true, description: "Item types to search (album, artist, playlist, track)" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const token = 'YOUR_ACCESS_TOKEN';
fetch('https://api.spotify.com/v1/search?q=track:Believer&type=track', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}
response = requests.get('https://api.spotify.com/v1/search',
    params={'q': 'track:Believer', 'type': 'track'},
    headers=headers)
data = response.json()
print(data)`
            }
        ]
    },
    "GitHub": {
        title: "GitHub API Documentation",
        description: "Access GitHub's repositories, users, and organization data. Manage repositories, issues, and pull requests programmatically.",
        endpoints: [{
            name: "Get Repository",
            url: "https://api.github.com/repos/{owner}/{repo}",
            method: "GET",
            parameters: [
                { name: "owner", type: "string", required: true, description: "Repository owner" },
                { name: "repo", type: "string", required: true, description: "Repository name" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.github.com/repos/octocat/Hello-World')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://api.github.com/repos/octocat/Hello-World')
data = response.json()
print(data)`
            }
        ]
    },
    "SendGrid": {
        title: "SendGrid API Documentation",
        description: "Send and track emails, manage contacts, and handle email templates. Build reliable email delivery into your applications.",
        endpoints: [{
            name: "Send Email",
            url: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            parameters: [
                { name: "personalizations", type: "array", required: true, description: "Recipient information" },
                { name: "from", type: "object", required: true, description: "Sender information" },
                { name: "subject", type: "string", required: true, description: "Email subject" },
                { name: "content", type: "array", required: true, description: "Email content" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_API_KEY');

const msg = {
    to: 'recipient@example.com',
    from: 'sender@example.com',
    subject: 'Test email',
    text: 'Hello from SendGrid!'
};

sgMail.send(msg);`
            },
            {
                language: "Python",
                code: `import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

sg = sendgrid.SendGridAPIClient('YOUR_API_KEY')
from_email = Email("sender@example.com")
to_email = To("recipient@example.com")
subject = "Test email"
content = Content("text/plain", "Hello from SendGrid!")
mail = Mail(from_email, to_email, subject, content)

response = sg.client.mail.send.post(request_body=mail.get())`
            }
        ]
    },
    "Alpha Vantage": {
        title: "Alpha Vantage API Documentation",
        description: "Access real-time and historical stock market data, technical indicators, and cryptocurrency information.",
        endpoints: [{
            name: "Time Series Daily",
            url: "https://www.alphavantage.co/query",
            method: "GET",
            parameters: [
                { name: "function", type: "string", required: true, description: "TIME_SERIES_DAILY" },
                { name: "symbol", type: "string", required: true, description: "Stock symbol" },
                { name: "apikey", type: "string", required: true, description: "Your API key" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://www.alphavantage.co/query',
    params={'function': 'TIME_SERIES_DAILY',
            'symbol': 'IBM',
            'apikey': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "Pexels": {
        title: "Pexels API Documentation",
        description: "Access high-quality free stock photos and videos. Search and download media for your projects.",
        endpoints: [{
            name: "Search Photos",
            url: "https://api.pexels.com/v1/search",
            method: "GET",
            parameters: [
                { name: "query", type: "string", required: true, description: "Search term" },
                { name: "per_page", type: "integer", required: false, description: "Number of results per page" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.pexels.com/v1/search?query=nature', {
    headers: {
        'Authorization': 'YOUR_API_KEY'
    }
})
.then(response => response.json())
.then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

headers = {
    'Authorization': 'YOUR_API_KEY'
}
response = requests.get('https://api.pexels.com/v1/search',
    params={'query': 'nature'},
    headers=headers)
data = response.json()
print(data)`
            }
        ]
    },
    "Unsplash": {
        title: "Unsplash API Documentation",
        description: "Access a vast collection of high-quality free images. Search, download, and manage photos for your projects.",
        endpoints: [{
            name: "Search Photos",
            url: "https://api.unsplash.com/search/photos",
            method: "GET",
            parameters: [
                { name: "query", type: "string", required: true, description: "Search term" },
                { name: "per_page", type: "integer", required: false, description: "Number of results per page" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.unsplash.com/search/photos?query=nature', {
    headers: {
        'Authorization': 'Client-ID YOUR_ACCESS_KEY'
    }
})
.then(response => response.json())
.then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

headers = {
    'Authorization': 'Client-ID YOUR_ACCESS_KEY'
}
response = requests.get('https://api.unsplash.com/search/photos',
    params={'query': 'nature'},
    headers=headers)
data = response.json()
print(data)`
            }
        ]
    },
    "Trello": {
        title: "Trello API Documentation",
        description: "Manage boards, lists, and cards programmatically. Create, update, and organize your Trello workspace.",
        endpoints: [{
            name: "Create Card",
            url: "https://api.trello.com/1/cards",
            method: "POST",
            parameters: [
                { name: "name", type: "string", required: true, description: "Card name" },
                { name: "idList", type: "string", required: true, description: "ID of the list to add the card to" },
                { name: "desc", type: "string", required: false, description: "Card description" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.trello.com/1/cards', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'New Card',
        idList: 'YOUR_LIST_ID',
        key: 'YOUR_API_KEY',
        token: 'YOUR_TOKEN'
    })
})
.then(response => response.json())
.then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

url = "https://api.trello.com/1/cards"
query = {
    'key': 'YOUR_API_KEY',
    'token': 'YOUR_TOKEN',
    'name': 'New Card',
    'idList': 'YOUR_LIST_ID'
}
response = requests.post(url, params=query)
print(response.json())`
            }
        ]
    },
    "Discord": {
        title: "Discord API Documentation",
        description: "Create bots and interact with Discord servers. Send messages, manage channels, and handle user interactions.",
        endpoints: [{
            name: "Send Message",
            url: "https://discord.com/api/v10/channels/{channel.id}/messages",
            method: "POST",
            parameters: [
                { name: "content", type: "string", required: true, description: "Message content" },
                { name: "tts", type: "boolean", required: false, description: "Text-to-speech" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.content === '!hello') {
        await message.channel.send('Hello!');
    }
});

client.login('YOUR_BOT_TOKEN');`
            },
            {
                language: "Python",
                code: `import discord
from discord.ext import commands

bot = commands.Bot(command_prefix='!')

@bot.event
async def on_ready():
    print('Bot is ready!')

@bot.command()
async def hello(ctx):
    await ctx.send('Hello!')

bot.run('YOUR_BOT_TOKEN')`
            }
        ]
    },
    "NASA": {
        title: "NASA API Documentation",
        description: "Access NASA's data including images, videos, and space information. Explore the universe through NASA's APIs.",
        endpoints: [{
            name: "APOD (Astronomy Picture of the Day)",
            url: "https://api.nasa.gov/planetary/apod",
            method: "GET",
            parameters: [
                { name: "api_key", type: "string", required: true, description: "Your NASA API key" },
                { name: "date", type: "string", required: false, description: "Date in YYYY-MM-DD format" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://api.nasa.gov/planetary/apod',
    params={'api_key': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "Reddit": {
        title: "Reddit API Documentation",
        description: "Access Reddit's data including posts, comments, and user information. Interact with Reddit's content programmatically.",
        endpoints: [{
            name: "Get Subreddit Posts",
            url: "https://oauth.reddit.com/r/{subreddit}/hot",
            method: "GET",
            parameters: [
                { name: "limit", type: "integer", required: false, description: "Number of posts to return" },
                { name: "after", type: "string", required: false, description: "Fullname of the last item" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const snoowrap = require('snoowrap');

const r = new snoowrap({
    userAgent: 'YOUR_USER_AGENT',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN'
});

r.getSubreddit('programming').getHot()
    .then(posts => console.log(posts))`
            },
            {
                language: "Python",
                code: `import praw

reddit = praw.Reddit(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    user_agent='YOUR_USER_AGENT'
)

for submission in reddit.subreddit('programming').hot(limit=10):
    print(submission.title)`
            }
        ]
    },
    "Twitter": {
        title: "Twitter API Documentation",
        description: "Access Twitter's data including tweets, users, and trends. Post tweets and interact with Twitter's platform.",
        endpoints: [{
            name: "Post Tweet",
            url: "https://api.twitter.com/2/tweets",
            method: "POST",
            parameters: [
                { name: "text", type: "string", required: true, description: "Tweet content" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'YOUR_API_KEY',
    appSecret: 'YOUR_API_SECRET',
    accessToken: 'YOUR_ACCESS_TOKEN',
    accessSecret: 'YOUR_ACCESS_SECRET',
});

await client.v2.tweet('Hello Twitter!');`
            },
            {
                language: "Python",
                code: `import tweepy

client = tweepy.Client(
    consumer_key='YOUR_API_KEY',
    consumer_secret='YOUR_API_SECRET',
    access_token='YOUR_ACCESS_TOKEN',
    access_token_secret='YOUR_ACCESS_SECRET'
)

client.create_tweet(text='Hello Twitter!')`
            }
        ]
    },
    "OMDb": {
        title: "OMDb API Documentation",
        description: "Access movie and TV show information. Search for titles, get plot summaries, and retrieve ratings.",
        endpoints: [{
            name: "Search Movies",
            url: "http://www.omdbapi.com/",
            method: "GET",
            parameters: [
                { name: "s", type: "string", required: true, description: "Search term" },
                { name: "apikey", type: "string", required: true, description: "Your API key" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('http://www.omdbapi.com/?s=inception&apikey=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('http://www.omdbapi.com/',
    params={'s': 'inception', 'apikey': 'YOUR_API_KEY'})
data = response.json()
print(data)`
            }
        ]
    },
    "CoinGecko": {
        title: "CoinGecko API Documentation",
        description: "Access cryptocurrency data including prices, market caps, and trading volumes. Track crypto markets in real-time.",
        endpoints: [{
            name: "Get Coin Price",
            url: "https://api.coingecko.com/api/v3/simple/price",
            method: "GET",
            parameters: [
                { name: "ids", type: "string", required: true, description: "Comma-separated list of coin IDs" },
                { name: "vs_currencies", type: "string", required: true, description: "Comma-separated list of currencies" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://api.coingecko.com/api/v3/simple/price',
    params={'ids': 'bitcoin', 'vs_currencies': 'usd'})
data = response.json()
print(data)`
            }
        ]
    },
    "Firebase": {
        title: "Firebase API Documentation",
        description: "Access Firebase services including Authentication, Realtime Database, and Cloud Storage. Build scalable applications.",
        endpoints: [{
            name: "Write Data",
            url: "https://{project-id}.firebaseio.com/{path}.json",
            method: "PUT",
            parameters: [
                { name: "auth", type: "string", required: true, description: "Firebase auth token" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
    // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

set(ref(db, 'users/123'), {
    name: 'John Doe',
    email: 'john@example.com'
});`
            },
            {
                language: "Python",
                code: `from firebase_admin import initialize_app, db

app = initialize_app()
ref = db.reference('users/123')
ref.set({
    'name': 'John Doe',
    'email': 'john@example.com'
})`
            }
        ]
    },
    "Algolia": {
        title: "Algolia API Documentation",
        description: "Implement powerful search functionality in your applications. Index and search through your data efficiently.",
        endpoints: [{
            name: "Search Index",
            url: "https://{app-id}-dsn.algolia.net/1/indexes/{index-name}/query",
            method: "POST",
            parameters: [
                { name: "query", type: "string", required: true, description: "Search query" },
                { name: "hitsPerPage", type: "integer", required: false, description: "Number of results per page" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const algoliasearch = require('algoliasearch');

const client = algoliasearch('YOUR_APP_ID', 'YOUR_API_KEY');
const index = client.initIndex('your_index_name');

index.search('query', {
    hitsPerPage: 10
}).then(({ hits }) => {
    console.log(hits);
});`
            },
            {
                language: "Python",
                code: `from algoliasearch.search_client import SearchClient

client = SearchClient.create('YOUR_APP_ID', 'YOUR_API_KEY')
index = client.init_index('your_index_name')

results = index.search('query', {
    'hitsPerPage': 10
})
print(results['hits'])`
            }
        ]
    },
    "Mapbox": {
        title: "Mapbox API Documentation",
        description: "Create custom maps and add location features to your applications. Access geocoding and routing services.",
        endpoints: [{
            name: "Geocoding",
            url: "https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json",
            method: "GET",
            parameters: [
                { name: "access_token", type: "string", required: true, description: "Your Mapbox access token" },
                { name: "limit", type: "integer", required: false, description: "Number of results to return" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=YOUR_ACCESS_TOKEN')
    .then(response => response.json())
    .then(data => console.log(data))`
            },
            {
                language: "Python",
                code: `import requests

response = requests.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json',
    params={'access_token': 'YOUR_ACCESS_TOKEN'})
data = response.json()
print(data)`
            }
        ]
    },
    "Cloudinary": {
        title: "Cloudinary API Documentation",
        description: "Manage and transform images and videos in the cloud. Upload, store, and deliver media assets efficiently.",
        endpoints: [{
            name: "Upload Image",
            url: "https://api.cloudinary.com/v1_1/{cloud_name}/image/upload",
            method: "POST",
            parameters: [
                { name: "file", type: "file", required: true, description: "Image file to upload" },
                { name: "upload_preset", type: "string", required: true, description: "Upload preset name" }
            ]
        }],
        examples: [{
                language: "JavaScript",
                code: `const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'YOUR_CLOUD_NAME',
    api_key: 'YOUR_API_KEY',
    api_secret: 'YOUR_API_SECRET'
});

cloudinary.uploader.upload('path/to/image.jpg', {
    upload_preset: 'YOUR_UPLOAD_PRESET'
}, (error, result) => {
    console.log(result);
});`
            },
            {
                language: "Python",
                code: `import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name='YOUR_CLOUD_NAME',
    api_key='YOUR_API_KEY',
    api_secret='YOUR_API_SECRET'
)

result = cloudinary.uploader.upload('path/to/image.jpg',
    upload_preset='YOUR_UPLOAD_PRESET')
print(result)`
            }
        ]
    }
};

// Function to show documentation
function showDocs(apiName) {
    const modal = document.getElementById('documentationModal');
    const modalContent = document.getElementById('docModalContent');

    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }

    const apiDoc = apiDocumentation[apiName];
    if (!apiDoc) {
        showNotification('Documentation not available for this API', 'error');
        return;
    }

    let content = `
        <div class="modal-header">
            <h2>${apiDoc.title}</h2>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <p>${apiDoc.description}</p>
            <div class="endpoints">
                <h3>Endpoints</h3>
                ${apiDoc.endpoints.map(endpoint => `
                    <div class="endpoint">
                        <h4>${endpoint.name}</h4>
                        <p><strong>URL:</strong> ${endpoint.url}</p>
                        <p><strong>Method:</strong> ${endpoint.method}</p>
                        ${endpoint.parameters ? `
                            <div class="parameters">
                                <h4>Parameters</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Type</th>
                                            <th>Required</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${endpoint.parameters.map(param => `
                                            <tr>
                                                <td>${param.name}</td>
                                                <td>${param.type}</td>
                                                <td>${param.required ? 'Yes' : 'No'}</td>
                                                <td>${param.description}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            <div class="examples">
                <h3>Examples</h3>
                ${apiDoc.examples.map(example => `
                    <div class="example">
                        <h4>${example.language}</h4>
                        <pre><code>${example.code}</code></pre>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'block';

    // Close modal when clicking the close button
    const closeButton = modalContent.querySelector('.close-modal');
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Function to show integration details
function showIntegration(apiName) {
    const modal = document.getElementById('integrationModal');
    const modalContent = document.getElementById('modalContent');
    const integration = integrationData[apiName];

    if (!integration) {
        showNotification('Integration details not available for this API', 'error');
        return;
    }

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${integration.title}</h2>
            <button class="close-modal" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="description">
                <h3>Description</h3>
                <p>${integration.description}</p>
            </div>
            <div class="steps">
                <h3>Integration Steps</h3>
                <ol>
                    ${integration.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            <div class="examples">
                <h3>Code Examples</h3>
                ${Object.entries(integration.examples).map(([lang, example]) => `
                    <div class="example">
                        <h4>${lang}</h4>
                        <div class="setup">
                            <h5>Setup</h5>
                            <pre><code>${example.setup}</code></pre>
                        </div>
                        <div class="code">
                            <h5>Example Code</h5>
                            <pre><code>${example.code}</code></pre>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('documentationModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('documentationModal');
    if (event.target === modal) {
        closeModal();
    }
});

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

// Function to show all cards
function showAllCards() {
    document.querySelector('.section-title').textContent = 'Explore APIs & Libraries';
    renderAPICards(apiData, 'apiGrid');
}

// Function to show liked cards
function showLikedCards() {
    const likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
    const likedAPIs = apiData.filter(api => likedCards.includes(api.name));
    document.querySelector('.section-title').textContent = 'Saved Cards';
    renderAPICards(likedAPIs, 'apiGrid');
    // Hide the See More button when showing saved cards
    document.getElementById('seeMore').style.display = 'none';
}