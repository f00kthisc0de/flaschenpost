// Grundlegende Funktionen, Einstellungen und Verwendung der Seite. ACHTUNG: FINGER DAVON, SAMY!


// Setzen eines dynamischen Dateinamen
const filename = "fahrzeuge.save";
// Dynamische Bildwiederholungsrate des 'Canvas' um die Position der Maus des Nutzers aufzunehmen und darzustellen.
const framesPerSecond = 30;
// Deklarierung der Variablen für den 'Canvas' und dessen 'bemalbaren' Kontext.
let canvas, context, interval;
// Dynamische Variablen für die Position der Maus oder ähnliches.
let isFill = true, isStroke = true, mouse = new Vector(0, 0);
// Die Variable 'dir' ist sehr wichtig, da diese alle Informationen zu Nutzer Eingaben zu jedem Fahrzeug beinhält.
let dir = {}, prev = "1", drawingTool = "1";

// Diese Funktion wird als 'Vorbereitung' ausgeführt sobald der Rest der Seite vollständig geladen ist.
function _prelaod() {
    // Initialisiere den 'Canvas' und setze ihn auf die selbe Breite/Höhe wie das 'bully.png'.
    canvas = document.createElement("canvas");
    canvas.className = "bully";

    const img = document.getElementById("bullyImage");
    canvas.width = img.width;
    canvas.height = img.height;

    // Initiialisiere den Kontext zum 'Canvas'.
    context = canvas.getContext("2d");

    // Initialisiere den Fahrzeuge-Upload-Knopf am Ende der Seite.
    let Vupld = document.getElementById("uploadForm");
    // Funktion zum ausführen nach klicken des Knopfes.
    Vupld.onchange = evt => {
        // Auslesen der Fahrzeuge Datei
        let file = evt.target.files[0];
        let reader = new FileReader();
        // Sobald die Datei geladen wurde, diese auslesen
        reader.onload = (theFile => {
            return e => {
                // Konvertieren des Dateiinhalts zu dem 'dir' Objekt
                let tempDir = JSON.parse(e.target.result);
                interpretData(tempDir);
            };
        })(file);
        // Ausführen der Auslese-Funktion
        reader.readAsText(file);
    };

    // Initialisiere den Fahrzeug-Hinzufügen-Knopf am Ende der Seite.
    let VaddBTN = document.getElementById("addBTN");
    // Funktion zum ausführen nach klicken des Knopfes.
    VaddBTN.onclick = () => {
        // Hinzufügen eines neuen 'option' Elements zu dem 'drop'-Menü
        let sel = document.getElementById("drop");
        let nOpt = document.createElement("option");
        let nVal = parseInt(sel.children[sel.children.length-1].value)+1;
        nOpt.value = nVal;
        nOpt.innerText = "Fahrzeug "+nVal;
        sel.appendChild(nOpt);
    };

    // Initialisiere den Speicher-Knopf am Ende der Seite.
    let element = document.getElementById("dwnlBTN");
    element.setAttribute('download', filename);
    // Funktion zum ausführen nach klicken des Knopfes.
    element.onclick = e => {
        if (!checkIfDirIsEmpty()) {
            // Setze den herunter zu ladenen Inhalt der Datei zu einer 'String' darstellung des 'dir' Objekts.
            e.target.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(JSON.stringify(dir)));
        } else {
            // Werfe eine Meldung auf, weil nichts heruntergeladen werden kann, ohne jegliche Eingaben.
            let wM = document.createElement("p");
            wM.innerText = "Bisher wurde keine Auswahl getroffen!";
            throwAlert([wM]);
        }
    };

    // Initialisiere die Fahrzeug Auswahl 'drop'.
    let selector = document.getElementById("drop");
    selector.onchange = e => {
        // Wenn die Auswahl des Fahrzeugs geändert wird das 'positionen' Array aus dem 'directory: dir', falls vorhanden, geladen
        const sel = e.target.value;
        if (positionen.length > 0) {
            dir[prev] = positionen.copyWithin(0,positionen.length);
        }
        if (dir[sel] && dir[sel].length > 0) {
            positionen = dir[sel].copyWithin(0,dir[sel].length);
        } else {
            positionen = Array();
        }
        prev = sel;
        // Die Daten-Ausgabe in der Tabelle muss neugeladen werden.
        updateTable();
    };

    // Initialisiere die Element Auswahl 'tools': 'tools' von 'Werkzeug' im Sinne von 'Malwerkzeug' -> 'drawingTool'.
    let dT = document.getElementById("tools");
    dT.onchange = e => {
        // Speichere den verwendeten Typ des Elements und Aktiviere bzw. Deaktiviere die 'ellipseDiameter' auswahl.
        drawingTool = e.target.value;
        let eD = document.getElementById("ellipseD");
        eD.disabled = !(drawingTool == "3");
    };

    // EventListener für das 'Überwachen' und Speichern der Maus Position.
    document.body.onmousemove = function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse = new Vector(event.clientX - rect.left, event.clientY - rect.top);
    };

    // Initialisiere die Auswahl für den Durchmesser der 'Großflächigen Schäden'.
    let eDSM = document.getElementById("ellipseD");
    eDSM.max = canvas.width - (canvas.width / 50);
    
    // Füge den 'Canvas' zu dem 'bully.png' und damit der Seite hinzu.
    document.getElementById("imageAndCanvas").appendChild(canvas);

    // Initialisiere den Ausgabe Container für Element IDs.
    let indexDiv = document.createElement("div");
    indexDiv.id = "indexDiv";
    indexDiv.className = "bully";
    indexDiv.style.width = canvas.width;
    indexDiv.style.height = canvas.height;
    document.getElementById("imageAndCanvas").appendChild(indexDiv);

    // Falls die Funktion 'setup' existiert, verwende diese / führe diese aus.
    if (typeof setup == "function") {
        setup();
    }

    // Falls die Funktion 'draw' existiert, führe diese {framesPerSecond} mal die Sekunde aus.
    if (typeof draw == "function") {
        interval = setInterval(draw, 1000/framesPerSecond);
    }

    // Falls die Funktion 'onMouseDown' existiert, füge diese als EventListener des Elements 'Canvas' hinzu.
    if (typeof onMouseDown == "function") {
        canvas.onmousedown = onMouseDown;
    }

    // Falls die Funktion 'onMouseUp' existiert, füge diese als EventListener des Elements 'Canvas' hinzu.
    if (typeof onMouseUp == "function") {
        canvas.onmouseup = onMouseUp;
    }

    // Daten von document.cookie auslesen wenn die Seite geladen wird
    let lS = window.localStorage.getItem("Damage");
    if (lS != '') {
        let tempDir = JSON.parse(lS);
        interpretData(tempDir);
    }

    // Daten in document.cookie speichern sobal die Seite geschlossen wird
    document.body.onunload = () => {
        if (!checkIfDirIsEmpty())
            window.localStorage.setItem("Damage", JSON.stringify(dir));
        else
            clearAllStorage();
    };
}

function clearAllStorage() {
    positionen = [];
    dir = {};
    window.sessionStorage.clear();
    window.localStorage.clear();
}

// Funktion zum Überprüfen, ob das 'dir' Objekt "effektiv leer" ist
function checkIfDirIsEmpty() {
    // Wenn noch Daten im Array für das Momentane Fahrzeug drinne sind, diese Abspeichern
    if (positionen.length > 0)
        dir[document.getElementById("drop").value] = positionen.copyWithin(0,positionen.length);
    // Überprüfen, ob es Einträge im 'dir' Objekt gibt, und wenn ja, ob dies ein Arrays mit einer Länge > 0 ist
    let hasNonEmptyKey = false;
    for (let param in dir) {
        if (dir[param].length > 0) {
            hasNonEmptyKey = true;
        }
    }
    // Ausgabe des Ergebnisses
    return !hasNonEmptyKey;
}

// Funktion zum Interpretieren der Ausgelesenen Daten aus Datein bzw. Cookies
function interpretData(dS) {
    // Durch das gesamte temporäre 'dir' Objekt ("dS") duchsuchen
    for (let arr in dS) {
        // Wenn das 'dir' Objekt nicht bereits einen Array an diesem Eintrag besitzt, erzeuge eins
        if (!(dir[arr]))
            dir[arr] = Array();
        // Durch das Array an dieser Stelle im 'dS' durchsuchen
        dS[arr].forEach(element => {
            // Da Objekte hier über 'JSON.parse' und 'JSON.stringify' verändert werden, muss hier wieder zusätzliche Informatiob hinzugefügt werden

            // Änderung des Attributs 'relativePosition' des jeweiligen Elements
            if (element.relativePosition) {
                // Hier besteht die 'relativePosition' aus einem 'Vector' Objekt, und dies muss so gekennzeichnet werden
                if (!(element.relativePosition instanceof Array))
                    element.relativePosition = Object.assign(new Vector(), element.relativePosition);
                else {
                    // Hier besteht die 'relativePosition' aus einem Array, und darin muss alles als 'Vector' Objekt gekennzeichnet werden
                    let newAP = Array();
                    element.relativePosition.forEach(e => {
                        newAP.push(Object.assign(new Vector(), e));
                    });
                    element.relativePosition = newAP;
                }
            }

            // Änderung des Attributs 'absolutePosition' des jeweiligen Elements
            if (element.absolutePosition) {
                // Hier besteht die 'absolutePosition' aus einem 'Vector' Objekt, und dies muss so gekennzeichnet werden
                if (!(element.absolutePosition instanceof Array))
                    element.absolutePosition = Object.assign(new Vector(), element.absolutePosition);
                else {
                    // Hier besteht die 'absolutePosition' aus einem Array, und darin muss alles als 'Vector' Objekt gekennzeichnet werden
                    let newAP = Array();
                    element.absolutePosition.forEach(e => {
                        newAP.push(Object.assign(new Vector(), e));
                    });
                    element.absolutePosition = newAP;
                }
            } else if (element.relativePosition) {
                // Neu berechnung der absoluten Position für diesen client, da in diesem Fall keine absolute Position vorliegt
                const canvVect = new Vector(canvas.width, canvas.height);
                // Hier besteht die 'relativePosition' aus einem 'Vector' Objekt, d.H. die 'absolutePosition' muss ebenfalls das sein
                if (!(element.relativePosition instanceof Array))
                    element.absolutePosition = Vector.mult(element.relativePosition, canvVect);
                else {
                    // Hier besteht die 'relativePosition' aus einem Array, d.H. die 'absolutePosition' muss auch einer sein, in welchem 'Vector' Objekte vorliegen
                    element.absolutePosition = Array();
                    for (let i = 0; i < element.relativePosition.length; i++)
                        element.absolutePosition.push(Vector.mult(element.relativePosition[i], canvVect));
                }
            }

            // Änderung des Elements selbst
            element = Object.assign(new Data(), element);
            
            // Hinzufügen des Elements zum 'dir' Speicher
            dir[arr].push(element);
        });
    }
    // Beziehen der Daten für das Momentane Fahrzeug aus dem 'dir'
    if (dir[document.getElementById("drop").value])
        positionen = dir[document.getElementById("drop").value];
    if (!checkIfDirIsEmpty()) {
        // Wenn 'dir' nicht leer ist, bzw. gültige Einträge besitzt, dann fortfahren

        // Wenn in 'dir' mehr Fahrzeuge gespeichert wurden, als in dem selector 'drop' zur verfügung stehen, diese hinzufügen
        let highestVal = 1;
        for (let param in dir) {
            highestVal = Math.max(highestVal, parseInt(param));
        }
        let sel = document.getElementById("drop");
        let currentVal = parseInt(sel.children[sel.children.length-1].value);
        if (highestVal > currentVal) {
            let VaddBTN = document.getElementById("addBTN");
            for (let i = currentVal+1; i <= highestVal; i++) {
                VaddBTN.click();
            }
        }

        // Die Tabelle, inklusive derer Daten über die Elemente, außerhalb des Canvas' aktualisieren
        updateTable();
    }
}

// Funktion für selbst erstellte Meldungen.
function throwAlert(msg) {
    // Initialisiere den 'Container: customAlert'.
    let aM = document.getElementById("customAlert");
    aM.style.display = "block";

    // Füge alle Elemente im Array 'msg' dem 'Container' hinzu.
    msg.forEach(e => {
        aM.appendChild(e);
    });

    // Erstelle einen Knopf um die Meldung zu schließen.
    let aB = document.createElement("a");
    aB.innerText = "Schließen";
    aB.onclick = e => {
        // Beim klicken des Knopfes, lösche allen inneren HTML Code des 'Containers'.
        let pE = e.target.parentElement;
        pE.style.display = "none";
        pE.innerHTML = "";
        pE.specialValue = undefined;
    };
    aB.className = "aBTN";
    aB.id = "closeBTN";
    aM.appendChild(aB);
}

// Funktion um eine Zahl a mit Grenzen b und c, Verhältnisweise den Grenzen d und e anzupassen.
function map(a, b, c, d, e) {
    return ((a - b) / (c - b)) * (e - d) + d;
}

// Funktion um die Umrisse / Linien von 'Malvorgängen' wegzulassen.
function noStroke() {
    isStroke = false;
}

// Funktion um die Umrisse / Linien entsprechend der Eingabe darzustellen und zu färben.
function stroke(rgb_input) {
    isStroke = true;
    context.strokeStyle = rgb_input;
}

// Funktion um die Dicke der Umrisse / Linien entsprechend der Eingabe anzupassen.
function strokeWeight(line_width) {
    context.lineWidth = line_width;
}

// Funktion um das ausfüllen der Fläche von 'Malvorgängen' wegzulassen.
function noFill() {
    isFill = false;
}

// Funktion um die Fläche entsprechend der Eingabe darzustellen und zu färben.
function fill(rgb_input) {
    isFill = true;
    context.fillStyle = rgb_input;
}

// Funktion um den Hintergrund des 'Canvas' entsprechend der Eingabe zu darzustellen und ggf. zu färben.
function background(rgb_input) {
    if (rgb_input.toUpperCase() == "CLEAR") {
        context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        fill(rgb_input);
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// 'Malvorgang' um eine Linie von Punkt A(x1, y1) zu Punkt B(x2, y2) zu 'malen'.
function line(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

// 'Malvorgang' um ein Kreuz mit Mittelpunkt M(x, y) mit 'Durchmesser' d zu 'malen'.
function cross(x, y, d) {
    // Linie *von* unterer rechten Ecke zur oberen linken Ecke.
    line(
        Math.cos(Math.PI/4) * (d/2) + x,
        Math.sin(Math.PI/4) * (d/2) + y,
        Math.cos((5*Math.PI)/4) * (d/2) + x,
        Math.sin((5*Math.PI)/4) * (d/2) + y
    );
    // Linie *von* unterer linken Ecke zur oberen rechten Ecke.
    line(
        Math.cos((3*Math.PI)/4) * (d/2) + x,
        Math.sin((3*Math.PI)/4) * (d/2) + y,
        Math.cos((7*Math.PI)/4) * (d/2) + x,
        Math.sin((7*Math.PI)/4) * (d/2) + y
    );
}

// 'Malvorgang' um eine Ellipse von Punkt P(x, y) mit Breite 'w' und Höhe 'h' zu 'malen'.
function ellipse(x, y, w, h) {
    context.beginPath();
    context.ellipse(x, y, w/2, h/2, 0, 0, Math.PI*2);
    context.closePath();
    if (isStroke) {
        context.stroke();
    }
    if (isFill) {
        context.fill();
    }
}