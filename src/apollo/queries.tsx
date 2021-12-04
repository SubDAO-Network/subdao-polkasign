import { gql } from '@apollo/client'

export const GET_CONTRACTS_LIST = (creator = '', signer = '', status = "[2,1,0]", page = 0, size = 5, order = 'desc') => {
  let queryString = `
    query {
      agreementInfos(filter: {
        creator: "${creator}",
        signer: "${signer}",
        status: ${status}
      },
      page: {
        page: ${page},
        size: ${size},
        sortField: "index",
        order: "${order}"
      }){
        page,
        size,
        total,
        data {
          index,
          creator,
          name,
          create_at,
          status,
          signers,
          agreement_file,
          sign_infos,
          resources,
          txId
        }
      }
    }
  `
  return gql(queryString)
}

export const GET_CONTRACTS_LIST_MY = (creator = '', signer = '', status = "[2,1,0]", page = 0, size = 5, order = 'desc') => {
  let queryString = `
    query {
      agreementInfos(filter: {
        creator: "${creator}",
        signer: "${signer}",
        status: ${status}
      },
      page: {
        page: ${page},
        size: ${size},
        sortField: "index",
        order: "${order}"
      }){
        page,
        size,
        total,
        data {
          index,
          creator,
          name,
          create_at,
          status,
          signers,
          agreement_file,
          sign_infos,
          resources
        }
     }
    }
  `
  return gql(queryString)
}
