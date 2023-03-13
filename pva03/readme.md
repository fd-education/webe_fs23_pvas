## PVA 03: Game

### Was ist das Prinzip hinter der Darstellung der Items und des Avatars, wie kann ich diese optisch verändern
Prinzip SVG
Veränderungen durch DOM-Manipulationen am SVG-DOM

### Wie ist das Spielbrett aufgebaut? Wie wird ein leerer Punkt auf der Karte gefgunden? Was passiert, wenn ein Item oder der Avatar platziert wird?
Map ist ein zweidimensionales Array, das by default mit EMPTY (=4) Einträgen aus dem MapPositions Objekt gefüllt wird.
Die Platzierung des Spielers geschieht über random generierte Koordinatentupel. Wird der Spieler auf einem Feld platziert.
Die Platzierung der Items basiert auf derselben Logik. Dabei erhalten die Items noch eine ID (basierend auf einer fortlaufend inkrementierten Zahl).

### Es gibt bereits zwei Methoden, die vermutlich etwas mit der Bewegung anstellen. Was berücksichtigen und was liefern die Funktionen cmdMove und tryToMove?
cmdMove nimmt als Argument ein Objekt {dir: 'u' | 'd' | 'l' | 'r'} entgegen und übergibt dieses direkt an tryToMove. 
tryToMove verändert die x bzw. y Koordinate der Figur entsprechend der übergebenen Laufrichtung und validiert die neue Koordinate, 
damit sich die Figur nicht über den Spielfeldrand hinausbewegen kann.

### Mit den Methoden paintItems und paintScoreItems werden neue Elemente aus dem Nichts geschaffen. Erklärt, wie genau dies vonstatten geht.
Mit document.createElement werden neue Elemente kreiert und mit append an den HTML DOM angehängt.