/*
**    Developed by Zlytherin
*/

var play;
var re = 0;  // no of turns
var turn = "p1"; // current turn
var player;  // p1 or p2
var rname;
var p1name;
var p2name;
var mod = 0;
var over = false;
var started = false;
var ini = true;

class Room {
    constructor() {
        this.p1 = "";
        this.p2 = "";
        this.curr = "p1";
        this.rec = [0,0,0,0,0,0,0,0,0];
        this.his = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
        return this;
    }
}
function t(_) {
    console.log(_);
}
function create() {
    let name = document.getElementById("name").value;
    rname = document.getElementById("room").value;
    if (ini) {
        ini = false;
        let m = document.getElementsByClassName("grou");
        m[0].classList.add("showem")
        m[1].classList.add("showem")
        document.getElementById("cbtn").style.transform = "translateY(30px) scale(1.2)"
        document.getElementById("jbtn").classList.add("remove");
        document.getElementById("cobtn").classList.add("remove");
        document.getElementsByTagName("p")[0].classList.add("remove");
        document.getElementsByTagName("p")[1].classList.add("remove");
        return;
    }
    let fill1 = document.getElementById("name1");
    let fill2 = document.getElementById("name2");
    if(!(/^[a-zA-Z ]+$/.test(rname))) {
        alert("Room Name can contain only alphabets and spaces");
        return;
    }
    if (name.length > 10)
        name = name.substring(0,11) + "...";
    
    if (name === "" || rname === "") {
        alert("Insufficient Information");
        return;
    }
    if (!list.includes(rname)) {
        document.getElementById("form").classList.add("slide2");
        document.getElementById("main").classList.add("slide");
        setTimeout(() => document.getElementById("form").style.display="none", 1000);
        fill1.innerHTML = name;
        player = "p1";
        p1name = name;
        started = true;
        var add = database.ref("/rooms/" + rname);
        let room = new Room(); room.p1 = name;
        add.set(room);
        add.on("value", data => {
            play = data.val();
            if (play.p2 !== "") {
                p2name = play.p2;
                fill2.innerHTML = play.p2;
            }
            update();
        });
    } else {
        alert("Room Already Exists\nPlease Change Room Name");
        return;
    }
}

function join() {
    if (ini) {
        ini = false;
        let m = document.getElementsByClassName("grou");
        m[0].classList.add("showem")
        m[1].classList.add("showem")
        m[1].style.display = "none";
        document.getElementsByTagName("h6")[0].classList.add("showem");
        document.getElementsByTagName("h6")[0].style.display = "block";
        document.getElementById("alist").style.display = "block"
        document.getElementById("alist").classList.add("showem");
        document.getElementById("jbtn").classList.add("remove")
        document.getElementById("cbtn").classList.add("remove");
        document.getElementById("cobtn").classList.add("remove");
        document.getElementsByTagName("p")[0].classList.add("remove");
        document.getElementsByTagName("p")[1].classList.add("remove");
        return;
    }
    let name = document.getElementById("name").value
    let fill1 = document.getElementById("name1");
    let fill2 = document.getElementById("name2");
    if (name.length > 10)
        name = name.substring(0,11) + "...";
    
    if (name === "" || rname === "") {
        alert("Insufficient Information");
        return
    }
    if (!list.includes(rname)) {
        alert("Room not found! Please check the name");
        return;
    } else {
        var add = database.ref("/rooms/" + rname);
        add.on("value", data => {
            play = data.val();
            if (!started) {
            if (play.p2 !== "") {
                alert("Room Full!");
                add.off("value");
                return;
            }
            }
            document.getElementById("form").classList.add("slide2");
        document.getElementById("main").classList.add("slide");
        setTimeout(() => document.getElementById("form").style.display="none", 1000);
        fill2.innerHTML = name;
        player = "p2";
        p2name = name;
        started = true;
            play.p2 = name;
            add.set(play);
            p1name = play.p1;
            fill1.innerHTML = play.p1;
            update();
        });
    }
}

function toggleTurn() {
    if (turn === "p1") {
        turn = "p2";
        document.getElementById("name1").classList.remove("atten");
        document.getElementById("name2").classList.add("atten");
    } else {
        turn = "p1";
        document.getElementById("name2").classList.remove("atten");
        document.getElementById("name1").classList.add("atten");
    }
}

function update() {
    turn = "p1";
    re = 0;
    for (let i = 0; i < 9; ++i) {
        if (play.his[i] === -1) {
            break;
        }
        button(play.his[i], 1);
        if (i >= 5) check();
    }
}

function button(no, c = 0) {
    let buttons = document.getElementsByClassName("col");
    if (mod === 1) {
        if (over) return;
        if (c === 0 && turn !== "p1") return;
        play.rec[no] = (c === 0) ? 1 : 2;
        toggleTurn();
        if (c === 0) {
                buttons[no].classList.add("x");
        }
        else buttons[no].classList.add("o");
        if (re > 4) check();
        if (c === 0) {
            while(true && !over) {
                let make = Math.floor(Math.random() * 10);
                if (play.rec[make] === 0) {
                   setTimeout(() => button(make, 1), 2000);
                   break;
                } else
                    continue;
            }
        }
        ++re;
        return;
    }
    add = database.ref("/rooms/" + rname);
    if (play.rec[no] !== 0 && c !== 1) return;
    if (turn !== player && c !== 1) return;
    if (turn === "p1") {
        buttons[no].classList.add("x")
        play.rec[no] = 1;
    } else {
        buttons[no].classList.add("o")
        play.rec[no] = 2;
    }
    if (c === 0) {
        play.his[re] = no;
        add.set(play);
    } else
        toggleTurn();
    ++re;
}

function check () {
    let x = play.rec;
    if (x[0] === x[1] && x[0] === x[2]) {
        setWinner(x[0])
    } else if (x[3] === x[4] && x[3] === x[5]) {
        setWinner(x[3])
    } else if (x[6] === x[7] && x[6] === x[8]) {
        setWinner(x[6])
    } else if (x[0] === x[3] && x[0] === x[6]) {
        setWinner(x[0])
    } else if (x[1] === x[4] && x[1] === x[7]) {
        setWinner(x[1])
    } else if (x[2] === x[5] && x[2] === x[8]) {
        setWinner(x[2])
    } else if (x[0] === x[4] && x[0] === x[8]) {
        setWinner(x[0])
    } else if (x[2] === x[4] && x[2] === x[6]) {
        setWinner(x[2])
    } else if (x[0] !== 0 && x[1] !== 0 && x[2] !== 0 && x[3] !== 0 && x[4] !== 0 && x[5] !== 0 && x[6] !== 0 && x[7] !== 0 && x[8] !== 0) {
        setWinner(0)
    }
}


function setWinner (winner) {
    let all = document.getElementsByClassName("col");
    for (let i = 0; i < 9; ++i) {
        all[i].onclick = "";
    }
    if (mod === 1) {
        over = true;
        if (winner === 1) setTimeout(()=>alert("You won!"), 2500);
        else if (winner === 2) setTimeout(()=>alert("You lose!"), 2500);
        else setTimeout(()=>alert("Game draw!"), 1500);
        return;
    }
    let fref = database.ref("/rooms/" + rname);
    fref.off("value");
    fref.remove();
    if (winner === 0) {
        setTimeout(() => alert("Game Draw!"), 1000);
        return;
    }
    let won = winner === 1 ? p1name : p2name;
    setTimeout(() => alert(won + " won!"), 2500);
}

function computer() {
    alert("Computer mod was added just so that the persons who dont have friends can have a look at the UI. \nBest Experience can be enjoyed in multiplayer");
    mod = 1;
    document.getElementById("form").classList.add("slide2");
    document.getElementById("main").classList.add("slide");
    setTimeout(() => document.getElementById("form").style.display="none", 1000);
    let fill1 = document.getElementById("name1");
    let fill2 = document.getElementById("name2");
    fill1.innerHTML = "You";
    fill2.innerHTML = "Computer";
    play = new Room();
}
