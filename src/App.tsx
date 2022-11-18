import Carousel from './components/Carousel';
import { getImages } from './utils/images';

export default function App() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-tr from-slate-800 to-slate-600">
      <Carousel carouselImages={getImages()} />
    </div>
  );
}
