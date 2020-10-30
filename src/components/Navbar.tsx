import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {
}

const Navbar: React.FC<NavbarProps> = ({ }) => {
  const [{ fetching: logoutFetching }, exLogout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });

  console.log('Me from Navbar', data);

  let body = null;
  if (fetching) {
    body = null;
    // data is loading
  } else if (!data?.me) {
    // user  not logged in
    body = (<>
      <NextLink href='/login'>
        <Link mr={2}>
          Login
        </Link>
      </NextLink>
      <NextLink href='/register'>
        <Link>Register</Link>
      </NextLink>
    </>)
  } else {
    console.log(data.me)
    body = (
      <Flex>
        <Box mr={2}>{data.me?.username}</Box>
        <Button isLoading={logoutFetching} onClick={() => exLogout()} variant='link'>Logout</Button>
      </Flex>
    )
  }
  console.log(data)
  return (
    <Flex
      bg='tan'
      p={4}
      ml='auto'
    >
      <Box ml='auto'>
        {body}
      </Box>
    </Flex>
  );
};

export default Navbar;