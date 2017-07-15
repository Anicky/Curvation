class Arrow {

    public fromX: number;
    private fromY: number;
    private toX: number;
    private toY: number;
    private direction: number;
    private headSize: number;
    private size: number;

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