/**
 * Created by TastyBitch on 31/08/2015.
 */
// @TODO: intégrer l'objet BONUS à la map
var Item = function (effect, x, y) {
    this.icon = null;
    this.x = x;
    this.y = y;
    this.effect = effect;
    this.color = null;

    var init = function (x, y, effect) {
        if (x === undefined) {
            this.x = setRandomX();
        }
        if (y === undefined) {
            this.y = setRandomY();
        }
        if (effect === undefined) {
            this.effect = setRandomEffect();
        }
        this.icon = "effect_" + this.effect;
        this.color = "#AAEEDD";
    };

    var draw = function (interpolationPercentage) {
        context.fillStyle = this.color;
    };

    return {
        icon: this.icon,
        x: this.x,
        y: this.y,
        effect: this.effect,
        color: this.color,
        init: init,
        draw: draw
    };
};