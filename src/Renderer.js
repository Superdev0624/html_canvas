function Renderer(width, height, images) {
    this.width = width;
    this.height = height;
    this.images = images;
}

Renderer.prototype.renderImage = function(container, bounds, borderData, image) {
    var paddingLeft = container.cssInt('paddingLeft'),
        paddingTop = container.cssInt('paddingTop'),
        paddingRight = container.cssInt('paddingRight'),
        paddingBottom = container.cssInt('paddingBottom'),
        borders = borderData.borders;

    this.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        bounds.left + paddingLeft + borders[3].width,
        bounds.top + paddingTop + borders[0].width,
        bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight),
        bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom)
    );
};

Renderer.prototype.renderBackground = function(container, bounds, borderData) {
    if (bounds.height > 0 && bounds.width > 0) {
        this.renderBackgroundColor(container, bounds);
        this.renderBackgroundImage(container, bounds, borderData);
    }
};

Renderer.prototype.renderBackgroundColor = function(container, bounds) {
    var color = container.css("backgroundColor");
    if (!this.isTransparent(color)) {
        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, container.css("backgroundColor"));
    }
};

Renderer.prototype.renderBorders = function(borders) {
    borders.forEach(this.renderBorder, this);
};

Renderer.prototype.renderBorder = function(data) {
    if (!this.isTransparent(data.color) && data.args !== null) {
        this.drawShape(data.args, data.color);
    }
};

Renderer.prototype.renderBackgroundImage = function(container, bounds, borderData) {
    var backgroundImages = container.parseBackgroundImages();
    backgroundImages.reverse().forEach(function(backgroundImage, index, arr) {
        switch(backgroundImage.method) {
            case "url":
                var image = this.images.get(backgroundImage.args[0]);
                if (image) {
                    this.renderBackgroundRepeating(container, bounds, image, arr.length - (index+1), borderData);
                } else {
                    log("Error loading background-image", backgroundImage.args[0]);
                }
                break;
            case "linear-gradient":
            case "gradient":
                var gradientImage = this.images.get(backgroundImage.value);
                if (gradientImage) {
                    this.renderBackgroundGradient(gradientImage, bounds, borderData);
                } else {
                    log("Error loading background-image", backgroundImage.args[0]);
                }
                break;
            case "none":
                break;
            default:
                log("Unknown background-image type", backgroundImage.args[0]);
        }
    }, this);
};

Renderer.prototype.renderBackgroundRepeating = function(container, bounds, imageContainer, index, borderData) {
    var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
    var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
    var repeat = container.parseBackgroundRepeat(index);
    switch (repeat) {
        case "repeat-x":
        case "repeat no-repeat":
            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, imageContainer.image.height, borderData);
            break;
        case "repeat-y":
        case "no-repeat repeat":
            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], imageContainer.image.width, 99999, borderData);
            break;
        case "no-repeat":
            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], imageContainer.image.width, imageContainer.image.height, borderData);
            break;
        default:
            this.renderBackgroundRepeat(imageContainer, position, size, {top: bounds.top, left: bounds.left}, borderData[3], borderData[0]);
            break;
    }
};

Renderer.prototype.isTransparent = function(color) {
    return (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)");
};
