# Instant Group

!Visit the site

This is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js), along with WebSocket, WebRTC, and React Styled Components.

## Features

| Feature | Description |
|---------|-------------|
| Real-time chat | Users can send and receive messages in real time |
| Video call | Users can make video calls using WebRTC |
| Stylish UI | The application uses React Styled Components for a modern and responsive user interface |
| Room creation and joining | Users can create a new room or join an existing one. If the room doesn't exist, it will be created. If it does, the user will join if the admin allows |
| Admin control | The admin, who is the creator of the room, can allow or deny users to join the room. If the admin leaves, a random user becomes the new admin |
| Member list | Users can view the list of members in the room |
| Invitation link | Users can generate an invitation link to invite others to join the room |
| Video call waiting room | Users can go to a waiting room before starting a video call |
| Error notifications | A custom box will notify users about any errors or mistakes while using the app |

## Running Locally

The application consists of two parts: the frontend and the backend. They need to be started separately.

### Running the Frontend

1. Navigate to the client directory: `cd client`
2. Install the dependencies: `npm install`
3. Start the frontend: `npm run dev`

The frontend will be hosted at `http://localhost:5173`.

### Running the Backend

1. Navigate to the server directory: `cd server`
2. Install the dependencies: `npm install`
3. Start the backend: `npm start`

The backend will be running at `http://localhost:5173`.

## How to Use

### Using the Room Feature

1. Go to the application link.
2. Click on the 'Welcome' button.
3. You will be redirected to the landing page with two inputs and two buttons.
4. Input your name and the room ID.
5. Click on either 'Create' or 'Join' button.
    - If you click 'Create' and no room exists with the same ID, a new room will be created.
    - If you click 'Join' and a room exists with the same ID, you will join the room if the admin allows you in.
6. The admin is the person who created the room. If the admin leaves, a random person will become the new admin.
7. Once you enter the chat room:
    - Click on the burger menu icon on the top left to see the members.
    - Next to it, you will see the room ID.
    - Next to the room ID, there is a button to copy the invitation link which can be shared with others to join the room.
    - On the right corner, there are two icons:
        - The 'Call' icon takes you to the waiting room from which you can go to the video call.
        - The 'Quit' button in red color allows you to leave the room.
8. In the chat room, you can chat using the input button at the bottom.
9. In the video call room, you can talk with others.

Enjoy chatting and video calling!
