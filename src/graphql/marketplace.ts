import { gql } from '@apollo/client';

const GET_ALL_ACTIVE_LISTING = (first: number = 10, skip: number = 0) => gql`
  query {
    marketplaces(first: ${first}, skip: ${skip}, where: { status: LISTING }) {
      id
      name
      contractType
      nftAddress
      tokenId
      tokenUri
      erc20Address
      price
      quantity
      status
      lister
      buyer
    }
  }
`;

export { GET_ALL_ACTIVE_LISTING };
