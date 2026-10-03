// Шаг ②. Лента.
//
// Компонент получает props.memes — массив мемов из data/memes.js.
// Покажите карточку MemeCard для каждого мема. Во что обёрнута лента — смотрите в макете.
// Потом покажите в App.jsx всю ленту вместо одной карточки.
// Загляните в Console: React подскажет, если чего-то не хватает.

import MemeCard from './MemeCard.jsx';

import { useEffect, useState } from 'react';
import { API_URL } from '../api.js';

export default function Feed() {
  const [memes, setMemes] = useState([]);
  const [status, setStatus] = useState('loading');

  function loadMemes() {
    setStatus('loading');

    return fetch(API_URL + '/api/memes', {credentials: 'include',})
      .then((res) => {
        if (!res.ok) {
          throw new Error('Не удалось загрузить мемы(');
        }
        return res.json();
      })
      .then((data) => {
        setMemes(data);
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  }

  useEffect(() => {loadMemes();}, []);

  if (status === 'loading') {
    return <p className="status">Загрузка мемов......</p>;
  }
  if (status === 'error') {
    return (
      <div className="status" role="alert">
        <p>Не удалось загрузить мемы.......</p>
        <button type="button" onClick={loadMemes}>
          Повторить
        </button>
      </div>
    );
  }
  if (memes.length === 0) {
    return <p className="status">Мемов нету.....</p>;
  }
  return (
    <div className = "feed">
      {memes.map((meme) => (
        <MemeCard key={meme.id} id={meme.id} title={meme.title} image={meme.image} likes={meme.likes}/>
      ))}
    </div>
  );
}
