import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';

const API_URL = 'http://localhost:3001';

export function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
      })
      .catch(() => setErrorMsg('No se pudieron cargar las etiquetas'));
  }, []);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addImageField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const updateImageUrl = (index: number, newValue: string) => {
    setImageUrls((prev) =>
      prev.map((currentUrl, currentIndex) =>
        currentIndex === index ? newValue : currentUrl
      )
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) return;

    if (!description.trim()) {
      setErrorMsg('La descripción es obligatoria.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          userId: user.id,
          tags: selectedTags,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al crear la publicación');
      }

      const createdPost = await res.json();

      for (const rawUrl of imageUrls) {
        const cleanUrl = rawUrl.trim();
        if (cleanUrl && createdPost.id) {
          await fetch(`${API_URL}/postimages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: cleanUrl,
              postId: createdPost.id,
            }),
          });
        }
      }

      navigate('/perfil');
    } catch {
      setErrorMsg('No se pudo publicar. Revisá los datos o el servidor.');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '650px' }}>
      <div className="card border shadow-sm rounded-3">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-3">Crear publicación</h2>

          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Descripción</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Escribí algo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold d-block">
                URLs de imágenes (opcional)
              </label>

              <div className="d-flex flex-column gap-2">
                {imageUrls.map((url, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={addImageField}
              >
                + Agregar otra URL
              </button>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold d-block">Etiquetas</label>
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`btn btn-sm ${
                      selectedTags.includes(tag.id)
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}