const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const startHour = 6;
const endHour = 23;

const planning = document.getElementById("planning");
let isAdmin = false;

// LOGIN INFO (change ici)
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function createPlanning(){
    planning.innerHTML = "";

    planning.appendChild(createCell("Heure", true));

    days.forEach(day => {
        planning.appendChild(createCell(day, true));
    });

    for(let hour = startHour; hour <= endHour; hour++){
        planning.appendChild(createCell(hour + "h - " + (hour+1) + "h", false, true));

        days.forEach(day => {
            let key = day + "-" + hour;
            let saved = localStorage.getItem(key) || "";
            let cell = createCell(saved);
            cell.dataset.key = key;

            if(isAdmin){
                cell.classList.add("editable");
                cell.onclick = () => editCell(cell);
            }

            planning.appendChild(cell);
        });
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
        localStorage.setItem(cell.dataset.key, newValue);
    }
}

// PANEL BUTTON
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
        createPlanning();
    } else {
        document.getElementById("error").textContent = "Identifiants incorrects";
    }
}

createPlanning();
