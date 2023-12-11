import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { createCabin } from "../../services/apiCabins";

const CABIN_CREATED_MESSAGE = "New cabin successfully created";
const REQUIRED_FIELD_MESSAGE = "This field is required";
const INVALID_CAPACITY_MESSAGE = "Capacity should be at least 1";
const INVALID_PRICE_MESSAGE = "Price should be at least 1";
const INVALID_DISCOUNT_MESSAGE = "Discount should be less than Regular price";

function CreateCabinForm() {
  const queryClient = useQueryClient();

  const {
    register: registerInput,
    handleSubmit,
    reset: resetForm,
    getValues,
    formState: { errors },
  } = useForm();

  const { mutate: createCabinMutation, isLoading: isCreatingCabin } =
    useMutation({
      mutationFn: createCabin,
      onSuccess: () => {
        toast.success(CABIN_CREATED_MESSAGE);
        queryClient.invalidateQueries({ queryKey: ["cabins"] });
        resetForm();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  function onSubmit(data) {
    const newCabin = { ...data, image: data.image[0] };
    createCabinMutation(newCabin);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isCreatingCabin}
          {...registerInput("name", {
            required: REQUIRED_FIELD_MESSAGE,
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreatingCabin}
          {...registerInput("maxCapacity", {
            required: REQUIRED_FIELD_MESSAGE,
            min: {
              value: 1,
              message: INVALID_CAPACITY_MESSAGE,
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreatingCabin}
          {...registerInput("regularPrice", {
            required: REQUIRED_FIELD_MESSAGE,
            min: {
              value: 1,
              message: INVALID_PRICE_MESSAGE,
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isCreatingCabin}
          {...registerInput("discount", {
            required: REQUIRED_FIELD_MESSAGE,
            validate: (value) => {
              const regularPrice = getValues("regularPrice");
              const isValidDiscount = Number(value) <= Number(regularPrice);
              return isValidDiscount || INVALID_DISCOUNT_MESSAGE;
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isCreatingCabin}
          {...registerInput("description", {
            required: REQUIRED_FIELD_MESSAGE,
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isCreatingCabin}
          {...registerInput("image", {
            required: REQUIRED_FIELD_MESSAGE,
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isCreatingCabin}>
          Cancel
        </Button>
        <Button>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
