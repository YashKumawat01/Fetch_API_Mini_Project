document.getElementById('getText').addEventListener('click', getText);
document.getElementById('getUsers').addEventListener('click', getUsers);
document.getElementById('getPosts').addEventListener('click', getPosts);
document.getElementById('addUser').addEventListener('submit', addUser);
document.getElementById('addPost').addEventListener('submit', addPost);

let localUsers = []; // Stores newly added users
let fetchedUsers = []; // Stores API-fetched users

// Show Output and Make It Visible
function showOutput(content) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = content;
    outputDiv.style.display = 'block'; // Make it visible
}

// Get Text from Local File
function getText() {
    fetch('sample.txt')
        .then(res => res.text())
        .then(data => showOutput(`<pre>${data}</pre>`))
        .catch(error => console.log(error));
}

// Get Users from JSON + Show Added Users
function getUsers() {
    fetch('users.json')
        .then(res => res.json())
        .then(data => {
            fetchedUsers = data; // Store fetched users
            let users = [...fetchedUsers, ...localUsers]; // Merge both lists
            let output = '<h2>Users</h2>';
            users.forEach(user => {
                output += `
                <div class="post-card">
                    <strong>ID:</strong> ${user.id} <br>
                    <strong>Name:</strong> ${user.name} <br>
                    <strong>Email:</strong> ${user.email}
                </div>`;
            });
            showOutput(output);
        })
        .catch(error => console.error("Error fetching users:", error));
}

// Get Posts from API
function getPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=100') // Ensure 100 posts
        .then(res => res.json())
        .then(data => {
            let output = '<h2>Posts</h2>';
            data.forEach(post => {
                output += `
                <div class="post-card">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>`;
            });
            showOutput(output);
        })
        .catch(error => console.error("Error fetching posts:", error));
}

// Add New User
function addUser(e) {
    e.preventDefault();

    let name = document.getElementById('userName').value.trim();
    let email = document.getElementById('userEmail').value.trim();

    if (!name || !email) {
        alert("Both Name and Email fields must be filled out!");
        return;
    }

    // Find the last user ID dynamically
    let allUsers = [...fetchedUsers, ...localUsers];
    let lastUserId = allUsers.length > 0 ? Math.max(...allUsers.map(user => user.id)) : 0;

    let newUser = {
        id: lastUserId + 1, // Assign next ID
        name: name,
        email: email
    };

    localUsers.push(newUser); // Store new user in local array
    getUsers(); // Refresh user list
    document.getElementById('addUser').reset(); // Clear form fields
}

// Add New Post
function addPost(e) {
    e.preventDefault();

    let title = document.getElementById('title').value.trim();
    let body = document.getElementById('body').value.trim();

    if (!title || !body) {
        alert("Both Title and Post fields must be filled out!");
        return;
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ title: title, body: body })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("Post added successfully!");
        });

    document.getElementById('addPost').reset(); // Clear form fields
}
