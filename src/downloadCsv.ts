import {P2putPixelAddrGenerator} from "coin-canvas-lib";
import saveAs from "file-saver";
import JSZip from "jszip";
import CanvasImage from "./CanvasImage";

const DONATION_ADDR = "pc1qkh79pe0vjr90llf4nz6kgq2eusnc86k0dxsv4u";
const MAX_OUTPUTS = 500;

const prefix = [0xc7, 0x66, 0xce, 0xc1, 0xef];
const testNetGen = new P2putPixelAddrGenerator("tpc", prefix);
const prodNetGen = new P2putPixelAddrGenerator("pc", prefix);

/* eslint-disable max-lines-per-function */
export default function downloadCsv(
  {
    img, prod, startX, startY, amount, donation
  } : {
    img: CanvasImage,
    prod: boolean,
    startX: number,
    startY: number,
    amount: string,
    donation: string
  }
) {

  // Generate CSV data into string array with up-to MAX_OUTPUTS per element
  // address, amount, label

  const csvs: Array<string> = [""];
  let currentRows = 0;

  for (const pixColour of img.pixColours) {

    // Ensure that the first CSV has room for the donation at the end
    const maxRows = (csvs.length == 1 && donation != "")
      ? MAX_OUTPUTS - 1 : MAX_OUTPUTS;

    if (currentRows == maxRows) {
      csvs.push("");
      currentRows = 0;
    }

    const pixX = startX + pixColour.coord.x;
    const pixY = startY + pixColour.coord.y;

    const generator = prod ? prodNetGen : testNetGen;
    const address = generator.forPixelColour(
      { x: pixX, y: pixY }, pixColour.colourId
    );
    const colourName = pixColour.colour.name;
    const capitalColour = colourName.charAt(0).toUpperCase() + colourName.slice(1);

    let row = `${address},`;
    row += `${amount},`;
    row += `"Pixel (${pixX}, ${pixY}) ${capitalColour}"\n`;

    csvs[csvs.length - 1] += row;
    currentRows++;

  }

  if (donation != "") {
    // Add Donation to end of first CSV
    // Placed at end to avoid problems with amounts on some versions of the
    // flutter app
    csvs[0] += `${DONATION_ADDR}, ${donation}, "PixelWar.art Donation"`;
  }

  const nameStart = `${img.name}_${startX}_${startY}`;
  const blobs = csvs.map(csv => new Blob([csv], { type: "text/csv" }));

  if (blobs.length == 1) {
    // Download as a single file
    saveAs(blobs[0], `${nameStart}.csv`);
  } else {
    // Save all files in a ZIP

    const zip = new JSZip();
    blobs.forEach(
      (blob, i) => zip.file(
        `${nameStart}.part${String(i+1).padStart(3, "0")}.csv`,
        blob
      )
    );

    zip.generateAsync({
      compression: "DEFLATE",
      type: "blob"
    })
      .then(blob => saveAs(blob, `${nameStart}.zip`))
      // Hopefully this never happens
      .catch(err => console.log(err));

  }

}

