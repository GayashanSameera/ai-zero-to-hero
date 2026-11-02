// Each lab is src/labs/<lab-id>.jsx with a default-exported component.
const modules = import.meta.glob('./*.jsx', { eager: true })

export const labs = Object.fromEntries(
  Object.entries(modules).map(([path, m]) => [path.slice(2, -4), m.default])
)
