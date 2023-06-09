const getIpfsUrl = (url: string) => {
  if (url.includes('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.split('ipfs://')[1]}`
  }
  return url
}

export { getIpfsUrl }
