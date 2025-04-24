import {
    auth,
    getAuth,
    deleteUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    doc,
    setDoc,
    addDoc,
    db,
    collection,
    getDocs,
    deleteDoc,
    getDoc,
    signOut,
    query,
    where,
    onAuthStateChanged
} from './script-config.js';

const ctx = document.getElementById('apiUsageChart').getContext('2d');

new Chart(ctx, {
    type: 'line', // Chart ka type (line, bar, pie, etc.)
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // X-axis ke values
        datasets: [{
            label: 'API Calls', // Line ka naam (legend mein aata hai)
            data: [500, 700, 600, 800, 900, 1000], // Y-axis values
            borderColor: '#60a5fa', // Line ka color
            backgroundColor: 'transparent', // Fill color (transparent for line chart)
            tension: 0, // Smooth curves
            pointBackgroundColor: '#60a5fa' // Dots ka color
        }]
    },
    options: {
        responsive: true, // Mobile friendly
        plugins: {
            legend: {
                labels: {
                    color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                },
                grid: {
                    color: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                }
            },
            y: {
                beginAtZero: true, // Y-axis 0 se start kare
                ticks: {
                    color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                },
                grid: {
                    color: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                }
            }
        }
    }
});

window.overview = function overview() {
    let api = document.getElementById("apiManagment")
    api.style.display = "none"

    let overview = document.getElementById("overview")
    overview.style.display = "block"

    let userManagment = document.getElementById("userManagment")
    userManagment.style.display = "none"

    let analytics = document.getElementById("analytics")
    analytics.style.display = "none"
}

window.apiManagment = function apiManagment() {
    let api = document.getElementById("apiManagment")
    api.style.display = "block"

    let overview = document.getElementById("overview")
    overview.style.display = "none"

    let userManagment = document.getElementById("userManagment")
    userManagment.style.display = "none"

    let analytics = document.getElementById("analytics")
    analytics.style.display = "none"
}

window.userManagment = function userManagment() {
    let api = document.getElementById("apiManagment")
    api.style.display = "none"

    let overview = document.getElementById("overview")
    overview.style.display = "none"

    let userManagment = document.getElementById("userManagment")
    userManagment.style.display = "block"

    let analytics = document.getElementById("analytics")
    analytics.style.display = "none"
}

window.analytics = function analytics() {
    let api = document.getElementById("apiManagment")
    api.style.display = "none"

    let overview = document.getElementById("overview")
    overview.style.display = "none"

    let userManagment = document.getElementById("userManagment")
    userManagment.style.display = "none"

    let analytics = document.getElementById("analytics")
    analytics.style.display = "block"
}

window.backWindow = function backWindow() {
    window.location.href = "home.html"
}

window.addAPI = function addAPI() {
    let popup = document.getElementById("popup")
    popup.style.display = "flex"
}

window.cancel = function cancel() {
    let popup = document.getElementById("popup")
    popup.style.display = "none"
}

// Add new functions for documentation and integration popups
window.showDocPopup = function(apiId) {
    const docPopup = document.getElementById("docPopup");
    docPopup.style.display = "flex";
    // Store current API ID for later use
    docPopup.dataset.apiId = apiId;
}

window.showIntegrationPopup = function(apiId) {
    const integrationPopup = document.getElementById("integrationPopup");
    integrationPopup.style.display = "flex";
    // Store current API ID for later use
    integrationPopup.dataset.apiId = apiId;
}

window.closeDocPopup = function() {
    const docPopup = document.getElementById("docPopup");
    if (docPopup) {
        docPopup.style.display = "none";
    }
};

window.closeIntegrationPopup = function() {
    const integrationPopup = document.getElementById("integrationPopup");
    integrationPopup.style.display = "none";
}

// Modified addData function to handle all data in one go
window.addData = async function addData() {
    // Basic API Information
    const name = document.getElementById('apiName').value.trim();
    const description = document.getElementById('description').value.trim();
    const language = document.getElementById('language').value.trim();
    const category = document.getElementById('category').value;
    const security = document.getElementById('security').value.trim();
    const license = document.getElementById('license').value.trim();

    // Documentation Information
    const docTitle = document.getElementById('docTitle').value.trim();
    const docDescription = document.getElementById('docDescription').value.trim();
    const endpoints = document.getElementById('endpoints').value.trim();
    const parameters = document.getElementById('parameters').value.trim();
    const docExamples = document.getElementById('examples').value.trim();

    // Integration Information
    const integrationTitle = document.getElementById('integrationTitle').value.trim();
    const integrationDescription = document.getElementById('integrationDescription').value.trim();
    const setupSteps = document.getElementById('setupSteps').value.trim();
    const codeExamples = document.getElementById('codeExamples').value.trim();

    // Required fields check
    if (!name || !description || !language || !category || !security || !license ||
        !docTitle || !docDescription || !endpoints || !parameters || !docExamples ||
        !integrationTitle || !integrationDescription || !setupSteps || !codeExamples) {
        alert("Please fill in all required fields.");
        return;
    }

    const apiData = {
        // Basic API Information
        name,
        description,
        language: language.split(',').map(lang => lang.trim()),
        category,
        security,
        license,
        createdAt: new Date(),

        // Documentation Information
        documentation: {
            title: docTitle,
            description: docDescription,
            endpoints,
            parameters,
            examples: docExamples,
            createdAt: new Date()
        },

        // Integration Information
        integration: {
            title: integrationTitle,
            description: integrationDescription,
            setupSteps,
            codeExamples,
            createdAt: new Date()
        }
    };

    try {
        const docRef = await addDoc(collection(db, "apis"), apiData);
        alert("API successfully added!");
        document.getElementById("popup").style.display = "none";
        fetchData(); // Refresh the API cards without page reload
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to add API.");
    }
};

// Modified fetchData function to add delete button
async function fetchData() {
    const apisCollection = collection(db, "apis");
    const querySnapshot = await getDocs(apisCollection);
    const container = document.getElementById("apiCardContainer");
    const countDiv = document.getElementById("apiCountDiv"); // <-- Count div

    container.innerHTML = ""; // Clear the container

    // Show total count
    countDiv.innerText = ` ${querySnapshot.size}`;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const apiCard = document.createElement("div");
        apiCard.className = "apiCard";
        apiCard.setAttribute('data-api-id', doc.id);
        apiCard.innerHTML = `
            <div class="cardHeader">
                <h2>${data.name}</h2>
                <i class="fa fa-trash delete-icon" onclick="deleteAPI('${doc.id}', '${data.name}')" title="Delete API"></i>
            </div>
            <p>${data.description}</p>
            <p><b>Languages: </b>${data.language.join(', ')}</p>
            <p><b>Security: </b>${data.security}</p>
            <p><b>License: </b>${data.license}</p>
            <div class="veiwBtn">
                <button onclick="viewDocumentation('${doc.id}')" class="edit-btn">View Doc</button>
                <button onclick="viewIntegration('${doc.id}')" class="edit-btn integrate-btn">Integration</button>
            </div>
        `;
        container.appendChild(apiCard);
    });
}


// Function to view documentation
window.viewDocumentation = async function(apiId) {
    try {
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const docData = data.documentation;

            // Show the popup
            const docPopup = document.getElementById("docPopup");
            docPopup.style.display = "flex";

            // Update popup content with improved layout and edit buttons
            document.getElementById("addDoc").innerHTML = `
                <div class="addApiName">
                    <h1>${docData.title}</h1>
                    <i class="fa fa-xmark" onclick="closeDocPopup()"></i>
                </div>
                <div class="addApiInput">
                    <div class="content-block">
                        <div class="block-header">
                            <h3>Description</h3>
                            <button class="edit-toggle-btn small" onclick="toggleEditField('description', '${apiId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        <div class="content" id="description-content-${apiId}">${docData.description}</div>
                        <div class="edit-field" id="description-edit-${apiId}" style="display: none;">
                            <textarea id="description-input-${apiId}" class="edit-input">${docData.description}</textarea>
                            <button class="update-btn" onclick="updateDocField('${apiId}', 'description')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>

                    <div class="section-header">
                        <span>Endpoints</span>
                        <button class="edit-toggle-btn small" onclick="toggleEditField('endpoints', '${apiId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="code-block">
                        <pre id="endpoints-content-${apiId}">${docData.endpoints}</pre>
                        <div class="edit-field" id="endpoints-edit-${apiId}" style="display: none;">
                            <textarea id="endpoints-input-${apiId}" class="edit-input">${docData.endpoints}</textarea>
                            <button class="update-btn" onclick="updateDocField('${apiId}', 'endpoints')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>

                    <div class="section-header">
                        <span>Parameters</span>
                        <button class="edit-toggle-btn small" onclick="toggleEditField('parameters', '${apiId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="code-block">
                        <pre id="parameters-content-${apiId}">${docData.parameters}</pre>
                        <div class="edit-field" id="parameters-edit-${apiId}" style="display: none;">
                            <textarea id="parameters-input-${apiId}" class="edit-input">${docData.parameters}</textarea>
                            <button class="update-btn" onclick="updateDocField('${apiId}', 'parameters')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>

                    <div class="section-header">
                        <span>Examples</span>
                        <button class="edit-toggle-btn small" onclick="toggleEditField('examples', '${apiId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="code-block">
                        <pre id="examples-content-${apiId}">${docData.examples}</pre>
                        <div class="edit-field" id="examples-edit-${apiId}" style="display: none;">
                            <textarea id="examples-input-${apiId}" class="edit-input">${docData.examples}</textarea>
                            <button class="update-btn" onclick="updateDocField('${apiId}', 'examples')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            alert("Documentation not found!");
        }
    } catch (error) {
        console.error("Error loading documentation: ", error);
        alert("Error loading documentation");
    }
};

// Function to toggle edit fields
window.toggleEditField = function(fieldName, apiId) {
    const contentElement = document.getElementById(`${fieldName}-content-${apiId}`);
    const editElement = document.getElementById(`${fieldName}-edit-${apiId}`);

    if (editElement.style.display === 'none') {
        contentElement.style.display = 'none';
        editElement.style.display = 'block';
    } else {
        contentElement.style.display = 'block';
        editElement.style.display = 'none';
    }
};

// Function to update documentation field
window.updateDocField = async function(apiId, fieldName) {
    try {
        const inputValue = document.getElementById(`${fieldName}-input-${apiId}`).value;
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedDocumentation = {
                ...data.documentation,
                [fieldName]: inputValue
            };

            await setDoc(docRef, {
                ...data,
                documentation: updatedDocumentation
            });

            // Update the displayed content
            document.getElementById(`${fieldName}-content-${apiId}`).innerHTML = inputValue;
            toggleEditField(fieldName, apiId);

            showNotification(`Documentation ${fieldName} updated successfully`, "update");
        }
    } catch (error) {
        console.error("Error updating documentation: ", error);
        alert("Failed to update documentation");
    }
};

// Function to view integration
window.viewIntegration = async function(apiId) {
    try {
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const integrationData = data.integration;

            // Show the popup
            const integrationPopup = document.getElementById("integrationPopup");
            integrationPopup.style.display = "flex";

            // Update popup content with improved layout and edit buttons
            document.getElementById("addIntegration").innerHTML = `
                <div class="addApiName">
                    <h1>${integrationData.title}</h1>
                    <i class="fa fa-xmark" onclick="closeIntegrationPopup()"></i>
                </div>
                <div class="addApiInput">
                    <div class="content-block">
                        <div class="block-header">
                            <h3>Description</h3>
                            <button class="edit-toggle-btn small" onclick="toggleEditField('integration-description', '${apiId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        <div class="content" id="integration-description-content-${apiId}">${integrationData.description}</div>
                        <div class="edit-field" id="integration-description-edit-${apiId}" style="display: none;">
                            <textarea id="integration-description-input-${apiId}" class="edit-input">${integrationData.description}</textarea>
                            <button class="update-btn" onclick="updateIntegrationField('${apiId}', 'description')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>

                    <div class="section-header">
                        <span>Setup Steps</span>
                        <button class="edit-toggle-btn small" onclick="toggleEditField('integration-setup', '${apiId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="code-block">
                        <pre id="integration-setup-content-${apiId}">${integrationData.setupSteps}</pre>
                        <div class="edit-field" id="integration-setup-edit-${apiId}" style="display: none;">
                            <textarea id="integration-setup-input-${apiId}" class="edit-input">${integrationData.setupSteps}</textarea>
                            <button class="update-btn" onclick="updateIntegrationField('${apiId}', 'setupSteps')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>

                    <div class="section-header">
                        <span>Code Examples</span>
                        <button class="edit-toggle-btn small" onclick="toggleEditField('integration-code', '${apiId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="code-block">
                        <pre id="integration-code-content-${apiId}">${integrationData.codeExamples}</pre>
                        <div class="edit-field" id="integration-code-edit-${apiId}" style="display: none;">
                            <textarea id="integration-code-input-${apiId}" class="edit-input">${integrationData.codeExamples}</textarea>
                            <button class="update-btn" onclick="updateIntegrationField('${apiId}', 'codeExamples')">
                                <i class="fas fa-save"></i> Update
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            alert("Integration data not found!");
        }
    } catch (error) {
        console.error("Error loading integration: ", error);
        alert("Error loading integration data");
    }
};

// Function to update integration field
window.updateIntegrationField = async function(apiId, fieldName) {
    try {
        const inputValue = document.getElementById(`integration-${fieldName === 'setupSteps' ? 'setup' : fieldName === 'codeExamples' ? 'code' : fieldName}-input-${apiId}`).value;
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedIntegration = {
                ...data.integration,
                [fieldName]: inputValue
            };

            await setDoc(docRef, {
                ...data,
                integration: updatedIntegration
            });

            // Update the displayed content
            document.getElementById(`integration-${fieldName === 'setupSteps' ? 'setup' : fieldName === 'codeExamples' ? 'code' : fieldName}-content-${apiId}`).innerHTML = inputValue;
            toggleEditField(`integration-${fieldName === 'setupSteps' ? 'setup' : fieldName === 'codeExamples' ? 'code' : fieldName}`, apiId);

            showNotification(`Integration ${fieldName} updated successfully`, "update");
        }
    } catch (error) {
        console.error("Error updating integration: ", error);
        alert("Failed to update integration");
    }
};

// Toggle edit form visibility
window.toggleEditForm = function(fieldId, apiId) {
    const form = document.getElementById(`edit-${fieldId}-${apiId}`);
    form.classList.toggle('show');
};

// Update documentation
window.updateDocumentation = async function(apiId, field) {
    try {
        const inputValue = document.getElementById(`${field}-input-${apiId}`).value;
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedData = {
                ...data,
                documentation: {
                    ...data.documentation,
                    [field]: inputValue
                }
            };

            await setDoc(docRef, updatedData);
            alert(`${field} updated successfully!`);
            viewDocumentation(apiId); // Refresh the view
        }
    } catch (error) {
        console.error("Error updating documentation: ", error);
        alert("Failed to update documentation");
    }
};

// Update integration
window.updateIntegration = async function(apiId, field) {
    try {
        const inputValue = document.getElementById(`${field}-input-${apiId}`).value;
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedData = {
                ...data,
                integration: {
                    ...data.integration,
                    [field]: inputValue
                }
            };

            await setDoc(docRef, updatedData);
            alert(`${field} updated successfully!`);
            viewIntegration(apiId); // Refresh the view
        }
    } catch (error) {
        console.error("Error updating integration: ", error);
        alert("Failed to update integration");
    }
};
async function fetchuserData() {
    const apisCollection = collection(db, "users");
    let userCount = document.getElementById("userCount");
    const querySnapshot = await getDocs(apisCollection);
    const container = document.getElementById("userContainer");

    console.log("Total Users:", querySnapshot.size); // Debug

    userCount.innerText = ` ${querySnapshot.size}`;
    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("User Data:", data); // Debug

        const apiCard = document.createElement("div");
        apiCard.className = "apiCard";
        apiCard.innerHTML = `
            <div><b>User Name:</b> ${data.userName}</div>
            <div><b>Email:</b> ${data.email}</div>
            <p><b>Role:</b> User</p>
            <div class="veiwBtn">
                <button onclick="deleteUserFromFirestore('${doc.id}')" class="delete-btn">Delete User</button>
            </div>
        `;
        container.appendChild(apiCard);
    });
}




window.deleteUserFromFirestore = async function deleteUserFromFirestore(uid) {
    try {
        const userDocRef = doc(db, "users", uid); // assuming "users" collection
        await deleteDoc(userDocRef);
        console.log("User data deleted from Firestore.");
        location.reload()
        showNotification("User has been deleted successfully", "delete");
        return true;
    } catch (error) {
        console.error("Error deleting user data from Firestore:", error);
        return false;
    }
}

// Function to show API management section
window.apiManagment = function apiManagment() {
    document.getElementById('overview').style.display = 'none';

    document.getElementById('apiManagment').style.display = 'block';
    document.getElementById('userManagment').style.display = 'none';
    document.getElementById('analytics').style.display = 'none';


}

// Function to show user management section

// Add delete API function with confirmation including API name
window.deleteAPI = async function(apiId, apiName) {
    if (confirm(`Are you sure you want to delete the API "${apiName}"?`)) {
        try {
            const apiRef = doc(db, "apis", apiId);
            await deleteDoc(apiRef);

            // Find and remove the specific card from DOM
            const cardToRemove = document.querySelector(`.apiCard[data-api-id="${apiId}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }

            alert("API deleted successfully!");
            showNotification("API has been deleted successfully", "delete");
            return true;
        } catch (error) {
            console.error("Error deleting API: ", error);
            alert("Failed to delete API.");
            return false;
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Initialize data fetching
    fetchData();
    fetchuserData();

    // Bar Chart: Top APIs by Usage
    const ctxTopApis = document.getElementById('topApisChart').getContext('2d');
    new Chart(ctxTopApis, {
        type: 'bar',
        data: {
            labels: ['OpenWeatherMap', 'NewsAPI'],
            datasets: [{
                label: 'Usage',
                data: [300, 194.44],
                backgroundColor: '#60a5fa',
                borderColor: '#60a5fa',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                    }
                },
                tooltip: {
                    titleColor: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff',
                    bodyColor: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff',
                    backgroundColor: document.body.classList.contains('light-theme') ? '#ffffff' : '#1e293b',
                    borderColor: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                    },
                    grid: {
                        color: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 300,
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff'
                    },
                    grid: {
                        color: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                    }
                }
            }
        }
    });

    // Donut Chart: User Activity
    const ctxUserActivity = document.getElementById('userActivityChart').getContext('2d');
    new Chart(ctxUserActivity, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Inactive'],
            datasets: [{
                label: 'User Activity',
                data: [70, 50],
                backgroundColor: ['#60a5fa', '#f87171'],
                borderColor: ['#60a5fa', '#f87171'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    titleColor: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff',
                    bodyColor: document.body.classList.contains('light-theme') ? '#000000' : '#ffffff',
                    backgroundColor: document.body.classList.contains('light-theme') ? '#ffffff' : '#1e293b',
                    borderColor: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                }
            }
        }
    });
});



function randomCall() {
    let randomApi = Math.floor(Math.random() * 100);
    document.getElementById("apiCall").innerHTML = `${randomApi}`


    let randomSecurity = Math.floor(Math.random() * 100);
    document.getElementById("apiSecurity").innerHTML = `${randomSecurity}`
}

randomCall()

// Notification System Functions
window.toggleNotifications = function() {
    const container = document.getElementById('notificationContainer');
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

// Function to update notification badge
function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const bellIcon = document.querySelector('.fa-bell');

    if (notifications.length > 0) {
        bellIcon.setAttribute('data-count', notifications.length);
        bellIcon.style.setProperty('--notification-display', 'block');
    } else {
        bellIcon.setAttribute('data-count', '0');
        bellIcon.style.setProperty('--notification-display', 'none');
    }
}

// Function to show notification
window.showNotification = function(message, type) {
    // Get existing notifications from localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    // Add new notification
    const notification = {
        id: Date.now(),
        message: message,
        type: type,
        timestamp: new Date().toLocaleString()
    };

    notifications.unshift(notification);

    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Update UI
    updateNotificationUI();

    // Update notification badge
    updateNotificationBadge();
}

// Function to update notification UI
function updateNotificationUI() {
    const notificationList = document.getElementById('notificationList');
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    notificationList.innerHTML = '';

    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.type}`;
        notificationElement.innerHTML = `
            <div class="notification-content">
                <p>${notification.message}</p>
                <small>${notification.timestamp}</small>
            </div>
            <button onclick="removeNotification(${notification.id})" title="Remove notification">×</button>
        `;
        notificationList.appendChild(notificationElement);
    });

    // Update badge after UI update
    updateNotificationBadge();
}

// Function to remove notification
window.removeNotification = function(id) {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications = notifications.filter(n => n.id !== id);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationUI();
    updateNotificationBadge();
}

// Function to clear all notifications
window.clearNotifications = function() {
    localStorage.removeItem('notifications');
    updateNotificationUI();
    updateNotificationBadge();
}

// Initialize notifications on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNotificationUI();
    updateNotificationBadge();
});

// Add notification triggers to existing functions
const originalAddData = window.addData;
window.addData = async function() {
    const result = await originalAddData.apply(this, arguments);
    if (result) {
        showNotification("New API has been added successfully", "add");
    }
    return result;
};

const originalDeleteAPI = window.deleteAPI;
window.deleteAPI = async function() {
    const result = await originalDeleteAPI.apply(this, arguments);
    if (result) {
        showNotification("API has been deleted successfully", "delete");
    }
    return result;
};

const originalDeleteUserFromFirestore = window.deleteUserFromFirestore;
window.deleteUserFromFirestore = async function() {
    const result = await originalDeleteUserFromFirestore.apply(this, arguments);
    if (result) {
        showNotification("User has been deleted successfully", "delete");
    }
    return result;
};

// Add notification for user management
window.addUser = async function() {
    // Your existing addUser code
    showNotification("New user has been added successfully", "add");
};

// Add notification for API updates
window.updateAPI = async function() {
    // Your existing updateAPI code
    showNotification("API has been updated successfully", "update");
};

// Add click outside handler
document.addEventListener('click', function(event) {
    const container = document.getElementById('notificationContainer');
    const bellIcon = document.querySelector('.fa-bell');

    // Check if click is outside notification container and bell icon
    if (container.style.display === 'block' &&
        !container.contains(event.target) &&
        !bellIcon.contains(event.target)) {
        container.style.display = 'none';
    }
});

// Theme toggle functionality
let isDarkMode = true; // Default to dark mode

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-theme');

    // Update theme icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (isDarkMode) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkMode = false;
        document.body.classList.add('light-theme');
    }

    // Add theme toggle button to navbar
    const navIcon = document.querySelector('.navIcon');
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.onclick = toggleTheme;
    navIcon.appendChild(themeToggle);

    // ... rest of your initialization code ...
});


window.userContainer = function userContainer() {

    document.getElementById("userDashInfo").style.display = "block"

    window.removeEventListener("click", hideDashUserInfo);

    // Add new click listener after a small delay
    setTimeout(() => {
        window.addEventListener("click", hideDashUserInfo);
    }, 0);

};



function hideDashUserInfo() {
    const userInfo = document.getElementById("userDashInfo");
    if (userInfo) {
        userInfo.style.display = "none";
        window.removeEventListener("click", hideUserInfo);
    }
}

function hideUserInfo() {
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.style.display = "none";
        window.removeEventListener("click", hideUserInfo);
    }
}



window.logoutUser = function logoutUser() {
    const auth = getAuth();
    signOut(auth)
        .then(() => {

            window.location.href = "index.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error signing out: ", error);
            alert("Failed to sign out!");
        });
};



onAuthStateChanged(auth, async(user) => {

    const email = user.email;

    document.getElementById("userEmail").innerHTML = `${email}`
    document.getElementById("userName").innerHTML = `Admin`


});


// home data 
async function fetchHomeData() {
    const apisCollection = collection(db, "apis");
    const querySnapshot = await getDocs(apisCollection);
    const container = document.getElementById("apiHomeCardContainer");
    const countDiv = document.getElementById("apiCountDiv");

    container.innerHTML = ""; // Clear the container

    // Show total count
    countDiv.innerText = ` ${querySnapshot.size}`;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const apiCard = document.createElement("div");
        apiCard.className = "apiCard";
        apiCard.setAttribute('data-api-id', doc.id);
        apiCard.innerHTML = `
            <div class="cardHeader">
                <h2>${data.name}</h2>
                <i class="fa fa-heart heart-icon" onclick="toggleFavorite('${doc.id}')" title="Add to Favorites"></i>
            </div>
            <p>${data.description}</p>
            <p><b>Languages: </b>${data.language.join(', ')}</p>
            <p><b>Security: </b>${data.security}</p>
            <p><b>License: </b>${data.license}</p>
            <div class="veiwBtn">
                <button onclick="viewDocumentationHome('${doc.id}')" class="edit-btn">View Doc</button>
                <button onclick="viewIntegrationHome('${doc.id}')" class="edit-btn integrate-btn">Integration</button>
            </div>
        `;
        container.appendChild(apiCard);

        // Update heart icon color based on favorite status
        updateHeartIcon(doc.id);
    });
}


window.viewDocumentationHome = async function(apiId) {
    try {
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const docData = data.documentation;

            // Show the popup
            const docPopup = document.getElementById("docPopup");
            docPopup.style.display = "flex";

            // Update popup content without edit buttons
            document.getElementById("addDoc").innerHTML = `
                <div class="addApiName">
                    <h1>${docData.title}</h1>
                    <i class="fa fa-xmark" onclick="closeDocPopup()"></i>
                </div>
                <div class="addApiInput">
                <h3>Description</h3>
                    <div class="content-block">
                        <div class="block-header">
                        </div>
                        <div class="content" id="description-content-${apiId}">${docData.description}</div>
                    </div>

                    <div class="section-header">
                        <span>Endpoints</span>
                    </div>
                    <div class="code-block">
                        <pre id="endpoints-content-${apiId}">${docData.endpoints}</pre>
                    </div>

                    <div class="section-header">
                        <span>Parameters</span>
                    </div>
                    <div class="code-block">
                        <pre id="parameters-content-${apiId}">${docData.parameters}</pre>
                    </div>

                    <div class="section-header">
                        <span>Examples</span>
                    </div>
                    <div class="code-block">
                        <pre id="examples-content-${apiId}">${docData.examples}</pre>
                    </div>
                </div>
            `;
        } else {
            alert("Documentation not found!");
        }
    } catch (error) {
        console.error("Error loading documentation: ", error);
        alert("Error loading documentation");
    }
};


window.viewIntegrationHome = async function(apiId) {
    try {
        const docRef = doc(db, "apis", apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const integrationData = data.integration;

            // Show the popup
            const integrationPopup = document.getElementById("integrationPopup");
            integrationPopup.style.display = "flex";

            // Update popup content with improved layout without update buttons
            document.getElementById("addIntegration").innerHTML = `
                <div class="addApiName">
                    <h1>${integrationData.title}</h1>
                    <i class="fa fa-xmark" onclick="closeIntegrationPopup()"></i>
                </div>
                <div class="addApiInput">
                <h3>Description</h3>
                    <div class="content-block">
                        <div class="block-header">
                        </div>
                        <div class="content" id="integration-description-content-${apiId}">${integrationData.description}</div>
                    </div>

                    <div class="section-header">
                        <span>Setup Steps</span>
                    </div>
                    <div class="code-block">
                        <pre id="integration-setup-content-${apiId}">${integrationData.setupSteps}</pre>
                    </div>

                    <div class="section-header">
                        <span>Code Examples</span>
                    </div>
                    <div class="code-block">
                        <pre id="integration-code-content-${apiId}">${integrationData.codeExamples}</pre>
                    </div>
                </div>
            `;
        } else {
            alert("Integration data not found!");
        }
    } catch (error) {
        console.error("Error loading integration: ", error);
        alert("Error loading integration data");
    }
};

fetchHomeData()


// Assuming you have Firebase initialized

// Function to get the current user's data from Firestore
// Function to get the current user's data from Firestore
// Show user info when icon is clicked
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to user icon
    const userIcon = document.querySelector('.usersIcon');
    if (userIcon) {
        userIcon.addEventListener('click', async function(event) {
            event.stopPropagation();
            await userhomeContainer(); // Load and show user info
        });
    }

    // Add click outside handler
    document.addEventListener('click', function(event) {
        const userInfo = document.getElementById('userInfo');
        const userIcon = document.querySelector('.usersIcon');

        if (userInfo && userIcon &&
            !userInfo.contains(event.target) &&
            !userIcon.contains(event.target)) {
            userInfo.style.display = 'none';
        }
    });
});

// Function to fetch and show user info
window.userhomeContainer = async function() {
    const userInfoDiv = document.getElementById("userInfo");
    const userNameEl = document.getElementById("userName");
    const userEmailEl = document.getElementById("userEmail");

    if (!userInfoDiv || !userNameEl || !userEmailEl) {
        console.error("User info elements not found");
        return;
    }

    const user = auth.currentUser;

    if (user) {
        try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                userNameEl.innerHTML = userData.userName || "No name found";
                userEmailEl.textContent = user.email;
                userInfoDiv.style.display = "block";
            } else {
                console.log("User not found in Firestore.");
                userNameEl.innerHTML = "Admin";
                userEmailEl.textContent = user.email;
                userInfoDiv.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            userNameEl.innerHTML = "Admin";
            userEmailEl.textContent = user.email;
            userInfoDiv.style.display = "block";
        }
    } else {
        console.log("No user is logged in.");
    }
};

// Logout function
window.homelogoutUser = function() {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        window.location.href = "/login";
    }).catch((error) => {
        console.error("Logout error:", error);
        alert("Logout failed");
    });
};

// Initialize favorite count from local storage
let favoriteCount = 0;
let favoriteAPIs = JSON.parse(localStorage.getItem('favoriteAPIs')) || [];

// Update favorite count in navbar
function updateFavoriteCount() {
    favoriteCount = favoriteAPIs.length;
    const heartIcon = document.querySelector('.fa-heart');
    if (heartIcon) {
        heartIcon.setAttribute('data-count', favoriteCount);
    }
}

// Toggle favorite status
window.toggleFavorite = function toggleFavorite(apiId) {
    const index = favoriteAPIs.indexOf(apiId);
    if (index === -1) {
        favoriteAPIs.push(apiId);
    } else {
        favoriteAPIs.splice(index, 1);
    }
    localStorage.setItem('favoriteAPIs', JSON.stringify(favoriteAPIs));
    updateFavoriteCount();
    updateHeartIcon(apiId);
}

// Update heart icon color
function updateHeartIcon(apiId) {
    const heartIcon = document.querySelector(`[data-api-id="${apiId}"] .fa-heart`);
    if (heartIcon) {
        if (favoriteAPIs.includes(apiId)) {
            heartIcon.style.color = 'red';
        } else {
            heartIcon.style.color = 'inherit';
        }
    }
}

// Show favorite APIs popup
function showFavoriteAPIs() {
    const popup = document.createElement('div');
    popup.className = 'favorite-popup';
    popup.innerHTML = `
        <div class="favorite-popup-content">
            <div class="favorite-popup-header">
                <h2>Favorite APIs</h2>
                <i class="fa fa-times" onclick="this.parentElement.parentElement.parentElement.remove()"></i>
            </div>
            <div class="favorite-popup-body">
                ${favoriteAPIs.map(apiId => {
                    const apiCard = document.querySelector(`[data-api-id="${apiId}"]`);
                    if (apiCard) {
                        // Clone the card and modify it for the popup
                        const cardClone = apiCard.cloneNode(true);
                        const heartIcon = cardClone.querySelector('.fa-heart');
                        if (heartIcon) {
                            heartIcon.style.color = 'red';
                            heartIcon.onclick = (e) => {
                                e.stopPropagation();
                                toggleFavorite(apiId);
                                popup.remove();
                                showFavoriteAPIs();
                            };
                        }
                        return cardClone.outerHTML;
                    }
                    return '';
                }).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

// Get API by ID
function getApiById(apiId) {
    const apiCard = document.querySelector(`[data-api-id="${apiId}"]`);
    if (apiCard) {
        return {
            name: apiCard.querySelector('h2').textContent,
            description: apiCard.querySelector('p').textContent
        };
    }
    return { name: apiId, description: '' };
}

// Add click event to heart icon in navbar
document.addEventListener('DOMContentLoaded', () => {
    const heartIcon = document.querySelector('.fa-heart');
    if (heartIcon) {
        heartIcon.addEventListener('click', showFavoriteAPIs);
        updateFavoriteCount();
    }
});

// Initialize favorite count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateFavoriteCount();
    // Update heart icons for all API cards
    favoriteAPIs.forEach(apiId => updateHeartIcon(apiId));
});

// Initialize favorite count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateFavoriteCount();
    // Update heart icons for all API cards
    favoriteAPIs.forEach(apiId => updateHeartIcon(apiId));
});


 
// ✅ Your API Data Object
// const apiData = {
//   name: "OpenWeatherMap API",
//   description: "Provides current weather data for any location, including over 200,000 cities worldwide.",
//   language: ["JavaScript", "Python", "PHP"],
//   category: "Weather",
//   security: "API Key",
//   license: "Freemium (Free tier available)",
//   createdAt: new Date(),

//   documentation: {
//     title: "OpenWeatherMap API Documentation",
//     description: "Get real-time weather conditions including temperature, humidity, and description for a specified city.",
//     endpoints: [
//       {
//         url: "https://api.openweathermap.org/data/2.5/weather",
//         method: "GET",
//         description: "Returns current weather data for a given city."
//       }
//     ],
//     parameters: [
//       { name: "q", type: "string", required: true, description: "City name (e.g. 'London')" },
//       { name: "appid", type: "string", required: true, description: "Your API key" },
//       { name: "units", type: "string", required: false, description: "Units of measurement: standard, metric, or imperial" }
//     ],
//     examples: [
//       {
//         request: "GET https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=YOUR_API_KEY&units=metric",
//         response: {
//           name: "Karachi",
//           main: { temp: 32.5, humidity: 68 },
//           weather: [{ main: "Clear", description: "clear sky" }]
//         }
//       }
//     ],
//     createdAt: new Date()
//   },

//   integration: {
//     title: "How to Use OpenWeatherMap in JavaScript",
//     description: "A simple example to fetch weather data for a city using JavaScript.",
//     setupSteps: [
//       "1. Go to openweathermap.org and sign up for an account.",
//       "2. Generate your free API key from the dashboard.",
//       "3. Use the fetch code below to call the API."
//     ],
//     codeExamples: [
// `async function getWeather(city) {
//     const apiKey = "YOUR_API_KEY";
//     const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}&units=metric\`;

//     try {
//         const res = await fetch(url);
//         const data = await res.json();
//         console.log("Weather data:", data);

//         document.getElementById("weatherInfo").innerHTML =
//             \`City: \${data.name} | Temp: \${data.main.temp}°C | \${data.weather[0].description}\`;
//     } catch (error) {
//         console.error("Failed to fetch weather data", error);
//     }
// }`
//     ],
//     createdAt: new Date()
//   }
// };

// ✅ Save to Firestore
async function saveAPIDataToFirestore() {
  try {
    const docRef = await addDoc(collection(db, "apis"), apiData);
    console.log("API data added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

// 📞 Call the function
saveAPIDataToFirestore();

// Search functionality for API cards
window.searchAPIs = function(searchTerm) {
    const apiCards = document.querySelectorAll('.api-card');
    searchTerm = searchTerm.toLowerCase();
    
    apiCards.forEach(card => {
        const apiName = card.querySelector('.api-name').textContent.toLowerCase();
        if (apiName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// Add event listeners for search input in both home.html and dashboard.html
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchingApi');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchAPIs(e.target.value);
        });
    }
});

// Search functionality for navigation bar input
window.searchAPIs = function(searchTerm) {
    const apiCards = document.querySelectorAll('.apiCard');
    searchTerm = searchTerm.toLowerCase();
    let foundAny = false;
    
    apiCards.forEach(card => {
        const apiName = card.querySelector('h2').textContent.toLowerCase();
        if (apiName.includes(searchTerm)) {
            card.style.display = 'block';
            foundAny = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Show "API not found" message if no results
    const container = document.getElementById('apiCardContainer') || document.getElementById('apiHomeCardContainer');
    let notFoundMessage = container.querySelector('.api-not-found');
    
    if (!foundAny && searchTerm !== '') {
        if (!notFoundMessage) {
            notFoundMessage = document.createElement('div');
            notFoundMessage.className = 'api-not-found';
            notFoundMessage.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 10px;"></i>
                    <h3>No APIs Found</h3>
                    <p>No APIs match your search term "${searchTerm}"</p>
                </div>
            `;
            container.appendChild(notFoundMessage);
        }
    } else if (notFoundMessage) {
        notFoundMessage.remove();
    }
};

// Add event listener for search input in navigation bar
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchingApi');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchAPIs(e.target.value);
        });
    }
});
