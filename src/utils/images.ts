import image1 from '../assets/img-1.jpg';
import image2 from '../assets/img-2.jpg';
import image3 from '../assets/img-3.jpg';
import image4 from '../assets/img-4.jpg';
import image5 from '../assets/img-5.jpg';
import image6 from '../assets/img-6.jpg';
import image7 from '../assets/img-7.jpg';
import image8 from '../assets/img-8.jpg';
import image9 from '../assets/img-9.jpg';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];

export function getImages() {
  return Object.values(images);
}
