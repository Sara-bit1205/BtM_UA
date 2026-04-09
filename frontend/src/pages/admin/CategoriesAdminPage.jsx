/**
 * CategoriesAdminPage — Panel de gestión de categorías (admin)
 *
 * VISTAS:
 *   'list'   → Listado con acordeón
 *   'create' → Formulario crear
 *   'edit'   → Formulario editar
 *   'delete' → Multi-select borrar
 *
 * DATOS: Supabase via categoryService
 *   Grupo "Universo"                → tabla universes
 *   Grupo "Personalidad"            → tabla personality_tags
 *   Grupo "Tipo de Personalidad"    → tabla mbti_types
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import categoryService from '../../services/categoryService'
import '../../assets/styles/adminCategories.css'

// ── Configuración estática de los 3 grupos ──────────────────────────────────────
// Cada grupo mapea a una tabla real + sus campos de formulario
const GROUPS_CONFIG = [
  {
    id: 'universes',
    name: 'Universo',
    fields: [
      { key: 'name',        label: 'Nombre',      required: true  },
      { key: 'description', label: 'Descripción', required: false },
    ],
  },
  {
    id: 'personality_tags',
    name: 'Personalidad',
    fields: [
      { key: 'name',        label: 'Nombre',      required: true  },
      { key: 'description', label: 'Descripción', required: false },
    ],
  },
  {
    id: 'mbti_types',
    name: 'Tipo de Personalidad (MBTI)',
    fields: [
      { key: 'code',        label: 'Código (ej: INFJ)', required: true, maxLength: 4 },
      { key: 'title',       label: 'Título',            required: true  },
      { key: 'description', label: 'Descripción',       required: false },
    ],
  },
]

// Nombre legible para una fila de cualquier grupo
function catLabel(groupId, cat) {
  if (groupId === 'mbti_types') return `${cat.code} — ${cat.title}`
  return cat.name ?? ''
}

// Construye el array de grupos para la UI a partir de la respuesta de categoryService.getAll()
function buildGroups(data) {
  return [
    { ...GROUPS_CONFIG[0], categories: data.universes      ?? [] },
    { ...GROUPS_CONFIG[1], categories: data.personalityTags ?? [] },
    { ...GROUPS_CONFIG[2], categories: data.mbtiTypes       ?? [] },
  ]
}

// ── Subcomponente: dropdown personalizado ───────────────────────────────────────
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
      <ul role="listbox" className={`admin-cat-dropdown-list ${open ? 'open' : ''}`}>
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

// ── Subcomponente: botón de retroceso ──────────────────────────────────────────
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

// ── Vista: Listado ─────────────────────────────────────────────────────────────
function ListView({ groups, loading, error, onView }) {
  const [open, setOpen] = useState({})
  const toggle = id => setOpen(s => ({ ...s, [id]: !s[id] }))

  return (
    <div className="admin-cat-page">
      <h1 className="admin-cat-title">Listado de Categorías</h1>

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

      {loading && (
        <p style={{ opacity: 0.6, textAlign: 'center', padding: '2rem 0' }}>Cargando…</p>
      )}
      {error && (
        <p style={{ color: 'var(--color3)', textAlign: 'center', padding: '1rem 0' }}>{error}</p>
      )}

      {!loading && !error && (
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
                <span className={`admin-cat-chevron ${open[group.id] ? 'open' : ''}`}>▼</span>
              </div>
              <ul className={`admin-cat-sublist ${open[group.id] ? 'open' : ''}`}>
                <div className="admin-cat-sublist-inner">
                  {group.categories.length === 0
                    ? <li style={{ listStyle: 'none', opacity: 0.6 }}>Sin categorías</li>
                    : group.categories.map(cat => (
                        <li key={cat.id}>{catLabel(group.id, cat)}</li>
                      ))
                  }
                </div>
              </ul>
            </div>
          ))}
        </div>
      )}

      <BackBtn to="/admin" />
    </div>
  )
}

// ── Vista: Crear ───────────────────────────────────────────────────────────────
function CreateView({ onView, onDone }) {
  const [groupId, setGroupId] = useState('')
  const [fields,  setFields]  = useState({})
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState('')

  const groupConfig = GROUPS_CONFIG.find(g => g.id === groupId)

  const handleGroupChange = (id) => {
    setGroupId(id)
    setFields({})
    setErrors({})
    setSaveErr('')
  }

  const setField = (key, value) => {
    setFields(s => ({ ...s, [key]: value }))
    setErrors(s => ({ ...s, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!groupId) { next._group = 'Elige un grupo' }
    groupConfig?.fields.forEach(f => {
      if (f.required && !fields[f.key]?.trim()) {
        next[f.key] = `${f.label} es obligatorio`
      }
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSaveErr('')
    try {
      const vals = {}
      groupConfig.fields.forEach(f => {
        vals[f.key] = fields[f.key]?.trim() || null
      })
      await categoryService.create(groupId, vals)
      onDone()
    } catch (err) {
      setSaveErr(err.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Crear Categoría</h1>

        <div>
          <Dropdown
            placeholder="Elegir grupo"
            options={GROUPS_CONFIG.map(g => ({ id: g.id, name: g.name }))}
            selected={groupId}
            onSelect={handleGroupChange}
          />
          {errors._group && <p className="admin-cat-error">{errors._group}</p>}
        </div>

        {groupConfig?.fields.map(f => (
          <div key={f.key}>
            <label className="admin-cat-label" htmlFor={`create-${f.key}`}>{f.label}</label>
            <input
              id={`create-${f.key}`}
              className={`admin-cat-input ${errors[f.key] ? 'error' : ''}`}
              type="text"
              value={fields[f.key] ?? ''}
              maxLength={f.maxLength}
              onChange={e => setField(f.key, e.target.value)}
            />
            {errors[f.key] && <p className="admin-cat-error">{errors[f.key]}</p>}
          </div>
        ))}

        {saveErr && <p className="admin-cat-error">{saveErr}</p>}

        <div className="admin-cat-btn-row">
          <button
            className="admin-cat-btn-accept"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Guardando…' : 'Aceptar'}
          </button>
          <button
            className="admin-cat-btn-cancel"
            onClick={() => onView('list')}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </div>
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Vista: Editar ──────────────────────────────────────────────────────────────
function EditView({ groups, onView, onDone }) {
  const [groupId, setGroupId] = useState('')
  const [catId,   setCatId]   = useState('')
  const [fields,  setFields]  = useState({})
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState('')

  const groupConfig = GROUPS_CONFIG.find(g => g.id === groupId)
  const groupData   = groups.find(g => g.id === groupId)
  const catOptions  = groupData?.categories.map(c => ({
    id:   c.id,
    name: catLabel(groupId, c),
  })) ?? []

  const handleGroupChange = (id) => {
    setGroupId(id)
    setCatId('')
    setFields({})
    setErrors({})
    setSaveErr('')
  }

  const handleCatChange = (id) => {
    setCatId(id)
    setErrors({})
    setSaveErr('')
    const cat = groupData?.categories.find(c => c.id === id)
    if (cat && groupConfig) {
      const preloaded = {}
      groupConfig.fields.forEach(f => { preloaded[f.key] = cat[f.key] ?? '' })
      setFields(preloaded)
    }
  }

  const setField = (key, value) => {
    setFields(s => ({ ...s, [key]: value }))
    setErrors(s => ({ ...s, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    groupConfig?.fields.forEach(f => {
      if (f.required && !fields[f.key]?.trim()) {
        next[f.key] = `${f.label} es obligatorio`
      }
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!catId || !validate()) return
    setSaving(true)
    setSaveErr('')
    try {
      const vals = {}
      groupConfig.fields.forEach(f => {
        vals[f.key] = fields[f.key]?.trim() || null
      })
      await categoryService.update(groupId, catId, vals)
      onDone()
    } catch (err) {
      setSaveErr(err.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Editar Categoría</h1>

        <Dropdown
          placeholder="Elegir grupo"
          options={GROUPS_CONFIG.map(g => ({ id: g.id, name: g.name }))}
          selected={groupId}
          onSelect={handleGroupChange}
        />

        {groupId && (
          <Dropdown
            placeholder="Elegir categoría"
            options={catOptions}
            selected={catId}
            onSelect={handleCatChange}
          />
        )}

        {catId && groupConfig?.fields.map(f => (
          <div key={f.key}>
            <label className="admin-cat-label" htmlFor={`edit-${f.key}`}>{f.label}</label>
            <input
              id={`edit-${f.key}`}
              className={`admin-cat-input ${errors[f.key] ? 'error' : ''}`}
              type="text"
              value={fields[f.key] ?? ''}
              maxLength={f.maxLength}
              onChange={e => setField(f.key, e.target.value)}
            />
            {errors[f.key] && <p className="admin-cat-error">{errors[f.key]}</p>}
          </div>
        ))}

        {saveErr && <p className="admin-cat-error">{saveErr}</p>}

        <div className="admin-cat-btn-row">
          <button
            className="admin-cat-btn-accept"
            onClick={handleSubmit}
            disabled={!catId || saving}
          >
            {saving ? 'Guardando…' : 'Aceptar'}
          </button>
          <button
            className="admin-cat-btn-cancel"
            onClick={() => onView('list')}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </div>
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Vista: Borrar ──────────────────────────────────────────────────────────────
function DeleteView({ groups, onView, onDone }) {
  // key = `${groupId}:${catId}` → valor = { ...cat, _groupId }
  const [selected,  setSelected]  = useState({})
  const [treeOpen,  setTreeOpen]  = useState({})
  const [deleting,  setDeleting]  = useState(false)
  const [deleteErr, setDeleteErr] = useState('')

  const toggleTree = id => setTreeOpen(s => ({ ...s, [id]: !s[id] }))

  const toggleCat = (groupId, cat) => {
    const key = `${groupId}:${cat.id}`
    setSelected(s => {
      const next = { ...s }
      if (next[key]) delete next[key]
      else next[key] = { ...cat, _groupId: groupId }
      return next
    })
  }

  const toDelete = Object.values(selected)

  const handleDelete = async () => {
    if (toDelete.length === 0) return
    setDeleting(true)
    setDeleteErr('')
    try {
      await Promise.all(
        toDelete.map(cat => categoryService.remove(cat._groupId, cat.id))
      )
      onDone()
    } catch (err) {
      setDeleteErr(err.message ?? 'Error al borrar')
      setDeleting(false)
    }
  }

  return (
    <div className="admin-cat-page">
      <div className="admin-cat-form">
        <h1 className="admin-cat-form-title">Borrar Categoría</h1>

        <div className="admin-cat-tree">
          {groups.map(group => (
            <div key={group.id} className={`admin-cat-tree-section ${treeOpen[group.id] ? 'open' : ''}`}>
              <div
                className={`admin-cat-tree-group ${group.categories.length > 0 ? 'clickable' : ''}`}
                onClick={() => group.categories.length > 0 && toggleTree(group.id)}
                role={group.categories.length > 0 ? 'button' : undefined}
                aria-expanded={group.categories.length > 0 ? !!treeOpen[group.id] : undefined}
                tabIndex={group.categories.length > 0 ? 0 : undefined}
                onKeyDown={e => group.categories.length > 0 && e.key === 'Enter' && toggleTree(group.id)}
              >
                <span className="admin-cat-tree-group-name">{group.name}</span>
                {group.categories.length > 0
                  ? <span className={`admin-cat-chevron ${treeOpen[group.id] ? 'open' : ''}`}>▼</span>
                  : <span className="admin-cat-tree-empty-hint">Sin categorías</span>
                }
              </div>

              <ul className={`admin-cat-tree-children ${treeOpen[group.id] ? 'open' : ''}`}>
                {group.categories.map(cat => {
                  const key = `${group.id}:${cat.id}`
                  const isChecked = !!selected[key]
                  return (
                    <li key={cat.id} className="admin-cat-tree-child">
                      <input
                        type="checkbox"
                        id={`del-${key}`}
                        className="admin-cat-item-check"
                        checked={isChecked}
                        onChange={() => toggleCat(group.id, cat)}
                      />
                      <label
                        htmlFor={`del-${key}`}
                        className={`admin-cat-tree-child-name ${isChecked ? 'selected' : ''}`}
                      >
                        {catLabel(group.id, cat)}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {toDelete.length > 0 && (
          <div className="admin-cat-confirm-box">
            <p>¿Estás seguro de que deseas borrar lo siguiente?</p>
            <ul>
              {toDelete.map(c => (
                <li key={`${c._groupId}:${c.id}`}>
                  {catLabel(c._groupId, c)}
                  {' — '}
                  {GROUPS_CONFIG.find(g => g.id === c._groupId)?.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {deleteErr && <p className="admin-cat-error">{deleteErr}</p>}

        <div className="admin-cat-btn-row">
          <button
            className="admin-cat-btn-accept"
            onClick={handleDelete}
            disabled={toDelete.length === 0 || deleting}
          >
            {deleting ? 'Borrando…' : 'Aceptar'}
          </button>
          <button
            className="admin-cat-btn-cancel"
            onClick={() => onView('list')}
            disabled={deleting}
          >
            Cancelar
          </button>
        </div>
      </div>
      <BackBtn onClick={() => onView('list')} />
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
function CategoriesAdminPage() {
  const [view,    setView]    = useState('list')
  const [groups,  setGroups]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const loadGroups = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await categoryService.getAll()
      setGroups(buildGroups(data))
    } catch (err) {
      setError(err.message ?? 'Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadGroups() }, [loadGroups])

  // Tras cualquier mutación: recarga datos y vuelve al listado
  const done = useCallback(() => {
    loadGroups()
    setView('list')
  }, [loadGroups])

  return (
    <>
      {view === 'list'   && <ListView   groups={groups} loading={loading} error={error} onView={setView} />}
      {view === 'create' && <CreateView onView={setView} onDone={done} />}
      {view === 'edit'   && <EditView   groups={groups} onView={setView} onDone={done} />}
      {view === 'delete' && <DeleteView groups={groups} onView={setView} onDone={done} />}
    </>
  )
}

export default CategoriesAdminPage
