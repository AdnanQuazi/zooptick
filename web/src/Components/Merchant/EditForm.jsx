import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "../../styles/TestForm.css";
import variables from "../../styles/variables.module.scss";
import FormComponent from "./AnotherForm";
import {
  IconCamera,
  IconPlus,
  IconSquareRoundedPlusFilled,
  IconTrashFilled,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { addProductToDB, editProduct, getProductConfig } from "../../Api/api";
import FORM_CONFIG from "./FORM_CONFIG";
import get from 'lodash/get';

export default function EditForm(props) {
  const [category, setCategory] = useState(props.category || "Clothing");
  const [form, setForm] = useState(FORM_CONFIG[category]);
  const [currentValues, setCurrentValues] = useState("");

  // useEffect(() => {
  //   const fetchProductConfig = async () => {
  //     const config = await getProductConfig(category);
  //     setForm(config);
  //   };

  //   fetchProductConfig();
  // }, [category]);
  // console.log(form)
  if (!form) {
    return <div>Loading...</div>; // Or some loading state
  }
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    resetField,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {...props.defaultValues},
  });
  const { fields, remove, update } = useFieldArray({
    control,
    name: "variants",
  });
  useEffect(() => {
    if (!currentValues) {
      return setCurrentValues(getValues());
    }
    
    let data = generateCombinations([
      ...currentValues.selectedVariations.map(
        (i) => currentValues[`variation${i}`]
      ),
    ]);
    let varT = [...currentValues.variants];
    let flag = true;
    data.map((row, index) => {
      flag = true;
      let cRow = {};
      row.map((v, i) => {
        cRow[currentValues.selectedVariations[i]] = v;
      });
      currentValues.selectedVariations.map((E) => {
        form.Variations?.[E]?.map((D) => {
          cRow[D.name] = "";
        });
      });
      form.Variations?.Common?.map((D) => {
        cRow[D.name] = "";
      });
      cRow.sharedImagePath = "upload";

      // for(const [i, v] of row.entries()){
      //   flag = false
      //  const exist = varT.some(obj => obj[currentValues.selectedVariations[i]] === v);
      //  for(const [ii,vv] of varT.entries()){
      //   const exist =
      //  }
      //  console.log(i,v,exist)
      //   if(!exist){
      //     flag = false
      //     break
      //   }else{
      //     flag = true
      //   }
      // }

      const keyValuePairsArray = row.map((v, i) => {
        let obj = {};
        obj[currentValues.selectedVariations[i]] = v;
        return obj;
      });
      const keyValuePairs = keyValuePairsArray.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});
      const exists = varT.some((obj) =>
        Object.keys(keyValuePairs).every(
          (key) => obj[key] === keyValuePairs[key]
        )
      );

      if (!exists) varT.push(cRow);
    });
    setValue("variants", varT);
  }, [currentValues]);

  // true or false

  function buildFormData(formData, data, parentKey = "") {
    if (data && typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      formData.append(parentKey, data);
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    buildFormData(formData, data);
    props.editProduct(formData)
  };
  // watch input value by passing the name of it

  if (watch("hasVariation") === "No") {
    if (currentValues) setCurrentValues("");
    if (getValues("selectedVariations").length > 0)
      setValue("selectedVariations", []);
  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      {form && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          {Object.keys(form).map((keyName, index) => {
            if (Object.keys(form).length - 1 === index) {
              return generateForm(
                form[keyName],
                keyName,
                "set",
                true,
                setValue,
                update,
                getValues,
                register,
                watch,
                useFieldArray,
                control,
                currentValues,
                form,
                fields,
                remove,
                errors,
                setCurrentValues
              );
            } else {
              return generateForm(
                form[keyName],
                keyName,
                "set",
                false,
                setValue,
                update,
                getValues,
                register,
                watch,
                useFieldArray,
                control,
                currentValues,
                form,
                fields,
                remove,
                errors,
                setCurrentValues
              );
            }
          })}
        </form>
      )}
    </>
  );
}

function generateForm(
  set,
  keyName,
  type = "set",
  formEnd = false,
  setValue,
  update,
  getValues,
  register,
  watch,
  useFieldArray,
  control,
  currentValues,
  form,
  fields,
  remove,
  errors,
  setCurrentValues
) {
  let formSet = "";
  function generatePreviewImage(file) {
    const fileURL = URL.createObjectURL(file);
    return fileURL;
  }
  const handleFileChange = (index, event) => {
    const files = event.target.files;
    setFileLists((prev) => {
      const newFileLists = [...prev];
      newFileLists[index] = files;
      return newFileLists;
    });
    update(index, { ...fields[index], files: Array.from(files) });
  };

  if (keyName === "Variations") {
    return (
      <>
        {watch("hasVariation") == "Yes" && currentValues != "" && (
          <div className="variations-wrapper">
            <h1>{keyName}</h1>

            <div className="variations-table-container">
              {currentValues.hasVariation === "Yes" && fields.length > 0 && (
                <table className="variations-table">
                  <thead>
                    <tr>
                      <th></th>
                      {currentValues?.selectedVariations?.map(
                        (variation, index) => (
                          <th key={index}>{variation}</th>
                        )
                      )}
                      {currentValues?.selectedVariations?.map(
                        (variation, index) => {
                          return form.Variations[
                            variation
                          ]?.map((item, index) => (
                            <th key={index}>{item.label}</th>
                          ));
                        }
                      )}
                      {currentValues.selectedVariations.length > 0 &&
                        form.Variations.Common?.map((item, index) => (
                          <th key={index}>{item.label}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((item, index) => {
                      return (
                        <tr>
                          <td>
                            <button
                              className="delete-variant-button"
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              <IconTrashFilled
                                size={18}
                                stroke={1.4}
                                color="white"
                              ></IconTrashFilled>
                            </button>
                          </td>
                          {currentValues.selectedVariations.map(
                            (elem, innerIndex) => {
                              return (
                                <>
                                  <td>
                                    <input
                                      size={elem.length}
                                      key={item.id}
                                      {...register(`variants.${index}.${elem}`)}
                                    ></input>
                                  </td>
                                </>
                              );
                            }
                          )}
                          {currentValues.selectedVariations.map(
                            (elem, innerIndex) => {
                              return form.Variations?.[elem]?.map((f, i) => {
                                return (
                                  <td>
                                    {generateField(
                                      (f = {
                                        ...f,
                                        name: `variants.${index}.${f.name}`,
                                      }),
                                      register,
                                      watch,
                                      useFieldArray,
                                      control,
                                      item.id,
                                      errors,
                                      getValues
                                    )}
                                  </td>
                                );
                              });
                            }
                          )}
                          {currentValues.selectedVariations.length > 0 &&
                            form.Variations["Common"]?.map((f) => {
                              if (f.name === "Images") {
                                return (
                                  <>
                                    {watch(`variants.${index}.sharedImagePath`) === "upload" ? (
                                        <td>
                                          <div className="input-image-wrapper">
                                            <button className="image-selector-button">
                                              <IconUpload
                                                size={20}
                                                stroke={2}
                                                style={{
                                                  pointerEvents: "none",
                                                }}
                                              ></IconUpload>
                                              Upload Images
                                              <input
                                                type={f.type}
                                                key={item.id ? item.id : ""}
                                                {...register(
                                                  `variants.${index}.NewImages`
                                                )}
                                                multiple
                                              ></input>
                                            </button>
                                          </div>
                                        </td>
                                      ) : <td></td>}
                                  </>
                                );
                              } else {
                                return (
                                  <td>
                                    {generateField(
                                      (f = {
                                        ...f,
                                        name: `variants.${index}.${f.name}`,
                                      }),
                                      register,
                                      watch,
                                      useFieldArray,
                                      control,
                                      item.id,
                                      errors,
                                      getValues
                                    )}
                                  </td>
                                );
                              }
                            })}
                          { (
                            <td>
                              <div className="input-wrapper">
                                <select
                                  defaultValue="upload"
                                  {...register(
                                    `variants.${index}.sharedImagePath`
                                  )}
                                >
                                  <option value="upload">Upload Images</option>
                                  {fields.map((elem, index) => {
                                    let option = "";
                                    let path = "";
                                    currentValues.selectedVariations.map(
                                      (elem2) => {
                                        option += `${elem[elem2]} `;
                                      }
                                    );
                                    path = `variants.${index}.Images`;
                                    return (
                                      <option value={path}>
                                        Same as {option}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td>
                          )}
                          {watch(`variants.${index}.Images`)?.length > 0 && (
                            <>
                              {Array.from(
                                getValues(`variants.${index}.Images`)
                              ).map((e, iIndex) => {
                                return (
                                  <td>
                                    <div className="selected-image">
                                      <img src={e}></img>
                                      <button
                                        className="delete-image icon-button"
                                        onClick={() => {
                                          const filesArray = getValues(`variants.${index}.Images`);
                                          const updatedFilesArray = filesArray.filter(
                                            (file, fileIndex) =>
                                              iIndex != fileIndex
                                          );
                                          setValue(
                                            `variants.${index}.Images`,
                                            updatedFilesArray
                                          );
                                        }}
                                      >
                                        <IconX size={18} stroke={1.4}></IconX>
                                      </button>
                                    </div>
                                  </td>
                                );
                              })}
                            </>
                          )}
                          {watch(`variants.${index}.NewImages`)?.length > 0 && (
                            <>
                              {Array.from(
                                getValues(`variants.${index}.NewImages`)
                              ).map((e, iIndex) => {
                                return (
                                  <td>
                                    <div className="selected-image">
                                      <img src={generatePreviewImage(e)}></img>
                                      <button
                                        className="delete-image icon-button"
                                        onClick={() => {
                                          const filesArray = Array.from(
                                            getValues(
                                              `variants.${index}.NewImages`
                                            )
                                          );
                                          const updatedFilesArray = filesArray.filter(
                                            (file, fileIndex) =>
                                              iIndex != fileIndex
                                          );
                                          const dataTransfer = new DataTransfer();
                                          updatedFilesArray.forEach((file) =>
                                            dataTransfer.items.add(file)
                                          );
                                          const updatedFileList =
                                            dataTransfer.files;
                                          setValue(
                                            `variants.${index}.NewImages`,
                                            updatedFileList
                                          );
                                        }}
                                      >
                                        <IconX size={18} stroke={1.4}></IconX>
                                      </button>
                                    </div>
                                  </td>
                                );
                              })}
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
  if (Array.isArray(set)) {
    return (
      <div className={`${type}-container`}>
        {keyName != "" && <h1 className={type}>{keyName}</h1>}
        <div className="set-fields-container">
          {set.map((field) =>
            generateField(
              field,
              register,
              watch,
              useFieldArray,
              control,
              "",
              errors,
              getValues
            )
          )}
        </div>
        {formEnd && (
          <button type="submit" className="form-submit">
            Submit
          </button>
        )}
        {keyName === "Variation Details" && (
          <>
            {watch("hasVariation") === "Yes" && (
              <button
                className="apply-changes"
                type="button"
                onClick={() => {
                  setCurrentValues(getValues());
                }}
              >
                Apply Changes
              </button>
            )}
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="set-container">
        <h1 className={type}>{keyName}</h1>
        {Object.keys(set).map((subSet) => {
          return generateForm(
            set[subSet],
            subSet,
            "subset",
            false,
            setValue,
            register,
            watch,
            useFieldArray,
            control
          );
        })}
        {formEnd && (
          <button type="submit" className="form-submit" disabled={props.loading}>
            Submit
          </button>
        )}
      </div>
    );
  }
}

function generateCombinations(arrays) {
  console.log(arrays)
  if (arrays.length === 0 || !arrays[0]) return [[]];

  const combinations = [];
  const [firstArray, ...restArrays] = arrays;

  const restCombinations = generateCombinations(restArrays);

  firstArray.forEach((element) => {
    if (element != "") {
      restCombinations.forEach((combination) => {
        combinations.push([element, ...combination]);
      });
    }
  });

  return combinations;
}

function generateField(
  field,
  register,
  watch,
  useFieldArray,
  control,
  keyId,
  errors,
  getValues
) {
  let style = {
    borderColor: get(errors , field.name)?.message ? variables.error : "",
  };
  
  if (field.subType === "Text-Array") {
    const { fields, append, remove, prepend } = useFieldArray({
      control,
      name: field.name,
    });
    useEffect(() => {
      if (fields.length === 0) {
        append(""); // Append a default value if fields array is empty
      }
    }, [fields, append]);
    if (field.dependsOn) {
      return (
        <div className="text-array">
          {field?.dependsOn?.field &&
            (Array.isArray(watch(field.dependsOn.field)) ||
              typeof watch(field.dependsOn.field) === "string") &&
            watch(field?.dependsOn?.field)?.includes(
              field?.dependsOn?.value
            ) && (
              <>
                {field.label && (
                  <label htmlFor={field.name}>{field.label}</label>
                )}
                {fields.map((fieldItem, index) => (
                  <div className="custom-div">
                    <div className="input-prefix">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <IconTrashFilled
                            size={18}
                            stroke={1.4}
                            color="white"
                          ></IconTrashFilled>
                        </button>
                      )}
                    </div>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      key={fieldItem.id}
                      {...register(`${field.name}.${index}`)}
                    ></input>
                  </div>
                ))}
                <button
                  className="add-button"
                  type="button"
                  onClick={() => {
                    append("");
                  }}
                >
                  <IconPlus size={18} stroke={1.6} color="white"></IconPlus>
                </button>
              </>
            )}
        </div>
      );
    }
  }
  if (field.type === "text" || field.type === "number") {
    if (field.dependsOn) {
      return (
        <>
          {watch(field.dependsOn.field) === field.dependsOn.value && (
            <div className="input-wrapper">
              {!field.placeholder && (
                <label htmlFor={field.name}>{field.label}</label>
              )}
              <input
                key={keyId ? keyId : ""}
                type={field.type}
                placeholder={field.placeholder}
                step={field.step || ""}
                {...register(field.name, { ...field.schema})}
              ></input>
              <p className="input-error">{get(errors , field.name)?.message}</p>
            </div>
          )}
        </>
      );
    }
    return (
      <div className="input-wrapper">
        {!field.placeholder && (
          <label htmlFor={field.name}>{field.label}</label>
        )}
        <input
          key={keyId ? keyId : ""}
          type={field.type}
          placeholder={field.placeholder}
          style={style}
          step={field.step || ""}
          {...register(field.name, { ...field.schema })}
        ></input>
        <p className="input-error">{get(errors , field.name)?.message}</p>
      </div>
    );
  }
  if (field.type === "textarea") {
    if (field.dependsOn) {
      return (
        <>
          {watch(field.dependsOn.field) === field.dependsOn.value && (
            <div className="input-wrapper">
              {!field.placeholder && (
                <label htmlFor={field.name}>{field.label}</label>
              )}
              <textarea
                key={keyId ? keyId : ""}
                placeholder={field.placeholder}
                rows={field.rows || 4} // Assuming a default of 4 rows for textarea
                {...register(field.name, { ...field.schema })}
              ></textarea>
              <p className="input-error">{get(errors, field.name)?.message}</p>
            </div>
          )}
        </>
      );
    }
    return (
      <div className="input-wrapper">
        {!field.placeholder && (
          <label htmlFor={field.name}>{field.label}</label>
        )}
        <textarea
          key={keyId ? keyId : ""}
          placeholder={field.placeholder}
          rows={field.rows || 4} // Assuming a default of 4 rows for textarea
          style={style}
          {...register(field.name, { ...field.schema })}
        ></textarea>
        <p className="input-error">{get(errors, field.name)?.message}</p>
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div className="input-wrapper">
        {!field.placeholder && (
          <label htmlFor={field.name}>{field.label}</label>
        )}
        <select
          style={style}
          key={keyId ? keyId : ""}
          {...register(field.name, { ...field.schema })}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option, index) => {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          })}
        </select>
        <p className="input-error">{get(errors , field.name)?.message}</p>
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="input-wrapper">
        <label>{field.label}</label>
        <div className="radio-buttons-group">
          {field.options.map((option) => {
            return (
              <div className="radio-button">
                <input
                  key={keyId ? keyId : ""}
                  type={field.type}
                  {...register(field.name, { ...field.schema })}
                  value={option}
                ></input>
                <label htmlFor={field.name}>{option}</label>
              </div>
            );
          })}
        </div>
        <p className="input-error">{get(errors , field.name)?.message}</p>
      </div>
    );
  }
  if (field.type === "checkbox") {
    return (
      <>
        {watch(field.dependsOn.field) === field.dependsOn.value && (
          <div className="input-wrapper">
            {field.label && <label>{field.label}</label>}
            <div className="checkbox-buttons-group">
              {field.options.map((option) => {
                return (
                  <div className="checkbox-button">
                    <input
                      key={keyId ? keyId : ""}
                      type={field.type}
                      {...register(field.name, field.validation(getValues), {
                        ...field.schema,
                      })}
                      value={option}
                    ></input>
                    <label htmlFor={field.name}>{option}</label>
                  </div>
                );
              })}
            </div>
            <p className="input-error">{get(errors , field.name)?.message}</p>
          </div>
        )}
      </>
    );
  }
  if (field.type === "file" && field.accept === "image/*") {
    return (
      <div className="input-image-wrapper">
        <button className="image-selector-button">
          <IconUpload
            size={20}
            stroke={2}
            style={{ pointerEvents: "none" }}
          ></IconUpload>
          Upload Images
          <input
            type={field.type}
            key={keyId ? keyId : ""}
            {...register(field.name)}
            multiple
          ></input>
        </button>
      </div>
    );
  }
}
