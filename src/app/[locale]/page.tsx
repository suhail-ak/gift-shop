import { useTranslations } from 'next-intl';
import { dummyProducts } from '@/lib/dummy-data';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-xl">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
