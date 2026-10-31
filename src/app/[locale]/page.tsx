import { Hero } from "@/components/hero";
import { CategoryStrip } from "@/components/category-strip";
import { LanguageStrip } from "@/components/language-strip";
import { BookRow } from "@/components/book-row";
import { getDictionary } from "@/lib/i18n";
import { getFeaturedBooks, getBestSellers, getNewReleases, getOnSaleBooks, toCard, } from "@/lib/books";
import { Stats } from "@/components/stats";
import { NewsletterCta } from "@/components/newsletter-cta";
import { Reveal } from "@/components/reveal";
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const [featured, best, fresh, sale] = await Promise.all([
        getFeaturedBooks(8).catch(() => []),
        getBestSellers(10).catch(() => []),
        getNewReleases(10).catch(() => []),
        getOnSaleBooks(8).catch(() => []),
    ]);
    const heroPool = [...sale, ...best, ...fresh, ...featured].filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i);
    const heroBooks = heroPool.slice(0, 10).map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        price: Number(b.price),
        oldPrice: b.oldPrice ? Number(b.oldPrice) : null,
        discountPct: b.discountPct ?? 0,
        coverUrl: b.coverUrl ?? null,
    }));
    return (<div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6">
      <Hero books={heroBooks}/>

      <div className="mt-14 space-y-16">
        <Reveal><CategoryStrip /></Reveal>
        <Reveal><LanguageStrip /></Reveal>

        {best.length > 0 && (<Reveal><BookRow title={dict.home.bestSellers} subtitle={dict.home.bestSellersSub} href={`/${locale}/best-sellers`} books={best.map(toCard)}/></Reveal>)}

        {featured.length > 0 && (<Reveal><BookRow title={dict.home.featured} subtitle={dict.home.featuredSub} href={`/${locale}/books`} books={featured.map(toCard)}/></Reveal>)}

        {sale.length > 0 && (<Reveal><BookRow title={dict.home.offers} subtitle={dict.home.offersSub} href={`/${locale}/offers`} books={sale.map(toCard)}/></Reveal>)}

        {fresh.length > 0 && (<Reveal><BookRow title={dict.home.newReleases} subtitle={dict.home.newReleasesSub} href={`/${locale}/new-releases`} books={fresh.map(toCard)}/></Reveal>)}

        <Reveal><Stats /></Reveal>
        <Reveal><NewsletterCta /></Reveal>
      </div>
    </div>);
}
