import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CategorySection } from '../components/CategorySection';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
    </main>
  );
}
