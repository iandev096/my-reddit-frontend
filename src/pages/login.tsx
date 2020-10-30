import { Button, Stack } from '@chakra-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface LoginProps {
}

type LoginFormValues = {
  usernameOrEmail: string;
  password: string
}

const Login: React.FC<LoginProps> = ({ }) => {
  const [, executeLogin] = useLoginMutation();
  const router = useRouter();

  const { register, handleSubmit, errors, setError, formState: { isSubmitting } } = useForm<LoginFormValues>({
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  });

  const onSubmit = async (formValues: LoginFormValues) => {
    const res = await executeLogin({
      password: formValues.password,
      usernameOrEmail: formValues.usernameOrEmail
    });
    const errors = res.data?.login.errors;
    const user = res.data?.login.user;
    console.log('resData', res.data?.login)
    if (errors && errors?.length > 0) {
      console.log(errors)
      errors.forEach(error => setError(error.field as keyof LoginFormValues, {
        type: 'server',
        message: error.message
      }))
    }
    if (user) {
      console.log(user);
      router.push('/');
    }
  }

  return (
    <Wrapper variant='small'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <InputField
            ref={register()}
            name='usernameOrEmail'
            label='Username Or Email'
            placeholder='Username Or Email'
            errorMessage={errors.usernameOrEmail?.message}
          />
          <InputField
            ref={register()}
            name='password'
            label='Password'
            placeholder='Password'
            type='password'
            errorMessage={errors.password?.message}
          />
          <Button
            type='submit'
            variantColor='teal'
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);