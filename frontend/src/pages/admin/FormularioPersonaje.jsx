import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import characterService from '../../services/characterService';
import categoryService from '../../services/categoryService';
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '../../lib/storage';

function FormularioPersonaje() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: personajeId } = useParams();
  const personajeAEditar = location.state?.personaje || null;
  const isEditMode = Boolean(personajeId || personajeAEditar?.id);

  const [formData, setFormData] = useState({
    name: '',
    story: '',
    creation_date: '',
    place_of_origin: '',
    biological_origin: '',
    first_appearance: '',
    universe_id: '',
    mbti_type_id: '',
    psychological_analysis: '',
    cover_path: null,
    cover_preview: null,
    gallery: [],
    filmography: [{ title: '', year: '', cover_path: null }],
    actors: [{ actor_name: '' }],
    audios: [{ title: '', audio_path: null, transcription: '' }]
  });

  const [universes, setUniverses] = useState([]);
  const [mbtiTypes, setMbtiTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const mapFilmographyItem = (item) => {
    const path = item?.cover_path || item?.coverPath || item?.cover_image || item?.coverImage || null;
    return {
      id: item?.id,
      title: item?.title || '',
      year: item?.year || '',
      cover_path: null,
      coverPath: path,
      preview: item?.image || (path ? getPublicUrl(STORAGE_BUCKETS.filmsCover, path) : null)
    };
  };

  const mapActorItem = (item) => ({
    id: item?.id,
    actor_name: item?.actor_name || item?.actorName || item?.name || item?.text || ''
  });

  const mapGalleryItem = (item) => {
    const path = item?.file_path || item?.filePath || item?.image_path || item?.path || null;
    return {
      id: item?.id,
      file: null,
      filePath: path,
      preview: item?.preview || item?.image || (path ? getPublicUrl(STORAGE_BUCKETS.characterMedia, path) : null)
    };
  };

  const mapAudioItem = (item) => {
    const path = item?.audio_path || item?.audioPath || item?.audio_url || null;
    return {
      id: item?.id,
      title: item?.title || '',
      transcription: item?.transcription || '',
      audio_path: null,
      audioPath: path,
      url: item?.url || (path ? getPublicUrl(STORAGE_BUCKETS.audioFiles, path) : null)
    };
  };

  useEffect(() => {
    const loadOptionsAndData = async () => {
      setLoading(true);

      try {
        const { universes: loadedUniverses, mbtiTypes: loadedMbtiTypes } = await categoryService.getAll();
        setUniverses(loadedUniverses || []);
        setMbtiTypes(loadedMbtiTypes || []);

        const idToLoad = personajeId || personajeAEditar?.id;

        if (idToLoad) {
          const [character, filmography, actors, gallery, audios] = await Promise.all([
            characterService.getById(idToLoad),
            characterService.getFilmography(idToLoad),
            characterService.getActors(idToLoad),
            characterService.getImages(idToLoad),
            characterService.getAudios(idToLoad)
          ]);

          setFormData({
            name: character.name || '',
            story: character.story || '',
            creation_date: character.creation_date || '',
            place_of_origin: character.place_of_origin || '',
            biological_origin: character.biological_origin || '',
            first_appearance: character.first_appearance || '',
            universe_id: character.universe_id || '',
            mbti_type_id: character.mbti_type_id || '',
            psychological_analysis: character.psychological_analysis || '',
            cover_path: character.cover_path || null,
            cover_preview: character.cover_path
              ? getPublicUrl(STORAGE_BUCKETS.characterCovers, character.cover_path)
              : null,
            gallery: (gallery || []).map(mapGalleryItem),
            filmography: (filmography && filmography.length > 0)
              ? filmography.map(mapFilmographyItem)
              : [{ title: '', year: '', cover_path: null }],
            actors: (actors && actors.length > 0)
              ? actors.map(mapActorItem)
              : [{ actor_name: '' }],
            audios: (audios && audios.length > 0)
              ? audios.map(mapAudioItem)
              : [{ title: '', audio_path: null, transcription: '' }]
          });

          return;
        }

        if (personajeAEditar) {
          const resolvedUniverseId = personajeAEditar.universe_id ||
            loadedUniverses.find((item) => item.name === personajeAEditar.universe)?.id || '';
          const resolvedMbtiTypeId = personajeAEditar.mbti_type_id ||
            loadedMbtiTypes.find((item) => item.code === personajeAEditar.mbti)?.id || '';

          setFormData((prev) => ({
            ...prev,
            name: personajeAEditar.name || '',
            story: personajeAEditar.story || '',
            creation_date: personajeAEditar.creation_date || '',
            place_of_origin: personajeAEditar.place_of_origin || '',
            biological_origin: personajeAEditar.biological_origin || '',
            first_appearance: personajeAEditar.first_appearance || '',
            universe_id: resolvedUniverseId,
            mbti_type_id: resolvedMbtiTypeId,
            psychological_analysis: personajeAEditar.psychological_analysis || '',
            cover_path: personajeAEditar.cover_path || null,
            cover_preview: personajeAEditar.cover_path
              ? getPublicUrl(STORAGE_BUCKETS.characterCovers, personajeAEditar.cover_path)
              : null,
            gallery: (personajeAEditar.gallery || []).map(mapGalleryItem),
            filmography: (personajeAEditar.filmography || [{ title: '', year: '', cover_path: null }]).map(mapFilmographyItem),
            actors: (personajeAEditar.actors || [{ actor_name: '' }]).map(mapActorItem),
            audios: (personajeAEditar.audios || [{ title: '', audio_path: null, transcription: '' }]).map(mapAudioItem)
          }));
        }
      } catch (error) {
        console.error('Error cargando formulario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOptionsAndData();
  }, [personajeAEditar, personajeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilmographyChange = (index, field, value) => {
    setFormData((prev) => {
      const filmography = [...prev.filmography];
      filmography[index] = { ...filmography[index], [field]: value };
      return { ...prev, filmography };
    });
  };

  const handleActorsChange = (index, value) => {
    setFormData((prev) => {
      const actors = [...prev.actors];
      actors[index] = { ...actors[index], actor_name: value };
      return { ...prev, actors };
    });
  };

  const handleAudiosChange = (index, field, value) => {
    setFormData((prev) => {
      const audios = [...prev.audios];
      audios[index] = { ...audios[index], [field]: value };
      return { ...prev, audios };
    });
  };

  const handleFilmographyFile = (index, file) => {
    setFormData((prev) => {
      const filmography = [...prev.filmography];
      filmography[index] = {
        ...filmography[index],
        cover_path: file,
        preview: file ? URL.createObjectURL(file) : filmography[index].preview
      };
      return { ...prev, filmography };
    });
  };

  const handleCoverFile = (file) => {
    setFormData((prev) => ({
      ...prev,
      cover_path: file,
      cover_preview: file ? URL.createObjectURL(file) : null
    }));
  };

  const handleGalleryFiles = (files) => {
    const galleryFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...galleryFiles]
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const uploadFileIfNeeded = async (bucket, fileOrPath, fallbackPath, folderName) => {
    if (!fileOrPath) {
      return fallbackPath || null;
    }

    if (typeof fileOrPath === 'string') {
      return fileOrPath;
    }

    const safeName = fileOrPath.name.replace(/\s+/g, '_');
    const storagePath = `${folderName ? `${folderName}/` : ''}${Date.now()}-${safeName}`;

    await uploadFile(bucket, storagePath, fileOrPath);
    return storagePath;
  };

  const generateSlug = (text) => {
    if (!text) return null;
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleAudioFile = (index, file) => {
    setFormData((prev) => {
      const audios = [...prev.audios];
      audios[index] = {
        ...audios[index],
        audio_path: file,
        url: file ? URL.createObjectURL(file) : audios[index].url
      };
      return { ...prev, audios };
    });
  };

  const addFilmographyItem = () => {
    setFormData((prev) => ({
      ...prev,
      filmography: [...prev.filmography, { title: '', year: '', cover_path: null }]
    }));
  };

  const removeFilmographyItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      filmography: prev.filmography.filter((_, i) => i !== index)
    }));
  };

  const addActor = () => {
    setFormData((prev) => ({
      ...prev,
      actors: [...prev.actors, { actor_name: '' }]
    }));
  };

  const removeActor = (index) => {
    setFormData((prev) => ({
      ...prev,
      actors: prev.actors.filter((_, i) => i !== index)
    }));
  };

  const addAudio = () => {
    setFormData((prev) => ({
      ...prev,
      audios: [...prev.audios, { title: '', audio_path: null, transcription: '' }]
    }));
  };

  const removeAudio = (index) => {
    setFormData((prev) => ({
      ...prev,
      audios: prev.audios.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const userId = authData?.user?.id;

      if (!userId) {
        alert('Debes iniciar sesión para guardar el personaje.');
        setSubmitting(false);
        return;
      }

      const finalCoverPath = await uploadFileIfNeeded(
        STORAGE_BUCKETS.characterCovers,
        formData.cover_path,
        formData.cover_path && typeof formData.cover_path === 'string' ? formData.cover_path : null,
        'characters'
      );

      const characterPayload = {
        name: formData.name,
        slug: generateSlug(formData.name),
        story: formData.story,
        creation_date: formData.creation_date,
        place_of_origin: formData.place_of_origin,
        biological_origin: formData.biological_origin,
        first_appearance: formData.first_appearance,
        universe_id: formData.universe_id,
        mbti_type_id: formData.mbti_type_id,
        psychological_analysis: formData.psychological_analysis,
        cover_path: finalCoverPath
      };

      const editingId = personajeId || personajeAEditar?.id;
      const character = editingId
        ? await characterService.update(editingId, characterPayload)
        : await characterService.create(characterPayload);
      const characterId = character.id;

      if (editingId) {
        await Promise.all([
          supabase.from('filmography').delete().eq('character_id', characterId),
          supabase.from('character_actors').delete().eq('character_id', characterId),
          supabase.from('character_media').delete().eq('character_id', characterId),
          supabase.from('audios').delete().eq('character_id', characterId)
        ]);
      }

      const filmographyRecords = await Promise.all(
        formData.filmography
          .filter((item) => item.title || item.year || item.cover_path || item.coverPath)
          .map(async (item) => ({
            character_id: characterId,
            title: item.title,
            year: item.year,
            cover_path: await uploadFileIfNeeded(
              STORAGE_BUCKETS.filmsCover,
              item.cover_path,
              item.coverPath || null
            )
          }))
      );

      const actorsRecords = formData.actors
        .filter((item) => item.actor_name)
        .map((item, index) => ({
          character_id: characterId,
          actor_name: item.actor_name,
          sort_order: index + 1
        }));

      const galleryRecords = await Promise.all(
        formData.gallery
          .filter((item) => item.file || item.filePath)
          .map(async (item, index) => ({
            character_id: characterId,
            type: 'image',
            title: item.title || null,
            file_path: await uploadFileIfNeeded(
              STORAGE_BUCKETS.characterMedia,
              item.file,
              item.filePath || null,
              'gallery'
            ),
            sort_order: index + 1
          }))
      );

      const audioRecords = await Promise.all(
        formData.audios
          .filter((item) => item.title || item.audio_path || item.audioPath || item.transcription)
          .map(async (item) => ({
            character_id: characterId,
            title: item.title || null,
            audio_path: await uploadFileIfNeeded(
              STORAGE_BUCKETS.audioFiles,
              item.audio_path,
              item.audioPath || null
            ),
            transcription: item.transcription || null,
            type: 'soundtrack'
          }))
      );

      const inserts = [];
      if (filmographyRecords.length) inserts.push(supabase.from('filmography').insert(filmographyRecords));
      if (actorsRecords.length) inserts.push(supabase.from('character_actors').insert(actorsRecords));
      if (galleryRecords.length) inserts.push(supabase.from('character_media').insert(galleryRecords));
      if (audioRecords.length) inserts.push(supabase.from('audios').insert(audioRecords));

      const insertResults = await Promise.all(inserts);
      insertResults.forEach(({ error }) => {
        if (error) throw error;
      });

      navigate(-1);
    } catch (error) {
      console.error('Error guardando el personaje:', error);
      alert('No se pudo guardar el personaje. Revisa la consola para más detalles.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{ backgroundColor: 'var(--color-principal)', minHeight: '100vh', color: 'var(--colorTexto)' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-info" role="status" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3" style={{ color: 'var(--color-grisClarito)' }}>Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="container-fluid py-5" style={{ backgroundColor: 'var(--color-principal)', minHeight: '100vh', color: 'var(--colorTexto)' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow" style={{ backgroundColor: 'var(--color-grisOscuro)', borderRadius: '24px' }}>
            <div className="card-body p-4 p-md-5" style={{ color: 'var(--color-grisClarito)' }}>
              <div className="mb-4 text-center">
                <h1 className="h3 text-uppercase mb-2" style={{ color: 'var(--color4)', letterSpacing: '0.08em' }}>
                  {isEditMode ? 'Editar personaje' : 'Crear personaje'}
                </h1>
                <p className="text-muted mb-0" style={{ color: 'var(--color4)!important' }}>Completa los bloques básicos, las relaciones y los contenidos dinámicos del personaje.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <section className="mb-5">
                  <h2 className="h5 fw-semibold mb-3" style={{ color: 'var(--color4)' }}>1. Datos básicos</h2>
                  <div className="row gx-3 gy-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Nombre del personaje"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="creation_date" className="form-label">Fecha de creación</label>
                      <input
                        id="creation_date"
                        name="creation_date"
                        type="date"
                        value={formData.creation_date}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="story" className="form-label">Historia</label>
                      <textarea
                        id="story"
                        name="story"
                        rows="4"
                        value={formData.story}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Descripción breve del origen y arco del personaje"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="place_of_origin" className="form-label">Lugar de origen</label>
                      <input
                        id="place_of_origin"
                        name="place_of_origin"
                        type="text"
                        value={formData.place_of_origin}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Ciudad, planeta o dimensión"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="biological_origin" className="form-label">Origen biológico</label>
                      <input
                        id="biological_origin"
                        name="biological_origin"
                        type="text"
                        value={formData.biological_origin}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Humano, alienígena, híbrido..."
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="first_appearance" className="form-label">Primera aparición</label>
                      <input
                        id="first_appearance"
                        name="first_appearance"
                        type="text"
                        value={formData.first_appearance}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Título o medio de la primera aparición"
                      />
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h5 fw-semibold mb-3" style={{ color: 'var(--color4)' }}>2. Relaciones</h2>
                  <div className="row gx-3 gy-3">
                    <div className="col-md-6">
                      <label htmlFor="universe_id" className="form-label">Universo</label>
                      <select
                        id="universe_id"
                        name="universe_id"
                        value={formData.universe_id}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Selecciona universo</option>
                        {universes.map((option) => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="mbti_type_id" className="form-label">Tipo MBTI</label>
                      <select
                        id="mbti_type_id"
                        name="mbti_type_id"
                        value={formData.mbti_type_id}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Selecciona MBTI</option>
                        {mbtiTypes.map((option) => (
                          <option key={option.id} value={option.id}>{option.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0" style={{ color: 'var(--color4)' }}>3. Filmografía</h2>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={addFilmographyItem}>
                      Añadir película
                    </button>
                  </div>
                  <div className="row gx-3 gy-4">
                    {formData.filmography.map((item, index) => (
                      <div key={index} className="col-12 border rounded-3 p-3" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                        <div className="row gx-3 gy-3 align-items-end">
                          <div className="col-md-4">
                            <label className="form-label">Título</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.title}
                              onChange={(e) => handleFilmographyChange(index, 'title', e.target.value)}
                              placeholder="Título de la película"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Año</label>
                            <input
                              type="number"
                              className="form-control"
                              value={item.year}
                              onChange={(e) => handleFilmographyChange(index, 'year', e.target.value)}
                              placeholder="Año"
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Portada</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              onChange={(e) => handleFilmographyFile(index, e.target.files?.[0] || null)}
                            />
                            {(item.cover_path?.name || item.coverPath) && (
                              <small className="text-muted">
                                Archivo: {item.cover_path?.name || item.coverPath}
                              </small>
                            )}
                          </div>
                          <div className="col-md-1 text-end">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeFilmographyItem(index)}>
                              x
                            </button>
                          </div>
                        </div>
                        {item.preview && (
                          <div className="row gx-3 mt-3">
                            <div className="col-12">
                              <div className="border rounded-3 overflow-hidden" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                                <img
                                  src={item.preview}
                                  alt={`Portada de ${item.title || 'película'}`}
                                  className="img-fluid"
                                  style={{ maxHeight: '180px', width: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0" style={{ color: 'var(--color4)' }}>4. Actores</h2>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={addActor}>
                      Añadir actor
                    </button>
                  </div>
                  <div className="row gx-3 gy-3">
                    {formData.actors.map((actor, index) => (
                      <div key={index} className="col-12 d-flex gap-3 align-items-end">
                        <div className="flex-grow-1">
                          <label className="form-label">Nombre del actor</label>
                          <input
                            type="text"
                            className="form-control"
                            value={actor.actor_name}
                            onChange={(e) => handleActorsChange(index, e.target.value)}
                            placeholder="Nombre del actor"
                          />
                        </div>
                        <button type="button" className="btn btn-outline-danger btn-sm mt-4" onClick={() => removeActor(index)}>
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h5 fw-semibold mb-3" style={{ color: 'var(--color4)' }}>5. Análisis psicológico</h2>
                  <div className="mb-3">
                    <label htmlFor="psychological_analysis" className="form-label">Análisis</label>
                    <textarea
                      id="psychological_analysis"
                      name="psychological_analysis"
                      rows="5"
                      value={formData.psychological_analysis}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Describe la psicología del personaje"
                    />
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h5 fw-semibold mb-3" style={{ color: 'var(--color4)' }}>6. Portada principal</h2>
                  <div className="row gx-3 gy-3 align-items-end">
                    <div className="col-md-8">
                      <label htmlFor="cover_path" className="form-label">Archivo de portada</label>
                      <input
                        id="cover_path"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleCoverFile(e.target.files?.[0] || null)}
                      />
                      {(formData.cover_path?.name || formData.cover_preview) && (
                        <small className="text-muted">Archivo seleccionado: {formData.cover_path?.name || 'Portada actual cargada'}</small>
                      )}
                    </div>
                    <div className="col-md-4">
                      {formData.cover_preview && (
                        <div className="border rounded-3 p-2" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                          <p className="mb-1" style={{ color: 'var(--color-grisClarito)' }}>Previsualización</p>
                          <img
                            src={formData.cover_preview}
                            alt="Portada seleccionada"
                            className="img-fluid rounded"
                            style={{ maxHeight: '120px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0" style={{ color: 'var(--color4)' }}>7. Galería de medios</h2>
                    <label className="btn btn-sm btn-outline-light mb-0">
                      Añadir imágenes
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => handleGalleryFiles(e.target.files)}
                      />
                    </label>
                  </div>
                  <div className="row gx-3 gy-3">
                    {formData.gallery.length === 0 ? (
                      <div className="col-12" style={{ color: 'var(--color-grisClarito)' }}>No hay imágenes en la galería aún.</div>
                    ) : (
                      formData.gallery.map((item, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3">
                          <div className="position-relative rounded overflow-hidden" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                            <img
                              src={item.preview}
                              alt={`Galería ${index + 1}`}
                              className="img-fluid"
                              style={{ minHeight: '120px', objectFit: 'cover', width: '100%' }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                              onClick={() => removeGalleryImage(index)}
                            >
                              x
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0" style={{ color: 'var(--color4)' }}>8. Audios</h2>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={addAudio}>
                      Añadir audio
                    </button>
                  </div>
                  <div className="row gx-3 gy-4">
                    {formData.audios.map((item, index) => (
                      <div key={index} className="col-12 border rounded-3 p-3" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                        <div className="row gx-3 gy-3">
                          <div className="col-md-4">
                            <label className="form-label">Título</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.title}
                              onChange={(e) => handleAudiosChange(index, 'title', e.target.value)}
                              placeholder="Nombre del audio"
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Archivo de audio</label>
                            <input
                              type="file"
                              accept="audio/*"
                              className="form-control"
                              onChange={(e) => handleAudioFile(index, e.target.files?.[0] || null)}
                            />
                            {(item.audio_path?.name || item.audioPath) && (
                              <small className="text-muted">
                                Archivo: {item.audio_path?.name || item.audioPath}
                              </small>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Transcripción</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.transcription}
                              onChange={(e) => handleAudiosChange(index, 'transcription', e.target.value)}
                              placeholder="Transcripción breve"
                            />
                          </div>
                          <div className="col-md-1 text-end">
                            <button type="button" className="btn btn-outline-danger btn-sm mt-4" onClick={() => removeAudio(index)}>
                              x
                            </button>
                          </div>
                        </div>
                        {item.url && (
                          <div className="row gx-3 mt-3">
                            <div className="col-12">
                              <div className="border rounded-3 p-3" style={{ backgroundColor: 'var(--color-grisOscuro)' }}>
                                <p className="mb-2" style={{ color: 'var(--color-grisClarito)' }}>Reproductor de audio</p>
                                <audio controls className="w-100">
                                  <source src={item.url} />
                                  Tu navegador no soporta reproducción de audio.
                                </audio>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                  <button type="button" className="btn btn-outline-light" onClick={() => navigate(-1)}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={submitting} style={{ backgroundColor: 'var(--color2)', borderColor: 'var(--color2)' }}>
                    {submitting ? 'Guardando...' : isEditMode ? 'Actualizar Personaje' : 'Crear personaje'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioPersonaje;
