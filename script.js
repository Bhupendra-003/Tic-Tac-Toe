document.addEventListener('DOMContentLoaded', () => {
    const homepage = document.getElementById("homepage");
    const gamepage = document.getElementById("gamepage");
    const boxes = document.querySelectorAll(".square");
    const reset = document.querySelector(".reset");
    const choice = document.querySelectorAll(".img-block");
    const popupPage = document.getElementById("popup");
    const turnMsg = document.getElementsByClassName("turn");
    const winPatterns = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
    ];
    const popSleepTime = 300;
    let userChoice;
    let aiChoice;
    let aiTakingTurn = false;

    choice.forEach((choice) => {
        choice.addEventListener("click", () => {
            userChoice = choice.classList[0];
            aiChoice = userChoice === "cross" ? "circle" : "cross";
            homepage.style.display = "none";
            gamepage.style.display = "block";
            popupPage.style.display = "none";
        });
    });

    document.querySelector(".home-icon").addEventListener("click", () => {
        resetGame();
        homepage.style.display = "block";
        gamepage.style.display = "none";
        popupPage.style.display = "none";
    });

    reset.addEventListener("click", resetGame);

    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            if (!aiTakingTurn) {
                if (box.getAttribute("value") === "-1") {
                    box.style.backgroundImage = `url(images/${userChoice}-main.svg)`;
                    box.setAttribute("value", "0");
                    let winner = checkWinner(Array.from(boxes));
                    if (winner === "0") {
                        setTimeout(() => {
                            showPopup("You Won!!");
                        }, popSleepTime);
                    } else {
                        turnMsg[0].innerText = "AI's turn";
                        aiTakingTurn = true;
                        setTimeout(takeAiTurn, 500); // delay for 0.5 second
                    }
                }
            }
        });
    });

    function takeAiTurn() {
        let emptyBoxes = Array.from(boxes).filter(box => box.getAttribute("value") === "-1");
        if(emptyBoxes.length==0){
            setTimeout(() => {
                showPopup("Draw!!");
            }, popSleepTime);
        }
        if (emptyBoxes.length > 0) {
            // Prioritized AI moves
            let bestMove = getBestMove(emptyBoxes);
            bestMove.style.backgroundImage = `url(images/${aiChoice}-main.svg)`;
            bestMove.setAttribute("value", "1");
            let winner = checkWinner(Array.from(boxes));
            if (winner === "1") {
                setTimeout(() => {
                    showPopup("AI Won!!");
                }, popSleepTime);
            }
            else{
                turnMsg[0].innerText = "Your Turn";
            }
        }
        aiTakingTurn = false;
    }

    function getBestMove(emptyBoxes) {
        // Try to win
        for (let box of emptyBoxes) {
            box.setAttribute("value", "1");
            if (checkWinner(Array.from(boxes)) === "1") {
                box.setAttribute("value", "-1");
                return box;
            }
            box.setAttribute("value", "-1");
        }
        // Block user from winning
        for (let box of emptyBoxes) {
            box.setAttribute("value", "0");
            if (checkWinner(Array.from(boxes)) === "0") {
                box.setAttribute("value", "-1");
                return box;
            }
            box.setAttribute("value", "-1");
        }
        // Take center if available
        if (boxes[4].getAttribute("value") === "-1") {
            return boxes[4];
        }
        // Take a corner if available
        const corners = [0, 2, 6, 8];
        for (let i of corners) {
            if (boxes[i].getAttribute("value") === "-1") {
                return boxes[i];
            }
        }
        // Take any remaining empty box
        return emptyBoxes[0];
    }

    function checkWinner(boxes) {
        for (let pattern of winPatterns) {
            let value1 = boxes[pattern[0]].getAttribute("value");
            let value2 = boxes[pattern[1]].getAttribute("value");
            let value3 = boxes[pattern[2]].getAttribute("value");
            if ((value1 === value2) && (value2 === value3) && (value1 != "-1")) {
                return value1;
            }
        }
        return null;
    }

    function showPopup(message) {
        let text = popupPage.getElementsByTagName("p")[1];
        text.innerText = message;
        popupPage.style.display = "flex";

        document.getElementById("back-to-home").addEventListener("click", () => {
            resetGame();
            homepage.style.display = "block";
            gamepage.style.display = "none";
            popupPage.style.display = "none";
        });
        document.getElementById("pop-reset").addEventListener("click", () => {
            resetGame();
            homepage.style.display = "none";
            gamepage.style.display = "block";
            popupPage.style.display = "none";
        });
        document.getElementById("pop-cross").addEventListener("click", () => {
            popupPage.style.display = "none";
        });
    }

    function resetGame() {
        turnMsg[0].innerText = "Your Turn";
        boxes.forEach((box) => {
            box.style.backgroundImage = "url('')";
            box.setAttribute("value", "-1");
        });
    };
});
