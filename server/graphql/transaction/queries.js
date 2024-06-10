export const queries = `#graphql
    transactions: [Transaction!]
    transaction(transactionId:ID!): Transaction
    categoryStatistics: [CategoryStatistics!]
`;
