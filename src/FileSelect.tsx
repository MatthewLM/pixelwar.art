import { Stack, Button, Typography } from "@mui/material";
import Section from "./Section";
import { useState, useCallback, Fragment } from "react";
import CanvasImage from "./CanvasImage";

const MAX_SIDE = 250;

/* eslint-disable max-lines-per-function */
function FileSelect(
  {
    endScreen, onNewImage, onGoBack
  } : {
    endScreen: boolean,
    onNewImage: (newImgData: CanvasImage) => void,
    onGoBack: () => void
  }
) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletLink = <Fragment>
    <a href="https://www.peercoin.net/wallet#mobilewallet">
      flutter&nbsp;peercoin&nbsp;wallet
    </a>{" "}
  </Fragment>;

  const title = endScreen ? "Complete" : "Select Image";
  const desc = endScreen
    ? <Typography variant="body1">
      One or more CSV files should be provided as a download. You can use the
      {" "}{walletLink}
      to send payment to the required pixel addresses by selecting "Import
      from CSV".
    </Typography>
    : <Typography variant="body1">
      This tool will convert an image into a CSV file that can be used with the{" "}
      {walletLink} to paint the image onto the{" "}
      <a href="https://immutable.place">immutable.place</a> canvas.
      Start by selecting an image with the correct size upto 100x100. Colours
      will be converted to the closest immutable.place colour and transparent
      pixels will be ignored.
    </Typography>;

  const fileButtonTxt = endScreen ? "Select New File" : "Select File";

  const handleFile = useCallback(async (ev: React.ChangeEvent<HTMLInputElement>) => {

    const {files} = ev.target;
    if (files === null || files.length == 0) return;
    const [file] = files;

    setLoading(true);

    const img = await CanvasImage.fromFile(file);
    const {imgData} = img;

    if (imgData.height > MAX_SIDE || imgData.width > MAX_SIDE) {
      setError(`Images cannot exceed ${MAX_SIDE}x${MAX_SIDE}`);
      setLoading(false);
      return;
    }

    onNewImage(img);

    setError(null);
    setLoading(false);

  }, [onNewImage]);

  return <Section title={title} desc={desc}>
    {
      error === null
        ? null
        : <Typography variant="body1" textAlign="center" marginBottom={2} color="red">
          {error}
        </Typography>
    }
    <Stack direction="row" spacing={2} justifyContent="center">
      { endScreen ? <Button variant="outlined" onClick={onGoBack}>Go Back</Button> : null }
      <Button variant="contained" component="label" disabled={loading}>
        {fileButtonTxt}
        <input type="file" accept="image/*" hidden onChange={handleFile}/>
      </Button>
    </Stack>
  </Section>;

}

export default FileSelect;

