    document.addEventListener('DOMContentLoaded', function () {
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

        document.getElementById('signup-form').addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const year = document.getElementById('year').value;
            const department = document.getElementById('department').value;
            const password = document.getElementById('password').value;

            // Hash the password using CryptoJS
            const hashedPassword = CryptoJS.SHA256(password).toString();

            // Check if the username already exists
            database.ref('users/students').orderByChild('username').equalTo(username).once('value', snapshot => {
                if (snapshot.exists()) {
                    alert('Username already exists');
                } else {
                    // Register the user in Firebase Authentication
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Save additional user info in Firebase Realtime Database
                            const userId = userCredential.user.uid;
                            const initialCredits = 0;

                            // Set user data under users > students > UID in Firebase Realtime Database
                            database.ref(`users/students/${year}/${department}/${userId}`).set({
                                email: email,
                                username: username,
                                phoneNumber: phoneNumber,
                                year: year,
                                department: department,
                                hashedPassword: hashedPassword,
                                credits: initialCredits
                            }).then(() => {
                                // Redirect to home.html after successful signup
                                window.location.href = 'home.html';
                            }).catch((error) => {
                                console.error('Error saving user data', error);
                                alert('Error: ' + error.message);
                            });
                        })
                        .catch((error) => {
                            console.error('Error signing up', error);
                            alert('Error: ' + error.message);
                        });
                }
            });
        });
    });
