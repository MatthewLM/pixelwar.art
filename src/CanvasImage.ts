import {Colour, PixelColour} from "coin-canvas-lib";

export default class CanvasImage {
  imgData: ImageData;
  pixColours: PixelColour[] = [];
  name: string;

  constructor(imgData: ImageData, name: string) {

    const {data} = imgData;

    function diff(i: number, c: Colour) {
      return Math.abs(data[i*4] - c.red)
      + Math.abs(data[i*4+1] - c.green)
      + Math.abs(data[i*4+2] - c.blue);
    }

    for (let y = 0; y < imgData.height; y++) {
      for (let x = 0; x < imgData.width; x++) {

        const i = y*imgData.width + x;

        // If alpha is <50% then do not include this pixel
        if (data[i*4+3] < 128) {
          data[i*4+3] = 0;
        } else {

          // Get closest colour in coin canvas pallete
          const [colour] = Colour.palette.sort((a, b) => diff(i, a) - diff(i, b));

          // Fill in the immutable.place colour
          data[i*4] = colour.red;
          data[i*4+1] = colour.green;
          data[i*4+2] = colour.blue;
          data[i*4+3] = 0xff; // Full alpha

          // Record the colour and coordinate within the image
          this.pixColours.push(
            new PixelColour({ x, y }, colour.id)
          );

        }

      }
    }

    this.imgData = imgData;
    this.name = name;

  }

  static fromFile(file: File): Promise<CanvasImage> {
    return new Promise((resolve) => {

      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
        if (ctx === null) return;
        ctx.drawImage(img, 0, 0);
        resolve(
          new CanvasImage(
            ctx.getImageData(0, 0, img.width, img.height),
            file.name.replace(/\.[^/.]*$/u, "")
          )
        );
      };

      img.src = url;

    });
  }

}
