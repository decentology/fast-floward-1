class Picture {
  constructor(pixels) {
    this.pixels = pixels;
  }
  pixelAt(index) {
    return this.pixels.charAt(index);
  }
  togglePixelAt(index, brush = null) {
    let nextPixel = brush;
    if (!brush) {
      nextPixel = (
        this.pixels[index] === Picture.offPixel
        ? Picture.onPixel
        : Picture.offPixel
      );
    }
    return new Picture((
      this.pixels.slice(0, index)
      + nextPixel
      + this.pixels.slice(index + 1, this.pixels.length)
    ));
  }
}

Picture.offPixel = '0';
Picture.onPixel = '1';

export default Picture;