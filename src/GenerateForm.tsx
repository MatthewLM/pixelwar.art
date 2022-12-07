import { Stack, ButtonGroup, Button, Grid } from "@mui/material";
import "./GenerateForm.css";
import Section from "./Section";
import { useCallback, useRef, useEffect, useState } from "react";
import PositionInput from "./PositionInput";
import CoinInput from "./CoinInput";
import downloadCsv from "./downloadCsv";
import CanvasImage from "./CanvasImage";

/* eslint-disable max-lines-per-function */
function GenerateForm(
  {
    img, onDone, onCancel
  } : {
    img: CanvasImage,
    onDone: () => void,
    onCancel: () => void
  }
) {

  const [prod, setProd] = useState(true);
  const [x, setX] = useState<number>(Number.NaN);
  const [y, setY] = useState<number>(Number.NaN);
  const [amount, setAmount] = useState<string | null>("0.01");
  const [donation, setDonation] = useState<string | null>("");

  const generate = useCallback(() => {
    if (amount === null || donation === null) return;
    downloadCsv({
      img, prod,
      startX: x, startY: y,
      amount, donation
    });
    onDone();
  }, [onDone, img, prod, x, y, amount, donation]);

  const previewImg = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = previewImg.current;
    if (canvas === null) return;

    canvas.width = img.imgData.width;
    canvas.height = img.imgData.height;

    const idealWidth = canvas.width*4;
    const idealHeight = canvas.height*4;
    const ratio = idealWidth/idealHeight;

    const maxWidth = Math.min(idealWidth, 500);
    const maxHeight = Math.min(idealHeight, 500);

    let height, width;

    if (maxHeight*ratio > 500) {
      // Use max width
      width = maxWidth;
      height = maxWidth / ratio;
    } else {
      // Use max height
      width = maxHeight*ratio;
      height = maxHeight;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx?.putImageData(img.imgData, 0, 0);

  }, [img]);

  let desc = "Select the top-left position for the image to be painted and the amount to spend on each pixel in PPC. Click Generate CSV when you are ready to download the CSV.";

  if (prod)
    desc += " You may optionally provide a donation to the author of this tool in PPC or leave blank for no donation.";

  return <Section title="Generate CSV" desc={desc}>
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <canvas className="preview-canvas" ref={previewImg}/>
      <ButtonGroup>
        <Button
          variant={prod ? "contained" : "outlined"}
          onClick={() => setProd(true)}
        >Production</Button>
        <Button
          variant={prod ? "outlined" : "contained"}
          onClick={() => setProd(false)}
        >Testnet</Button>
      </ButtonGroup>
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12} sm={6}>
          <PositionInput
            label="X Position" maxValue={1000 - img.imgData.width}
            onChanged={setX}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PositionInput
            label="Y Position" maxValue={1000 - img.imgData.height}
            onChanged={setY}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CoinInput
            label="Amount Per Pixel"
            defaultValue={amount}
            optional={false}
            onChanged={setAmount}
          />
        </Grid>
        { prod ? <Grid item xs={12} sm={6}>
          <CoinInput
            label="Donation"
            defaultValue=""
            optional={true}
            onChanged={setDonation}
            helperText="All donations are much appreciated"
          />
        </Grid> : null
        }
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={generate}
          disabled={
            Number.isNaN(x) || Number.isNaN(y)
            || amount === null || donation === null
          }
        >
          Generate CSV
        </Button>
      </Stack>
    </Stack>
  </Section>;

}

export default GenerateForm;

