import {
    auth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "./script-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6jaYK4e7LFtqzycT-KO5sDYi7ipWf4oA",
    authDomain: "api-verse-dc2bc.firebaseapp.com",
    projectId: "api-verse-dc2bc",
    storageBucket: "api-verse-dc2bc.appspot.com",
    messagingSenderId: "692038670622",
    appId: "1:692038670622:web:3ed37cf8f741078bb8910f",
    measurementId: "G-9YF1DR0SFZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore Collections
const apisCollection = db.collection('apis');
const usersCollection = db.collection('users');

// Load API Data from Firestore
async function loadAPIData() {
    try {
        const snapshot = await apisCollection.get();
        apiData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayedAPIs = [...apiData];
        renderAPICards();
        updateStats();
    } catch (error) {
        console.error('Error loading API data:', error);
        // Fallback to dummy data if Firestore fails
        apiData = [
            { name: "OpenWeatherMap", description: "Weather data API", languages: ["JavaScript", "Python"], category: "Weather", trustScore: 8.5 },
            { name: "NewsAPI", description: "Live news feeds", languages: ["Python", "Java"], category: "News", trustScore: 7.8 }
        ];
        displayedAPIs = [...apiData];
        renderAPICards();
    }
}

// Add API to Firestore
async function addAPIToFirestore(api) {
    try {
        const docRef = await apisCollection.add(api);
        api.id = docRef.id;
        apiData.push(api);
        displayedAPIs = [...apiData];
        renderAPICards();
        updateStats();
        addNotification('API Added', `${api.name} added successfully`);
    } catch (error) {
        console.error('Error adding API:', error);
        alert('Failed to add API');
    }
}

// Update API in Firestore
async function updateAPIInFirestore(apiId, updatedAPI) {
    try {
        await apisCollection.doc(apiId).update(updatedAPI);
        apiData = apiData.map(api => api.id === apiId ? {...api, ...updatedAPI } : api);
        displayedAPIs = [...apiData];
        renderAPICards();
        updateStats();
        addNotification('API Updated', `${updatedAPI.name} updated successfully`);
    } catch (error) {
        console.error('Error updating API:', error);
        alert('Failed to update API');
    }
}

// Delete API from Firestore
async function deleteAPIFromFirestore(apiId) {
    try {
        await apisCollection.doc(apiId).delete();
        apiData = apiData.filter(api => api.id !== apiId);
        displayedAPIs = [...apiData];
        renderAPICards();
        updateStats();
        addNotification('API Deleted', 'API removed successfully');
    } catch (error) {
        console.error('Error deleting API:', error);
        alert('Failed to delete API');
    }
}

// Load User Data from Firestore
async function loadUserData() {
    try {
        const snapshot = await usersCollection.get();
        userData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayedUsers = [...userData];
        renderUserCards();
        updateStats();
    } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to dummy data if Firestore fails
        userData = [
            { id: '1', name: "Ali Khan", email: "ali@example.com", role: "User", status: "Active" },
            { id: '2', name: "Sara Ahmed", email: "sara@example.com", role: "User", status: "Inactive" }
        ];
        displayedUsers = [...userData];
        renderUserCards();
    }
}

// Add User to Firestore
async function addUserToFirestore(user) {
    try {
        const docRef = await usersCollection.add(user);
        user.id = docRef.id;
        userData.push(user);
        displayedUsers = [...userData];
        renderUserCards();
        updateStats();
        addNotification('User Added', `${user.name} added successfully`);
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user');
    }
}

// Update User in Firestore
async function updateUserInFirestore(userId, updatedUser) {
    try {
        await usersCollection.doc(userId).update(updatedUser);
        userData = userData.map(user => user.id === userId ? {...user, ...updatedUser } : user);
        displayedUsers = [...userData];
        renderUserCards();
        updateStats();
        addNotification('User Updated', `${updatedUser.name} updated successfully`);
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user');
    }
}

// Delete User from Firestore
async function deleteUserFromFirestore(userId) {
    try {
        await usersCollection.doc(userId).delete();
        userData = userData.filter(user => user.id !== userId);
        displayedUsers = [...userData];
        renderUserCards();
        updateStats();
        addNotification('User Deleted', 'User removed successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Authentication Functions
window.signin = function signin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "" || password === "") {
        alert("Please fill in the required fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.email === "admin@gmail.com") {
                window.location.href = "dashboard.html";
            } else {
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
        });
};

window.forget = function forget() {
    const email = document.getElementById("email").value;

    if (email === "") {
        alert("Please enter your email address.");
    } else {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Please check your inbox.");
                window.location.href = "index.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    }
};

window.passwordShow = function passwordShow() {
    const password = document.getElementById("password");
    const passwordtogel = document.getElementById("togglePassword");
    if (password.type === "password") {
        password.type = "text";
        passwordtogel.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password";
        passwordtogel.classList.replace("fa-eye-slash", "fa-eye");
    }
};

// Dummy API Data
const apiData = [{
        name: "OpenWeatherMap",
        description: "Real-time weather data.",
        trustScore: 8.5,
        languages: ["JavaScript", "Python", "Java"],
        category: "Weather",
        rating: 4.2,
        securityAlert: "No known vulnerabilities",
        license: "MIT"
    },
    {
        name: "NewsAPI",
        description: "Live news articles.",
        trustScore: 7.8,
        languages: ["Python", "JavaScript"],
        category: "News",
        rating: 3.8,
        securityAlert: "Minor rate limit issues",
        license: "Apache 2.0"
    }
];

// Firestore User Management
let userData = [];

async function fetchUsers() {
    try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        userData = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderUserCards();
        updateStats();
    } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to dummy data
        userData = [
            { id: '1', name: "Ali Khan", email: "ali@example.com", role: "User", status: "Active" },
            { id: '2', name: "Sara Ahmed", email: "sara@example.com", role: "User", status: "Inactive" }
        ];
        renderUserCards();
    }
}

async function addUser(user) {
    try {
        const usersCollection = collection(db, "users");
        const docRef = await addDoc(usersCollection, user);
        userData.push({ id: docRef.id, ...user });
        renderUserCards();
        updateStats();
        addNotification('User Added', `${user.name} added successfully`);
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user');
    }
}

async function updateUser(userId, updatedUser) {
    try {
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, updatedUser);
        userData = userData.map(u => u.id === userId ? { id: userId, ...updatedUser } : u);
        renderUserCards();
        updateStats();
        addNotification('User Updated', `${updatedUser.name} updated successfully`);
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user');
    }
}

async function deleteUser(userId) {
    try {
        const userDoc = doc(db, "users", userId);
        const user = userData.find(u => u.id === userId);
        await deleteDoc(userDoc);
        userData = userData.filter(u => u.id !== userId);
        renderUserCards();
        updateStats();
        addNotification('User Deleted', `${user.name} deleted`);
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Dashboard State
let displayedAPIs = [...apiData];
let displayedUsers = [...userData];
let notifications = [];
let unreadCount = 0;

// Authentication Check
auth.onAuthStateChanged(user => {
    try {
        if (user && user.email === "admin@gmail.com") {
            document.getElementById('userName').textContent = user.displayName || "Admin";
            document.getElementById('userEmail').textContent = user.email;
            initializeDashboard();
        } else {
            console.warn('No admin user logged in');
            alert('Please log in as admin');
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error('Auth state change error:', error);
    }
});

// Initialize Dashboard
function initializeDashboard() {
    try {
        loadAPIData();
        loadUserData();
        initializeCharts();
        addNotification("Welcome", "Welcome to the APIverse Admin Dashboard!");
        updateUserDropdown();
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
    }
}

// Update Stats
function updateStats() {
    try {
        document.getElementById('totalApis').textContent = apiData.length;
        document.getElementById('activeUsers').textContent = userData.filter(u => u.status === "Active").length;
        document.getElementById('apiCalls').textContent = Math.floor(Math.random() * 2000);
        document.getElementById('securityAlerts').textContent = Math.floor(Math.random() * 5);
    } catch (error) {
        console.error('Update stats failed:', error);
    }
}

// Render API Cards
function renderAPICards() {
    try {
        const apiGrid = document.getElementById('apiGrid');
        apiGrid.innerHTML = displayedAPIs.length ? '' : '<p>No APIs found</p>';
        displayedAPIs.forEach(api => {
            apiGrid.innerHTML += `
                <div class="api-card">
                    <h3>${api.name}</h3>
                    <p>${api.description}</p>
                    <p>Languages: ${api.languages.join(', ')}</p>
                    <p>Category: ${api.category}</p>
                    <div class="buttons">
                        <button onclick="editAPI('${api.id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteAPI('${api.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Render API cards failed:', error);
    }
}

// Render User Cards
function renderUserCards() {
    try {
        const userGrid = document.getElementById('userGrid');
        userGrid.innerHTML = displayedUsers.length ? '' : '<p>No users found</p>';
        displayedUsers = [...userData]; // Update displayed users
        displayedUsers.forEach(user => {
            userGrid.innerHTML += `
                <div class="user-card">
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Role: ${user.role}</p>
                    <p>Status: ${user.status}</p>
                    <div class="buttons">
                        <button onclick="editUser('${user.id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Render user cards failed:', error);
    }
}

// Filter Dashboard
function filterDashboard() {
    try {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const suggestions = document.getElementById('suggestions');
        displayedAPIs = apiData.filter(api =>
            api.name.toLowerCase().includes(search) ||
            api.description.toLowerCase().includes(search)
        );
        displayedUsers = userData.filter(user =>
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search)
        );

        suggestions.innerHTML = '';
        if (search) {
            const combined = [
                ...displayedAPIs.map(api => ({ type: 'API', name: api.name })),
                ...displayedUsers.map(user => ({ type: 'User', name: user.name }))
            ].slice(0, 5);
            combined.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `${item.type}: ${item.name}`;
                div.onclick = () => {
                    document.getElementById('searchInput').value = item.name;
                    filterDashboard();
                };
                suggestions.appendChild(div);
            });
            suggestions.classList.add('active');
        } else {
            suggestions.classList.remove('active');
        }

        renderAPICards();
        renderUserCards();
    } catch (error) {
        console.error('Filter dashboard failed:', error);
    }
}

// Show Section
function showSection(sectionId) {
    try {
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        document.getElementById('sidebar').classList.remove('active');
    } catch (error) {
        console.error('Show section failed:', error);
    }
}

// Toggle Sidebar
function toggleSidebar() {
    try {
        document.getElementById('sidebar').classList.toggle('active');
    } catch (error) {
        console.error('Toggle sidebar failed:', error);
    }
}

// Toggle Theme
function toggleTheme() {
    try {
        document.body.classList.toggle('light');
        const icon = document.querySelector('.theme-toggle i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    } catch (error) {
        console.error('Toggle theme failed:', error);
    }
}

// Toggle User Dropdown
function toggleUserDropdown() {
    try {
        document.getElementById('userDropdown').classList.toggle('active');
    } catch (error) {
        console.error('Toggle user dropdown failed:', error);
    }
}

// Update User Dropdown
function updateUserDropdown() {
    try {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAction = document.getElementById('userAction');
        const userSettings = document.getElementById('userSettings');
        const userHelp = document.getElementById('userHelp');

        const user = auth.currentUser;
        if (user) {
            userName.textContent = `Name: ${user.displayName || 'Admin'}`;
            userEmail.textContent = `Email: ${user.email}`;
            userAction.textContent = 'Logout';
            userAction.onclick = window.logout;
            userSettings.onclick = () => alert('Settings page coming soon!');
            userHelp.onclick = () => alert('Help & Support page coming soon!');
        } else {
            userName.textContent = 'Not logged in';
            userEmail.textContent = 'Please login to view your profile';
            userAction.textContent = 'Login';
            userAction.onclick = () => window.location.href = "index.html";
            userSettings.style.display = 'none';
            userHelp.style.display = 'none';
        }
    } catch (error) {
        console.error('Update user dropdown failed:', error);
    }
}

// Notifications
function toggleNotificationDropdown() {
    try {
        document.getElementById('notificationDropdown').classList.toggle('active');
    } catch (error) {
        console.error('Toggle notification dropdown failed:', error);
    }
}

function addNotification(title, message) {
    try {
        notifications.unshift({
            id: Date.now(),
            title,
            message,
            time: new Date(),
            read: false
        });
        unreadCount++;
        renderNotifications();
        updateNotificationBadge();
    } catch (error) {
        console.error('Add notification failed:', error);
    }
}

function renderNotifications() {
    try {
        const list = document.getElementById('notificationList');
        list.innerHTML = notifications.length ? '' : '<div class="notification-item">No notifications</div>';
        notifications.forEach(n => {
            list.innerHTML += `
                <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markAsRead(${n.id})">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-message">${n.message}</div>
                    <div class="notification-time">${formatTime(n.time)}</div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Render notifications failed:', error);
    }
}

function markAsRead(id) {
    try {
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            unreadCount--;
            renderNotifications();
            updateNotificationBadge();
        }
    } catch (error) {
        console.error('Mark as read failed:', error);
    }
}

function markAllAsRead() {
    try {
        notifications.forEach(n => n.read = true);
        unreadCount = 0;
        renderNotifications();
        updateNotificationBadge();
    } catch (error) {
        console.error('Mark all as read failed:', error);
    }
}

function updateNotificationBadge() {
    try {
        const badge = document.getElementById('notificationBadge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount ? 'block' : 'none';
    } catch (error) {
        console.error('Update notification badge failed:', error);
    }
}

function formatTime(date) {
    try {
        const diff = (new Date() - date) / 60000;
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${Math.floor(diff)}m ago`;
        return `${Math.floor(diff / 60)}h ago`;
    } catch (error) {
        console.error('Format time failed:', error);
        return '';
    }
}

// Modal
function openAddAPIModal() {
    try {
        document.getElementById('addAPIModal').style.display = 'flex';
    } catch (error) {
        console.error('Open add API modal failed:', error);
    }
}

function closeAddAPIModal() {
    try {
        document.getElementById('addAPIModal').style.display = 'none';
        document.getElementById('addAPIForm').reset();
    } catch (error) {
        console.error('Close add API modal failed:', error);
    }
}

function openAddUserModal() {
    try {
        document.getElementById('addUserModal').style.display = 'flex';
    } catch (error) {
        console.error('Open add user modal failed:', error);
    }
}

function closeAddUserModal() {
    try {
        document.getElementById('addUserModal').style.display = 'none';
        document.getElementById('addUserForm').reset();
    } catch (error) {
        console.error('Close add user modal failed:', error);
    }
}

function openEditUserModal(userId) {
    try {
        const user = userData.find(u => u.id === userId);
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserStatus').value = user.status;
            document.getElementById('editUserModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Open edit user modal failed:', error);
    }
}

function closeEditUserModal() {
    try {
        document.getElementById('editUserModal').style.display = 'none';
        document.getElementById('editUserForm').reset();
    } catch (error) {
        console.error('Close edit user modal failed:', error);
    }
}

// Add API
document.getElementById('addAPIForm').addEventListener('submit', async e => {
    try {
        e.preventDefault();
        const newAPI = {
            name: document.getElementById('apiName').value,
            description: document.getElementById('apiDescription').value,
            languages: document.getElementById('apiLanguages').value.split(',').map(l => l.trim()),
            category: document.getElementById('apiCategory').value,
            trustScore: parseFloat(document.getElementById('apiTrustScore').value)
        };
        await addAPIToFirestore(newAPI);
        closeAddAPIModal();
    } catch (error) {
        console.error('Add API failed:', error);
    }
});

// Add User
document.getElementById('addUserForm').addEventListener('submit', async e => {
    try {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            role: document.getElementById('userRole').value,
            status: document.getElementById('userStatus').value
        };
        await addUserToFirestore(newUser);
        closeAddUserModal();
    } catch (error) {
        console.error('Add user failed:', error);
    }
});

// Edit User
document.getElementById('editUserForm').addEventListener('submit', async e => {
    try {
        e.preventDefault();
        const userId = document.getElementById('editUserId').value;
        const updatedUser = {
            name: document.getElementById('editUserName').value,
            email: document.getElementById('editUserEmail').value,
            role: document.getElementById('editUserRole').value,
            status: document.getElementById('editUserStatus').value
        };
        await updateUserInFirestore(userId, updatedUser);
        closeEditUserModal();
    } catch (error) {
        console.error('Edit user failed:', error);
    }
});

// Edit/Delete APIs
function editAPI(apiId) {
    try {
        const api = apiData.find(a => a.id === apiId);
        if (api) {
            document.getElementById('editAPIId').value = api.id;
            document.getElementById('editAPIName').value = api.name;
            document.getElementById('editAPIDescription').value = api.description;
            document.getElementById('editAPILanguages').value = api.languages.join(', ');
            document.getElementById('editAPICategory').value = api.category;
            document.getElementById('editAPITrustScore').value = api.trustScore;
            document.getElementById('editAPIModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Edit API failed:', error);
    }
}

function deleteAPI(apiId) {
    try {
        if (confirm('Are you sure you want to delete this API?')) {
            deleteAPIFromFirestore(apiId);
        }
    } catch (error) {
        console.error('Delete API failed:', error);
    }
}

// Edit/Delete Users
window.editUser = function(userId) {
    try {
        const user = userData.find(u => u.id === userId);
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserStatus').value = user.status;
            document.getElementById('editUserModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Edit user failed:', error);
    }
};

window.deleteUser = function(userId) {
    try {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUserFromFirestore(userId);
        }
    } catch (error) {
        console.error('Delete user failed:', error);
    }
};

// Charts
function initializeCharts() {
    try {
        if (!window.Chart) {
            console.error('Chart.js not loaded');
            return;
        }

        new Chart(document.getElementById('usageChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'API Calls',
                    data: [500, 700, 600, 800, 900, 1000],
                    borderColor: '#60a5fa',
                    fill: false
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });

        new Chart(document.getElementById('topApisChart'), {
            type: 'bar',
            data: {
                labels: apiData.map(api => api.name).slice(0, 5),
                datasets: [{
                    label: 'Usage',
                    data: apiData.map(() => Math.random() * 1000).slice(0, 5),
                    backgroundColor: '#60a5fa'
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });

        new Chart(document.getElementById('userActivityChart'), {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: [
                        userData.filter(u => u.status === 'Active').length || 1,
                        userData.filter(u => u.status === 'Inactive').length || 1
                    ],
                    backgroundColor: ['#60a5fa', '#ef4444']
                }]
            },
            options: { responsive: true }
        });
    } catch (error) {
        console.error('Initialize charts failed:', error);
    }
}

// Logout
window.logout = function() {
    try {
        auth.signOut().then(() => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Logout failed:', error);
            alert('Error logging out');
        });
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

// Close Dropdowns
document.addEventListener('click', e => {
    try {
        if (!e.target.closest('.search-bar')) document.getElementById('suggestions').classList.remove('active');
        if (!e.target.closest('.user-profile')) document.getElementById('userDropdown').classList.remove('active');
        if (!e.target.closest('.notification-container')) document.getElementById('notificationDropdown').classList.remove('active');
    } catch (error) {
        console.error('Close dropdowns failed:', error);
    }
});

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize event listeners for theme toggle and user profile
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        const userProfileBtn = document.getElementById('userProfileBtn');
        const userDropdown = document.querySelector('.user-dropdown');
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', toggleUserDropdown);
        }

        const searchInput = document.querySelector('.search-bar input');
        const suggestions = document.querySelector('.suggestions');
        if (searchInput && suggestions) {
            searchInput.addEventListener('input', filterDashboard);
        }
    } catch (error) {
        console.error('Page initialization failed:', error);
    }
});