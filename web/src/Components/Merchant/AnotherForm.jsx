import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const FormComponent = () => {
  const { register, handleSubmit, control } = useForm();
  const [combinations, setCombinations] = useState([]);

  const { fields: sizeFields, append: appendSize } = useFieldArray({
    control,
    name: "sizes",
  });
  const { fields: colorFields, append: appendColor } = useFieldArray({
    control,
    name: "colors",
  });
  const { fields: materialFields, append: appendMaterial } = useFieldArray({
    control,
    name: "materials",
  });
  const { fields: combinationFields, append: appendCombination, remove: removeCombination } = useFieldArray({
    control,
    name: "combinations",
  });

  const generateCombinations = (sizes, colors, materials) => {
    const combos = [];
    sizes.forEach((size) => {
      colors.forEach((color) => {
        materials.forEach((material) => {
          combos.push({ size: size.value, color: color.value, material: material.value });
        });
      });
    });
    return combos;
  };

  const onSubmit = (data) => {
    const { sizes, colors, materials } = data;
    const newCombinations = generateCombinations(sizes, colors, materials);
    setCombinations(newCombinations);
    // Append the new combinations to the field array
    newCombinations.forEach((combo) => {
      appendCombination(combo);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Sizes</h3>
      {sizeFields.map((field, index) => (
        <input
          key={field.id}
          {...register(`sizes.${index}.value`)}
          placeholder="Size"
        />
      ))}
      <button type="button" onClick={() => appendSize({ value: "" })}>
        Add Size
      </button>

      <h3>Colors</h3>
      {colorFields.map((field, index) => (
        <input
          key={field.id}
          {...register(`colors.${index}.value`)}
          placeholder="Color"
        />
      ))}
      <button type="button" onClick={() => appendColor({ value: "" })}>
        Add Color
      </button>

      <h3>Materials</h3>
      {materialFields.map((field, index) => (
        <input
          key={field.id}
          {...register(`materials.${index}.value`)}
          placeholder="Material"
        />
      ))}
      <button type="button" onClick={() => appendMaterial({ value: "" })}>
        Add Material
      </button>

      <button type="submit">Generate Combinations</button>

      <h3>Combinations</h3>
      {combinationFields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`combinations.${index}.size`)}
            placeholder="Size"
            defaultValue={field.size}
          />
          <input
            {...register(`combinations.${index}.color`)}
            placeholder="Color"
            defaultValue={field.color}
          />
          <input
            {...register(`combinations.${index}.material`)}
            placeholder="Material"
            defaultValue={field.material}
          />
          <button type="button" onClick={() => removeCombination(index)}>
            Delete
          </button>
        </div>
      ))}
    </form>
  );
};

export default FormComponent;
