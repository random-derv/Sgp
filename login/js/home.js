// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpMLHUaA5YKWJ_11Xiv4te7X0GJU2GtIg",
    authDomain: "college-cbdd7.firebaseapp.com",
    databaseURL: "https://college-cbdd7-default-rtdb.firebaseio.com",
    projectId: "college-cbdd7",
    storageBucket: "college-cbdd7.appspot.com",
    messagingSenderId: "1041661998794",
    appId: "1:1041661998794:web:693fe41ff24d2f95186633",
    measurementId: "G-196WCPG8E4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Function to show loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Function to hide loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Function to fetch and display user information
function fetchAndDisplayUserInfo() {
    showLoader();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('User is signed in. UID:', user.uid);
            const userId = user.uid;
            const userRef = database.ref('users').child(userId);

            userRef.once('value', function (snapshot) {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log('User data retrieved:', userData);

                    displayUserInfo(userData);
                } else {
                    console.error('User data not found');
                }
                hideLoader();
            });
        } else {
            console.log('User is not signed in');
            window.location.href = 'index.html';
        }
    });
}

// Function to display user information
function displayUserInfo(userData) {
    console.log('Displaying user information:', userData);
    const userInfoContainer = document.getElementById('user-info-container');
    const userInfoElement = document.createElement('div');
    userInfoElement.classList.add('user-info');
    userInfoElement.innerHTML = `<strong>Welcome back,</strong> ${userData.username}!`;
    userInfoContainer.innerHTML = '';
    userInfoContainer.appendChild(userInfoElement);
}

// Function to fetch and display uploaded files
function fetchAndDisplayUploadedFiles() {
    showLoader();
    const fileListContainer = document.getElementById('file-list-container');
    fileListContainer.innerHTML = '';

    database.ref('files').on('child_added', snapshot => {
        const fileData = snapshot.val();
        const fileId = snapshot.key;
        const fileItem = createFileListItem(fileId, fileData.fileName, fileData.fileUrl);
        fileListContainer.appendChild(fileItem);
        hideLoader();
    });

    database.ref('files').on('child_removed', snapshot => {
        const fileId = snapshot.key;
        const fileElement = document.getElementById(fileId);
        if (fileElement) {
            fileElement.remove();
        }
    });
}

// Function to create HTML element for file list item
function createFileListItem(fileId, fileName, fileUrl) {
    const listItem = document.createElement('div');
    listItem.className = 'file-item';
    listItem.id = fileId;
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);

    if (isImage) {
        listItem.innerHTML = `
            <a href="${fileUrl}" target="_blank">
                <img src="${fileUrl}" alt="${fileName}" style="width: 300px; height: 300px; object-fit: cover;">
            </a>
        `;
    } else if (isPdf) {
        listItem.innerHTML = `
            <a href="${fileUrl}" target="_blank">
                <div style="width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; border: 1px solid #000;">
                    <embed src="${fileUrl}" type="application/pdf" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <p><strong>${fileName}</strong></p>
            </a>
        `;
    } else {
        listItem.innerHTML = `<p><a href="${fileUrl}" target="_blank">Open</a></p>`;
    }

    return listItem;
}

fetchAndDisplayUploadedFiles();

document.getElementById('logoutBtn').addEventListener('click', function () {
    firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';
    }).catch(function (error) {
        console.error('Error signing out:', error);
    });
});

fetchAndDisplayUserInfo();

function displayPrincipalInfo() {
    showLoader();
    const dialogContent = `
        <div id="principalDialog" class="dialog">
            <div style="position: absolute; top: 10px; right: 10px;">
                <button id="closeDialogBtn">Close</button>
            </div>
            <img src="images/principal.png" alt="Principal Image" style="max-width: 100%; height: auto;">
            <p>Siliguri Government Polytechnic is located exclusively in urban locality. Siliguri being the very next to Kolkata in status, has all the ingredients of a cosmopolitan nature. Geographically, it is fantastically located to serve too many other adjoining areas including hills. With increasing aspirations of hill-people, Siliguri Government Polytechnic need to serve for increasing variety of courses as well as for additional intake. Accordingly, being in Siliguri shall mean to be more efficient and dedicated in terms of providing service to students. We are prepare to take up the challenge of the future and do the needful. Let us all make Siliguri Government Polytechnic, a regional center of all polytechnics, serving to the need of the students and also of the society at large.</p>
            <p>Thanks<br>Principal<br>Siliguri Government Polytechnic</p>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = dialogContent;
    document.body.appendChild(overlay);

    function closeDialog() {
        overlay.remove();
        hideLoader();
    }

    const closeBtn = overlay.querySelector('#closeDialogBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDialog);
    }

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeDialog();
        }
    });

    const dialog = overlay.querySelector('.dialog');
    if (dialog) {
        dialog.style.overflowY = 'auto';
        dialog.style.maxHeight = '80vh';
    }

    hideLoader();
}

document.getElementById('principal').addEventListener('click', function (event) {
    event.preventDefault();
    displayPrincipalInfo();
});

function displayHodDetailsDialog() {
    showLoader();
    database.ref('users/HODs').once('value', snapshot => {
        const hodDetails = snapshot.val();
        let dialogContent = '<div class="dialog">';
        dialogContent += '<h2>HOD Details</h2>';


        for (let hodId in hodDetails) {
            if (hodDetails.hasOwnProperty(hodId)) {
                const hod = hodDetails[hodId];
                dialogContent += '<div>';
                dialogContent += '<h4>Name: ' + hod.name + '</h4>';
                dialogContent += '<p>Department: ' + hod.department + '</p>';
                dialogContent += '<p>Phone Number: ' + hod.phoneNumber + '</p>';
                dialogContent += '</div>';
            }
        }

        dialogContent += '<button id="closeHodDialog">Close</button></div>';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = dialogContent;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#closeHodDialog');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        hideLoader();
    });
}

document.getElementById('hods').addEventListener('click', function (event) {
    event.preventDefault();
    displayHodDetailsDialog();
});
