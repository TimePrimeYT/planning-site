// 🔥 CONFIG FIREBASE (REMPLACE PAR LA TIENNE)
  const firebaseConfig = {
    apiKey: "AIzaSyCND0J6N9XO69lz9EirZJOS8zDB-hVGj3Q",
    authDomain: "planning-site-e7e9f.firebaseapp.com",
    projectId: "planning-site-e7e9f",
    storageBucket: "planning-site-e7e9f.firebasestorage.app",
    messagingSenderId: "845840241838",
    appId: "1:845840241838:web:448ea623db8b40dc1a493f",
    measurementId: "G-XSYDBF3XJ3"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const startHour = 6;
const endHour = 23;

const planning = document.getElementById("planning");
let isAdmin = false;
let changes = {};

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function createPlanning(data = {}){
    planning.innerHTML = "";

    planning.appendChild(createCell("Heure", true));
    days.forEach(day => planning.appendChild(createCell(day, true)));

    for(let hour = startHour; hour <= endHour; hour++){
        planning.appendChild(createCell(hour + "h - " + (hour+1) + "h", false, true));

        days.forEach(day => {
            let key = day + "-" + hour;
            let value = data[key] || "";
            let cell = createCell(value);
            cell.dataset.key = key;

            if(isAdmin){
                cell.classList.add("editable");
                cell.onclick = () => editCell(cell);
            }

            planning.appendChild(cell);
        });
    }

    if(isAdmin){
        addPublishButton();
    }
}

function createCell(text, header=false, hour=false){
    let div = document.createElement("div");
    div.classList.add("cell");
    if(header) div.classList.add("day-header");
    if(hour) div.classList.add("hour");
    div.textContent = text;
    return div;
}

function editCell(cell){
    let newValue = prompt("Modifier la tâche :", cell.textContent);
    if(newValue !== null){
        cell.textContent = newValue;
        changes[cell.dataset.key] = newValue;
    }
}

function addPublishButton(){
    let btn = document.createElement("button");
    btn.textContent = "Publish";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.onclick = publishChanges;
    document.body.appendChild(btn);
}

function publishChanges(){
    db.collection("planning").doc("week").set(changes, { merge: true })
    .then(() => {
        alert("Modifications publiées !");
        changes = {};
    });
}

function loadPlanning(){
    db.collection("planning").doc("week").get()
    .then(doc => {
        if(doc.exists){
            createPlanning(doc.data());
        } else {
            createPlanning();
        }
    });
}

document.getElementById("panelBtn").onclick = () => {
    document.getElementById("loginModal").style.display = "flex";
}

function closeModal(){
    document.getElementById("loginModal").style.display = "none";
}

function login(){
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if(user === ADMIN_USER && pass === ADMIN_PASS){
        isAdmin = true;
        closeModal();
        loadPlanning();
    } else {
        document.getElementById("error").textContent = "Identifiants incorrects";
    }
}

loadPlanning();
