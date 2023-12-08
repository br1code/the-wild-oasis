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

export async function deleteCabin(id) {
  const { data, error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete cabin");
  }

  return data;
}
