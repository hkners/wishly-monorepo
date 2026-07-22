/**
 * Client-side Scraper for React Native
 * FAITHFUL PORT of web-backup/app/api/scrape/route.ts
 * Uses Regex and String parsing to mimic Cheerio logic for React Native
 */

interface ScrapedData {
    title: string;
    imageUrl: string | null;
    price: string | null;
    originalUrl: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedData> {
    try {
        let targetUrl = url;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('amazon')) {
                // Keep origin + pathname for Amazon, strip query params to avoid tracking noise
                targetUrl = `${urlObj.origin}${urlObj.pathname}`;
            }
        } catch (e) { /* ignore */ }

        // 1. HEADERS (Matching backup)
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://www.google.com/',
        };

        const response = await fetch(targetUrl, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();

        // 2. Extraction Logic
        let title: string | null = null;
        let imageUrl: string | null = null;
        let price: string | null = null;

        // --- COMMON META TAGS (Cheerio replacements) ---
        const getMetaContent = (prop: string) => {
            const regex = new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i');
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        title = getMetaContent('og:title');
        if (!title) {
            const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
            if (titleMatch) title = titleMatch[1];
        }

        imageUrl = getMetaContent('og:image');

        // --- TRENDYOL LOGIC ---
        if (targetUrl.includes('trendyol')) {
            // A. JSON-LD Strategy
            try {
                // Find scripts with type application/ld+json
                const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
                let match;
                while ((match = jsonLdRegex.exec(html)) !== null) {
                    try {
                        const json = JSON.parse(match[1]);
                        const items = Array.isArray(json) ? json : [json];
                        const product = items.find((i: any) => i['@type'] === 'Product');

                        if (product && product.offers) {
                            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
                            if (offer.price) {
                                // Trendyol sometimes sends number (123.45) or string ("123.45")
                                price = `${offer.price} ${offer.priceCurrency || 'TL'}`;
                            } else if (offer.priceSpecification && offer.priceSpecification.price) {
                                // Alternate schema
                                price = `${offer.priceSpecification.price} ${offer.priceSpecification.priceCurrency || 'TL'}`;
                            }
                        }
                    } catch (e) { /* continue */ }
                }
            } catch (e) { console.log('Trendyol JSON-LD error'); }

            // B. Regex Fallback
            if (!price) {
                const discountedRegex = /"discountedPrice"\s*:\s*\{\s*"text"\s*:\s*"([^"]+)"/i;
                const m1 = html.match(discountedRegex);
                if (m1) price = m1[1];

                if (!price) {
                    const sellingRegex = /"sellingPrice"\s*:\s*\{\s*"text"\s*:\s*"([^"]+)"/i;
                    const m2 = html.match(sellingRegex);
                    if (m2) price = m2[1];
                }
            }

            if (title) title = title.replace(' Fiyatı, Yorumları - Trendyol', '').trim();
        }
        // --- AMAZON LOGIC ---
        else if (targetUrl.includes('amazon')) {
            if (title) title = title.split(' : Amazon')[0].trim();

            // Image from dynamic content
            const dynamicImgMatch = html.match(/data-a-dynamic-image="([^"]+)"/);
            if (dynamicImgMatch) {
                try {
                    const images = JSON.parse(dynamicImgMatch[1].replace(/&quot;/g, '"'));
                    imageUrl = Object.keys(images)[0];
                } catch (e) { }
            }

            // Price
            // 1. Whole + Fraction (Improved Regex)
            const wholeRegex = /<span[^>]*class=["'][^"']*a-price-whole[^"']*["'][^>]*>([\s\S]*?)<\/span>/i;
            const fractionRegex = /<span[^>]*class=["'][^"']*a-price-fraction[^"']*["'][^>]*>([\s\S]*?)<\/span>/i;

            const wholeMatch = html.match(wholeRegex);
            const fractionMatch = html.match(fractionRegex);

            if (wholeMatch) {
                // Strip all tags and non-digits from the captured group
                const wholeClean = wholeMatch[1].replace(/<[^>]*>/g, '').replace(/\D/g, '');
                let fractionClean = '00';

                if (fractionMatch) {
                    fractionClean = fractionMatch[1].replace(/<[^>]*>/g, '').replace(/\D/g, '');
                }

                if (wholeClean) {
                    price = `${wholeClean},${fractionClean} TL`;
                }
            }

            // 2. Offscreen
            if (!price) {
                const offscreenRegex = /<span[^>]*class=["'][^"']*a-offscreen[^"']*["'][^>]*>([^<]+)<\/span>/i;
                const offscreenMatch = html.match(offscreenRegex);
                if (offscreenMatch) price = offscreenMatch[1];
            }
        }

        // --- GENERIC FALLBACKS ---
        if (!price) {
            const ogDesc = getMetaContent('og:description') || "";
            // Look for patterns like "1.200 TL" or "1200TL"
            const priceMatch = ogDesc.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(TL|₺|USD|EUR|\$|€|£)/i);
            if (priceMatch) {
                price = priceMatch[0];
            }
        }

        if (!imageUrl) {
            const linkImageMatch = html.match(/<link rel="image_src" href="([^"]*)"/i);
            if (linkImageMatch) imageUrl = linkImageMatch[1];
        }

        // --- CLEANUP ---
        if (price) {
            price = price.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            // Decode entities in price if any
            price = decodeHTMLEntities(price);
        }

        if (title) {
            title = decodeHTMLEntities(title).trim();
        }

        return {
            title: title || "New Link",
            imageUrl: imageUrl,
            price: price,
            originalUrl: url
        };

    } catch (error) {
        console.error("Scrape error:", error);
        return {
            title: "Link",
            imageUrl: null,
            price: null,
            originalUrl: url
        };
    }
}

function decodeHTMLEntities(text: string) {
    if (!text) return "";
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'");
}
