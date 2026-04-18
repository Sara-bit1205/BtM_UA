export function getRelationValue(relation, field) {
  if (Array.isArray(relation)) {
    return relation[0]?.[field]
  }
  return relation?.[field]
}