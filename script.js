let bird = document.getElementById("bird");
let game = document.querySelector(".game-container");
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");

let game_state = "Start";
let bird_dy = 0;
let gravity = 0.15;
let jump_strength = -4.5;
let move_speed = 2.5;
let pipe_timer = 0;
let pipe_gap = window.innerWidth < 768 ? 120 : 200;

let hitbox = { top: 6, bottom: 6, left: 3, right: 3 };

bird.style.display = "none";

// Prevent scrolling with arrow keys
window.addEventListener("keydown", e => { if(e.key === "ArrowUp") e.preventDefault(); });

function startGame() {
    if(game_state === "Play") return;
    game_state = "Play";
    bird.style.top = "40%";
    bird_dy = 0;
    score_val.innerHTML = "0";
    message.innerHTML = "";
    message.classList.remove("messageStyle");
    document.querySelectorAll(".pipe_sprite").forEach(p => p.remove());
    bird.style.display = "block";
    play();
}

function jump() { if(game_state === "Play") bird_dy = jump_strength; }

document.addEventListener("keydown", e => { if(e.key==="Enter") startGame(); if(e.key==="ArrowUp") jump(); });
document.addEventListener("click", ()=> game_state!=="Play"? startGame(): jump());
document.addEventListener("touchstart", e=>{ e.preventDefault(); game_state!=="Play"? startGame(): jump(); }, {passive:false});

function play(){
    function move(){
        if(game_state!=="Play") return;
        bird_dy += gravity;
        bird.style.top = bird.offsetTop + bird_dy + "px";

        let bird_rect = bird.getBoundingClientRect();
        let game_rect = game.getBoundingClientRect();

        if(bird.offsetTop <= 0 || bird.offsetTop + bird.offsetHeight >= game_rect.height) return endGame();

        document.querySelectorAll(".pipe_sprite").forEach(pipe => {
            pipe.style.left = pipe.offsetLeft - move_speed + "px";
            let pipe_rect = pipe.getBoundingClientRect();

            if(pipe.offsetLeft + pipe.offsetWidth < 0) pipe.remove();

            if(
                bird_rect.left + hitbox.left < pipe_rect.left + pipe_rect.width &&
                bird_rect.right - hitbox.right > pipe_rect.left &&
                bird_rect.top + hitbox.top < pipe_rect.top + pipe_rect.height &&
                bird_rect.bottom - hitbox.bottom > pipe_rect.top
            ) return endGame();

            if(!pipe.scored && pipe_rect.right < bird_rect.left){
                score_val.innerHTML = parseInt(score_val.innerHTML)+1;
                pipe.scored = true;
            }
        });

        requestAnimationFrame(move);
    }

    function createPipe(){
        if(game_state!=="Play") return;
        pipe_timer++;
        if(pipe_timer > 100){
            pipe_timer = 0;
            let max_pipe_height = game.offsetHeight - pipe_gap - 30;
            let pipe_pos = Math.random() * max_pipe_height + 15;

            let topPipe = document.createElement("div");
            topPipe.className = "pipe_sprite";
            topPipe.style.height = pipe_pos + "px";
            topPipe.style.top = "0px";
            topPipe.scored = false;
            game.appendChild(topPipe);

            let bottomPipe = document.createElement("div");
            bottomPipe.className = "pipe_sprite";
            bottomPipe.style.height = (game.offsetHeight - pipe_pos - pipe_gap) + "px";
            bottomPipe.style.top = (pipe_pos + pipe_gap) + "px";
            bottomPipe.scored = false;
            game.appendChild(bottomPipe);
        }
        requestAnimationFrame(createPipe);
    }

    requestAnimationFrame(move);
    requestAnimationFrame(createPipe);
}

function endGame(){
    game_state = "End";
    bird.style.display = "none";
    message.innerHTML = '<span style="color:red;">Game Over</span><br>Tap / Click / Press Enter to Restart';
    message.classList.add("messageStyle");
}
