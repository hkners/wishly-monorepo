import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) return NextResponse.json({ error: 'URL gerekli' }, { status: 400 });

    let targetUrl = url;
    try {
      const urlObj = new URL(url);
      // For Amazon, keep only the path (which contains the ASIN) and remove query params
      if (urlObj.hostname.includes('amazon')) {
        targetUrl = `${urlObj.origin}${urlObj.pathname}`;
      } else {
        // For others, just remove tracking params if possible, or keep as is
        // Removing all params might break some sites, so let's be careful.
        // For now, just cleaning Amazon is the priority.
      }
    } catch (e) {
      // If URL parsing fails, use original
    }

    // 1. GÜÇLÜ HEADERS (Bot korumasını aşmak için)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/',
    };

    const response = await fetch(targetUrl, { headers });
    
    if (!response.ok) {
      if (response.status === 503 && targetUrl.includes('amazon')) {
         return NextResponse.json({ error: 'Amazon bot koruması aktif. Lütfen ürün bilgilerini manuel giriniz.' }, { status: 503 });
      }
      // Trendyol bazen 403 veya 429 dönerse
      return NextResponse.json({ error: 'Site botu engelledi, lütfen tekrar deneyin.' }, { status: 403 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Varsayılanlar
    let title = $('meta[property="og:title"]').attr('content') || $('title').text();
    let imageUrl = $('meta[property="og:image"]').attr('content');
    let price = null;

    // --- 1. TRENDYOL ÖZEL MANTIĞI ---
    if (targetUrl.includes('trendyol')) {
        // YÖNTEM A: JSON-LD (Google Verisi) - En Sağlamı
        try {
            $('script[type="application/ld+json"]').each((_, el) => {
                const content = $(el).html();
                if (content && (content.includes('"price"') || content.includes('"Price"'))) {
                    const json = JSON.parse(content);
                    // Yapı bazen dizi bazen obje gelir
                    const data = Array.isArray(json) ? json.find(item => item['@type'] === 'Product') : json;
                    
                    if (data && data.offers) {
                        const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
                        // Fiyat ve para birimini al
                        if (offer.price) {
                           price = `${offer.price} ${offer.priceCurrency || 'TL'}`;
                        }
                    }
                }
            });
        } catch (e) { console.log('Trendyol JSON-LD okunamadı'); }

        // YÖNTEM B: Regex (Eğer A çalışmazsa)
        if (!price) {
            // "discountedPrice":{"text":"259,99 TL"} yapısını arar
            const regex = /"discountedPrice"\s*:\s*\{\s*"text"\s*:\s*"([^"]+)"/i;
            const match = html.match(regex);
            if (match && match[1]) price = match[1];
            
            // Yedek Regex: sellingPrice
            if (!price) {
                const regexSelling = /"sellingPrice"\s*:\s*\{\s*"text"\s*:\s*"([^"]+)"/i;
                const matchSelling = html.match(regexSelling);
                if (matchSelling && matchSelling[1]) price = matchSelling[1];
            }
        }
        
        // Başlık Temizliği
        title = title.replace(' Fiyatı, Yorumları - Trendyol', '').trim();
    }

    // --- 2. AMAZON ÖZEL MANTIĞI ---
    else if (targetUrl.includes('amazon')) {
        // Başlık
        const amazonTitle = $('#productTitle').text().trim();
        if (amazonTitle) title = amazonTitle;

        // Görsel (Dynamic)
        const dynamicImage = $('#landingImage').attr('data-a-dynamic-image');
        if (dynamicImage) {
            try {
                const images = JSON.parse(dynamicImage);
                imageUrl = Object.keys(images)[0];
            } catch (e) {}
        }
        if (!imageUrl) imageUrl = $('#landingImage').attr('src');

        // Fiyat (Çift virgül düzeltmeli)
        const wholeRaw = $('.a-price .a-price-whole').first().text().trim();
        const fractionRaw = $('.a-price .a-price-fraction').first().text().trim();
        if (wholeRaw) {
            const wholeClean = wholeRaw.replace(/\D/g, ''); // Sadece rakamlar
            const fractionClean = fractionRaw.replace(/\D/g, '');
            price = `${wholeClean},${fractionClean || '00'} TL`;
        } else {
             price = $('#corePriceDisplay_desktop_feature_div .a-offscreen').first().text().trim();
        }
    }

    // --- 3. GENEL YEDEKLER (Tüm siteler için) ---
    // Eğer hala fiyat yoksa Open Graph Description'a bak
    if (!price) {
        const ogDesc = $('meta[property="og:description"]').attr('content');
        if (ogDesc) {
            // Metin içinden "1.200 TL" veya "1200TL" yapısını yakala
            const priceMatch = ogDesc.match(/(\d+[.,]\d+)\s?(TL|₺)/i);
            if (priceMatch) price = priceMatch[0];
        }
    }

    // Resim Yoksa
    if (!imageUrl) imageUrl = $('link[rel="image_src"]').attr('href');

    // SON TEMİZLİK
    if (price) {
        // HTML entity temizliği (&nbsp; gibi) ve boşluk temizliği
        price = price.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
        price = "Fiyat Görünmedi";
    }

    return NextResponse.json({
      title: title?.trim(),
      imageUrl,
      price,
      originalUrl: url
    });

  } catch (error) {
    console.error('Scrape Hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
