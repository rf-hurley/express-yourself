class Sprite {
    constructor(animation, x, y, size, speed) {
        this.animation = animation;
        this.size = size;
        this.x = x;
        this.y = y;
        this.len = this.animation.length;
        this.speed = speed;
        this.index = 0;
       
    }

    show(volume) {
        if(this.size > 100){
            console.log(this);
        }
        if(volume != undefined){
            this.size = volume;
            // this.x = x - this.size/2;
            // this.y = y - this.size/2;
        }
        image(this.animation[this.index % this.len], this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }

    update() {
        this.index += this.speed;
    }
}