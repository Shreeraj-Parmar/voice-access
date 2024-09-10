# Voice-Controlled To-Do List

This application allows users to add tasks to a to-do list by speaking, utilizing the **Web Speech API** for speech recognition and speech synthesis. Below is a breakdown of the code:

## 1. `useState` and `useEffect` Hooks

### `useState`
The `useState` hook is used to create state variables for storing values. In this app, it manages:

- **todos**: Stores the list of to-do items.
- **transcriptText**: Holds the spoken words (recognized transcript).
- **isListening**: Tracks whether speech recognition is actively listening or not.

```javascript
const [todos, setTodos] = useState([]); // To store todo items
const [transcriptText, setTranscriptText] = useState(""); // Stores recognized speech
const [isListening, setIsListening] = useState(false); // Tracks listening status
```

### `useEffect`
The `useEffect` hook is used to clean up resources when the component unmounts. It ensures that any ongoing speech recognition and timers are properly cleared to avoid memory leaks or unwanted behavior after the component is removed.

```javascript
useEffect(() => {
  return () => {
    stopListening(); // Stop listening when the component unmounts
    clearTimeout(silenceTimer); // Clear any existing timers
  };
}, []);
```
## 2. Speech Recognition Setup
We initialize the speech recognition system using `window.SpeechRecognition` or `window.webkitSpeechRecognition`. This works across browsers that support the **Web Speech API**.

```javascript
const [recognition] = useState(
  () => new (window.SpeechRecognition || window.webkitSpeechRecognition)()
);

```
## 3. Starting the Listening Process

### `startListening` Function
This function is triggered when the user clicks the "Start Listening" button. It:

- Starts speech recognition.
- Clears any previously set timers.
- Defines how to handle speech results and any potential errors.

```javascript
const startListening = () => {
  setIsListening(true); // Set listening state to true
  setTranscriptText(""); // Reset previous transcript
  recognition.start(); // Start speech recognition
  clearTimeout(silenceTimer); // Clear any existing timers
};
```
## 4. Handling Speech Results

When speech is detected, the `onresult` event is triggered:

- The speech is captured from the `event.results` array and stored in `transcriptText`.
- The app will add the spoken text as a to-do item after 5 seconds of silence.
- If the user stops speaking, the app automatically stops listening and responds with a speech synthesis message, thanking the user.

```javascript
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript; // Captures spoken words
  setTranscriptText(transcript);
  console.log("User said:", transcript);

  clearTimeout(silenceTimer); // Reset the silence timer
  silenceTimer = setTimeout(() => {
    stopListening();
    if (transcript) {
      addTodo(transcript); // Add the spoken todo item
      speak("Thank you for adding the to-do."); // Voice response
    }
  }, 5000); // Stop after 5 seconds of silence
};
```
## 5. Handling Errors

If an error occurs during the recognition process (e.g., no microphone access or the browser does not support the Web Speech API), the `onerror` handler logs the error and stops the recognition.

```javascript
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  stopListening();
};
```
## 6. Stopping Listening After Silence

If the user stops speaking, the `onspeechend` event is triggered:

- A timer is set to stop listening after 5 seconds of silence.
- The to-do item will only be added if there’s a valid transcript.

```javascript
recognition.onspeechend = () => {
  clearTimeout(silenceTimer); // Reset silence timer if speech ends
  silenceTimer = setTimeout(() => {
    stopListening();
    if (transcriptText) {
      addTodo(transcriptText); // Add todo item if there’s a transcript
      speak("Thank you for adding the to-do."); // Provide feedback
    }
  }, 5000); // Stop after 5 seconds of silence
};
```
## 7. Stopping the Recognition Process

### `stopListening` Function

This function stops the speech recognition process:

- It resets the `isListening` state to `false`, signaling that the app is no longer listening.
- It clears the transcript and any timers related to silence detection.

```javascript
const stopListening = () => {
  setIsListening(false); // Stop listening
  if (isListening) {
    recognition.stop(); // Stop speech recognition
    clearTimeout(silenceTimer); // Clear any active timers
    setTranscriptText(""); // Clear the transcript
  }
};
```
## 8. Adding To-Do Items

### `addTodo` Function

The `addTodo` function appends a new item to the existing list of todos. It ensures that the todo is not an empty string.

```javascript
const addTodo = (todo) => {
  if (todo) { // Ensure the todo item is not empty
    setTodos((prevTodos) => [...prevTodos, todo]); // Append to the todo list
  }
};
```
## 9. Speech Synthesis for Response

### `speak` Function

This function uses the Web Speech API’s `SpeechSynthesisUtterance` to create a spoken response. It is called when a new to-do is added to inform the user.

```javascript
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance); // Read out the given text
};
```
## 10. Rendering the To-Do List and UI

### `return` Block

The app renders the following elements:

- A button that triggers the `startListening` function to begin voice recognition.
- A list of to-do items that are added via speech.

```javascript
return (
  <div>
    <h1>Voice-Controlled To-Do App</h1>

    {/* Button to start listening */}
    <button onClick={startListening} disabled={isListening}>
      Start Listening
    </button>

    <h2>Your To-Dos:</h2>
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  </div>
);
```
## Conclusion

This app leverages the Web Speech API to listen for spoken commands and add those commands to a to-do list. The speech recognition stops after 5 seconds of silence, and the app provides a spoken confirmation that the to-do has been added.

### Further Improvements

- **Continuous Listening**: The app could be modified to continuously listen for commands.
- **Enhanced Error Handling**: More detailed error messages and handling could improve the user experience.
- **Voice Control for Other Actions**: Commands like deleting or updating to-do items could also be voice-controlled.

### Question

What other features do you think could be added to improve the user experience with voice control in this app?






