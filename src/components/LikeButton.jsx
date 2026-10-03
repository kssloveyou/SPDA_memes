// Шаг ③. Кнопка лайка.
//
// Получает props: id, initialLikes.
// Клик ставит лайк (+1), повторный клик снимает (−1). Иконка: ♡ — лайка нет, ♥ — лайк поставлен.
// В макете нажатая кнопка яркая: найдите в DevTools, какой атрибут кнопки за это отвечает, и ставьте его сами.
// Потом используйте LikeButton в MemeCard вместо обычной кнопки.

import { useState } from 'react';
import { API_URL } from '../api.js';

export default function LikeButton({id, initialLikes, initialLiked = false,}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  function handleClick() {
    if (pending) return;

    const previousLikes = likes;
    const previousLiked = liked;
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikes(likes + (nextLiked ? 1 : -1));
    setPending(true);
    setError('');

    fetch(API_URL + '/api/memes/' + id + '/like', {
      method: nextLiked ? 'POST' : 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Не удалось сохранить лайк(');
        }

        return res.json();
      })
      .then((meme) => {
        setLikes(meme.likes);
        setLiked(meme.liked);
      })
      .catch(() => {
        setLikes(previousLikes);
        setLiked(previousLiked);
        setError('Лайк не сохранился. Retry');
      })
      .finally(() => {
        setPending(false);
      });
  }
  return (
    <div>
      <button type="button" className="like" aria-pressed={liked} disabled={pending} onClick={handleClick}>
        {liked ? '♥' : '♡'} {likes}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );

}
