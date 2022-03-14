// Klasse zur Angabe einer Datenstruktur für z.B. 'Positionen' relativ zum Ursprungspunkt P(0, 0) in der oberen linken Ecke des 'bully.png'.
class Vector {
    constructor(x, y) {
        // Initialisiere das Objekt mit attributen x und y.
        this.x = x;
        this.y = y;
    }

    // Statische Addition zweier 'Vector' Objekte anhand derer x und y attribute.
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    // Addiere die x und y attribute des 'Vector' Objekts 'other' zu denen dieses Objekts.
    add(other) {
        this.x+=other.x;
        this.y+=other.y;
    }

    // Statische Subtraktion zweier 'Vector' Objekte anhand derer x und y attribute.
    static sub(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    // Subtrahiere die x und y attribute des 'Vector' Objekts 'other' von denen dieses Objekts.
    sub(other) {
        this.x-=other.x;
        this.y-=other.y;
    }

    // Statische Multiplikation zweier 'Vector' Objekte anhand derer x und y attribute.
    static mult(a, b) {
        return new Vector(a.x * b.x, a.y * b.y);
    }

    // Multipliziere die x und y attribute dieses Objekts mit denen des 'Vector' Objekts 'other'.
    mult(x) {
        this.x*=x;
        this.y*=x;
    }

    // Statische Division zweier 'Vector' Objekte anhand derer x und y attribute.
    static div(a, b) {
        return new Vector(a.x / b.x, a.y / b.y);
    }

    // Dividiere die x und y attribute dieses Objekts mit denen des 'Vector' Objekts 'other'.
    div(x) {
        this.x/=x;
        this.y/=x;
    }

    // Erstelle ein neues 'Vector' Objekt mit den selben Werten für dessen attributen wie denen dieses Objekts und gebe dieses neue Objekt zurück.
    copy() {
        return new Vector(this.x, this.y);
    }

    // Erstelle eine 'String' repräsentation dieses Objekts.
    toString() {
        return Math.floor(this.x)+", "+Math.floor(this.y);
    }
}