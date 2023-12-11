import supabase from "./supabase";

const TABLE_NAME = "cabins";

export async function getCabins() {
  const { data, error } = await supabase.from(TABLE_NAME).select("*");

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch cabins");
  }

  return data;
}

export async function createCabin(cabinData) {
  const fileName = buildFileName(cabinData.image.name);

  const newCabin = await insertCabin({
    ...cabinData,
    image: buildImagePath(fileName),
  });

  try {
    await uploadImage(fileName, cabinData.image);
  } catch (error) {
    deleteCabin(newCabin.id);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  return newCabin;
}

function buildFileName(imageName) {
  imageName = imageName.replaceAll("/", "");
  return `${Math.random()}-${imageName}`;
}

function buildImagePath(fileName) {
  const supabaseProject = import.meta.env.VITE_SUPABASE_PROJECT;
  const supabaseUrl = `https://${supabaseProject}.supabase.co`;
  const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
  return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${fileName}`;
}

async function insertCabin(cabin) {
  const { data: newCabin, error } = await supabase
    .from("cabins")
    .insert([cabin]);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to create cabin");
  }

  return newCabin;
}

async function uploadImage(name, image) {
  const storageBucket = import.meta.env.VITE_STORAGE_BUCKET;
  const { error } = await supabase.storage
    .from(storageBucket)
    .upload(name, image);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to upload cabin image");
  }
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete cabin");
  }

  return data;
}
