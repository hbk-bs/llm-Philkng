const data = [];
let poly;

function preload() {
  if (window.llm) {
    console.log("LLM class loaded");
  } else {
    console.log("LLM class not loaded");
  }
}

function setup() {
  noCanvas(); 
  poly = new p5.PolySynth();
  const runButton = document.getElementById('run');
  runButton.addEventListener('click', generateAndPlaySound);
}

function draw() {}

function generateAndPlaySound() {
  userStartAudio();
  
  const userInput = document.getElementById('user-input').value;

  console.log("Button was pressed");

  llm.chat({
    format: 'json',
    options: {
      seed: 42,
      temperature: 1
    },
    messages: [
      {
        role: 'You are a music and tone generator',
        content: `Generate JSON for us in this structure with random values and play those notes:
        {"note": [
          {note: 'C4', frequency: 261.63},
          {note: 'D4', frequency: 293.66},
          {note: 'E4', frequency: 329.63},
          {note: 'F4', frequency: 349.23},
          {note: 'G4', frequency: 392.00},
          {note: 'A4', frequency: 440.00},
          {note: 'B4', frequency: 493.88}
        ]}
        `,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
  })
  .then((response) => {
    console.log(response);
    const json = JSON.parse(response.completion.choices[0].message.content);
    const { notes } = json;
    console.log(notes, json);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; 
    notes.forEach(note => {
      const noteInfo = document.createElement('div');
      noteInfo.textContent = `Note: ${note.note}, Frequency: ${note.frequency}`;
      outputDiv.appendChild(noteInfo);
    });
    
    playNotesSequentially(notes);
  })
  .catch((error) => {
    console.error(error);
  });
}

function playNotesSequentially(notes) {
  let time = 0; 
  const duration = 2;

  notes.forEach(note => {
    poly.play(note.note, 0.5, time, duration);
    time += duration; 
  });
}

