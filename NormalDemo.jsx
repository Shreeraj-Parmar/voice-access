import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]); // To store todo items
  const [transcriptText, setTranscriptText] = useState(""); // Initialize as empty string
  const [isListening, setIsListening] = useState(false); // To track listening state
  const [recognition] = useState(
    () => new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  );
  let silenceTimer = null; // Timer to track silence

  useEffect(() => {
    // Cleanup timers and recognition when component unmounts
    return () => {
      stopListening(); // Ensure recognition is stopped
      clearTimeout(silenceTimer);
    };
  }, []);

  // Function to start voice recognition
  const startListening = () => {
    setIsListening(true);
    setTranscriptText(""); // Clear previous transcript
    recognition.start();

    // Clear any existing timers
    clearTimeout(silenceTimer);

    // When speech is detected
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Capture spoken words
      setTranscriptText(transcript);
      console.log("User said:", transcript);

      // Clear silence timer if the user speaks
      clearTimeout(silenceTimer);

      // Auto-stop after 5 seconds of silence after user stops speaking
      silenceTimer = setTimeout(() => {
        stopListening();
        if (transcript) {
          addTodo(transcript); // Add todo when stopping
          speak("Thank you for adding the to-do."); // Speech response
        }
      }, 5000); // 5 seconds silence timeout
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopListening(); // Stop listening if there's an error
    };

    // Stop listening after a period of no speech
    recognition.onspeechend = () => {
      clearTimeout(silenceTimer); // Reset silence timer if user spoke
      silenceTimer = setTimeout(() => {
        stopListening();
        if (transcriptText) {
          addTodo(transcriptText);
          speak("Thank you for adding the to-do.");
        }
      }, 5000); // 5 seconds silence timeout
    };

    // Start auto-stop if no voice input after 10 seconds of no speech
    silenceTimer = setTimeout(() => {
      stopListening();
      setTranscriptText(""); // Clear transcript on timeout
    }, 10000); // 10 seconds timeout if no input at all
  };

  // Function to stop voice recognition
  const stopListening = () => {
    setIsListening(false);
    if (isListening) {
      recognition.stop();
      clearTimeout(silenceTimer); // Clear the silence timer
      console.log("Stopped listening due to silence.");
      setTranscriptText(""); // Clear transcript on stop
    }
  };

  // Function to add todo to the list
  const addTodo = (todo) => {
    if (todo) {
      // Ensure todo is not empty
      setTodos((prevTodos) => [...prevTodos, todo]);
    }
  };

  // Function to provide speech response
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

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
}

export default App;
