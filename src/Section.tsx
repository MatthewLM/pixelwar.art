import { Typography, Stack, Container } from "@mui/material";
import {ReactNode} from "react";

function Section(
  {
    title, desc, children
  } : {
    title: string,
    desc: ReactNode,
    children: ReactNode
  }
) {

  return (<Stack spacing={2}>
    <Typography variant="h4" align="center">
      {title}
    </Typography>
    <Container>{desc}</Container>
    <Container>{children}</Container>
  </Stack>);

}

export default Section;

