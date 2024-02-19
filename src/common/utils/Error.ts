import { Field } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

interface ErrorType {
  message: string;
  type: string;
  error: string;
  code: number;
}

const graphQLFormattedError = (
  error,
  message: string = null,
  code: number = null,
) => {
  return {
    message:
      message ||
      error.extensions?.exception?.originalError?.message ||
      error.message,
    type: error.extensions?.code || 'SERVER_ERROR',
    error:
      error.extensions?.originalError?.name || error.name || 'Server Error',
    code: code || error.extensions?.originalError?.statusCode || 500,
  };
};
export function handelError(error: GraphQLFormattedError) {
  if (error.extensions?.code === 'FORBIDDEN') {
    return graphQLFormattedError(error);
  } else if (
    error.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
  ) {
    return graphQLFormattedError(
      error,
      'please provide the correct inputs',
      500,
    );
  } else {
    return graphQLFormattedError(error);
  }
}
