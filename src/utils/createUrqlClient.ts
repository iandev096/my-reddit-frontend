import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const // helps to send cookie. We need cookie for auth processes
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        // so when a a mutation happens, we handle it in the update hooks contained within Mutation
        // For example, in the case of a login or register mutation we make use of the of the query(MeDocument: MeQuery) that fetches the currently
        // authenticated user. With that we update the cache 
        Mutation: {
          login: (result: any, args, cache, info) => {
            /*cache.updateQuery({ query: MeDocument }, (data) => {
             if (!data) return data;
             // think of data as a key value pair structure that represents the graphql cache.
             // result is the result of the query. 
             // when I get the results, I manually updated the cache to with the new result. Otherwise, urql will depend on the cache value by default
             // urql dedups requests by default. That is why, we need this whole setup to force urql to keep this mutation always up to date.
              data.me = result.login.user;
              return data;
            });*/
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, query) => {
                if (_result.login.errors) {
                  return query
                } else {
                  return {
                    me: _result.login.user
                  }
                }
              }
            )
          },
          register: (result: any, args, cache, info) => {
            /*cache.updateQuery({ query: MeDocument }, (data) => {
             if (!data) return data;
             // think of data as a key value pair structure that represents the graphql cache.
             // result is the result of the query. 
             // when I get the results, I manually updated the cache to with the new result. Otherwise, urql will depend on the cache value by default
             // urql dedups requests by default. That is why, we need this whole setup to force urql to keep this mutation always up to date.
              data.me = result.register.user;
              return data;
            });*/
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, query) => {
                if (_result.register.errors) {
                  return query
                } else {
                  return {
                    me: _result.register.user
                  }
                }
              }
            )
          },
          logout: (result: any, args, cache, info) => {
            // cache.updateQuery({query: MeDocument}, data => {
            //   if (!data) return data;
            //   data.me = null;
            //   return data;
            // });
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, _query) => ({ me: null })
            )
          }
        }
      }
    }),
    ssrExchange,
    fetchExchange
  ],
});