class Tile {
    constructor(index){
        this.x = x;
        this.y = y;
        this.size = random(3,20);
    
     
    }
 
    display(){
        this.random = tileArray[Math.floor(Math.random()*tileArray.length)];
        image(this.random, this.x, this.y, this.size, this.size);
    }
    update(){
      
    }
}