/* ==========================================================
   CHUIIMUII × SUNDRUU
   COMPLETE WEBSITE CONTROLLER
========================================================== */


/* ==========================================================
   SECRET WORD
========================================================== */

const SECRET_WORD = "chuiimuii";


/* ==========================================================
   GET ELEMENTS
========================================================== */

const passwordScreen =
  document.getElementById("passwordScreen");

const passwordInput =
  document.getElementById("passwordInput");

const passwordError =
  document.getElementById("passwordError");

const unlockButton =
  document.getElementById("unlockButton");

const website =
  document.getElementById("website");

const music =
  document.getElementById("backgroundMusic");

const musicButton =
  document.getElementById("musicButton");


/* ==========================================================
   PASSWORD
========================================================== */

function unlockWebsite() {

  const entered =
    passwordInput.value
      .trim()
      .toLowerCase();

  if (entered === SECRET_WORD) {

    passwordScreen.classList.add("hidden");

    website.classList.remove("hidden");

    musicButton.classList.remove("hidden");

    playMusic();

    showRoom("introRoom");

  } else {

    passwordError.textContent =
      "Hmm… that's not it, Chuiimuii ♡";

    passwordInput.value = "";

    passwordInput.focus();

  }

}


unlockButton.addEventListener(
  "click",
  unlockWebsite
);


passwordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      unlockWebsite();

    }

  }
);


/* ==========================================================
   ROOM SYSTEM
========================================================== */

const rooms = [
  "introRoom",
  "museumRoom",
  "puzzleRoom",
  "memoryRoom",
  "letterRoom",
  "finalRoom"
];


function showRoom(roomId) {

  rooms.forEach(function(id) {

    const room =
      document.getElementById(id);

    if (room) {

      room.classList.add("hidden");

    }

  });


  const selectedRoom =
    document.getElementById(roomId);


  if (selectedRoom) {

    selectedRoom.classList.remove("hidden");

    selectedRoom.classList.remove("room");

    void selectedRoom.offsetWidth;

    selectedRoom.classList.add("room");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}


/* ==========================================================
   MUSIC
========================================================== */

music.volume = 0.45;


function playMusic() {

  music.play().catch(function() {

    /*
      Some phones prevent automatic audio.

      The music button will still allow
      the visitor to start it.
    */

  });

}


musicButton.addEventListener(
  "click",
  function() {

    if (music.paused) {

      music.play().catch(function() {});

      musicButton.textContent = "♫";

    } else {

      music.pause();

      musicButton.textContent = "🔇";

    }

  }
);


/* ==========================================================
   INTRO → MUSEUM
========================================================== */

document
  .getElementById("enterMuseumButton")
  .addEventListener(
    "click",
    function() {

      showRoom("museumRoom");

    }
  );


/* ==========================================================
   MUSEUM DOOR
========================================================== */

const door =
  document.getElementById("door");

const museumContinue =
  document.getElementById("museumContinue");

const knockText =
  document.getElementById("knockText");

const knockDots =
  document.querySelectorAll(
    ".knock-dots i"
  );

let knocks = 0;


door.addEventListener(
  "click",
  function() {

    if (knocks >= 3) {

      return;

    }


    knocks++;


    if (knockDots[knocks - 1]) {

      knockDots[knocks - 1]
        .classList.add("done");

    }


    if (knocks === 1) {

      knockText.textContent =
        "Once… ♡";

    }


    if (knocks === 2) {

      knockText.textContent =
        "Twice… ♡";

    }


    if (knocks === 3) {

      knockText.textContent =
        "Three times. Come in, Chuiimuii. ♡";

      door.classList.add("open");

      museumContinue.classList.remove(
        "hidden"
      );

      createHeartConfetti();

    }

  }
);


museumContinue.addEventListener(
  "click",
  function() {

    showRoom("puzzleRoom");

    startPuzzleTimer();

  }
);


/* ==========================================================
   PUZZLE
========================================================== */

const puzzleBoard =
  document.getElementById("puzzleBoard");

const moveCount =
  document.getElementById("moveCount");

const puzzleMessage =
  document.getElementById("puzzleMessage");

const puzzleContinue =
  document.getElementById("puzzleContinue");

const puzzleDots =
  document.getElementById("puzzleDots");

const peekButton =
  document.getElementById("peekButton");


let puzzleOrder = [
  0, 1, 2,
  3, 4, 5,
  6, 7, 8
];


let selectedPiece = null;

let moves = 0;

let puzzleSolved = false;

let timerSeconds = 0;

let timerInterval = null;


/* ==========================================================
   PUZZLE DOTS
========================================================== */

for (let i = 0; i < 6; i++) {

  const dot =
    document.createElement("i");

  puzzleDots.appendChild(dot);

}


/* ==========================================================
   SHUFFLE
========================================================== */

function shufflePuzzle() {

  let shuffled;

  do {

    shuffled =
      [...puzzleOrder];

    for (
      let i = shuffled.length - 1;
      i > 0;
      i--
    ) {

      const random =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        shuffled[i],
        shuffled[random]
      ] =
      [
        shuffled[random],
        shuffled[i]
      ];

    }

  }
  while (
    shuffled.every(
      function(piece, index) {

        return piece === index;

      }
    )
  );


  puzzleOrder = shuffled;

}


shufflePuzzle();


/* ==========================================================
   DRAW PUZZLE
========================================================== */

function drawPuzzle() {

  puzzleBoard.innerHTML = "";


  puzzleOrder.forEach(
    function(piece, position) {

      const tile =
        document.createElement("button");

      tile.className =
        "puzzle-piece";


      tile.setAttribute(
        "aria-label",
        "Puzzle piece " +
        (piece + 1)
      );


      const row =
        Math.floor(piece / 3);

      const column =
        piece % 3;


      tile.style.backgroundPosition =
        (column * 50) +
        "% " +
        (row * 50) +
        "%";


      if (
        selectedPiece === position
      ) {

        tile.classList.add(
          "selected"
        );

      }


      tile.addEventListener(
        "click",
        function() {

          selectPuzzlePiece(
            position
          );

        }
      );


      puzzleBoard.appendChild(tile);

    }
  );

}


drawPuzzle();


/* ==========================================================
   SELECT PUZZLE PIECES
========================================================== */

function selectPuzzlePiece(position) {

  if (puzzleSolved) {

    return;

  }


  if (selectedPiece === null) {

    selectedPiece = position;

    drawPuzzle();

    return;

  }


  if (selectedPiece === position) {

    selectedPiece = null;

    drawPuzzle();

    return;

  }


  [
    puzzleOrder[selectedPiece],
    puzzleOrder[position]
  ] =
  [
    puzzleOrder[position],
    puzzleOrder[selectedPiece]
  ];


  selectedPiece = null;

  moves++;


  moveCount.textContent =
    moves;


  drawPuzzle();

  checkPuzzle();

}


/* ==========================================================
   CHECK PUZZLE
========================================================== */

function checkPuzzle() {

  const solved =
    puzzleOrder.every(
      function(piece, index) {

        return piece === index;

      }
    );


  if (!solved) {

    puzzleMessage.textContent =
      "Keep going… we're almost there ♡";

    return;

  }


  puzzleSolved = true;


  puzzleMessage.textContent =
    "We look better together. ♡";


  clearInterval(timerInterval);


  puzzleContinue.classList.remove(
    "hidden"
  );


  document
    .querySelectorAll(
      "#puzzleDots i"
    )
    .forEach(
      function(dot) {

        dot.classList.add("done");

      }
    );


  createHeartConfetti();

}


/* ==========================================================
   PUZZLE TIMER
========================================================== */

function startPuzzleTimer() {

  clearInterval(timerInterval);

  timerSeconds = 0;

  updateTimer();


  timerInterval =
    setInterval(
      function() {

        if (!puzzleSolved) {

          timerSeconds++;

          updateTimer();

        }

      },
      1000
    );

}


function updateTimer() {

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;


  document.getElementById(
    "timer"
  ).textContent =
    minutes +
    ":" +
    String(seconds).padStart(
      2,
      "0"
    );

}


/* ==========================================================
   PUZZLE PEEK
========================================================== */

let peekTimeout;


function startPeek() {

  puzzleBoard.style.filter =
    "brightness(1.2)";


  puzzleBoard.style.background =
    "white";


  clearTimeout(peekTimeout);


  peekTimeout =
    setTimeout(
      function() {

        puzzleBoard.style.filter =
          "";

      },
      1200
    );

}


peekButton.addEventListener(
  "mousedown",
  startPeek
);

peekButton.addEventListener(
  "touchstart",
  startPeek
);


/* ==========================================================
   PUZZLE → MEMORIES
========================================================== */

puzzleContinue.addEventListener(
  "click",
  function() {

    showRoom("memoryRoom");

  }
);


/* ==========================================================
   MEMORIES → LETTER
========================================================== */

document
  .getElementById("memoryContinue")
  .addEventListener(
    "click",
    function() {

      showRoom("letterRoom");

    }
  );


/* ==========================================================
   VOICE MESSAGE
========================================================== */

const voiceAudio =
  document.getElementById(
    "voiceAudio"
  );

const voiceButton =
  document.getElementById(
    "voiceButton"
  );


voiceButton.addEventListener(
  "click",
  function() {

    if (voiceAudio.paused) {

      voiceAudio.play().catch(
        function() {}
      );

      voiceButton.textContent =
        "❚❚";

    } else {

      voiceAudio.pause();

      voiceButton.textContent =
        "▶";

    }

  }
);


voiceAudio.addEventListener(
  "ended",
  function() {

    voiceButton.textContent =
      "▶";

  }
);


/* ==========================================================
   LETTER → FINAL
========================================================== */

document
  .getElementById("letterContinue")
  .addEventListener(
    "click",
    function() {

      showRoom("finalRoom");

    }
  );


/* ==========================================================
   FINAL YES / NO
========================================================== */

const yesButton =
  document.getElementById(
    "yesButton"
  );

const noButton =
  document.getElementById(
    "noButton"
  );

const finalMessage =
  document.getElementById(
    "finalMessage"
  );


let noClicks = 0;


function moveNoButton() {

  noClicks++;


  if (noClicks === 1) {

    noButton.textContent =
      "You-nooooooo 😭";

  }


  if (noClicks === 2) {

    noButton.textContent =
      "Waittt 🥺";

  }


  if (noClicks === 3) {

    noButton.textContent =
      "Think again 😭";

  }


  if (noClicks >= 4) {

    noButton.style.display =
      "none";

    return;

  }


  const x =
    Math.random() * 180 - 90;

  const y =
    Math.random() * 120 - 60;


  noButton.style.transform =
    "translate(" +
    x +
    "px, " +
    y +
    "px)";

}


noButton.addEventListener(
  "mouseenter",
  moveNoButton
);


noButton.addEventListener(
  "click",
  moveNoButton
);


yesButton.addEventListener(
  "click",
  function() {

    finalMessage.classList.remove(
      "hidden"
    );


    noButton.style.display =
      "none";


    yesButton.textContent =
      "UUU-yessssss 💗";


    createHeartConfetti();

  }
);


/* ==========================================================
   HEART CONFETTI
========================================================== */

function createHeartConfetti() {

  const symbols = [
    "♡",
    "♥",
    "✦",
    "✧"
  ];


  for (
    let i = 0;
    i < 32;
    i++
  ) {

    const heart =
      document.createElement("span");


    heart.className =
      "heart-confetti";


    heart.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    heart.style.left =
      "50%";


    heart.style.top =
      "50%";


    heart.style.setProperty(
      "--x",
      (
        Math.random() * 500 -
        250
      ) +
      "px"
    );


    heart.style.setProperty(
      "--y",
      (
        Math.random() * 500 -
        250
      ) +
      "px"
    );


    document.body.appendChild(
      heart
    );


    setTimeout(
      function() {

        heart.remove();

      },
      1700
    );

  }

}
