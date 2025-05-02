/**
 * @file HomePage.jsx
 * @description Page d’accueil avec carrousel d’albums, aperçu du portfolio, derniers articles et dernières photos.
 */
import React from 'react';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { NavLink, Link } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';
import { useArticles } from '../../hooks/useArticles';

// Imports pour le carrousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Arrow({ className, style, onClick, position }) {
  // position = { left, right, top, transform, fontSize, zIndex }
  return (
    <div
      className={className}
      style={{ ...style, ...position }}
      onClick={onClick}
    />
  );
}

const albumArrowPos = {
  next: { right: '20px', top: '50%', transform: 'translateY(-50%)' },
  prev: { left: '20px',  top: '50%', transform: 'translateY(-50%)', zIndex: 1 },
};
const articleArrowPos = {
  next: { right: '-20px', top: '60%', transform: 'translateY(-60%)', fontSize: '2rem' },
  prev: { left: '-20px',  top: '60%', transform: 'translateY(-60%)', fontSize: '2rem', zIndex: 1 },
};

export default function HomePage() {
  const { albums, isLoading: loadingAlbums, error: errorAlbums } = useAlbums();
  const { articles, isLoading: loadingArticles, error: errorArticles } = useArticles();

  if (loadingAlbums || loadingArticles) {
    return <div className="text-center text-white mt-4">Chargement...</div>;
  }
  if (errorAlbums) {
    return <div className="text-center text-red-400 mt-4">{errorAlbums.message}</div>;
  }
  if (errorArticles) {
    return <div className="text-center text-red-400 mt-4">{errorArticles.message}</div>;
  }

  // Carousel Albums settings
  const albumSliderSettings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <Arrow position={albumArrowPos.next} />,
    prevArrow: <Arrow position={albumArrowPos.prev} />,
  };

  // Articles carousel settings (5 recent)
  const recent = Array.isArray(articles) ? articles.slice(0, 5) : [];
  const articleSliderSettings = {
    dots: false,
    infinite: false,              // plus de loop
    speed: 400,
    slidesToShow: 3,              // toujours 3 sur grand écran
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow position={articleArrowPos.next} />,
    prevArrow: <Arrow position={articleArrowPos.prev} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,        // 2 sur tablettes
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,        // 1 sur mobile
          slidesToScroll: 1
        }
      }
    ]
  };


  return (
    <div className="bg-gray-900 min-h-screen pb-8 relative font-sans text-gray-100">
      {/* Carousel Albums */}
      <div className="w-full mb-8">
        <Slider {...albumSliderSettings}>
          {albums.map((album) => (
            <div key={album._id} className="relative">
              <div className="relative w-full h-[60vh] overflow-hidden">
                {album.coverPhoto ? (
                  <img
                    crossOrigin="anonymous"
                    src={album.coverPhoto}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Aucune couverture</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4 text-center">
                  <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-2 title-shadow">
                    {album.name}
                  </h2>
                  {album.description && (
                    <p className="text-gray-200 text-sm md:text-base max-w-xl leading-relaxed">
                      {album.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Bienvenue */}
      <section className="bg-gray-800 text-white py-16 px-4 mt-12 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Bienvenue</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Bonjour, je m'appelle Dany Khadhar. Sur ce site, je présente mes photos de voyage, réalisées au fil de mes aventures. En tant qu'amateur, je m'attache à documenter les moments que je trouve intéressants et à offrir un aperçu sincère de mes déplacements. Merci de prendre le temps de visiter mon univers photographique. Bonne visite !
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center tracking-tight">Portfolio</h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Parcourez mes albums regroupant divers moments de mes voyages. Chaque album rassemble une série d'images prises dans des contextes variés, illustrant des lieux, des ambiances et des instants simples.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <NavLink
                to={`/album/${album._id}`}
                key={album._id}
                className="group bg-gray-800 text-gray-200 rounded-md shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {album.coverPhoto ? (
                    <img
                      crossOrigin="anonymous"
                      src={album.coverPhoto}
                      alt={album.name}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Aucune couverture</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white bg-opacity-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:bg-opacity-40 group-hover:opacity-100">
                    <span className="text-black text-6xl font-light">»</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.name}</h3>
                  <p className="italic text-xs text-gray-400 mt-2">
                    By Dany | {new Date(album.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* Section Derniers Articles */}
      <section className="bg-gray-800 text-white py-16 px-4 mt-12 shadow-inner">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-tight text-white">Derniers Articles</h2>
        {recent.length === 0 ? (
          <section className="bg-gray-800 text-white py-16 px-4 shadow-inner">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-lg leading-relaxed">Aucun article publié pour le moment. Revenez plus tard !</p>
            </div>
          </section>
        ) : (
          <div className="px-4">
            <Slider {...articleSliderSettings}>
              {recent.map(({ slug, title, createdAt, markdownContent, coverPhoto }) => (
                <div key={slug} className="px-2">
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto">
                    {/* image ou placeholder */}
                    {coverPhoto ? (
                      <img
                        src={coverPhoto}
                        alt={title}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="h-40 w-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">Visuel à venir</span>
                      </div>
                    )}
                    {/* contenu */}
                    <div className="p-4 bg-gray-900">
                      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {new Date(createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-300 text-sm mb-4">
                        {(markdownContent ?? '').slice(0, 100)}…
                      </p>
                      <Link to={`/articles/${slug}`} className="inline-block text-indigo-400 hover:underline">
                        Lire la suite →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

          </div>
        )}
      </section>

      {/* Section Photos Récentes */}
      <section className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center tracking-tight">Dernières Photos</h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Retrouvez une sélection de mes clichés récents, illustrant divers moments de mes voyages.
          </p>
          <PhotoGallery />
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .custom-dots { position: absolute; bottom: 10px; width: 100%; display: flex !important; justify-content: center; margin: 0; padding: 0; }
        .custom-dots li button:before { font-size: 8px; color: #ccc; opacity: 0.8; }
        .custom-dots li.slick-active button:before { opacity: 1; color: white; }
        .title-shadow { text-shadow: 1px 1px 2px rgba(0,0,0,0.6); }
      `}</style>
    </div>
  );
}
