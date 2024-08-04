document.addEventListener('DOMContentLoaded', () => {
    const homepage = document.getElementById("homepage");
    const gamepage = document.getElementById("gamepage");
    const boxes = document.querySelectorAll(".square");
    const reset = document.querySelector(".reset");
    const choice = document.querySelectorAll(".img-block");
    const popupPage = document.getElementById("popup");
    const turnMsg = document.getElementsByClassName("turn");
    const winPatters = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
    ];
    let userChoice
    let aiChoice
    let aiTakingTurn = false;

    reset.addEventListener("click", resetGame);
    choice.forEach((choice) => {
        choice.addEventListener("click", () => {
            userChoice = choice.classList[0];
            aiChoice = "";
            userChoice == "cross" ? aiChoice = "circle" : aiChoice = "cross"
            homepage.style.display = "none";
            gamepage.style.display = "block";
            popupPage.style.display = "none";
        })
    })

    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            if (!aiTakingTurn) {
                if (box.getAttribute("value") === "-1") {
                    turnMsg[0].innerText = "AI's turn";
                    box.style.backgroundImage = `url(images/${userChoice}-main.svg)`;
                    box.setAttribute("value", "0");
                    let winner = checkWinner(boxes);
                    if (winner === "0") {
                        setTimeout(()=>{
                            showPopup("You Won!!")
                        }, 500);
                    } else {
                        aiTakingTurn = true;
                        setTimeout(takeAiTurn, 500); // delay for 1 second
                    }
                }
            }
        })
    })

    function takeAiTurn() {
        let emptyBoxes = Array.from(boxes).filter(box => box.getAttribute("value") === "-1");
        if (emptyBoxes.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
            let selectedBox = emptyBoxes[randomIndex];
            selectedBox.style.backgroundImage = `url(images/${aiChoice}-main.svg)`;
            selectedBox.setAttribute("value", "1");
            turnMsg[0].innerText = "Your Turn";
            let winner = checkWinner(boxes);
            if (winner === "1") {
                setTimeout(()=>{
                    showPopup("Computer Won!!");
                }, 500);
            }
        }
        aiTakingTurn = false;
    }

    function checkWinner(boxes) {
        for (let pattern of winPatters) {
            let value1 = boxes[pattern[0]].getAttribute("value");
            let value2 = boxes[pattern[1]].getAttribute("value");
            let value3 = boxes[pattern[2]].getAttribute("value");
            if ((value1 === value2) && (value2 === value3) && (value1 != "-1")) {
                return value1;
            }
        }
    }

    function showPopup(message) {
        let text = popupPage.getElementsByTagName("p");
        text.innerText = message;
        popupPage.style.display = "flex";

        document.getElementById("back-to-home").addEventListener("click", () => {
            resetGame();
            homepage.style.display = "block";
            gamepage.style.display = "none";
            popupPage.style.display = "none";
        })
        document.getElementById("pop-reset").addEventListener("click", () => {
            resetGame();
            homepage.style.display = "none";
            gamepage.style.display = "block";
            popupPage.style.display = "none";
        });
    }

    function resetGame() {
        turnMsg[0].innerText = "Your Turn";
        boxes.forEach((boxes) => {
            boxes.style.backgroundImage = "url('')";
            boxes.setAttribute("value", "-1");
        })
    }
})