function createVector() {
  
    var HeightMid = 290;
    var WidthMid = -265;
    var iX = indexFingerX;
    var iY = indexFingerY;
    distanceX = indexFingerX - WidthMid;
    distanceY = -indexFingerY + HeightMid;

    magnitude = Math.sqrt(distanceX*distanceX +
                          distanceY*distanceY);
    angle = Math.atan2(distanceY, distanceX);
    //console.log(`Atan2: ${angle*180/Math.PI}`);

    normalizedX = (indexFingerX+540)/430;
    normalizedY = (indexFingerY-170)/220;
}