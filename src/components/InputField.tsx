import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Input } from '@chakra-ui/core';
import React from 'react';

interface InputFieldProps extends FormControlProps {
  label: string;
  name: string;
  placeholder: string;
  errorMessage?: string;
  type?: string;
}

const InputField = React.forwardRef((
  { label, name, placeholder, errorMessage, type, ...rest }: InputFieldProps,
  ref: any
) => {

  return (
    <FormControl isInvalid={errorMessage ? true : false} {...rest}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input ref={ref} id={name} name={name} type={type} placeholder={placeholder} />
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
})

export default InputField