import { getIpfsUrl } from '@/configs/getUrl'
import { request } from '@/utils/request'

interface Metadata {
  image?: string
}

const fetchMetadataFromUrl = async (url: string) => {
  let metadata = {}
  try {
    const data = await request(
      {
        url: getIpfsUrl(url || 'NULL'),
        method: 'GET',
      },
      false,
      false,
    )
    metadata = data?.data || {}
  } catch (err) {
    console.error(err)
  }
  return metadata as Metadata
}

export { fetchMetadataFromUrl }
