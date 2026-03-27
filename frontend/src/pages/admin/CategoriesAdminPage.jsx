/**
 * CategoriesAdminPage — Panel de gestión de categorías (admin)
 *
 * VISTAS disponibles (controladas por `view`):
 *   'list'   → Listado de categorías con acordeón de subcategorías
 *   'create' → Formulario para crear una nueva categoría
 *   'edit'   → Formulario para editar una categoría existente
 *   'delete' → Selector múltiple + confirmación para borrar categorías
 *
 * DATOS: todos locales (prototipo). Las llamadas reales a la API
 * están escritas pero comentadas justo al lado de la lógica que sustituyen.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/styles/adminCategories.css'

// ── Datos de prototipo ──────────────────────────────────────────────────────
// En producción estos datos vendrían de:
//   GET /api/categories  →  [{ id, group, name, characters: [] }]
const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Universo',
    categories: [
      { id: 'c1', name: 'Marvel',     characters: [] },
      { id: 'c2', name: 'Disney',     characters: [] },
      { id: 'c3', name: 'DC',         characters: [] },
      { id: 'c4', name: 'DreamWorks', characters: [] },
    ],
  },
  {
    id: 'g2',
    name: 'Personalidad',
    categories: [
      { id: 'c5', name: 'Introvertido', characters: [] },
      { id: 'c6', name: 'Emocional',    characters: [] },
      { id: 'c7', name: 'Líder',        characters: [] },
      { id: 'c8', name: 'Caótico',      characters: [] },
    ],
  },
  {
    id: 'g3',
    name: 'Tipo de Personalidad (MBTI)',
    categories: [],
  },
]

const MOCK_CHARS = [
  { id: 'ch1', name: 'Riley',    img: 'https://placehold.co/70x70/1a1a2e/cff199?text=R', categoryId: 'c2' }, // Disney
  { id: 'ch2', name: 'Luffy',    img: 'https://placehold.co/70x70/1a1a2e/cff199?text=L', categoryId: null  }, // Anime
  { id: 'ch3', name: 'Shrek',    img: 'https://placehold.co/70x70/1a1a2e/cff199?text=S', categoryId: 'c4' }, // DreamWorks
  { id: 'ch4', name: 'Harry',    img: 'https://placehold.co/70x70/1a1a2e/cff199?text=H', categoryId: null  }, // HP
  { id: 'ch5', name: 'Batman',   img: 'https://placehold.co/70x70/1a1a2e/cff199?text=B', categoryId: 'c3' }, // DC
  { id: 'ch6', name: 'Maléfica', img: 'https://placehold.co/70x70/1a1a2e/cff199?text=M', categoryId: 'c2' }, // Disney
]
// ───────────────────────────────────────────────────────────────────────────

// ── Subcomponente: dropdown personalizado ──────────────────────────────────
function Dropdown({ placeholder, options, selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const label = selected ? options.find(o => o.id === selected)?.name : placeholder
  return (
    <div className="admin-cat-dropdown-wrap">
      <button
        type="button"
        className={`admin-cat-dropdown-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
        <span className="chevron">▼</span>
      </button>
      <ul
        role="listbox"
        className={`admin-cat-dropdown-list ${open ? 'open' : ''}`}
      >
        {options.map(opt => (
          <li
            key={opt.id}
            role="option"
            aria-selected={selected === opt.id}
            className={`admin-cat-dropdown-item ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => { onSelect(opt.id); setOpen(false) }}
          >
            {opt.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Subcomponente: botón de retroceso ──────────────────────────────────────
// Renderiza un <Link> hacia una ruta o un <button> para cambio de vista interna.
function BackBtn({ onClick, to }) {
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
  if (to) return <Link to={to} className="admin-cat-back-btn" aria-label="Volver">{icon}</Link>
  return (
    <button type="button" className="admin-cat-back-btn" onClick={onClick} aria-label="Volver">
      {icon}
    </button>
  )
}

// ── Subcomponente: modal de selección de personajes ──────────────────────────
function CharPickerModal({ chars, selected, onConfirm, onClose }) {
  const [localSelected, setLocalSelected] = useState(selected)

  const toggle = char =>
    setLocalSelected(prev =>
      prev.find(c => c.id === char.id)
        ? prev.filter(c => c.id !== char.id)
        : [...prev, char]
    )

  return (
    <div className="admin-char-modal-overlay" onClick={onClose}>
      <div className="admin-char-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-char-modal-header">
          <h2 className="admin-char-modal-title">Seleccionar Personajes</h2>
          <button className="admin-char-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {chars.length === 0 ? (
          <p className="admin-char-modal-empty">No hay personajes disponibles para esta categoría.</p>
        ) : (
          <div className="admin-char-modal-grid">
            {chars.map(ch => {
              const sel = !!localSelected.find(c => c.id === ch.id)
              return (
                <div
                  key={ch.id}
                  className={`admin-char-modal-item ${sel ? 'selected' : ''}`}
                  onClick={() => toggle(ch)}
                  role="checkbox"
                  aria-checked={sel}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggle(ch)}
                >
                  <img src={ch.img} alt={ch.name} className="admin-char-modal-img" />
                  <span className="admin-char-modal-name">{ch.name}</span>
                  {sel && <div className="admin-char-modal-check">✓</div>}
                </div>
              )
            })}
          </div>
        )}

        <div className="admin-cat-btn-row" style={{ marginTop: '1rem' }}>
          <button
            className="admin-cat-btn-accept"
            onClick={() => { onConfirm(localSelected); onClose() }}
          >
            Confirmar ({localSelected.length})
          </button>
          <button className="admin-cat-btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ── Vista: Listado ─────────────────────────────────────────────────────────
function ListView({ groups, onView }) {
  const [open, setOpen] = useState({})   // { groupId: bool }

  const toggle = id => setOpen(s => ({ ...s, [id]: !s[id] }))

  return (
    <div className="admin-cat-page">
      <h1 className="admin-cat-title">Listado de Categorías</h1>

      {/* Acciones principales */}
      <div className="admin-cat-actions" role="toolbar" aria-label="Acciones de categorías">
        <button
          className="admin-cat-action-btn"
          title="Crear categoría"
          onClick={() => onView('create')}
          aria-label="Crear nueva categoría"
        >
          ＋
        </button>
        <button
          className="admin-cat-action-btn"
          title="Editar categoría"
          onClick={() => onView('edit')}
          aria-label="Editar categoría"
        >
          ✎
        </button>
        <button
          className="admin-cat-action-btn danger"
          title="Borrar categoría"
          onClick={() => onView('delete')}
          aria-label="Borrar categoría"
        >
          🗑
        </button>
      </div>

      {/* Lista de grupos con acordeón */}
      <div className="d-flex flex-column gap-2">
        {groups.map(group => (
          <div key={group.id} className={`admin-cat-item ${open[group.id] ? 'open' : ''}`}>
            <div
              className="admin-cat-item-header"
              onClick={() => toggle(group.id)}
              role="button"
              aria-expanded={!!open[group.id]}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggle(group.id)}
            >
              <h2 className="admin-cat-item-name">{group.name}</h2>
              {/* Chevron animado por CSS — rota 180° cuando open */}
              <span className={`admin-cat-chevron ${open[group.id] ? 'open' : ''}`}>▼</span>
            </div>

            {/* Subcategorías — wrapper interno separa el estilo de la animación de altura */}
            <ul className={`admin-cat-sublist ${open[group.id] ? 'open' : ''}`}>
              <div className="admin-cat-sublist-inner">
                {group.categories.length === 0
                  ? <li style={{ listStyle: 'none', opacity: 0.6 }}>Sin categorías</li>
                  : group.categories.map(cat => (
                      <li key={cat.id}>{cat.name}</li>
                    ))
                }
              </div>
            </ul>
          </div>
        ))}
      </div>
      <BackBtn to="/admin" />
    </div>
  )
}

// ── Vista: Crear ───────────────────────────────────────────────────────────
function CreateView({ groups, onView, onSave }) {
  const [groupId,       setGroupId]       = useState('')
  const [name,          setName]          = useState('')
  const [nameError,     setNameError]     = useState('')
  const [groupError,    setGroupError]    = useState('')
  const [selectedChars, setSelectedChars] = useState([])
  const [charModalOpen, setCharModalOpen] = useState(false)

  const toggleChar = char => {
    setSelectedChars(prev =>
      prev.find(c => c.id === char.id)
        ? prev.filter(c => c.id !== char.id)
        : [...prev, char]
    )
  }

  const validate = () => {
    let valid = true
    if (!groupId) { setGroupError('Elige un grupo'); valid = false } else setGroupError('')
    if (!name.trim()) { setNameError('El nombre es obligatorio'); valid = false } else setNameError('')
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    // ── Integración real (comentada) ─────────────────────────────────────
    // const payload = {
    //   groupId,
    //   name: name.trim(),
    //   characters: selectedChars.map(c => c.id),
    // }
    // try {
    //   // POST /api/categories
    //   const res = await categoryService.create(payload)
    //   // Redirigir al listado tras crear
    //   onSave(res.data)
    // } catch (err) {
    //   console.error('Error al crear categoría:', err)
    // }
    // ─────────────────────────────────────────────────────────────────────

    // Prototipo: simular guardado y volver al listado
    alert(`✅ Categoría "${name}" creada en el grupo seleccionado (prototipo)`)
    onView('list')
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Crear Categoría</h1>

        {/* Selector de grupo */}
        <div>
          <Dropdown
            placeholder="Elegir grupo"
            options={groups.map(g => ({ id: g.id, name: g.name }))}
            selected={groupId}
            onSelect={id => { setGroupId(id); setGroupError('') }}
          />
          {groupError && <p className="admin-cat-error">{groupError}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="admin-cat-label" htmlFor="cat-name-create">Nombre</label>
          <input
            id="cat-name-create"
            className={`admin-cat-input ${nameError ? 'error' : ''}`}
            type="text"
            value={name}
            placeholder="Ej: Warner"
            onChange={e => { setName(e.target.value); setNameError('') }}
          />
          {nameError && <p className="admin-cat-error">{nameError}</p>}
        </div>

        {/* Añadir personajes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="admin-cat-chars-btn"
            type="button"
            onClick={() => setCharModalOpen(true)}
          >
            Añadir Personajes 🔍
          </button>

          {/* Grid: solo visible cuando hay personajes seleccionados */}
          {selectedChars.length > 0 && (
            <div className="admin-cat-chars-grid">
              {selectedChars.map(ch => (
                <div key={ch.id} className="admin-cat-char-thumb">
                  <img src={ch.img} alt={ch.name} />
                  <button
                    className="admin-cat-char-remove"
                    onClick={() => toggleChar(ch)}
                    aria-label={`Quitar ${ch.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-cat-btn-row">
          <button className="admin-cat-btn-accept" onClick={handleSubmit}>Aceptar</button>
          <button className="admin-cat-btn-cancel" onClick={() => onView('list')}>Cancelar</button>
        </div>
      </div>

      {charModalOpen && (
        <CharPickerModal
          chars={MOCK_CHARS}
          selected={selectedChars}
          onConfirm={setSelectedChars}
          onClose={() => setCharModalOpen(false)}
        />
      )}
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Vista: Editar ──────────────────────────────────────────────────────────
function EditView({ groups, onView }) {
  const [groupId,       setGroupId]       = useState('')
  const [categoryId,    setCategoryId]    = useState('')
  const [name,          setName]          = useState('')
  const [nameError,     setNameError]     = useState('')
  const [selectedChars, setSelectedChars] = useState([])
  const [charModalOpen, setCharModalOpen] = useState(false)

  // Opciones de categoría según el grupo elegido
  const catOptions = groupId
    ? (groups.find(g => g.id === groupId)?.categories ?? [])
    : []

  // Personajes disponibles en el modal: filtrados por categoría seleccionada (prototipo)
  const availableChars = categoryId
    ? MOCK_CHARS.filter(c => !c.categoryId || c.categoryId === categoryId)
    : MOCK_CHARS

  // Al seleccionar categoría, precargar su nombre
  const handleSelectCat = id => {
    setCategoryId(id)
    const cat = catOptions.find(c => c.id === id)
    setName(cat?.name ?? '')
    setNameError('')
    // Precarga de personajes — integración real (comentada):
    // const res = await categoryService.getById(id)
    // setSelectedChars(res.data.characters)
    setSelectedChars(MOCK_CHARS.slice(0, 2)) // prototipo: precarga 2 personajes
  }

  const toggleChar = char => {
    setSelectedChars(prev =>
      prev.find(c => c.id === char.id)
        ? prev.filter(c => c.id !== char.id)
        : [...prev, char]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) { setNameError('El nombre es obligatorio'); return }

    // ── Integración real (comentada) ─────────────────────────────────────
    // const payload = {
    //   groupId,
    //   name: name.trim(),
    //   characters: selectedChars.map(c => c.id),
    // }
    // try {
    //   // PUT /api/categories/:id
    //   await categoryService.update(categoryId, payload)
    //   onView('list')
    // } catch (err) {
    //   console.error('Error al actualizar categoría:', err)
    // }
    // ─────────────────────────────────────────────────────────────────────

    alert(`✅ Categoría actualizada a "${name}" (prototipo)`)
    onView('list')
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Editar Categoría</h1>

        {/* Selector de grupo */}
        <Dropdown
          placeholder="Elegir grupo"
          options={groups.map(g => ({ id: g.id, name: g.name }))}
          selected={groupId}
          onSelect={id => { setGroupId(id); setCategoryId(''); setName('') }}
        />

        {/* Selector de categoría */}
        {groupId && (
          <Dropdown
            placeholder="Elegir categoría"
            options={catOptions.map(c => ({ id: c.id, name: c.name }))}
            selected={categoryId}
            onSelect={handleSelectCat}
          />
        )}

        {/* Nombre editable */}
        {categoryId && (
          <>
            <div>
              <label className="admin-cat-label" htmlFor="cat-name-edit">Cambiar el nombre</label>
              <input
                id="cat-name-edit"
                className={`admin-cat-input ${nameError ? 'error' : ''}`}
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setNameError('') }}
              />
              {nameError && <p className="admin-cat-error">{nameError}</p>}
            </div>

            {/* Personajes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <button
                className="admin-cat-chars-btn"
                type="button"
                onClick={() => setCharModalOpen(true)}
              >
                Añadir Personajes 🔍
              </button>

              {/* Grid: solo visible cuando hay personajes seleccionados */}
              {selectedChars.length > 0 && (
                <div className="admin-cat-chars-grid">
                  {selectedChars.map(ch => (
                    <div key={ch.id} className="admin-cat-char-thumb">
                      <img src={ch.img} alt={ch.name} />
                      <button
                        className="admin-cat-char-remove"
                        onClick={() => toggleChar(ch)}
                        aria-label={`Quitar ${ch.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="admin-cat-btn-row">
          <button
            className="admin-cat-btn-accept"
            onClick={handleSubmit}
            disabled={!categoryId}
          >
            Aceptar
          </button>
          <button className="admin-cat-btn-cancel" onClick={() => onView('list')}>Cancelar</button>
        </div>
      </div>

      {charModalOpen && (
        <CharPickerModal
          chars={availableChars}
          selected={selectedChars}
          onConfirm={setSelectedChars}
          onClose={() => setCharModalOpen(false)}
        />
      )}
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Vista: Borrar ──────────────────────────────────────────────────────────
function DeleteView({ groups, onView }) {
  // { catId: bool } — tracking de qué categorías están seleccionadas
  const [selected,      setSelected]      = useState({})
  const [treeOpen,      setTreeOpen]      = useState({})   // { groupId: bool }

  const toggleTree = id => setTreeOpen(s => ({ ...s, [id]: !s[id] }))
  const toggleCat  = id => setSelected(s => ({ ...s, [id]: !s[id] }))

  // Categorías marcadas (para mostrar confirmación)
  const toDelete = groups
    .flatMap(g => g.categories)
    .filter(c => selected[c.id])

  const handleDelete = () => {
    if (toDelete.length === 0) return

    // ── Integración real (comentada) ─────────────────────────────────────
    // try {
    //   await Promise.all(
    //     toDelete.map(cat =>
    //       // DELETE /api/categories/:id
    //       categoryService.delete(cat.id)
    //     )
    //   )
    //   onView('list')
    // } catch (err) {
    //   console.error('Error al borrar categorías:', err)
    // }
    // ─────────────────────────────────────────────────────────────────────

    const names = toDelete.map(c => c.name).join(', ')
    alert(`🗑 Categorías eliminadas: ${names} (prototipo)`)
    onView('list')
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Borrar Categoría</h1>

        {/* Árbol de selección siempre visible — sin dropdown externo para mayor claridad */}
        <div className="admin-cat-tree">
          {groups.map(group => (
            <div key={group.id} className={`admin-cat-tree-section ${treeOpen[group.id] ? 'open' : ''}`}>
              {/* Cabecera del grupo: clic sobre toda la fila para expandir/colapsar */}
              <div
                className={`admin-cat-tree-group ${group.categories.length > 0 ? 'clickable' : ''}`}
                onClick={() => group.categories.length > 0 && toggleTree(group.id)}
                role={group.categories.length > 0 ? 'button' : undefined}
                aria-expanded={group.categories.length > 0 ? !!treeOpen[group.id] : undefined}
                tabIndex={group.categories.length > 0 ? 0 : undefined}
                onKeyDown={e => group.categories.length > 0 && e.key === 'Enter' && toggleTree(group.id)}
              >
                <span className="admin-cat-tree-group-name">{group.name}</span>
                {group.categories.length > 0 ? (
                  <span className={`admin-cat-chevron ${treeOpen[group.id] ? 'open' : ''}`}>▼</span>
                ) : (
                  <span className="admin-cat-tree-empty-hint">Sin categorías</span>
                )}
              </div>

              {/* Categorías hijas con checkboxes */}
              <ul className={`admin-cat-tree-children ${treeOpen[group.id] ? 'open' : ''}`}>
                {group.categories.map(cat => (
                  <li key={cat.id} className="admin-cat-tree-child">
                    <input
                      type="checkbox"
                      id={`del-${cat.id}`}
                      className="admin-cat-item-check"
                      checked={!!selected[cat.id]}
                      onChange={() => toggleCat(cat.id)}
                    />
                    <label
                      htmlFor={`del-${cat.id}`}
                      className={`admin-cat-tree-child-name ${selected[cat.id] ? 'selected' : ''}`}
                    >
                      {cat.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Confirmación */}
        {toDelete.length > 0 && (
          <div className="admin-cat-confirm-box">
            <p>¿Estás seguro de que deseas borrar lo siguiente?</p>
            <ul>
              {toDelete.map(c => (
                <li key={c.id}>{c.name} (Categoría)</li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-cat-btn-row">
          <button
            className="admin-cat-btn-accept"
            onClick={handleDelete}
            disabled={toDelete.length === 0}
          >
            Aceptar
          </button>
          <button className="admin-cat-btn-cancel" onClick={() => onView('list')}>Cancelar</button>
        </div>
      </div>
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function CategoriesAdminPage() {
  // Estado de navegación interna entre vistas
  const [view,   setView]   = useState('list')
  // Estado local de grupos (en producción vendría del backend)
  const [groups, setGroups] = useState(MOCK_GROUPS)

  // Callback tras crear — añade la categoría localmente (prototipo)
  const handleSave = newCat => {
    // En producción: recargar grupos con GET /api/categories
    setGroups(prev => prev.map(g =>
      g.id === newCat.groupId
        ? { ...g, categories: [...g.categories, newCat] }
        : g
    ))
    setView('list')
  }

  return (
    <>
      {view === 'list'   && <ListView   groups={groups} onView={setView} />}
      {view === 'create' && <CreateView groups={groups} onView={setView} onSave={handleSave} />}
      {view === 'edit'   && <EditView   groups={groups} onView={setView} />}
      {view === 'delete' && <DeleteView groups={groups} onView={setView} />}
    </>
  )
}

export default CategoriesAdminPage

