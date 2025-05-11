# Chat Interface with AI Integration

Live URL : https://kart-rag-chat-bot.netlify.app


<img width="673" alt="Screenshot 2025-05-11 at 12 25 33 PM" src="https://github.com/user-attachments/assets/0fecaa70-7df2-4b02-af46-675f39e78270" />


A simple, responsive React application that provides users with an AI-powered chat experience. This application manages user sessions, stores chat history, and communicates with an AI backend.

### Features

- **Session Management**: Automatically creates and manages user sessions, storing session IDs in localStorage for a persistent experience
- **Message History**: Retrieves previous conversations when users return to the application
- **AI Integration**: Sends user queries to an AI backend and displays responses in real-time
- **Session Control**: Allows users to clear current data and start fresh sessions

### Technologies Used

- **React**: Frontend UI component library
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework for styling

### Component Architecture

#### ChatInterface

The main component that handles the chat functionality:

##### State Management
- `sessionId`: Tracks the unique identifier for the current session
- `messages`: Stores the chat history for display
- `input`: Manages the user's current input text

##### Refs
- `chatEndRef`: Reference to automatically scroll to the most recent message

##### Key Functions
- `initSession()`: Creates a new session via the backend API
- `fetchHistory()`: Retrieves message history for the current session
- `handleSend()`: Processes user input, sends to backend, and updates chat with AI response
- `clearSession()`: Removes session data from localStorage and resets state
- `startNewSession()`: Resets the current session and initiates a new one

### API Integration

The application communicates with these backend endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/session` | POST | Create a new user session |
| `/history` | GET | Retrieve message history for current session |
| `/query` | POST | Send user queries to AI and get responses |
| `/session` | DELETE | Remove session data and history |

### User Flow

1. **Initial Load**:
   - App checks for existing session ID in localStorage
   - If found, loads chat history from backend
   - If not found, creates a new session

2. **Sending Messages**:
   - User types a message and submits
   - Message is sent to backend AI service
   - Response is received and displayed in the chat interface
   - View automatically scrolls to the latest message

3. **Session Management**:
   - User can start a new session at any time
   - Previous session data is cleared when starting new session
