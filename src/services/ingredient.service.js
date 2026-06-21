import { imageLoader } from '../middleware/image.middleware'

// ------- For admin and database maintainer 

/**
 * bundle correct image url with ingredient rows and 
 * @param {string} filePath - Path inside the bucket, e.g. "rice.jpg"
 * @returns {string} Public URL
 */
function associateIngredientImage(ingredientName, imageUrl ) {
  // call getImageUrl by sending ingredient name to supabase
}

function upload_image(params) {
  
}