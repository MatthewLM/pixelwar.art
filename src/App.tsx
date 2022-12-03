import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Typography, Container, Paper, CssBaseline } from "@mui/material";
import FileSelect from "./FileSelect";
import GenerateForm from "./GenerateForm";
import { useState, useCallback } from "react";
import CanvasImage from "./CanvasImage";

enum Stage { FILE, FORM }

/* eslint-disable max-lines-per-function */
function App() {

  const [img, setImg] = useState<CanvasImage | null>(null);
  const [stage, setStage] = useState(Stage.FILE);

  const handleImage = useCallback((newImg: CanvasImage) => {
    setImg(newImg);
    setStage(Stage.FORM);
  }, []);

  const handleCancel = useCallback(() => {
    setImg(null);
    setStage(Stage.FILE);
  }, []);

  let content;
  if (stage === Stage.FILE)
    content = <FileSelect
      onNewImage={handleImage}
      endScreen={img !== null}
      onGoBack={() => setStage(Stage.FORM)}
    />;
  else if (img !== null)
    content = <GenerateForm
      img={img}
      onDone={() => setStage(Stage.FILE)}
      onCancel={handleCancel}
    />;

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: 10,
        marginBottom: 10
      }}
    >
      <CssBaseline/>
      <Typography variant="h3" marginBottom={5} align="center">
        Immutable.place Image to CSV
      </Typography>
      <Paper elevation={6} sx={{
        padding: 2
      }}>
        {content}
      </Paper>
    </Container>
  );

}

export default App;
