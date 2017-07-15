interface Drawer {

    init();
    preprocess();
    drawPoint(entity);
    drawArrow(entity, color);
    drawCurve(entities, color);
    postprocess();
}

export = Drawer;