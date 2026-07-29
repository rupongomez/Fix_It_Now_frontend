export const getServices = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/services`)

  const result = await res.json()
  return result
}
