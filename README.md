# Vesper JWT Auth

[![Build Status](https://travis-ci.org/constlab/vesper-jwt-auth.svg?branch=master)](https://travis-ci.org/constlab/vesper-jwt-auth)

## Early access. Not for production use

## Initial setup

1. `npm i @constlab/vesper-jwt-auth`
2. Add `AuthModule` to bootstrap
3. Add `UserRepository` to DI container
4. Add authorization checker function
5. Add salt to parameters (see https://github.com/vesper-framework/vesper/blob/master/src/options/SchemaBuilderOptions.ts#L85)

 ```typescript
 import { AuthModule, jwtAuthorizationCheck } from "@constlab/vesper-jwt-auth";
 
 bootstrap({
	port: 3000,
	parameters: {
		"salt": "<random string>"
	},
	modules: [AuthModule, UserModule],
	setupContainer: async (container, action) => {
		container.set("user.repository", getRepository(User));
	},
	authorizationChecker: (roles: string[], action) => jwtAuthorizationCheck(roles, action)
});
 ```
