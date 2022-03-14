// Funktionsweise und Darstellung der Seite. Alle nicht-essenziellen Funktionen hier rein.
// Hier darfst du Arbeiten, Samy :)



// Dynamischer Durchmesser von Kreuzen.
const sDurchmesser = 15;
// Array der alle Nutzer Eingaben des momentan ausgewähltem Fahrzeug enthält.
let positionen = Array();
// Boolean Variablen für Maus-Druck bzw. ob ein 'Kratzer' eingegeben wird. 
let mouseIsDown = false;
let drawingLine = false;
// Die Position der Maus beim letzten Maus-Druck.
let mouseDownPos;

// Funktion die beim Start des Programms ausgeführt wird
function setup() {
    stroke("rgb(255,0,0)");
    noFill();
}

// Funktion die {framesPerSecond} male die Sekunde gerufen wird
function draw() {
    background("CLEAR");

    if (drawingLine) {
        // 'Male' eine Linie zwischen der letzten Position bei Maus-Druck und der jetzigen Maus-Position
        strokeWeight(3);
        line(mouseDownPos.x, mouseDownPos.y, mouse.x, mouse.y);
    }

    // Stelle alle in 'positionen' gespeicherten Elemente entsprechend ihres Element Typens dar.
    let indexDiv = document.getElementById("indexDiv");
    for (let i = 0; i < positionen.length; i++) {
        const aP = positionen[i].absolutePosition;
        strokeWeight(3);
        switch (positionen[i].drawingToolUsed) {
            default:
                // Kleiner Schaden => Kreuz
                cross(aP.x, aP.y, sDurchmesser);
                break;
            case "3":
                // Großflächiger Schaden => Ellipse
                const eD = positionen[i].ellipseDiameter;
                ellipse(aP.x, aP.y, eD, eD);
                break;
            case "2":
                // Kratzer => Linie
                line(aP[0].x, aP[0].y, aP[1].x, aP[1].y);
                break;
        }

        // Darstellung der Element ID:
        // Relative Position des jeweiligen Elements zum 'indexDiv' + 'stapeln' von den Elementen um sie nicht in y-Richtung zu verschieben
        if (aP instanceof Vector) {
            // Wenn die Absolute Position nur aus einer Koordinate besteht:
            // Gebe die eindeutige Position an.
            let coordsP = document.createElement("p");
            coordsP.innerText = i;
            coordsP.style.position = "relative";
            coordsP.style.top = aP.y;
            coordsP.style.left = aP.x - canvas.width / 2;
            // Im Fall, dass dieses Element das erste ist, ersetze die alten durch dieses, um die alten zu löschen.
            if (i == 0)
                indexDiv.replaceChildren(coordsP);
            else
                indexDiv.appendChild(coordsP);
        } else if (aP instanceof Array) {
            // Wenn die Absolute Position aus zwei Koordinaten besteht:
            // Gebe beide Positionen mit selber ID an, aber #1 bzw. #2 dahinter.
            let pa = document.createElement("p");
            pa.innerText = i + " : #1";
            pa.style.position = "relative";
            pa.style.top = aP[0].y;
            pa.style.left = aP[0].x - canvas.width / 2;
            // Im Fall, dass dieses Element das erste ist, ersetze die alten durch dieses, um die alten zu löschen.
            if (i == 0)
                indexDiv.replaceChildren(pa);
            else
                indexDiv.appendChild(pa);

            let pb = document.createElement("p");
            pb.innerText = i + " : #2";
            pb.style.position = "relative";
            pb.style.top = aP[1].y;
            pb.style.left = aP[1].x - canvas.width / 2;
            // In diesem Fall können keine alten Elemente vorhanden sein, und müssen keine gelöscht werden.
            indexDiv.appendChild(pb);
        }
    }
}

// Funktion die beim drücken eines Maus-Knopfes ausgelöst wird
function onMouseDown() {
    mouseIsDown = true;
    let dTools = document.getElementById("tools");
    if (!drawingLine) {
        // Im Fall, dass momentan keine Linie 'gemalt' wird.
        if (drawingTool == "2") {
            // Wenn der Element Typ 'Kratzer' ausgewählt ist, speichere die Maus Position und setze eine Markierung, dass eine Linie 'gemalt' werden muss.
            mouseDownPos = mouse.copy();
            dTools.disabled = true;
            drawingLine = true;
        } else {
            // Einmalige Aufzeichnung der Maus-Position für andere Schadenstypen.
            let aP = mouse.copy();
            let rP = Vector.div(aP, new Vector(canvas.width, canvas.height));
            positionen.push(new Data(aP, rP, drawingTool));
        }
    } else if (drawingTool == "2") {
        // Erfassung des Zweiten Klicks im Fall einer Eingabe von Element Typ 'Kratzer'.
        let aP1 = mouseDownPos.copy();
        let rP1 = Vector.div(aP1, new Vector(canvas.width, canvas.height));
        let aP2 = mouse.copy();
        let rP2 = Vector.div(aP2, new Vector(canvas.width, canvas.height));
        positionen.push(new Data([aP1, aP2], [rP1, rP2], drawingTool));
        dTools.disabled = false;
        drawingLine = false;
    }
    // Im Fall, dass keine Linie *mehr* 'gemalt' werden muss, muss die Daten-Ausgabe in der Tabelle neugeladen werden.
    if (!drawingLine) { updateTable(); }
}

// Funktion die beim lösen eines Maus-Knopfes ausgelöst wird
function onMouseUp() {
    mouseIsDown = false;
}

// Funktioon zum löschen und (erneutem) beschreiben der Daten-Ausgabe in der Tabelle.
function updateTable() {
    // Erfasse die Daten-Ausgabe Tabelle.
    let table = document.getElementById("dataOutput");
    // Speichere die erste Zeile, welche bloß die Bezeichnungen der Daten angibt.
    let firstChild = document.getElementById("description");
    // Array zum speichern der 'neuen' Zeilen.
    let newChildren = Array();

    // Gehe durch alle Element im Eingabe Array 'positionen'.
    for (let i = 0; i < positionen.length; i++) {
        let p = positionen[i];
        // Initialisiere eine neue Reihe.
        let child = document.createElement("tr");
        // Speichere die Element ID in der Reihe für spätere Verwendung.
        child.valueIndex = i;

        // Initialisierung und setzen der Zelle für die Element ID.
        let id = document.createElement("td");
        id.innerText = i;
        child.appendChild(id);

        // Initialisierung und setzen der Zelle für den Element Typ.
        let type = document.createElement("td");
        let select = document.getElementById("tool"+p.drawingToolUsed);
        type.innerText = select.innerText;
        child.appendChild(type);

        // Initialisierung der Zelle für die Schadens-Beschreibung.
        let des = document.createElement("td");
        let uin = document.createElement("textarea");
        uin.oninput = e => {
            // Speicherung der Nutzer Eingabe zur Beschreibung sobald jegliche veränderungen im Textfeld vorgenommen werden.
            // Zugriff auf die Element ID der Reihe für einfaches Speichern.
            let index = e.target.parentElement.parentElement.valueIndex;
            let uInput = e.target.value;
            positionen[index].typeOfDamage = uInput;
        };
        // Setzen einer vorherigen Nutzer Eingabung zur Beschreibung, falls vorhanden.
        if (p.typeOfDamage)
            uin.value = p.typeOfDamage;
        des.appendChild(uin);
        child.appendChild(des);

        // Initialisierung der Zelle für den Löschen-Knopf.
        let del = document.createElement("td");
        let dBTN = document.createElement("a");
        dBTN.onclick = e => {
            // Rufen der Lösch-Bestätigung für das gegeneme Element.

            // Zugriff auf die Element ID der Reihe für einfaches Speichern.
            let index = e.target.parentElement.parentElement.valueIndex;
            // Speicherung aller Elemente für die Lösch-Meldung im Array 'elements'.
            let elements = Array();
            let confirmText = document.createElement("p");
            let confirmButton = document.createElement("a");
            confirmButton.onclick = evt => {
                // Setzen eines Knopfes und dessen Funktion das vom Nutzer gewünschte Element zu löschen, *und* den Meldungs-Container zu leeren
                let vI = evt.target.valueIndex;
                positionen.splice(vI, 1);
                updateTable();
                document.getElementById("closeBTN").onclick(evt);
            };
            confirmButton.valueIndex = index;
            confirmButton.innerText = "Löschen";
            confirmButton.className = "aBTN";

            // Setzen einer Bestätigungsabfrage.
            confirmText.innerHTML = "Bist du dir sich sicher, dass dieses Element gelöscht werden soll?";

            // Angabe einer kurzen Tabelle an Daten die gelöscht werden würden.
            const descExists = (positionen[index].typeOfDamage) ? true : false;
            // Initialisierung eben dieser Tabelle
            let infoTable = document.createElement("table");
            // Initialisierung und Setzung der ersten Reihe für Bezeichnungen.
            let headLine = document.createElement("tr");
            let eID = document.createElement("th");
            eID.innerText = "Element ID";
            headLine.appendChild(eID);
            let eTP = document.createElement("th");
            eTP.innerText = "Element Typ";
            headLine.appendChild(eTP);
            if (descExists) {
                let desc = document.createElement("th");
                desc.innerText = "Beschreibung";
                headLine.appendChild(desc);
            }
            infoTable.appendChild(headLine);
            // Initialisierung und Setzung der zweiten Reihe für Eingabe Daten.
            let dataRow = document.createElement("tr");
            let eID_data = document.createElement("td");
            eID_data.innerText = index;
            dataRow.appendChild(eID_data);
            let eTP_data = document.createElement("td");
            eTP_data.innerText = select.innerText;
            dataRow.appendChild(eTP_data);
            if (descExists) {
                let desc_data = document.createElement("td");
                desc_data.innerText = positionen[index].typeOfDamage;
                dataRow.appendChild(desc_data);
            }
            infoTable.appendChild(dataRow);

            // Hinzufügen aller elemente zum 'elements' Array in eben dieser Reihenfolge
            elements.push(confirmText);
            elements.push(document.createElement("br"));
            elements.push(infoTable);
            elements.push(document.createElement("br"));
            elements.push(confirmButton);

            // Rufen der Meldung anhand des Eingabe-Arrays 'elements'.
            throwAlert(elements);
        };
        // Setzen verschiedener Eigenschaften des Lösch-Knopfes
        dBTN.innerText = "X";
        dBTN.className = "aBTN deleteButton";
        del.appendChild(dBTN);
        child.appendChild(del);

        newChildren.push(child);
    }

    // Ersetzen der Tabelle durch die Inhalte aus dem Array 'newChildren', wobei der Anfänger 'firstChild' die Bezeichnungen darstellt.
    table.replaceChildren(firstChild);
    newChildren.forEach(c=>{
        table.appendChild(c);
    });
}