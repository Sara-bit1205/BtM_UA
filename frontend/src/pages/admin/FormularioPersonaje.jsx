import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import characterService from '../../services/characterService';
import categoryService from '../../services/categoryService';
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '../../lib/storage';
import '../../assets/styles/adminPersonajes.css';

function AdminDropdown({ placeholder, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const label = selected
    ? options.find(o => o.id === selected)?.name
    : placeholder;

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="admin-cat-dropdown-wrap fp-dropdown-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`admin-cat-dropdown-btn fp-dropdown-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{label}</span>
        <span className="chevron">▼</span>
      </button>

      <ul role="listbox" className={`admin-cat-dropdown-list fp-dropdown-list ${open ? 'open' : ''}`}>
        {options.map(opt => (
          <li
            key={opt.id}
            role="option"
            aria-selected={selected === opt.id}
            className={`admin-cat-dropdown-item fp-dropdown-item ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => {
              onSelect(opt.id);
              setOpen(false);
            }}
          >
            {opt.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    personality_tag_ids: [],
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
  const [personalityTags, setPersonalityTags] = useState([]);
  const [existingFilms, setExistingFilms] = useState([]);
  const [selectedExistingFilm, setSelectedExistingFilm] = useState('');
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
        const [{ universes: loadedUniverses, mbtiTypes: loadedMbtiTypes, personalityTags: loadedPersonalityTags }, loadedExistingFilms] = await Promise.all([
          categoryService.getAll(),
          characterService.getAvailableFilms()
        ]);

        setUniverses(loadedUniverses || []);
        setMbtiTypes(loadedMbtiTypes || []);
        setPersonalityTags(loadedPersonalityTags || []);
        setExistingFilms(loadedExistingFilms || []);

        const idToLoad = personajeId || personajeAEditar?.id;

        if (idToLoad) {
          const [character, filmography, actors, gallery, audios] = await Promise.all([
            characterService.getById(idToLoad),
            characterService.getFilmography(idToLoad),
            characterService.getActors(idToLoad),
            characterService.getImages(idToLoad),
            characterService.getAudios(idToLoad)
          ]);

          const loadedPersonalityTagIds = (character.character_personality_tags || [])
            .map((t) => t.personality_tag_id || t.personality_tags?.id)
            .filter(Boolean);

          setFormData({
            name: character.name || '',
            story: character.story || '',
            creation_date: character.creation_date || '',
            place_of_origin: character.place_of_origin || '',
            biological_origin: character.biological_origin || '',
            first_appearance: character.first_appearance || '',
            universe_id: character.universe_id || '',
            mbti_type_id: character.mbti_type_id || '',
            personality_tag_ids: loadedPersonalityTagIds,
            psychological_analysis: character.psychological_analysis || '',
            cover_path: character.cover_path || null,
            cover_preview: character.cover_path
              ? getPublicUrl(STORAGE_BUCKETS.characterCovers, character.cover_path)
              : null,
            gallery: (gallery && gallery.length > 0)
              ? gallery.map(mapGalleryItem)
              : [],
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
            personality_tag_ids: Array.isArray(personajeAEditar.personality_tag_ids)
              ? personajeAEditar.personality_tag_ids
              : personajeAEditar.personality_tag_id
                ? [personajeAEditar.personality_tag_id]
                : [],
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

  const filmKey = (film) => `${film.title?.trim().toLowerCase() || ''}::${film.year || ''}`;

  const handleAddExistingFilm = () => {
    if (!selectedExistingFilm) return;
    const existingFilm = existingFilms.find((film) => filmKey(film) === selectedExistingFilm);
    if (!existingFilm) return;

    const alreadyAdded = formData.filmography.some(
      (item) => filmKey(item) === filmKey(existingFilm)
    );

    if (alreadyAdded) {
      setSelectedExistingFilm('');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      filmography: [
        ...prev.filmography,
        {
          title: existingFilm.title,
          year: existingFilm.year,
          cover_path: null,
          coverPath: existingFilm.coverPath || null,
          preview: existingFilm.coverPath ? getPublicUrl(STORAGE_BUCKETS.filmsCover, existingFilm.coverPath) : null,
        }
      ]
    }));
    setSelectedExistingFilm('');
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
        creation_date: formData.creation_date || null,
        place_of_origin: formData.place_of_origin || null,
        biological_origin: formData.biological_origin || null,
        first_appearance: formData.first_appearance || null,
        universe_id: formData.universe_id || null,
        mbti_type_id: formData.mbti_type_id || null,
        psychological_analysis: formData.psychological_analysis || null,
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
          supabase.from('audios').delete().eq('character_id', characterId),
          supabase.from('character_personality_tags').delete().eq('character_id', characterId)
        ]);
      }

      const buildFilmographyRecord = async (item) => {
        const title = item.title?.trim();
        if (!title) return null;

        const year = item.year || null;
        let query = supabase.from('filmography').select('id, title, year, cover_path').eq('title', title);
        if (year) query = query.eq('year', year);

        const { data: existingFilms, error: existingFilmError } = await query.limit(1);
        if (existingFilmError) throw existingFilmError;

        const existingFilm = Array.isArray(existingFilms) ? existingFilms[0] : existingFilms;
        const coverPath = await uploadFileIfNeeded(
          STORAGE_BUCKETS.filmsCover,
          item.cover_path,
          item.coverPath || existingFilm?.cover_path || null
        );

        return {
          character_id: characterId,
          title,
          year,
          cover_path: coverPath
        };
      };

      const filmographyRecords = (await Promise.all(
        formData.filmography
          .filter((item) => item.title || item.year || item.cover_path || item.coverPath)
          .map(buildFilmographyRecord)
      )).filter(Boolean);

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
      if (formData.personality_tag_ids && formData.personality_tag_ids.length > 0) {
        const tagRows = formData.personality_tag_ids.map((tagId) => ({
          character_id: characterId,
          personality_tag_id: tagId
        }));
        inserts.push(supabase.from('character_personality_tags').insert(tagRows));
      }

      const insertResults = await Promise.all(inserts);
      insertResults.forEach(({ error }) => {
        if (error) throw error;
      });

      navigate(-1);
    } catch (error) {
      console.error('Error guardando el personaje:', error);
      if (error.message && error.message.includes('characters_slug_key')) {
        alert('Ya existe un personaje con este nombre. Por favor, añade un apellido o cambia el nombre para que sea único.');
      } else {
        alert(`No se pudo guardar el personaje. Error: ${error.message || error}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color-principal)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color2)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p style={{ color: 'var(--color-grisClarito)', marginTop: 20, fontSize: 14, letterSpacing: '0.05em' }}>Cargando formulario...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const sS = { // shared section style
    background: 'var(--color-grisOscuro)',
    border: '1px solid var(--color2)',
    borderRadius: 16,
    padding: '28px 28px 24px',
    marginBottom: 24,
  };
  const labelS = { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color4)', marginBottom: 6, display: 'block', fontFamily: 'var(--texto-normal)' };
  const inputS = { background: 'var(--color-principal)', border: '1px solid var(--color-grisClarito)', borderRadius: 10, color: 'var(--colorTexto)', padding: '10px 14px', width: '100%', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--texto-normal)' };
  const filmInputS = {
    ...inputS,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(4px)'
  };

  const sectionTitle = (num, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color2)', color: 'var(--color-principal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</span>
      <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color4)', letterSpacing: '0.04em', fontFamily: 'var(--texto-normal)' }}>{text}</h2>
    </div>
  );
  const addBtn = (onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className="btn rounded-pill fw-bold px-3 py-1 border-0 d-inline-flex align-items-center justify-content-center gap-1 shadow btnCrearPers fp-mobile-icon-btn"
      style={{ fontSize: '0.85rem' }}
    >
      <i className="bi bi-plus-circle"></i>
      <span className="fp-mobile-btn-text">{label}</span>
    </button>
  );

  const removeBtn = (onClick) => (
    <button type="button" onClick={onClick} className="btn rounded-circle p-1 d-flex align-items-center justify-content-center shadow btnEliminarPers" style={{ width: '32px', height: '32px' }}>
      <i className="bi bi-trash iconEliminar" style={{ fontSize: '1rem' }}></i>
    </button>
  );

  return (
    <div style={{ backgroundColor: 'var(--color-principal)', minHeight: '100vh', color: 'var(--colorTexto)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .fp-input:focus { border-color: var(--color2) !important; box-shadow: 0 0 0 3px rgba(37,135,132,0.25) !important; }
        .fp-input::placeholder { color: var(--colorTexto); opacity: 0.5; }
        .fp-input option { background: var(--color-grisOscuro); color: var(--colorTexto); }
        .fp-tag { border-radius: 20px; padding: 5px 14px; font-size: 0.8125rem; cursor: pointer; border: 1px solid; transition: all 0.18s; font-weight: 500; font-family: var(--texto-normal); }
        .fp-tag:hover { transform: translateY(-1px); }
        .fp-film-card { background: var(--color-principal); border: 1px solid var(--color2); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .fp-audio-card { background: var(--color-principal); border: 1px solid var(--color2); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .fp-dropzone { border: 2px dashed var(--color-grisClarito); border-radius: 14px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .fp-dropzone:hover { border-color: var(--color2); background: var(--color-grisOscuro); }
        .fp-gallery-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1; }
        .fp-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .fp-gallery-item .fp-remove { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.7); border: none; border-radius: 6px; color: #f87171; padding: 2px 7px; cursor: pointer; font-size: 0.8125rem; opacity: 0; transition: opacity 0.2s; }
        .fp-gallery-item:hover .fp-remove { opacity: 1; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--colorTexto)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--texto-normal)' }}>
            Panel de administracion
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color4)', margin: 0, letterSpacing: '-0.01em', fontFamily: 'var(--texto-encabezados)' }}>
            {isEditMode ? 'Editar personaje' : 'Nuevo personaje'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 1. Datos basicos */}
          <div style={sS}>
            {sectionTitle(1, 'Datos básicos')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelS}>Nombre</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  className="fp-input" style={inputS} placeholder="Nombre del personaje" />
              </div>
              <div>
                <label style={labelS}>Fecha de creación</label>
                <input id="creation_date" name="creation_date" type="date" value={formData.creation_date} onChange={handleChange}
                  className="fp-input" style={inputS} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelS}>Historia</label>
                <textarea id="story" name="story" rows="4" value={formData.story} onChange={handleChange}
                  className="fp-input" style={{ ...inputS, resize: 'vertical' }} placeholder="Descripción breve del origen y arco del personaje" />
              </div>
              <div>
                <label style={labelS}>Lugar de origen</label>
                <input id="place_of_origin" name="place_of_origin" type="text" value={formData.place_of_origin} onChange={handleChange}
                  className="fp-input" style={inputS} placeholder="Ciudad, planeta o dimensión" />
              </div>
              <div>
                <label style={labelS}>Origen biológico</label>
                <input id="biological_origin" name="biological_origin" type="text" value={formData.biological_origin} onChange={handleChange}
                  className="fp-input" style={inputS} placeholder="Humano, alienigena, hibrido..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelS}>Primera aparición</label>
                <input id="first_appearance" name="first_appearance" type="text" value={formData.first_appearance} onChange={handleChange}
                  className="fp-input" style={inputS} placeholder="Título o medio de la primera aparición" />
              </div>
            </div>
          </div>

          {/* 2. Relaciones */}
          <div style={sS}>
            {sectionTitle(2, 'Relaciones y personalidad')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16 }}>
              <div>
                <label style={labelS}>Universo</label>
                <AdminDropdown
                  placeholder="Selecciona universo"
                  options={universes.map(o => ({
                    id: o.id,
                    name: o.name
                  }))}
                  selected={formData.universe_id}
                  onSelect={(id) =>
                    setFormData(prev => ({
                      ...prev,
                      universe_id: id
                    }))
                  }
                />
              </div>
              <div>
                <label style={labelS}>Tipo MBTI</label>
                <AdminDropdown
                  placeholder="Selecciona MBTI"
                  options={mbtiTypes.map(o => ({
                    id: o.id,
                    name: o.code
                  }))}
                  selected={formData.mbti_type_id}
                  onSelect={(id) =>
                    setFormData(prev => ({
                      ...prev,
                      mbti_type_id: id
                    }))
                  }
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelS}>Carácter <span style={{ fontSize: '0.6875rem', opacity: 0.5, textTransform: 'none', fontWeight: 400 }}>(selecciona uno o más)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4, maxWidth: '100%', overflow: 'hidden' }}>
                  {personalityTags.map(tag => {
                    const sel = formData.personality_tag_ids.includes(tag.id);
                    return (
                      <button key={tag.id} type="button"
                        className="fp-tag"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          personality_tag_ids: sel
                            ? prev.personality_tag_ids.filter(id => id !== tag.id)
                            : [...prev.personality_tag_ids, tag.id]
                        }))}
                        style={{
                          background: sel ? 'var(--color2)' : 'transparent',
                          borderColor: sel ? 'var(--color2)' : 'var(--colorTexto)',
                          color: sel ? 'var(--colorTexto)' : 'var(--colorTexto)',
                          opacity: sel ? 1 : 0.6,
                        }}>
                        {sel && 'X '}{tag.name}
                      </button>
                    );
                  })}
                </div>
                {formData.personality_tag_ids.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--colorTexto)', opacity: 0.6, marginTop: 8, marginBottom: 0 }}>Ningún carácter seleccionado</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Filmografia */}
          <div style={sS}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color2)', color: 'var(--color-principal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color4)', fontFamily: 'var(--texto-normal)' }}>Filmografia</h2>
              </div>
              {addBtn(addFilmographyItem, 'Película nueva')}
            </div>

            {/* Enlazar pelicula existente */}
            <div style={{ background: 'var(--color-principal)', border: '1px solid var(--color2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <label style={{ ...labelS, marginBottom: 10 }}>Enlazar pelicula existente</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
                <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                  <AdminDropdown
                    placeholder="Selecciona una película ya registrada..."
                    options={existingFilms.map(film => ({
                      id: filmKey(film),
                      name: `${film.title}${film.year ? ` (${film.year})` : ''}`
                    }))}
                    selected={selectedExistingFilm}
                    onSelect={setSelectedExistingFilm}
                  />
                </div>
                <button type="button" onClick={handleAddExistingFilm}
                  className="btn rounded-pill fw-bold px-3 py-1 border-0 d-inline-flex align-items-center gap-1 shadow btnCrearPers"
                  style={{ fontSize: '0.8125rem' }}>
                  Añadir <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {formData.filmography.map((item, index) => (
              <div key={index} className="fp-film-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelS}>Tí­tulo</label>
                    <input type="text" className="fp-input" style={filmInputS} value={item.title}
                      onChange={e => handleFilmographyChange(index, 'title', e.target.value)} placeholder="Título" />
                  </div>
                  <div style={{ flex: '1 1 100px' }}>
                    <label style={labelS}>Año</label>
                    <input type="number" className="fp-input" style={filmInputS} value={item.year}
                      onChange={e => handleFilmographyChange(index, 'year', e.target.value)} placeholder="Año" />
                  </div>
                  <div style={{ flex: '1 1 220px' }}>
                    <label style={labelS}>Portada</label>
                    <input type="file" accept="image/*" className="form-control fw-bold shadow-sm fp-file-input" style={{ color: 'var(--colorTexto)', cursor: 'pointer', fontSize: '0.85rem', padding: '6px 12px' }}
                      onChange={e => handleFilmographyFile(index, e.target.files?.[0] || null)} />
                  </div>
                  <div style={{ paddingBottom: 2, flexShrink: 0 }}>{removeBtn(() => removeFilmographyItem(index))}</div>
                </div>
                {item.preview && (
                  <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', maxHeight: 160 }}>
                    <img src={item.preview} alt={item.title || 'portada'} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 4. Actores */}
          <div style={sS}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color2)', color: 'var(--color-principal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color4)', fontFamily: 'var(--texto-normal)' }}>Actores</h2>
              </div>
              {addBtn(addActor, 'Actor')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {formData.actors.map((actor, index) => (
                <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="text" className="fp-input" style={{ ...inputS, flex: 1 }} value={actor.actor_name}
                    onChange={e => handleActorsChange(index, e.target.value)} placeholder={`Actor ${index + 1}`} />
                  {removeBtn(() => removeActor(index))}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Analisis psicologico */}
          <div style={sS}>
            {sectionTitle(5, 'Análisis psicológico')}
            <label style={labelS}>Análisis</label>
            <textarea id="psychological_analysis" name="psychological_analysis" rows="5"
              value={formData.psychological_analysis} onChange={handleChange}
              className="fp-input" style={{ ...inputS, resize: 'vertical' }}
              placeholder="Describe la psicología, motivaciones y arco emocional del personaje" />
          </div>

          {/* 6. Portada principal */}
          <div style={sS}>
            {sectionTitle(6, 'Portada principal')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'start' }}>
              <div style={{ flex: '1 1 250px' }}>
                <label htmlFor="cover_path" className="fp-dropzone fp-cover-upload">
                  <div className="fp-cover-icon">🖼</div>
                  <p className="fp-cover-text">
                    {formData.cover_path?.name
                      ? formData.cover_path.name
                      : formData.cover_preview
                        ? 'Portada actual - haz clic para cambiar'
                        : 'Haz clic para seleccionar imagen de portada'}
                  </p>
                  <input id="cover_path" type="file" accept="image/*" hidden
                    onChange={e => handleCoverFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              {formData.cover_preview && (
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-grisClaro)', flex: '0 0 180px' }}>
                  <img src={formData.cover_preview} alt="Portada" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          </div>

          {/* 7. Galeria */}
          <div style={sS}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color2)', color: 'var(--color-principal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>7</span>
                <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color4)', fontFamily: 'var(--texto-normal)' }}>Galeria de medios</h2>
              </div>
              <label className="btn rounded-pill fw-bold px-3 py-1 border-0 d-inline-flex align-items-center justify-content-center gap-1 shadow btnCrearPers m-0 fp-mobile-icon-btn" style={{ fontSize: '0.8125rem', cursor: 'pointer' }}>
                <i className="bi bi-plus-circle"></i>
                <span className="fp-mobile-btn-text">Imagenes</span>
                <input type="file" accept="image/*" multiple hidden onChange={e => handleGalleryFiles(e.target.files)} />
              </label>
            </div>
            {formData.gallery.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--colorTexto)', fontSize: '0.875rem', padding: '24px 0', margin: 0, fontFamily: 'var(--texto-normal)' }}>
                Sin imagenes. Usa el boton superior para agregar.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                {formData.gallery.map((item, index) => (
                  <div key={index} className="fp-gallery-item">
                    <img src={item.preview} alt={`Galería ${index + 1}`} />
                    <button type="button" className="fp-remove" onClick={() => removeGalleryImage(index)}>X</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 8. Audios */}
          <div style={sS}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color2)', color: 'var(--color-principal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>8</span>
                <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color4)', fontFamily: 'var(--texto-normal)' }}>Audios</h2>
              </div>
              {addBtn(addAudio, 'Audio')}
            </div>
            {formData.audios.map((item, index) => (
              <div key={index} className="fp-audio-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelS}>Título</label>
                    <input type="text" className="fp-input" style={inputS} value={item.title}
                      onChange={e => handleAudiosChange(index, 'title', e.target.value)} placeholder="Nombre del audio" />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelS}>Archivo</label>
                    <input type="file" accept="audio/*" className="form-control fw-bold shadow-sm fp-file-input" style={{ color: 'var(--colorTexto)', cursor: 'pointer', fontSize: '0.85rem', padding: '6px 12px' }}
                      onChange={e => handleAudioFile(index, e.target.files?.[0] || null)} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelS}>Transcripción</label>
                    <input type="text" className="fp-input" style={inputS} value={item.transcription}
                      onChange={e => handleAudiosChange(index, 'transcription', e.target.value)} placeholder="Transcripción breve" />
                  </div>
                  <div style={{ paddingBottom: 2, flexShrink: 0 }}>{removeBtn(() => removeAudio(index))}</div>
                </div>
                {item.url && (
                  <div style={{ marginTop: 12 }}>
                    <audio controls style={{ width: '100%', accentColor: 'var(--color2)' }}>
                      <source src={item.url} />
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer flotante */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: 'var(--color-piePagina)', backdropFilter: 'blur(16px)',
            borderTop: '3px solid var(--color2)',
            padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <button type="button" onClick={() => navigate(-1)}
              className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow btnAnadirPelis fp-footer-btn"
              style={{ color: 'var(--colorTexto)', fontSize: '0.9rem', fontFamily: 'var(--texto-encabezados)' }}>
              <i className="bi bi-arrow-left"></i> Volver
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow btnCrearPers fp-mobile-icon-btn fp-footer-btn"
              style={{ fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}
            >
            <span className="fp-mobile-btn-text">
              {submitting
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar personaje'
                  : 'Crear personaje'}
            </span>

            <i className={`bi ${submitting ? 'bi-hourglass-split' : 'bi-check-circle'} fs-5`}></i>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormularioPersonaje;
