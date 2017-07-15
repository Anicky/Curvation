class Arrow {

    public fromX: number;
    public fromY: number;
    public toX: number;
    public toY: number;
    public direction: number;
    public headSize: number;
    public size: number;

    constructor(fromX: number, fromY: number, toX: number, toY: number, direction: number, headSize: number, size: number) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.direction = direction;
        this.headSize = headSize;
        this.size = size;
    }
}

export = Arrow;