import { notFound } from 'next/navigation';
import Image from 'next/image';
import { dummyProducts } from '@/lib/dummy-data';
import AddToCartButton from '@/components/product/AddToCartButton';

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params;
  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const name = product.name[locale as keyof typeof product.name];
  const description = product.description[locale as keyof typeof product.description];

  return (
    <div className="grid md:grid-cols-2 gap-8 py-8">
      <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-muted-foreground">{description}</p>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
