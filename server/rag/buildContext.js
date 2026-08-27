export function buildContext(weather, retrievedDocs) {
   return {
    city: weather.city,
    current: weather.current,
    forecast: weather.forecast?.slice(0, 3) ?? [],
    knowledge: retrievedDocs,
   }
}