# Voice-Controlled App with Annyang

This guide will walk you through setting up voice commands in your app using Annyang, a JavaScript library for adding voice recognition to your website.

## 1. Install and Set Up Annyang

You can include Annyang either via CDN or by installing it as an npm package.

### CDN Method:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js"></script>
```

### npm Method:

If you're using React or a bundler like Webpack, install Annyang via npm:
```
npm install annyang
```
## 2. Check if Annyang is Supported

Before proceeding with custom voice commands, check if the user's browser supports Annyang (and by extension, Speech Recognition).
```
if (annyang) {
  console.log("Speech Recognition is supported!");
} else {
  console.log("Speech Recognition is not supported in this browser.");
}
```
## 3. Define Custom Commands

You can define custom voice commands by creating an object where keys are the spoken phrases and values are the corresponding functions to run.

Here's an example:
```
if (annyang) {
  const commands = {
    'hello': () => { console.log('Hello there!'); },
    'add :item to list': (item) => { addToList(item); },
    'change color to :color': (color) => { changeBackgroundColor(color); }
  };

  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}
```
- "hello": When the user says "hello," it logs "Hello there!" to the console.
- "add :item to list": Here `:item` is a dynamic variable. If the user says "add apple to list," it will pass apple to the addToList function.
- "change color to :color": This command listens for a color, like "change color to red," and changes the background color of the page.

## 4. Start and Stop Listening

You can control when Annyang listens and stops listening with the following commands:
```
// To start listening
annyang.start();

// To stop listening
annyang.abort();
```
You can use the start and stop functions based on your requirements, such as clicking a button.

## 5. Example Usage with a Simple Command

Let’s create a small app where you can use voice commands to control a to-do list.

### HTML:
```
<div>
  <button onclick="startListening()">Start Voice Commands</button>
  <button onclick="stopListening()">Stop Voice Commands</button>

  <h2>Your To-Do List:</h2>
  <ul id="todo-list"></ul>
</div>
```
### JavaScript:
```
// Ensure Annyang is available
if (annyang) {
  // Define your custom commands
  const commands = {
    'add :item': (item) => {
      addToList(item);
      console.log(`Added ${item} to your to-do list`);
    },
    'clear list': () => {
      clearList();
      console.log('Cleared your to-do list');
    }
  };

  // Add the commands to Annyang
  annyang.addCommands(commands);

  // Function to add items to the to-do list
  function addToList(item) {
    const todoList = document.getElementById('todo-list');
    const listItem = document.createElement('li');
    listItem.textContent = item;
    todoList.appendChild(listItem);
  }

  // Function to clear the to-do list
  function clearList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
  }

  // Function to start listening
  function startListening() {
    annyang.start();
    console.log('Started listening for commands');
  }

  // Function to stop listening
  function stopListening() {
    annyang.abort();
    console.log('Stopped listening');
  }
}
```
## 6. Handle Errors and Debugging

You can also add debugging or error handling with Annyang to understand what's happening when speech recognition fails.
```
annyang.addCallback('error', (err) => {
  console.error('Error occurred:', err);
});

annyang.addCallback('soundstart', () => {
  console.log('Sound detected');
});

annyang.addCallback('end', () => {
  console.log('Speech recognition ended');
});
```

# File code Documentation

## Overview

This React component demonstrates how to integrate voice commands using the Annyang library.

## Dependencies

- `annyang`: A JavaScript library for voice recognition.

## State Variables

- `output`: Stores the message displayed based on voice commands.
- `bgcolor`: Manages the background color of the application.

## Commands

- **hello**: Logs "hii" and sets `output` to "hii".
- **add todo**: Logs "todo added" and sets `output` to "todo added".
- **add :item to list**: Logs the item and sets `output` to `<item> added`.
- **change color to :color**: Changes the background color to the specified color and sets `output` to the color name.

## UseEffect Hook

- **Setup**: Adds voice commands using `annyang.addCommands(commands)` and starts listening for commands.
- **Cleanup**: Aborts listening when the component unmounts to prevent memory leaks.

## Rendered Output

- Displays the current `output` message.
- Provides buttons to start and stop voice recognition.

## Usage

1. Click the "start" button to begin listening for voice commands.
2. Click the "stop" button to cease listening.
