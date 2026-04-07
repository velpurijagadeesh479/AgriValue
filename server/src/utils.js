export const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const formatProduct = (row) => ({
  id: row.id,
  farmerId: row.farmer_id,
  name: row.name,
  category: row.category,
  description: row.description,
  price: Number(row.price),
  quantity: Number(row.quantity),
  unit: row.unit,
  location: row.location,
  imageUrls: parseJsonArray(row.image_urls),
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  farmer: row.farmer_name
    ? {
        id: row.farmer_id,
        name: row.farmer_name,
        businessName: row.farmer_business_name,
        location: row.farmer_location,
      }
    : undefined,
});
