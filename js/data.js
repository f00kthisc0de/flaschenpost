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
        if (dT) {
            this.drawingToolUsed = dT;
            if (dT == "3") {
                // Bei verwendung eines 'Großflächigen Schadens' wird ebenfalls ein Durchmesser dessen Kreises gespeichert.
                this.ellipseDiameter = parseInt(document.getElementById("ellipseD").value);
            }
        }
    }
}