import {InputAdornment, TextField} from "@mui/material";
import {ChangeEvent, useCallback, useState} from "react";

/* eslint-disable max-lines-per-function */
function CoinInput(
  {
    label, defaultValue, optional, onChanged
  } : {
    label: string,
    defaultValue: string | null,
    optional: boolean,
    onChanged: (value: string | null) => void
  }
) {

  const [error, setError] = useState<string | null>(null);
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {

    const str = ev.target.value;

    function success() {
      setError(null);
      onChanged(str);
    }

    function fail(msg: string) {
      setError(msg);
      onChanged(null);
    }

    if (str == "")
      return optional ? success() : fail("Required");

    // Only contains 0-9 and .
    if (!(/^[0-9.]*$/u).test(str))
      return fail("Invalid number");

    const floatNum = Number.parseFloat(str);

    if (Number.isNaN(floatNum))
      return fail("Not a number");

    if (floatNum < 0.01)
      return fail("Minimum 0.01 PPC");

    if (floatNum > 100000)
      return fail("Maximum 100000 PPC");

    const decimalSplit = str.split(".");

    if (decimalSplit.length > 2)
      return fail("Too many decimal points");

    if (decimalSplit.length > 1 && decimalSplit[1].length > 6)
      return fail("Too many decimal places");

    return success();

  }, [optional, onChanged]);

  return <TextField
    label={label}
    variant="outlined"
    InputProps={{
      endAdornment: <InputAdornment position="end">PPC</InputAdornment>
    }}
    defaultValue={defaultValue}
    fullWidth
    onChange={handleChange}
    error={error !== null}
    helperText={error}
  />;

}

export default CoinInput;
