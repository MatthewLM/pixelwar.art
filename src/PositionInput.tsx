import {TextField} from "@mui/material";
import {ChangeEvent, useCallback, useState} from "react";

/**
 * onChanges gives a NaN if there is an error
 */
function PositionInput(
  {
    label, maxValue, onChanged
  } : {
    label: string,
    maxValue: number
    onChanged: (value: number) => void
  }
) {

  const [error, setError] = useState(false);
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const str = ev.target.value;
    const number = Number.parseInt(str, 10);
    const isError = !(/^[0-9]*$/u).test(str)
      || Number.isNaN(number)
      || number < 0
      || number > maxValue;
    setError(isError);
    onChanged(isError ? Number.NaN : number);
  }, [maxValue, onChanged]);

  return <TextField
    label={label}
    variant="outlined"
    fullWidth
    onChange={handleChange}
    error={error}
    helperText={ error ? `Must be 0 - ${maxValue}` : null }
  />;

}
export default PositionInput;
