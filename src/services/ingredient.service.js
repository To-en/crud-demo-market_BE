import { getImageUrl, uploadImage } from '../middleware/image.middleware.js';
import model from '../models/index.js';

// Bundle correct image_url onto an ingredient row by ingredient name
// Naming convention: image file in bucket must match ingredient name (e.g. "หมูกรอบ.jpg")
export async function associateIngredientImage(ingredientName, extension = 'jpg') {
  const filePath = `${ingredientName}.${extension}`;
  const publicUrl = getImageUrl(filePath);

  await model.Ingre.update(
    { imageUrl: publicUrl },
    { where: { name: ingredientName } }
  );

  return publicUrl;
}

// Upload image file to Supabase bucket, then associate URL to ingredient row
// filePath: destination name in bucket e.g. "หมูกรอบ.jpg"
// buffer: file Buffer (from multer or fs.readFile)
// mimeType: e.g. "image/jpeg"
export async function uploadAndAssociateImage(ingredientName, filePath, buffer, mimeType) {
  const publicUrl = await uploadImage(filePath, buffer, mimeType);

  await model.Ingre.update(
    { imageUrl: publicUrl },
    { where: { name: ingredientName } }
  );

  return publicUrl;
}
