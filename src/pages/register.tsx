import { Button, Stack } from "@chakra-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

const register: React.FC<registerProps> = ({}) => {
  const [, executeRegister] = useRegisterMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    errors,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formValues: RegisterFormValues) => {
    console.log(formValues);
    const res = await executeRegister({
      options: {
        username: formValues.username,
        password: formValues.password,
        email: formValues.email,
      },
    });
    const errors = res.data?.register.errors;
    const user = res.data?.register.user;
    console.log("resData", res.data?.register);
    if (errors && errors?.length > 0) {
      console.log(errors);
      errors.forEach((error) =>
        setError(error.field as keyof RegisterFormValues, {
          type: "server",
          message: error.message,
        })
      );
    }
    if (user) {
      console.log(user);
      router.push("/");
    }
  };

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <InputField
            ref={register()}
            name="username"
            label="Username"
            placeholder="Username"
            errorMessage={errors.username?.message}
          />
          <InputField
            ref={register()}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            errorMessage={errors.email?.message}
          />
          <InputField
            ref={register()}
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
            errorMessage={errors.password?.message}
          />
          <Button type="submit" variantColor="teal" isLoading={isSubmitting}>
            Register
          </Button>
        </Stack>
      </form>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(register);
