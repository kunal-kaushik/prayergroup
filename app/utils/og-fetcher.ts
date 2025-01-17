import ogs from 'open-graph-scraper';

interface OpenGraphImage {
  url?: string;
}

export async function fetchOpenGraphData(url: string) {
  const options = { url };
  const { result } = await ogs(options);

  return {
    ogTitle: result.ogTitle || null,
    ogDescription: result.ogDescription || null,
    ogImageUrl: Array.isArray(result.ogImage)
      ? (result.ogImage[0] as unknown as OpenGraphImage)?.url || null // Convert to `unknown` first, then `OpenGraphImage`
      : (result.ogImage as unknown as OpenGraphImage)?.url || null,
  };
}
