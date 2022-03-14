// Grundlegende Funktionen, Einstellungen und Verwendung der Seite. ACHTUNG: FINGER DAVON, SAMY!



// Setzen eines dynamischen Dateinamen: ACHTUNG: DARF NUR EINEN PUNKT (-> EINE DATEIENDUNG) ENTHALTEN!
const filename = "fahrzeug.save".split('.');
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

    // Initialisiere den Speicher-Knopf am Ende der Seite.
    let element = document.getElementById("dwnlBTN");
    element.setAttribute('download', filename[0]+"#"+prev+"."+filename[1]);
    // Funktion zum ausführen nach klicken des Knopfes.
    element.onclick = e => {
        if (positionen.length > 0) {
            // Speichere nur, wenn bereits Nutzer Eingaben zum ausgewähltem Fahrzeug existieren.
            // Speichere diese Daten in dem Array 'copy' unter folgender Formatierung:
            // Kleiner Schaden: x,y;description
            // Kratzer        : x1,y1:x2,y2;description
            // Großer Schafen : x,y:d;description
            let copy = Array();
            positionen.forEach(v=>{
                let t = "";
                if (v.relativePosition instanceof Array) {
                    t = v.relativePosition[0].x+","+v.relativePosition[0].y+":"+v.relativePosition[1].x+","+v.relativePosition[1].y;
                } else if (v.relativePosition instanceof Vector) {
                    t = v.relativePosition.x+","+v.relativePosition.y
                    if (v.drawingToolUsed == 3) {
                        t += ":"+v.ellipseDiameter;
                    }
                }
                if (t != "") {
                    t += ";"+v.typeOfDamage
                }
                copy.push(t.replaceAll("\n", "<br>"));
            });
            // Setze den herunter zu ladenen Inhalt der Datei zu einer 'String' darstellung des 'copy' Arrays.
            e.target.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(copy.join("\n")));
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
        // Der Name der herunter zu ladenen Datei wird entsprechend des ausgewählten Fahrzeugs angepasst.
        document.getElementById("dwnlBTN").setAttribute('download', filename[0]+"#"+prev+"."+filename[1]);
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

// Klasse zur Angabe einer Datenstruktur für Nutzer Eingaben.
class Data {
    constructor(aP, rP, dT) {
        // aP => 'absolutePosition', die absolute Position des gespeicherten Elements auf dem *momentanen* Bildschirm.
        if (aP instanceof Array) {
            // In diesem Fall sind hier in einem Array zwei 2-Dimensionale Koordinaten gespeichert. Die Daten entsprechen einem 'Kratzer'.
            this.absolutePosition = Array();
            for (let i = 0; i < aP.length; i++) {
                this.absolutePosition.push(aP[i].copy());
            }
        } else if (aP instanceof Vector) {
            // In diesem Fall ist hier eine 2-Dimensionale Koordinate gespeichert. Die Daten entsprechen einem 'Kleinen Schaden'.
            this.absolutePosition = aP.copy();
        }

        // rP => 'relativePosition', die relative Position des gespeicherten Elements auf *jedem* Bildschirm, abhängig von *dessen* Höhe und Breite.
        if (rP instanceof Array) {
            // In diesem Fall sind hier in einem Array zwei 2-Dimensionale Koordinaten gespeichert. Die Daten entsprechen einem 'Kratzer'.
            this.relativePosition = Array();
            for (let i = 0; i < rP.length; i++) {
                this.relativePosition.push(rP[i].copy());
            }
        } else if (aP instanceof Vector) {
            // In diesem Fall ist hier eine 2-Dimensionale Koordinate gespeichert. Die Daten entsprechen einem 'Kleinen Schaden'.
            this.relativePosition = rP.copy();
        }

        // 'drawingTool' => Werkzeug bzw. Element Typ
        this.drawingToolUsed = dT;
        if (dT == "3") {
            // Bei verwendung eines 'Großflächigen Schadens' wird ebenfalls ein Durchmesser dessen Kreises gespeichert.
            this.ellipseDiameter = parseInt(document.getElementById("ellipseD").value);
        }
    }
}