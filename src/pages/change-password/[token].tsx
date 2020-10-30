import { Stack, Button, FormHelperText } from "@chakra-ui/core";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";

interface ChangePasswordProps {
  token: string;
}

type ChangePasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};
const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const [{}, exChangePassword] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    watch,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  const validatePasswords = () => {
    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");

    if (newPassword === confirmPassword) {
      clearErrors("confirmPassword");
    } else {
      setError("confirmPassword", { message: "Passwords do not match" });
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const res = await exChangePassword({
      token,
      newPassword: data.newPassword,
    });
    const errors = res.data?.changePassword.errors;
    const user = res.data?.changePassword.user;

    if (errors) {
      console.log(errors);
      errors.forEach((error) => {
        if (error.field.includes("token")) {
          setTokenError(error.message);
        }
        if (error.field === "newPassword")
          setError(error.field, {
            type: "server",
            message: error.message,
          });
      });
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
            ref={register({ required: true, minLength: 5 })}
            name="newPassword"
            label="New Password"
            placeholder="New Password"
            type="password"
            errorMessage={errors.newPassword?.message}
          />
          <InputField
            ref={register({ required: true, minLength: 5 })}
            name="confirmPassword"
            onChange={validatePasswords}
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            errorMessage={errors.confirmPassword?.message}
          />
          {tokenError && <FormHelperText>{tokenError}</FormHelperText>}
          <Button type="submit" variantColor="teal" isLoading={isSubmitting}>
            Change Password
          </Button>
        </Stack>
      </form>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      token: query.token,
    },
  };
};

export default ChangePassword;
