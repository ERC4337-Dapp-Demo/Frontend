import { request } from "@/utils/request";
import { getIpfsUrl } from "@/configs/getUrl";

interface Metadata {
  image?: string;
}

const fetchMetadataFromUrl = async (url: string) => {
  let metadata = {};
  try {
    const data = await request(
      {
        url: getIpfsUrl(url ? url : "NULL"),
        method: "GET",
      },
      false,
      false
    );
    metadata = data?.data || {};
  } catch (err) {}

  return metadata as Metadata;
};

export { fetchMetadataFromUrl };
