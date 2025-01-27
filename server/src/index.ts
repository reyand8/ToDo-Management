import path from 'path';
import fs from 'fs';
import { ApolloServer } from 'apollo-server';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import { IQuery } from './interfaces/Query.interface';
import { IMutation } from './interfaces/Mutation.interface';
import { createErrorResponse } from './resolvers/utils/responseUtils';


const resolvers: { Query: IQuery, Mutation: IMutation} = {
    Query,
    Mutation,
};

/**
 * Apollo Server initialization.
 * - Loads type definitions from schema.graphql.
 * - Defines resolvers for queries and mutations.
 * - Configures custom error formatting for the response.
 * - Sets up the response formatting to handle HTTP status codes based on errors.
 */
const server: ApolloServer = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    formatError: (err:  any): any => {
        return createErrorResponse(err);
    },
    formatResponse: (response: any) => {
        const { errors } = response
        if (errors && errors.length > 0) {
            const firstError = errors[0];
            const status: number =
                firstError.extensions?.code === 'VALIDATION_ERROR' ? 400
                    : firstError.extensions?.code === 'NOT_FOUND_ERROR' ? 404
                        : 500;
            response.http = {
                status,
                headers: [],
            };
        }
        return response;
    },
});


server.listen().then(({ url }): void => {
    console.log(`Server is running on ${url}`);
});
